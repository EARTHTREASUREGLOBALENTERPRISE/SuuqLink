export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
