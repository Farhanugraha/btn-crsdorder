import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ForgotPasswordFormType } from '../schemas/forgotPasswordSchema';
import { Mail } from 'lucide-react';

interface EmailFieldProps {
  form: UseFormReturn<ForgotPasswordFormType>;
  isSubmitting: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  form,
  isSubmitting
}) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-semibold">
            Email
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...field}
                placeholder="nama@email.com"
                type="email"
                disabled={isSubmitting}
                className="border-border pl-10 transition-all focus:ring-2 focus:ring-primary"
                autoComplete="email"
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
