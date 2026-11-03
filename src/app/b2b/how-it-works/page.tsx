import type { Metadata } from "next";
import { B2BHero, CtaBand, Steps, Benefits } from "@/components/b2b/B2BSections";

export const metadata: Metadata = {
  title: "How Bulk Toy Orders Work",
  description: "Enquire, get the catalogue and quote, confirm and pay against a GST invoice, and receive delivery anywhere in India.",
  alternates: { canonical: "/b2b/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <B2BHero title="How bulk orders work" text="Four simple steps from first message to stock on your shelves. No minimum order, and a real person helps you at every step." source="b2b-how" />
      <Steps />
      <Benefits />
      <CtaBand source="b2b-how-cta" />
    </>
  );
}
