import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RegisterFormType } from '../schemas/registerSchema';
import { DIVISI_OPTIONS } from '../constants';
import { Building2 } from 'lucide-react';

interface DivisiFieldProps {
  form: UseFormReturn<RegisterFormType>;
  isSubmitting: boolean;
  selectedDivisi: string;
  onDivisiChange: (value: string) => void;
}

export const DivisiField: React.FC<DivisiFieldProps> = ({
  form,
  isSubmitting,
  selectedDivisi,
  onDivisiChange
}) => {
  const divisiValue = form.watch('divisi');

  useEffect(() => {
    if (
      divisiValue &&
      !DIVISI_OPTIONS.some((opt) => opt.value === divisiValue)
    ) {
      onDivisiChange('Lainnya');
    }
  }, [divisiValue, onDivisiChange]);

  return (
    <FormItem>
      <FormLabel className="text-sm font-semibold">Divisi</FormLabel>
      <div className="space-y-3">
        <Select
          disabled={isSubmitting}
          onValueChange={(value) => {
            if (value === 'Lainnya') {
              form.setValue('divisi', '');
              onDivisiChange('Lainnya');
            } else {
              form.setValue('divisi', value);
              onDivisiChange(value);
            }
          }}
          value={selectedDivisi}
        >
          <FormControl>
            <SelectTrigger className="border-border transition-all focus:ring-2 focus:ring-primary">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Pilih divisi" />
              </div>
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {DIVISI_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Manual Input for "Lainnya" */}
        {selectedDivisi === 'Lainnya' && (
          <FormField
            control={form.control}
            name="divisi"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukkan nama divisi lainnya"
                    type="text"
                    disabled={isSubmitting}
                    className="border-border transition-all focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        )}
      </div>
    </FormItem>
  );
};
