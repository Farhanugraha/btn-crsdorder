'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginFormSchema, LoginFormType } from '../schemas/loginSchema';
import { LoginResponse, AuthUser } from '../types';
import { LOGIN_MESSAGES, REDIRECT_PATHS, TOKEN_CONFIG } from '../constants';

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const redirect = searchParams.get('redirect');

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const getApiUrl = (): string => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!envUrl) {
      throw new Error('API URL tidak ditemukan. Silakan cek konfigurasi environment variable.');
    }
    
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  };

  const checkExistingAuth = () => {
    const token = localStorage.getItem(TOKEN_CONFIG.STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(TOKEN_CONFIG.STORAGE_KEYS.USER);

    if (token && userStr) {
      try {
        const userData: AuthUser = JSON.parse(userStr);
        redirectBasedOnRole(userData.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuthData();
      }
    }
    setIsLoading(false);
  };

  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(TOKEN_CONFIG.STORAGE_KEYS.USER);
    localStorage.removeItem(TOKEN_CONFIG.STORAGE_KEYS.EXPIRES);
  };

  const storeAuthData = (token: string, user: AuthUser, expiresIn: number = TOKEN_CONFIG.DEFAULT_EXPIRY) => {
    localStorage.setItem(TOKEN_CONFIG.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(TOKEN_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(TOKEN_CONFIG.STORAGE_KEYS.EXPIRES, String(Date.now() + expiresIn * 1000));
  };

  const redirectBasedOnRole = (role: AuthUser['role'], customRedirect?: string | null) => {
    if (customRedirect === 'checkout') {
      router.push(REDIRECT_PATHS.checkout);
    } else {
      router.push(REDIRECT_PATHS[role]);
    }
  };

  const handleValidationErrors = (errors: Record<string, string[]>) => {
    Object.keys(errors).forEach((field) => {
      const fieldName = field as keyof LoginFormType;
      const message = Array.isArray(errors[field])
        ? errors[field][0]
        : errors[field];
      
      form.setError(fieldName, {
        message: message as string
      });
    });
    toast.error(LOGIN_MESSAGES.ERROR_VALIDATION);
  };

  const onSubmit = async (data: LoginFormType) => {
    try {
      setSubmitting(true);
      
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/auth/login`, {
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

      if (response.ok && responseData.success && responseData.token && responseData.user) {
        storeAuthData(
          responseData.token, 
          responseData.user, 
          responseData.expires_in
        );

        toast.success(LOGIN_MESSAGES.SUCCESS);

        window.dispatchEvent(new Event('auth-changed'));
        window.dispatchEvent(new Event('login'));

        setTimeout(() => {
          redirectBasedOnRole(responseData.user!.role, redirect);
        }, 1000);
      } else {
        setSubmitting(false);
        
        if (response.status === 403) {
          toast.error('Email belum diverifikasi. Silakan cek inbox atau folder spam Anda.');
          return;
        }

        if (responseData.errors) {
          handleValidationErrors(responseData.errors);
        } else {
          toast.error(responseData.message || LOGIN_MESSAGES.ERROR_INVALID_CREDENTIALS);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error && error.message.includes('API URL')) {
        toast.error(error.message);
      } else {
        toast.error(LOGIN_MESSAGES.ERROR_CONNECTION);
      }
      
      setSubmitting(false);
    }
  };

  useEffect(() => {
    checkExistingAuth();
  }, []);

  return {
    form,
    isSubmitting,
    showPassword,
    isLoading,
    redirect,
    setShowPassword,
    onSubmit: form.handleSubmit(onSubmit)
  };
};