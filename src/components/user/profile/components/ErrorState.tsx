'use client';

import { useRouter } from 'next/navigation';

export const ErrorState = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
          Akses Ditolak
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Anda tidak memiliki akses ke halaman ini
        </p>
        <button
          onClick={() => router.push('/auth/login')}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
};
