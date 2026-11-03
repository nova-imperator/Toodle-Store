"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import styles from "./SearchBox.module.css";

const IDEAS = ["remote control cars", "teddy bears", "toys for 3 year olds", "birthday gift box", "puzzles", "water guns", "dollhouse"];

export function SearchBox() {
  const params = useSearchParams();
  const [idea, setIdea] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIdea((i) => (i + 1) % IDEAS.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <form action="/search" role="search" className={styles.form}>
      <label htmlFor="site-search" className="visually-hidden">
        Search toys
      </label>
      <Icon name="search" size={20} className={styles.icon} />
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={params.get("q") ?? ""}
        placeholder={`Search "${IDEAS[idea]}"`}
        autoComplete="off"
        enterKeyHint="search"
        className={styles.input}
      />
      <button type="submit" className={styles.submit}>
        Search
      </button>
    </form>
  );
}
