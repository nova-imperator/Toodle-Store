"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EnquiryForm } from "./EnquiryForm";

/** "Start now" button that opens the enquiry form in a popup. */
export function EnquiryButton({ label = "Start now", variant = "yellow", size = "lg", source }: { label?: ReactNode; variant?: "yellow" | "red" | "blue" | "ink"; size?: "sm" | "md" | "lg"; source?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Get the wholesale price list">
        <EnquiryForm source={source} />
      </Modal>
    </>
  );
}
