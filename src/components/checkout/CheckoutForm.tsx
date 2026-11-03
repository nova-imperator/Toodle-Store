"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextField, SelectField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { StudLoader } from "@/components/ui/StudLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartSummary } from "@/components/cart/CartSummary";
import { INDIAN_STATES } from "@/config/india";
import { api, ApiError } from "@/lib/api";
import { formatPaise } from "@/lib/money";
import { checkoutSchema, type AddressInput } from "@/lib/validation/checkout";
import { useCart } from "@/hooks/useCart";
import { openRazorpay } from "./razorpay";
import { MockPaymentDialog } from "./MockPaymentDialog";
import styles from "./CheckoutForm.module.css";

type PlaceResult =
  | { kind: "cod"; orderNumber: string }
  | { kind: "razorpay"; orderNumber: string; keyId: string; razorpayOrderId: string; amount: number; mock: boolean };

interface Props {
  email: string;
  phone: string | null;
  address: AddressInput | null;
}

const EMPTY: AddressInput = { name: "", phone: "", pincode: "", city: "", state: "", line1: "", line2: "", landmark: "" };

export function CheckoutForm({ email, phone: savedPhone, address: saved }: Props) {
  const router = useRouter();
  const { cart, ready, refresh } = useCart();
  const [phone, setPhone] = useState(savedPhone ?? saved?.phone ?? "");
  const [address, setAddress] = useState<AddressInput>(saved ?? EMPTY);
  const [saveAddress, setSaveAddress] = useState(true);
  const [method, setMethod] = useState<"razorpay" | "cod">("razorpay");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [estimate, setEstimate] = useState<string | null>(null);
  const [mock, setMock] = useState<{ razorpayOrderId: string; amount: number } | null>(null);

  const set = (k: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setAddress((a) => ({ ...a, [k]: e.target.value }));

  const lookupPin = async (pin: string) => {
    if (!/^[1-9]\d{5}$/.test(pin)) return setEstimate(null);
    try {
      const r = await api<{ city: string; state: string; estimate: { from: string; to: string } }>(`/api/pincode/${pin}`);
      setAddress((a) => ({ ...a, city: a.city || r.city, state: INDIAN_STATES.includes(r.state) ? r.state : a.state }));
      setEstimate(`Free delivery by ${r.estimate.from} – ${r.estimate.to}`);
      setErrors((e) => ({ ...e, "address.pincode": "" }));
    } catch (e) {
      setEstimate(null);
      setErrors((er) => ({ ...er, "address.pincode": (e as Error).message }));
    }
  };

  const goToOrder = async (orderNumber: string) => {
    await refresh();
    router.push(`/order/${orderNumber}`);
  };

  const pay = async (result: Extract<PlaceResult, { kind: "razorpay" }>) => {
    if (result.mock) {
      setMock({ razorpayOrderId: result.razorpayOrderId, amount: result.amount });
      return;
    }
    const outcome = await openRazorpay({
      keyId: result.keyId,
      orderId: result.razorpayOrderId,
      amount: result.amount,
      orderNumber: result.orderNumber,
      prefill: { name: address.name, email, contact: phone },
    });
    if (outcome.status === "paid") {
      const r = await api<{ orderNumber: string }>("/api/payments/razorpay/verify", { body: outcome.response });
      await goToOrder(r.orderNumber);
    } else {
      setFormError(outcome.status === "failed" ? `${outcome.message} Your cart and address are saved, please try again.` : "Payment was cancelled. Your cart is saved, you can try again.");
      setBusy(false);
    }
  };

  const onMockResult = async (r: "success" | "failure" | "dismiss") => {
    const pending = mock!;
    setMock(null);
    if (r === "dismiss") {
      setFormError("Payment was cancelled. Your cart is saved, you can try again.");
      setBusy(false);
      return;
    }
    try {
      const res = await api<{ orderNumber: string }>("/api/payments/mock", { body: { razorpayOrderId: pending.razorpayOrderId, outcome: r } });
      await goToOrder(res.orderNumber);
    } catch (e) {
      setFormError((e as Error).message);
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsed = checkoutSchema.safeParse({ phone, address, saveAddress, paymentMethod: method });
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) map[issue.path.join(".")] ??= issue.message;
      setErrors(map);
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const result = await api<PlaceResult>("/api/checkout", { body: parsed.data });
      if (result.kind === "cod") await goToOrder(result.orderNumber);
      else await pay(result);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  if (!ready) return <StudLoader center label="Loading checkout" />;
  if (!cart || cart.lines.length === 0) {
    return <EmptyState title="Nothing to check out yet" text="Your cart is empty." action={<ButtonLink href="/shop">Shop toys</ButtonLink>} />;
  }

  return (
    <form className={styles.layout} onSubmit={submit} noValidate>
      <div className={styles.steps}>
        <section className={styles.step} aria-labelledby="s1">
          <h2 id="s1">
            <span className={styles.num}>1</span> Contact
          </h2>
          <div className={styles.grid2}>
            <TextField label="Email" value={email} readOnly />
            <TextField label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} hint="For delivery updates" maxLength={14} />
          </div>
        </section>

        <section className={styles.step} aria-labelledby="s2">
          <h2 id="s2">
            <span className={styles.num}>2</span> Delivery address
          </h2>
          <div className={styles.grid2}>
            <TextField label="Full name" autoComplete="name" value={address.name} onChange={set("name")} error={errors["address.name"]} />
            <TextField label="Phone at this address" type="tel" inputMode="numeric" autoComplete="tel-national" value={address.phone} onChange={set("phone")} error={errors["address.phone"]} maxLength={14} />
            <TextField
              label="Pincode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              value={address.pincode}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setAddress((a) => ({ ...a, pincode: v }));
                if (v.length === 6) void lookupPin(v);
              }}
              error={errors["address.pincode"]}
              hint={estimate ?? "City and state fill in automatically"}
            />
            <TextField label="City" autoComplete="address-level2" value={address.city} onChange={set("city")} error={errors["address.city"]} />
            <SelectField label="State" autoComplete="address-level1" value={address.state} onChange={set("state")} error={errors["address.state"]} className={styles.span2}>
              <option value="">Choose state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </SelectField>
            <TextField label="House number, building, street" autoComplete="address-line1" value={address.line1} onChange={set("line1")} error={errors["address.line1"]} className={styles.span2} />
            <TextField label="Area, colony" optional autoComplete="address-line2" value={address.line2 ?? ""} onChange={set("line2")} />
            <TextField label="Landmark" optional value={address.landmark ?? ""} onChange={set("landmark")} />
          </div>
          <label className={styles.check}>
            <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} /> Save this address for next time
          </label>
        </section>

        <section className={styles.step} aria-labelledby="s3">
          <h2 id="s3">
            <span className={styles.num}>3</span> Payment
          </h2>
          <div className={styles.methods} role="radiogroup" aria-label="Payment method">
            <label className={styles.method} data-checked={method === "razorpay"}>
              <input type="radio" name="method" value="razorpay" checked={method === "razorpay"} onChange={() => setMethod("razorpay")} />
              <Icon name="shield" />
              <span>
                <strong>Pay online</strong>
                <small>UPI, cards, netbanking and wallets via Razorpay</small>
              </span>
            </label>
            <label className={styles.method} data-checked={method === "cod"}>
              <input type="radio" name="method" value="cod" checked={method === "cod"} onChange={() => setMethod("cod")} />
              <Icon name="cash" />
              <span>
                <strong>Cash on delivery</strong>
                <small>We&apos;ll call you to confirm before shipping</small>
              </span>
            </label>
          </div>
        </section>
      </div>

      <aside className={styles.summary}>
        <h2>Order summary</h2>
        <ul className={styles.items}>
          {cart.lines.map((l) => (
            <li key={l.productId} data-color={l.color}>
              <span className={styles.thumb}>
                <Image src={l.image} alt="" width={56} height={56} />
                <span className={styles.qty}>{l.qty}</span>
              </span>
              <span className={styles.itemName}>{l.name}</span>
              <span>{formatPaise(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <CartSummary totals={cart.totals} couponCode={cart.couponCode} />
        {formError && (
          <p className={styles.error} role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? "Please wait…" : method === "cod" ? "Request cash on delivery" : `Pay ${formatPaise(cart.totals.total)}`}
        </Button>
        <p className={styles.policy}>
          By placing this order you agree to our <Link href="/terms">terms</Link>. Toys can&apos;t be returned, so please check ages and sizes.
        </p>
      </aside>

      {mock && <MockPaymentDialog amount={mock.amount} onResult={onMockResult} />}
    </form>
  );
}
