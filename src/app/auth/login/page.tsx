'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

const loginFormSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter')
});

type FormType = z.infer<typeof loginFormSchema>;

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  token_type?: string;
  expires_in?: number;
  user?: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    phone: string;
    divisi: string;
    unit_kerja: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
  errors?: Record<string, string[]>;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const redirect = searchParams.get('redirect');

  const form = useForm<FormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');

      if (token && user) {
        const userData = JSON.parse(user);
        // Redirect ke dashboard sesuai role
        if (userData.role === 'superadmin') {
          router.push('/dashboard/superadmin');
        } else if (userData.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/areas');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const onSubmit = async (data: FormType) => {
    try {
      setSubmitting(true);

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });

      const responseData: LoginResponse = await response.json();

      if (
        response.ok &&
        responseData.success &&
        responseData.token &&
        responseData.user
      ) {
        // Store token and user data
        localStorage.setItem('auth_token', responseData.token);
        localStorage.setItem(
          'auth_user',
          JSON.stringify(responseData.user)
        );
        localStorage.setItem(
          'token_expires_in',
          String(
            Date.now() + (responseData.expires_in || 3600) * 1000
          )
        );

        toast.success('Login berhasil!');

        // Dispatch custom event
        window.dispatchEvent(new Event('auth-changed'));
        window.dispatchEvent(new Event('login'));

        // Redirect sesuai role
        setTimeout(() => {
          const userRole = responseData.user!.role;

          if (redirect === 'checkout') {
            router.push('/checkout');
          } else if (userRole === 'superadmin') {
            router.push('/dashboard/superadmin');
          } else if (userRole === 'admin') {
            router.push('/dashboard/admin');
          } else {
            router.push('/areas');
          }
        }, 1000);
      } else {
        setSubmitting(false);
        toast.error(
          (responseData && responseData.message) ||
            'Email atau password salah'
        );
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        'Terjadi kesalahan koneksi. Pastikan server berjalan di localhost:8000'
      );
      setSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card shadow-xl">
        <div className="border-b border-border bg-muted/50 px-6 py-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Selamat Datang
          </h1>
          <p className="text-sm text-muted-foreground">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-semibold">
                        Password
                      </FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Lupa Password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="••••••••"
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? 'Masuk...' : 'Masuk'}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-primary hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>

        <div className="border-t border-border bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground">
          <p>
            Dengan masuk, Anda setuju dengan{' '}
            <Link href="#" className="text-primary hover:underline">
              Syarat Layanan
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

export default Login;
