import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Payment } from '../types';
import {
  getPaymentMethodLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  formatDate
} from '../utils/paymentHelpers';
import { StatusEditForm } from './StatusEditForm';
import { PAYMENT_MESSAGES } from '../constants';

interface PaymentStatusCardProps {
  payment: Payment;
  isEditing: boolean;
  editStatus: string;
  isSaving: boolean;
  onEdit: () => void;
  onStatusChange: (status: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'rejected':
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  payment,
  isEditing,
  editStatus,
  isSaving,
  onEdit,
  onStatusChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 dark:border-gray-700 dark:from-slate-800 dark:to-slate-900">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Status Pembayaran
        </h2>
      </div>

      <div className="p-6">
        {isEditing ? (
          <StatusEditForm
            editStatus={editStatus}
            isSaving={isSaving}
            onStatusChange={onStatusChange}
            onSave={onSave}
            onCancel={onCancel}
          />
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-900/30 dark:to-blue-800/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status Saat Ini
                </span>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getPaymentStatusColor(
                    payment.payment_status
                  )}`}
                >
                  {getStatusIcon(payment.payment_status)}
                  {getPaymentStatusLabel(payment.payment_status)}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Metode Pembayaran
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {getPaymentMethodLabel(payment.payment_method)}
                </p>
              </div>
              {payment.paid_at && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Waktu Pembayaran
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatDate(payment.paid_at)}
                  </p>
                </div>
              )}
            </div>

            {!isEditing && payment.payment_status !== 'completed' && (
              <button
                onClick={onEdit}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {PAYMENT_MESSAGES.VERIFY_BUTTON}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
