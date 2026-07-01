/** @file Skeleton loader components — animated placeholders shown while data is loading. */

/** Animated gray bar. @param {{ className }} props - Pass width/height via className. */
export function SkeletonLine({ className = "" }) {
  return (
    <div className={`bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${className}`} />
  );
}

/** Three-line card skeleton for list items (e.g. users, forms). */
export function SkeletonCard() {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
      <SkeletonLine className="h-4 w-3/4" />
      <SkeletonLine className="h-3 w-1/2" />
      <SkeletonLine className="h-3 w-2/3" />
    </div>
  );
}

/** Stat card skeleton with circle icon placeholder + number + label for the statistics page. */
export function SkeletonStatCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 text-center space-y-3">
      <SkeletonLine className="h-8 w-8 rounded-full mx-auto" />
      <SkeletonLine className="h-8 w-16 mx-auto" />
      <SkeletonLine className="h-3 w-24 mx-auto" />
    </div>
  );
}
