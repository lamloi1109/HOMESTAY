"use client";

import { Grid3X3 } from "lucide-react";
import { useRef, useState } from "react";
import { AllPhotosGallery } from "./AllPhotosGallery";
import { LazyImage } from "./LazyImage";
import type { GalleryImage } from "./galleryTypes";

interface MosaicGalleryProps {
  images: readonly GalleryImage[];
  propertyName: string;
}

function GalleryImage({ image, priority = false, sizes }: { image: GalleryImage; priority?: boolean; sizes: string }) {
  const source = image.thumbnailSrc ?? image.src;
  return (
    <LazyImage
      src={source}
      alt={image.alt}
      priority={priority}
      sizes={sizes}
      imageClassName="object-cover group-hover:scale-[1.02] group-hover:brightness-95 motion-reduce:group-hover:scale-100"
    />
  );
}

export function MosaicGallery({ images, propertyName }: MosaicGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialImageId, setInitialImageId] = useState<string>();
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const visibleImages = images.slice(0, 5);
  const secondaryCount = Math.max(0, visibleImages.length - 1);

  const desktopColumns = visibleImages.length === 1
    ? "grid-cols-1"
    : visibleImages.length === 2
      ? "grid-cols-[2fr_1fr]"
      : "grid-cols-2";
  const secondaryGrid = secondaryCount === 1
    ? "grid-cols-1 grid-rows-1"
    : secondaryCount === 2
      ? "grid-cols-1 grid-rows-2"
      : "grid-cols-2 grid-rows-2";

  const openGrid = (trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setInitialImageId(undefined);
    setGalleryOpen(true);
  };
  const openImage = (id: string, trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setInitialImageId(id);
    setGalleryOpen(true);
  };

  if (visibleImages.length === 0) return null;

  return (
    <>
      <div className="-mx-4 sm:hidden">
        <button
          type="button"
          onClick={(event) => openGrid(event.currentTarget)}
          className="group relative block aspect-[4/3] w-full overflow-hidden bg-[var(--surface-sunken)] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--focus-ring)]"
          aria-label={`Mở thư viện ${images.length} ảnh của ${propertyName}`}
        >
          <GalleryImage image={visibleImages[0]} priority sizes="100vw" />
          <span className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/85 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-slate-900 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/85 dark:text-white">
            <Grid3X3 aria-hidden="true" size={16} strokeWidth={1.6} />
            1/{images.length} · Xem ảnh
          </span>
        </button>
      </div>

      <div className={`hidden h-[clamp(480px,36vw,520px)] gap-2 sm:grid ${desktopColumns}`}>
        <button
          type="button"
          onClick={(event) => openImage(visibleImages[0].id, event.currentTarget)}
          className="group relative h-full overflow-hidden border border-[var(--hairline)] bg-[var(--surface-sunken)] focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          aria-label={`Mở ảnh 1: ${visibleImages[0].alt}`}
        >
          <GalleryImage
            image={visibleImages[0]}
            priority
            sizes={visibleImages.length === 1 ? "100vw" : visibleImages.length === 2 ? "67vw" : "50vw"}
          />
          <span className="absolute bottom-4 left-4 z-10 border border-white/20 bg-black/65 px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Hình ảnh thực tế căn hộ
          </span>
        </button>

        {secondaryCount > 0 && <div className={`grid min-h-0 gap-2 ${secondaryGrid}`}>
          {visibleImages.slice(1).map((image, index) => {
            const isLast = index === visibleImages.length - 2;
            const fillsSparseRow = secondaryCount === 3 && index === 0;
            return (
              <button
                key={image.id}
                type="button"
                onClick={(event) => isLast
                  ? openGrid(event.currentTarget)
                  : openImage(image.id, event.currentTarget)}
                className={`group relative min-h-0 overflow-hidden border border-[var(--hairline)] bg-[var(--surface-sunken)] focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] ${fillsSparseRow ? "col-span-2" : ""}`}
                aria-label={isLast ? `Xem tất cả ${images.length} ảnh` : `Mở ảnh ${index + 2}: ${image.alt}`}
              >
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
        </div>}
      </div>

      {galleryOpen && (
        <AllPhotosGallery
          open
          onClose={() => {
            setGalleryOpen(false);
            requestAnimationFrame(() => openerRef.current?.focus());
          }}
          propertyName={propertyName}
          images={images}
          initialImageId={initialImageId}
        />
      )}
    </>
  );
}
