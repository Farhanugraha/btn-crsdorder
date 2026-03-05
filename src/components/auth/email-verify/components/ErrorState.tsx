import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { VERIFY_MESSAGES, VERIFY_LINKS } from '../constants';

interface ErrorStateProps {
  message: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message
}) => {
  return (
    <>
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-red-400/20"></div>
            <AlertCircle className="relative h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="mb-3 text-center text-2xl font-bold text-slate-900 dark:text-white">
        {VERIFY_MESSAGES.ERROR_TITLE}
      </h1>

      {/* Message */}
      <p className="mb-8 text-center text-slate-600 dark:text-slate-400">
        {message}
      </p>

      {/* Actions */}
      <div className="space-y-3">
        <Link href={VERIFY_LINKS.REGISTER} className="block w-full">
          <Button className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold transition-all hover:bg-blue-700 hover:shadow-lg">
            {VERIFY_MESSAGES.REGISTER_BUTTON}
          </Button>
        </Link>

        <Link href={VERIFY_LINKS.LOGIN} className="block w-full">
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl border-slate-300 text-base font-semibold transition-all hover:bg-slate-50 hover:shadow-md dark:border-slate-600 dark:hover:bg-slate-700"
          >
            {VERIFY_MESSAGES.BACK_TO_LOGIN}
          </Button>
        </Link>
      </div>

      {/* Tip */}
      <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/20">
        <p className="text-center text-xs text-red-700 dark:text-red-300">
          {VERIFY_MESSAGES.ERROR_TIP}
        </p>
      </div>
    </>
  );
};
