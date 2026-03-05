import React from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FORGOT_PASSWORD_MESSAGES } from '../constants';

interface SuccessMessageProps {
  email: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  email
}) => {
  return (
    <div className="animate-fade-in w-full max-w-sm rounded-lg border border-border bg-card shadow-xl">
      {/* Header dengan gradient hijau */}
      <div className="border-b border-border bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-8 text-center dark:from-green-950 dark:to-emerald-950">
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20"></div>
            <div className="relative rounded-full bg-gradient-to-br from-green-500 to-emerald-500 p-4 text-white shadow-lg">
              <Mail className="h-8 w-8" />
            </div>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          {FORGOT_PASSWORD_MESSAGES.EMAIL_SENT_TITLE}
        </h1>
        <p className="text-sm text-muted-foreground">
          {FORGOT_PASSWORD_MESSAGES.EMAIL_SENT_SUBTITLE}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 px-6 py-8">
        {/* Email info */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Email terkirim ke:</span>
          </div>
          <p className="mt-2 text-center font-semibold text-primary">
            {email}
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            {FORGOT_PASSWORD_MESSAGES.EMAIL_SENT_DESCRIPTION}
          </p>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {FORGOT_PASSWORD_MESSAGES.EMAIL_NOT_RECEIVED}
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Cek folder spam atau junk</li>
              <li>Pastikan email Anda benar</li>
              <li>Coba kirim ulang setelah beberapa menit</li>
            </ul>
          </div>

          {/* Warning */}
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Link reset password hanya berlaku selama 1 jam. Jika
              tidak menerima email dalam beberapa menit, periksa
              folder spam.
            </p>
          </div>
        </div>

        {/* Back to Login Button */}
        <Link href="/auth/login">
          <Button className="w-full bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary/70">
            Kembali ke Login
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground">
        <p>{FORGOT_PASSWORD_MESSAGES.REDIRECT_MESSAGE}</p>
      </div>
    </div>
  );
};
