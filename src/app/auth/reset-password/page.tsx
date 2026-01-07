'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

// Validation schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password minimal 6 karakter'),
    password_confirmation: z
      .string()
      .min(6, 'Konfirmasi password minimal 6 karakter')
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak cocok',
    path: ['password_confirmation']
  });

type FormType = z.infer<typeof resetPasswordSchema>;

interface ResetResponse {
  success: boolean;
  message?: string;
}

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // Get email and token from URL params
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const form = useForm<FormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: ''
    }
  });

  // Validate URL parameters
  if (!email || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
          <h2 className="mb-2 text-xl font-bold text-foreground">
            Invalid Link
          </h2>
          <p className="mb-6 text-muted-foreground">
            Link reset password tidak valid atau sudah expired
          </p>
          <Link href="/auth/forgot-password">
            <Button className="w-full">
              Kembali ke Forgot Password
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: FormType) => {
    try {
      setSubmitting(true);

      const response = await fetch(
        'http://localhost:8000/api/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            email: email,
            token: token,
            password: data.password,
            password_confirmation: data.password_confirmation
          })
        }
      );

      const responseData: ResetResponse = await response.json();

      if (response.ok && responseData.success) {
        toast.success(
          responseData.message ||
            'Password berhasil direset! Silakan login dengan password baru.'
        );

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setSubmitting(false);
        toast.error(
          responseData.message ||
            'Gagal mereset password. Silakan coba lagi.'
        );
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="border-b border-border bg-muted/50 px-6 py-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan password baru Anda
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Email Display - Read Only */}
              <div>
                <FormLabel className="text-sm font-semibold">
                  Email
                </FormLabel>
                <div className="mt-1 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                  {email}
                </div>
              </div>

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Password Baru
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Masukkan password baru"
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

              {/* Confirm Password Field */}
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
                          placeholder="Konfirmasi password baru"
                          type={
                            showConfirmPassword ? 'text' : 'password'
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
                {isSubmitting
                  ? 'Mereset Password...'
                  : 'Reset Password'}
              </Button>
            </form>
          </Form>

          {/* Back to Login */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah ingat password?{' '}
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
          <p>Password Anda akan dienkripsi dan aman bersama kami.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
