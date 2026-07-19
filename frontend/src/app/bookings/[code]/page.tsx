import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  CircleSlash,
  Clock3,
  DoorOpen,
  Users,
} from "lucide-react";
import {
  ApiError,
  fetchBookingByCode,
  fetchPropertyDetail,
  type BookingStatus,
} from "@/lib/api";
import { formatDate, formatVnd } from "@/lib/format";
import { HoldCountdown } from "@/components/HoldCountdown";

export const dynamic = "force-dynamic";

const STATUS_VIEW: Record<
  BookingStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  pending: {
    label: "Đang giữ phòng",
    className: "bg-star/15 text-terra-deep",
    icon: Clock3,
  },
  confirmed: {
    label: "Đã xác nhận",
    className: "bg-sage/20 text-ink",
    icon: BadgeCheck,
  },
  checked_in: {
    label: "Đã nhận phòng",
    className: "bg-lake/20 text-ink",
    icon: DoorOpen,
  },
  checked_out: {
    label: "Đã trả phòng",
    className: "bg-line text-muted",
    icon: DoorOpen,
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-line text-muted",
    icon: CircleSlash,
  },
  expired: {
    label: "Hết hạn giữ phòng",
    className: "bg-line text-muted",
    icon: CircleSlash,
  },
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let booking;
  try {
    booking = await fetchBookingByCode(code);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    return (
      <main className="mx-auto max-w-2xl px-5 py-16">
        <p className="text-muted">
          Chưa kết nối được máy chủ — bật backend rồi tải lại trang.
        </p>
      </main>
    );
  }

  let propertyName = "";
  try {
    propertyName = (await fetchPropertyDetail(booking.property_id)).name;
  } catch {
    // tên property chỉ để hiển thị — thiếu cũng không chặn trang
  }

  const view = STATUS_VIEW[booking.status];
  const StatusIcon = view.icon;

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <p className="text-sm text-muted">Mã đặt phòng</p>
      <p className="mt-1 font-mono text-3xl font-bold tracking-widest text-terra">
        {booking.code}
      </p>

      <div className="mt-5 rounded-3xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${view.className}`}
          >
            <StatusIcon className="h-4 w-4" aria-hidden />
            {view.label}
          </span>
          {booking.status === "pending" && booking.expires_at ? (
            <HoldCountdown expiresAt={booking.expires_at} />
          ) : null}
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          {propertyName ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Chỗ ở</dt>
              <dd className="text-right font-medium">{propertyName}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="flex items-center gap-1.5 text-muted">
              <CalendarDays className="h-4 w-4" aria-hidden /> Nhận – trả phòng
            </dt>
            <dd className="font-medium">
              {formatDate(booking.check_in)} – {formatDate(booking.check_out)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="flex items-center gap-1.5 text-muted">
              <Users className="h-4 w-4" aria-hidden /> Số khách
            </dt>
            <dd className="font-medium">{booking.num_guests}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Khách đặt</dt>
            <dd className="font-medium">{booking.guest_name}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-line pt-3 text-base">
            <dt className="font-semibold">Tổng tiền</dt>
            <dd className="font-bold text-terra">
              {formatVnd(booking.total_amount)}
            </dd>
          </div>
        </dl>
      </div>

      {booking.status === "pending" ? (
        <p className="mt-4 text-sm text-muted">
          Phòng đang được giữ cho bạn. Thanh toán online sẽ mở ở giai đoạn sau —
          hiện tại chủ nhà sẽ liên hệ qua email{" "}
          <span className="font-medium text-ink">{booking.guest_email}</span> để
          xác nhận.
        </p>
      ) : null}
      {booking.status === "expired" ? (
        <p className="mt-4 text-sm text-muted">
          Thời gian giữ phòng đã hết. Bạn có thể{" "}
          <Link
            href={`/properties/${booking.property_id}`}
            className="font-medium text-terra hover:text-terra-deep"
          >
            đặt lại phòng này
          </Link>{" "}
          nếu vẫn còn trống.
        </p>
      ) : null}

      <p className="mt-6">
        <Link
          href="/properties"
          className="text-sm font-medium text-terra hover:text-terra-deep"
        >
          ← Tiếp tục khám phá chỗ ở
        </Link>
      </p>
    </main>
  );
}
