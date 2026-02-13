import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, DashboardData } from '../types';

export const useAdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkAuth = () => {
      const token = typeof window !== 'undefined' ? localStorage?.getItem('auth_token') : null;
      const userData = typeof window !== 'undefined' ? localStorage?.getItem('auth_user') : null;

      if (!token || !userData) {
        router.push('/auth/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin' && parsedUser.role !== 'superadmin') {
        router.push('/areas');
        return;
      }

      setUser(parsedUser);
      setIsLoading(false);
      fetchDashboardData();
    };

    checkAuth();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage?.getItem('auth_token') : null;
      if (!token) return;

      const response = await fetch(`${apiUrl}/api/admin/dashboard`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  return {
    user,
    isLoading,
    dashboardData,
    isRefreshing,
    handleRefresh
  };
};