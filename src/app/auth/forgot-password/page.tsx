'use client';

import React, { Suspense } from 'react';
import {
  ForgotPasswordForm,
  ForgotPasswordLoading
} from '@/components/auth/forgot-password';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordLoading />}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
        <ForgotPasswordForm />
      </div>
    </Suspense>
  );
}
