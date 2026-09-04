import { AdminInquiry, AdminLease, AdminUnit, OperationalStatus } from "@/app/admin/_lib/api";
import { Badge } from "@/components/gaoji";

const STATUS: Record<OperationalStatus, { label: string; tone: "available" | "held" | "jade" | "danger"; color: string }> = {
  available: { label: "Còn trống", tone: "available", color: "var(--gold-900)" },
  held: { label: "Giữ chỗ", tone: "held", color: "var(--warning)" },
  occupied: { label: "Đang cho thuê", tone: "jade", color: "var(--jade-700)" },
  maintenance: { label: "Bảo trì", tone: "danger", color: "var(--danger)" },
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function StatusView({ units, inquiries, leases }: { units: AdminUnit[]; inquiries: AdminInquiry[]; leases: AdminLease[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const urgent = leases.filter((lease) => lease.days_remaining !== null && lease.days_remaining >= 0 && lease.days_remaining <= 30);
  const activeLeases = new Map(
    leases
      .filter((lease) => new Date(`${lease.start_date}T00:00:00`) <= today && new Date(`${lease.end_date}T00:00:00`) >= today)
      .map((lease) => [lease.property_id, lease]),
  );
  const stats = [
    { value: `${units.filter((unit) => unit.operational_status === "occupied").length} / ${units.length}`, label: "Đang cho thuê", color: "var(--jade-700)" },
    { value: String(units.filter((unit) => unit.operational_status === "available").length), label: "Còn trống", color: "var(--gold-900)" },
    { value: String(inquiries.filter((inquiry) => inquiry.stage === "new").length), label: "Yêu cầu chưa trả lời", color: "var(--clay-500)" },
    { value: String(urgent.length), label: "Việc gấp trong 30 ngày", color: "var(--clay-500)" },
  ];

  return (
    <div className="grid gap-7">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-px bg-[var(--hairline-strong)] border border-[var(--hairline-strong)]">
        {stats.map((stat) => <div key={stat.label} className="bg-[var(--surface-raised)] p-5 sm:p-6 grid gap-2"><strong className="font-display text-3xl sm:text-4xl font-normal leading-none" style={{ color: stat.color }}>{stat.value}</strong><span className="font-sans text-[.6875rem] font-semibold uppercase tracking-[.15em] text-[var(--text-muted)]">{stat.label}</span></div>)}
      </div>

      {urgent.length > 0 && <section className="border border-[var(--clay-500)] bg-[var(--canvas-warm)] p-5" aria-labelledby="urgent-title">
        <h2 id="urgent-title" className="font-sans text-xs font-semibold uppercase tracking-[.18em] text-[var(--clay-500)]">Cần xử lý trong 30 ngày</h2>
        <ul className="mt-3 grid gap-2 font-sans text-sm text-[var(--text-body)]">
          {urgent.map((lease) => <li key={lease.id}><strong>{lease.guest_name} · {lease.unit_code ?? lease.property_name}</strong> — hợp đồng hết hạn {dateLabel(lease.end_date)} ({lease.days_remaining} ngày), tạm trú {lease.residence_status === "registered" ? "đã đăng ký" : "chưa hoàn tất"}.</li>)}
        </ul>
      </section>}

      <section className="border border-[var(--hairline-strong)] bg-[var(--surface-raised)]" aria-labelledby="board-title">
        <div className="p-5 border-b border-[var(--hairline)] flex flex-wrap gap-3 items-baseline justify-between"><h2 id="board-title" className="font-display text-2xl font-normal">Tình trạng thực tế {units.length} căn hộ</h2><span className="font-sans text-xs text-[var(--text-muted)]">Tổng hợp từ căn hộ và hợp đồng hiện hành</span></div>
        {units.length === 0 ? <p className="p-8 font-italic italic text-[var(--text-muted)]">Chưa có căn hộ để theo dõi.</p> : <div className="grid gap-px bg-[var(--hairline)]">
          {units.map((unit) => {
            const status = STATUS[unit.operational_status ?? "available"];
            const lease = activeLeases.get(unit.id);
            return <article key={unit.id} className="bg-[var(--surface-raised)] p-5 flex flex-wrap gap-5 items-center">
              <span aria-hidden="true" className="w-1 self-stretch min-h-12" style={{ background: status.color }} />
              <div className="flex-1 basis-44 min-w-0"><strong className="font-sans text-sm uppercase tracking-[.12em] text-[var(--ink-900)]">{unit.unit_code ?? unit.name}</strong><p className="font-sans text-sm text-[var(--text-muted)] mt-1">{[unit.bedrooms && `${unit.bedrooms}PN`, unit.sqm && `${unit.sqm} m²`, unit.view_type].filter(Boolean).join(" · ") || "Chưa có thông số"}</p></div>
              <div className="flex-1 basis-48 min-w-0"><Badge tone={status.tone}>{status.label}</Badge><p className="font-sans text-sm text-[var(--text-body)] mt-2">{lease?.guest_name ?? "Chưa có khách thuê hiện hành"}</p></div>
              <div className="flex-1 basis-44 min-w-0"><span className="font-sans text-[.6875rem] font-semibold uppercase tracking-[.15em] text-[var(--text-muted)]">Mốc kế tiếp</span><p className="font-sans text-sm text-[var(--text-body)] mt-1">{lease ? `Hết hạn ${dateLabel(lease.end_date)}` : "Sẵn sàng nhận yêu cầu"}</p></div>
              <p className={`flex-1 basis-48 font-italic italic text-sm ${lease?.document_status === "missing" || lease?.residence_status !== "registered" ? "text-[var(--clay-500)]" : "text-[var(--text-muted)]"}`}>{lease ? `${lease.document_status === "complete" ? "Hồ sơ đầy đủ" : "Còn thiếu giấy tờ"} · ${lease.residence_status === "registered" ? "đã đăng ký tạm trú" : "cần xử lý tạm trú"}` : "Theo dõi lead phù hợp cho căn này."}</p>
            </article>;
          })}
        </div>}
      </section>
    </div>
  );
}
