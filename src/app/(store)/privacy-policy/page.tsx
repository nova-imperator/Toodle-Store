import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";

export const metadata: Metadata = pageSeo({
  title: "Privacy Policy",
  description: "What personal data Toodle Store collects, how we use it to deliver orders and send login codes, and how to ask us to delete it.",
  path: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  return (
    <ContentPage title="Privacy policy" path="/privacy-policy" updated="17 November 2026">
      <p>
        This policy explains what personal data Toodle Store (&ldquo;we&rdquo;) collects through this website and how we use it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Account details: your email address, and your name and profile photo if you sign in with Google, or your name if you give it at checkout.</li>
        <li>Order details: delivery address, mobile number, items ordered and payment status.</li>
        <li>Wholesale enquiries: the details you enter in the business enquiry form, plus the page and campaign you came from.</li>
        <li>Technical data: cookies that keep you signed in and remember your cart and wishlist.</li>
      </ul>
      <h2>What we don&apos;t collect</h2>
      <p>We never see or store your card, UPI or bank details. Payments are handled by Razorpay under its own privacy policy.</p>
      <h2>How we use it</h2>
      <ul>
        <li>To deliver your orders and send order updates.</li>
        <li>To send login codes to your email.</li>
        <li>To reply to wholesale enquiries.</li>
        <li>To keep the website secure and prevent fraud.</li>
      </ul>
      <p>We don&apos;t sell your data. We share it only with the services needed to run the store, such as couriers, Razorpay and our email provider.</p>
      <h2>Your choices</h2>
      <p>You can ask us to correct or delete your account details by emailing {SITE.email}. We keep order records as required by tax law.</p>
      <h2>Contact</h2>
      <p>Questions about privacy: {SITE.email} or {SITE.phone}.</p>
    </ContentPage>
  );
}
