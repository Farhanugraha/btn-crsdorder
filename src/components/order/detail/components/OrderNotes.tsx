'use client';

interface OrderNotesProps {
  notes: string;
}

export const OrderNotes = ({ notes }: OrderNotesProps) => {
  if (!notes) return null;

  return (
    <div className="mb-4 mt-6 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 py-2 pl-3 pr-2 dark:border-l-blue-400 dark:bg-blue-900/20">
      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
        Catatan Pesanan
      </p>
      <p className="mt-1 text-sm text-slate-900 dark:text-white">
        {notes}
      </p>
    </div>
  );
};
