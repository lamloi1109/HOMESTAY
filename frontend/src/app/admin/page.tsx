"use client";

import React, { useState } from "react";
import { Badge, Button, Icon, Logo } from "@/components/gaoji";

type NavSection = "overview" | "calendar" | "units" | "inquiries" | "police" | "finance";
type UserRole = "owner" | "staff" | "accountant" | "admin";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const [userRole, setUserRole] = useState<UserRole>("owner");

  const [inquiries] = useState([
    {
      id: "inq-101",
      guest: "Mr. David Chen",
      contact: "0908 123 456 (Zalo)",
      unit: "L1.29.08 (2PN)",
      dates: "01/09/2026 - 01/12/2026 (3 tháng)",
      channel: "Zalo",
      status: "new",
      statusLabel: "Mới Nhận",
    },
    {
      id: "inq-102",
      guest: "Chị Hoàng Lan",
      contact: "0912 345 678",
      unit: "L3.44.09 (3PN)",
      dates: "28/08/2026 - 02/09/2026 (5 đêm)",
      channel: "Web Form",
      status: "contacted",
      statusLabel: "Đang Tư Vấn",
    },
    {
      id: "inq-103",
      guest: "Mr. Kenji Tanaka",
      contact: "WeChat: kenji_tanaka",
      unit: "L81.07.12 (1PN)",
      dates: "15/09/2026 - 15/03/2027 (6 tháng)",
      channel: "WeChat",
      status: "confirmed",
      statusLabel: "Đã Cọc Giữ Phòng",
    },
  ]);

  const [unitStatuses] = useState([
    { code: "L1.29.08", guest: "Gia đình anh Tuấn", checkout: "30/08/2026", status: "occupied", statusLabel: "Đang Lưu Trú", c06: "Đã Khai Báo" },
    { code: "L3.44.09", guest: "Chuyên gia Samsung", checkout: "15/10/2026", status: "occupied", statusLabel: "Đang Lưu Trú", c06: "Đã Khai Báo" },
    { code: "L81.07.12", guest: "—", checkout: "—", status: "available", statusLabel: "Phòng Trống", c06: "—" },
    { code: "P1.27.10", guest: "Khách check-in 14:00", checkout: "—", status: "cleaning", statusLabel: "Đang Dọn Dẹp", c06: "Chờ Hộ Chiếu" },
    { code: "P3.42.12", guest: "Đoàn công tác Nhật Bản", checkout: "05/09/2026", status: "occupied", statusLabel: "Đang Lưu Trú", c06: "Đã Khai Báo" },
  ]);

  const navItems: { id: NavSection; label: string; icon: string; badge?: number }[] = [
    { id: "overview", label: "Tổng Quan Vận Hành", icon: "sparkles" },
    { id: "calendar", label: "Lịch Cư Trú & Phòng", icon: "calendar" },
    { id: "units", label: "Danh Sách Căn Hộ", icon: "building" },
    { id: "inquiries", label: "Yêu Cầu Tư Vấn", icon: "message-circle", badge: 3 },
    { id: "police", label: "Khai Báo Tạm Trú C06", icon: "shield-check" },
    { id: "finance", label: "Báo Cáo Doanh Thu", icon: "credit-card" },
  ];

  return (
    <div className="min-h-screen bg-[var(--canvas,#F9F7F2)] text-[var(--text-primary,#1A1A1A)] flex flex-col lg:flex-row">
      {/* ── SIDEBAR (JADE-900) ──────────────────────────────── */}
      <aside className="w-full lg:w-72 bg-[var(--jade-900)] text-[var(--text-inverse)] flex flex-col border-r border-[rgba(212,175,55,0.22)] shrink-0">
        <div className="p-6 border-b border-[rgba(212,175,55,0.22)] flex flex-col items-start gap-2">
          <Logo variant="dark" size="sm" showTagline={false} />
          <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-[rgba(250,243,234,0.55)]">
            Bảng Điều Hành Nội Bộ
          </span>
        </div>

        {/* Nav links */}
        <nav className="p-3 grid gap-1">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`w-full px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-colors rounded-none border text-left cursor-pointer ${
                  active
                    ? "bg-[var(--jade-700)] text-[var(--gold-050)] border-[rgba(212,175,55,0.4)]"
                    : "bg-transparent text-[rgba(250,243,234,0.7)] border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name={item.icon} size={16} color="currentColor" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-[var(--gold-500)] text-[var(--ink-900)] text-[0.6875rem] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Role Switcher */}
        <div className="mt-auto p-6 border-t border-[rgba(212,175,55,0.22)] flex flex-col gap-2">
          <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-wider text-[rgba(250,243,234,0.55)]">
            Đang Đăng Nhập Với Vai Trò:
          </span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="w-full h-10 px-3 bg-[var(--jade-700)] border border-[rgba(212,175,55,0.35)] text-[var(--gold-050)] font-sans text-xs uppercase tracking-wider rounded-none"
          >
            <option value="owner">Chủ Nhà · Owner</option>
            <option value="staff">Lễ Tân · Staff</option>
            <option value="accountant">Kế Toán · Accountant</option>
            <option value="admin">Quản Trị Viên · Admin</option>
          </select>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-x-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[var(--hairline)]">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
              Gao Ji House · Hệ Thống Quản Trị Vận Hành
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink-900)] uppercase mt-1">
              {activeSection === "overview" && "Tổng Quan Hoạt Động Căn Hộ"}
              {activeSection === "calendar" && "Lịch Cư Trú & Tình Trạng Phòng"}
              {activeSection === "units" && "Quản Lý Danh Sách 5 Căn Hộ"}
              {activeSection === "inquiries" && "Danh Sách Khách Hàng Hỏi Thuê"}
              {activeSection === "police" && "Khai Báo Tạm Trú Công An C06"}
              {activeSection === "finance" && "Báo Cáo Tài Chính & Đối Soát"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon="search"
              as="a"
              href="/search"
            >
              Xem Giao Diện Khách
            </Button>
            <Button
              variant="gold"
              size="sm"
              icon="phone-call"
              onClick={() => alert("Đã mở kết nối hỗ trợ nội bộ")}
            >
              Hotline Quản Lý
            </Button>
          </div>
        </div>

        {/* ── KPI METRICS STRIP ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="p-6 bg-[var(--surface-raised)] border border-[var(--hairline)]">
            <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Doanh Thu Ước Tính Tháng
            </span>
            <div className="font-display text-3xl text-[var(--jade-700)] mt-2">
              172.0 Triệu VNĐ
            </div>
            <span className="font-sans text-xs text-[var(--success)] font-semibold mt-1 block">
              +14% so với tháng trước
            </span>
          </div>

          <div className="p-6 bg-[var(--surface-raised)] border border-[var(--hairline)]">
            <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Tỷ Lệ Lấp Đầy (Occupancy)
            </span>
            <div className="font-display text-3xl text-[var(--jade-700)] mt-2">
              80.0% (4/5 Căn)
            </div>
            <span className="font-sans text-xs text-[var(--text-muted)] mt-1 block">
              1 căn trống sẵn sàng đón khách
            </span>
          </div>

          <div className="p-6 bg-[var(--surface-raised)] border border-[var(--hairline)]">
            <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Yêu Cầu Tư Vấn Chờ Xử Lý
            </span>
            <div className="font-display text-3xl text-[var(--gold-900)] mt-2">
              3 Khách Mới
            </div>
            <span className="font-sans text-xs text-[var(--warning)] font-semibold mt-1 block">
              Cần phản hồi trong 15 phút
            </span>
          </div>

          <div className="p-6 bg-[var(--surface-raised)] border border-[var(--hairline)]">
            <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Tạm Trú C06 Đã Khai Báo
            </span>
            <div className="font-display text-3xl text-[var(--jade-700)] mt-2">
              100% Khách Hiện Tại
            </div>
            <span className="font-sans text-xs text-[var(--success)] font-semibold mt-1 block">
              Hợp lệ theo quy định Phường 22
            </span>
          </div>
        </div>

        {/* ── SECTION 1: APARTMENTS REAL-TIME STATUS ─────────── */}
        <section className="mt-12">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--hairline)]">
            <h2 className="font-display text-2xl text-[var(--ink-900)] uppercase">
              Tình Trạng Vận Hành 5 Căn Hộ
            </h2>
            <span className="font-sans text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Cập nhật thời gian thực
            </span>
          </div>

          <div className="mt-6 bg-[var(--surface-raised)] border border-[var(--hairline)] overflow-x-auto">
            <table className="w-full text-left font-sans text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--canvas-warm)] border-b border-[var(--hairline)] text-[0.6875rem] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  <th className="p-4">Mã Căn</th>
                  <th className="p-4">Khách Đang Ở / Đặt Chỗ</th>
                  <th className="p-4">Ngày Trả Phòng</th>
                  <th className="p-4">Trạng Thái Phòng</th>
                  <th className="p-4">Khai Báo C06</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hairline)]">
                {unitStatuses.map((unit) => (
                  <tr key={unit.code} className="hover:bg-[var(--canvas)] transition-colors">
                    <td className="p-4 font-semibold text-[var(--jade-900)]">
                      {unit.code}
                    </td>
                    <td className="p-4 text-[var(--text-body)]">
                      {unit.guest}
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">
                      {unit.checkout}
                    </td>
                    <td className="p-4">
                      <Badge
                        tone={
                          unit.status === "available"
                            ? "available"
                            : unit.status === "occupied"
                            ? "jade"
                            : "held"
                        }
                      >
                        {unit.statusLabel}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold text-[var(--gold-900)]">
                        {unit.c06}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Xem chi tiết căn ${unit.code}`)}
                        className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-900)] hover:underline cursor-pointer"
                      >
                        Chi Tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION 2: INQUIRIES TRIAGE TABLE ──────────────── */}
        <section className="mt-12">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--hairline)]">
            <h2 className="font-display text-2xl text-[var(--ink-900)] uppercase">
              Yêu Cầu Tư Vấn & Thuê Căn Hộ Mới Nhất
            </h2>
            <span className="font-sans text-xs uppercase tracking-wider text-[var(--gold-900)] font-semibold">
              3 Khách Hàng Cần Liên Hệ
            </span>
          </div>

          <div className="mt-6 bg-[var(--surface-raised)] border border-[var(--hairline)] overflow-x-auto">
            <table className="w-full text-left font-sans text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--canvas-warm)] border-b border-[var(--hairline)] text-[0.6875rem] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  <th className="p-4">Tên Khách</th>
                  <th className="p-4">Số Điện Thoại / Zalo / WeChat</th>
                  <th className="p-4">Căn Hộ Quan Tâm</th>
                  <th className="p-4">Thời Gian Cư Trú</th>
                  <th className="p-4">Kênh</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hairline)]">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[var(--canvas)] transition-colors">
                    <td className="p-4 font-semibold text-[var(--ink-900)]">
                      {inq.guest}
                    </td>
                    <td className="p-4 text-[var(--text-body)]">
                      {inq.contact}
                    </td>
                    <td className="p-4 text-[var(--jade-700)] font-semibold">
                      {inq.unit}
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">
                      {inq.dates}
                    </td>
                    <td className="p-4 font-sans text-xs uppercase tracking-wider">
                      {inq.channel}
                    </td>
                    <td className="p-4">
                      <Badge
                        tone={
                          inq.status === "new"
                            ? "clay"
                            : inq.status === "confirmed"
                            ? "available"
                            : "gold"
                        }
                      >
                        {inq.statusLabel}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href="https://zalo.me/0889237833"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-[var(--channel-zalo)] text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 hover:opacity-90 rounded-none"
                      >
                        <Icon name="message-circle" size={13} color="#ffffff" />
                        <span>Chat Zalo</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
