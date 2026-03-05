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

interface NameFieldProps {
  form: UseFormReturn<RegisterFormType>;
  isSubmitting: boolean;
}

export const NameField: React.FC<NameFieldProps> = ({
  form,
  isSubmitting
}) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-semibold">
            Nama Lengkap <span className="text-destructive">*</span>
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="Masukkan nama lengkap"
              type="text"
              disabled={isSubmitting}
              className="border-border transition-all focus:ring-2 focus:ring-primary"
              autoComplete="name"
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
