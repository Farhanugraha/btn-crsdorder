import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '../constants';

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Password minimal ${PASSWORD_MIN_LENGTH} karakter`)
      .max(100, 'Password maksimal 100 karakter'),
    
    password_confirmation: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Konfirmasi password minimal ${PASSWORD_MIN_LENGTH} karakter`)
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak cocok',
    path: ['password_confirmation']
  });

export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;