import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Area, Restaurant, FilterStatus } from '../types';

export const useAreaRestaurants = (areaId: string) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [area, setArea] = useState<Area | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/restaurants/area/${areaId}`);
      const result = await response.json();

      if (result.success) {
        setArea(result.data.area);
        setRestaurants(result.data.restaurants);
        setFilteredRestaurants(result.data.restaurants);
      } else {
        setError('Gagal memuat restoran');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [areaId]);

  const applyFilters = (query: string, status: FilterStatus) => {
    let filtered = restaurants;

    if (query.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase()) ||
          r.address.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status === 'open') {
      filtered = filtered.filter((r) => r.is_open);
    } else if (status === 'closed') {
      filtered = filtered.filter((r) => !r.is_open);
    }

    setFilteredRestaurants(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, filterStatus);
  };

  const handleStatusFilter = (status: FilterStatus) => {
    setFilterStatus(status);
    applyFilters(searchQuery, status);
  };

  const handleBack = () => {
    router.push('/areas');
  };

  const clearSearch = () => {
    setSearchQuery('');
    applyFilters('', filterStatus);
  };

  return {
    isLoading,
    area,
    restaurants,
    filteredRestaurants,
    searchQuery,
    filterStatus,
    error,
    handleSearch,
    handleStatusFilter,
    handleBack,
    clearSearch,
    fetchData
  };
};