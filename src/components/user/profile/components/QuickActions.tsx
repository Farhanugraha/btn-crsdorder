'use client';

import { Home } from 'lucide-react';

interface QuickActionsProps {
  onHome: () => void;
}

export const QuickActions = ({ onHome }: QuickActionsProps) => {
  return (
    <button
      onClick={onHome}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
    >
      <Home className="h-4 w-4" />
      Kembali ke Dashboard
    </button>
  );
};
