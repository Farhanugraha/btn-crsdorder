import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import Link from 'next/link';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginFormType } from '../schemas/loginSchema';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordFieldProps {
  form: UseFormReturn<LoginFormType>;
  isSubmitting: boolean;
  showPassword: boolean;
  onToggleShow: () => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  form,
  isSubmitting,
  showPassword,
  onToggleShow
}) => {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm font-semibold">
              Password
            </FormLabel>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              Lupa Password?
            </Link>
          </div>
          <FormControl>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...field}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                disabled={isSubmitting}
                className="border-border pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={onToggleShow}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
