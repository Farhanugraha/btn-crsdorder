'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Payment } from '../types';
import { PAYMENT_MESSAGES } from '../constants';

export const usePaymentDetail = (paymentId: string) => {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getApiUrl = (): string => {
    if (!apiUrl) {
      throw new Error('API URL tidak ditemukan');
    }
    return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
  };

  const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
  };

  const getUserData = () => {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  const checkAuth = (): boolean => {
    const token = getAuthToken();
    const user = getUserData();

    if (!token || !user) {
      router.push('/auth/login');
      return false;
    }

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      router.push('/areas');
      return false;
    }

    return true;
  };

  const fetchPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Token tidak ditemukan');
        setIsLoading(false);
        return;
      }

      const baseUrl = getApiUrl();
      const response = await fetch(
        `${baseUrl}/admin/payments/${paymentId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError(PAYMENT_MESSAGES.NOT_FOUND);
        } else if (response.status === 401) {
          router.push('/auth/login');
          return;
        } else {
          setError(`Error: ${response.status}`);
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        const paymentData = data.data;

        if (!paymentData.id || !paymentData.order || !paymentData.order.user) {
          setError(PAYMENT_MESSAGES.INVALID_DATA);
          setIsLoading(false);
          return;
        }

        setPayment(paymentData);
        setEditStatus(paymentData.payment_status);
      } else {
        setError(data.message || PAYMENT_MESSAGES.NOT_FOUND);
      }
    } catch (err) {
      console.error('Fetch payment error:', err);
      setError(PAYMENT_MESSAGES.LOADING_DESC);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentStatus = async () => {
    if (!payment) {
      setError(PAYMENT_MESSAGES.NOT_FOUND);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Token tidak ditemukan');
        setIsSaving(false);
        return;
      }

      const baseUrl = getApiUrl();
      const endpoint = editStatus === 'completed'
        ? `${baseUrl}/admin/payments/${payment.id}/confirm`
        : `${baseUrl}/admin/payments/${payment.id}/reject`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        setError(`Error: ${response.status}`);
        setIsSaving(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        setPayment(data.data);
        setEditStatus(data.data.payment_status);
        setIsEditing(false);
      } else {
        setError(data.message || PAYMENT_MESSAGES.UPDATE_ERROR);
      }
    } catch (err) {
      console.error('Update status error:', err);
      setError(PAYMENT_MESSAGES.UPDATE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayment();
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (checkAuth()) {
      fetchPayment();
    }
    setIsAuthChecking(false);
  }, [paymentId]);

  return {
    // States
    isAuthChecking,
    isLoading,
    payment,
    isEditing,
    editStatus,
    isSaving,
    isRefreshing,
    error,

    // Setters
    setIsEditing,
    setEditStatus,

    // Handlers
    updatePaymentStatus,
    handleRefresh,
    router
  };
};