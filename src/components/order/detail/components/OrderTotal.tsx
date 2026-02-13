'use client';

interface OrderTotalProps {
  totalPrice: number;
}

export const OrderTotal = ({ totalPrice }: OrderTotalProps) => {
  return (
    <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
      <div className="flex justify-end">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Total Keseluruhan
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            Rp {totalPrice.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
};
