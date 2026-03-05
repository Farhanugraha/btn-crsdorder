'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { useRegister } from '../hooks/useRegister';
import { NameField } from './NameField';
import { EmailField } from './EmailField';
import { PhoneField } from './PhoneField';
import { DivisiField } from './DivisiField';
import { UnitKerjaField } from './UnitKerjaField';
import { PasswordField } from './PasswordField';
import { SubmitButton } from './SubmitButton';

// Loading component sederhana
const RegisterLoading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="mt-2 text-sm text-muted-foreground">
        Memuat form registrasi...
      </p>
    </div>
  </div>
);

export const RegisterForm = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Tampilkan loading sampai komponen mount di client
  if (!mounted) {
    return <RegisterLoading />;
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nama Lengkap */}
        <NameField form={form} isSubmitting={isSubmitting} />

        {/* Email */}
        <EmailField form={form} isSubmitting={isSubmitting} />

        {/* Grid 2 Kolom untuk Divisi dan Unit Kerja */}
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

        {/* Grid 2 Kolom untuk Password */}
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
