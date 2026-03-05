import React from 'react';
import { Loader2 } from 'lucide-react';

export const ForgotPasswordLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center">
        <div className="relative mx-auto h-16 w-16">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
          <div className="relative flex h-16 w-16 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Memuat halaman...
        </p>
      </div>
    </div>
  );
};
