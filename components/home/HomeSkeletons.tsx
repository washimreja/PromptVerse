"use client";

export function HeroSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto py-16 px-4">
      <div className="w-48 h-8 rounded-full skeleton mb-6" />
      <div className="w-full max-w-2xl h-14 rounded-2xl skeleton mb-4" />
      <div className="w-full max-w-md h-6 rounded-xl skeleton mb-8" />
      <div className="flex gap-4 mb-10">
        <div className="w-36 h-12 rounded-2xl skeleton" />
        <div className="w-36 h-12 rounded-2xl skeleton" />
      </div>
      <div className="w-full max-w-2xl h-14 rounded-2xl skeleton" />
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="w-full py-10 max-w-7xl mx-auto px-4">
      <div className="w-48 h-8 rounded-xl skeleton mb-6" />
      <div className="flex gap-6 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-72 h-80 rounded-2xl skeleton shrink-0" />
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="w-full py-8 max-w-7xl mx-auto px-4">
      <div className="w-40 h-8 rounded-xl skeleton mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="w-full h-80 rounded-2xl skeleton" />
        ))}
      </div>
    </div>
  );
}
