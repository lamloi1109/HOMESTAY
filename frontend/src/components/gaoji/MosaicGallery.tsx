"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Grid3X3, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface MosaicGalleryImage {
  src: string;
  alt: string;
}

interface MosaicGalleryProps {
  images: MosaicGalleryImage[];
  propertyName: string;
}

function GalleryImage({ image, priority = false, sizes }: { image: MosaicGalleryImage; priority?: boolean; sizes: string }) {
  return (
    <Image src={image.src} alt={image.alt} fill priority={priority} sizes={sizes} unoptimized={image.src.startsWith("http")}
      className="object-cover transition-[transform,filter] duration-300 ease-out group-hover:scale-[1.02] group-hover:brightness-95 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
  );
}

export function MosaicGallery({ images, propertyName }: MosaicGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openGallery = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActiveIndex(index);
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") setActiveIndex((current) => current === null ? null : (current - 1 + images.length) % images.length);
      if (event.key === "ArrowRight") setActiveIndex((current) => current === null ? null : (current + 1) % images.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [activeIndex, images.length]);

  if (images.length === 0) return null;
  const visibleImages = images.slice(0, 5);

  return (
    <>
      <div className="sm:hidden -mx-4">
        <button type="button" onClick={(event) => openGallery(0, event.currentTarget)}
          className="group relative block aspect-[4/3] w-full overflow-hidden bg-[var(--surface-sunken)] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--focus-ring)]"
          aria-label={`Mở thư viện ${images.length} ảnh của ${propertyName}`}>
          <GalleryImage image={visibleImages[0]} priority sizes="100vw" />
          <span className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/85 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-slate-900 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/85 dark:text-white">
            <Grid3X3 aria-hidden="true" size={16} strokeWidth={1.6} />
            1/{images.length} · Xem ảnh
          </span>
        </button>
      </div>

      <div className="hidden h-[clamp(480px,36vw,520px)] grid-cols-2 gap-2 sm:grid">
        <button type="button" onClick={(event) => openGallery(0, event.currentTarget)}
          className="group relative h-full overflow-hidden border border-[var(--hairline)] bg-[var(--surface-sunken)] focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          aria-label={`Mở ảnh 1: ${visibleImages[0].alt}`}>
          <GalleryImage image={visibleImages[0]} priority sizes="50vw" />
          <span className="absolute bottom-4 left-4 z-10 border border-white/20 bg-black/65 px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Hình ảnh thực tế căn hộ
          </span>
        </button>

        <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-2">
          {visibleImages.slice(1).map((image, index) => {
            const photoIndex = index + 1;
            const isLast = photoIndex === visibleImages.length - 1;
            return (
              <button key={`${image.src}-${photoIndex}`} type="button"
                onClick={(event) => openGallery(photoIndex, event.currentTarget)}
                className="group relative min-h-0 overflow-hidden border border-[var(--hairline)] bg-[var(--surface-sunken)] focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
                aria-label={`Mở ảnh ${photoIndex + 1}: ${image.alt}`}>
                <GalleryImage image={image} sizes="25vw" />
                {isLast && (
                  <span className="absolute bottom-4 right-4 z-10 inline-flex min-h-11 items-center gap-2 border border-white/30 bg-white/85 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-slate-900 shadow-sm backdrop-blur-md transition-[background-color,transform,box-shadow] duration-300 ease-out group-hover:scale-105 group-hover:bg-white group-hover:shadow-md dark:border-white/10 dark:bg-slate-900/85 dark:text-white dark:group-hover:bg-slate-900 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                    <Grid3X3 aria-hidden="true" size={16} strokeWidth={1.6} />
                    Xem tất cả {images.length} ảnh
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeIndex !== null && (
        <div role="dialog" aria-modal="true" aria-label={`Thư viện ảnh ${propertyName}`}
          className="fixed inset-0 z-[500] flex flex-col bg-black/95 text-white">
          <div className="flex min-h-16 items-center justify-between border-b border-white/15 px-4 sm:px-6">
            <p className="font-sans text-sm font-semibold tracking-wide">{activeIndex + 1} / {images.length}</p>
            <button ref={closeButtonRef} type="button" onClick={() => setActiveIndex(null)}
              className="inline-flex size-11 items-center justify-center border border-white/30 transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Đóng thư viện ảnh">
              <X aria-hidden="true" size={22} strokeWidth={1.6} />
            </button>
          </div>
          <div className="relative flex-1">
            <Image src={images[activeIndex].src} alt={images[activeIndex].alt} fill sizes="100vw" className="object-contain p-4 sm:p-8" priority unoptimized={images[activeIndex].src.startsWith("http")} />
            {images.length > 1 && <>
              <button type="button" onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/55 backdrop-blur-sm transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-6" aria-label="Xem ảnh trước">
                <ChevronLeft aria-hidden="true" size={26} strokeWidth={1.6} />
              </button>
              <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
                className="absolute right-3 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/55 backdrop-blur-sm transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6" aria-label="Xem ảnh tiếp theo">
                <ChevronRight aria-hidden="true" size={26} strokeWidth={1.6} />
              </button>
            </>}
          </div>
          <p className="px-6 pb-5 text-center font-sans text-sm text-white/80">{images[activeIndex].alt}</p>
        </div>
      )}
    </>
  );
}
