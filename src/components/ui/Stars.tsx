export function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  const r = Math.round(rating * 2) / 2;
  return (
    <span role="img" aria-label={`${r} out of 5 stars`} style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"
            fill={i <= r ? "var(--brick-yellow)" : "var(--line)"}
            stroke="var(--brick-yellow-deep)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}
