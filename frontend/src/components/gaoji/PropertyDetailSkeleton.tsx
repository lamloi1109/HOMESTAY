export function PropertyDetailSkeleton({ label = "Đang tải thông tin chi tiết căn hộ..." }: { label?: string }) {
  return (
    <main
      role="status"
      aria-label={label}
      className="min-h-screen bg-[var(--canvas)] pb-24"
    >
      <section className="mx-auto max-w-[1600px] px-4 pt-8 sm:px-8 sm:pt-10 lg:px-12">
        <div className="gh-image-skeleton h-3 w-64 max-w-[70vw]" />
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-3xl space-y-3">
            <div className="gh-image-skeleton h-12 w-4/5 sm:h-16" />
            <div className="gh-image-skeleton h-5 w-3/5" />
          </div>
          <div className="flex gap-3">
            <div className="gh-image-skeleton h-8 w-36" />
            <div className="gh-image-skeleton h-8 w-40" />
          </div>
        </div>
        <div className="mt-7 border-t border-[var(--hairline)] pt-5">
          <div className="flex flex-wrap gap-5">
            {[72, 72, 82, 90].map((width, index) => (
              <div key={`${width}-${index}`} className="gh-image-skeleton h-4" style={{ width }} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="grid h-[clamp(360px,36vw,520px)] grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="gh-image-skeleton h-full" />
          <div className="hidden grid-cols-2 grid-rows-2 gap-2 sm:grid">
            {[0, 1, 2, 3].map((item) => <div key={item} className="gh-image-skeleton" />)}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-[1600px] grid-cols-1 items-start gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="space-y-12 lg:col-span-7">
          {[0, 1, 2].map((card) => (
            <div key={card} className="border border-[var(--hairline)] bg-[var(--surface-raised)] p-6 sm:p-8">
              <div className="gh-image-skeleton h-7 w-3/5" />
              <div className="mt-6 space-y-3">
                <div className="gh-image-skeleton h-4 w-full" />
                <div className="gh-image-skeleton h-4 w-11/12" />
                <div className="gh-image-skeleton h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
        <div className="border border-[var(--gold-700)] bg-[var(--canvas-warm)] p-6 sm:p-8 lg:col-span-5">
          <div className="gh-image-skeleton h-3 w-3/5" />
          <div className="gh-image-skeleton mt-5 h-11 w-4/5" />
          <div className="gh-image-skeleton mt-7 h-11 w-full" />
          <div className="gh-image-skeleton mt-3 h-11 w-full" />
        </div>
      </section>
      <span className="sr-only">{label}</span>
    </main>
  );
}

export default PropertyDetailSkeleton;
