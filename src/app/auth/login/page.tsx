'use client';

import React, { Suspense } from 'react';
import {
  LoginForm,
  LoginHeader,
  LoginFooter,
  LoadingState,
  useLogin
} from '@/components/auth/login';

// Login content component
const LoginContent = () => {
  const { isLoading } = useLogin();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
      <div className="animate-fade-in w-full max-w-sm rounded-lg border border-border bg-card shadow-xl">
        <LoginHeader />

        <div className="p-6">
          <LoginForm />
          <LoginFooter />
        </div>
      </div>
    </div>
  );
};

// Main page component with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LoginContent />
    </Suspense>
  );
}
