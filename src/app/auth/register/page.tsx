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
import { registerFormSchema } from '@/lib/validation/registerFormSchema';

type formType = z.infer<typeof registerFormSchema>;

const Register = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const form = useForm<formType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      street: '',
      city: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (
    data: z.infer<typeof registerFormSchema>
  ) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          street: data.street,
          city: data.city,
          phone: data.phone,
          password: data.password,
          confirmPassword: data.confirmPassword
        })
      });

      if (response.ok) {
        toast.success(
          'Account created successfully! Redirecting to login...'
        );
        setTimeout(() => router.push('/auth/login'), 1500);
      } else {
        setSubmitting(false);
        const body = await response.json();
        toast.error(body.message || 'An unexpected error occurred');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="border-b border-border bg-muted/50 px-6 py-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Register
          </h1>
          <p className="text-sm text-muted-foreground">
            Mulai pesan makanan favoritmu sekarang.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Two Column Layout for Name and Email */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=""
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=""
                          type="email"
                          disabled={isSubmitting}
                          className="border-border focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=""
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
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=""
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

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
                        type="tel"
                        disabled={isSubmitting}
                        className="border-border focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

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
                            placeholder=""
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder=""
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
                {isSubmitting
                  ? 'Creating Account...'
                  : 'Create Account'}
              </Button>
            </form>
          </Form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah Memiliki Akun?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
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
              Kebijakan Privasi kami.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
