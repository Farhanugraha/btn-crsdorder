'use client';

import { Eye } from 'lucide-react';
import { Payment } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  formatFullCurrency,
  formatShortDate,
  getPaymentMethodDisplay
} from '../utils/paymentUtils';

interface PaymentsMobileCardsProps {
  payments: Payment[];
}

export const PaymentsMobileCards = ({
  payments
}: PaymentsMobileCardsProps) => {
  if (payments.length === 0) return null;

  return (
    <div className="space-y-3 p-4 sm:hidden">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="border-b border-gray-100 p-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  #{payment.order.order_code}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {payment.transaction_id.slice(0, 12)}...
                </p>
              </div>
              <StatusBadge status={payment.payment_status} />
            </div>
          </div>

          <div className="p-3">
            {/* Customer Info */}
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {payment.order.user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {payment.order.user.email}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Metode
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getPaymentMethodDisplay(payment.payment_method)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tanggal
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatShortDate(payment.created_at)}
                </p>
              </div>
            </div>

            {/* Amount & Action */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Jumlah
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatFullCurrency(
                    parseInt(payment.order.total_price)
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/dashboard/payments/${payment.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Lihat
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
