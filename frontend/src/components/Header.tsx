"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./gaoji/Button";
import { Icon } from "./gaoji/Icon";
import { InquiryModal } from "./gaoji/InquiryModal";
import { Logo } from "./gaoji/Logo";

export const NAV_HEIGHT = 76;

export function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 bg-[var(--canvas-warm)]/95 backdrop-blur-md border-b border-[var(--hairline)] transition-all duration-200"
        style={{ height: NAV_HEIGHT }}
      >
        <div className="max-w-[1360px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Logo size="sm" showTagline={false} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 font-sans font-medium uppercase tracking-[0.14em] text-[0.8125rem]">
            <Link
              href="/#units"
              className="text-[var(--text-body)] hover:text-[var(--gold-900)] transition-colors py-1"
            >
              Bộ Sưu Tập Căn Hộ
            </Link>
            <Link
              href="/#location"
              className="text-[var(--text-body)] hover:text-[var(--gold-900)] transition-colors py-1"
            >
              Vị Trí & Tiện Ích
            </Link>
            <Link
              href="/#services"
              className="text-[var(--text-body)] hover:text-[var(--gold-900)] transition-colors py-1"
            >
              Dịch Vụ Cư Trú
            </Link>
            <a
              href="tel:0889237833"
              className="flex items-center gap-1.5 text-[var(--jade-700)] hover:text-[var(--jade-900)] font-semibold transition-colors"
            >
              <Icon name="phone" size={14} />
              <span>088 923 7833</span>
            </a>
          </nav>

          {/* Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              as="a"
              href="https://zalo.me/0889237833"
              target="_blank"
              icon="message-circle"
            >
              Zalo
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={() => setModalOpen(true)}
              icon="calendar"
            >
              Đặt Phòng / Hỏi Giá
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <Button
              variant="gold"
              size="sm"
              onClick={() => setModalOpen(true)}
            >
              Hỏi Giá
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--ink-900)] hover:text-[var(--gold-900)]"
              aria-label="Menu"
            >
              <Icon name={mobileMenuOpen ? "x" : "sliders-horizontal"} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-[76px] left-0 right-0 bg-[var(--canvas-warm)] border-b border-[var(--gold-700)] shadow-xl p-5 grid gap-4 animate-in slide-in-from-top-2">
            <Link
              href="/#units"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans font-semibold uppercase tracking-[0.14em] text-sm text-[var(--ink-900)] py-2 border-b border-[var(--hairline)]"
            >
              Bộ Sưu Tập Căn Hộ
            </Link>
            <Link
              href="/#location"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans font-semibold uppercase tracking-[0.14em] text-sm text-[var(--ink-900)] py-2 border-b border-[var(--hairline)]"
            >
              Vị Trí & Tiện Ích
            </Link>
            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans font-semibold uppercase tracking-[0.14em] text-sm text-[var(--ink-900)] py-2 border-b border-[var(--hairline)]"
            >
              Dịch Vụ Cư Trú
            </Link>
            <div className="pt-2 flex flex-col gap-2.5">
              <Button
                variant="outline"
                full
                as="a"
                href="https://zalo.me/0889237833"
                target="_blank"
                icon="message-circle"
              >
                Chat Zalo (0889 237 833)
              </Button>
              <Button
                variant="gold"
                full
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModalOpen(true);
                }}
              >
                Đặt Phòng / Hỏi Giá Trực Tiếp
              </Button>
            </div>
          </div>
        )}
      </header>

      <InquiryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
