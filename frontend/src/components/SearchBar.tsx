"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { isoDate } from "@/lib/format";

export function SearchBar({
  initialCity = "",
  initialCheckIn = "",
  initialCheckOut = "",
}: {
  initialCity?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
}) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity);
  const [checkIn, setCheckIn] = useState(initialCheckIn || isoDate(1));
  const [checkOut, setCheckOut] = useState(initialCheckOut || isoDate(2));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (checkIn) params.set("in", checkIn);
    if (checkOut) params.set("out", checkOut);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-2 shadow-sm sm:flex-row sm:items-center"
    >
      <label className="flex flex-1 items-center gap-2 rounded-xl bg-wash px-3 py-2.5">
        <MapPin className="h-4 w-4 shrink-0 text-muted" aria-hidden />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Bạn muốn đi đâu?"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          aria-label="Điểm đến"
        />
      </label>
      <div className="flex items-center gap-2 rounded-xl bg-wash px-3 py-1.5">
        <CalendarDays className="h-4 w-4 shrink-0 text-muted" aria-hidden />
        <div className="flex items-center gap-1 text-sm">
          <input
            type="date"
            value={checkIn}
            min={isoDate(0)}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-transparent outline-none"
            aria-label="Ngày nhận phòng"
          />
          <span className="text-muted">–</span>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-transparent outline-none"
            aria-label="Ngày trả phòng"
          />
        </div>
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-terra px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-terra-deep"
      >
        <Search className="h-4 w-4" aria-hidden />
        Tìm kiếm
      </button>
    </form>
  );
}
