'use client';

import { Eye } from 'lucide-react';
import { Payment } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  formatFullCurrency,
  formatDate,
  getPaymentMethodDisplay
} from '../utils/paymentUtils';

interface PaymentsTableProps {
  payments: Payment[];
}

export const PaymentsTable = ({ payments }: PaymentsTableProps) => {
  if (payments.length === 0) return null;

  return (
    <div className="hidden overflow-x-auto p-0 sm:block">
      <table className="w-full min-w-[1000px]">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Transaksi
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Pelanggan
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Metode
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Jumlah
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
            >
              <td className="whitespace-nowrap px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    #{payment.order.order_code}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {payment.transaction_id.slice(0, 12)}...
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {payment.order.user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {payment.order.user.email}
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {getPaymentMethodDisplay(payment.payment_method)}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatFullCurrency(
                    parseInt(payment.order.total_price)
                  )}
                </p>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge status={payment.payment_status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {formatDate(payment.created_at)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-2">
                  <a
                    href={`/dashboard/payments/${payment.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Detail
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
