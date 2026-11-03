import Link from "next/link";
import type { EnquiryStatus, OrderStatus } from "@prisma/client";
import { ENQUIRY_STATUS_LABEL, ORDER_STATUS_LABEL } from "@/config/orders";
import styles from "@/app/admin/admin.module.css";

const ORDER_TONE: Record<OrderStatus, string> = {
  pending_payment: "grey", cod_enquiry: "yellow", placed: "blue", packed: "blue", shipped: "blue", delivered: "green", cancelled: "red",
};
const ENQUIRY_TONE: Record<EnquiryStatus, string> = { new: "yellow", contacted: "blue", quote_sent: "blue", won: "green", lost: "grey" };

export const OrderPill = ({ status }: { status: OrderStatus }) => (
  <span className={styles.pill} data-tone={ORDER_TONE[status]}>
    {ORDER_STATUS_LABEL[status]}
  </span>
);

export const EnquiryPill = ({ status }: { status: EnquiryStatus }) => (
  <span className={styles.pill} data-tone={ENQUIRY_TONE[status]}>
    {ENQUIRY_STATUS_LABEL[status]}
  </span>
);

export function Pager({ page, pageCount, href }: { page: number; pageCount: number; href: (p: number) => string }) {
  if (pageCount <= 1) return null;
  return (
    <nav className={styles.pages} aria-label="Pages">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={href(p)} aria-current={p === page ? "page" : undefined}>
          {p}
        </Link>
      ))}
    </nav>
  );
}

export const dateTime = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** Builds an admin list URL keeping the current filters. */
export function listHref(base: string, params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "" && !(k === "page" && v === 1)) q.set(k, String(v));
  const s = q.toString();
  return s ? `${base}?${s}` : base;
}
