import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { getOrderForUser, type OrderAddress } from "@/server/services/order";
import { StatusTimeline } from "@/components/order/StatusTimeline";
import { ButtonLink } from "@/components/ui/Button";
import { formatPaise } from "@/lib/money";
import { SITE } from "@/config/site";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Your order", robots: { index: false } };

type Props = { params: Promise<{ orderNumber: string }> };

export default async function OrderPage({ params }: Props) {
  const { orderNumber } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/order/${orderNumber}`);
  const order = await getOrderForUser(orderNumber, user.id);
  if (!order) notFound();

  const address = order.address as unknown as OrderAddress;
  // Old-style COD enquiries (before 13 Nov 2026), confirmed by phone. New COD orders are normal orders.
  const isCod = order.status === "cod_enquiry";
  const pending = order.status === "pending_payment";
  const cashDue = order.paymentMethod === "cod" && order.codFee > 0 ? order.total - order.codFee : 0;

  return (
    <div className={`container ${styles.wrap}`}>
      <section className={styles.hero} data-state={isCod ? "cod" : pending ? "pending" : order.status === "cancelled" ? "cancelled" : "ok"}>
        <Image src="/images/brand/mascot-delivery.webp" alt="" width={376} height={520} className={styles.mascot} priority />
        <div>
          {isCod ? (
            <>
              <h1>Thank you, we&apos;ll get back to you shortly</h1>
              <p>We&apos;ve received your cash on delivery request. Our team will call {order.phone} to confirm it before we ship.</p>
            </>
          ) : pending ? (
            <>
              <h1>Payment not completed</h1>
              <p>This order is waiting for payment. Your cart is saved, so you can go back to checkout and try again.</p>
              <ButtonLink href="/checkout">Back to checkout</ButtonLink>
            </>
          ) : order.status === "cancelled" ? (
            <>
              <h1>This order was cancelled</h1>
              <p>If you have questions, WhatsApp us on {SITE.phone}.</p>
            </>
          ) : (
            <>
              <h1>Yay! Your order is confirmed</h1>
              <p>A confirmation has been sent to {order.email}. We&apos;ll let you know when it ships.</p>
              {cashDue > 0 && order.paymentStatus !== "paid" && (
                <p>
                  <strong>Cash on delivery:</strong> please keep {formatPaise(cashDue)} ready to pay when your order arrives.
                </p>
              )}
            </>
          )}
          <p className={styles.number}>Order {order.orderNumber}</p>
        </div>
      </section>

      {!isCod && !pending && order.status !== "cancelled" && (
        <section className={styles.card} aria-label="Order status">
          <StatusTimeline status={order.status} trackingUrl={order.shipment?.trackingUrl} />
        </section>
      )}

      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="items-h">
          <h2 id="items-h">Items</h2>
          <ul className={styles.items}>
            {order.items.map((i) => (
              <li key={i.id}>
                {i.image && <Image src={i.image} alt="" width={64} height={64} className={styles.thumb} />}
                <span>
                  {i.name}
                  <small> × {i.qty}</small>
                </span>
                <strong>{formatPaise(i.unitPrice * i.qty)}</strong>
              </li>
            ))}
          </ul>
          <dl className={styles.totals}>
            <div><dt>Items</dt><dd>{formatPaise(order.subtotal)}</dd></div>
            {order.discount > 0 && <div><dt>Coupon {order.couponCode}</dt><dd>−{formatPaise(order.discount)}</dd></div>}
            <div><dt>Delivery</dt><dd>{order.shipping ? formatPaise(order.shipping) : "Free"}</dd></div>
            {order.codFee > 0 && <div><dt>Cash on delivery charge</dt><dd>{formatPaise(order.codFee)}</dd></div>}
            <div><dt>GST</dt><dd>–</dd></div>
            <div className={styles.total}><dt>{isCod ? "To pay on delivery" : "Total"}</dt><dd>{formatPaise(order.total)}</dd></div>
            {cashDue > 0 && (
              <>
                <div><dt>Paid online</dt><dd>{formatPaise(order.codFee)}</dd></div>
                <div className={styles.total}><dt>{order.paymentStatus === "paid" ? "Paid in cash" : "Pay in cash on delivery"}</dt><dd>{formatPaise(cashDue)}</dd></div>
              </>
            )}
          </dl>
        </section>

        <section className={styles.card} aria-labelledby="addr-h">
          <h2 id="addr-h">Delivering to</h2>
          <address className={styles.address}>
            <strong>{address.name}</strong>
            <br />
            {address.line1}
            {address.line2 && <>, {address.line2}</>}
            <br />
            {address.landmark && <>Near {address.landmark}<br /></>}
            {address.city}, {address.state} {address.pincode}
            <br />
            Phone {address.phone}
          </address>
          <ButtonLink href="/shop" variant="ghost" block>
            Keep shopping
          </ButtonLink>
        </section>
      </div>
    </div>
  );
}
