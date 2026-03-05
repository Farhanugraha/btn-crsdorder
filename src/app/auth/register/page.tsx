'use client';

import React, { Suspense } from 'react';
import {
  RegisterForm,
  RegisterHeader,
  RegisterFooter
} from '@/components/auth/register';

// Loading component
const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
    <div className="text-center">
      <div className="relative mx-auto h-16 w-16">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Memuat halaman registrasi...
      </p>
    </div>
  </div>
);

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
        <div className="animate-fade-in w-full max-w-lg rounded-lg border border-border bg-card shadow-xl">
          {/* Header */}
          <RegisterHeader />

          {/* Form Section */}
          <div className="p-6">
            <RegisterForm />

            {/* Footer Links */}
            <RegisterFooter />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
