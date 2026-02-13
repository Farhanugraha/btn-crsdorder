'use client';

import type { Order } from '../types';

interface CheckoutSidebarProps {
  order: Order;
}

export const CheckoutSidebar = ({ order }: CheckoutSidebarProps) => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
              Status Pesanan
            </p>
            <p className="mt-1 font-bold text-yellow-600 dark:text-yellow-400">
              Menunggu Pembayaran
            </p>
          </div>

          {order.notes && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
              <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                Catatan Pesanan
              </p>
              <p className="line-clamp-3 text-xs text-slate-900 dark:text-white sm:text-sm">
                {order.notes}
              </p>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
              Waktu Pemesanan
            </p>
            <p className="text-xs text-slate-900 dark:text-white sm:text-sm">
              {new Date(order.created_at).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
