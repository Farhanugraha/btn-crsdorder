import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email harus diisi')
    .email('Email tidak valid')
    .max(255, 'Email maksimal 255 karakter')
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;