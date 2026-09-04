"use client";

import { useState } from "react";
import { AdminApiError, AdminUnit, OperationalStatus, updateAdminUnit } from "@/app/admin/_lib/api";
import { Button, Icon } from "@/components/gaoji";

const STATUS_OPTIONS: Array<{ value: OperationalStatus; label: string }> = [
  { value: "available", label: "Còn Trống" }, { value: "held", label: "Giữ Chỗ" },
  { value: "occupied", label: "Đang Cho Thuê" }, { value: "maintenance", label: "Bảo Trì" },
];

function millions(value: string | number | null) { return value === null ? "" : String(Number(value) / 1_000_000); }

export function UnitsView({ units, onChange }: { units: AdminUnit[]; onChange: (value: AdminUnit) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { monthly: string; nightly: string; status: OperationalStatus; description: string }>>({});
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");

  function draft(unit: AdminUnit) { return drafts[unit.id] ?? { monthly: millions(unit.price_monthly), nightly: millions(unit.price_nightly), status: unit.operational_status ?? "available", description: unit.description ?? "" }; }
  function openEditor(unit: AdminUnit) { setEditingId(unit.id); setMessage(""); }
  function closeEditor() { setEditingId(null); setMessage(""); }
  function edit(unit: AdminUnit, patch: Partial<ReturnType<typeof draft>>) { setDrafts((current) => ({ ...current, [unit.id]: { ...draft(unit), ...patch } })); setMessage(""); }
  async function save(unit: AdminUnit) {
    const value = draft(unit); const monthly = Number(value.monthly); const nightly = Number(value.nightly);
    if ((value.monthly && monthly <= 0) || (value.nightly && nightly <= 0)) { setMessage("Giá thuê phải lớn hơn 0."); return; }
    setSavingId(unit.id); setMessage("");
    try {
      const updated = await updateAdminUnit(unit.id, { price_monthly: value.monthly ? monthly * 1_000_000 : null, price_nightly: value.nightly ? nightly * 1_000_000 : null, operational_status: value.status, description: value.description.trim() || null });
      onChange(updated); setDrafts((current) => { const next = { ...current }; delete next[unit.id]; return next; }); setEditingId(null); setMessage("Đã lưu căn hộ.");
    } catch (cause) { setMessage(cause instanceof AdminApiError ? cause.message : "Không thể lưu căn hộ."); }
    finally { setSavingId(""); }
  }

  if (units.length === 0) return <p className="border border-[var(--hairline-strong)] bg-[var(--surface-raised)] p-8 font-italic italic text-[var(--text-muted)]">Chưa có căn hộ để quản lý.</p>;
  const editing = units.find((unit) => unit.id === editingId);
  return <section className="border border-[var(--hairline-strong)] bg-[var(--surface-raised)]" aria-labelledby="units-title">
    <div className="p-5 border-b border-[var(--hairline)] flex flex-wrap gap-3 items-baseline justify-between"><h2 id="units-title" className="font-display text-2xl font-normal">{units.length} Căn Hộ Đang Vận Hành</h2><span className="font-sans text-xs text-[var(--text-muted)]">Chọn một căn để chỉnh sửa thông tin</span></div>
    <div className="grid gap-px bg-[var(--hairline)]">{units.map((unit) => { const value = draft(unit); return <article key={unit.id} className="bg-[var(--surface-raised)] p-5 sm:px-[22px] flex flex-wrap gap-5 items-center">
      <div className="flex-1 basis-[190px] min-w-0"><strong className="font-sans text-sm uppercase tracking-[.12em]">{unit.unit_code ?? unit.name}</strong><p className="font-sans text-sm text-[var(--text-muted)] mt-1">{[unit.tower, unit.bedrooms && `${unit.bedrooms}PN`, unit.sqm && `${unit.sqm} m²`].filter(Boolean).join(" · ") || "Chưa có thông số"}</p></div>
      <div className="flex-[0_1_150px] min-w-[120px] grid gap-1"><span className="font-sans text-[.625rem] font-semibold uppercase tracking-[.15em] text-[var(--text-muted)]">Giá Thuê Tháng</span><span className="font-sans text-base text-[var(--text-body)]">{value.monthly || "—"} triệu</span></div>
      <div className="flex-[0_1_170px] min-w-[150px] grid gap-1"><span className="font-sans text-[.625rem] font-semibold uppercase tracking-[.15em] text-[var(--text-muted)]">Trạng Thái</span><span className="font-sans text-base text-[var(--text-body)]">{STATUS_OPTIONS.find((item) => item.value === value.status)?.label}</span></div>
      <div className="flex-[0_1_100px] min-w-[90px] grid gap-1"><span className="font-sans text-[.625rem] font-semibold uppercase tracking-[.15em] text-[var(--text-muted)]">Ảnh</span><span className="font-sans text-base text-[var(--text-body)]">—</span></div>
      <div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => openEditor(unit)}>Chỉnh Sửa</Button><Button as="a" href={`/properties/${unit.slug}`} target="_blank" rel="noreferrer" variant="outline" size="sm">Xem Trang Khách</Button></div>
    </article>; })}</div>
    {editing && <><button type="button" aria-label="Đóng chỉnh sửa căn hộ" className="admin-drawer-backdrop" onClick={closeEditor} /><aside className="admin-drawer p-6 sm:p-8" aria-label="Chỉnh sửa căn hộ"><button type="button" onClick={closeEditor} className="absolute right-5 top-5 min-h-11 min-w-11 grid place-items-center text-[var(--text-muted)]" aria-label="Đóng"><Icon name="x" size={20} /></button><span className="font-sans text-[.6875rem] font-semibold uppercase tracking-[.18em] text-[var(--gold-900)]">Danh Mục Cho Thuê</span><h2 className="font-display text-3xl font-normal mt-2">{editing.unit_code ?? editing.name}</h2><div className="grid gap-5 mt-8"><label className="grid gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Giá thuê tháng (triệu)<input type="number" min="1" step="1" value={draft(editing).monthly} onChange={(event) => edit(editing, { monthly: event.target.value })} className="admin-field" /></label><label className="grid gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Giá thuê đêm (triệu)<input type="number" min="1" step="0.1" value={draft(editing).nightly} onChange={(event) => edit(editing, { nightly: event.target.value })} className="admin-field" /></label><label className="grid gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Trạng thái<select value={draft(editing).status} onChange={(event) => edit(editing, { status: event.target.value as OperationalStatus })} className="admin-field">{STATUS_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="grid gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Mô tả<textarea rows={5} value={draft(editing).description} onChange={(event) => edit(editing, { description: event.target.value })} className="admin-field resize-y" /></label>{message && <p role="status" className="font-sans text-sm">{message}</p>}<Button type="button" variant="jade" full disabled={savingId === editing.id} onClick={() => save(editing)}>{savingId === editing.id ? "Đang Lưu…" : "Lưu Căn Hộ"}</Button></div></aside></>}
  </section>;
}
