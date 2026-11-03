import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/server/auth/admin";
import { allowedNext, getOrder } from "@/server/services/admin/orders";
import type { OrderAddress } from "@/server/services/order";
import { OrderPill, dateTime } from "@/components/admin/AdminBits";
import { OrderActions } from "@/components/admin/OrderActions";
import { formatPaise } from "@/lib/money";
import styles from "../../../admin.module.css";

export const metadata = { title: "Order" };

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("orders");
  const order = await getOrder((await params).id);
  if (!order) notFound();
  const a = order.address as unknown as OrderAddress;
  const payment = order.payments.find((p) => p.status === "paid");

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>{order.orderNumber}</h1>
          <p className={styles.sub}>
            {dateTime.format(order.createdAt)} · <OrderPill status={order.status} />
          </p>
        </div>
        <Link href="/admin/orders">All orders</Link>
      </div>

      <div className={styles.cols}>
        <div>
          <section className={styles.panel}>
            <h2>Items</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <tbody>
                  {order.items.map((i) => (
                    <tr key={i.id}>
                      <td>{i.image && <Image src={i.image} alt="" width={40} height={40} className={styles.thumb} />}</td>
                      <td className={styles.wrap}>{i.name}</td>
                      <td>× {i.qty}</td>
                      <td className={styles.num}>{formatPaise(i.unitPrice * i.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className={`${styles.dl} ${styles.spaced}`}>
              <dt>Subtotal</dt><dd>{formatPaise(order.subtotal)}</dd>
              {order.discount > 0 && (<><dt>Coupon {order.couponCode}</dt><dd>−{formatPaise(order.discount)}</dd></>)}
              <dt>GST included</dt><dd>{formatPaise(order.gst)}</dd>
              <dt>Total</dt><dd><strong>{formatPaise(order.total)}</strong></dd>
            </dl>
          </section>

          <section className={styles.panel}>
            <h2>Payment</h2>
            <dl className={styles.dl}>
              <dt>Method</dt><dd>{order.paymentMethod === "cod" ? "Cash on delivery" : "Razorpay"}</dd>
              <dt>Status</dt><dd>{order.paymentStatus}</dd>
              {payment && (<><dt>Razorpay payment</dt><dd>{payment.razorpayPaymentId} {payment.method && `(${payment.method})`}</dd></>)}
              {order.refunds.map((r) => (
                <Fragment key={r.id}><dt>Refund</dt><dd>{formatPaise(r.amount)} · {r.status} · {r.razorpayRefundId}</dd></Fragment>
              ))}
            </dl>
          </section>
        </div>

        <div>
          <section className={styles.panel}>
            <h2>Customer</h2>
            <dl className={styles.dl}>
              <dt>Name</dt><dd>{a.name}</dd>
              <dt>Email</dt><dd><a href={`mailto:${order.email}`}>{order.email}</a></dd>
              <dt>Mobile</dt><dd><a href={`tel:+91${order.phone}`}>{order.phone}</a></dd>
              <dt>Address</dt>
              <dd>
                {a.line1}{a.line2 && `, ${a.line2}`}{a.landmark && `, near ${a.landmark}`}<br />
                {a.city}, {a.state} {a.pincode}<br />Phone {a.phone}
              </dd>
              {order.shipment?.awbNumber && (<><dt>Shipment</dt><dd>{order.shipment.courier} · {order.shipment.awbNumber}{order.shipment.trackingUrl && <> · <a href={order.shipment.trackingUrl} target="_blank" rel="noopener">track</a></>}</dd></>)}
            </dl>
          </section>

          <section className={styles.panel}>
            <h2>Actions</h2>
            <OrderActions
              orderId={order.id}
              status={order.status}
              next={allowedNext(order.status)}
              canRefund={admin.role === "admin" && order.paymentStatus === "paid"}
            />
          </section>
        </div>
      </div>
    </>
  );
}
