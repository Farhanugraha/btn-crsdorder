'use client';

import { TableRowSkeleton } from './SkeletonCard';

export const TableSkeleton = () => {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-700/60 dark:bg-slate-800/60">
            {[
              'Pengguna',
              'Role',
              'Divisi',
              'Status',
              'Bergabung',
              ''
            ].map((h, i) => (
              <th
                key={h + i}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ${
                  i === 5 ? 'text-right' : 'text-left'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
          {[...Array(5)].map((_, index) => (
            <TableRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
