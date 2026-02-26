import { AlertTriangle } from 'lucide-react';

export const AuthGuard = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-500" />
        <div className="p-8">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100 dark:bg-red-900/20 dark:ring-red-800/40">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Autentikasi Diperlukan
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Mengalihkan ke halaman login…
          </p>
        </div>
      </div>
    </div>
  );
};
