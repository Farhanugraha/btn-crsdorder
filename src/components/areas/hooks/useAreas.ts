import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Area, SortBy } from '../types';

export const useAreas = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('restaurants');
  const [refreshing, setRefreshing] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/api/areas`);
      const result = await response.json();

      if (result.success) {
        const enhancedAreas = result.data.map((area: Area) => ({
          ...area,
          featured: area.restaurants_count > 0
        }));
        setAreas(enhancedAreas);
        setFilteredAreas(enhancedAreas);
      } else {
        setError('Gagal memuat data area');
        toast.error('Gagal memuat area');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi');
      toast.error('Tidak dapat terhubung ke server');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    let filtered = [...areas];

    if (searchQuery) {
      filtered = filtered.filter(
        (area) =>
          area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          area.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'restaurants':
          return b.restaurants_count - a.restaurants_count;
        default:
          return 0;
      }
    });

    setFilteredAreas(filtered);
  }, [areas, searchQuery, sortBy]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAreas();
  };

  const handleBack = () => {
    router.push('/');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    isLoading,
    areas,
    filteredAreas,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refreshing,
    handleRefresh,
    handleBack,
    clearSearch,
    fetchAreas
  };
};