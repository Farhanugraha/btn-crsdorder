import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Order, Restaurant, PaymentSettings, PaymentMethod, OrderItem } from '../types';

export const useCheckout = (orderId: string) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurants, setRestaurants] = useState<Map<number, Restaurant>>(new Map());
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNoPaymentDialog, setShowNoPaymentDialog] = useState(false);
  const [showNoPaymentMethodsDialog, setShowNoPaymentMethodsDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofImagePreview, setProofImagePreview] = useState('');
  const [confirmationNotes, setConfirmationNotes] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && orderId) {
      loadOrderData();
      loadPaymentMethods();
    } else if (mounted && !orderId) {
      setShowNoPaymentDialog(true);
    }
  }, [mounted, orderId]);

  const loadOrderData = async () => {
    try {
      setIsLoading(true);
      setOrder(null);

      const token = localStorage.getItem('auth_token');

      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session Anda telah berakhir, silakan login kembali');
          localStorage.removeItem('auth_token');
          router.push('/auth/login');
          return;
        }
        if (response.status === 404) {
          setShowNoPaymentDialog(true);
          return;
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        if (data.data.status !== 'pending') {
          setShowNoPaymentDialog(true);
          return;
        }

        setOrder(data.data);

        if (data.data.items && data.data.items.length > 0) {
          await fetchRestaurantData(data.data.items);
        }
      } else {
        setShowNoPaymentDialog(true);
      }
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Gagal memuat data pesanan');
      setShowNoPaymentDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      setIsLoadingPaymentMethods(true);

      const response = await fetch(`${apiUrl}/api/payment-methods`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setPaymentSettings(data.data);

        const methods: string[] = [];

        if (data.data.active) {
          if (data.data.qris_active && data.data.qris_image_url) {
            methods.push('qris');
          }
          if (data.data.bank_active && data.data.bank_name && data.data.account_number && data.data.account_name) {
            methods.push('transfer');
          }
        }

        setAvailablePaymentMethods(methods);

        if (methods.length > 0) {
          setPaymentMethod(methods[0] as PaymentMethod);
        }

        if (methods.length === 0) {
          setShowNoPaymentMethodsDialog(true);
        }
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      const fallbackData: PaymentSettings = {
        id: 1,
        qris_title: 'QRIS Pembayaran',
        qris_image: null,
        qris_image_url: null,
        qris_active: true,
        bank_name: 'Bank Example',
        account_number: '1234567890',
        account_name: 'Admin Name',
        bank_active: true,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setPaymentSettings(fallbackData);
      setAvailablePaymentMethods(['qris', 'transfer']);
      setPaymentMethod('qris');
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  };

  const fetchRestaurantData = async (items: OrderItem[]) => {
    try {
      const token = localStorage.getItem('auth_token');
      const restaurantIds = new Set(items.map((item) => item.menu?.restaurant_id));

      for (const restoId of Array.from(restaurantIds)) {
        try {
          const response = await fetch(`${apiUrl}/api/restaurants/${restoId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setRestaurants((prev) => new Map(prev).set(restoId, data.data));
            }
          }
        } catch (err) {
          console.error(`Error fetching restaurant ${restoId}:`, err);
        }
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitConfirmation = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      if (!order) {
        toast.error('Data pesanan tidak ditemukan');
        return;
      }

      if (!proofImage) {
        toast.error('Silakan upload bukti transfer');
        return;
      }

      const formData = new FormData();
      formData.append('proof_image', proofImage);
      formData.append('payment_method', paymentMethod);
      if (confirmationNotes.trim()) {
        formData.append('notes', confirmationNotes);
      }

      const uploadResponse = await fetch(`${apiUrl}/api/payments/orders/${order.id}/upload-proof`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      toast.success('Bukti pembayaran berhasil diunggah');

      const statusResponse = await fetch(`${apiUrl}/api/orders/${order.id}/payment-status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ status: 'paid' })
      });

      const statusData = await statusResponse.json();

      if (statusData.success) {
        toast.success('Pembayaran berhasil dikonfirmasi!');
        setShowSuccessModal(true);
        setProofImage(null);
        setProofImagePreview('');
        setConfirmationNotes('');

        setTimeout(() => {
          router.push('/order');
        }, 2000);
      } else {
        toast.error(statusData.message || 'Gagal update status pembayaran');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mengonfirmasi pembayaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      if (!order) {
        toast.error('Data pesanan tidak ditemukan');
        return;
      }

      const response = await fetch(`${apiUrl}/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Pesanan berhasil dibatalkan');
        setShowCancelDialog(false);
        setTimeout(() => {
          router.push('/order');
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal membatalkan pesanan');
    } finally {
      setIsCancelling(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`${label} disalin ke clipboard`);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const resetProofImage = () => {
    setProofImage(null);
    setProofImagePreview('');
  };

  const groupedItems = order?.items.reduce((acc, item) => {
    const restoId = item.menu?.restaurant_id || 0;
    if (!acc[restoId]) {
      acc[restoId] = [];
    }
    acc[restoId].push(item);
    return acc;
  }, {} as Record<number, OrderItem[]>);

  const totalPrice = order
    ? typeof order.total_price === 'string'
      ? parseInt(order.total_price)
      : order.total_price
    : 0;

  return {
    mounted,
    order,
    restaurants,
    paymentSettings,
    isLoading,
    isLoadingPaymentMethods,
    isSubmitting,
    isCancelling,
    showSuccessModal,
    setShowSuccessModal,
    showNoPaymentDialog,
    setShowNoPaymentDialog,
    showNoPaymentMethodsDialog,
    setShowNoPaymentMethodsDialog,
    paymentMethod,
    setPaymentMethod,
    availablePaymentMethods,
    copiedText,
    proofImage,
    proofImagePreview,
    confirmationNotes,
    setConfirmationNotes,
    showCancelDialog,
    setShowCancelDialog,
    groupedItems,
    totalPrice,
    handleImageChange,
    handleSubmitConfirmation,
    handleCancelOrder,
    copyToClipboard,
    resetProofImage,
    loadOrderData
  };
};