"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { OrderStatus } from "@prisma/client";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { OrderJourney, type JourneySteps } from "./OrderJourney";
import { TRACKING_FAQS } from "@/config/tracking";
import { SITE } from "@/config/site";
import { api } from "@/lib/api";
import { formatPaise } from "@/lib/money";
import { trackOrderSchema } from "@/lib/validation/track";
import styles from "./TrackOrder.module.css";

interface Tracked {
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  steps: JourneySteps;
  expected: { from: string; to: string } | null;
  items: { id: string; name: string; qty: number; image: string | null; unitPrice: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  recipient: string;
  deliverTo: string;
  courier: string | null;
  awbNumber: string | null;
  trackingUrl: string | null;
}

const day = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

const HERO: Record<OrderStatus, { tone: string; label: string; title: (o: Tracked) => string; text: (o: Tracked) => string }> = {
  pending_payment: { tone: "red", label: "Payment pending", title: () => "Payment not completed", text: () => "This order isn't confirmed yet. Your cart is saved, so you can pay again from checkout." },
  cod_enquiry: { tone: "yellow", label: "Awaiting confirmation", title: () => "We'll confirm this order by phone", text: () => "Our team will call you to confirm it before it ships." },
  placed: { tone: "yellow", label: "Confirmed", title: () => "Order confirmed", text: (o) => `Payment received. We're getting ${o.recipient}'s toys ready.` },
  packed: { tone: "blue", label: "Packed", title: () => "Packed and ready to go", text: () => "Your order is packed and will be handed to the courier soon." },
  shipped: { tone: "blue", label: "Shipped", title: () => "On its way!", text: (o) => `Your parcel is with ${o.courier ?? "the courier"} and heading to ${o.deliverTo.split(",")[0]}.` },
  delivered: { tone: "green", label: "Delivered", title: () => "Delivered with love", text: (o) => `Your order reached ${o.recipient}. We hope they love it!` },
  cancelled: { tone: "red", label: "Cancelled", title: () => "Order cancelled", text: () => `Questions about this order? WhatsApp us on ${SITE.phone}.` },
};

function Faqs() {
  return (
    <section className={styles.card} aria-labelledby="faq-h">
      <h2 id="faq-h" className={styles.cardTitle}>
        Tracking FAQs
      </h2>
      <div className={styles.faqs}>
        {TRACKING_FAQS.map((f) => (
          <details key={f.q} className={styles.faq}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <p className={styles.small}>
        Still need help? <a href={SITE.whatsappHref}>Chat with us on WhatsApp</a>
      </p>
    </section>
  );
}

function Result({ order, onReset }: { order: Tracked; onReset: () => void }) {
  const hero = HERO[order.status];
  const waText = encodeURIComponent(`Hi Toodle Store, I have a question about my order ${order.orderNumber}.`);

  return (
    <div className={styles.grid}>
      <div className={styles.main}>
        <section className={styles.hero} data-tone={hero.tone} aria-live="polite">
          <p className={styles.eyebrow}>{hero.label}</p>
          <h2 className={styles.heroTitle}>{hero.title(order)}</h2>
          <p>{hero.text(order)}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Order no.</dt>
              <dd>{order.orderNumber}</dd>
            </div>
            <div>
              <dt>Placed on</dt>
              <dd>{day.format(new Date(order.steps.placed ?? order.createdAt))}</dd>
            </div>
            {order.status === "delivered" && order.steps.delivered ? (
              <div>
                <dt>Delivered on</dt>
                <dd>{day.format(new Date(order.steps.delivered))}</dd>
              </div>
            ) : (
              order.expected && (
                <div>
                  <dt>Expected delivery</dt>
                  <dd>
                    {day.format(new Date(order.expected.from))} – {day.format(new Date(order.expected.to))}
                  </dd>
                </div>
              )
            )}
            <div>
              <dt>Delivering to</dt>
              <dd>{order.deliverTo}</dd>
            </div>
          </dl>
          {order.status === "pending_payment" && (
            <ButtonLink href="/checkout" variant="yellow">
              Go to checkout
            </ButtonLink>
          )}
        </section>

        <section className={styles.card} aria-labelledby="journey-h">
          <h2 id="journey-h" className={styles.cardTitle}>
            Order journey
          </h2>
          <OrderJourney
            status={order.status}
            steps={order.steps}
            shippedNote={
              (order.courier || order.trackingUrl) && (
                <div className={styles.parcel}>
                  {order.courier && (
                    <span>
                      {order.courier}
                      {order.awbNumber && <> · AWB {order.awbNumber}</>}
                    </span>
                  )}
                  {order.trackingUrl && (
                    <a href={order.trackingUrl} target="_blank" rel="noopener" className={styles.trackBtn}>
                      <Icon name="truck" size={18} /> Track parcel
                    </a>
                  )}
                </div>
              )
            }
          />
        </section>

        <section className={styles.card} aria-labelledby="items-h">
          <h2 id="items-h" className={styles.cardTitle}>
            Your order
          </h2>
          <ul className={styles.items}>
            {order.items.map((i) => (
              <li key={i.id}>
                {i.image && <Image src={i.image} alt="" width={64} height={64} className={styles.thumb} />}
                <span>
                  <strong>{i.name}</strong>
                  <small>Qty {i.qty}</small>
                </span>
                <span className={styles.price}>{formatPaise(i.unitPrice * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className={styles.totals}>
            {order.discount > 0 && (
              <div>
                <dt>Coupon</dt>
                <dd>−{formatPaise(order.discount)}</dd>
              </div>
            )}
            <div>
              <dt>Delivery</dt>
              <dd>{order.shipping ? formatPaise(order.shipping) : "Free"}</dd>
            </div>
            <div className={styles.total}>
              <dt>{order.status === "pending_payment" ? "Total" : "Total paid"}</dt>
              <dd>{formatPaise(order.total)}</dd>
            </div>
          </dl>
          {order.status === "delivered" && <p className={styles.note}>A delivery confirmation has been sent to your email.</p>}
        </section>
      </div>

      <aside className={styles.side}>
        <section className={styles.card} aria-labelledby="help-h">
          <h2 id="help-h" className={styles.cardTitle}>
            Need help with this order?
          </h2>
          <div className={styles.helpBtns}>
            <a href={`${SITE.whatsappHref}?text=${waText}`} className={styles.wa} target="_blank" rel="noopener">
              <Icon name="whatsapp" size={20} /> WhatsApp us
            </a>
            <a href={SITE.phoneHref} className={styles.call}>
              <Icon name="phone" size={20} /> Call us
            </a>
          </div>
          <p className={styles.small}>Keep your order number handy: {order.orderNumber}</p>
        </section>
        <Faqs />
        <Button variant="ghost" block onClick={onReset}>
          Track another order
        </Button>
      </aside>
    </div>
  );
}

export function TrackOrder({ initialOrder, signedIn }: { initialOrder: string; signedIn: boolean }) {
  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ orderNumber?: string; email?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<Tracked | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsed = trackOrderSchema.safeParse({ orderNumber, email });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({ orderNumber: f.orderNumber?.[0], email: f.email?.[0] });
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      setOrder(await api<Tracked>("/api/orders/track", { body: parsed.data }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (order) return <Result order={order} onReset={() => setOrder(null)} />;

  return (
    <div className={styles.grid}>
      <div className={styles.main}>
        <section className={styles.card} aria-labelledby="track-h">
          <h2 id="track-h" className={styles.cardTitle}>
            Track your order
          </h2>
          <p className={styles.small}>Both details are in your order confirmation email.</p>
          <form className={styles.form} onSubmit={submit} noValidate>
            <TextField
              label="Order number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="e.g. TS2611135854"
              autoComplete="off"
              maxLength={14}
              error={errors.orderNumber}
              hint="Starts with TS. It's in the subject line of your confirmation email."
            />
            <TextField
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              error={errors.email}
              hint="The email you used when placing the order."
            />
            {formError && (
              <p className={styles.error} role="alert">
                {formError}
              </p>
            )}
            <Button type="submit" size="lg" block disabled={busy}>
              {busy ? "Finding your order…" : "Track my order"}
            </Button>
          </form>
          <p className={styles.or}>or</p>
          <ButtonLink href={signedIn ? "/account/orders" : "/login?next=/account/orders"} variant="ghost" block>
            <Icon name="user" size={18} /> {signedIn ? "See all your orders" : "Log in to see all your orders"}
          </ButtonLink>
          <p className={styles.tip}>
            <strong>Can&apos;t find your order number?</strong> Search your inbox for &ldquo;Toodle Store order&rdquo;. It&apos;s in the subject line and at
            the top of the email.
          </p>
        </section>
      </div>

      <aside className={styles.side}>
        <section className={styles.card} aria-labelledby="see-h">
          <h2 id="see-h" className={styles.cardTitle}>
            What you&apos;ll see
          </h2>
          <ul className={styles.features}>
            <li>
              <span data-color="yellow"><Icon name="box" size={18} /></span>
              <div>
                <strong>Every step of your order</strong>
                <small>Confirmed, packed, shipped and delivered, with dates</small>
              </div>
            </li>
            <li>
              <span data-color="blue"><Icon name="truck" size={18} /></span>
              <div>
                <strong>Expected delivery dates</strong>
                <small>So you know roughly when to expect it</small>
              </div>
            </li>
            <li>
              <span data-color="orange"><Icon name="pin" size={18} /></span>
              <div>
                <strong>Courier tracking link</strong>
                <small>Follow the parcel once it ships</small>
              </div>
            </li>
            <li>
              <span data-color="green"><Icon name="mail" size={18} /></span>
              <div>
                <strong>Email updates</strong>
                <small>We email you at every step too</small>
              </div>
            </li>
          </ul>
          <p className={styles.small}>
            Prefer to see everything in one place? <Link href={signedIn ? "/account/orders" : "/login?next=/account/orders"}>My orders</Link>
          </p>
        </section>
        <Faqs />
      </aside>
    </div>
  );
}
