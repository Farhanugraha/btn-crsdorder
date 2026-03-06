'use client';

import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ResetPasswordFormType } from '../schemas/resetPasswordSchema';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { PASSWORD_REQUIREMENTS } from '../constants';

interface PasswordFieldProps {
  form: UseFormReturn<ResetPasswordFormType>;
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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const password = form.watch('password');
  const confirmPassword = form.watch('password_confirmation');

  const doPasswordsMatch =
    name === 'password_confirmation'
      ? password === confirmPassword && confirmPassword.length > 0
      : false;

  useEffect(() => {
    if (name === 'password' && password) {
      let strength = 0;
      if (password.length >= 6) strength += 20;
      if (/[A-Z]/.test(password)) strength += 20;
      if (/[a-z]/.test(password)) strength += 20;
      if (/[0-9]/.test(password)) strength += 20;
      if (/[@$!%*?&]/.test(password)) strength += 20;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password, name]);

  const checkRequirement = (requirement: string): boolean => {
    if (!password || name === 'password_confirmation') return false;

    if (requirement.includes('karakter')) {
      const match = requirement.match(/\d+/);
      const minLength = match ? parseInt(match[0]) : 6;
      return password.length >= minLength;
    }
    if (requirement.includes('BESAR')) return /[A-Z]/.test(password);
    if (requirement.includes('kecil')) return /[a-z]/.test(password);
    if (requirement.includes('angka')) return /[0-9]/.test(password);
    if (requirement.includes('simbol'))
      return /[@$!%*?&]/.test(password);

    return false;
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return 'bg-red-500';
    if (passwordStrength <= 40) return 'bg-orange-500';
    if (passwordStrength <= 60) return 'bg-yellow-500';
    if (passwordStrength <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 20) return 'Sangat Lemah';
    if (passwordStrength <= 40) return 'Lemah';
    if (passwordStrength <= 60) return 'Cukup';
    if (passwordStrength <= 80) return 'Kuat';
    return 'Sangat Kuat';
  };

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
                className={`border-border pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary ${
                  name === 'password_confirmation' &&
                  field.value &&
                  field.value.length > 0
                    ? doPasswordsMatch
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
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

          {name === 'password' && password && password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`${getStrengthColor()} transition-all duration-300`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <p className="text-right text-xs text-muted-foreground">
                Kekuatan:{' '}
                <span className="font-medium">
                  {getStrengthLabel()}
                </span>
              </p>
            </div>
          )}

          {showRequirements && name === 'password' && (
            <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Password harus memenuhi:
              </p>
              <ul className="space-y-1.5">
                {PASSWORD_REQUIREMENTS.map((req, index) => {
                  const isValid = checkRequirement(req);
                  return (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          isValid
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                        }`}
                      >
                        {isValid ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </span>
                      <span
                        className={
                          isValid
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-muted-foreground'
                        }
                      >
                        {req}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {name === 'password_confirmation' &&
            field.value &&
            field.value.length > 0 && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                {doPasswordsMatch ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">
                      Password cocok
                    </span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">
                      Password tidak cocok
                    </span>
                  </>
                )}
              </div>
            )}

          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
