'use client';

import React from 'react';
import { Form } from '@/components/ui/form';
import { useResetPassword } from '../hooks/useResetPassword';
import { ResetPasswordHeader } from './ResetPasswordHeader';
import { ResetPasswordFooter } from './ResetPasswordFooter';
import { InvalidLinkMessage } from './InvalidLinkMessage';
import { EmailDisplay } from './EmailDisplay';
import { PasswordField } from './PasswordField';
import { SubmitButton } from './SubmitButton';

export const ResetPasswordForm = () => {
  const {
    form,
    isSubmitting,
    showPassword,
    showConfirmPassword,
    urlParams,
    setShowPassword,
    setShowConfirmPassword,
    onSubmit
  } = useResetPassword();

  // Validate URL parameters
  if (!urlParams.email || !urlParams.token) {
    return <InvalidLinkMessage />;
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-card shadow-xl">
      <ResetPasswordHeader />

      <div className="p-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email Display - Read Only */}
            <EmailDisplay email={urlParams.email} />

            {/* Password Field */}
            <PasswordField
              form={form}
              isSubmitting={isSubmitting}
              name="password"
              label="Password Baru"
              placeholder="Masukkan password baru"
              showPassword={showPassword}
              onToggleShow={() => setShowPassword(!showPassword)}
            />

            {/* Confirm Password Field */}
            <PasswordField
              form={form}
              isSubmitting={isSubmitting}
              name="password_confirmation"
              label="Konfirmasi Password"
              placeholder="Konfirmasi password baru"
              showPassword={showConfirmPassword}
              onToggleShow={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />

            {/* Submit Button */}
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>

        <ResetPasswordFooter />
      </div>
    </div>
  );
};
