import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, DashboardData, Order } from '../types';

export const useAdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

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
    };

    checkAuth();
  }, [router]);

  const getTodayStats = useCallback((ordersData: Order[]) => {
    if (!ordersData.length) return { totalToday: 0, completedToday: 0, revenueToday: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = ordersData.filter(order => {
      const orderDate = new Date(order.created_at);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const totalToday = todayOrders.filter(
      order => order.status === 'paid'
    ).length;
    const completedToday = todayOrders.filter(
      order => order.order_status === 'completed' && order.status === 'paid'
    ).length;
    const revenueToday = todayOrders
      .filter(order => order.order_status === 'completed' && order.status === 'paid')
      .reduce((sum, order) => sum + (Number(order.total_price) || 0), 0);

    return { totalToday, completedToday, revenueToday };
  }, []);

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
          fetch(`${apiUrl}/api/admin/dashboard?crsd_type=general`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${apiUrl}/api/admin/orders?crsd_type=general`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const [dashboardJson, ordersJson] = await Promise.all([
          dashboardRes.json(),
          ordersRes.json()
        ]);

        let processedOrders: Order[] = [];
        if (ordersJson.success && ordersJson.data) {
          processedOrders = ordersJson.data.map((order: any) => ({
            ...order,
            total_price: typeof order.total_price === 'string' 
              ? parseInt(order.total_price) 
              : order.total_price
          }));
        }
        
        setOrders(processedOrders);

        const { totalToday, completedToday, revenueToday } = getTodayStats(processedOrders);

        if (dashboardJson.success && dashboardJson.data) {
          const dashboardWithStats = {
            ...dashboardJson.data,
            orders: {
              ...dashboardJson.data.orders,
              today: totalToday,
              completedToday: completedToday
            },
            payments: {
              ...dashboardJson.data.payments,
              today_revenue: revenueToday
            }
          };
          setDashboardData(dashboardWithStats);
        } else {
          const totalRevenue = processedOrders
            .filter(order => order.status === 'paid')
            .reduce((sum, order) => sum + (Number(order.total_price) || 0), 0);

          const pendingOrders = processedOrders.filter(order => order.status === 'pending').length;
          const processingOrders = processedOrders.filter(order => order.order_status === 'processing').length;
          const completedOrders = processedOrders.filter(
            order => order.order_status === 'completed' && order.status === 'paid'
          ).length;
          const canceledOrders = processedOrders.filter(
            order => order.order_status === 'canceled' || order.status === 'canceled'
          ).length;

          setDashboardData({
            orders: {
              total: processedOrders.length,
              pending: pendingOrders,
              processing: processingOrders,
              completed: completedOrders,
              canceled: canceledOrders,
              today: totalToday,
              completedToday: completedToday
            },
            payments: {
              total_revenue: totalRevenue,
              pending_payments: pendingOrders,
              today_revenue: revenueToday
            },
            users: {
              total_users: 0,
              total_admins: 0
            }
          });
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [user, apiUrl, router, getTodayStats]);

  useEffect(() => {
    if (dashboardData && orders.length > 0) {
      const { totalToday, completedToday, revenueToday } = getTodayStats(orders);
      
      const needsUpdate = 
        dashboardData.orders?.today !== totalToday ||
        dashboardData.orders?.completedToday !== completedToday ||
        dashboardData.payments?.today_revenue !== revenueToday;

      if (needsUpdate) {
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
  }, [orders, dashboardData, getTodayStats]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const [dashboardRes, ordersRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/dashboard?crsd_type=general`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/admin/orders?crsd_type=general`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const [dashboardJson, ordersJson] = await Promise.all([
        dashboardRes.json(),
        ordersRes.json()
      ]);

      if (ordersJson.success && ordersJson.data) {
        const processedOrders = ordersJson.data.map((order: any) => ({
          ...order,
          total_price: typeof order.total_price === 'string' 
            ? parseInt(order.total_price) 
            : order.total_price
        }));
        setOrders(processedOrders);
      }

      if (dashboardJson.success && dashboardJson.data) {
        setDashboardData(dashboardJson.data);
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