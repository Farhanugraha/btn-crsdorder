import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, DashboardData } from '../types';

export const useAdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // ============= CEK AUTH =============
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
    };

    checkAuth();
  }, [router]);

  // ============= FETCH ALL DATA PARALLEL =============
  useEffect(() => {
    if (!user) return;

    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const [dashboardRes, ordersRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${apiUrl}/api/admin/orders`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const [dashboardJson, ordersJson] = await Promise.all([
          dashboardRes.json(),
          ordersRes.json()
        ]);
        if (dashboardJson.success && dashboardJson.data) {
          setDashboardData(dashboardJson.data);
        }
        if (ordersJson.success && ordersJson.data) {
          const processedOrders = ordersJson.data.map((order: any) => ({
            ...order,
            total_price: typeof order.total_price === 'string' 
              ? parseInt(order.total_price) 
              : order.total_price
          }));
          setOrders(processedOrders);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // ✅ Langsung set loading false setelah semua selesai
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [user, apiUrl, router]);

  // ============= HITUNG STATISTIK HARI INI =============
  const getTodayStats = useCallback((ordersData: any[]) => {
    if (!ordersData.length) return { totalToday: 0, completedToday: 0, revenueToday: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = ordersData.filter(order => {
      const orderDate = new Date(order.created_at);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const totalToday = todayOrders.length;
    const completedToday = todayOrders.filter(
      order => order.order_status === 'completed' && order.status === 'paid'
    ).length;
    const revenueToday = todayOrders
      .filter(order => order.order_status === 'completed' && order.status === 'paid')
      .reduce((sum, order) => sum + (Number(order.total_price) || 0), 0);

    return { totalToday, completedToday, revenueToday };
  }, []);

  // ============= UPDATE DASHBOARD DENGAN STATISTIK HARI INI =============
  useEffect(() => {
    if (dashboardData && orders.length > 0) {
      const { totalToday, completedToday, revenueToday } = getTodayStats(orders);
      if (
        dashboardData.orders?.today !== totalToday ||
        dashboardData.orders?.completedToday !== completedToday ||
        dashboardData.payments?.today_revenue !== revenueToday
      ) {
        setDashboardData(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            orders: {
              ...prev.orders,
              today: totalToday,
              completedToday: completedToday
            },
            payments: {
              ...prev.payments,
              today_revenue: revenueToday
            }
          };
        });
      }
    }
  }, [dashboardData, orders, getTodayStats]);

  // ============= REFRESH =============
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const [dashboardRes, ordersRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const [dashboardJson, ordersJson] = await Promise.all([
        dashboardRes.json(),
        ordersRes.json()
      ]);

      if (dashboardJson.success && dashboardJson.data) {
        setDashboardData(dashboardJson.data);
      }

      if (ordersJson.success && ordersJson.data) {
        const processedOrders = ordersJson.data.map((order: any) => ({
          ...order,
          total_price: typeof order.total_price === 'string' 
            ? parseInt(order.total_price) 
            : order.total_price
        }));
        setOrders(processedOrders);
      }

    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [apiUrl]);

  return {
    user,
    isLoading,
    dashboardData,
    isRefreshing,
    handleRefresh
  };
};