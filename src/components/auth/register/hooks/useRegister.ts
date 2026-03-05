'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registerFormSchema, RegisterFormType } from '../schemas/registerSchema';
import { RegisterResponse } from '../types';
import { REGISTER_MESSAGES } from '../constants';

export const useRegister = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedDivisi, setSelectedDivisi] = useState<string>('');

  const form = useForm<RegisterFormType>({
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

  const getApiUrl = (): string => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!envUrl) {
      throw new Error('API URL tidak ditemukan. Silakan cek konfigurasi environment variable.');
    }
    
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  };

  const preparePayload = (data: RegisterFormType) => ({
    name: data.name,
    email: data.email,
    password: data.password,
    password_confirmation: data.password_confirmation,
    phone: data.phone || null,
    divisi: data.divisi || null,
    unit_kerja: data.unit_kerja || null
  });

  const handleValidationErrors = (errors: Record<string, string[]>) => {
    Object.keys(errors).forEach((field) => {
      const fieldName = field as keyof RegisterFormType;
      const message = Array.isArray(errors[field])
        ? errors[field][0]
        : errors[field];
      
      form.setError(fieldName, {
        message: message
      });
    });
    toast.error(REGISTER_MESSAGES.ERROR_FORM);
  };

  const onSubmit = async (data: RegisterFormType) => {
    try {
      setSubmitting(true);
      
      const apiUrl = getApiUrl();
      const payload = preparePayload(data);

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData: RegisterResponse = await response.json();

      if (response.ok && responseData.success) {
        toast.success(responseData.message || REGISTER_MESSAGES.SUCCESS);
        
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        setSubmitting(false);

        if (responseData.errors) {
          handleValidationErrors(responseData.errors);
        } else {
          toast.error(responseData.message || REGISTER_MESSAGES.ERROR_GENERAL);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof Error && error.message.includes('API URL')) {
        toast.error(error.message);
      } else {
        toast.error(REGISTER_MESSAGES.ERROR_CONNECTION);
      }
      
      setSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    showPassword,
    showConfirmPassword,
    selectedDivisi,
    setShowPassword,
    setShowConfirmPassword,
    setSelectedDivisi,
    onSubmit: form.handleSubmit(onSubmit)
  };
};