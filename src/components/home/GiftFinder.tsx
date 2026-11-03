"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AGE_GROUPS, BUDGETS } from "@/config/catalogue";
import { api } from "@/lib/api";
import { ProductCarousel } from "./ProductCarousel";
import { StudLoader } from "@/components/ui/StudLoader";
import type { ProductCardData } from "@/types/catalogue";
import styles from "./GiftFinder.module.css";

type State = { status: "idle" } | { status: "loading" } | { status: "done"; items: ProductCardData[] } | { status: "error"; message: string };

export function GiftFinder() {
  const [age, setAge] = useState<string | null>(null);
  const [max, setMax] = useState<number | null>(null);
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    if (!age || !max) return;
    let live = true;
    setState({ status: "loading" });
    api<{ items: ProductCardData[] }>(`/api/gift-finder?age=${age}&max=${max}`)
      .then((r) => live && setState({ status: "done", items: r.items }))
      .catch((e: Error) => live && setState({ status: "error", message: e.message }));
    return () => {
      live = false;
    };
  }, [age, max]);

  const ageName = AGE_GROUPS.find((a) => a.slug === age)?.name;

  return (
    <div className={styles.box}>
      <div className={styles.steps}>
        <fieldset className={styles.step}>
          <legend>
            <span className={styles.num}>1</span> How old are they?
          </legend>
          <div className={styles.chips}>
            {AGE_GROUPS.map((a) => (
              <button key={a.slug} type="button" className={styles.chip} data-color={a.color} aria-pressed={age === a.slug} onClick={() => setAge(a.slug)}>
                {a.name}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className={styles.step} disabled={!age}>
          <legend>
            <span className={styles.num}>2</span> What&apos;s your budget?
          </legend>
          <div className={styles.chips}>
            {BUDGETS.map((b) => (
              <button key={b.max} type="button" className={styles.chip} data-color="green" aria-pressed={max === b.max} onClick={() => setMax(b.max)}>
                {b.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={styles.result} aria-live="polite">
        {state.status === "idle" && <p className={styles.hint}>Pick an age and a budget and we&apos;ll show gifts that fit.</p>}
        {state.status === "loading" && <StudLoader label="Finding gifts" />}
        {state.status === "error" && <p className={styles.hint}>{state.message}</p>}
        {state.status === "done" &&
          (state.items.length ? (
            <>
              <p className={styles.found}>
                {state.items.length} gift ideas for {ageName} under ₹{max!.toLocaleString("en-IN")}
              </p>
              <ProductCarousel products={state.items} label="Gift ideas" />
              <Link href={`/age/${age}?max=${max}`} className={styles.more}>
                See every toy for {ageName} under ₹{max!.toLocaleString("en-IN")}
              </Link>
            </>
          ) : (
            <p className={styles.hint}>
              Nothing in that budget yet for {ageName}. Try the next budget up.
            </p>
          ))}
      </div>
    </div>
  );
}
