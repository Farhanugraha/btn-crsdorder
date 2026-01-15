'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, Mail } from 'lucide-react';
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
const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid')
});

type FormType = z.infer<typeof forgotPasswordSchema>;

interface ForgotResponse {
  success: boolean;
  message?: string;
}

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const onSubmit = async (data: FormType) => {
    try {
      setSubmitting(true);

      const response = await fetch(
        `${apiUrl}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            email: data.email
          })
        }
      );

      const responseData: ForgotResponse = await response.json();

      if (response.ok && responseData.success) {
        setEmailSent(true);
        toast.success(
          responseData.message ||
            'Link reset password telah dikirim ke email Anda'
        );

        // Optional: Redirect to login after 5 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 5000);
      } else {
        setSubmitting(false);
        toast.error(
          responseData.message ||
            'Email tidak ditemukan atau terjadi kesalahan'
        );
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      setSubmitting(false);
    }
  };

  // Success Message
  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
        <div className="w-full max-w-sm rounded-lg border border-border bg-card shadow-xl">
          {/* Header */}
          <div className="border-b border-border bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-8 text-center dark:from-green-950 dark:to-emerald-950">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Email Terkirim!
            </h1>
            <p className="text-sm text-muted-foreground">
              Link reset password telah dikirim ke email Anda
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 px-6 py-8">
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <p className="text-center text-sm text-foreground">
                Silakan cek email Anda dan klik link reset password.
                Link akan berlaku selama 1 jam.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Tidak menerima email?
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Cek folder spam atau junk</li>
                <li>Pastikan email Anda benar</li>
                <li>Coba kirim ulang setelah beberapa menit</li>
              </ul>
            </div>

            <Link href="/auth/login">
              <Button className="w-full">Kembali ke Login</Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground">
            <p>Akan diarahkan ke login dalam 5 detik...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="border-b border-border bg-muted/50 px-6 py-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Lupa Password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email Anda untuk reset password
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="email@example.com"
                        type="email"
                        disabled={isSubmitting}
                        className="border-border focus:ring-2 focus:ring-primary"
                      />
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
                {isSubmitting ? 'Mengirim...' : 'Kirim Link Reset'}
              </Button>
            </form>
          </Form>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center text-sm">
            <p className="text-muted-foreground">
              Sudah ingat password?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-primary hover:underline"
              >
                Login di sini
              </Link>
            </p>
            <p className="text-muted-foreground">
              Belum punya akun?{' '}
              <Link
                href="/auth/register"
                className="font-semibold text-primary hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground">
          <p>
            Link reset password akan dikirim ke email Anda dan berlaku
            selama 1 jam.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
