import React from 'react';
import Link from 'next/link';
import {
  FORGOT_PASSWORD_LINKS,
  FORGOT_PASSWORD_MESSAGES,
  TOKEN_EXPIRY_HOURS
} from '../constants';

export const ForgotPasswordFooter = () => {
  return (
    <>
      {/* Links */}
      <div className="mt-6 space-y-3 text-center text-sm">
        <p className="text-muted-foreground">
          Sudah ingat password?{' '}
          <Link
            href={FORGOT_PASSWORD_LINKS.LOGIN}
            className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Login di sini
          </Link>
        </p>
        <p className="text-muted-foreground">
          Belum punya akun?{' '}
          <Link
            href={FORGOT_PASSWORD_LINKS.REGISTER}
            className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground">
        <p>
          Link reset password akan dikirim ke email Anda dan berlaku
          selama {TOKEN_EXPIRY_HOURS} jam.
        </p>
      </div>
    </>
  );
};
