export function PromptSkeleton({ variant = "grid" }: { variant?: "grid" | "carousel" }) {
  const width = variant === "carousel" ? "w-44 sm:w-52 md:w-56 flex-shrink-0" : "w-full";
  return (
    <div className={width}>
      <div
        className="skeleton rounded-xl w-full"
        style={{ aspectRatio: "3/4" }}
      />
    </div>
  );
}

export function PromptSkeletonGrid({ count = 10, variant = "grid" }: { count?: number; variant?: "grid" | "carousel" }) {
  if (variant === "carousel") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <PromptSkeleton key={i} variant="carousel" />
        ))}
      </>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PromptSkeleton key={i} variant="grid" />
      ))}
    </div>
  );
}
