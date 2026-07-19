"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ticket } from "lucide-react";

export default function LookupPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) router.push(`/bookings/${trimmed}`);
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Tra cứu đặt phòng
      </h1>
      <p className="mt-2 text-muted">
        Nhập mã đặt phòng trong email xác nhận (dạng{" "}
        <span className="font-mono">BKXXXXXXXX</span>).
      </p>
      <form onSubmit={submit} className="mt-6 flex gap-2">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5">
          <Ticket className="h-4 w-4 text-muted" aria-hidden />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="BK…"
            className="w-full bg-transparent font-mono text-sm uppercase outline-none placeholder:text-muted"
            aria-label="Mã đặt phòng"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-terra px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-terra-deep"
        >
          Tra cứu
        </button>
      </form>
    </main>
  );
}
