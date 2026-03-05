import { z } from 'zod';

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nama minimal 3 karakter')
      .max(255, 'Nama maksimal 255 karakter')
      .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
    
    email: z
      .string()
      .email('Email tidak valid')
      .min(1, 'Email harus diisi'),
    
    password: z
      .string()
      .min(6, 'Password minimal 6 karakter')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        'Password harus mengandung huruf dan angka'
      ),
    
    password_confirmation: z
      .string()
      .min(6, 'Konfirmasi password minimal 6 karakter'),
    
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[0-9\s\-+()]{7,20}$/.test(val),
        'Nomor telepon tidak valid (7-20 digit)'
      ),
    
    divisi: z.string().optional(),
    
    unit_kerja: z.string().optional()
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak cocok',
    path: ['password_confirmation']
  });

export type RegisterFormType = z.infer<typeof registerFormSchema>;