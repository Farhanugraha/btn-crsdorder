import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type {
  UserDetail,
  AuthData,
  UpdateUserData,
  PasswordData,
  FormState,
  DivisionInputState
} from '../types';

export function useEditUser(userId: string) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [user, setUser] = useState<UserDetail | null>(null);

  const [formState, setFormState] = useState<FormState>({
    loading: true,
    updating: false,
    error: null,
    successMessage: null
  });

  const [formData, setFormData] = useState<UpdateUserData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    divisi: '',
    unit_kerja: ''
  });

  const [divisionState, setDivisionState] = useState<DivisionInputState>({
    selectedDivisions: [],
    showDivisionSelector: false,
    customDivisi: '',
    isCustomDivisi: false
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    password: '',
    password_confirmation: ''
  });

  const [showPassword, setShowPassword] = useState(false);

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
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && envUrl.includes('/api')) return envUrl;
    return `${envUrl}/api`;
  };

  const parseDataAccessToSelectedDivisions = (dataAccess: any): string[] => {
    if (!dataAccess) return [];

    if (Array.isArray(dataAccess)) {
      const validCodes = dataAccess.filter(
        (code: string) => code === 'crsd1' || code === 'crsd2'
      );
      if (validCodes.includes('crsd1') && validCodes.includes('crsd2')) {
        return ['all', ...validCodes];
      }
      return validCodes;
    }

    if (typeof dataAccess === 'string') {
      try {
        const parsed = JSON.parse(dataAccess);
        if (Array.isArray(parsed)) {
          const validCodes = parsed.filter(
            (code: string) => code === 'crsd1' || code === 'crsd2'
          );
          if (validCodes.includes('crsd1') && validCodes.includes('crsd2')) {
            return ['all', ...validCodes];
          }
          return validCodes;
        }
      } catch {
        if (dataAccess.includes('crsd1') || dataAccess.includes('crsd2')) {
          const codes = [];
          if (dataAccess.includes('crsd1')) codes.push('crsd1');
          if (dataAccess.includes('crsd2')) codes.push('crsd2');
          if (codes.includes('crsd1') && codes.includes('crsd2')) {
            return ['all', ...codes];
          }
          return codes;
        }
      }
    }

    return [];
  };

  useEffect(() => {
    setMounted(true);
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchUserDetail();
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    setDivisionState(prev => ({
      ...prev,
      showDivisionSelector: formData.role === 'admin'
    }));

    if (formData.role !== 'admin') {
      setDivisionState(prev => ({ ...prev, selectedDivisions: [] }));
    }
  }, [formData.role]);

  useEffect(() => {
    if (formData.divisi) {
      const isCrsd = formData.divisi === 'CRSD 1' || formData.divisi === 'CRSD 2';
      setDivisionState(prev => ({
        ...prev,
        isCustomDivisi: !isCrsd,
        customDivisi: !isCrsd ? formData.divisi : ''
      }));
    } else {
      setDivisionState(prev => ({ ...prev, isCustomDivisi: false, customDivisi: '' }));
    }
  }, [formData.divisi]);

  const checkAuthentication = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');

      if (!token || !userStr) {
        setIsAuthenticated(false);
        setAuthData(null);
        setFormState(prev => ({ ...prev, error: 'Silakan login terlebih dahulu', loading: false }));
        setTimeout(() => { router.push('/auth/login'); }, 2000);
        return;
      }

      const userData = JSON.parse(userStr);

      if (userData.role !== 'superadmin') {
        setIsAuthenticated(false);
        setAuthData(null);
        setFormState(prev => ({
          ...prev,
          error: 'Hanya superadmin yang dapat mengakses halaman ini',
          loading: false
        }));
        setTimeout(() => { router.push('/dashboard'); }, 2000);
        return;
      }

      setAuthData({ token, user: userData });
      setIsAuthenticated(true);
      setFormState(prev => ({ ...prev, error: null }));
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setAuthData(null);
      setFormState(prev => ({ ...prev, error: 'Terjadi kesalahan pada autentikasi', loading: false }));
      setTimeout(() => { router.push('/auth/login'); }, 2000);
    }
  }, [router]);

  const fetchUserDetail = useCallback(async () => {
    try {
      setFormState(prev => ({ ...prev, loading: true, error: null }));

      const token = getAuthToken();

      if (!token) {
        setFormState(prev => ({ ...prev, error: 'Token tidak ditemukan. Silakan login kembali.', loading: false }));
        setIsAuthenticated(false);
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      const apiUrl = getApiUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${apiUrl}/superadmin/users/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) throw new Error('Pengguna tidak ditemukan');
        if (response.status === 401) {
          setIsAuthenticated(false);
          setTimeout(() => router.push('/auth/login'), 2000);
          throw new Error('Sesi telah berakhir. Silakan login kembali.');
        }
        throw new Error(data.message || 'Gagal mengambil detail pengguna');
      }

      if (!data.success) {
        throw new Error(data.message || 'Gagal mengambil detail pengguna');
      }

      const userData = data.data;
      setUser(userData);

      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role,
        divisi: userData.divisi || '',
        unit_kerja: userData.unit_kerja || ''
      });

      if (userData.data_access) {
        const divisions = parseDataAccessToSelectedDivisions(userData.data_access);
        setDivisionState(prev => ({ ...prev, selectedDivisions: divisions }));
      }

      setFormState(prev => ({ ...prev, loading: false }));
    } catch (err: any) {
      console.error('Fetch user detail error:', err);

      if (err.name === 'AbortError') {
        setFormState(prev => ({ ...prev, error: 'Permintaan timeout. Silakan coba lagi.', loading: false }));
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data pengguna';
        setFormState(prev => ({ ...prev, error: errorMsg, loading: false }));
      }
    }
  }, [userId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'role' && value !== 'admin' && user?.data_access) {
      const divisions = parseDataAccessToSelectedDivisions(user.data_access);
      setDivisionState(prev => ({ ...prev, selectedDivisions: divisions }));
    }
  };

  const handleDivisiSelect = (value: string) => {
    if (value === 'LAINNYA') {
      setDivisionState(prev => ({ ...prev, isCustomDivisi: true, customDivisi: '' }));
      setFormData(prev => ({ ...prev, divisi: '' }));
    } else {
      setDivisionState(prev => ({ ...prev, isCustomDivisi: false, customDivisi: '' }));
      setFormData(prev => ({ ...prev, divisi: value }));
    }
  };

  const handleCustomDivisiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, divisi: value }));
    setDivisionState(prev => ({ ...prev, customDivisi: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleDivisionToggle = (divisionCode: string) => {
    setDivisionState(prev => {
      let newSelection = [...prev.selectedDivisions];

      if (divisionCode === 'all') {
        newSelection = prev.selectedDivisions.includes('all') ? [] : ['all', 'crsd1', 'crsd2'];
      } else {
        if (prev.selectedDivisions.includes(divisionCode)) {
          newSelection = prev.selectedDivisions.filter(code => code !== divisionCode);
          if (newSelection.includes('all') && !(newSelection.includes('crsd1') && newSelection.includes('crsd2'))) {
            newSelection = newSelection.filter(code => code !== 'all');
          }
        } else {
          newSelection = [...prev.selectedDivisions, divisionCode];
          if (newSelection.includes('crsd1') && newSelection.includes('crsd2') && !newSelection.includes('all')) {
            newSelection.push('all');
          }
        }
      }

      return { ...prev, selectedDivisions: newSelection };
    });
  };

  const handleSelectAllDivisions = () => {
    setDivisionState(prev => ({ ...prev, selectedDivisions: ['all', 'crsd1', 'crsd2'] }));
  };

  const handleClearAllDivisions = () => {
    setDivisionState(prev => ({ ...prev, selectedDivisions: [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setFormState(prev => ({ ...prev, error: 'Nama dan email wajib diisi' }));
      return;
    }

    if (formData.role === 'admin' && divisionState.selectedDivisions.length === 0) {
      setFormState(prev => ({
        ...prev,
        error: 'Admin harus memiliki setidaknya satu divisi yang dapat diakses'
      }));
      return;
    }

    setFormState(prev => ({ ...prev, updating: true, error: null, successMessage: null }));

    try {
      const token = getAuthToken();

      if (!token) {
        setFormState(prev => ({ ...prev, error: 'Token tidak ditemukan. Silakan login kembali.', updating: false }));
        return;
      }

      const apiUrl = getApiUrl();

      const payload: any = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role
      };

      if (formData.phone?.trim()) payload.phone = formData.phone.trim();
      if (formData.divisi?.trim()) payload.divisi = formData.divisi.trim();
      if (formData.unit_kerja?.trim()) payload.unit_kerja = formData.unit_kerja.trim();

      if (formData.role === 'admin') {
        const accessCodes = divisionState.selectedDivisions.filter(code => code !== 'all');
        payload.data_access = accessCodes.length > 0 ? JSON.stringify(accessCodes) : '[]';
      } else {
        payload.data_access = '';
      }

      const response = await fetch(`${apiUrl}/superadmin/users/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(`Validasi gagal: ${errorMessages}`);
        }
        throw new Error(data.message || 'Gagal memperbarui pengguna');
      }

      if (!data.success) throw new Error(data.message || 'Gagal memperbarui pengguna');

      setFormState(prev => ({ ...prev, successMessage: 'Pengguna berhasil diperbarui!', updating: false }));
      await fetchUserDetail();
    } catch (err) {
      console.error('Update user error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui pengguna';
      setFormState(prev => ({ ...prev, error: errorMsg, updating: false }));
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.password) {
      setFormState(prev => ({ ...prev, error: 'Password tidak boleh kosong' }));
      return;
    }

    if (passwordData.password.length < 6) {
      setFormState(prev => ({ ...prev, error: 'Password minimal 6 karakter' }));
      return;
    }

    if (passwordData.password !== passwordData.password_confirmation) {
      setFormState(prev => ({ ...prev, error: 'Password dan konfirmasi password tidak cocok' }));
      return;
    }

    setFormState(prev => ({ ...prev, updating: true, error: null, successMessage: null }));

    try {
      const token = getAuthToken();

      if (!token) {
        setFormState(prev => ({ ...prev, error: 'Token tidak ditemukan. Silakan login kembali.', updating: false }));
        return;
      }

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/superadmin/users/${userId}/change-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: passwordData.password,
          password_confirmation: passwordData.password_confirmation
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Gagal mengubah password');
      }

      if (!data.success) throw new Error(data.message || 'Gagal mengubah password');

      setFormState(prev => ({ ...prev, successMessage: 'Password berhasil diubah!', updating: false }));
      setPasswordData({ password: '', password_confirmation: '' });
    } catch (err) {
      console.error('Change password error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Gagal mengubah password';
      setFormState(prev => ({ ...prev, error: errorMsg, updating: false }));
    }
  };

  const resetForm = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        divisi: user.divisi || '',
        unit_kerja: user.unit_kerja || ''
      });

      if (user.data_access) {
        const divisions = parseDataAccessToSelectedDivisions(user.data_access);
        setDivisionState(prev => ({ ...prev, selectedDivisions: divisions }));
      }

      const isCrsd = user.divisi === 'CRSD 1' || user.divisi === 'CRSD 2';
      setDivisionState(prev => ({
        ...prev,
        isCustomDivisi: !isCrsd && !!user.divisi,
        customDivisi: !isCrsd && !!user.divisi ? user.divisi : ''
      }));
    }
    setFormState(prev => ({ ...prev, error: null, successMessage: null }));
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return '-';
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'superadmin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'user': return 'Pengguna';
      default: return role;
    }
  };

  return {
    mounted,
    isAuthenticated,
    authData,
    user,
    formState,
    formData,
    divisionState,
    passwordData,
    showPassword,

    setShowPassword,

    handleInputChange,
    handleDivisiSelect,
    handleCustomDivisiChange,
    handlePasswordChange,
    handleDivisionToggle,
    handleSelectAllDivisions,
    handleClearAllDivisions,
    handleSubmit,
    handleChangePassword,
    resetForm,

    formatDate,
    getRoleLabel
  };
}