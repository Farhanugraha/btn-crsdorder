import { useState, useEffect, useCallback } from 'react';
import type { 
  Area, 
  Restaurant, 
  FormData, 
  Message, 
  User, 
  ViewMode, 
  FilterStatus 
} from '../types';
// PERBAIKAN: import API_URL sebagai value, bukan type
import { API_URL } from '../types';

export function useRestaurants() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterArea, setFilterArea] = useState<string | number>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    area_id: '',
    name: '',
    description: '',
    address: ''
  });

  const apiUrl = API_URL; // Gunakan API_URL yang diimport

  const getIsOpen = (value: number | boolean): boolean => Boolean(value);

  useEffect(() => {
    const checkDarkMode = () => {
      const hasDark = document.documentElement.classList.contains('dark');
      setIsDark(hasDark);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage?.getItem('auth_token');
    const userData = localStorage?.getItem('auth_user');

    if (!token || !userData) {
      window.location.href = '/auth/login';
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'superadmin') {
        window.location.href = '/dashboard/admin';
        return;
      }

      setUser(parsedUser);
      setIsLoading(false);
      await Promise.all([fetchAreas(), fetchRestaurants()]);
    } catch (error) {
      console.error('Auth Error:', error);
      window.location.href = '/auth/login';
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/areas`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setAreas(data.data);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      showMessage('error', 'Gagal memuat data area');
    }
  };

  const fetchRestaurants = async () => {
    setIsLoadingRestaurants(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success && data.data?.data && Array.isArray(data.data.data)) {
        setRestaurants(data.data.data);
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      showMessage('error', 'Gagal memuat restoran');
      setRestaurants([]);
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const resetForm = () => {
    setFormData({
      area_id: '',
      name: '',
      description: '',
      address: '',
      photoFile: null,
      photoPreview: null,
      currentPhoto: null,
      deletePhoto: false
    });
    setEditingId(null);
    setShowForm(false);

    const input = document.getElementById('photoInput') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSubmit = async () => {
    if (
      !formData.area_id ||
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.address.trim()
    ) {
      showMessage('error', 'Semua field harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${apiUrl}/api/restaurants/${editingId}`
        : `${apiUrl}/api/restaurants`;

      const submitData = new FormData();
      submitData.append('area_id', String(formData.area_id));
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('address', formData.address);

      if (editingId) {
        submitData.append('_method', 'PUT');
      }
      if (editingId && formData.deletePhoto) {
        submitData.append('delete_photo', 'true');
      }

      if (formData.photoFile) {
        submitData.append('photo', formData.photoFile);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submitData
      });

      const result = await response.json();
      if (result.success) {
        showMessage(
          'success',
          editingId
            ? 'Restoran berhasil diperbarui'
            : 'Restoran berhasil ditambahkan'
        );
        resetForm();
        await fetchRestaurants();
      } else {
        showMessage('error', result.message || 'Gagal menyimpan');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setFormData({
      area_id: restaurant.area_id,
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      currentPhoto: restaurant.photo || null
    });
    setEditingId(restaurant.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/restaurants/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        showMessage('success', 'Restoran berhasil dihapus');
        await fetchRestaurants();
      } else {
        showMessage('error', result.message || 'Gagal menghapus');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Terjadi kesalahan');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/restaurants/${id}/toggle-status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        showMessage('success', 'Status berhasil diubah');
        await fetchRestaurants();
      } else {
        showMessage('error', result.message || 'Gagal mengubah status');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Gagal mengubah status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photoFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // PERBAIKAN: Hapus penggunaan editingId di dalam objek prev
  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photoFile: null,
      photoPreview: null,
      currentPhoto: null,
      deletePhoto: true
    }));
    const input = document.getElementById('photoInput') as HTMLInputElement;
    if (input) input.value = '';
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'open' ? getIsOpen(r.is_open) : !getIsOpen(r.is_open));

    const areaMatch = filterArea === 'all' || r.area_id === Number(filterArea);

    const searchMatch =
      searchQuery === '' ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && areaMatch && searchMatch;
  });

  const openCount = restaurants.filter((r) => getIsOpen(r.is_open)).length;
  const closedCount = restaurants.filter((r) => !getIsOpen(r.is_open)).length;

  return {
    // State
    isDark,
    user,
    isLoading,
    restaurants,
    areas,
    isLoadingRestaurants,
    isSubmitting,
    showForm,
    viewMode,
    filterStatus,
    filterArea,
    editingId,
    message,
    deleteConfirm,
    togglingId,
    searchQuery,
    formData,
    filteredRestaurants,
    openCount,
    closedCount,

    // Setters
    setShowForm,
    setViewMode,
    setFilterStatus,
    setFilterArea,
    setSearchQuery,
    setDeleteConfirm,

    // Actions
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleStatus,
    handleFormChange,
    handlePhotoUpload,
    handleRemovePhoto,
    showMessage,

    // Helpers
    getIsOpen
  };
}