import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Cart, CartItem } from '../types';

export const useCart = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [checkoutNotes, setCheckoutNotes] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showEditNotesDialog, setShowEditNotesDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [showPendingPaymentDialog, setShowPendingPaymentDialog] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setMounted(true);
    fetchCart();

    const handleCartUpdate = () => {
      console.log('Cart update event received');
      fetchCart();
    };

    const handleLogout = () => {
      console.log('Logout event received');
      setCarts([]);
      setSheetOpen(false);
      setShowClearConfirm(false);
    };

    const handleLogin = () => {
      console.log('Login event received');
      fetchCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('logout', handleLogout);
    window.addEventListener('login', handleLogin);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('login', handleLogin);
    };
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        console.warn('No auth token found');
        setCarts([]);
        return;
      }

      const response = await fetch(`${apiUrl}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      if (data.success) {
        setCarts(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPendingPayment = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        return false;
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
        const pending = data.data.find((order: any) => order.status === 'pending');

        if (pending) {
          setPendingOrderId(pending.id);
          return true;
        }
      }

      setPendingOrderId(null);
      return false;
    } catch (error) {
      console.error('Error checking pending payment:', error);
      return false;
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        toast.error('Gagal menghapus item');
        return;
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Item dihapus dari keranjang');
        await fetchCart();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat menghapus item');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) {
        toast.error('Gagal mengupdate quantity');
        return;
      }

      const data = await response.json();
      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat mengupdate quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenEditNotesDialog = (item: CartItem) => {
    setEditingItemId(item.id);
    setEditingNotes(item.notes || '');
    setShowEditNotesDialog(true);
  };

  const handleUpdateItemNotes = async () => {
    if (!editingItemId) return;

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/cart/items/${editingItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        body: JSON.stringify({ notes: editingNotes || null })
      });

      if (!response.ok) {
        toast.error('Gagal mengupdate catatan');
        return;
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Catatan berhasil diperbarui');
        setShowEditNotesDialog(false);
        setEditingItemId(null);
        setEditingNotes('');
        await fetchCart();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat mengupdate catatan');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        toast.error('Gagal mengosongkan keranjang');
        return;
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Keranjang dikosongkan');
        setShowClearConfirm(false);
        await fetchCart();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat mengosongkan keranjang');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckoutClick = async () => {
    const hasPending = await checkPendingPayment();

    if (hasPending) {
      setShowPendingPaymentDialog(true);
      return;
    }

    setShowCheckoutDialog(true);
  };

  const handleCheckoutSubmit = async () => {
    try {
      setIsCheckingOut(true);
      const token = localStorage.getItem('auth_token');

      const cartsWithItems = carts.filter((cart) => cart.items.length > 0);

      if (cartsWithItems.length === 0) {
        toast.error('Keranjang Anda kosong');
        setIsCheckingOut(false);
        return;
      }

      console.log('🛒 Submitting checkout...');
      console.log('Carts with items:', cartsWithItems.length);
      console.log('Checkout notes:', checkoutNotes);

      // Step 1: Create order
      const createOrderResponse = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        body: JSON.stringify({
          notes: checkoutNotes || ''
        })
      });

      const createOrderData = await createOrderResponse.json();
      console.log('Create order response:', createOrderData);

      if (!createOrderResponse.ok) {
        console.error('❌ Create order error:', createOrderData);
        throw new Error(createOrderData.message || 'Failed to create order');
      }

      if (createOrderData.success) {
        const orderId = createOrderData.data.id;
        toast.success('Pesanan berhasil dibuat!');

        // Step 2: Clear cart
        await fetch(`${apiUrl}/api/cart/clear`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        });

        setCarts([]);
        setShowCheckoutDialog(false);
        setCheckoutNotes('');
        setSheetOpen(false);

        console.log('Navigating to payment:', orderId);
        router.push(`/checkout/${orderId}`);
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal membuat pesanan');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalCartItems = carts.reduce((total, cart) => {
    return total + cart.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0);
  }, 0);

  const totalCartPrice = carts.reduce((total, cart) => {
    return total + cart.items.reduce(
      (itemTotal, item) => itemTotal + parseFloat(item.price) * item.quantity,
      0
    );
  }, 0);

  const cartsWithItems = carts.filter((cart) => cart.items.length > 0);

  return {
    mounted,
    carts,
    isLoading,
    sheetOpen,
    setSheetOpen,
    isUpdating,
    showClearConfirm,
    setShowClearConfirm,
    showCheckoutDialog,
    setShowCheckoutDialog,
    checkoutNotes,
    setCheckoutNotes,
    isCheckingOut,
    showEditNotesDialog,
    setShowEditNotesDialog,
    editingItemId,
    editingNotes,
    setEditingNotes,
    showPendingPaymentDialog,
    setShowPendingPaymentDialog,
    pendingOrderId,
    totalCartItems,
    totalCartPrice,
    cartsWithItems,
    fetchCart,
    handleRemoveItem,
    handleUpdateQuantity,
    handleOpenEditNotesDialog,
    handleUpdateItemNotes,
    handleClearCart,
    handleCheckoutClick,
    handleCheckoutSubmit
  };
};