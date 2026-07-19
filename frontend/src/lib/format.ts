export function formatVnd(amount: string | number): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return `${new Intl.NumberFormat("vi-VN").format(n)} đ`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** yyyy-mm-dd theo giờ địa phương, offset ngày tùy chọn. */
export function isoDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(`${checkIn}T00:00:00`);
  const b = new Date(`${checkOut}T00:00:00`);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}
