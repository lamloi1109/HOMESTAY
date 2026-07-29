"use client";

import { useState } from "react";

/**
 * useTactile — hover/press dùng chung cho phản hồi kiểu claymorphic.
 * Pointer event phủ cả chuột lẫn cảm ứng. Component nhận cờ trả về rồi áp vào
 * transform (nhấn thì nén, hover thì nhấc) và box-shadow.
 */
export function useTactile() {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const bind = {
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => {
      setHover(false);
      setPress(false);
    },
    onPointerDown: () => setPress(true),
    onPointerUp: () => setPress(false),
    onBlur: () => {
      setHover(false);
      setPress(false);
    },
  };
  return { hover, press, bind };
}

/** Chuỗi transform cho bề mặt bấm được. lift=false thì tắt hiệu ứng nhấc. */
export function tactileTransform(press: boolean, hover: boolean, lift?: boolean) {
  if (press) return "scale(var(--press-scale))";
  if (hover && lift !== false) return "translateY(var(--hover-lift))";
  return "none";
}
