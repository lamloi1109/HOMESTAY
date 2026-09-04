"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLanguage, type LanguageCode } from "@/context/LanguageContext";
import { Button } from "./gaoji/Button";
import { Icon } from "./gaoji/Icon";
import { InquiryModal } from "./gaoji/InquiryModal";
import { Logo } from "./gaoji/Logo";

const HEADER_LABELS: Record<
  LanguageCode,
  {
    navAria: string;
    menuAria: string;
    langAria: string;
    navUnits: string;
    navLoc: string;
    navAmen: string;
    navAbout: string;
    btnBook: string;
    navCall: string;
    authOpen: string;
    authLine: string;
    logout: string;
    tabLogin: string;
    tabReg: string;
    authTitleL: string;
    authSubL: string;
    authTitleR: string;
    authSubR: string;
    fName: string;
    fEmail: string;
    fPhone: string;
    fPass: string;
    phName: string;
    phEmail: string;
    phPhone: string;
    phPass: string;
    btnLogin: string;
    btnReg: string;
    forgot: string;
    orZalo: string;
    btnZalo: string;
    agree: string;
    errEmpty: string;
    errAgree: string;
    switchToReg: string;
    switchToLogin: string;
    closeAria: string;
    mTypes: string[];
  }
> = {
  vi: {
    navAria: "Điều hướng chính",
    menuAria: "Mở menu",
    langAria: "Ngôn ngữ",
    navUnits: "Căn Hộ & Giá Thuê",
    navLoc: "Vị Trí",
    navAmen: "Tiện Ích",
    navAbout: "Về Chúng Tôi",
    btnBook: "Đặt Phòng Ngay",
    navCall: "Gọi 088 923 7833",
    authOpen: "Đăng Nhập",
    authLine: "Đăng Nhập / Đăng Ký",
    logout: "Đăng Xuất",
    tabLogin: "Đăng Nhập",
    tabReg: "Đăng Ký",
    authTitleL: "Đăng Nhập Tài Khoản Khách Thuê",
    authSubL: "Xem hợp đồng, lịch dọn phòng, hoá đơn và yêu cầu bảo trì của căn đang thuê.",
    authTitleR: "Tạo Tài Khoản Khách Thuê",
    authSubR: "Gao Ji House xác nhận tài khoản qua Zalo trong 2 giờ làm việc.",
    fName: "Họ Và Tên",
    fEmail: "Email",
    fPhone: "Số Điện Thoại · Zalo",
    fPass: "Mật Khẩu",
    phName: "Nguyễn Văn A",
    phEmail: "ten@congty.vn",
    phPhone: "09xx xxx xxx",
    phPass: "Tối thiểu 8 ký tự",
    btnLogin: "Đăng Nhập",
    btnReg: "Tạo Tài Khoản",
    forgot: "Quên mật khẩu? Nhắn Zalo",
    orZalo: "Hoặc",
    btnZalo: "Tiếp Tục Với Zalo",
    agree: "Đồng ý điều khoản thuê và chính sách lưu trữ thông tin của Gao Ji House.",
    errEmpty: "Vui lòng nhập đầy đủ thông tin.",
    errAgree: "Vui lòng đồng ý điều khoản thuê.",
    switchToReg: "Chưa có tài khoản? Đăng ký",
    switchToLogin: "Đã có tài khoản? Đăng nhập",
    closeAria: "Đóng",
    mTypes: ["1 Phòng Ngủ", "2 Phòng Ngủ", "Penthouse Duplex", "Chưa Xác Định"],
  },
  en: {
    navAria: "Main navigation",
    menuAria: "Open menu",
    langAria: "Language",
    navUnits: "Apartments & Rates",
    navLoc: "Location",
    navAmen: "Amenities",
    navAbout: "About Us",
    btnBook: "Book Now",
    navCall: "Call 088 923 7833",
    authOpen: "Sign In",
    authLine: "Sign In / Register",
    logout: "Sign Out",
    tabLogin: "Sign In",
    tabReg: "Register",
    authTitleL: "Sign In To Your Tenant Account",
    authSubL: "View your lease, housekeeping schedule, invoices and maintenance requests.",
    authTitleR: "Create A Tenant Account",
    authSubR: "Gao Ji House confirms the account over Zalo within 2 working hours.",
    fName: "Full Name",
    fEmail: "Email",
    fPhone: "Phone · Zalo",
    fPass: "Password",
    phName: "Jane Cooper",
    phEmail: "name@company.com",
    phPhone: "+84 9xx xxx xxx",
    phPass: "At least 8 characters",
    btnLogin: "Sign In",
    btnReg: "Create Account",
    forgot: "Forgot password? Message Zalo",
    orZalo: "Or",
    btnZalo: "Continue With Zalo",
    agree: "I agree to the Gao Ji House lease terms and information-retention policy.",
    errEmpty: "Please fill in every field.",
    errAgree: "Please accept the lease terms.",
    switchToReg: "No account yet? Register",
    switchToLogin: "Already registered? Sign in",
    closeAria: "Close",
    mTypes: ["1 Bedroom", "2 Bedrooms", "Penthouse Duplex", "Not Decided Yet"],
  },
  cn: {
    navAria: "主导航",
    menuAria: "打开菜单",
    langAria: "语言",
    navUnits: "公寓与房价",
    navLoc: "地理位置",
    navAmen: "配套设施",
    navAbout: "关于我们",
    btnBook: "立即预订",
    navCall: "致电 088 923 7833",
    authOpen: "登录",
    authLine: "登录 / 注册",
    logout: "退出登录",
    tabLogin: "登录",
    tabReg: "注册",
    authTitleL: "登录租客账户",
    authSubL: "查看租赁合同、保洁安排、账单及维修请求。",
    authTitleR: "创建租客账户",
    authSubR: "Gao Ji House 将在 2 个工作小时内通过 Zalo 确认账户。",
    fName: "姓名",
    fEmail: "电子邮箱",
    fPhone: "电话 · Zalo",
    fPass: "密码",
    phName: "陈雅婷",
    phEmail: "name@company.com",
    phPhone: "+84 9xx xxx xxx",
    phPass: "至少 8 位字符",
    btnLogin: "登录",
    btnReg: "创建账户",
    forgot: "忘记密码？请通过 Zalo 联系",
    orZalo: "或",
    btnZalo: "使用 Zalo 继续",
    agree: "我同意 Gao Ji House 的租赁条款与信息保留政策。",
    errEmpty: "请填写所有信息。",
    errAgree: "请先同意租赁条款。",
    switchToReg: "还没有账户？立即注册",
    switchToLogin: "已有账户？直接登录",
    closeAria: "关闭",
    mTypes: ["一房", "两房", "顶层复式", "尚未确定"],
  },
  tw: {
    navAria: "主導航",
    menuAria: "打開選單",
    langAria: "語言",
    navUnits: "公寓與房價",
    navLoc: "地理位置",
    navAmen: "配套設施",
    navAbout: "關於我們",
    btnBook: "立即預訂",
    navCall: "致電 088 923 7833",
    authOpen: "登入",
    authLine: "登入 / 註冊",
    logout: "登出",
    tabLogin: "登入",
    tabReg: "註冊",
    authTitleL: "登入租客帳戶",
    authSubL: "查看租約、清潔安排、帳單以及維修請求。",
    authTitleR: "建立租客帳戶",
    authSubR: "Gao Ji House 將在 2 個工作小時內透過 Zalo 確認帳戶。",
    fName: "姓名",
    fEmail: "電子郵件",
    fPhone: "電話 · Zalo",
    fPass: "密碼",
    phName: "陳雅婷",
    phEmail: "name@company.com",
    phPhone: "+84 9xx xxx xxx",
    phPass: "至少 8 位字元",
    btnLogin: "登入",
    btnReg: "建立帳戶",
    forgot: "忘記密碼？請透過 Zalo 聯繫",
    orZalo: "或",
    btnZalo: "使用 Zalo 繼續",
    agree: "我同意 Gao Ji House 的租賃條款與資訊保存政策。",
    errEmpty: "請填寫所有資訊。",
    errAgree: "請先同意租賃條款。",
    switchToReg: "還沒有帳戶？立即註冊",
    switchToLogin: "已有帳戶？直接登入",
    closeAria: "關閉",
    mTypes: ["一房", "兩房", "頂層複式", "尚未確定"],
  },
};

const LANGS: { code: LanguageCode; label: string }[] = [
  { code: "vi", label: "VI" },
  { code: "en", label: "EN" },
  { code: "cn", label: "简体" },
  { code: "tw", label: "繁體" },
];

export function Header() {
  const { lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [user, setUser] = useState<{ name: string } | null>(null);

  // Form states in Auth modal
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fPass, setFPass] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [authErr, setAuthErr] = useState("");

  const t = HEADER_LABELS[lang] || HEADER_LABELS.vi;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.navUnits, href: "/#units" },
    { label: t.navLoc, href: "/#location" },
    { label: t.navAmen, href: "/#amenities" },
    { label: t.navAbout, href: "/#about" },
  ];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isReg = authTab === "register";
    const missing = !fEmail.trim() || !fPass.trim() || (isReg && (!fName.trim() || !fPhone.trim()));
    if (missing) {
      setAuthErr(t.errEmpty);
      return;
    }
    if (isReg && !agreed) {
      setAuthErr(t.errAgree);
      return;
    }
    const name = isReg ? fName.trim() : fEmail.split("@")[0];
    setUser({ name });
    setAuthOpen(false);
    setAuthErr("");
    setFPass("");
  };

  return (
    <>
      {/* ── Main Clean Sticky Header ── */}
      <header
        className="sticky top-0 z-50 transition-all duration-300 border-b"
        style={{
          background: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(16px)",
          borderColor: "#EAE4D7",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.02)",
          padding: scrolled ? "8px 0" : "14px 0",
        }}
      >
        <div className="max-w-[1600px] mx-auto px-[clamp(20px,4vw,56px)] flex items-center justify-between gap-[clamp(16px,3vw,40px)]">
          {/* Brand Logo */}
          <Link
            href="/#top"
            className="inline-flex border-0 no-underline shrink-0"
            aria-label="Gao Ji House · Trang chủ"
          >
            <Logo size="sm" showTagline={false} />
          </Link>

          {/* Nav Links (Desktop) - 100% High Contrast */}
          <nav
            aria-label={t.navAria}
            className="hidden lg:flex items-center gap-[clamp(16px,2vw,32px)]"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-[0.8125rem] font-semibold tracking-[0.08em] uppercase text-[#1A1A1A] hover:text-[#9C721D] transition-colors py-2 border-b-2 border-transparent hover:border-[#D4AF37] no-underline"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Language Switcher with Crisp Contrast */}
            <div
              role="group"
              aria-label={t.langAria}
              className="hidden sm:flex gap-px bg-[#DCD6C8] border border-[#DCD6C8] shadow-xs"
            >
              {LANGS.map((l) => {
                const on = lang === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    aria-pressed={on}
                    className="min-h-[38px] px-3.5 py-1.5 font-sans text-[0.75rem] font-bold tracking-wider uppercase transition-colors cursor-pointer border-0"
                    style={{
                      backgroundColor: on ? "#1F3A2E" : "#FFFFFF",
                      color: on ? "#FAF3EA" : "#1A1A1A",
                    }}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>


          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label={t.navAria}
            className="lg:hidden mt-3 border-t border-[#E8E4DB] bg-[#FAF8F5] flex flex-col divide-y divide-[#E8E4DB]"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3.5 font-sans text-[0.875rem] font-semibold tracking-[0.08em] uppercase text-[#1A1A1A] hover:bg-white no-underline"
              >
                {link.label}
              </a>
            ))}

            <a
              href="tel:+84889237833"
              className="px-6 py-3.5 font-sans text-[0.875rem] font-semibold tracking-[0.08em] uppercase text-[#9C721D] flex items-center gap-2 no-underline"
            >
              <Icon name="phone" size={16} color="currentColor" />
              {t.navCall}
            </a>

            {!user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthTab("login");
                  setAuthOpen(true);
                }}
                className="px-6 py-3.5 text-left font-sans text-[0.875rem] font-semibold tracking-[0.08em] uppercase text-[#1F3A2E] bg-transparent border-0 cursor-pointer"
              >
                {t.authLine}
              </button>
            ) : (
              <div className="px-6 py-3.5 flex items-center justify-between">
                <span className="font-sans text-[0.875rem] font-semibold tracking-wider text-[#1F3A2E]">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={() => setUser(null)}
                  className="font-sans text-[0.75rem] font-semibold tracking-wider uppercase text-[#A6573C] bg-transparent border-0 cursor-pointer"
                >
                  {t.logout}
                </button>
              </div>
            )}

            {/* Mobile Language Selector */}
            <div className="px-6 py-3.5 flex gap-1.5 bg-[#F6F3EB]">
              {LANGS.map((l) => {
                const on = lang === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLang(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className="min-h-[38px] px-3.5 py-1.5 font-sans text-[0.75rem] font-bold tracking-wider uppercase border cursor-pointer"
                    style={{
                      backgroundColor: on ? "#1F3A2E" : "#FFFFFF",
                      color: on ? "#FAF3EA" : "#1A1A1A",
                      borderColor: on ? "#1F3A2E" : "#DCD6C8",
                    }}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* ── Global Inquiry Modal ── */}
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        unitTypes={t.mTypes}
      />

      {/* ── Auth Modal ── */}
      {authOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.authOpen}
          className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-[460px] bg-white border border-[#E8E4DB] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-4 border-b border-[#E8E4DB]">
              <div>
                <span className="inline-flex items-center gap-2.5 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#9C721D]">
                  <span className="w-6 h-px bg-[#D4AF37]" />
                  Gao Ji House
                </span>
                <h3 className="mt-1 font-display text-2xl font-normal text-[#1A1A1A]">
                  {authTab === "login" ? t.authTitleL : t.authTitleR}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAuthOpen(false)}
                aria-label={t.closeAria}
                className="w-9 h-9 grid place-items-center bg-transparent border border-[#E8E4DB] text-[#6B6255] hover:border-[#D4AF37] hover:text-[#9C721D] transition-colors cursor-pointer"
              >
                <Icon name="x" size={15} color="currentColor" />
              </button>
            </div>

            <p className="px-5 sm:px-6 pt-3 text-xs sm:text-[0.875rem] font-sans leading-relaxed text-[#383838]">
              {authTab === "login" ? t.authSubL : t.authSubR}
            </p>

            {/* Login / Register Tabs */}
            <div className="grid grid-cols-2 mt-4 border-y border-[#E8E4DB]">
              <button
                type="button"
                onClick={() => {
                  setAuthTab("login");
                  setAuthErr("");
                }}
                className="py-3 font-sans text-xs font-bold uppercase tracking-[0.15em] transition-colors border-0 cursor-pointer"
                style={{
                  backgroundColor: authTab === "login" ? "#1F3A2E" : "transparent",
                  color: authTab === "login" ? "#FAF3EA" : "#6B6255",
                }}
              >
                {t.tabLogin}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab("register");
                  setAuthErr("");
                }}
                className="py-3 font-sans text-xs font-bold uppercase tracking-[0.15em] transition-colors border-0 cursor-pointer"
                style={{
                  backgroundColor: authTab === "register" ? "#1F3A2E" : "transparent",
                  color: authTab === "register" ? "#FAF3EA" : "#6B6255",
                }}
              >
                {t.tabReg}
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="p-5 sm:p-6 grid gap-4">
              {authErr && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                  {authErr}
                </div>
              )}

              {authTab === "register" && (
                <div className="grid gap-1.5">
                  <label className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
                    {t.fName}
                  </label>
                  <input
                    type="text"
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    placeholder={t.phName}
                    className="w-full h-11 px-3.5 bg-[#FAF8F5] border border-[#E8E4DB] font-sans text-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
              )}

              <div className="grid gap-1.5">
                <label className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
                  {t.fEmail}
                </label>
                <input
                  type="email"
                  value={fEmail}
                  onChange={(e) => setFEmail(e.target.value)}
                  placeholder={t.phEmail}
                  className="w-full h-11 px-3.5 bg-[#FAF8F5] border border-[#E8E4DB] font-sans text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              {authTab === "register" && (
                <div className="grid gap-1.5">
                  <label className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
                    {t.fPhone}
                  </label>
                  <input
                    type="tel"
                    value={fPhone}
                    onChange={(e) => setFPhone(e.target.value)}
                    placeholder={t.phPhone}
                    className="w-full h-11 px-3.5 bg-[#FAF8F5] border border-[#E8E4DB] font-sans text-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
              )}

              <div className="grid gap-1.5">
                <label className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#6B6255]">
                  {t.fPass}
                </label>
                <input
                  type="password"
                  value={fPass}
                  onChange={(e) => setFPass(e.target.value)}
                  placeholder={t.phPass}
                  className="w-full h-11 px-3.5 bg-[#FAF8F5] border border-[#E8E4DB] font-sans text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              {authTab === "register" && (
                <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#1F3A2E] shrink-0"
                  />
                  <span className="font-sans text-xs leading-relaxed text-[#383838]">
                    {t.agree}
                  </span>
                </label>
              )}

              <Button
                variant="jade"
                type="submit"
                full
                size="md"
                className="mt-2"
              >
                {authTab === "login" ? t.btnLogin : t.btnReg}
              </Button>

              <div className="flex items-center gap-3 my-1">
                <span className="h-px flex-1 bg-[#E8E4DB]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#6B6255]">
                  {t.orZalo}
                </span>
                <span className="h-px flex-1 bg-[#E8E4DB]" />
              </div>

              <a
                href="https://zalo.me/0889237833"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 h-11 border border-[#D4AF37] bg-white hover:bg-[#FAF8F5] text-[#1F3A2E] font-sans text-xs font-semibold uppercase tracking-[0.12em] no-underline transition-colors"
              >
                <Icon name="phone" size={15} color="#B08D57" />
                {t.btnZalo}
              </a>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
