import React from 'react';
import Link from 'next/link';

export const LoginFooter = () => {
  return (
    <>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{' '}
        <Link
          href="/auth/register"
          className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>

      <div className="border-t border-border bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground">
        <p>
          Dengan masuk, Anda setuju dengan{' '}
          <Link
            href="#"
            className="text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Syarat Layanan
          </Link>{' '}
          dan{' '}
          <Link
            href="#"
            className="text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Kebijakan Privasi
          </Link>
        </p>
      </div>
    </>
  );
};
