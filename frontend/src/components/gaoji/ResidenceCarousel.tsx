"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { IconButton } from "./IconButton";

export interface ResidenceCarouselSlide {
  src: string;
  alt: string;
  title: string;
  description: string;
  objectPosition?: string;
}

interface ResidenceCarouselProps {
  slides: ResidenceCarouselSlide[];
  previousLabel: string;
  nextLabel: string;
  regionLabel: string;
  className?: string;
}

export function ResidenceCarousel({
  slides,
  previousLabel,
  nextLabel,
  regionLabel,
  className = "",
}: ResidenceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartX = useRef<number | null>(null);

  if (slides.length === 0) return null;

  const showPrevious = () =>
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % slides.length);
  const activeSlide = slides[activeIndex];

  return (
    <section
      aria-label={regionLabel}
      aria-roledescription="carousel"
      className={`relative ${className}`.trim()}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") showPrevious();
        if (event.key === "ArrowRight") showNext();
      }}
      onPointerDown={(event) => {
        pointerStartX.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (pointerStartX.current === null) return;
        const distance = event.clientX - pointerStartX.current;
        pointerStartX.current = null;
        if (Math.abs(distance) < 48) return;
        if (distance > 0) showPrevious();
        else showNext();
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-x-3 translate-y-3 border border-[#B08D57]"
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-[#141F1C] md:aspect-[4/5]">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <Image
              key={slide.src}
              src={slide.src}
              alt={isActive ? slide.alt : ""}
              aria-hidden={!isActive}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className={`object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? "scale-100 opacity-100" : "scale-[1.025] opacity-0"
              }`}
              style={{ objectPosition: slide.objectPosition || "center" }}
            />
          );
        })}

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#081913]/95 via-[#081913]/45 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white sm:p-7">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <div className="min-w-0" aria-live="polite" aria-atomic="true">
              <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#E2C068]">
                {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-[clamp(1.4rem,2vw,2rem)] font-medium leading-tight text-white">
                {activeSlide.title}
              </h3>
              <p className="mt-2 max-w-[42ch] font-sans text-sm leading-relaxed text-white/80">
                {activeSlide.description}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <IconButton icon="arrow-left" label={previousLabel} variant="onDark" onClick={showPrevious} />
              <IconButton icon="arrow-right" label={nextLabel} variant="onDark" onClick={showNext} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResidenceCarousel;
