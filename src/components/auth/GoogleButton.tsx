"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { LoginResult } from "@/types/auth";

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

/** Sign in with Google (and One Tap on phones). `clientId` comes from the server (GOOGLE_CLIENT_ID). */
export function GoogleButton({
  clientId,
  onSuccess,
  onError,
}: {
  clientId: string;
  onSuccess: (result: LoginResult) => void;
  onError: (message: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const handle = useCallback(
    async ({ credential }: { credential: string }) => {
      try {
        onSuccess(await api<LoginResult>("/api/auth/google", { body: { credential } }));
      } catch (e) {
        onError((e as Error).message);
      }
    },
    [onSuccess, onError],
  );

  useEffect(() => {
    const g = window.google?.accounts.id;
    if (!loaded || !g || !box.current) return;
    g.initialize({ client_id: clientId, callback: handle });
    // Fill the card (Google allows 200–400px) so it never overflows a small phone.
    const width = Math.max(200, Math.min(400, Math.floor(box.current.getBoundingClientRect().width)));
    g.renderButton(box.current, { theme: "outline", size: "large", shape: "pill", text: "continue_with", logo_alignment: "center", width });
    if (window.matchMedia("(max-width: 899px)").matches) g.prompt();
  }, [loaded, handle, clientId]);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => setLoaded(true)} />
      <div ref={box} style={{ width: "100%", display: "flex", justifyContent: "center" }} />
    </>
  );
}
