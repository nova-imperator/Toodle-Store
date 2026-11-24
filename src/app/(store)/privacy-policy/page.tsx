import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";
import { GRIEVANCE_CONTACT } from "@/config/policy";

export const metadata: Metadata = pageSeo({
  title: "Privacy Policy",
  description: "What personal data Toodle Store collects, how we use and protect it, who we share it with, and how to ask us to correct or delete it.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <ContentPage title="Privacy policy" path="/privacy-policy" updated="24 November 2026">
      <p>
        This policy explains what personal data Toodle Store (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects when you visit our website, create an account or
        place an order, and how we use it. By using the site you agree to this policy.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account details:</strong> your email address. If you sign in with Google, also your name and profile photo from your Google account.
        </li>
        <li>
          <strong>Order details:</strong> name, mobile number, delivery address, items ordered, amounts and payment status.
        </li>
        <li>
          <strong>Wholesale enquiries:</strong> the phone number and name you enter, and the page or campaign you came from.
        </li>
        <li>
          <strong>Technical data:</strong> cookies that keep you signed in and remember your cart and wishlist, plus basic information your browser
          sends (such as IP address and device type) for security. We also count page visits with a random visitor ID (no name or contact details) to see how many people use the site.
        </li>
      </ul>

      <h2>What we don&apos;t collect</h2>
      <p>We never see or store your card, UPI or bank details. Payments are handled securely by Razorpay under its own privacy policy.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To process, pack and deliver your orders, and send order and delivery updates.</li>
        <li>To send login codes and let you sign in.</li>
        <li>To answer your questions and wholesale enquiries.</li>
        <li>To keep the website secure, prevent fraud and meet legal and tax requirements.</li>
        <li>To send offers only if you have agreed to receive them. You can opt out at any time.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We don&apos;t sell, rent or trade your personal data. We share only what is needed with services that help us run the store:</p>
      <ul>
        <li>Courier partners, to deliver your order.</li>
        <li>Razorpay, to take payments.</li>
        <li>Our hosting, database and email providers, to run the website and send emails.</li>
        <li>Google, only if you choose to sign in with Google.</li>
        <li>Government authorities, when the law requires it.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use cookies to keep you signed in and remember your cart. You can block cookies in your browser settings, but signing in and the cart won&apos;t
        work without them.
      </p>

      <h2>How we protect it</h2>
      <p>
        The website uses secure HTTPS connections, and access to customer data is limited to our team. No system is perfectly secure, but we take reasonable
        steps to protect your data.
      </p>

      <h2>How long we keep it</h2>
      <p>We keep your data while your account is active and as long as needed for the purposes above. Order records are kept as long as tax law requires.</p>

      <h2>Your choices</h2>
      <p>
        You can ask us to show, correct or delete your personal data, or stop marketing messages, by emailing {SITE.email}. Some order records must be kept
        for tax reasons even after you close your account.
      </p>

      <h2>Children</h2>
      <p>Our customers are adults buying for children. We don&apos;t knowingly collect personal data from children.</p>

      <h2>Links to other sites</h2>
      <p>Links to other websites (such as WhatsApp, Instagram or Facebook) are covered by those sites&apos; own privacy policies.</p>

      <h2>Changes</h2>
      <p>We may update this policy. The latest version and its date are always on this page.</p>

      <h2>Contact and grievances</h2>
      <p>
        Questions about privacy: {SITE.email} or {SITE.phone}. Our {GRIEVANCE_CONTACT.role} can be reached at the same email and will respond within{" "}
        {GRIEVANCE_CONTACT.replyWithinDays} days.
      </p>
    </ContentPage>
  );
}
