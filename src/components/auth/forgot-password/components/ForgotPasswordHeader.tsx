import React from 'react';
import { KeyRound } from 'lucide-react';

interface ForgotPasswordHeaderProps {
  title?: string;
  subtitle?: string;
}

export const ForgotPasswordHeader: React.FC<
  ForgotPasswordHeaderProps
> = ({
  title = 'Lupa Password?',
  subtitle = 'Masukkan email Anda untuk reset password'
}) => {
  return (
    <div className="border-b border-border bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-8 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
          <KeyRound className="h-8 w-8" />
        </div>
      </div>
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};
