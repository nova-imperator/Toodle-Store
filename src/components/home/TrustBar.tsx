import { Icon, type IconName } from "@/components/ui/Icon";
import styles from "./TrustBar.module.css";

const ITEMS: { icon: IconName; title: string; text: string; color: string }[] = [
  { icon: "shield", title: "Secure payments", text: "UPI, cards and netbanking through Razorpay", color: "blue" },
  { icon: "truck", title: "Free delivery on orders of ₹999+", text: "₹100 on smaller orders, anywhere in India", color: "green" },
  { icon: "box", title: "Order tracking", text: "Follow your order from packed to delivered", color: "orange" },
  { icon: "whatsapp", title: "WhatsApp support", text: "Real people to help you choose", color: "red" },
];

export function TrustBar() {
  return (
    <ul className={styles.bar}>
      {ITEMS.map((i) => (
        <li key={i.title} className={styles.item} data-color={i.color}>
          <span className={styles.icon}>
            <Icon name={i.icon} size={26} />
          </span>
          <span>
            <strong>{i.title}</strong>
            <small>{i.text}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}
