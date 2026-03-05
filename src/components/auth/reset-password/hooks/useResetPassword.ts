'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { resetPasswordSchema, ResetPasswordFormType } from '../schemas/resetPasswordSchema';
import { ResetPasswordResponse, UrlParams } from '../types';
import { RESET_PASSWORD_MESSAGES, RESET_PASSWORD_LINKS, REDIRECT_DELAY } from '../constants';

export const useResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get email and token from URL params
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: ''
    }
  });

  const getApiUrl = (): string => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!envUrl) {
      throw new Error('API URL tidak ditemukan. Silakan cek konfigurasi environment variable.');
    }
    
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  };

  const onSubmit = async (data: ResetPasswordFormType) => {
    try {
      setSubmitting(true);
      
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/auth/reset-password`, {
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
      });

      const responseData: ResetPasswordResponse = await response.json();

      if (response.ok && responseData.success) {
        toast.success(responseData.message || RESET_PASSWORD_MESSAGES.SUCCESS);

        // Redirect to login after delay
        setTimeout(() => {
          router.push(RESET_PASSWORD_LINKS.LOGIN);
        }, REDIRECT_DELAY);
      } else {
        setSubmitting(false);
        toast.error(responseData.message || RESET_PASSWORD_MESSAGES.ERROR_GENERAL);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      
      if (error instanceof Error && error.message.includes('API URL')) {
        toast.error(error.message);
      } else {
        toast.error(RESET_PASSWORD_MESSAGES.ERROR_CONNECTION);
      }
      
      setSubmitting(false);
    }
  };

  const urlParams: UrlParams = {
    email,
    token
  };

  return {
    form,
    isSubmitting,
    showPassword,
    showConfirmPassword,
    urlParams,
    setShowPassword,
    setShowConfirmPassword,
    onSubmit: form.handleSubmit(onSubmit)
  };
};