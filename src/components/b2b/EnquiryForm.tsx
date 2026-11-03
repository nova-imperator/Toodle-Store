"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField, TextAreaField } from "@/components/ui/Field";
import { BUSINESS_TYPES, ORDER_VALUES } from "@/config/b2b";
import { CATEGORIES } from "@/config/catalogue";
import { INDIAN_STATES } from "@/config/india";
import { SITE } from "@/config/site";
import { api } from "@/lib/api";
import { readUtm, trackConversion } from "@/lib/utm";
import { enquirySchema } from "@/lib/validation/enquiry";
import styles from "./EnquiryForm.module.css";

const INITIAL = {
  fullName: "", phone: "", email: "", businessName: "", businessType: "", city: "", state: "",
  gstNumber: "", estOrderValue: "", message: "", website: "",
};

export function EnquiryForm({ source }: { source?: string }) {
  const pathname = usePathname();
  const [values, setValues] = useState(INITIAL);
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const bind = (k: keyof typeof INITIAL) => ({
    value: values[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [k]: e.target.value })),
    error: errors[k],
  });

  const toggle = (slug: string) => setCategories((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : [...c, slug]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const payload = { ...values, categories, sourcePage: source ?? pathname, ...readUtm() };
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
      trackConversion("b2b_enquiry", { business_type: values.businessType });
      setDone(true);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneTitle}>Thank you, {values.fullName.split(" ")[0]}!</p>
        <p>Our team will call you within 24 hours with our wholesale price list.</p>
        <p>
          Can&apos;t wait? <a href={SITE.whatsappHref}>WhatsApp us on {SITE.phone}</a>
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.grid}>
        <TextField label="Full name" autoComplete="name" {...bind("fullName")} />
        <TextField label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} {...bind("phone")} />
        <TextField label="Email" type="email" autoComplete="email" {...bind("email")} />
        <TextField label="Business name" optional autoComplete="organization" {...bind("businessName")} />
        <SelectField label="Business type" {...bind("businessType")}>
          <option value="">Choose one</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </SelectField>
        <TextField label="GST number" optional maxLength={15} hint="15 characters, e.g. 27ABCDE1234F1Z5" {...bind("gstNumber")} />
        <TextField label="City" autoComplete="address-level2" {...bind("city")} />
        <SelectField label="State" {...bind("state")}>
          <option value="">Choose state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </SelectField>
      </div>

      <fieldset className={styles.cats}>
        <legend>
          Categories you&apos;re interested in <span>(optional)</span>
        </legend>
        <div className={styles.chips}>
          {CATEGORIES.map((c) => (
            <label key={c.slug} className={styles.chip} data-color={c.color}>
              <input type="checkbox" checked={categories.includes(c.slug)} onChange={() => toggle(c.slug)} />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.grid}>
        <SelectField label="Estimated order value" optional {...bind("estOrderValue")}>
          <option value="">Not sure yet</option>
          {ORDER_VALUES.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </SelectField>
      </div>
      <TextAreaField label="What do you need?" optional placeholder="Products, quantities, timelines, samples…" {...bind("message")} />

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
        {busy ? "Sending…" : "Send enquiry"}
      </Button>
      <p className={styles.note}>We reply within 24 hours. No minimum order. Your details are only used to contact you about this enquiry.</p>
    </form>
  );
}
