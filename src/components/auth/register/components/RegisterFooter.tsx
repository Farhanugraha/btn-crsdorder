import React from 'react';
import Link from 'next/link';

export const RegisterFooter = () => {
  return (
    <>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{' '}
        <Link
          href="/auth/login"
          className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          Login di sini
        </Link>
      </p>

      <div className="border-t border-border bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground">
        <p>
          Dengan membuat akun, Anda menyetujui{' '}
          <Link
            href="#"
            className="text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Syarat Ketentuan
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
