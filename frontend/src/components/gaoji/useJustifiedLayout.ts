"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GalleryImage } from "./galleryTypes";

export interface JustifiedItem {
  image: GalleryImage;
  width: number;
  height: number;
}

export interface JustifiedRow {
  items: JustifiedItem[];
  height: number;
  complete: boolean;
}

const MIN_RATIO = 0.6;
const MAX_RATIO = 2.8;

const displayRatio = (image: GalleryImage) =>
  Math.min(MAX_RATIO, Math.max(MIN_RATIO, image.width / image.height));

/** Builds true justified rows. Complete rows fill the container; the final row keeps target height. */
export function calculateJustifiedRows(
  images: readonly GalleryImage[],
  containerWidth: number,
  targetHeight: number,
  gap: number,
): JustifiedRow[] {
  if (containerWidth <= 0 || images.length === 0) return [];

  const rows: JustifiedRow[] = [];
  let pending: GalleryImage[] = [];
  let ratioSum = 0;

  const addRow = (rowImages: GalleryImage[], complete: boolean) => {
    const ratios = rowImages.map(displayRatio);
    const availableWidth = containerWidth - gap * (rowImages.length - 1);
    const justifiedHeight = availableWidth / ratios.reduce((sum, ratio) => sum + ratio, 0);
    const height = complete ? Math.min(targetHeight * 1.22, justifiedHeight) : targetHeight;
    rows.push({
      complete,
      height,
      items: rowImages.map((image, index) => ({
        image,
        height,
        width: Math.min(containerWidth, height * ratios[index]),
      })),
    });
  };

  for (const image of images) {
    pending.push(image);
    ratioSum += displayRatio(image);
    const proposedHeight =
      (containerWidth - gap * (pending.length - 1)) / ratioSum;
    if (proposedHeight <= targetHeight && pending.length > 1) {
      addRow(pending, true);
      pending = [];
      ratioSum = 0;
    }
  }

  if (pending.length > 0) addRow(pending, false);
  return rows;
}

/** Measures the actual gallery column and only commits width changes once per animation frame. */
export function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setWidth(Math.round(entry.contentRect.width)));
    });
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return useMemo(() => ({ ref, width }), [width]);
}
