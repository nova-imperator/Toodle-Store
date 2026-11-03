import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { getAddresses } from "@/server/services/order";
import { EmptyState } from "@/components/ui/EmptyState";
import styles from "../account.module.css";

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/addresses");
  const addresses = await getAddresses(user.id);

  if (addresses.length === 0) {
    return <EmptyState title="No saved addresses" text="Addresses you use at checkout are saved here for next time." />;
  }

  return (
    <ul className={styles.addresses}>
      {addresses.map((a) => (
        <li key={a.id}>
          <address className={styles.address}>
            {a.isDefault && (
              <>
                <span className={styles.default}>Default</span>
                <br />
              </>
            )}
            <strong>{a.name}</strong>
            <br />
            {a.line1}
            {a.line2 && `, ${a.line2}`}
            <br />
            {a.city}, {a.state} {a.pincode}
            <br />
            Phone {a.phone}
          </address>
        </li>
      ))}
    </ul>
  );
}
