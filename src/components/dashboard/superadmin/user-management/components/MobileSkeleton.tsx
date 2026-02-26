'use client';

import { MobileCardSkeleton } from './SkeletonCard';

export const MobileSkeleton = () => {
  return (
    <div className="space-y-3 p-4 lg:hidden">
      {[...Array(3)].map((_, index) => (
        <MobileCardSkeleton key={index} />
      ))}
    </div>
  );
};
