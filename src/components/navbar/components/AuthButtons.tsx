'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface AuthButtonsProps {
  className?: string;
  onLinkClick?: () => void;
}

export const AuthButtons = ({
  className,
  onLinkClick
}: AuthButtonsProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Link
        href="/auth/login"
        onClick={onLinkClick}
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'h-9 text-sm'
        )}
      >
        Login
      </Link>
      <Link
        href="/auth/register"
        onClick={onLinkClick}
        className={cn(
          buttonVariants({ variant: 'default', size: 'sm' }),
          'h-9 bg-gradient-to-r from-primary to-primary/80 text-sm hover:from-primary/90 hover:to-primary/70'
        )}
      >
        Daftar
      </Link>
    </div>
  );
};
