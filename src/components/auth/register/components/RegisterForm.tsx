'use client';

import React from 'react';
import { Form } from '@/components/ui/form';
import { useRegister } from '../hooks/useRegister';
import { NameField } from './NameField';
import { EmailField } from './EmailField';
import { PhoneField } from './PhoneField';
import { DivisiField } from './DivisiField';
import { UnitKerjaField } from './UnitKerjaField';
import { PasswordField } from './PasswordField';
import { SubmitButton } from './SubmitButton';

export const RegisterForm = () => {
  const {
    form,
    isSubmitting,
    showPassword,
    showConfirmPassword,
    selectedDivisi,
    setShowPassword,
    setShowConfirmPassword,
    setSelectedDivisi,
    onSubmit
  } = useRegister();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nama Lengkap */}
        <NameField form={form} isSubmitting={isSubmitting} />

        {/* Email */}
        <EmailField form={form} isSubmitting={isSubmitting} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DivisiField
            form={form}
            isSubmitting={isSubmitting}
            selectedDivisi={selectedDivisi}
            onDivisiChange={setSelectedDivisi}
          />
          <UnitKerjaField form={form} isSubmitting={isSubmitting} />
        </div>

        {/* Nomor Telepon */}
        <PhoneField form={form} isSubmitting={isSubmitting} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PasswordField
            form={form}
            isSubmitting={isSubmitting}
            name="password"
            label="Password"
            placeholder="Masukkan password"
            showPassword={showPassword}
            onToggleShow={() => setShowPassword(!showPassword)}
            showRequirements={true}
          />

          <PasswordField
            form={form}
            isSubmitting={isSubmitting}
            name="password_confirmation"
            label="Konfirmasi Password"
            placeholder="Konfirmasi password"
            showPassword={showConfirmPassword}
            onToggleShow={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />
        </div>

        {/* Submit Button */}
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};
