'use client';

import { Bell } from 'lucide-react';

interface NotificationsBellProps {
  count: number;
}

export const NotificationsBell = ({
  count
}: NotificationsBellProps) => {
  return (
    <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
};
