// Store icon set: 24px grid, 2px rounded strokes to match Baloo's round terminals.
const PATHS = {
  cart: "M3 4h2.2l2.1 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20.5 8H6.3 M9.5 20.5h.01 M17 20.5h.01",
  heart: "M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z",
  search: "M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z M16 16l4.5 4.5",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4.5 20.5c.9-3.6 3.9-5.5 7.5-5.5s6.6 1.9 7.5 5.5",
  menu: "M4 6.5h16 M4 12h16 M4 17.5h16",
  close: "M6 6l12 12 M18 6L6 18",
  left: "M14.5 5.5 8 12l6.5 6.5",
  right: "M9.5 5.5 16 12l-6.5 6.5",
  down: "M5.5 9.5 12 16l6.5-6.5",
  plus: "M12 5v14 M5 12h14",
  minus: "M5 12h14",
  truck: "M2.5 6.5h11v9h-11z M13.5 9.5h4l3 3v3h-7 M6.5 18.5a1.8 1.8 0 1 0 0-.01 M17 18.5a1.8 1.8 0 1 0 0-.01",
  shield: "M12 3.5 19 6v5.5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-2.5Z M9 12l2.2 2.2L15.5 10",
  phone: "M6.6 3.5h2.6l1.4 4-2 1.3a10.5 10.5 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6A2 2 0 0 1 18.4 19 15.4 15.4 0 0 1 4.5 5.1a2 2 0 0 1 2.1-1.6Z",
  whatsapp: "M4.5 19.5l1.2-3.7A8 8 0 1 1 8.6 19L4.5 19.5Z M9 8.5c0 3.3 2.9 6.5 6.5 6.5l1-1.6-2-1-1 .9a4.8 4.8 0 0 1-2.6-2.6l.9-1-1-2L9 8.5Z",
  cash: "M3 7h18v10H3z M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z M6 10v.01 M18 14v.01",
  gift: "M4 10h16v10H4z M3 7h18v3H3z M12 7v13 M12 7c-1.5-3-5-3.5-5-1.2C7 7 9 7 12 7Zm0 0c1.5-3 5-3.5 5-1.2C17 7 15 7 12 7Z",
  box: "M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4v-9Z M3.5 7.5 12 11.5l8.5-4 M12 11.5v9",
  instagram: "M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Z M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z M17 7v.01",
  filter: "M4 6h16 M7 12h10 M10 18h4",
  mail: "M3.5 6h17v12h-17z M3.5 6.5 12 13l8.5-6.5",
  check: "M5 12.5 10 17.5 19 7",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  alert: "M12 4 21 19.5H3L12 4Z M12 10v4 M12 17v.01",
  logout: "M14.5 4.5h4v15h-4 M10 16l4-4-4-4 M14 12H4",
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  filled?: boolean;
  className?: string;
  label?: string;
}

export function Icon({ name, size = 24, filled = false, className, label }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
