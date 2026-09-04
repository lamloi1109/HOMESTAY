"use client";

import { useState } from "react";
import { AdminApiError, AdminUnit, OperationalStatus, updateAdminUnit } from "@/app/admin/_lib/api";
import { Button } from "@/components/gaoji";

const STATUS_OPTIONS: Array<{ value: OperationalStatus; label: string }> = [
  { value: "available", label: "Còn trống" }, { value: "held", label: "Giữ chỗ" }, { value: "occupied", label: "Đang cho thuê" }, { value: "maintenance", label: "Bảo trì" },
];

function numeric(value: string | number | null) { return value === null ? "" : String(Number(value)); }

export function UnitsView({ units, onChange }: { units: AdminUnit[]; onChange: (value: AdminUnit) => void }) {
  const [drafts, setDrafts] = useState<Record<string, { monthly: string; nightly: string; status: OperationalStatus; description: string }>>({});
  const [savingId, setSavingId] = useState("");
  const [messages, setMessages] = useState<Record<string, string>>({});

  function draft(unit: AdminUnit) { return drafts[unit.id] ?? { monthly: numeric(unit.price_monthly), nightly: numeric(unit.price_nightly), status: unit.operational_status ?? "available", description: unit.description ?? "" }; }
  function edit(unit: AdminUnit, patch: Partial<ReturnType<typeof draft>>) { setDrafts((current) => ({ ...current, [unit.id]: { ...draft(unit), ...patch } })); setMessages((current) => ({ ...current, [unit.id]: "" })); }
  async function save(unit: AdminUnit) {
    const value = draft(unit); const monthly = Number(value.monthly); const nightly = Number(value.nightly);
    if ((value.monthly && monthly <= 0) || (value.nightly && nightly <= 0)) { setMessages((current) => ({ ...current, [unit.id]: "Giá thuê phải lớn hơn 0." })); return; }
    setSavingId(unit.id); setMessages((current) => ({ ...current, [unit.id]: "" }));
    try {
      const updated = await updateAdminUnit(unit.id, { price_monthly: value.monthly ? monthly : null, price_nightly: value.nightly ? nightly : null, operational_status: value.status, description: value.description.trim() || null });
      onChange(updated); setDrafts((current) => { const next = { ...current }; delete next[unit.id]; return next; }); setMessages((current) => ({ ...current, [unit.id]: "Đã lưu căn hộ." }));
    } catch (cause) { setMessages((current) => ({ ...current, [unit.id]: cause instanceof AdminApiError ? cause.message : "Không thể lưu căn hộ." })); }
    finally { setSavingId(""); }
  }

  if (units.length === 0) return <p className="border border-[var(--hairline-strong)] bg-[var(--surface-raised)] p-8 font-italic italic text-[var(--text-muted)]">Chưa có căn hộ để quản lý.</p>;
  return <section className="border border-[var(--hairline-strong)] bg-[var(--surface-raised)]" aria-labelledby="units-title">
    <div className="p-5 border-b border-[var(--hairline)]"><h2 id="units-title" className="font-display text-2xl font-normal">{units.length} căn hộ đang vận hành</h2><p className="font-sans text-xs text-[var(--text-muted)] mt-1">Thay đổi chỉ có hiệu lực sau khi chọn “Lưu căn hộ”.</p></div>
    <div className="grid gap-px bg-[var(--hairline)]">{units.map((unit) => { const value = draft(unit); return <article key={unit.id} className="bg-[var(--surface-raised)] p-5 grid lg:grid-cols-[minmax(150px,.8fr)_repeat(3,minmax(140px,.65fr))] gap-4 items-start">
      <div><strong className="font-sans text-sm uppercase tracking-[.12em]">{unit.unit_code ?? unit.name}</strong><p className="font-sans text-sm text-[var(--text-muted)] mt-1">{[unit.tower, unit.bedrooms && `${unit.bedrooms}PN`, unit.sqm && `${unit.sqm} m²`].filter(Boolean).join(" · ")}</p><a href={`/properties/${unit.slug}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-sans text-xs font-semibold uppercase tracking-[.12em] text-[var(--gold-900)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]">Xem trang khách</a></div>
      <label className="grid gap-2 font-sans text-[.6875rem] font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Giá tháng (VNĐ)<input type="number" min="1" step="100000" value={value.monthly} onChange={(event) => edit(unit, { monthly: event.target.value })} className="min-h-11 px-3 border border-[var(--hairline-strong)] bg-white text-base normal-case tracking-normal focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]" /></label>
      <label className="grid gap-2 font-sans text-[.6875rem] font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Giá đêm (VNĐ)<input type="number" min="1" step="100000" value={value.nightly} onChange={(event) => edit(unit, { nightly: event.target.value })} className="min-h-11 px-3 border border-[var(--hairline-strong)] bg-white text-base normal-case tracking-normal focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]" /></label>
      <label className="grid gap-2 font-sans text-[.6875rem] font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Trạng thái<select value={value.status} onChange={(event) => edit(unit, { status: event.target.value as OperationalStatus })} className="min-h-11 px-3 border border-[var(--hairline-strong)] bg-white text-base normal-case tracking-normal focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]">{STATUS_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <label className="lg:col-start-2 lg:col-span-2 grid gap-2 font-sans text-[.6875rem] font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Mô tả<textarea rows={3} value={value.description} onChange={(event) => edit(unit, { description: event.target.value })} className="p-3 border border-[var(--hairline-strong)] bg-white text-base normal-case tracking-normal resize-y focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]" /></label>
      <div className="lg:self-end"><Button type="button" variant="jade" full disabled={savingId === unit.id} onClick={() => save(unit)}>{savingId === unit.id ? "Đang lưu…" : "Lưu căn hộ"}</Button>{messages[unit.id] && <p role="status" className="font-sans text-sm text-[var(--text-body)] mt-2">{messages[unit.id]}</p>}</div>
    </article>; })}</div>
  </section>;
}
