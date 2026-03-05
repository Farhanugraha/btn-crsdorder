import React from 'react';
import Link from 'next/link';
import {
  RESET_PASSWORD_MESSAGES,
  RESET_PASSWORD_LINKS
} from '../constants';

export const ResetPasswordFooter = () => {
  return (
    <>
      {/* Back to Login Link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {RESET_PASSWORD_MESSAGES.REMEMBER_PASSWORD}{' '}
        <Link
          href={RESET_PASSWORD_LINKS.LOGIN}
          className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          {RESET_PASSWORD_MESSAGES.LOGIN_HERE}
        </Link>
      </p>

      {/* Footer */}
      <div className="border-t border-border bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground">
        <p>{RESET_PASSWORD_MESSAGES.PASSWORD_SECURE}</p>
      </div>
    </>
  );
};
