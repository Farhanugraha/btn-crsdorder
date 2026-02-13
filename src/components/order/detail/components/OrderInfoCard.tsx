'use client';

import { formatDate } from '../utils/orderDetailUtils';

interface OrderInfoCardProps {
  orderCode: string;
  status: string;
  createdAt: string;
}

export const OrderInfoCard = ({
  orderCode,
  status,
  createdAt
}: OrderInfoCardProps) => {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Nomor Pesanan
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            {orderCode}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold capitalize text-slate-900 dark:text-white">
              {status}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Tanggal Pesan
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
