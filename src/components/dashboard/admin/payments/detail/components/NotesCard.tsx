import React from 'react';

interface NotesCardProps {
  paymentNotes?: string | null;
  orderNotes?: string | null;
}

export const NotesCard: React.FC<NotesCardProps> = ({
  paymentNotes,
  orderNotes
}) => {
  if (!paymentNotes && !orderNotes) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 dark:border-gray-700 dark:from-blue-900/30 dark:to-blue-800/30">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Catatan
        </h2>
      </div>

      <div className="space-y-3 p-6">
        {paymentNotes && (
          <div>
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              Catatan Pembayaran
            </p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {paymentNotes}
            </p>
          </div>
        )}
        {orderNotes && (
          <div
            className={
              paymentNotes
                ? 'border-t border-gray-200 pt-3 dark:border-gray-700'
                : ''
            }
          >
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              Catatan Pesanan
            </p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {orderNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
