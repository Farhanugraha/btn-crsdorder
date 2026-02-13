import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Order, Restaurant, OrderItem } from '../types';
import { groupItemsByRestaurant } from '../utils/orderDetailUtils';

export const useOrderDetail = (orderId: string) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurants, setRestaurants] = useState<Map<number, Restaurant>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && orderId) {
      loadOrderData();
    }
  }, [mounted, orderId]);

  const loadOrderData = async () => {
    try {
      setIsLoading(true);
      setError(null);

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
          toast.error('Session Anda telah berakhir');
          localStorage.removeItem('auth_token');
          router.push('/auth/login');
          return;
        }
        if (response.status === 404) {
          setError('Pesanan tidak ditemukan');
          return;
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setOrder(data.data);
        if (data.data.items && data.data.items.length > 0) {
          await fetchRestaurantData(data.data.items, token);
        }
      } else {
        setError('Data pesanan tidak valid');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      setError('Gagal mengambil data pesanan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRestaurantData = async (items: OrderItem[], token: string) => {
    try {
      const restaurantIds = new Set(items.map((item) => item.menu?.restaurant_id));
      const restaurantIdArray = Array.from(restaurantIds);

      for (const restoId of restaurantIdArray) {
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
        if (response.status === 401) {
          toast.error('Session Anda telah berakhir');
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to cancel order');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Pesanan berhasil dibatalkan');
        setShowCancelDialog(false);
        
        // Update order status locally
        setOrder((prev) => prev ? { ...prev, status: 'canceled' } : null);
        
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

  const handleBack = () => {
    router.push('/order');
  };

  const handleCheckout = () => {
    if (order) {
      router.push(`/checkout/${order.id}`);
    }
  };

  const totalPrice = order
    ? typeof order.total_price === 'string'
      ? parseInt(order.total_price)
      : order.total_price
    : 0;

  const groupedItems = order?.items ? groupItemsByRestaurant(order.items) : {};

  return {
    mounted,
    order,
    restaurants,
    isLoading,
    isCancelling,
    showCancelDialog,
    setShowCancelDialog,
    error,
    totalPrice,
    groupedItems,
    loadOrderData,
    handleCancelOrder,
    handleBack,
    handleCheckout
  };
};