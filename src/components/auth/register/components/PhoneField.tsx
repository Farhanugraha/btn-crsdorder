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
import { Phone } from 'lucide-react';

interface PhoneFieldProps {
  form: UseFormReturn<RegisterFormType>;
  isSubmitting: boolean;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  form,
  isSubmitting
}) => {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-semibold">
            Nomor Telepon
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...field}
                placeholder="081234567890"
                type="tel"
                disabled={isSubmitting}
                className="border-border pl-10 transition-all focus:ring-2 focus:ring-primary"
                autoComplete="tel"
              />
            </div>
          </FormControl>
          <p className="mt-1 text-xs text-muted-foreground">
            Contoh: 081234567890 atau +6281234567890
          </p>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
