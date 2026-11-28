"use client";

import { useState } from "react";
import { cleanMobileInput, mobileError } from "@/lib/phone";
import { TextField } from "./Field";

/**
 * 10-digit Indian mobile number: digits only (a pasted +91 / 0 is dropped), and a clear message
 * once the customer leaves the field if the number isn't valid.
 */
export function PhoneField({
  label,
  value,
  onChange,
  error,
  hint,
  name,
  placeholder = "10-digit mobile number",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  name?: string;
  placeholder?: string;
}) {
  const [touched, setTouched] = useState(false);
  return (
    <TextField
      label={label}
      name={name}
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      maxLength={14}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(cleanMobileInput(e.target.value))}
      onBlur={() => setTouched(true)}
      error={error ?? (touched ? mobileError(value) : undefined)}
      hint={hint}
    />
  );
}
