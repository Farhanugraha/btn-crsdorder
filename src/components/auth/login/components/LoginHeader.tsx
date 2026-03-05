import React from 'react';
import { LogIn } from 'lucide-react';

interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  title = 'Selamat Datang',
  subtitle = 'Masuk ke akun Anda untuk melanjutkan'
}) => {
  return (
    <div className="border-b border-border bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-8 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
          <LogIn className="h-8 w-8" />
        </div>
      </div>
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};
