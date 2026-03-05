import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { VERIFY_MESSAGES, VERIFY_LINKS } from '../constants';

interface SuccessStateProps {
  message: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  message
}) => {
  return (
    <>
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20"></div>
            <CheckCircle className="relative h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="mb-3 text-center text-3xl font-bold text-slate-900 dark:text-white">
        {VERIFY_MESSAGES.SUCCESS_TITLE}
      </h1>

      {/* Message */}
      <p className="mb-4 text-center text-slate-600 dark:text-slate-400">
        {message}
      </p>

      {/* Description */}
      <p className="mb-8 text-center text-sm text-slate-500 dark:text-slate-500">
        {VERIFY_MESSAGES.SUCCESS_DESCRIPTION}
      </p>

      {/* Actions */}
      <div className="space-y-3">
        <Link href={VERIFY_LINKS.LOGIN} className="block w-full">
          <Button className="h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold transition-all hover:bg-emerald-700 hover:shadow-lg">
            {VERIFY_MESSAGES.LOGIN_BUTTON}
          </Button>
        </Link>

        <Link href={VERIFY_LINKS.AREAS} className="block w-full">
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl border-slate-300 text-base font-semibold transition-all hover:bg-slate-50 hover:shadow-md dark:border-slate-600 dark:hover:bg-slate-700"
          >
            {VERIFY_MESSAGES.EXPLORE_BUTTON}
          </Button>
        </Link>
      </div>

      {/* Tip */}
      <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/20">
        <p className="text-center text-xs text-emerald-700 dark:text-emerald-300">
          {VERIFY_MESSAGES.SUCCESS_TIP}
        </p>
      </div>
    </>
  );
};
