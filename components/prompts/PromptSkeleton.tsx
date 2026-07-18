import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PromptSkeletonProps {
  className?: string;
}

export function PromptSkeleton({ className }: PromptSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-full h-[400px] rounded-3xl bg-card border border-border overflow-hidden",
        className
      )}
    >
      {/* Thumbnail placeholder */}
      <Skeleton className="h-[180px] w-full rounded-none" />

      {/* Info placeholder */}
      <div className="flex flex-col flex-grow p-5 justify-between">
        
        {/* Badges/Category */}
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-20 rounded-lg" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Title & Desc */}
        <div className="space-y-2 flex-grow">
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>

        {/* Details row */}
        <div className="flex items-center justify-between py-2.5 border-t border-border/40 mt-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function PromptGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PromptSkeleton key={i} />
      ))}
    </div>
  );
}
