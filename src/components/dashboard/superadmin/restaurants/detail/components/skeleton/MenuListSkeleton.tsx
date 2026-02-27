'use client';

import { MenuItemSkeleton } from './MenuItemSkeleton';

interface MenuListSkeletonProps {
  count?: number;
}

export const MenuListSkeleton = ({
  count = 5
}: MenuListSkeletonProps) => {
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {[...Array(count)].map((_, index) => (
        <MenuItemSkeleton key={index} />
      ))}
    </div>
  );
};
