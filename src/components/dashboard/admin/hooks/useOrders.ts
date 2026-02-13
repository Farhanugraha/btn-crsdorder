import { useState, useEffect } from 'react';
import type { Order, FilterStatus } from '../types';
import { filterOrdersByStatus, calculateRevenue } from '../utils/dashboardUtils';

export const useOrders = (initialStatus: FilterStatus = 'processing') => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(initialStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [lastWeekRevenue, setLastWeekRevenue] = useState(0);
  const [isCalculatingRevenue, setIsCalculatingRevenue] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const itemsPerPage = 4;

  useEffect(() => {
    fetchOrders(filterStatus);
    fetchAllOrdersForCalculation();
  }, []);

  const fetchOrders = async (status: string = 'processing') => {
    setIsLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage?.getItem('auth_token') : null;
      if (!token) return;

      const response = await fetch(`${apiUrl}/api/admin/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data) {
        const filteredOrders = filterOrdersByStatus(data.data, status);
        setOrders(filteredOrders);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllOrdersForCalculation = async () => {
    setIsCalculatingRevenue(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage?.getItem('auth_token') : null;
      if (!token) return;

      const response = await fetch(`${apiUrl}/api/admin/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAllOrders(data.data);
        
        // Calculate revenue
        const { weeklyRevenue: weekly, lastWeekRevenue: last } = calculateRevenue(data.data);
        setWeeklyRevenue(weekly);
        setLastWeekRevenue(last);
      }
    } catch (error) {
      console.error('Error fetching orders for calculation:', error);
    } finally {
      setIsCalculatingRevenue(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setFilterStatus(status as FilterStatus);
    fetchOrders(status);
  };

  const handleRefresh = async () => {
    await Promise.all([
      fetchOrders(filterStatus),
      fetchAllOrdersForCalculation()
    ]);
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  return {
    orders,
    allOrders,
    isLoading,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    weeklyRevenue,
    lastWeekRevenue,
    isCalculatingRevenue,
    paginatedOrders,
    totalPages,
    itemsPerPage,
    handleStatusChange,
    handleRefresh,
    fetchOrders
  };
};