"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const CLOUD_NAME = "dbvawpfnt";
const UPLOAD_PRESET = "Unsigned";

export function PhotoUpload({
  currentUrl,
  onUpload,
}: {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Fichier non supporté. Choisis une image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "toutou");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message ?? "Erreur Cloudinary");
      }
      const url: string = data.secure_url;
      setPreview(url);
      onUpload(url);
    } catch (err) {
      console.error("[PhotoUpload]", err);
      setError("L'upload a échoué. Réessaie.");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[var(--color-ink-soft)]">
        Photo de profil
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-ring)] bg-white p-6 transition hover:border-[var(--color-orange)] hover:bg-orange-50/30"
      >
        {preview ? (
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md">
            <Image src={preview} alt="Photo du chien" fill className="object-cover" sizes="112px" />
          </div>
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[var(--color-card)] text-5xl">
            🐶
          </div>
        )}

        {uploading ? (
          <p className="text-sm font-medium text-[var(--color-orange)]">Upload en cours…</p>
        ) : (
          <p className="text-sm text-[var(--color-ink-soft)]">
            {preview ? "Cliquer ou glisser pour changer la photo" : "Cliquer ou glisser une photo"}
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {error && <p className="text-sm text-[var(--color-alert)]">{error}</p>}
    </div>
  );
}
