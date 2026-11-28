"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { parseVideo } from "@/lib/video";
import styles from "./ImagePicker.module.css";

const MAX_MB = 100;

/**
 * Optional product video, uploaded from the computer or phone straight to Vercel Blob storage
 * (see /api/admin/video-upload). Shows a preview; submitted as the "videoUrl" field.
 */
export function VideoPicker({ name, initial, error, enabled }: { name: string; initial: string; error?: string; enabled: boolean }) {
  const [url, setUrl] = useState(initial);
  const [progress, setProgress] = useState<number | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const video = parseVideo(url);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setProblem(null);
    if (!file.type.startsWith("video/")) return setProblem("Please choose a video file (MP4, MOV or WebM).");
    if (file.size > MAX_MB * 1024 * 1024) return setProblem(`That video is ${Math.round(file.size / 1024 / 1024)} MB. Please use one under ${MAX_MB} MB (a short 15–60 second clip is ideal).`);
    setProgress(0);
    try {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
      const blob = await upload(`product-videos/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/video-upload",
        multipart: file.size > 20 * 1024 * 1024,
        onUploadProgress: (p) => setProgress(Math.round(p.percentage)),
      });
      setUrl(blob.url);
    } catch (e) {
      setProblem((e as Error).message || "Upload failed. Please try again.");
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className={`${styles.wrap} ${styles.videoSection}`}>
      <input type="hidden" name={name} value={url} />
      <strong>
        Product video <span className={styles.optional}>(optional)</span>
      </strong>

      {url && video ? (
        <div className={styles.videoBox}>
          {video.kind === "youtube" ? (
            <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}`} title="Product video" className={styles.videoPreview} />
          ) : (
            <video src={video.src} controls playsInline preload="metadata" className={styles.videoPreview} />
          )}
          <div className={styles.tools}>
            <button type="button" onClick={() => input.current?.click()} disabled={!enabled || progress !== null}>
              Replace video
            </button>
            <button type="button" onClick={() => setUrl("")} className={styles.remove}>
              ✕ Remove
            </button>
          </div>
        </div>
      ) : progress !== null ? (
        <div className={`${styles.add} ${styles.loading}`} role="status">
          Uploading… {progress}%
        </div>
      ) : (
        <button type="button" className={styles.add} style={{ maxWidth: 320 }} onClick={() => input.current?.click()} disabled={!enabled}>
          <span aria-hidden="true">▶</span>
          Upload video
        </button>
      )}

      <input ref={input} type="file" accept="video/mp4,video/quicktime,video/webm" hidden onChange={(e) => void pick(e.target.files?.[0])} />

      <p className={styles.hint}>
        {enabled
          ? `MP4, MOV or WebM up to ${MAX_MB} MB. A short clip (15–60 seconds) works best. It shows as the last slide after the photos.`
          : "Video upload isn't switched on yet (needs a Blob store in Vercel)."}
      </p>
      {(problem || error) && (
        <p className={styles.error} role="alert">
          {problem ?? error}
        </p>
      )}
    </div>
  );
}
