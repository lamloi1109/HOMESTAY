import Link from "next/link";
import React from "react";
import { Icon } from "./gaoji/Icon";
import { Logo } from "./gaoji/Logo";

export function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--hairline)] pt-16 pb-12 text-[var(--text-body)]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[var(--hairline)]">
          {/* Col 1: Logo & Brand statement */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <Logo size="md" showTagline={false} />
            <p className="font-sans text-[0.9375rem] leading-relaxed text-[var(--text-muted)] max-w-sm mt-2">
              Bộ sưu tập căn hộ dịch vụ cao cấp tại Vinhomes Central Park. Không gian sống chuẩn mực, tiện nghi chuẩn khách sạn và tầm nhìn trực diện bờ sông Sài Gòn & Landmark 81.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="font-sans text-[0.75rem] uppercase tracking-[0.15em] text-[var(--gold-900)] font-semibold">
                Liên hệ trực tiếp:
              </span>
              <a
                href="https://zalo.me/0889237833"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0068FF] text-white text-xs font-sans font-medium rounded-none hover:opacity-90"
              >
                <Icon name="message-circle" size={13} color="#ffffff" />
                <span>Zalo 0889 237 833</span>
              </a>
            </div>
          </div>

          {/* Col 2: Units */}
          <div className="md:col-span-3">
            <h3 className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[var(--gold-900)] mb-4">
              Căn Hộ Vận Hành
            </h3>
            <ul className="flex flex-col gap-2.5 font-sans text-sm text-[var(--text-muted)]">
              <li>
                <Link href="/properties" className="hover:text-[var(--ink-900)] transition-colors">
                  L1.29.08 · Landmark 1 (2PN · 82 m²)
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[var(--ink-900)] transition-colors">
                  L3.44.09 · Landmark 3 (3PN · 108 m²)
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[var(--ink-900)] transition-colors">
                  L81.07.12 · Landmark 81 (1PN · 54 m²)
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[var(--ink-900)] transition-colors">
                  P1.27.10 · Park 1 (2PN · 85 m²)
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[var(--ink-900)] transition-colors">
                  P3.42.12 · Park 3 Penthouse (3PN · 140 m²)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Address & Info */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h3 className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[var(--gold-900)] mb-1">
              Địa Chỉ & Quản Lý
            </h3>
            <div className="flex items-start gap-2.5 font-sans text-sm text-[var(--text-muted)] leading-relaxed">
              <Icon name="map-pin" size={16} color="var(--gold-900)" className="mt-0.5 shrink-0" />
              <span>
                Khu đô thị Vinhomes Central Park, 208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
              </span>
            </div>
            <div className="flex items-center gap-2.5 font-sans text-sm text-[var(--text-muted)]">
              <Icon name="phone" size={16} color="var(--gold-900)" className="shrink-0" />
              <a href="tel:0889237833" className="hover:text-[var(--ink-900)]">
                Hotline: 088 923 7833
              </a>
            </div>
            <div className="flex items-center gap-2.5 font-sans text-sm text-[var(--text-muted)]">
              <Icon name="mail" size={16} color="var(--gold-900)" className="shrink-0" />
              <a href="mailto:stay@gaojihouse.vn" className="hover:text-[var(--ink-900)]">
                Email: stay@gaojihouse.vn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-[var(--text-muted)]">
          <span>© 2026 Gao Ji House. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span>Tiếng Việt · English · 中文</span>
            <span>VND (₫)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
