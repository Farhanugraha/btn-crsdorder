'use client';

import React from 'react';
import { useEmailVerify } from '../hooks/useEmailVerify';
import { LoadingState } from './LoadingState';
import { SuccessState } from './SuccessState';
import { ErrorState } from './ErrorState';
import { InfoBox } from './InfoBox';

export const EmailVerifyPage = () => {
  const { isLoading, isSuccess, message } = useEmailVerify();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="animate-fade-in rounded-3xl border border-slate-200 bg-white p-8 shadow-xl transition-all hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          {isSuccess ? (
            <SuccessState message={message} />
          ) : (
            <ErrorState message={message} />
          )}
        </div>

        <InfoBox
          onContactSupport={() => {
            window.location.href = '';
          }}
        />
      </div>
    </div>
  );
};
