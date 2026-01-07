'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

// Updated validation schema
const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nama minimal 3 karakter')
      .max(255, 'Nama maksimal 255 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    password_confirmation: z
      .string()
      .min(6, 'Konfirmasi password minimal 6 karakter'),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[0-9\s\-+()]{7,20}$/.test(val),
        'Nomor telepon tidak valid'
      ),
    divisi: z.string().optional(),
    unit_kerja: z.string().optional()
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak cocok',
    path: ['password_confirmation']
  });

type FormType = z.infer<typeof registerFormSchema>;

const Register = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      divisi: '',
      unit_kerja: '',
      phone: '',
      password: '',
      password_confirmation: ''
    }
  });

  const onSubmit = async (data: FormType) => {
    try {
      setSubmitting(true);

      // Prepare payload sesuai API Laravel
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        phone: data.phone || null,
        divisi: data.divisi || null,
        unit_kerja: data.unit_kerja || null
      };

      const response = await fetch(
        'http://localhost:8000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success(
          responseData.message ||
            'Registrasi berhasil! Silakan cek email Anda.'
        );
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        setSubmitting(false);

        // Handle validation errors
        if (responseData.errors) {
          const errors = responseData.errors;
          Object.keys(errors).forEach((field) => {
            const fieldName = field as keyof FormType;
            const message = Array.isArray(errors[field])
              ? errors[field][0]
              : errors[field];
            form.setError(fieldName, {
              message: message
            });
          });
          toast.error('Terjadi kesalahan pada form');
        } else {
          toast.error(
            responseData.message ||
              'Registrasi gagal. Silakan coba lagi.'
          );
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        'Terjadi kesalahan koneksi. Pastikan server berjalan di localhost:8000'
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="border-b border-border bg-muted/50 px-6 py-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Registrasi
          </h1>
          <p className="text-sm text-muted-foreground">
            Buat akun baru untuk melanjutkan
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Nama Lengkap
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan nama lengkap"
                        type="text"
                        disabled={isSubmitting}
                        className="border-border focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan email"
                        type="email"
                        disabled={isSubmitting}
                        className="border-border focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Nomor Telepon
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan nomor telepon"
                        type="tel"
                        disabled={isSubmitting}
                        className="border-border focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Divisi and Unit Kerja */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="divisi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Divisi
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan divisi"
                          type="text"
                          disabled={isSubmitting}
                          className="border-border focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit_kerja"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Unit Kerja (Opsional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan unit kerja"
                          type="text"
                          disabled={isSubmitting}
                          className="border-border focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Masukkan password"
                            type={showPassword ? 'text' : 'password'}
                            disabled={isSubmitting}
                            className="border-border pr-10 focus:ring-2 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            disabled={isSubmitting}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Konfirmasi Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Konfirmasi password"
                            type={
                              showConfirmPassword
                                ? 'text'
                                : 'password'
                            }
                            disabled={isSubmitting}
                            className="border-border pr-10 focus:ring-2 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(
                                !showConfirmPassword
                              )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            disabled={isSubmitting}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? 'Membuat Akun...' : 'Buat Akun'}
              </Button>
            </form>
          </Form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:underline"
            >
              Login di sini
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground">
          <p>
            Dengan membuat akun, Anda menyetujui{' '}
            <Link href="#" className="text-primary hover:underline">
              Syarat Ketentuan
            </Link>{' '}
            dan{' '}
            <Link href="#" className="text-primary hover:underline">
              Kebijakan Privasi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
