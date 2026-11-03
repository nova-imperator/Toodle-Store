import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/cart/WishlistProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileCartBar } from "@/components/cart/MobileCartBar";
import { CartToast } from "@/components/cart/CartToast";
import { getCurrentUser } from "@/server/auth/session";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const userName = user ? (user.name?.split(" ")[0] ?? "there") : null;

  return (
    <CartProvider>
      <WishlistProvider>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Suspense>
          <Header userName={userName} />
        </Suspense>
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <MobileCartBar />
        <CartToast />
      </WishlistProvider>
    </CartProvider>
  );
}
