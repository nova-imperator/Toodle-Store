"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

interface GoogleId {
  initialize: (o: { client_id: string; callback: (r: { credential: string }) => void; auto_select?: boolean }) => void;
  renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
  prompt: () => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/** Sign in with Google (and One Tap on phones). Hidden when no client id is configured. */
export function GoogleButton({ onSuccess, onError }: { onSuccess: () => void; onError: (message: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const handle = useCallback(
    async ({ credential }: { credential: string }) => {
      try {
        await api("/api/auth/google", { body: { credential } });
        onSuccess();
      } catch (e) {
        onError((e as Error).message);
      }
    },
    [onSuccess, onError],
  );

  useEffect(() => {
    const g = window.google?.accounts.id;
    if (!loaded || !g || !CLIENT_ID || !box.current) return;
    g.initialize({ client_id: CLIENT_ID, callback: handle });
    g.renderButton(box.current, { theme: "outline", size: "large", shape: "pill", text: "continue_with", width: 320 });
    if (window.matchMedia("(max-width: 899px)").matches) g.prompt();
  }, [loaded, handle]);

  if (!CLIENT_ID) return null;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => setLoaded(true)} />
      <div ref={box} />
    </>
  );
}
