import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "red" | "blue" | "yellow" | "green" | "ink" | "ghost";
type Size = "sm" | "md" | "lg";

interface Common {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  children: ReactNode;
}

const cls = ({ variant = "red", size = "md", block, className }: Omit<Common, "children">) =>
  [styles.btn, styles[variant], size !== "md" && styles[size], block && styles.block, className].filter(Boolean).join(" ");

export function Button({ variant, size, block, className, children, type = "button", ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cls({ variant, size, block, className })} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ href, variant, size, block, className, children, ...rest }: Common & { href: string; target?: string; rel?: string; onClick?: () => void }) {
  return (
    <Link href={href} className={cls({ variant, size, block, className })} {...rest}>
      {children}
    </Link>
  );
}
