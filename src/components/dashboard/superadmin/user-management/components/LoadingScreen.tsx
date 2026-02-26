import { User } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-slate-950/90">
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-14 w-14">
          <div className="h-14 w-14 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Memuat halaman…
        </p>
      </div>
    </div>
  );
};
