'use client';

import React from 'react';
import { Form } from '@/components/ui/form';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { EmailField } from './EmailField';
import { SubmitButton } from './SubmitButton';
import { ForgotPasswordHeader } from './ForgotPasswordHeader';
import { ForgotPasswordFooter } from './ForgotPasswordFooter';
import { SuccessMessage } from './SuccessMessage';

export const ForgotPasswordForm = () => {
  const { form, isSubmitting, emailSent, sentEmail, onSubmit } =
    useForgotPassword();

  if (emailSent) {
    return <SuccessMessage email={sentEmail} />;
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-card shadow-xl">
      <ForgotPasswordHeader />

      <div className="p-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <EmailField form={form} isSubmitting={isSubmitting} />
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>

        <ForgotPasswordFooter />
      </div>
    </div>
  );
};
