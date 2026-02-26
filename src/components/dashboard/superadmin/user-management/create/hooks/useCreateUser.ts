import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type {
  AuthData,
  CreateUserData,
  DataTypeOption,
  FormState,
  PasswordState,
  DivisionState,
  DataAccessState
} from '../types';

export function useCreateUser() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);

  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    successMessage: null
  });

  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: 'user',
    divisi: '',
    unit_kerja: '',
    data_access: []
  });

  const [passwordState, setPasswordState] = useState<PasswordState>({
    showPassword: false,
    showConfirmPassword: false
  });

  const [divisionState, setDivisionState] = useState<DivisionState>({
    showCustomInput: false,
    customDivisi: ''
  });

  const [dataAccessState, setDataAccessState] =
    useState<DataAccessState>({
      selectedDataTypes: [],
      showDropdown: false,
      loadingDataTypes: false,
      dataTypeOptions: []
    });

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
    if (envUrl) return `${envUrl}/api`;
    return 'http://localhost:8000/api';
  };

  useEffect(() => {
    setMounted(true);
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (formData.role === 'admin' && dataAccessState.dataTypeOptions.length === 0) {
      fetchDataTypes();
    }

    if (formData.role !== 'admin') {
      setDataAccessState(prev => ({
        ...prev,
        selectedDataTypes: []
      }));
      setFormData(prev => ({ ...prev, data_access: [] }));
    }
  }, [formData.role]);

  // PERBAIKAN: Effect untuk sync divisi - hanya untuk inisialisasi
  useEffect(() => {
    // Hanya jalan saat pertama kali atau reset
    if (formData.divisi === 'Other') {
      setDivisionState(prev => ({
        ...prev,
        showCustomInput: true,
        customDivisi: ''
      }));
    } else if (formData.divisi && formData.divisi !== 'CRSD 1' && formData.divisi !== 'CRSD 2') {
      // Jika divisi adalah custom (bukan CRSD 1/2 dan bukan 'Other')
      setDivisionState(prev => ({
        ...prev,
        showCustomInput: true,
        customDivisi: formData.divisi
      }));
    } else {
      setDivisionState(prev => ({
        ...prev,
        showCustomInput: false,
        customDivisi: ''
      }));
    }
  }, []); // Hanya sekali saat mount

  const checkAuthentication = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');

      if (!token || !userStr) {
        setIsAuthenticated(false);
        setAuthData(null);
        setFormState(prev => ({
          ...prev,
          error: 'Silakan login terlebih dahulu'
        }));

        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
        return;
      }

      const userData = JSON.parse(userStr);

      if (userData.role !== 'superadmin') {
        setIsAuthenticated(false);
        setAuthData(null);
        setFormState(prev => ({
          ...prev,
          error: 'Hanya superadmin yang dapat mengakses halaman ini'
        }));

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
        return;
      }

      setAuthData({
        token,
        user: userData
      });
      setIsAuthenticated(true);
      setFormState(prev => ({ ...prev, error: null }));
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setAuthData(null);
      setFormState(prev => ({
        ...prev,
        error: 'Terjadi kesalahan pada autentikasi'
      }));

      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  }, [router]);

  const fetchDataTypes = async () => {
    setDataAccessState(prev => ({ ...prev, loadingDataTypes: true }));
    try {
      const token = getAuthToken();
      if (!token) return;

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/superadmin/data-types`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setDataAccessState(prev => ({
            ...prev,
            dataTypeOptions: data.data
          }));
        } else {
          setDefaultDataTypeOptions();
        }
      } else {
        setDefaultDataTypeOptions();
      }
    } catch (error) {
      console.error('Error fetching data types:', error);
      setDefaultDataTypeOptions();
    } finally {
      setDataAccessState(prev => ({ ...prev, loadingDataTypes: false }));
    }
  };

  const setDefaultDataTypeOptions = () => {
    const defaultOptions = [
      {
        value: 'crsd1',
        label: 'CRSD 1',
        description: 'Collection Resources and Asset Sales Data 1'
      },
      {
        value: 'crsd2',
        label: 'CRSD 2',
        description: 'Collection Resources and Asset Sales Data 2'
      }
    ];
    setDataAccessState(prev => ({
      ...prev,
      dataTypeOptions: defaultOptions
    }));
  };

  // PERBAIKAN: Handler untuk input biasa (text, email, dll)
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // PERBAIKAN: Handler khusus untuk select divisi
  const handleDivisiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    
    if (selectedValue === 'Other') {
      // Pilih "Lainnya"
      setDivisionState(prev => ({
        ...prev,
        showCustomInput: true,
        customDivisi: ''
      }));
      setFormData(prev => ({
        ...prev,
        divisi: '' // Kosongkan dulu
      }));
    } else {
      // Pilih CRSD 1 atau CRSD 2
      setDivisionState(prev => ({
        ...prev,
        showCustomInput: false,
        customDivisi: ''
      }));
      setFormData(prev => ({
        ...prev,
        divisi: selectedValue
      }));
    }
  };

  // PERBAIKAN: Handler untuk input custom divisi
  const handleCustomDivisiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update divisionState
    setDivisionState(prev => ({
      ...prev,
      customDivisi: value
    }));
    
    // Update formData.divisi dengan nilai yang sama
    setFormData(prev => ({
      ...prev,
      divisi: value
    }));
  };

  const handleDataTypeToggle = (dataType: string) => {
    setDataAccessState(prev => {
      let newSelectedDataTypes: string[];

      if (dataType === 'both') {
        if (prev.selectedDataTypes.length === 2) {
          newSelectedDataTypes = [];
        } else {
          newSelectedDataTypes = ['crsd1', 'crsd2'];
        }
      } else {
        if (prev.selectedDataTypes.includes(dataType)) {
          newSelectedDataTypes = prev.selectedDataTypes.filter(
            type => type !== dataType
          );
        } else {
          newSelectedDataTypes = [...prev.selectedDataTypes, dataType];
        }
      }

      // Update formData
      setFormData(prevForm => ({
        ...prevForm,
        data_access: newSelectedDataTypes
      }));

      return {
        ...prev,
        selectedDataTypes: newSelectedDataTypes
      };
    });
  };

  const handleRemoveDataType = (dataType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleDataTypeToggle(dataType);
  };

  const toggleShowDropdown = () => {
    setDataAccessState(prev => ({
      ...prev,
      showDropdown: !prev.showDropdown
    }));
  };

  const closeDropdown = () => {
    setDataAccessState(prev => ({
      ...prev,
      showDropdown: false
    }));
  };

  const handleRoleChange = (role: 'user' | 'admin' | 'superadmin') => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const toggleShowPassword = () => {
    setPasswordState(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const toggleShowConfirmPassword = () => {
    setPasswordState(prev => ({
      ...prev,
      showConfirmPassword: !prev.showConfirmPassword
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setFormState(prev => ({ ...prev, error: 'Nama, email, dan password wajib diisi' }));
      return;
    }

    if (formData.password.length < 6) {
      setFormState(prev => ({ ...prev, error: 'Password minimal 6 karakter' }));
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setFormState(prev => ({ ...prev, error: 'Password dan konfirmasi password tidak cocok' }));
      return;
    }

    if (
      formData.role === 'admin' &&
      (!formData.data_access || formData.data_access.length === 0)
    ) {
      setFormState(prev => ({
        ...prev,
        error: 'Data access wajib dipilih untuk role admin'
      }));
      return;
    }

    setFormState(prev => ({ ...prev, loading: true, error: null, successMessage: null }));

    try {
      const token = getAuthToken();

      if (!token) {
        setFormState(prev => ({
          ...prev,
          error: 'Token tidak ditemukan. Silakan login kembali.',
          loading: false
        }));
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users`;

      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone || null,
        role: formData.role,
        divisi: formData.divisi || null,
        unit_kerja: formData.unit_kerja || null
      };

      if (
        formData.role === 'admin' &&
        formData.data_access &&
        formData.data_access.length > 0
      ) {
        payload.data_access = formData.data_access;
      }

      const response = await fetch(url, {
        method: 'POST',
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
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Gagal membuat pengguna');
      }

      if (!data.success) {
        throw new Error(data.message || 'Gagal membuat pengguna');
      }

      setFormState(prev => ({
        ...prev,
        successMessage: data.message || 'Pengguna berhasil dibuat!',
        loading: false
      }));

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        role: 'user',
        divisi: '',
        unit_kerja: '',
        data_access: []
      });
      
      setDivisionState({
        showCustomInput: false,
        customDivisi: ''
      });

      setDataAccessState(prev => ({
        ...prev,
        selectedDataTypes: []
      }));

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/user-management');
      }, 2000);
    } catch (err) {
      console.error('Create user error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat pengguna';
      setFormState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      role: 'user',
      divisi: '',
      unit_kerja: '',
      data_access: []
    });
    setDivisionState({
      showCustomInput: false,
      customDivisi: ''
    });
    setDataAccessState(prev => ({
      ...prev,
      selectedDataTypes: []
    }));
    setFormState(prev => ({
      ...prev,
      error: null,
      successMessage: null
    }));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'superadmin';
      case 'admin':
        return 'admin';
      case 'user':
        return 'user';
      default:
        return 'default';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Akses penuh ke semua fitur sistem';
      case 'admin':
        return 'Akses terbatas sesuai data yang diizinkan';
      case 'user':
        return 'Akses terbatas untuk penggunaan biasa';
      default:
        return '';
    }
  };

  const getSelectedDataTypesDisplay = () => {
    const { selectedDataTypes, dataTypeOptions } = dataAccessState;
    
    if (selectedDataTypes.length === 0) {
      return [];
    }

    if (selectedDataTypes.length === 2) {
      return [
        ...dataTypeOptions.filter(opt => selectedDataTypes.includes(opt.value)),
        {
          value: 'both',
          label: 'All Access',
          description: 'Akses ke semua data (CRSD 1 dan 2)'
        }
      ];
    }

    return dataTypeOptions.filter(opt => selectedDataTypes.includes(opt.value));
  };

  return {
    // State
    mounted,
    isAuthenticated,
    authData,
    formState,
    formData,
    passwordState,
    divisionState,
    dataAccessState,

    // Handlers
    handleInputChange,
    handleDivisiSelect,        // PERBAIKAN: Tambahkan handler khusus
    handleCustomDivisiChange,
    handleDataTypeToggle,
    handleRemoveDataType,
    toggleShowDropdown,
    closeDropdown,
    handleRoleChange,
    toggleShowPassword,
    toggleShowConfirmPassword,
    handleSubmit,
    resetForm,

    // Helpers
    getRoleIcon,
    getRoleDescription,
    getSelectedDataTypesDisplay
  };
}