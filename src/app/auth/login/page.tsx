'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import Image from 'next/image';
import googleLogo from '../../../../public/google_logo.svg';
import { loginFormSchema } from '@/lib/validation/loginFormSchema';

type formType = z.infer<typeof loginFormSchema>;

const Login = () => {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');

  const [isSubmittingCredentials, setSubmittingCredentials] =
    useState(false);
  const [isSubmittingGoogle, setSubmittingGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<formType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      setSubmittingCredentials(true);
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      });
      if (response?.ok) {
        toast.success('Login successful!');
        if (redirect === 'checkout') {
          router.push('/checkout');
        } else {
          router.push('/');
        }
      }
      if (response?.error) {
        setSubmittingCredentials(false);
        toast.error('Email or password is incorrect');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setSubmittingCredentials(false);
    }
  };

  if (status === 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 text-center shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Already Logged In
          </h2>
          <p className="mb-6 text-muted-foreground">
            You are already authenticated. Redirecting...
          </p>
          <Button onClick={() => router.push('/')} className="w-full">
            Go to Home
          </Button>
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
            Welcome
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
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
                        placeholder="you@example.com"
                        type="email"
                        disabled={
                          isSubmittingCredentials ||
                          isSubmittingGoogle
                        }
                        className="border-border focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
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
                          disabled={
                            isSubmittingCredentials ||
                            isSubmittingGoogle
                          }
                          className="border-border pr-10 focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                          disabled={
                            isSubmittingCredentials ||
                            isSubmittingGoogle
                          }
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  isSubmittingCredentials || isSubmittingGoogle
                }
                className="w-full"
                size="lg"
              >
                {isSubmittingCredentials && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmittingCredentials
                  ? 'Signing in...'
                  : 'Sign In'}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="mx-4 flex-shrink text-xs text-muted-foreground">
              ATAU
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              setSubmittingGoogle(true);
              await signIn('google', {
                callbackUrl:
                  redirect === 'checkout' ? '/checkout' : '/'
              });
            }}
            disabled={isSubmittingCredentials || isSubmittingGoogle}
          >
            {isSubmittingGoogle && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Image
              src={googleLogo}
              alt="google logo"
              width={16}
              height={16}
              className="mr-2"
            />
            {isSubmittingGoogle
              ? 'Connecting...'
              : 'Sign in with Google'}
          </Button>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-primary hover:underline"
            >
              Buat sekarang
            </Link>
          </p>
        </div>

        {/* Footer */}
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
