import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User } from '../types';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchUser = () => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');
      const expiresIn = localStorage.getItem('token_expires_in');

      if (expiresIn && Date.now() > Number(expiresIn)) {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_expires_in');
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expires_in');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_user' || e.key === 'auth_token' || e.key === null) {
        fetchUser();
      }
    };

    const handleAuthChange = () => fetchUser();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-changed', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      const token = localStorage.getItem('auth_token');

      if (token) {
        try {
          await fetch(`${apiUrl}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
        } catch (apiError) {
          console.error('Logout API error:', apiError);
        }
      }

      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expires_in');
      
      setUser(null);
      window.dispatchEvent(new Event('logout'));
      toast.success('Logout berhasil');
      router.push('/');
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ✅ FIX: Selalu return boolean, tidak pernah null
  const isAdmin = user ? (user.role === 'admin' || user.role === 'superadmin') : false;
  const isSuperAdmin = user ? user.role === 'superadmin' : false;

  const getDashboardLink = () => {
    if (isSuperAdmin) return '/dashboard/superadmin';
    if (user?.role === 'admin') return '/dashboard/admin';
    return '/';
  };

  return {
    user,
    isLoading,
    isLoggingOut,
    isAdmin,        
    isSuperAdmin,   
    getDashboardLink,
    logout,
    fetchUser
  };
};