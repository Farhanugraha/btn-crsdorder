'use client';

import { ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { QuickActionItemProps } from '../types';

export const QuickActionItem = ({
  title,
  description,
  href,
  icon
}: QuickActionItemProps) => {
  const IconComponent =
    (Icons as any)[icon as string] || Icons.HelpCircle;

  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm dark:border-gray-800 dark:bg-gray-800 dark:hover:border-blue-700"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 group-hover:from-blue-100 group-hover:to-blue-50 group-hover:text-blue-600 dark:from-gray-800 dark:to-gray-700 dark:text-gray-400">
          <IconComponent className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
    </a>
  );
};
