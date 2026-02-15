"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

type ImageLightboxProps = {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="画像を拡大表示"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-slate-700/80 p-2 text-white transition hover:bg-slate-600"
        aria-label="閉じる"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="h-auto w-auto max-h-[90vh] max-w-full object-contain"
          unoptimized={src.startsWith("http")}
        />
      </div>
    </div>
  );
}
