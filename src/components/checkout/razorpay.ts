// Loads Razorpay Checkout on demand and wraps it in a promise.

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", cb: (r: { error: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Couldn't load the payment window. Check your internet connection and try again."));
    document.body.appendChild(s);
  });
}

export type PaymentOutcome = { status: "paid"; response: RazorpayResponse } | { status: "dismissed" } | { status: "failed"; message: string };

export async function openRazorpay(opts: {
  keyId: string;
  orderId: string;
  amount: number;
  orderNumber: string;
  prefill: { name: string; email: string; contact: string };
}): Promise<PaymentOutcome> {
  await loadScript();
  return new Promise((resolve) => {
    let settled = false;
    let lastError: string | null = null;
    const finish = (o: PaymentOutcome) => {
      if (!settled) {
        settled = true;
        resolve(o);
      }
    };
    const rzp = new window.Razorpay!({
      key: opts.keyId,
      order_id: opts.orderId,
      amount: opts.amount,
      currency: "INR",
      name: "Toodle Store",
      description: `Order ${opts.orderNumber}`,
      image: "/images/brand/logo.png",
      prefill: opts.prefill,
      theme: { color: "#E8382D" },
      handler: (response: RazorpayResponse) => finish({ status: "paid", response }),
      modal: { ondismiss: () => finish(lastError ? { status: "failed", message: lastError } : { status: "dismissed" }) },
    });
    // Razorpay keeps its window open after a failure so the shopper can retry there.
    rzp.on("payment.failed", (r) => (lastError = r.error.description ?? "Payment failed."));
    rzp.open();
  });
}
