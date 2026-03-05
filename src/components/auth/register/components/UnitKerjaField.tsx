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
import { Briefcase } from 'lucide-react';

interface UnitKerjaFieldProps {
  form: UseFormReturn<RegisterFormType>;
  isSubmitting: boolean;
}

export const UnitKerjaField: React.FC<UnitKerjaFieldProps> = ({
  form,
  isSubmitting
}) => {
  return (
    <FormField
      control={form.control}
      name="unit_kerja"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-semibold">
            Unit Kerja
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...field}
                placeholder="Masukkan unit kerja"
                type="text"
                disabled={isSubmitting}
                className="border-border pl-10 transition-all focus:ring-2 focus:ring-primary"
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
