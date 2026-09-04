"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button, Icon, Logo } from "@/components/gaoji";
import { AdminApiError, getAdminUser, loginAdmin } from "@/app/admin/_lib/api";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAdminUser().then(() => router.replace("/admin")).catch(() => undefined);
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await loginAdmin(email.trim(), password);
      router.replace("/admin");
    } catch (cause) {
      setError(cause instanceof AdminApiError ? cause.message : "Không thể đăng nhập.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-root min-h-screen bg-[var(--canvas)] text-[var(--ink-900)] grid lg:grid-cols-[minmax(320px,0.8fr)_minmax(480px,1.2fr)]">
      <section className="bg-[var(--jade-900)] text-[var(--gold-050)] p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[320px] lg:min-h-screen border-r border-[rgba(212,175,55,.28)]">
        <Logo variant="dark" size="md" showTagline={false} />
        <div className="max-w-lg py-12">
          <span className="font-sans text-xs font-semibold uppercase tracking-[.22em] text-[var(--gold-500)]">Bảng điều hành nội bộ</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.02] mt-4">Mỗi căn hộ,<br />một nhịp vận hành.</h1>
          <p className="font-sans text-base leading-relaxed text-[rgba(250,243,234,.68)] mt-6 max-w-md">Theo dõi yêu cầu tư vấn, giá thuê, tình trạng căn và hồ sơ cư trú tại một nơi.</p>
        </div>
        <span className="font-sans text-[.6875rem] uppercase tracking-[.18em] text-[rgba(250,243,234,.45)]">Gao Ji House · Vinhomes Central Park</span>
      </section>

      <section className="p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md border border-[var(--hairline-strong)] bg-[var(--surface-raised)] p-7 sm:p-10" noValidate>
          <span className="font-sans text-[.6875rem] font-semibold uppercase tracking-[.2em] text-[var(--gold-900)]">Quản trị vận hành</span>
          <h2 className="font-display text-3xl font-normal mt-2">Đăng nhập</h2>
          <p className="font-sans text-sm text-[var(--text-muted)] mt-3">Dùng tài khoản quản lý đã được cấp cho Gao Ji House.</p>
          <div className="grid gap-5 mt-8">
            <label className="grid gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Email
              <input className="min-h-12 px-3 bg-white border border-[var(--hairline-strong)] text-base normal-case tracking-normal focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="grid gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]">Mật khẩu
              <input className="min-h-12 px-3 bg-white border border-[var(--hairline-strong)] text-base normal-case tracking-normal focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]" type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
          </div>
          {error && <div role="alert" className="mt-5 p-3 border border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)] font-sans text-sm flex gap-2"><Icon name="alert-triangle" size={18} /><span>{error}</span></div>}
          <Button type="submit" variant="gold" size="lg" full disabled={submitting || !email || password.length < 8} className="mt-7">{submitting ? "Đang đăng nhập…" : "Vào bảng điều hành"}</Button>
          <Link href="/" className="mt-5 min-h-11 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--gold-900)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)]"><Icon name="arrow-left" size={15} /> Về trang khách</Link>
        </form>
      </section>
    </main>
  );
}
