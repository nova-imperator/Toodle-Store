import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import styles from "./Field.module.css";

interface Wrap {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
}

function Shell({ id, label, error, hint, optional, className, children }: Wrap & { id: string; children: ReactNode }) {
  return (
    <div className={`${styles.field} ${className ?? ""}`}>
      <label htmlFor={id} className={styles.label}>
        {label} {optional && <span className={styles.optional}>(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className={styles.error}>
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-msg`} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function TextField({ label, error, hint, optional, className, ...input }: Wrap & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input id={id} className={styles.control} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} {...input} />
    </Shell>
  );
}

export function SelectField({ label, error, hint, optional, className, children, ...select }: Wrap & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <select id={id} className={`${styles.control} ${styles.select}`} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} {...select}>
        {children}
      </select>
    </Shell>
  );
}

export function TextAreaField({ label, error, hint, optional, className, ...area }: Wrap & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea id={id} className={`${styles.control} ${styles.area}`} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} {...area} />
    </Shell>
  );
}
