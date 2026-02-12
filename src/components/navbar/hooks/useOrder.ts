import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';

export const useOrder = (user: User | null, isAdmin: boolean) => {
  const router = useRouter();
  const [latestOrderId, setLatestOrderId] = useState<number | null>(null);
  const [showNoPaymentDialog, setShowNoPaymentDialog] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchLatestOrder = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token || !user || isAdmin) {
        setLatestOrderId(null);
        return;
      }

      const response = await fetch(`${apiUrl}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        const pendingOrder = data.data.find((order: any) => order.status === 'pending');
        setLatestOrderId(pendingOrder ? pendingOrder.id : null);
      } else {
        setLatestOrderId(null);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLatestOrderId(null);
    }
  };

  useEffect(() => {
    if (user && !isAdmin) {
      fetchLatestOrder();
      const interval = setInterval(fetchLatestOrder, 5000);
      return () => clearInterval(interval);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    const handlePaymentSuccess = () => {
      if (!isAdmin) fetchLatestOrder();
    };
    window.addEventListener('payment-success', handlePaymentSuccess);
    return () => window.removeEventListener('payment-success', handlePaymentSuccess);
  }, [isAdmin]);

  const handlePaymentClick = async (e: React.MouseEvent) => {
    if (latestOrderId) {
      router.push(`/checkout/${latestOrderId}`);
      return;
    }

    e.preventDefault();
    
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await fetch(`${apiUrl}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.success && data.data) {
          const pendingOrder = data.data.find((order: any) => order.status === 'pending');
          if (pendingOrder) {
            setLatestOrderId(pendingOrder.id);
            router.push(`/checkout/${pendingOrder.id}`);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error refetching orders:', error);
    }

    setShowNoPaymentDialog(true);
  };

  return {
    latestOrderId,
    showNoPaymentDialog,
    setShowNoPaymentDialog,
    handlePaymentClick,
    fetchLatestOrder
  };
};