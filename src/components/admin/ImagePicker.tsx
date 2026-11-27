"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./ImagePicker.module.css";

const MAX_SIDE = 1600;

/** Shrinks big phone photos in the browser so uploads stay small (Vercel limits request size). */
async function shrink(file: File): Promise<Blob> {
  if (file.size < 1_500_000 || !file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.88));
    return blob ?? file;
  } catch {
    return file;
  }
}

async function upload(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", await shrink(file), file.name);
  const res = await fetch("/api/admin/uploads", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message ?? "Upload failed. Please try again.");
  return data.url as string;
}

/**
 * Product photos: pick from the computer / phone gallery / camera, see thumbnails, set the main photo,
 * reorder and remove. The list is submitted as the "images" field (one URL per line), like before.
 */
export function ImagePicker({ name, initial, error }: { name: string; initial: string; error?: string }) {
  const [images, setImages] = useState<string[]>(() => initial.split("\n").map((s) => s.trim()).filter(Boolean));
  const [uploading, setUploading] = useState(0);
  const [problem, setProblem] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setProblem(null);
    const list = Array.from(files).slice(0, 10);
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        const url = await upload(file);
        setImages((imgs) => [...imgs, url]);
      } catch (e) {
        setProblem(`${file.name}: ${(e as Error).message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (input.current) input.current.value = "";
  };

  const move = (i: number, to: number) =>
    setImages((imgs) => {
      if (to < 0 || to >= imgs.length) return imgs;
      const next = [...imgs];
      const [item] = next.splice(i, 1);
      next.splice(to, 0, item);
      return next;
    });

  const addLink = () => {
    const url = link.trim();
    if (!/^(\/|https:\/\/)/.test(url)) return setProblem("A link must start with https:// (or / for site images).");
    setImages((imgs) => [...imgs, url]);
    setLink("");
    setProblem(null);
  };

  return (
    <div className={styles.wrap}>
      <input type="hidden" name={name} value={images.join("\n")} />

      <ul className={styles.grid}>
        {images.map((src, i) => (
          <li key={`${src}-${i}`} className={styles.item} data-main={i === 0 || undefined}>
            <Image src={src} alt="" width={160} height={160} className={styles.thumb} unoptimized={src.startsWith("https://")} />
            {i === 0 ? <span className={styles.badge}>Main photo</span> : null}
            <div className={styles.tools}>
              {i > 0 && (
                <button type="button" onClick={() => move(i, 0)} title="Make main photo">
                  ★ Main
                </button>
              )}
              <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move left">
                ←
              </button>
              <button type="button" onClick={() => move(i, i + 1)} disabled={i === images.length - 1} aria-label="Move right">
                →
              </button>
              <button type="button" onClick={() => setImages((imgs) => imgs.filter((_, j) => j !== i))} aria-label="Remove photo" className={styles.remove}>
                ✕
              </button>
            </div>
          </li>
        ))}
        {Array.from({ length: uploading }, (_, i) => (
          <li key={`up-${i}`} className={`${styles.item} ${styles.loading}`} aria-label="Uploading">
            Uploading…
          </li>
        ))}
        <li>
          <button type="button" className={styles.add} onClick={() => input.current?.click()}>
            <span aria-hidden="true">＋</span>
            Add photos
          </button>
        </li>
      </ul>

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        hidden
        onChange={(e) => void addFiles(e.target.files)}
      />

      <p className={styles.hint}>
        Choose from your computer or phone (you can pick several). The first photo is the main one. Square photos with a plain background look best.
      </p>
      {(problem || error) && (
        <p className={styles.error} role="alert">
          {problem ?? error}
        </p>
      )}

      <details className={styles.linkBox}>
        <summary>Or add a photo by link</summary>
        <div>
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" aria-label="Photo link" />
          <button type="button" onClick={addLink}>
            Add
          </button>
        </div>
      </details>
    </div>
  );
}
