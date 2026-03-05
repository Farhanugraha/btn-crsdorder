'use client';

import React from 'react';
import { Form } from '@/components/ui/form';
import { useLogin } from '../hooks/useLogin';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { SubmitButton } from './SubmitButton';

export const LoginForm = () => {
  const {
    form,
    isSubmitting,
    showPassword,
    setShowPassword,
    onSubmit
  } = useLogin();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        <EmailField form={form} isSubmitting={isSubmitting} />

        <PasswordField
          form={form}
          isSubmitting={isSubmitting}
          showPassword={showPassword}
          onToggleShow={() => setShowPassword(!showPassword)}
        />

        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};
