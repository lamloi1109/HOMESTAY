"use client";

import { FormEvent, ReactNode, useState } from "react";
import { AdminApiError, AdminLease, AdminUnit, DocumentStatus, LeasePayload, ResidenceStatus, createAdminLease, updateAdminLease } from "@/app/admin/_lib/api";
import { Badge, Button } from "@/components/gaoji";

const EMPTY: LeasePayload = { property_id: "", guest_name: "", nationality: "Việt Nam", phone: "", start_date: "", end_date: "", monthly_rent: 0, residence_status: "pending", document_status: "complete", note: "" };

function formFromLease(lease: AdminLease): LeasePayload { return { property_id: lease.property_id, guest_name: lease.guest_name, nationality: lease.nationality, phone: lease.phone ?? "", start_date: lease.start_date, end_date: lease.end_date, monthly_rent: Number(lease.monthly_rent), residence_status: lease.residence_status, document_status: lease.document_status, note: lease.note ?? "" }; }
function money(value: string | number) { return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(value)); }

export function LeasesView({ leases, units, onCreate, onChange }: { leases: AdminLease[]; units: AdminUnit[]; onCreate: (value: AdminLease) => void; onChange: (value: AdminLease) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<LeasePayload>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const urgent = leases.filter((lease) => lease.days_remaining !== null && lease.days_remaining >= 0 && lease.days_remaining <= 30);

  function change<K extends keyof LeasePayload>(key: K, value: LeasePayload[K]) { setForm((current) => ({ ...current, [key]: value })); setMessage(""); }
  function startCreate() { setEditingId(null); setEditorOpen(true); setForm({ ...EMPTY, property_id: units[0]?.id ?? "" }); setMessage(""); }
  function startEdit(lease: AdminLease) { setEditingId(lease.id); setEditorOpen(true); setForm(formFromLease(lease)); setMessage(""); }
  function closeEditor() { setEditorOpen(false); setEditingId(null); setMessage(""); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.property_id || !form.guest_name.trim() || !form.start_date || !form.end_date) { setMessage("Điền đủ căn hộ, tên khách và thời hạn hợp đồng."); return; }
    if (form.end_date <= form.start_date) { setMessage("Ngày kết thúc phải sau ngày bắt đầu."); return; }
    if (form.monthly_rent <= 0) { setMessage("Tiền thuê tháng phải lớn hơn 0."); return; }
    setSaving(true); setMessage("");
    try {
      if (editingId) { const { property_id: _propertyId, ...update } = form; void _propertyId; onChange(await updateAdminLease(editingId, update)); setMessage("Đã cập nhật hợp đồng."); setEditorOpen(false); }
      else { onCreate(await createAdminLease(form)); setMessage("Đã tạo hợp đồng."); setForm({ ...EMPTY, property_id: units[0]?.id ?? "" }); setEditorOpen(false); }
    } catch (cause) { setMessage(cause instanceof AdminApiError ? cause.message : "Không thể lưu hợp đồng."); }
    finally { setSaving(false); }
  }

  return <div className="grid gap-6">
    {urgent.length > 0 && <section className="border border-[var(--clay-500)] bg-[var(--canvas-warm)] p-5"><h2 className="font-sans text-xs font-semibold uppercase tracking-[.18em] text-[var(--clay-500)]">Cần xử lý trong 30 ngày</h2><ul className="mt-3 grid gap-2 font-sans text-sm">{urgent.map((lease) => <li key={lease.id}>{lease.guest_name} · {lease.unit_code ?? lease.property_name} — còn {lease.days_remaining} ngày.</li>)}</ul></section>}
    <div className="flex justify-end"><Button type="button" variant="gold" icon="file-text" onClick={startCreate}>Tạo Hợp Đồng</Button></div>
    <div>
      <section className="border border-[var(--hairline-strong)] bg-[var(--surface-raised)]" aria-label="Danh sách hợp đồng">{leases.length === 0 ? <p className="p-8 font-italic italic text-[var(--text-muted)]">Chưa có hợp đồng. Chọn “Tạo hợp đồng” để bắt đầu.</p> : <div className="grid gap-px bg-[var(--hairline)]">{leases.map((lease) => <article key={lease.id} className="bg-[var(--surface-raised)] p-5 flex flex-wrap gap-5 items-center"><div className="flex-1 basis-48"><h3 className="font-display text-xl font-normal">{lease.guest_name}</h3><p className="font-sans text-sm text-[var(--text-muted)]">{lease.unit_code ?? lease.property_name} · {lease.nationality}</p></div><div className="flex-1 basis-40 font-sans text-sm"><span className="block text-xs uppercase tracking-[.12em] text-[var(--text-muted)]">Hạn hợp đồng</span><strong className={lease.days_remaining !== null && lease.days_remaining <= 30 ? "text-[var(--clay-500)]" : "text-[var(--text-body)]"}>{lease.end_date} · {lease.days_remaining ?? "—"} ngày</strong><span className="block mt-1">{money(lease.monthly_rent)}/tháng</span></div><div className="grid gap-2"><Badge tone={lease.residence_status === "registered" ? "available" : "warning"}>{lease.residence_status === "registered" ? "Đã đăng ký" : lease.residence_status === "expired" ? "Tạm trú hết hạn" : "Chờ tạm trú"}</Badge><Badge tone={lease.document_status === "complete" ? "jade" : "danger"}>{lease.document_status === "complete" ? "Hồ sơ đủ" : "Thiếu giấy tờ"}</Badge></div><Button type="button" variant="outline" size="sm" onClick={() => startEdit(lease)}>Chỉnh sửa</Button></article>)}</div>}</section>
      {editorOpen && <><button type="button" aria-label="Đóng biểu mẫu hợp đồng" className="admin-drawer-backdrop" onClick={closeEditor} /><form onSubmit={submit} className="admin-drawer p-5 sm:p-7 grid content-start gap-4"><button type="button" onClick={closeEditor} className="absolute right-5 top-5 min-h-11 min-w-11 grid place-items-center text-[var(--text-muted)]" aria-label="Đóng"><span aria-hidden="true">×</span></button><div><span className="font-sans text-[.6875rem] font-semibold uppercase tracking-[.18em] text-[var(--gold-900)]">{editingId ? "Cập nhật hồ sơ" : "Hợp đồng mới"}</span><h2 className="font-display text-2xl font-normal mt-1">{editingId ? form.guest_name : "Thông tin khách thuê"}</h2></div>
        <Field label="Căn hộ"><select disabled={Boolean(editingId)} required value={form.property_id} onChange={(event) => change("property_id", event.target.value)} className="admin-field"><option value="">Chọn căn hộ</option>{units.map((unit) => <option key={unit.id} value={unit.id}>{unit.unit_code ?? unit.name}</option>)}</select></Field>
        <div className="grid sm:grid-cols-2 gap-4"><Field label="Tên khách"><input required value={form.guest_name} onChange={(event) => change("guest_name", event.target.value)} className="admin-field" /></Field><Field label="Quốc tịch"><input required value={form.nationality} onChange={(event) => change("nationality", event.target.value)} className="admin-field" /></Field></div>
        <Field label="Số điện thoại"><input value={form.phone ?? ""} onChange={(event) => change("phone", event.target.value)} className="admin-field" /></Field>
        <div className="grid sm:grid-cols-2 gap-4"><Field label="Ngày bắt đầu"><input type="date" required value={form.start_date} onChange={(event) => change("start_date", event.target.value)} className="admin-field" /></Field><Field label="Ngày kết thúc"><input type="date" required value={form.end_date} onChange={(event) => change("end_date", event.target.value)} className="admin-field" /></Field></div>
        <Field label="Tiền thuê tháng (VNĐ)"><input type="number" min="1" step="100000" required value={form.monthly_rent || ""} onChange={(event) => change("monthly_rent", Number(event.target.value))} className="admin-field" /></Field>
        <div className="grid sm:grid-cols-2 gap-4"><Field label="Tạm trú"><select value={form.residence_status} onChange={(event) => change("residence_status", event.target.value as ResidenceStatus)} className="admin-field"><option value="pending">Đang chờ</option><option value="registered">Đã đăng ký</option><option value="expired">Hết hạn</option></select></Field><Field label="Giấy tờ"><select value={form.document_status} onChange={(event) => change("document_status", event.target.value as DocumentStatus)} className="admin-field"><option value="complete">Đầy đủ</option><option value="missing">Còn thiếu</option></select></Field></div>
        <Field label="Ghi chú"><textarea rows={3} value={form.note ?? ""} onChange={(event) => change("note", event.target.value)} className="admin-field resize-y" /></Field>
        {message && <p role="status" className="font-sans text-sm text-[var(--text-body)]">{message}</p>}
        <Button type="submit" variant="jade" full disabled={saving}>{saving ? "Đang lưu…" : editingId ? "Lưu hợp đồng" : "Tạo hợp đồng"}</Button>
      </form></>}
    </div>
  </div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="grid gap-2 font-sans text-[.6875rem] font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">{label}{children}</label>; }
