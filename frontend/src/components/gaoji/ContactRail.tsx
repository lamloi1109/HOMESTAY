"use client";

import React from "react";
import { Icon } from "./Icon";

export interface ContactRailProps {
  zalo?: string;
  phone?: string;
  email?: string;
  wechat?: string;
  telegram?: string;
  onInquire?: () => void;
  style?: React.CSSProperties;
}

export function ContactRail({
  zalo = "https://zalo.me/0889237833",
  phone = "0889237833",
  email = "stay@gaojihouse.vn",
  wechat,
  telegram,
  onInquire,
  style,
}: ContactRailProps) {
  const items = [
    zalo && {
      icon: "message-circle",
      label: "Chat Zalo",
      bgColor: "var(--channel-zalo, #0068FF)",
      href: zalo,
    },
    wechat && {
      icon: "message-square",
      label: "WeChat",
      bgColor: "var(--channel-wechat, #07C160)",
      href: wechat.startsWith("http") || wechat.startsWith("weixin://") ? wechat : `weixin://dl/chat?${wechat}`,
    },
    telegram && {
      icon: "send",
      label: "Telegram",
      bgColor: "#229ED9",
      href: telegram.startsWith("http") ? telegram : `https://t.me/${telegram}`,
    },
    phone && {
      icon: "phone",
      label: "Gọi Hotline",
      bgColor: "var(--jade-700, #1F3A2E)",
      href: `tel:${phone}`,
    },
    email && {
      icon: "mail",
      label: "Gửi Email",
      bgColor: "var(--ink-900, #1A1A1A)",
      href: `mailto:${email}`,
    },
  ].filter(Boolean) as { icon: string; label: string; bgColor: string; href: string }[];

  return (
    <aside
      className="fixed right-4 bottom-6 z-50 flex flex-col items-end gap-2.5 select-none"
      style={style}
      aria-label="Kênh liên hệ nhanh"
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          title={item.label}
          className="group relative flex items-center justify-center w-12 h-12 text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{ background: item.bgColor, borderRadius: "50%" }}
        >
          <Icon name={item.icon} size={20} color="#ffffff" />
          <span className="absolute right-14 px-2.5 py-1 bg-[var(--ink-900)] text-[var(--paper-100)] text-[0.6875rem] font-sans font-semibold uppercase tracking-[0.12em] whitespace-nowrap shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-none">
            {item.label}
          </span>
        </a>
      ))}

      {onInquire && (
        <button
          type="button"
          onClick={onInquire}
          className="px-4 py-3 bg-[var(--gold-500)] text-[var(--ink-900)] font-sans text-[0.75rem] font-semibold uppercase tracking-[0.15em] shadow-lg border border-[var(--gold-500)] hover:bg-[var(--gold-600)] transition-colors cursor-pointer rounded-none"
        >
          Hỏi Giá / Đặt Phòng
        </button>
      )}
    </aside>
  );
}

export default ContactRail;
