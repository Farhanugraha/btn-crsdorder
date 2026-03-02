import { NavigationItem } from '../types';

// ==================== PUBLIC NAVIGATION ====================
export const PUBLIC_NAV_ITEMS: NavigationItem[] = [
  {
    href: '/',
    label: 'Beranda',
    icon: 'Home',  
    roles: ['guest', 'user', 'admin', 'superadmin']
  },
  {
    href: '/areas',
    label: 'Pesan Makanan',
    icon: 'UtensilsCrossed',  
    roles: ['guest', 'user']
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: 'Mail',  
    roles: ['guest', 'user', 'admin', 'superadmin']
  },
  {
    href: '/about',
    label: 'About',
    icon: 'Info',  
    roles: ['guest', 'user', 'admin', 'superadmin']
  }
];

// ==================== USER NAVIGATION ====================
export const USER_NAV_ITEMS: NavigationItem[] = [
  {
    href: '/order',
    label: 'Pesanan Saya',
    icon: 'ShoppingCart',  
    condition: (user) => !!user
  }
];

// ==================== ADMIN NAVIGATION ====================
export const ADMIN_NAV_ITEMS: NavigationItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'Home',  
    roles: ['admin', 'superadmin']
  },
  {
    href: '/dashboard/orders',
    label: 'Pesanan',
    icon: 'Hourglass', 
    roles: ['admin', 'superadmin']
  },
  {
    href: '/dashboard/payments',
    label: 'Pembayaran',
    icon: 'CreditCard',
    roles: ['admin', 'superadmin']
  },
  {
    href: '/dashboard/statistics',
    label: 'Statistik',
    icon: 'PieChart',
    roles: ['admin', 'superadmin']
  },
  {
    href: '/dashboard/reports',
    label: 'Laporan',
    icon: 'FileText',
    roles: ['admin', 'superadmin']
  }
];

// ==================== SUPERADMIN NAVIGATION ====================
export const SUPERADMIN_NAV_ITEMS: NavigationItem[] = [
  {
    href: '/dashboard/user-management',
    label: 'Manajemen Pengguna',
    icon: 'Users',  
    roles: ['superadmin']
  },
  {
    href: '/dashboard/areas',
    label: 'Area',
    icon: 'MapPin', 
    roles: ['superadmin']
  },
  {
    href: '/dashboard/restaurants',
    label: 'Restaurant',
    icon: 'ChefHat',  
    roles: ['superadmin']
  },
  {
    href: '/dashboard/paymentsettings',
    label: 'Pengaturan Pembayaran',
    icon: 'Settings',  
    roles: ['superadmin']
  }
];

export const SUPERADMIN_MENU_ITEMS = SUPERADMIN_NAV_ITEMS;