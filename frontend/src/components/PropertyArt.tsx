/**
 * Art placeholder — chưa có upload ảnh (Phase 1 còn lại, xem D-006).
 * Mỗi property một khối "mái ngói" SVG với tông màu ổn định theo tên,
 * để lưới card không trống trải và vẫn đúng chất mộc mạc của mockup.
 */

const PALETTES: [string, string, string][] = [
  ["#c2511d", "#d9a05b", "#faf5ec"], // terracotta / cát
  ["#7c9885", "#a9bfa0", "#f2f5ee"], // xanh đồi thông
  ["#5c8a8a", "#8fb3b0", "#eef4f3"], // xanh hồ
  ["#9e3f12", "#c2511d", "#f8ead9"], // nâu đất nung
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

export function PropertyArt({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const [deep, mid, light] = PALETTES[hashName(name) % PALETTES.length];
  // Hàng ngói: các nửa vòng tròn xếp so le
  const rows = [0, 1, 2, 3, 4, 5];
  const cols = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg
      viewBox="0 0 420 300"
      role="img"
      aria-label={`Hình minh họa cho ${name}`}
      className={`h-full w-full object-cover ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="420" height="300" fill={light} />
      {rows.map((r) =>
        cols.map((c) => {
          const x = c * 70 + (r % 2 === 0 ? 0 : 35);
          const y = 60 + r * 48;
          return (
            <path
              key={`${r}-${c}`}
              d={`M ${x - 45} ${y} A 45 45 0 0 1 ${x + 45} ${y}`}
              fill={r % 3 === 0 ? deep : mid}
              opacity={0.92 - r * 0.06}
            />
          );
        }),
      )}
      <circle cx="352" cy="52" r="26" fill={light} opacity="0.9" />
    </svg>
  );
}
