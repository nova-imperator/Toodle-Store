/** Animates a copy of a product image into the header cart button. Skipped under reduced motion. */
export function flyToCart(source: HTMLElement | null) {
  if (!source || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = document.querySelector<HTMLElement>("[data-cart-target]:not([hidden])");
  const img = source.querySelector("img");
  if (!target || !img) return;

  const from = img.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const ghost = img.cloneNode() as HTMLImageElement;
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    borderRadius: "16px",
    zIndex: "200",
    pointerEvents: "none",
  });
  document.body.appendChild(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  ghost
    .animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${dx * 0.6}px, ${dy * 0.3 - 80}px) scale(0.5)`, opacity: 0.9, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0.4 },
      ],
      { duration: 700, easing: "cubic-bezier(.5,0,.75,0)" },
    )
    .finished.finally(() => ghost.remove());
}
