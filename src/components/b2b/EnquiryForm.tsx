"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { PhoneField } from "@/components/ui/PhoneField";
import { SITE, WHATSAPP_BULK_HREF } from "@/config/site";
import { api } from "@/lib/api";
import { readUtm, trackConversion } from "@/lib/utm";
import { enquirySchema } from "@/lib/validation/enquiry";
import styles from "./EnquiryForm.module.css";

// Phone + optional name only (owner, 24 Nov 2026): every extra field loses enquiries.
// City, business type, categories etc. are asked on the call. "website" is the hidden spam trap.
const INITIAL = { fullName: "", phone: "", website: "" };

export function EnquiryForm({ source }: { source?: string }) {
  const pathname = usePathname();
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const bind = (k: keyof typeof INITIAL) => ({
    value: values[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value })),
    error: errors[k],
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const payload = { ...values, sourcePage: source ?? pathname, ...readUtm() };
    const parsed = enquirySchema.safeParse(payload);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const i of parsed.error.issues) map[String(i.path[0])] ??= i.message;
      setErrors(map);
      document.querySelector<HTMLElement>("form [aria-invalid='true']")?.focus();
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await api("/api/b2b/enquiry", { body: payload });
      trackConversion("b2b_enquiry", {});
      setDone(true);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    const first = values.fullName.trim().split(" ")[0];
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneTitle}>Thank you{first ? `, ${first}` : ""}!</p>
        <p>Our team will call you within 24 hours with our wholesale prices.</p>
        <p>
          Can&apos;t wait? <a href={WHATSAPP_BULK_HREF} target="_blank" rel="noopener">WhatsApp us on {SITE.phone}</a>
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <p className={styles.intro}>Leave your number and our team will call you with wholesale prices. Takes 5 seconds.</p>
      <TextField label="Name" optional autoComplete="name" placeholder="Your name or shop name" {...bind("fullName")} />
      <PhoneField label="Phone" value={values.phone} onChange={(v) => setValues((s) => ({ ...s, phone: v }))} error={errors.phone} />

      <div className={styles.trap} aria-hidden="true">
        <label>
          Website <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))} />
        </label>
      </div>

      {formError && (
        <p className={styles.error} role="alert">
          {formError}
        </p>
      )}
      <Button type="submit" variant="yellow" size="lg" block disabled={busy}>
        {busy ? "Sending…" : "Call me with prices"}
      </Button>
      <p className={styles.note}>No minimum order. Your number is only used to call you about prices.</p>
    </form>
  );
}
