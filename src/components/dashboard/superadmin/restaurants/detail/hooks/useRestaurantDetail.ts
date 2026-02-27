import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type {
  Restaurant,
  Menu,
  FormData,
  Message,
  User,
  FilterStatus
} from '../types';
import { API_URL } from '../types';

export function useRestaurantDetail(restaurantId: string) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [message, setMessage] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    image: '',
    is_available: true
  });

  const apiUrl = API_URL;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback((): void => {
    const token = localStorage?.getItem('auth_token');
    const userData = localStorage?.getItem('auth_user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'superadmin') {
        router.push('/dashboard/admin');
        return;
      }

      setUser(parsedUser);
      setIsInitialized(true);
      fetchRestaurantAndMenus();
    } catch (error) {
      console.error('Error parsing user:', error);
      router.push('/auth/login');
    }
  }, [router]);

  const fetchRestaurantAndMenus = async (): Promise<void> => {
    await Promise.all([fetchRestaurant(), fetchMenus()]);
  };

  const fetchRestaurant = async (): Promise<void> => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/restaurants/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setRestaurant(data.data);
      } else {
        setRestaurant(null);
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setRestaurant(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenus = async (): Promise<void> => {
    setIsLoadingMenus(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/menus/restaurant/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const menusArray = Array.isArray(data.data) ? data.data : data.data?.data || [];
        setMenus(menusArray);
      } else {
        setMenus([]);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      setMenus([]);
    } finally {
      setIsLoadingMenus(false);
    }
  };

  const uploadImageToServer = async (file: File): Promise<string | null> => {
    try {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showMessage('error', 'Format file harus JPG, PNG, GIF, atau WebP');
        return null;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showMessage('error', `Ukuran file maksimal 5MB (Ukuran: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        return null;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const token = localStorage?.getItem('auth_token');

      const response = await fetch(`${apiUrl}/api/menus/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || `Upload gagal (HTTP ${response.status})`);
      }

      if (data.success) {
        const filename = data.data?.filename || data.filename;
        
        if (!filename) {
          throw new Error('Response format tidak sesuai');
        }
        return filename;
      }

      throw new Error(data.message || 'Upload gagal');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal upload gambar';
      showMessage('error', errorMessage);
      return null;
    }
  };

  const handleImageChange = (file: File): void => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Format file harus JPG, PNG, GIF, atau WebP');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showMessage(
        'error',
        `Ukuran file terlalu besar. Maksimal 5MB (Ukuran: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
      );
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setImagePreview(preview);
      setFormData((prev: FormData) => ({ ...prev, image: '' }));
    };
    reader.onerror = () => {
      showMessage('error', 'Gagal membaca file');
    };
    reader.readAsDataURL(file);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.name.trim()) {
      showMessage('error', 'Nama menu harus diisi');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      showMessage('error', 'Harga harus diisi dengan angka valid');
      return;
    }

    const priceValue = Math.round(Number(formData.price));

    setIsSubmitting(true);
    
    try {
      let finalImageName: string | null = formData.image || null;

      if (imageFile) {
        const uploadedFileName = await uploadImageToServer(imageFile);
        if (!uploadedFileName) {
          setIsSubmitting(false);
          return;
        }
        finalImageName = uploadedFileName;
      }

      const token = localStorage?.getItem('auth_token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${apiUrl}/api/menus/${editingId}` : `${apiUrl}/api/menus`;

      const payload = {
        restaurant_id: Number(restaurantId),
        name: formData.name.trim(),
        price: priceValue,
        image: finalImageName,
        is_available: formData.is_available
      };

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          throw new Error(`Validasi gagal: ${errorMessages}`);
        }
        throw new Error(result.message || `Gagal menyimpan menu (HTTP ${response.status})`);
      }

      if (result.success) {
        showMessage(
          'success',
          editingId ? 'Menu berhasil diperbarui' : 'Menu berhasil ditambahkan'
        );
        resetForm();
        await fetchMenus();
      } else {
        throw new Error(result.message || 'Gagal menyimpan menu');
      }
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan';
      showMessage('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (menu: Menu): void => {
    setFormData({
      name: menu.name,
      price: menu.price,
      image: menu.image,
      is_available: menu.is_available
    });
    setImagePreview(getImageSrc(menu.image));
    setImageFile(null);
    setEditingId(menu.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAvailability = async (id: number, currentStatus: boolean): Promise<void> => {
    setTogglingId(id);
    try {
      const token = localStorage?.getItem('auth_token');

      const response = await fetch(`${apiUrl}/api/menus/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_available: !currentStatus
        })
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(result.message || `Gagal mengubah status (HTTP ${response.status})`);
      }

      if (result.success) {
        showMessage('success', 'Status menu berhasil diubah');
        await fetchMenus();
      } else {
        throw new Error(result.message || 'Gagal mengubah status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengubah status';
      showMessage('error', errorMessage);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      const token = localStorage?.getItem('auth_token');

      const response = await fetch(`${apiUrl}/api/menus/${id}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(result.message || `Gagal menghapus menu (HTTP ${response.status})`);
      }

      if (result.success) {
        showMessage('success', 'Menu berhasil dihapus');
        await fetchMenus();
      } else {
        throw new Error(result.message || 'Gagal menghapus menu');
      }
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus menu';
      showMessage('error', errorMessage);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const resetForm = (): void => {
    setFormData({
      name: '',
      price: '',
      image: '',
      is_available: true
    });
    setImagePreview('');
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const showMessage = (type: 'success' | 'error', text: string): void => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getImageSrc = (image: string | null): string => {
    if (!image) return '/foodimages.png';
    if (image.startsWith('http') || image.startsWith('data:')) return image;
    if (image.startsWith('/storage')) return `${apiUrl}${image}`;
    return `${apiUrl}/storage/uploads/${image}`;
  };

  const availableCount = menus.filter((m: Menu) => m.is_available).length;
  const unavailableCount = menus.filter((m: Menu) => !m.is_available).length;

  const filteredMenus = menus.filter((menu: Menu) => {
    if (filterStatus === 'available') return menu.is_available;
    if (filterStatus === 'unavailable') return !menu.is_available;
    return true;
  });

  return {
    user,
    isLoading,
    isInitialized,
    restaurant,
    menus,
    isLoadingMenus,
    isSubmitting,
    showForm,
    editingId,
    togglingId,
    filterStatus,
    message,
    deleteConfirm,
    imagePreview,
    imageFile,
    formData,
    availableCount,
    unavailableCount,
    filteredMenus,

    setShowForm,
    setFilterStatus,
    setDeleteConfirm,
    setFormData,
    setImagePreview,
    setImageFile,

    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleAvailability,
    handleImageChange,
    handleFormChange, 
    showMessage,

    formatCurrency,
    getImageSrc
  };
}