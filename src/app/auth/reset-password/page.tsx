'use client';

import React, { Suspense } from 'react';
import {
  ResetPasswordForm,
  ResetPasswordLoading
} from '@/components/auth/reset-password';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
        <ResetPasswordForm />
      </div>
    </Suspense>
  );
}
