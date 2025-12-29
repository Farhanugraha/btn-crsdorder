import { z } from 'zod';

export const orderFormSchema = z.object({
  username: z.string().min(1, 'Username is required').max(10).trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email')
    .trim(),
  street: z.string().min(1, 'Street is required').max(20).trim(),
  city: z.string().min(1, 'City is required').max(20).trim(),
  phone: z.string().min(1, 'Phone is required').max(10)
});
