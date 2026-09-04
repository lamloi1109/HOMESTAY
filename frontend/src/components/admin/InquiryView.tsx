"use client";

import { useMemo, useState } from "react";
import { AdminApiError, AdminInquiry, InquiryStage, updateAdminInquiry } from "@/app/admin/_lib/api";
import { Button } from "@/components/gaoji";

const STAGES: Array<{ value: "all" | InquiryStage; label: string }> = [
  { value: "all", label: "Tất cả" }, { value: "new", label: "Mới" }, { value: "talking", label: "Đang tư vấn" }, { value: "hold", label: "Giữ chỗ" }, { value: "won", label: "Đã chốt" }, { value: "lost", label: "Không thành" },
];
const STAGE_LABEL: Record<InquiryStage, string> = { new: "Mới", talking: "Đang tư vấn", hold: "Giữ chỗ", won: "Đã chốt", lost: "Không thành" };
const CHANNEL_LABEL = { zalo: "Zalo", phone: "Gọi điện", web_form: "Form web", wechat: "WeChat", email: "Email" };
const CHANNEL_STYLE: Record<keyof typeof CHANNEL_LABEL, string> = { zalo: "bg-[var(--channel-zalo)] text-white", phone: "bg-[var(--jade-700)] text-[var(--gold-050)]", web_form: "bg-[var(--gold-500)] text-[var(--jade-900)]", wechat: "bg-[var(--channel-wechat)] text-white", email: "bg-[var(--clay-500)] text-white" };

function contactLink(inquiry: AdminInquiry) {
  const digits = (inquiry.zalo || inquiry.phone).replace(/\D/g, "");
  if (inquiry.channel === "email" && inquiry.email) return { href: `mailto:${inquiry.email}`, label: "Gửi email", icon: "mail" };
  if (inquiry.channel === "phone") return { href: `tel:${digits}`, label: "Gọi khách", icon: "phone" };
  if (digits) return { href: `https://zalo.me/${digits}`, label: "Trả lời qua Zalo", icon: "message-circle" };
  return null;
}

export function InquiryView({ inquiries, onChange }: { inquiries: AdminInquiry[]; onChange: (value: AdminInquiry) => void }) {
  const [filter, setFilter] = useState<"all" | InquiryStage>("all");
  const [selectedId, setSelectedId] = useState(inquiries[0]?.id ?? "");
  const [draftStage, setDraftStage] = useState<InquiryStage | null>(null);
  const [draftNote, setDraftNote] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const rows = useMemo(() => inquiries.filter((item) => {
    const stageMatch = filter === "all" || item.stage === filter;
    return stageMatch;
  }), [filter, inquiries]);
  const selected = rows.find((item) => item.id === selectedId) ?? rows[0] ?? null;
  const stage = draftStage ?? selected?.stage ?? "new";
  const note = draftNote ?? selected?.note ?? "";
  const contact = selected ? contactLink(selected) : null;

  function selectInquiry(id: string) { setSelectedId(id); setDraftStage(null); setDraftNote(null); setMessage(""); }
  function changeFilter(value: "all" | InquiryStage) { setFilter(value); setSelectedId(""); setDraftStage(null); setDraftNote(null); setMessage(""); }
  async function save() {
    if (!selected) return;
    setSaving(true); setMessage("");
    try {
      const updated = await updateAdminInquiry(selected.id, { stage, note: note.trim() || null });
      onChange(updated); setDraftStage(null); setDraftNote(null); setMessage("Đã lưu thay đổi yêu cầu.");
    } catch (cause) { setMessage(cause instanceof AdminApiError ? cause.message : "Không thể lưu yêu cầu."); }
    finally { setSaving(false); }
  }

  return <div className="grid gap-6">
      <div className="flex flex-wrap gap-2 items-center" aria-label="Lọc theo trạng thái">{STAGES.map((item) => { const count = item.value === "all" ? inquiries.length : inquiries.filter((inq) => inq.stage === item.value).length; return <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => changeFilter(item.value)} className={`min-h-11 px-4 border font-sans text-xs font-semibold uppercase tracking-[.12em] focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)] ${filter === item.value ? "bg-[var(--jade-700)] border-[var(--jade-700)] text-[var(--gold-050)]" : "bg-transparent border-[var(--hairline-strong)] text-[var(--text-primary)]"}`}>{item.label} · {count}</button>; })}</div>
    <div className="grid xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
      <section className="border border-[var(--hairline-strong)] bg-[var(--surface-raised)]" aria-label="Danh sách yêu cầu">{rows.length === 0 ? <p className="p-8 font-italic italic text-[var(--text-muted)]">Không có yêu cầu phù hợp bộ lọc.</p> : <div className="grid gap-px bg-[var(--hairline)]">{rows.map((item) => <button key={item.id} type="button" aria-pressed={selected?.id === item.id} onClick={() => selectInquiry(item.id)} className={`p-4 sm:p-5 flex flex-wrap items-center gap-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--gold-500)] ${selected?.id === item.id ? "bg-[var(--canvas-warm)]" : "bg-[var(--surface-raised)] hover:bg-[var(--canvas)]"}`}><span className={`px-2 py-1 font-sans text-[.625rem] font-semibold uppercase tracking-[.12em] ${CHANNEL_STYLE[item.channel]}`}>{CHANNEL_LABEL[item.channel]}</span><span className="flex-1 basis-44 min-w-0"><strong className="block font-display text-lg font-normal">{item.guest_name}</strong><span className="font-sans text-sm text-[var(--text-muted)]">{item.unit_code ?? item.property_name ?? "Chưa chọn căn"} · {item.rental_term ?? "Chưa rõ thời hạn"}</span></span><span className="font-sans text-xs text-[var(--text-body)]">{item.checkin_date ?? "Chưa chọn ngày"}</span><span className="font-sans text-[.6875rem] font-semibold uppercase tracking-[.12em] text-[var(--gold-900)]">{STAGE_LABEL[item.stage]}</span></button>)}</div>}</section>
      <aside className="border border-[var(--hairline-strong)] bg-[var(--canvas-warm)] p-5 sm:p-6 xl:sticky xl:top-6">{selected ? <div className="grid gap-5">
        <div><span className="font-sans text-[.6875rem] font-semibold uppercase tracking-[.18em] text-[var(--gold-900)]">{CHANNEL_LABEL[selected.channel]}</span><h2 className="font-display text-2xl font-normal mt-1">{selected.guest_name}</h2><p className="font-sans text-sm text-[var(--text-body)] mt-1">{selected.zalo || selected.phone}{selected.email ? ` · ${selected.email}` : ""}</p></div>
        <dl className="grid gap-3 border-y border-[var(--hairline)] py-4 font-sans text-sm"><div className="flex justify-between gap-4"><dt className="text-[var(--text-muted)]">Căn quan tâm</dt><dd className="text-right">{selected.unit_code ?? selected.property_name ?? "—"}</dd></div><div className="flex justify-between gap-4"><dt className="text-[var(--text-muted)]">Ngày nhận</dt><dd>{selected.checkin_date ?? "—"}</dd></div><div className="flex justify-between gap-4"><dt className="text-[var(--text-muted)]">Thời hạn</dt><dd>{selected.rental_term ?? "—"}</dd></div></dl>
        <label className="grid gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Chuyển trạng thái<select value={stage} onChange={(event) => setDraftStage(event.target.value as InquiryStage)} className="min-h-11 px-3 bg-white border border-[var(--hairline-strong)] text-base normal-case tracking-normal focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]">{STAGES.filter((item) => item.value !== "all").map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label className="grid gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Ghi chú<textarea rows={4} value={note} onChange={(event) => setDraftNote(event.target.value)} className="p-3 bg-white border border-[var(--hairline-strong)] text-base normal-case tracking-normal resize-y focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]" /></label>
        {message && <p role="status" className="font-sans text-sm text-[var(--text-body)]">{message}</p>}
        <Button type="button" variant="jade" full disabled={saving} onClick={save}>{saving ? "Đang lưu…" : "Lưu thay đổi"}</Button>
        {contact && <Button as="a" href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel={contact.href.startsWith("http") ? "noreferrer" : undefined} variant="gold" full icon={contact.icon}>{contact.label}</Button>}
      </div> : <p className="font-italic italic text-[var(--text-muted)]">Chọn một yêu cầu để xem và cập nhật.</p>}</aside>
    </div>
  </div>;
}
