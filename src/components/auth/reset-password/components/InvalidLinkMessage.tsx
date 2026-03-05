import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import {
  RESET_PASSWORD_MESSAGES,
  RESET_PASSWORD_LINKS
} from '../constants';

export const InvalidLinkMessage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="animate-fade-in w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <h2 className="mb-2 text-center text-xl font-bold text-foreground">
          {RESET_PASSWORD_MESSAGES.INVALID_LINK_TITLE}
        </h2>

        <p className="mb-6 text-center text-muted-foreground">
          {RESET_PASSWORD_MESSAGES.INVALID_LINK_DESCRIPTION}
        </p>

        <Link href={RESET_PASSWORD_LINKS.FORGOT_PASSWORD}>
          <Button className="w-full">
            {RESET_PASSWORD_MESSAGES.BACK_TO_FORGOT}
          </Button>
        </Link>
      </div>
    </div>
  );
};
