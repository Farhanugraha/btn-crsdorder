'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 dark:bg-slate-900">
      <div className="text-6xl">❌</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Pesanan Tidak Ditemukan
      </h1>
      <p className="text-slate-600 dark:text-slate-400">
        Silakan lakukan checkout melalui keranjang Anda
      </p>
      <Button
        onClick={() => router.push('/')}
        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
      >
        Kembali ke Beranda
      </Button>
    </div>
  );
}
