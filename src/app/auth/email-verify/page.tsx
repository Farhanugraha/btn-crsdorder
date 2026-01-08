'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function EmailVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Ambil parameter dari URL yang dikirim backend
    const successParam = searchParams.get('success');
    const messageParam = searchParams.get('message');

    if (successParam === 'true') {
      setSuccess(true);
      setMessage('Email Anda telah berhasil diverifikasi! 🎉');
    } else if (successParam === 'false') {
      setSuccess(false);
      setMessage(
        messageParam ||
          'Gagal memverifikasi email. Link mungkin sudah expired.'
      );
    } else {
      // Jika tidak ada parameter, tampilkan pesan default
      setSuccess(false);
      setMessage('Email belum diverifikasi.');
    }

    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400">
            Memproses verifikasi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800">
          {success ? (
            <>
              {/* Success State */}
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
                  <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>

              <h1 className="mb-3 text-center text-3xl font-bold text-slate-900 dark:text-white">
                ✨ Verifikasi Berhasil!
              </h1>

              <p className="mb-8 text-center text-slate-600 dark:text-slate-400">
                {message}
              </p>

              <p className="mb-8 text-center text-sm text-slate-500 dark:text-slate-500">
                Akun Anda sudah siap digunakan. Silakan login untuk
                mulai berbelanja di CRSD BTN FOODER.
              </p>

              <div className="space-y-3">
                <Link href="/auth/login" className="block w-full">
                  <Button className="h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold hover:bg-emerald-700">
                    Login Sekarang
                  </Button>
                </Link>

                <Link href="/areas" className="block w-full">
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-xl border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                  >
                    🛒 Jelajahi Menu
                  </Button>
                </Link>
              </div>

              <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/20">
                <p className="text-center text-xs text-emerald-700 dark:text-emerald-300">
                  💡 Gunakan email dan password yang telah Anda
                  daftarkan untuk login
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Error State */}
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                  <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <h1 className="mb-3 text-center text-2xl font-bold text-slate-900 dark:text-white">
                ⚠️ Verifikasi Gagal
              </h1>

              <p className="mb-8 text-center text-slate-600 dark:text-slate-400">
                {message}
              </p>

              <div className="space-y-3">
                <Link href="/auth/register" className="block w-full">
                  <Button className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold hover:bg-blue-700">
                    📧 Daftar Ulang
                  </Button>
                </Link>

                <Link href="/auth/login" className="block w-full">
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-xl border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                  >
                    Kembali ke Login
                  </Button>
                </Link>
              </div>

              <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/20">
                <p className="text-center text-xs text-red-700 dark:text-red-300">
                  💡 Link sudah expired? Silakan daftar ulang untuk
                  mendapatkan link baru
                </p>
              </div>
            </>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Memiliki masalah?
            <button className="ml-1 font-semibold text-blue-600 hover:underline dark:text-blue-400">
              Hubungi Dukungan
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
