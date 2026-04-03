export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-20 h-8 rounded-lg" />
      </div>
      <div className="skeleton w-24 h-4 rounded" />
      <div className="skeleton w-32 h-7 rounded" />
      <div className="skeleton w-28 h-3 rounded" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card p-5 space-y-4">
      <div className="skeleton w-40 h-5 rounded" />
      <div className="skeleton w-full h-64 rounded-xl" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 px-4">
      <div className="skeleton w-8 h-8 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="skeleton w-32 h-4 rounded" />
        <div className="skeleton w-20 h-3 rounded" />
      </div>
      <div className="skeleton w-20 h-5 rounded" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="card divide-y divide-surface-100 dark:divide-surface-800">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
