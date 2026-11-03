import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { listOrdersForUser } from "@/server/services/order";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { formatPaise } from "@/lib/money";
import { ORDER_STATUS_LABEL } from "@/config/orders";
import styles from "../account.module.css";

const date = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/orders");
  const orders = await listOrdersForUser(user.id);

  if (orders.length === 0) {
    return <EmptyState title="No orders yet" text="When you place an order it will show up here with its delivery status." action={<ButtonLink href="/shop">Find a toy</ButtonLink>} />;
  }

  return (
    <ul className={styles.list}>
      {orders.map((o) => (
        <li key={o.id}>
          <Link href={`/order/${o.orderNumber}`} className={styles.order}>
            <span className={styles.thumbs}>
              {o.items.map((i) => i.image && <Image key={i.id} src={i.image} alt="" width={48} height={48} />)}
            </span>
            <span className={styles.meta}>
              <strong>{o.orderNumber}</strong>
              <small>
                {date.format(o.createdAt)} · {o._count.items} {o._count.items === 1 ? "item" : "items"} · {formatPaise(o.total)}
              </small>
            </span>
            <span className={styles.status} data-status={o.status}>
              {ORDER_STATUS_LABEL[o.status]}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
