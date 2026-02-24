'use client';

import { useState, useEffect } from 'react';
import type { PaymentSettings, PaymentFormData, MessageType } from '../types';

export const usePaymentSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<MessageType | null>(null);
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    qris_title: 'QRIS Pembayaran',
    qris_active: true,
    bank_name: '',
    account_number: '',
    account_name: '',
    bank_active: true,
    active: true
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (settings && initialLoadComplete) {
      const isChanged =
        formData.qris_title !== settings.qris_title ||
        formData.qris_active !== settings.qris_active ||
        formData.bank_name !== settings.bank_name ||
        formData.account_number !== settings.account_number ||
        formData.account_name !== settings.account_name ||
        formData.bank_active !== settings.bank_active ||
        formData.active !== settings.active ||
        formData.qris_image_file !== undefined;

      setHasChanges(isChanged);
    }
  }, [formData, settings, initialLoadComplete]);

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage?.getItem('auth_token');
    const userData = localStorage?.getItem('auth_user');

    if (!token || !userData) {
      window.location.href = '/auth/login';
      return false;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'superadmin') {
        window.location.href = '/dashboard/admin';
        return false;
      }
      return true;
    } catch {
      window.location.href = '/auth/login';
      return false;
    }
  };

  const fetchSettings = async () => {
    setIsLoadingData(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/superadmin/payment-settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        setSettings(data.data);
        setFormData({
          qris_title: data.data.qris_title || 'QRIS Pembayaran',
          qris_active: Boolean(data.data.qris_active),
          bank_name: data.data.bank_name || '',
          account_number: data.data.account_number || '',
          account_name: data.data.account_name || '',
          bank_active: Boolean(data.data.bank_active),
          active: Boolean(data.data.active),
          qris_image_preview: data.data.qris_image_url
        });
        setImagePreview(data.data.qris_image_url);
      }
    } catch {
      showMessage('error', 'Gagal memuat pengaturan pembayaran');
    } finally {
      setIsLoadingData(false);
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  };

  const updateSettings = async () => {
    setIsSaving(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/superadmin/payment-settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          qris_title: formData.qris_title,
          qris_active: formData.qris_active,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          account_name: formData.account_name,
          bank_active: formData.bank_active,
          active: formData.active
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Pengaturan pembayaran berhasil diperbarui');
        await fetchSettings();
      }
    } catch {
      showMessage('error', 'Gagal menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };

  const showMessage = (type: MessageType['type'], text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleToggle = (field: keyof PaymentFormData) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const resetToOriginal = () => {
    if (settings) {
      setFormData({
        qris_title: settings.qris_title || 'QRIS Pembayaran',
        qris_active: Boolean(settings.qris_active),
        bank_name: settings.bank_name || '',
        account_number: settings.account_number || '',
        account_name: settings.account_name || '',
        bank_active: Boolean(settings.bank_active),
        active: Boolean(settings.active),
        qris_image_preview: settings.qris_image_url
      });
      setImagePreview(settings.qris_image_url);
      showMessage('info', 'Perubahan dibatalkan');
    }
  };

  return {
    isLoading,
    isLoadingData,
    isSaving,
    message,
    settings,
    formData,
    hasChanges,
    imagePreview,
    setImagePreview,
    setFormData,
    checkAuth,
    fetchSettings,
    updateSettings,
    showMessage,
    handleInputChange,
    handleToggle,
    resetToOriginal
  };
};