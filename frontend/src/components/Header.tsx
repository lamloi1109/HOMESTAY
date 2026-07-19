import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-xl font-bold text-terra">
          Homestay
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/properties" className="hover:text-terra">
            Chỗ ở
          </Link>
          <Link href="/lookup" className="hover:text-terra">
            Tra cứu đặt phòng
          </Link>
        </nav>
      </div>
    </header>
  );
}
