'use client';

import Link from 'next/link';
import { SheetClose } from '@/components/ui/sheet';
import { buttonVariants } from '@/components/ui/button';

export const CartEmpty = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="mb-4 text-5xl">🛒</div>
      <p className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
        Keranjang Kosong
      </p>
      <p className="mb-6 px-4 text-center text-sm text-slate-600 dark:text-slate-400">
        Mulai tambahkan menu favorit Anda
      </p>
      <SheetClose asChild>
        <Link
          href="/areas"
          className={buttonVariants({
            variant: 'default',
            size: 'sm',
            className: 'bg-emerald-600 hover:bg-emerald-700'
          })}
        >
          Lihat Menu
        </Link>
      </SheetClose>
    </div>
  );
};
