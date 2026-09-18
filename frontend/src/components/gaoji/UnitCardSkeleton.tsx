export function UnitCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Đang tải thông tin căn hộ"
      className={`overflow-hidden rounded-[14px] border border-[var(--hairline)] bg-[var(--surface-raised)] ${className}`}
    >
      <div className="gh-image-skeleton aspect-[5/4]" />
      <div className="space-y-3 p-5">
        <div className="gh-image-skeleton h-3 w-2/5 rounded-sm" />
        <div className="gh-image-skeleton h-7 w-4/5 rounded-sm" />
        <div className="gh-image-skeleton h-4 w-3/5 rounded-sm" />
        <div className="flex gap-3 border-t border-[var(--hairline)] pt-4">
          <div className="gh-image-skeleton h-4 w-14 rounded-sm" />
          <div className="gh-image-skeleton h-4 w-14 rounded-sm" />
          <div className="gh-image-skeleton h-4 w-14 rounded-sm" />
        </div>
        <div className="gh-image-skeleton mt-4 h-[88px] rounded-[9px]" />
      </div>
      <span className="sr-only">Đang tải...</span>
    </div>
  );
}

export default UnitCardSkeleton;
