import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Restaurant, Menu } from '../types';

export const useRestaurantMenu = (restaurantId: string) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedQuantity, setSelectedQuantity] = useState<{ [key: string]: number }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [areaId, setAreaId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiUrl}/api/restaurants/${restaurantId}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error('Gagal memuat restoran');
        }

        setRestaurant(result.data);
        setMenuList(result.data.menus || []);
        setAreaId(result.data.area_id);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [restaurantId, apiUrl]);

  const toggleDialog = (menuId: number) => {
    if (!isLoggedIn) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/auth/login');
      return;
    }

    const key = String(menuId);
    setDialogOpen((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));

    if (!dialogOpen[key]) {
      setSelectedQuantity((prev) => ({ ...prev, [key]: 1 }));
      setNotes((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const handleAddToCart = async (menu: Menu) => {
    const key = String(menu.id);
    const quantity = selectedQuantity[key] || 1;
    const noteText = notes[key] || '';

    try {
      setIsAddingToCart(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      const payload = {
        menu_id: menu.id,
        restaurant_id: restaurant?.id,
        quantity: quantity,
        notes: noteText
      };

      const response = await fetch(`${apiUrl}/api/cart/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`${menu.name} ditambahkan ke keranjang!`);
        toggleDialog(menu.id);
        setSelectedQuantity((prev) => ({ ...prev, [key]: 1 }));
        setNotes((prev) => ({ ...prev, [key]: '' }));
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        toast.error(data.message || 'Gagal menambahkan ke keranjang');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Terjadi kesalahan saat menambahkan ke keranjang');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBack = () => {
    if (areaId) {
      router.push(`/areas/${areaId}`);
    } else {
      router.push('/areas');
    }
  };

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  return {
    isLoading,
    restaurant,
    menuList,
    error,
    dialogOpen,
    selectedQuantity,
    notes,
    isAddingToCart,
    areaId,
    isLoggedIn,
    toggleDialog,
    handleAddToCart,
    handleBack,
    handleLoginRedirect,
    setSelectedQuantity,
    setNotes
  };
};