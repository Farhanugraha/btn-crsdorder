'use client';

export const LoadingSkeleton = () => {
  return (
    <div className="hidden md:flex md:items-center md:gap-2">
      <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
      <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
    </div>
  );
};
