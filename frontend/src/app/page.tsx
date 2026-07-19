import { fetchProperties, type Property } from "@/lib/api";

export const dynamic = "force-dynamic";

async function loadProperties(): Promise<Property[] | null> {
  try {
    return await fetchProperties();
  } catch {
    // Backend chưa chạy — hiển thị hướng dẫn thay vì crash trang.
    return null;
  }
}

export default async function Home() {
  const properties = await loadProperties();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Homestay Booking</h1>
      <p className="mt-2 text-zinc-500">
        MVP core — danh sách property đọc trực tiếp từ FastAPI backend.
      </p>

      {properties === null ? (
        <div className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          <p className="font-medium">Không kết nối được backend.</p>
          <p className="mt-1 font-mono text-sm">
            docker compose up -d db && cd backend && .venv/Scripts/python -m
            uvicorn app.main:app --reload
          </p>
        </div>
      ) : properties.length === 0 ? (
        <p className="mt-8 text-zinc-500">
          Chưa có property nào — chạy{" "}
          <code className="font-mono">python -m app.seed --demo</code>.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {properties.map((p) => (
            <li
              key={p.id}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <h2 className="text-lg font-medium">{p.name}</h2>
              <p className="text-sm text-zinc-500">
                {[p.address, p.city].filter(Boolean).join(", ")}
              </p>
              {p.description ? (
                <p className="mt-1 text-sm">{p.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
