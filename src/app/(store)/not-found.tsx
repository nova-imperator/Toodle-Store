import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { CATEGORIES } from "@/config/catalogue";

export default function NotFound() {
  return (
    <div className="container">
      <EmptyState
        title="Oops, this page went missing"
        text="It may have moved, or the toy is no longer available. Try one of these instead."
        action={<ButtonLink href="/shop">See all toys</ButtonLink>}
      />
      <CategoryTiles categories={CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, color: c.color, image: null }))} />
    </div>
  );
}
