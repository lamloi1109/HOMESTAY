"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, Users } from "lucide-react";
import {
  ApiError,
  createBooking,
  fetchAvailableRooms,
  type Room,
  type RoomType,
} from "@/lib/api";
import { formatVnd, isoDate, nightsBetween } from "@/lib/format";

type Availability = Record<string, Room[] | undefined>;

export function BookingWidget({
  roomTypes,
  initialCheckIn = "",
  initialCheckOut = "",
}: {
  roomTypes: RoomType[];
  initialCheckIn?: string;
  initialCheckOut?: string;
}) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn || isoDate(1));
  const [checkOut, setCheckOut] = useState(initialCheckOut || isoDate(2));
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [numGuests, setNumGuests] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights = nightsBetween(checkIn, checkOut);
  const validRange = nights > 0;

  // Loading là trạng thái dẫn xuất: key đã load khác key đang cần → đang tải.
  // (tránh setState đồng bộ trong effect — rule react-hooks/set-state-in-effect)
  const [refreshTick, setRefreshTick] = useState(0);
  const requestKey = validRange ? `${checkIn}|${checkOut}|${refreshTick}` : "";
  const [loaded, setLoaded] = useState<{ key: string; rooms: Availability }>({
    key: "",
    rooms: {},
  });
  const availability = loaded.key === requestKey ? loaded.rooms : {};
  const loadingRooms = requestKey !== "" && loaded.key !== requestKey;

  useEffect(() => {
    if (!requestKey) return;
    let cancelled = false;
    (async () => {
      try {
        const entries = await Promise.all(
          roomTypes.map(async (rt) => {
            const rooms = await fetchAvailableRooms(
              rt.id,
              requestKey.split("|")[0],
              requestKey.split("|")[1],
            );
            return [rt.id, rooms] as const;
          }),
        );
        if (cancelled) return;
        setLoaded({ key: requestKey, rooms: Object.fromEntries(entries) });
        setError(null);
      } catch {
        if (cancelled) return;
        setLoaded({ key: requestKey, rooms: {} });
        setError("Không tải được tình trạng phòng. Kiểm tra backend đang chạy.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [requestKey, roomTypes]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType) return;
    const rooms = availability[selectedType.id] ?? [];
    if (rooms.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const booking = await createBooking({
        room_id: rooms[0].id,
        check_in: checkIn,
        check_out: checkOut,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone || undefined,
        num_guests: numGuests,
      });
      router.push(`/bookings/${booking.code}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError(
          "Phòng vừa có người khác giữ trước. Danh sách phòng trống đã được cập nhật — chọn lại giúp bạn nhé.",
        );
        setRefreshTick((t) => t + 1);
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Không gửi được yêu cầu. Thử lại sau ít phút.");
      }
      setSubmitting(false);
    }
  }

  return (
    <section id="dat-phong" className="scroll-mt-24">
      <h2 className="text-xl font-bold">Chọn phòng</h2>

      {/* Chọn ngày */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
          <CalendarDays className="h-4 w-4 text-muted" aria-hidden />
          <input
            type="date"
            value={checkIn}
            min={isoDate(0)}
            onChange={(e) => {
              setCheckIn(e.target.value);
              setSelectedType(null);
            }}
            className="bg-transparent text-sm outline-none"
            aria-label="Ngày nhận phòng"
          />
          <span className="text-muted">–</span>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => {
              setCheckOut(e.target.value);
              setSelectedType(null);
            }}
            className="bg-transparent text-sm outline-none"
            aria-label="Ngày trả phòng"
          />
        </div>
        <p className="text-sm text-muted">
          {validRange ? `${nights} đêm` : "Chọn ngày trả phòng sau ngày nhận"}
        </p>
        {loadingRooms ? (
          <Loader2 className="h-4 w-4 animate-spin text-terra" aria-label="Đang tải" />
        ) : null}
      </div>

      {/* Danh sách loại phòng */}
      <div className="mt-4 space-y-3">
        {roomTypes.map((rt) => {
          const rooms = availability[rt.id];
          const free = rooms?.length ?? 0;
          const soldOut = rooms !== undefined && free === 0;
          const selected = selectedType?.id === rt.id;
          return (
            <button
              key={rt.id}
              type="button"
              disabled={soldOut || !validRange}
              onClick={() => setSelectedType(selected ? null : rt)}
              aria-pressed={selected}
              className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                selected
                  ? "border-terra bg-wash"
                  : "border-line bg-surface hover:border-terra/50"
              } ${soldOut ? "opacity-50" : ""}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-semibold">{rt.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    Tối đa {rt.capacity_adults} người lớn
                    {rt.capacity_children > 0
                      ? ` · ${rt.capacity_children} trẻ em`
                      : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-terra">
                    {formatVnd(rt.base_price)}
                    <span className="font-normal text-muted"> / đêm</span>
                  </p>
                  <p className="text-xs text-muted">
                    {rooms === undefined
                      ? "…"
                      : soldOut
                        ? "Hết phòng khoảng ngày này"
                        : `Còn ${free} phòng`}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Form khách — hiện khi đã chọn loại phòng */}
      {selectedType && validRange ? (
        <form
          onSubmit={submit}
          className="mt-5 space-y-3 rounded-2xl border border-line bg-surface p-5"
        >
          <h3 className="font-semibold">Thông tin liên hệ</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Họ và tên"
              className="rounded-xl bg-wash px-3 py-2.5 text-sm outline-none placeholder:text-muted"
              aria-label="Họ và tên"
            />
            <input
              required
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Email nhận xác nhận"
              className="rounded-xl bg-wash px-3 py-2.5 text-sm outline-none placeholder:text-muted"
              aria-label="Email"
            />
            <input
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="Số điện thoại (không bắt buộc)"
              className="rounded-xl bg-wash px-3 py-2.5 text-sm outline-none placeholder:text-muted"
              aria-label="Số điện thoại"
            />
            <label className="flex items-center gap-2 rounded-xl bg-wash px-3 py-2.5 text-sm">
              <span className="text-muted">Số khách</span>
              <input
                type="number"
                min={1}
                max={selectedType.capacity_adults + selectedType.capacity_children}
                value={numGuests}
                onChange={(e) => setNumGuests(Number(e.target.value))}
                className="w-16 bg-transparent outline-none"
                aria-label="Số khách"
              />
            </label>
          </div>

          <div className="flex items-baseline justify-between border-t border-line pt-3">
            <p className="text-sm text-muted">
              {selectedType.name} · {nights} đêm
            </p>
            <p className="text-lg font-bold text-terra">
              {formatVnd(Number(selectedType.base_price) * nights)}
            </p>
          </div>

          {error ? (
            <p className="rounded-xl bg-terra/10 px-3 py-2 text-sm text-terra-deep">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-terra px-5 py-3 font-semibold text-white transition-colors hover:bg-terra-deep disabled:opacity-60"
          >
            {submitting ? "Đang giữ phòng…" : "Giữ phòng trong 15 phút"}
          </button>
          <p className="text-center text-xs text-muted">
            Chưa thu tiền — phòng được giữ 15 phút để hoàn tất thanh toán
            (thanh toán online mở ở giai đoạn sau).
          </p>
        </form>
      ) : null}
    </section>
  );
}
