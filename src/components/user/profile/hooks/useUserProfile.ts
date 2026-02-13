import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { User, ProfileFormData, ProfileErrors } from '../types';
import { getInitialFormData } from '../utils/profileUtils';

export const useUserProfile = (userId: string) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: '',
    divisi: '',
    unit_kerja: ''
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        const token = localStorage.getItem('auth_token');

        if (!storedUser || !token) {
          router.push('/auth/login');
          return;
        }

        const parsedUser = JSON.parse(storedUser) as User;

        if (parsedUser.id !== Number(userId)) {
          toast.error('Unauthorized');
          router.push('/auth/login');
          return;
        }

        setUser(parsedUser);
        setFormData(getInitialFormData(parsedUser));

        window.dispatchEvent(new Event('auth-changed'));
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [userId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: []
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Profil berhasil diperbarui');
        toast.success('Profil berhasil diperbarui');

        const updatedUser = { ...user, ...formData } as User;
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));

        window.dispatchEvent(new Event('auth-changed'));
        setIsEditing(false);

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        toast.error(data.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData(getInitialFormData(user));
    }
    setIsEditing(false);
    setErrors({});
  };

  const handleBack = () => {
    router.back();
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return {
    user,
    isLoading,
    isEditing,
    setIsEditing,
    isSaving,
    successMessage,
    setSuccessMessage,
    errors,
    formData,
    isAdmin,
    handleInputChange,
    handleSave,
    handleCancel,
    handleBack
  };
};