import { FilterStatus } from '../types';

export const FILTER_BUTTONS: Array<{
  id: FilterStatus;
  label: string;
}> = [
  { id: 'all', label: 'Semua' },
  { id: 'open', label: 'Buka' },
  { id: 'closed', label: 'Tutup' }
];

export const getStatusButtonClass = (
  filterStatus: FilterStatus,
  buttonId: FilterStatus
) => {
  const isActive = filterStatus === buttonId;
  const isClosed = buttonId === 'closed';
  
  if (!isActive) {
    return 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700';
  }
  
  if (isClosed) {
    return 'shadow-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  }
  
  return 'shadow-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
};