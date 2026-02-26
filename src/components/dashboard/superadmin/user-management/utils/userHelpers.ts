import { User, FilterRole } from '../types';

export const getRoleColor = (role: string): string => {
  const colors = {
    superadmin: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200',
    admin: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-200',
    user: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-200'
  };
  return colors[role as keyof typeof colors] || colors.user;
};

export const getRoleLabel = (role: string): string => {
  const labels = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    user: 'User'
  };
  return labels[role as keyof typeof labels] || role;
};

export const getStatusColor = (isActive: boolean): string => {
  return isActive
    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200'
    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200';
};

export const getStatusLabel = (isActive: boolean): string => {
  return isActive ? 'Aktif' : 'Nonaktif';
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatPhoneNumber = (phone: string | null): string => {
  if (!phone) return '-';
  
  // Format: +62 xxx-xxxx-xxxx
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}`;
  }
  return phone;
};

export const filterUsers = (users: User[], filters: { search: string; role: FilterRole }): User[] => {
  return users.filter(user => {
    // Filter by role
    if (filters.role !== 'all' && user.role !== filters.role) {
      return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.includes(filters.search)) ||
        (user.divisi && user.divisi.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const paginateUsers = (users: User[], page: number, perPage: number): User[] => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return users.slice(start, end);
};

export const getPaginationNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = [];
  const maxVisible = 5;
  
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
  }
  
  return pages;
};