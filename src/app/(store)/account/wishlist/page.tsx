import { getWishlistProducts } from "@/server/services/wishlist";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export default async function WishlistPage() {
  const products = await getWishlistProducts();
  if (products.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        text="Tap the heart on any toy to save it here for later."
        action={<ButtonLink href="/shop?flag=best">See best sellers</ButtonLink>}
      />
    );
  }
  return <ProductGrid products={products} wide />;
}
