'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { forgotPasswordSchema, ForgotPasswordFormType } from '../schemas/forgotPasswordSchema';
import { ForgotPasswordResponse } from '../types';
import { FORGOT_PASSWORD_MESSAGES, REDIRECT_DELAY } from '../constants';

export const useForgotPassword = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const getApiUrl = (): string => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!envUrl) {
      throw new Error('API URL tidak ditemukan. Silakan cek konfigurasi environment variable.');
    }
    
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  };

  const onSubmit = async (data: ForgotPasswordFormType) => {
    try {
      setSubmitting(true);
      
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          email: data.email
        })
      });

      const responseData: ForgotPasswordResponse = await response.json();

      if (response.ok && responseData.success) {
        setEmailSent(true);
        setSentEmail(data.email);
        toast.success(responseData.message || FORGOT_PASSWORD_MESSAGES.SUCCESS);

        // Redirect to login after delay
        setTimeout(() => {
          router.push('/auth/login');
        }, REDIRECT_DELAY);
      } else {
        setSubmitting(false);
        toast.error(responseData.message || FORGOT_PASSWORD_MESSAGES.ERROR_EMAIL_NOT_FOUND);
        
        // Set form error
        form.setError('email', {
          message: responseData.message || FORGOT_PASSWORD_MESSAGES.ERROR_EMAIL_NOT_FOUND
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error instanceof Error && error.message.includes('API URL')) {
        toast.error(error.message);
      } else {
        toast.error(FORGOT_PASSWORD_MESSAGES.ERROR_CONNECTION);
      }
      
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmailSent(false);
    setSentEmail('');
    form.reset();
  };

  return {
    form,
    isSubmitting,
    emailSent,
    sentEmail,
    resetForm,
    onSubmit: form.handleSubmit(onSubmit)
  };
};