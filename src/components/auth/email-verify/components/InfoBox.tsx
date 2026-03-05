import React from 'react';
import Link from 'next/link';
import { VERIFY_MESSAGES } from '../constants';

interface InfoBoxProps {
  onContactSupport?: () => void;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  onContactSupport
}) => {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        {VERIFY_MESSAGES.SUPPORT_TEXT}{' '}
        <button
          onClick={onContactSupport}
          className="ml-1 font-semibold text-blue-600 transition-colors hover:underline dark:text-blue-400"
        >
          {VERIFY_MESSAGES.CONTACT_SUPPORT}
        </button>
      </p>
    </div>
  );
};
