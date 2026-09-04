"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AdminApiError,
  AdminInquiry,
  AdminLease,
  AdminUnit,
  AdminUser,
  clearAdminSession,
  getAdminUser,
  listAdminInquiries,
  listAdminLeases,
  listAdminUnits,
} from "@/app/admin/_lib/api";
import { Button, Icon, Logo } from "@/components/gaoji";
import { InquiryView } from "./InquiryView";
import { LeasesView } from "./LeasesView";
import { StatusView } from "./StatusView";
import { UnitsView } from "./UnitsView";

type View = "status" | "inbox" | "units" | "leases";
const VIEWS: Array<{ id: View; label: string; eyebrow: string; title: string; icon: string }> = [
  { id: "status", label: "Tình trạng căn hộ", eyebrow: "Vận hành hằng ngày", title: "Tình trạng căn hộ", icon: "door-open" },
  { id: "inbox", label: "Hộp yêu cầu", eyebrow: "Guest relations", title: "Hộp yêu cầu từ khách", icon: "users" },
  { id: "units", label: "Quản lý căn hộ", eyebrow: "Danh mục cho thuê", title: "Quản lý căn hộ", icon: "bed-double" },
  { id: "leases", label: "Hợp đồng & khách", eyebrow: "Pháp lý & cư trú", title: "Hợp đồng & khách thuê", icon: "shield-check" },
];

export function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState<View>("status");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [units, setUnits] = useState<AdminUnit[]>([]);
  const [leases, setLeases] = useState<AdminLease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([
        getAdminUser(),
        listAdminInquiries(),
        listAdminUnits(),
        listAdminLeases(),
      ])
      .then(([nextUser, nextInquiries, nextUnits, nextLeases]) => {
        if (!active) return;
      setUser(nextUser);
      setInquiries(nextInquiries);
      setUnits(nextUnits);
      setLeases(nextLeases);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        if (cause instanceof AdminApiError && cause.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setError(cause instanceof AdminApiError ? cause.message : "Không thể tải dữ liệu quản trị.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey, router]);

  function logout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  function retry() {
    setLoading(true);
    setError("");
    setReloadKey((value) => value + 1);
  }

  const active = VIEWS.find((item) => item.id === view) ?? VIEWS[0];
  const newCount = inquiries.filter((item) => item.stage === "new").length;
  const replaceInquiry = (value: AdminInquiry) => setInquiries((items) => items.map((item) => item.id === value.id ? value : item));
  const replaceUnit = (value: AdminUnit) => setUnits((items) => items.map((item) => item.id === value.id ? value : item));
  const replaceLease = (value: AdminLease) => setLeases((items) => items.map((item) => item.id === value.id ? value : item));

  if (loading) {
    return <main className="min-h-screen bg-[var(--canvas)] grid place-items-center p-8"><div role="status" className="grid justify-items-center gap-4 text-[var(--jade-700)]"><Icon name="loader-circle" size={32} className="animate-spin" /><span className="font-sans text-xs font-semibold uppercase tracking-[.18em]">Đang tải bảng điều hành</span></div></main>;
  }

  if (error) {
    return <main className="min-h-screen bg-[var(--canvas)] grid place-items-center p-8"><section className="max-w-lg border border-[var(--clay-500)] bg-[var(--canvas-warm)] p-8"><Icon name="alert-triangle" size={28} color="var(--clay-500)" /><h1 className="font-display text-3xl mt-4">Không tải được bảng điều hành</h1><p role="alert" className="font-sans text-base text-[var(--text-body)] mt-3">{error}</p><div className="flex flex-wrap gap-3 mt-6"><Button type="button" variant="jade" onClick={retry}>Thử lại</Button><Button type="button" variant="outline" onClick={logout}>Đăng nhập lại</Button></div></section></main>;
  }

  return <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink-900)] flex flex-col lg:flex-row">
    <aside className="w-full lg:w-[260px] lg:min-h-screen lg:sticky lg:top-0 lg:self-start bg-[var(--jade-900)] text-[var(--gold-050)] flex flex-col border-r border-[rgba(212,175,55,.22)] shrink-0">
      <div className="p-5 border-b border-[rgba(212,175,55,.22)] grid gap-2 justify-items-start"><Logo variant="dark" size="sm" showTagline={false} /><span className="font-sans text-[.625rem] font-semibold uppercase tracking-[.18em] text-[rgba(250,243,234,.55)]">Bảng điều hành nội bộ</span></div>
      <nav aria-label="Khu vực quản trị" className="p-2 lg:p-0 flex lg:grid overflow-x-auto gap-px bg-[rgba(212,175,55,.16)]">
        {VIEWS.map((item) => <button key={item.id} type="button" aria-current={view === item.id ? "page" : undefined} onClick={() => setView(item.id)} className={`flex-none lg:w-full min-h-13 px-4 lg:px-5 flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[.12em] text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--gold-500)] ${view === item.id ? "bg-[var(--jade-700)] text-[var(--gold-050)]" : "bg-[var(--jade-900)] text-[rgba(250,243,234,.62)] hover:text-white"}`}><Icon name={item.icon} size={18} /><span className="flex-1 whitespace-nowrap">{item.label}</span>{item.id === "inbox" && newCount > 0 && <span className="min-w-6 px-1.5 py-0.5 bg-[var(--gold-500)] text-[var(--jade-900)] text-center">{newCount}</span>}</button>)}
      </nav>
      <div className="mt-auto p-5 border-t border-[rgba(212,175,55,.22)] grid gap-3"><div><span className="block font-sans text-[.625rem] font-semibold uppercase tracking-[.18em] text-[rgba(250,243,234,.55)]">Đang đăng nhập</span><strong className="block font-display text-lg font-normal mt-1">{user?.full_name}</strong><span className="font-sans text-xs text-[rgba(250,243,234,.55)] break-all">{user?.email}</span></div><button type="button" onClick={logout} className="min-h-11 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--gold-500)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]"><Icon name="log-out" size={15} /> Đăng xuất</button><Link href="/" className="min-h-11 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[rgba(250,243,234,.65)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]"><Icon name="arrow-left" size={15} /> Về trang khách</Link></div>
    </aside>
    <main className="flex-1 min-w-0">
      <header className="border-b border-[var(--hairline-strong)] bg-[var(--canvas-warm)] px-5 sm:px-8 lg:px-10 py-6 flex flex-wrap gap-4 items-end justify-between"><div><span className="font-sans text-[.6875rem] font-semibold uppercase tracking-[.18em] text-[var(--gold-900)]">{active.eyebrow}</span><h1 className="font-display text-3xl sm:text-4xl font-normal leading-tight mt-1">{active.title}</h1></div><span className="font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Dữ liệu vận hành trực tiếp</span></header>
      <div className="p-5 sm:p-8 lg:p-10">
        <div className="mb-6 border-l-4 border-[var(--gold-500)] bg-[var(--gold-100)] px-4 py-3 font-sans text-sm text-[var(--text-body)]"><strong>Môi trường nội bộ:</strong> phân quyền theo tổ chức đang được theo dõi tại T-015.</div>
        {view === "status" && <StatusView units={units} inquiries={inquiries} leases={leases} />}
        {view === "inbox" && <InquiryView inquiries={inquiries} onChange={replaceInquiry} />}
        {view === "units" && <UnitsView units={units} onChange={replaceUnit} />}
        {view === "leases" && <LeasesView leases={leases} units={units} onCreate={(lease) => setLeases((items) => [...items, lease].sort((a, b) => a.end_date.localeCompare(b.end_date)))} onChange={replaceLease} />}
      </div>
    </main>
  </div>;
}
