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
import { RegisterFormType } from '../schemas/registerSchema';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { PASSWORD_REQUIREMENTS } from '../constants';

interface PasswordFieldProps {
  form: UseFormReturn<RegisterFormType>;
  isSubmitting: boolean;
  name: 'password' | 'password_confirmation';
  label: string;
  placeholder: string;
  showPassword: boolean;
  onToggleShow: () => void;
  showRequirements?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  form,
  isSubmitting,
  name,
  label,
  placeholder,
  showPassword,
  onToggleShow,
  showRequirements = false
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-semibold">
            {label} <span className="text-destructive">*</span>
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...field}
                placeholder={placeholder}
                type={showPassword ? 'text' : 'password'}
                disabled={isSubmitting}
                className="border-border pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary"
                autoComplete={
                  name === 'password' ? 'new-password' : 'off'
                }
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

          {showRequirements && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Password harus memenuhi:
              </p>
              <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
                {PASSWORD_REQUIREMENTS.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
