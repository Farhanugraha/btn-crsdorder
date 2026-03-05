import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email harus diisi')
    .email('Email tidak valid')
    .max(255, 'Email maksimal 255 karakter'),
  
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter')
});

export type LoginFormType = z.infer<typeof loginFormSchema>;