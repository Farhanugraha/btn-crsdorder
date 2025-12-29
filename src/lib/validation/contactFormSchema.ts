import { z } from 'zod';

export const contactFormSchema = z.object({
  street: z.string().min(1, 'Street is required').max(20).trim(),
  city: z.string().min(1, 'City is required').max(20).trim(),
  phone: z.string().min(1, 'Phone is required').max(10)
});
