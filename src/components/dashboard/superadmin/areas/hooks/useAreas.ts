import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Area, FormData, Message, User, ViewMode } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAreas() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    icon: '🏢'
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const getAuthToken = (): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  const getApiUrl = (): string => {
    if (API_URL && API_URL.includes('/api')) return API_URL;
    return `${API_URL}/api`;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(() => {
    try {
      const token = getAuthToken();
      const userData = localStorage?.getItem('auth_user');

      if (!token || !userData) {
        router.push('/auth/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'superadmin') {
        router.push('/dashboard');
        return;
      }

      setUser(parsedUser);
      setIsLoading(false);
      fetchAreas();
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/auth/login');
    }
  }, [router]);

  const fetchAreas = async () => {
    setIsLoadingAreas(true);
    try {
      const token = getAuthToken();
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/areas`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const sortedAreas = data.data.sort(
          (a: Area, b: Area) => a.order - b.order
        );
        setAreas(sortedAreas);
      } else if (Array.isArray(data)) {
        const sortedAreas = data.sort(
          (a: Area, b: Area) => a.order - b.order
        );
        setAreas(sortedAreas);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      showMessage('error', 'Gagal memuat data area');
    } finally {
      setIsLoadingAreas(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: '🏢' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      showMessage('error', 'Nama dan deskripsi harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      const apiUrl = getApiUrl();
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${apiUrl}/areas/${editingId}`
        : `${apiUrl}/areas`;

      const currentNextOrder = areas.length + 1;

      const submitData = editingId
        ? { ...formData }
        : { ...formData, order: currentNextOrder };

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showMessage(
          'success',
          editingId ? 'Area berhasil diperbarui' : 'Area berhasil ditambahkan'
        );
        resetForm();
        fetchAreas();
      } else {
        showMessage('error', result.message || 'Gagal menyimpan area');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      showMessage('error', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (area: Area) => {
    setFormData({
      name: area.name,
      description: area.description,
      icon: area.icon
    });
    setEditingId(area.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = getAuthToken();
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/areas/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 204 || response.status === 404) {
        let result;
        try {
          result = await response.json();
        } catch {
          result = { success: true };
        }

        setAreas(prev => prev.filter(area => area.id !== id));
        showMessage('success', 'Area berhasil dihapus');
        fetchAreas();
      } else {
        let errorMessage = 'Gagal menghapus area';
        try {
          const result = await response.json();
          errorMessage = result.message || errorMessage;
        } catch {
          // Ignore
        }
        showMessage('error', errorMessage);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showMessage('error', 'Terjadi kesalahan saat menghapus');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (emoji: string) => {
    setFormData(prev => ({ ...prev, icon: emoji }));
  };

  const handleIconCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, icon: e.target.value }));
  };

  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const nextOrder = areas.length + 1;

  return {
    user,
    areas,
    isLoading,
    isLoadingAreas,
    isSubmitting,
    showForm,
    viewMode,
    formData,
    editingId,
    message,
    deleteConfirm,
    nextOrder,

    setShowForm,
    setDeleteConfirm,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleFormChange,
    handleIconSelect,
    handleIconCustom,
    toggleViewMode,
    showMessage
  };
}