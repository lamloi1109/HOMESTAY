"use client";

import Link from "next/link";
import React from "react";
import { useLanguage, type LanguageCode } from "@/context/LanguageContext";
import { Icon } from "./gaoji/Icon";
import { Logo } from "./gaoji/Logo";

const FOOTER_DATA: Record<
  LanguageCode,
  {
    desc: string;
    addr: string;
    phone: string;
    email: string;
    footNote: string;
    langsNote: string;
    currency: string;
    columns: { title: string; items: string[] }[];
  }
> = {
  vi: {
    desc: "Gao Ji House — Cho thuê và tự vận hành năm căn hộ dịch vụ cao cấp tại Landmark 1, Landmark 3, Landmark 81, Park 1 và Park 3 trong Vinhomes Central Park.",
    addr: "208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP. Hồ Chí Minh",
    phone: "088 923 7833",
    email: "stay@gaojihouse.vn",
    footNote: "© 2026 Gao Ji House · Căn Hộ Dịch Vụ Cho Thuê · Vinhomes Central Park",
    langsNote: "Tiếng Việt · English · 中文",
    currency: "VNĐ (₫)",
    columns: [
      {
        title: "Căn Hộ Dịch Vụ",
        items: [
          "1 Phòng Ngủ · Từ 24 Triệu",
          "2 Phòng Ngủ · Từ 33 Triệu",
          "Penthouse Duplex",
          "Lưu Trú Doanh Nghiệp",
        ],
      },
      {
        title: "Dịch Vụ Cư Dân",
        items: [
          "Dọn Phòng 2 Lần / Tuần",
          "Lễ Tân 24/7 Đa Ngữ",
          "Đăng Ký Tạm Trú",
          "Đưa Đón Sân Bay",
        ],
      },
      {
        title: "Liên Hệ",
        items: [
          "Zalo · 088 923 7833",
          "Telegram · @HZM81MS",
          "WeChat · HZM81MS",
          "Email · stay@gaojihouse.vn",
        ],
      },
    ],
  },
  en: {
    desc: "Gao Ji House — Self-operated collection of five premium serviced apartments across Landmark 1, Landmark 3, Landmark 81, Park 1 and Park 3 in Vinhomes Central Park.",
    addr: "208 Nguyen Huu Canh, Ward 22, Binh Thanh, Ho Chi Minh City",
    phone: "088 923 7833",
    email: "stay@gaojihouse.vn",
    footNote: "© 2026 Gao Ji House · Serviced Apartments For Rent · Vinhomes Central Park",
    langsNote: "Tiếng Việt · English · 中文",
    currency: "VND (₫)",
    columns: [
      {
        title: "Serviced Apartments",
        items: [
          "1 Bedroom · From 24M VND",
          "2 Bedrooms · From 33M VND",
          "Penthouse Duplex",
          "Corporate Stays",
        ],
      },
      {
        title: "Resident Services",
        items: [
          "Housekeeping Twice A Week",
          "24/7 Multilingual Reception",
          "Residence Registration",
          "Airport Pickup",
        ],
      },
      {
        title: "Contact",
        items: [
          "Zalo · 088 923 7833",
          "Telegram · @HZM81MS",
          "WeChat · HZM81MS",
          "Email · stay@gaojihouse.vn",
        ],
      },
    ],
  },
  cn: {
    desc: "Gao Ji House — 在 Vinhomes Central Park 自营 Landmark 1、Landmark 3、Landmark 81 与 Park 1、Park 3 五套高级服务式公寓。",
    addr: "208 Nguyen Huu Canh, 22 坊, 平盛郡, 胡志明市",
    phone: "088 923 7833",
    email: "stay@gaojihouse.vn",
    footNote: "© 2026 Gao Ji House · 服务式公寓租赁 · Vinhomes Central Park",
    langsNote: "Tiếng Việt · English · 中文",
    currency: "越盾 (₫)",
    columns: [
      {
        title: "服务式公寓",
        items: [
          "一房 · 2400 万越盾起",
          "两房 · 3300 万越盾起",
          "顶层复式公寓",
          "企业长租",
        ],
      },
      {
        title: "住户服务",
        items: [
          "每周清洁两次",
          "24/7 多语种前台",
          "临时居住登记",
          "机场接送",
        ],
      },
      {
        title: "联系方式",
        items: [
          "Zalo · 088 923 7833",
          "Telegram · @HZM81MS",
          "微信 · HZM81MS",
          "邮箱 · stay@gaojihouse.vn",
        ],
      },
    ],
  },
  tw: {
    desc: "Gao Ji House — 在 Vinhomes Central Park 自營 Landmark 1、Landmark 3、Landmark 81 與 Park 1、Park 3 五套高級服務式公寓。",
    addr: "208 Nguyen Huu Canh, 22 坊, 平盛郡, 胡志明市",
    phone: "088 923 7833",
    email: "stay@gaojihouse.vn",
    footNote: "© 2026 Gao Ji House · 服務式公寓租賃 · Vinhomes Central Park",
    langsNote: "Tiếng Việt · English · 中文",
    currency: "越盾 (₫)",
    columns: [
      {
        title: "服務式公寓",
        items: [
          "一房 · 2400 萬越盾起",
          "兩房 · 3300 萬越盾起",
          "頂層複式公寓",
          "企業長租",
        ],
      },
      {
        title: "住戶服務",
        items: [
          "每週清潔兩次",
          "24/7 多語種前台",
          "臨時居住登記",
          "機場接送",
        ],
      },
      {
        title: "聯繫方式",
        items: [
          "Zalo · 088 923 7833",
          "Telegram · @HZM81MS",
          "微信 · HZM81MS",
          "Email · stay@gaojihouse.vn",
        ],
      },
    ],
  },
};

export function Footer() {
  const { lang } = useLanguage();
  const t = FOOTER_DATA[lang] || FOOTER_DATA.vi;

  return (
    <footer className="bg-[var(--surface-ink,#1A1A1A)] text-[var(--text-inverse,#FAF3EA)] pt-16 sm:pt-20 pb-12 px-[clamp(20px,4vw,56px)] border-t border-[var(--gold-700)]">
      <div className="max-w-[1600px] mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[rgba(212,175,55,0.22)]">
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col items-start gap-3.5">
            <Logo variant="dark" size="sm" showTagline={false} />
            <p className="font-sans text-sm sm:text-base leading-relaxed text-[var(--paper-150)]/75 max-w-sm mt-1">
              {t.desc}
            </p>

            <div className="mt-3 flex flex-col gap-2 font-sans text-xs sm:text-sm text-[var(--paper-150)]/85">
              <span className="flex items-center gap-2.5">
                <Icon name="map-pin" size={14} color="var(--gold-500)" />
                <span>{t.addr}</span>
              </span>
              <span className="flex items-center gap-2.5">
                <Icon name="phone" size={14} color="var(--gold-500)" />
                <a
                  href={`tel:${t.phone.replace(/\s+/g, "")}`}
                  className="hover:text-[var(--gold-500)] transition-colors no-underline text-inherit"
                >
                  {t.phone}
                </a>
              </span>
              <span className="flex items-center gap-2.5">
                <Icon name="mail" size={14} color="var(--gold-500)" />
                <a
                  href={`mailto:${t.email}`}
                  className="hover:text-[var(--gold-500)] transition-colors no-underline text-inherit"
                >
                  {t.email}
                </a>
              </span>
            </div>
          </div>

          {/* Dynamic 3 Columns */}
          {t.columns.map((col, idx) => (
            <div key={idx} className="lg:col-span-2 xl:col-span-2.5 flex flex-col gap-3">
              <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--gold-050)]">
                {col.title}
              </span>
              <hr className="h-px border-0 bg-[rgba(212,175,55,0.28)] my-1" />
              <ul className="flex flex-col gap-2.5 font-sans text-xs sm:text-sm text-[var(--paper-150)]/75 list-none p-0">
                {col.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      href="/#units"
                      className="hover:text-[var(--gold-050)] transition-colors no-underline text-inherit"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 4: Kênh Tư Vấn Trực Tiếp */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--gold-050)]">
              {lang === "vi"
                ? "Kênh Trực Tiếp"
                : lang === "en"
                ? "Direct Channels"
                : "直连通道"}
            </span>
            <hr className="h-px border-0 bg-[rgba(212,175,55,0.28)] my-1" />
            <div className="flex flex-col gap-2 font-sans text-xs">
              <a
                href="https://zalo.me/0889237833"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--channel-zalo)] text-white hover:opacity-90 transition-opacity font-semibold uppercase tracking-wider no-underline"
              >
                <Icon name="message-circle" size={14} color="#ffffff" />
                <span>Zalo 088 923 7833</span>
              </a>
              <a
                href="weixin://dl/chat?HZM81MS"
                className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--channel-wechat)] text-white hover:opacity-90 transition-opacity font-semibold uppercase tracking-wider no-underline"
              >
                <Icon name="message-square" size={14} color="#ffffff" />
                <span>WeChat: HZM81MS</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs uppercase tracking-[0.15em] text-[var(--paper-150)]/50">
          <span>{t.footNote}</span>
          <div className="flex items-center gap-6">
            <span>{t.langsNote}</span>
            <span>{t.currency}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
