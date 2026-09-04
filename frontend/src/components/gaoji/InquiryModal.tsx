"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Input } from "./Input";
import { Select } from "./Select";

export interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  initialUnitCode?: string;
  initialUnit?: string;
  unitTypes?: string[];
  unitOptions?: { value: string; label: string }[];
}

export function InquiryModal({
  open,
  onClose,
  initialUnitCode,
  initialUnit,
  unitTypes,
  unitOptions,
}: InquiryModalProps) {
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [zalo, setZalo] = useState("");
  const [email, setEmail] = useState("");
  const [unitCode, setUnitCode] = useState(initialUnit || initialUnitCode || "");
  const [checkinDate, setCheckinDate] = useState("");
  const [rentalTerm, setRentalTerm] = useState("Theo Đêm");
  const [guestCount, setGuestCount] = useState(2);
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successCode, setSuccessCode] = useState<string | null>(null);

  // Compute options
  const computedOptions =
    unitOptions ||
    (unitTypes
      ? unitTypes.map((u) => ({ value: u, label: u }))
      : [
          { value: "", label: "Tư vấn chọn căn phù hợp" },
          { value: "L1.29.08", label: "L1.29.08 · Landmark 1 (2PN · 82 m²)" },
          { value: "L3.44.09", label: "L3.44.09 · Landmark 3 (3PN · 108 m²)" },
          { value: "L81.07.12", label: "L81.07.12 · Landmark 81 (1PN · 54 m²)" },
          { value: "P1.27.10", label: "P1.27.10 · Park 1 (2PN · 85 m²)" },
          { value: "P3.42.12", label: "P3.42.12 · Park 3 (Duplex 3PN · 140 m²)" },
        ]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng điền họ tên và số điện thoại.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiBase}/api/v1/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: guestName.trim(),
          phone: phone.trim(),
          zalo: zalo.trim() || phone.trim(),
          email: email.trim() || null,
          unit_code: unitCode || null,
          checkin_date: checkinDate || null,
          rental_term: rentalTerm,
          guest_count: Number(guestCount),
          note: note.trim() || null,
          channel: "web_form",
        }),
      });

      if (!res.ok) {
        throw new Error("Không thể gửi yêu cầu, vui lòng thử lại qua Zalo/Hotline.");
      }

      const data = await res.json();
      setSuccessCode(data.inquiry_id ? `GJH-${data.inquiry_id.slice(0, 8).toUpperCase()}` : "GJH-SUCCESS");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra, vui lòng gọi 088 923 7833 để được hỗ trợ trực tiếp.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessCode(null);
    setErrorMsg("");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-[var(--canvas-warm)] border border-[var(--gold-700)] shadow-2xl p-6 sm:p-8 rounded-none">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
          <div className="grid gap-1">
            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--gold-900)]">
              Gao Ji House · Dịch Vụ Khách Hàng
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-[var(--ink-900)]">
              {successCode ? "Đã Gửi Yêu Cầu" : "Đặt Phòng / Hỏi Giá"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Đóng"
            className="p-2 text-[var(--text-muted)] hover:text-[var(--ink-900)] transition-colors cursor-pointer"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Content */}
        {successCode ? (
          <div className="pt-6 grid gap-5">
            <div className="flex items-center gap-3 text-[var(--success)]">
              <Icon name="badge-check" size={28} />
              <span className="font-sans font-semibold text-lg">Tiếp nhận thành công!</span>
            </div>
            <p className="font-sans text-base leading-relaxed text-[var(--text-body)]">
              Cảm ơn bạn. Quản lý căn hộ Gao Ji House sẽ liên hệ phản hồi qua <strong>Zalo ({zalo || phone})</strong> trong vòng 2 giờ làm việc.
            </p>
            <div className="p-4 bg-[var(--surface-raised)] border border-[var(--gold-700)]">
              <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[var(--gold-900)] block">
                Mã Tra Cứu Yêu Cầu
              </span>
              <span className="font-display text-2xl text-[var(--jade-700)] font-medium tracking-wide">
                {successCode}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="gold" full as="a" href="https://zalo.me/0889237833" target="_blank">
                Chat Zalo Ngay
              </Button>
              <Button variant="outline" full onClick={handleReset}>
                Đóng Cửa Sổ
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-5 grid gap-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-sans text-sm">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Họ Và Tên *"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
              <Input
                label="Số Điện Thoại / Zalo *"
                required
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (!zalo) setZalo(e.target.value);
                }}
                placeholder="0901 234 567"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Căn Hộ Quan Tâm"
                value={unitCode}
                onChange={(e) => setUnitCode(e.target.value)}
                options={computedOptions}
              />
              <Select
                label="Thời Hạn Thuê"
                value={rentalTerm}
                onChange={(e) => setRentalTerm(e.target.value)}
                options={[
                  { value: "Theo Đêm", label: "Thuê Theo Đêm (1-6 đêm)" },
                  { value: "Theo Tuần", label: "Thuê Theo Tuần (1-3 tuần)" },
                  { value: "1-3 Tháng", label: "Thuê Ngắn Hạn (1 - 3 tháng)" },
                  { value: "Dài Hạn >= 6 Tháng", label: "Thuê Dài Hạn (>= 6 tháng)" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ngày Dự Kiến Nhận Phòng"
                type="date"
                value={checkinDate}
                onChange={(e) => setCheckinDate(e.target.value)}
              />
              <Select
                label="Số Lượng Khách"
                value={String(guestCount)}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                options={[
                  { value: "1", label: "1 Khách" },
                  { value: "2", label: "2 Khách" },
                  { value: "4", label: "3 - 4 Khách" },
                  { value: "6", label: "5 - 6 Khách" },
                ]}
              />
            </div>

            <Input
              label="Email (Không Bắt Buộc)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@example.com"
            />

            <Input
              label="Ghi Chú Hoặc Yêu Cầu Đặc Biệt"
              as="textarea"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Yêu cầu xuất hóa đơn VAT, đón sân bay, tầng cao view sông..."
            />

            <p className="font-sans text-[0.75rem] text-[var(--text-muted)] leading-normal">
              Thông tin của bạn được bảo mật tuyệt đối theo quy định bảo vệ dữ liệu cá nhân. Quản lý căn hộ sẽ liên hệ trong 2 giờ.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="gold" type="submit" full disabled={loading}>
                {loading ? "Đang Gửi..." : "Gửi Yêu Cầu Tư Vấn"}
              </Button>
              <Button
                variant="outline"
                type="button"
                full
                as="a"
                href="https://zalo.me/0889237833"
                target="_blank"
              >
                Nhắn Zalo Ngay
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default InquiryModal;
