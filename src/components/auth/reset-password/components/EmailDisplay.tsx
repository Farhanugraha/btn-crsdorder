import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Mail } from 'lucide-react';

interface EmailDisplayProps {
  email: string;
}

export const EmailDisplay: React.FC<EmailDisplayProps> = ({
  email
}) => {
  return (
    <div>
      <FormLabel className="text-sm font-semibold">Email</FormLabel>
      <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
        <Mail className="h-4 w-4" />
        <span className="flex-1">{email}</span>
      </div>
    </div>
  );
};
