"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SITE } from "@/config/site";

export default function StoreError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container">
      <EmptyState
        title="Something went wrong"
        text={`We couldn't load this page. Please try again. If it keeps happening, WhatsApp us on ${SITE.phone}.`}
        action={<Button onClick={reset}>Try again</Button>}
      />
    </div>
  );
}
