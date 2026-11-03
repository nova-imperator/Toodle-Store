import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { verifyWebhookSignature } from "@/server/integrations/razorpay";
import { markPaymentCaptured, markPaymentFailed } from "@/server/services/order";

interface WebhookEvent {
  event: string;
  payload: {
    payment?: { entity: { id: string; order_id: string; method?: string } };
    refund?: { entity: { id: string; payment_id: string; amount: number; status: string } };
  };
}

/** Razorpay webhooks keep orders correct even if the shopper closes the browser mid-payment. */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature)) return NextResponse.json({ error: "invalid signature" }, { status: 400 });

  const event = JSON.parse(raw) as WebhookEvent;
  try {
    const payment = event.payload.payment?.entity;
    if (event.event === "payment.captured" && payment) {
      await markPaymentCaptured(payment.order_id, { paymentId: payment.id, method: payment.method, raw: event });
    } else if (event.event === "payment.failed" && payment) {
      await markPaymentFailed(payment.order_id, event);
    } else if (event.event === "refund.processed" && event.payload.refund) {
      const r = event.payload.refund.entity;
      const pay = await db.payment.findFirst({ where: { razorpayPaymentId: r.payment_id } });
      if (pay) {
        await db.$transaction([
          db.refund.upsert({
            where: { razorpayRefundId: r.id },
            update: { status: r.status },
            create: { orderId: pay.orderId, paymentId: pay.id, razorpayRefundId: r.id, amount: r.amount, status: r.status },
          }),
          db.order.update({ where: { id: pay.orderId }, data: { paymentStatus: "refunded" } }),
        ]);
      }
    }
  } catch (e) {
    console.error("Webhook handling failed", event.event, e);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
