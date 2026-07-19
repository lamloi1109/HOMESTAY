"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TimerReset } from "lucide-react";

/** Đếm ngược thời gian giữ phòng; hết giờ hoặc mỗi 30s tự làm mới trang
 * để lấy trạng thái thật từ backend (cron expire là nguồn sự thật). */
export function HoldCountdown({ expiresAt }: { expiresAt: string }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, new Date(expiresAt).getTime() - Date.now()),
  );

  useEffect(() => {
    const tick = setInterval(() => {
      const ms = Math.max(0, new Date(expiresAt).getTime() - Date.now());
      setRemaining(ms);
      if (ms === 0) router.refresh();
    }, 1000);
    const poll = setInterval(() => router.refresh(), 30_000);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [expiresAt, router]);

  const mm = String(Math.floor(remaining / 60_000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60_000) / 1000)).padStart(2, "0");

  return (
    <p className="flex items-center gap-2 text-sm">
      <TimerReset className="h-4 w-4 text-terra" aria-hidden />
      Giữ phòng còn{" "}
      <span className="font-mono text-base font-bold text-terra tabular-nums">
        {mm}:{ss}
      </span>
    </p>
  );
}
