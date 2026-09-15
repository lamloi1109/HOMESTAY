"use client";

import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GALLERY_CATEGORY_LABELS,
  GALLERY_CATEGORY_ORDER,
  imageCategory,
  type GalleryCategory,
  type GalleryImage,
} from "./galleryTypes";
import { calculateJustifiedRows, useContainerWidth } from "./useJustifiedLayout";

interface AllPhotosGalleryProps {
  open: boolean;
  onClose: () => void;
  propertyName: string;
  images: readonly GalleryImage[];
  initialImageId?: string;
}

type Filter = "all" | GalleryCategory;

const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function GalleryPhoto({
  image,
  priority,
  onOpen,
  buttonRef,
}: {
  image: GalleryImage;
  priority: boolean;
  onOpen: () => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
}) {
  const [failed, setFailed] = useState(false);
  const source = image.thumbnailSrc ?? image.src;

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col overflow-hidden rounded-[10px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
      aria-label={`Xem ảnh lớn: ${image.alt}`}
    >
      <span className="relative block min-h-0 flex-1 overflow-hidden rounded-[10px] bg-stone-100">
        {!failed ? (
          <Image
            src={source}
            alt={image.alt}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 40vw, 32vw"
            loading={priority ? "eager" : "lazy"}
            unoptimized={source.startsWith("http")}
            onError={() => setFailed(true)}
            className="object-cover transition-[transform,filter] duration-200 ease-out group-hover:scale-[1.02] group-hover:brightness-95 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-500" role="img" aria-label={`Không tải được ${image.alt}`}>
            <ImageOff aria-hidden="true" size={28} strokeWidth={1.5} />
            <span className="px-3 text-center font-sans text-xs">Không tải được ảnh</span>
          </span>
        )}
      </span>
      {image.caption && (
        <span className="block w-full bg-white pt-2 font-sans text-sm leading-5 text-stone-600">
          {image.caption}
        </span>
      )}
    </button>
  );
}

function JustifiedSection({
  images,
  onOpen,
  registerThumbnail,
  priorityOffset,
}: {
  images: readonly GalleryImage[];
  onOpen: (image: GalleryImage) => void;
  registerThumbnail: (id: string, node: HTMLButtonElement | null) => void;
  priorityOffset: number;
}) {
  const { ref, width } = useContainerWidth<HTMLDivElement>();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const rows = useMemo(
    () => calculateJustifiedRows(images, width, isDesktop ? 270 : 205, 10),
    [images, isDesktop, width],
  );

  return (
    <div ref={ref}>
      <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:hidden">
        {images.map((image, index) => {
          const ratio = image.width / image.height;
          const spanBoth = index === 0 || ratio > 1.8;
          return (
            <div
              key={image.id}
              className={spanBoth ? "col-span-1 min-[360px]:col-span-2" : "col-span-1"}
              style={{ aspectRatio: spanBoth ? `${image.width} / ${image.height}` : "1 / 1" }}
            >
              <GalleryPhoto image={image} priority={priorityOffset + index < 4} onOpen={() => onOpen(image)} buttonRef={(node) => registerThumbnail(image.id, node)} />
            </div>
          );
        })}
      </div>

      <div className="hidden space-y-2.5 sm:block">
        {width === 0 ? (
          <div className="h-52 animate-pulse rounded-[10px] bg-stone-100" aria-label="Đang chuẩn bị bố cục ảnh" />
        ) : (
          rows.map((row, rowIndex) => (
            <div key={`${row.items[0]?.image.id}-${rowIndex}`} className="flex items-start gap-2.5">
              {row.items.map((item, itemIndex) => (
                <div key={item.image.id} className="shrink-0" style={{ width: item.width, height: item.height + (item.image.caption ? 28 : 0) }}>
                  <GalleryPhoto image={item.image} priority={priorityOffset + rowIndex + itemIndex < 4} onOpen={() => onOpen(item.image)} buttonRef={(node) => registerThumbnail(item.image.id, node)} />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function AllPhotosGallery({ open, onClose, propertyName, images, initialImageId }: AllPhotosGalleryProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [detailId, setDetailId] = useState<string | null>(() =>
    initialImageId && images.some((image) => image.id === initialImageId)
      ? initialImageId
      : null,
  );
  const [detailFailed, setDetailFailed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbnailRefs = useRef(new Map<string, HTMLButtonElement>());
  const gridScrollPosition = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const categories = useMemo(
    () => GALLERY_CATEGORY_ORDER.map((category) => ({
      category,
      images: images.filter((image) => imageCategory(image) === category),
    })).filter((group) => group.images.length > 0),
    [images],
  );
  const filteredImages = useMemo(
    () => filter === "all"
      ? categories.flatMap((group) => group.images)
      : images.filter((image) => imageCategory(image) === filter),
    [categories, filter, images],
  );
  const detailIndex = detailId ? filteredImages.findIndex((image) => image.id === detailId) : -1;
  const detailImage = detailIndex >= 0 ? filteredImages[detailIndex] : null;

  const returnToGrid = useCallback(() => {
    const returningId = detailId;
    setDetailId(null);
    requestAnimationFrame(() => {
      if (gridScrollRef.current) gridScrollRef.current.scrollTop = gridScrollPosition.current;
      if (returningId) thumbnailRefs.current.get(returningId)?.focus();
    });
  }, [detailId]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const bodyStyle = document.body.style.cssText;
    const galleryRoot = document.querySelector("[data-all-photos-gallery]");
    const siblings = [...document.body.children].filter((child) => child !== galleryRoot);
    siblings.forEach((child) => child.setAttribute("inert", ""));
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    closeRef.current?.focus();

    return () => {
      siblings.forEach((child) => child.removeAttribute("inert"));
      document.body.style.cssText = bodyStyle;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (detailId) returnToGrid(); else onClose();
        return;
      }
      if (detailId && event.key === "ArrowLeft" && detailIndex > 0) setDetailId(filteredImages[detailIndex - 1].id);
      if (detailId && event.key === "ArrowRight" && detailIndex < filteredImages.length - 1) setDetailId(filteredImages[detailIndex + 1].id);
      if (event.key === "Tab" && dialogRef.current) {
        const controls = [...dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)];
        if (controls.length === 0) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detailId, detailIndex, filteredImages, onClose, open, returnToGrid]);

  if (!open || typeof document === "undefined") return null;

  const selectFilter = (nextFilter: Filter) => {
    setFilter(nextFilter);
    setDetailId(null);
    requestAnimationFrame(() => { if (gridScrollRef.current) gridScrollRef.current.scrollTop = 0; });
  };
  const openDetail = (image: GalleryImage) => {
    gridScrollPosition.current = gridScrollRef.current?.scrollTop ?? 0;
    setDetailFailed(false);
    setDetailId(image.id);
  };
  const moveDetail = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= filteredImages.length) return;
    setDetailFailed(false);
    setDetailId(filteredImages[nextIndex].id);
  };

  return createPortal(
    <div data-all-photos-gallery ref={dialogRef} role="dialog" aria-modal="true" aria-label={`Tất cả ảnh của ${propertyName}`} className="fixed inset-0 z-[600] flex h-[100dvh] flex-col bg-[#fbfaf7] text-stone-900">
      <header className="z-30 shrink-0 border-b border-stone-200 bg-white pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg sm:text-2xl">{propertyName}</h2>
            <p className="font-sans text-xs text-stone-500">{filteredImages.length} / {images.length} ảnh</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-stone-300 px-3 font-sans text-sm font-semibold transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] sm:px-4" aria-label="Đóng và quay lại căn hộ">
            <X aria-hidden="true" size={19} />
            <span className="hidden sm:inline">Quay lại căn hộ</span>
          </button>
        </div>
        {!detailImage && images.length > 0 && (
          <nav aria-label="Lọc ảnh theo không gian" className="border-t border-stone-100">
            <div className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-3 py-2.5 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <FilterButton active={filter === "all"} onClick={() => selectFilter("all")}>Tất cả · {images.length}</FilterButton>
              {categories.map(({ category, images: groupImages }) => (
                <FilterButton key={category} active={filter === category} onClick={() => selectFilter(category)}>{GALLERY_CATEGORY_LABELS[category]} · {groupImages.length}</FilterButton>
              ))}
            </div>
          </nav>
        )}
      </header>

      {images.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <ImageOff aria-hidden="true" size={40} className="text-stone-400" />
          <h3 className="font-display text-2xl">Album chưa có ảnh</h3>
          <p className="font-sans text-sm text-stone-500">Ảnh thực tế của căn hộ sẽ được cập nhật sớm.</p>
        </div>
      ) : detailImage ? (
        <DetailViewer image={detailImage} index={detailIndex} total={filteredImages.length} failed={detailFailed} onError={() => setDetailFailed(true)} onBack={returnToGrid} onPrevious={() => moveDetail(detailIndex - 1)} onNext={() => moveDetail(detailIndex + 1)} onTouchStart={(event) => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={(event) => {
          const start = touchStart.current; const touch = event.changedTouches[0]; touchStart.current = null;
          if (!start) return; const dx = touch.clientX - start.x; const dy = touch.clientY - start.y;
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.35) moveDetail(detailIndex + (dx < 0 ? 1 : -1));
        }} />
      ) : (
        <div ref={gridScrollRef} className="flex-1 overflow-y-auto overscroll-contain pb-[calc(2rem+env(safe-area-inset-bottom))]">
          <main className="mx-auto max-w-[1440px] px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
            {filter === "all" ? categories.map(({ category, images: groupImages }, groupIndex) => (
              <GallerySection key={category} title={GALLERY_CATEGORY_LABELS[category]} images={groupImages} onOpen={openDetail} registerThumbnail={(id, node) => { if (node) thumbnailRefs.current.set(id, node); else thumbnailRefs.current.delete(id); }} priorityOffset={groupIndex * 10} />
            )) : (
              <GallerySection title={GALLERY_CATEGORY_LABELS[filter]} images={filteredImages} onOpen={openDetail} registerThumbnail={(id, node) => { if (node) thumbnailRefs.current.set(id, node); else thumbnailRefs.current.delete(id); }} priorityOffset={0} />
            )}
          </main>
        </div>
      )}
    </div>,
    document.body,
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-11 shrink-0 rounded-full border px-4 font-sans text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] ${active ? "border-[var(--jade-700)] bg-[var(--jade-700)] text-white" : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"}`}>{children}</button>;
}

function GallerySection({ title, images, onOpen, registerThumbnail, priorityOffset }: { title: string; images: readonly GalleryImage[]; onOpen: (image: GalleryImage) => void; registerThumbnail: (id: string, node: HTMLButtonElement | null) => void; priorityOffset: number }) {
  return <section className="mb-8 last:mb-0 sm:mb-10"><h3 className="mb-4 font-display text-2xl text-stone-900 sm:text-3xl">{title} <span className="font-sans text-sm font-normal text-stone-400">({images.length})</span></h3><JustifiedSection images={images} onOpen={onOpen} registerThumbnail={registerThumbnail} priorityOffset={priorityOffset} /></section>;
}

function DetailViewer({ image, index, total, failed, onError, onBack, onPrevious, onNext, onTouchStart, onTouchEnd }: { image: GalleryImage; index: number; total: number; failed: boolean; onError: () => void; onBack: () => void; onPrevious: () => void; onNext: () => void; onTouchStart: React.TouchEventHandler; onTouchEnd: React.TouchEventHandler }) {
  const source = image.fullSrc ?? image.src;
  return <div className="flex min-h-0 flex-1 flex-col bg-stone-950 text-white" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 px-3 sm:px-6"><button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 font-sans text-sm font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ArrowLeft aria-hidden="true" size={19} /> Về thư viện</button><span className="font-sans text-sm tabular-nums">{index + 1} / {total}</span></div>
    <div className="relative min-h-0 flex-1 touch-pan-y">
      {!failed ? <Image src={source} alt={image.alt} fill sizes="100vw" priority unoptimized={source.startsWith("http")} onError={onError} className="object-contain px-3 pb-3 sm:px-20 sm:pb-5" /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400" role="img" aria-label={`Không tải được ${image.alt}`}><ImageOff aria-hidden="true" size={36} /><span className="font-sans text-sm">Không tải được ảnh</span></div>}
      <DetailNav label="Ảnh trước" direction="left" disabled={index === 0} onClick={onPrevious} />
      <DetailNav label="Ảnh tiếp theo" direction="right" disabled={index === total - 1} onClick={onNext} />
    </div>
    <div className="shrink-0 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 text-center"><p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-white/60">{GALLERY_CATEGORY_LABELS[imageCategory(image)]}</p>{image.caption && <p className="mt-1 font-sans text-sm text-white/85">{image.caption}</p>}</div>
  </div>;
}

function DetailNav({ label, direction, disabled, onClick }: { label: string; direction: "left" | "right"; disabled: boolean; onClick: () => void }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return <button type="button" disabled={disabled} onClick={onClick} aria-label={label} className={`absolute top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 backdrop-blur-sm transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-25 sm:inline-flex ${direction === "left" ? "left-5" : "right-5"}`}><Icon aria-hidden="true" size={26} /></button>;
}
