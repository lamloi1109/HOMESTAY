"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  errorLabel?: string;
}

export function LazyImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  imageClassName = "",
  errorLabel = "Image unavailable",
}: LazyImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <span className={`relative block h-full w-full overflow-hidden bg-[var(--surface-sunken)] ${className}`}>
      {status !== "error" && (
        <>
          <span
            aria-hidden="true"
            className={`gh-image-skeleton absolute inset-0 transition-opacity duration-300 ${status === "loaded" ? "opacity-0" : "opacity-100"}`}
          />
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            unoptimized={src.startsWith("http")}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={`transition-[opacity,transform,filter] duration-[var(--dur-slow)] ease-[var(--ease-out)] motion-reduce:transform-none ${
              status === "loaded" ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
            } ${imageClassName}`}
          />
        </>
      )}

      {status === "error" && (
        <span
          role="img"
          aria-label={`${errorLabel}: ${alt}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--surface-sunken)] px-3 text-center text-[var(--text-muted)]"
        >
          <ImageOff aria-hidden="true" size={28} strokeWidth={1.5} />
          <span className="font-sans text-xs">{errorLabel}</span>
        </span>
      )}
    </span>
  );
}

export default LazyImage;
