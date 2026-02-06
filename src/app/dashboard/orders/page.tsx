'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Loader2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Building2,
  Download,
  User,
  Phone,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Copy,
  Hash,
  CalendarDays,
  Clock as ClockIcon,
  Store,
  Utensils,
  Package,
  FileText,
  Filter,
  ShoppingCart,
  PackageOpen,
  Truck,
  Ban,
  CheckSquare,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Interface definitions
interface Area {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

interface Restaurant {
  id: number;
  name: string;
  area_id: number;
  area?: Area;
}

interface Menu {
  id: number;
  name: string;
  restaurant_id: number;
  restaurant: Restaurant;
  price: string;
}

interface OrderItem {
  id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  menu: Menu;
}

interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number | null;
  total_price: string;
  status: string;
  order_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    divisi?: string;
  };
  items: OrderItem[];
  restaurant?: Restaurant;
  crsd_type?: 'crsd1' | 'crsd2';
  items_count?: number;
  area_name?: string;
  area_icon?: string;
  area?: Area;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Loading Screen dengan animasi yang lebih menarik
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <PackageOpen className="h-8 w-8 animate-pulse text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Memuat Pesanan
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Sedang mengambil data pesanan...
          </p>
        </div>
      </div>
    </div>
  );
}

// Empty State Component yang lebih menarik
function EmptyState({
  message,
  submessage,
  icon: Icon = Package,
  actionButton
}: {
  message: string;
  submessage?: string;
  icon?: any;
  actionButton?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white/50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <Icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {message}
      </h3>
      {submessage && (
        <p className="mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">
          {submessage}
        </p>
      )}
      {actionButton}
    </div>
  );
}

// StatusBadge component dengan design yang lebih clean
function StatusBadge({
  status,
  type,
  size = 'default'
}: {
  status: string;
  type: 'order' | 'payment';
  size?: 'small' | 'default';
}) {
  const base = `inline-flex items-center gap-1.5 rounded-full font-medium ${
    size === 'small' ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
  }`;

  const orderStyles: Record<
    string,
    { bg: string; text: string; icon: any; label: string }
  > = {
    pending: {
      bg: 'bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      icon: Clock,
      label: 'Menunggu'
    },
    processing: {
      bg: 'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: Package,
      label: 'Diproses'
    },
    completed: {
      bg: 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      icon: CheckSquare,
      label: 'Selesai'
    },
    canceled: {
      bg: 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      icon: Ban,
      label: 'Dibatalkan'
    }
  };

  const paymentStyles: Record<
    string,
    { bg: string; text: string; icon: any; label: string }
  > = {
    pending: {
      bg: 'bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      icon: Clock,
      label: 'Pending'
    },
    paid: {
      bg: 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      icon: CheckCircle,
      label: 'Dibayar'
    },
    canceled: {
      bg: 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      icon: XCircle,
      label: 'Batal'
    }
  };

  const config =
    type === 'order'
      ? orderStyles[status] || orderStyles.pending
      : paymentStyles[status] || paymentStyles.pending;
  const Icon = config.icon;

  return (
    <span className={`${base} ${config.bg} ${config.text}`}>
      <Icon
        className={size === 'small' ? 'h-3 w-3' : 'h-3.5 w-3.5'}
      />
      {config.label}
    </span>
  );
}

// Helper functions
const getOrderArea = (order: Order): Area | null => {
  if (order.restaurant?.area) return order.restaurant.area;
  if (order.area) return order.area;
  if (order.items?.[0]?.menu?.restaurant?.area)
    return order.items[0].menu.restaurant.area;
  return null;
};

const getOrderRestaurant = (order: Order): Restaurant | null => {
  if (order.restaurant) return order.restaurant;
  if (order.items?.[0]?.menu?.restaurant)
    return order.items[0].menu.restaurant;
  return null;
};

const extractActiveAreasFromOrders = (orders: Order[]): Area[] => {
  const areaMap = new Map<number, Area>();
  orders.forEach((order) => {
    if (
      order.order_status !== 'completed' &&
      order.order_status !== 'canceled'
    ) {
      const area = getOrderArea(order);
      if (area && !areaMap.has(area.id)) areaMap.set(area.id, area);
    }
  });
  return Array.from(areaMap.values());
};

const extractActiveRestaurantsFromOrders = (
  orders: Order[]
): Restaurant[] => {
  const restaurantMap = new Map<number, Restaurant>();
  orders.forEach((order) => {
    if (
      order.order_status !== 'completed' &&
      order.order_status !== 'canceled'
    ) {
      const restaurant = getOrderRestaurant(order);
      if (restaurant && !restaurantMap.has(restaurant.id))
        restaurantMap.set(restaurant.id, restaurant);
    }
  });
  return Array.from(restaurantMap.values());
};

// Quick Actions Component
function QuickActions({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      label: 'Detail Pesanan',
      icon: Eye,
      action: () =>
        window.open(`/dashboard/orders/${order.id}`, '_blank')
    },
    {
      label: 'Salin Kode',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(order.order_code);
        alert(`Kode order disalin: ${order.order_code}`);
      }
    },
    {
      label: 'Cetak Invoice',
      icon: FileText,
      action: () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Invoice ${order.order_code}</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  .invoice { max-width: 800px; margin: 0 auto; }
                  .header { text-align: center; margin-bottom: 30px; }
                  .info { margin-bottom: 20px; }
                  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                  .total { text-align: right; font-weight: bold; }
                </style>
              </head>
              <body>
                <div class="invoice">
                  <div class="header">
                    <h2>Invoice Order #${order.order_code}</h2>
                  </div>
                  <div class="info">
                    <p><strong>Pelanggan:</strong> ${
                      order.user.name
                    }</p>
                    <p><strong>Email:</strong> ${order.user.email}</p>
                    <p><strong>Telepon:</strong> ${
                      order.user.phone
                    }</p>
                    <p><strong>Tanggal:</strong> ${new Date(
                      order.created_at
                    ).toLocaleString('id-ID')}</p>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Harga</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${order.items
                        .map(
                          (item) => `
                        <tr>
                          <td>${item.menu.name}</td>
                          <td>${item.quantity}</td>
                          <td>Rp ${parseInt(
                            item.price
                          ).toLocaleString('id-ID')}</td>
                          <td>Rp ${(
                            parseInt(item.price) * item.quantity
                          ).toLocaleString('id-ID')}</td>
                        </tr>
                      `
                        )
                        .join('')}
                    </tbody>
                  </table>
                  <div class="total">
                    <h3>Total: Rp ${parseInt(
                      order.total_price
                    ).toLocaleString('id-ID')}</h3>
                  </div>
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// CRSD Badge Component
function CRSDBadge({ type }: { type: 'crsd1' | 'crsd2' | string }) {
  const styles = {
    crsd1: {
      bg: 'bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      label: 'CRSD 1'
    },
    crsd2: {
      bg: 'bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800',
      text: 'text-indigo-700 dark:text-indigo-300',
      label: 'CRSD 2'
    }
  };

  const style = styles[type as keyof typeof styles] || styles.crsd1;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
    >
      <Building2 className="h-3 w-3" />
      {style.label}
    </span>
  );
}

// Restaurant Badge Component
function RestaurantBadge({ order }: { order: Order }) {
  const restaurant = getOrderRestaurant(order);

  if (!restaurant) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
        <Store className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {restaurant.name}
      </span>
    </div>
  );
}

export default function CompactOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [restaurantFilter, setRestaurantFilter] =
    useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(
    null
  );
  const [crsdFilter, setCrsdFilter] = useState<string>('all');
  const [userRole, setUserRole] = useState<string>('');

  const perPage = 10;

  useEffect(() => {
    fetchUserInfo();
    fetchOrders();
  }, []);

  const fetchUserInfo = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role || '');
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  const getOrdersEndpoint = () => {
    if (userRole === 'superadmin') {
      if (crsdFilter === 'crsd1')
        return `${apiUrl}/api/admin/crsd1/orders`;
      if (crsdFilter === 'crsd2')
        return `${apiUrl}/api/admin/crsd2/orders`;
      return `${apiUrl}/api/admin/orders`;
    }
    if (crsdFilter === 'crsd1')
      return `${apiUrl}/api/admin/crsd1/orders`;
    if (crsdFilter === 'crsd2')
      return `${apiUrl}/api/admin/crsd2/orders`;
    return `${apiUrl}/api/admin/orders`;
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage?.getItem('auth_token');
      if (!token) {
        setError(
          'Token tidak ditemukan. Silakan login terlebih dahulu.'
        );
        setLoading(false);
        return;
      }

      const endpoint = getOrdersEndpoint();
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok)
        throw new Error(`Gagal mengambil data: ${res.status}`);

      const data = await res.json();

      if (data.success && data.data) {
        let ordersData = data.data;
        if (data.data.data) {
          ordersData = data.data.data;
        }

        const processedOrders = ordersData.map((order: any) => {
          let crsd_type: 'crsd1' | 'crsd2' | undefined = undefined;

          if (endpoint.includes('crsd1')) crsd_type = 'crsd1';
          else if (endpoint.includes('crsd2')) crsd_type = 'crsd2';
          else if (order.user?.divisi === 'CRSD 2')
            crsd_type = 'crsd2';
          else if (order.user?.divisi === 'CRSD 1')
            crsd_type = 'crsd1';
          else if (order.crsd_type) crsd_type = order.crsd_type;

          return {
            ...order,
            crsd_type,
            items_count: order.items?.length || 0
          };
        });

        setOrders(processedOrders);

        const activeOrders = processedOrders.filter(
          (order: Order) =>
            order.order_status !== 'completed' &&
            order.order_status !== 'canceled'
        );

        setAreas(extractActiveAreasFromOrders(activeOrders));
        setRestaurants(
          extractActiveRestaurantsFromOrders(activeOrders)
        );
      } else {
        throw new Error(
          data.message || 'Gagal mengambil data pesanan'
        );
      }
      setPage(1);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
  };

  const handleExportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredOrders.map((order) => {
          const restaurant = getOrderRestaurant(order);
          const area = getOrderArea(order);
          return {
            'Kode Order': order.order_code,
            Pelanggan: order.user.name,
            Email: order.user.email,
            Telepon: order.user.phone,
            'Divisi CRSD': order.user.divisi || '-',
            Restoran: restaurant?.name || '-',
            Area: area?.name || '-',
            'Status Order': order.order_status,
            'Status Pembayaran': order.status,
            Total: order.total_price,
            'Jumlah Item': order.items.length,
            Tanggal: new Date(order.created_at).toLocaleDateString(
              'id-ID'
            )
          };
        })
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
      XLSX.writeFile(workbook, `orders_${dateFilter}.xlsx`);
    } catch (err) {
      alert('Gagal mengexport data');
    }
  };

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const hasContent =
        order.order_code
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.user.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.user.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.user.phone
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.items?.some(
          (item) =>
            item.menu?.name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            item.menu?.restaurant?.name
              .toLowerCase()
              .includes(search.toLowerCase())
        );

      const matchesStatus =
        statusFilter === 'all' || order.order_status === statusFilter;

      let matchesArea = true;
      if (
        areaFilter !== 'all' &&
        statusFilter !== 'completed' &&
        statusFilter !== 'canceled'
      ) {
        const area = getOrderArea(order);
        matchesArea = area?.id.toString() === areaFilter;
      }

      let matchesRestaurant = true;
      if (
        restaurantFilter !== 'all' &&
        statusFilter !== 'completed' &&
        statusFilter !== 'canceled'
      ) {
        const restaurant = getOrderRestaurant(order);
        matchesRestaurant =
          restaurant?.id.toString() === restaurantFilter;
      }

      const orderDate = new Date(order.created_at)
        .toISOString()
        .split('T')[0];
      const matchesDate = orderDate === dateFilter;

      const matchesCRSD =
        crsdFilter === 'all' || order.crsd_type === crsdFilter;

      return (
        hasContent &&
        matchesStatus &&
        matchesArea &&
        matchesRestaurant &&
        matchesDate &&
        matchesCRSD
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    areaFilter,
    restaurantFilter,
    dateFilter,
    crsdFilter
  ]);

  const pages = Math.ceil(filteredOrders.length / perPage);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const statusOptions = [
    {
      value: 'all',
      label: 'Semua',
      icon: Filter,
      count: orders.length
    },
    {
      value: 'pending',
      label: 'Menunggu',
      icon: Clock,
      count: orders.filter((o) => o.order_status === 'pending').length
    },
    {
      value: 'processing',
      label: 'Diproses',
      icon: Package,
      count: orders.filter((o) => o.order_status === 'processing')
        .length
    },
    {
      value: 'completed',
      label: 'Selesai',
      icon: CheckSquare,
      count: orders.filter((o) => o.order_status === 'completed')
        .length
    },
    {
      value: 'canceled',
      label: 'Dibatalkan',
      icon: Ban,
      count: orders.filter((o) => o.order_status === 'canceled')
        .length
    }
  ];

  const crsdOptions = [
    { value: 'all', label: 'Semua CRSD', icon: Building2 },
    { value: 'crsd1', label: 'CRSD 1', icon: Building2 },
    { value: 'crsd2', label: 'CRSD 2', icon: Building2 }
  ];

  const getAreaOrderCount = (areaId: number) => {
    return orders.filter((order) => {
      const area = getOrderArea(order);
      return (
        area?.id === areaId &&
        order.order_status !== 'completed' &&
        order.order_status !== 'canceled'
      );
    }).length;
  };

  const getRestaurantOrderCount = (restaurantId: number) => {
    return orders.filter((order) => {
      const restaurant = getOrderRestaurant(order);
      return (
        restaurant?.id === restaurantId &&
        order.order_status !== 'completed' &&
        order.order_status !== 'canceled'
      );
    }).length;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Kelola Pesanan
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Pantau dan kelola semua pesanan pelanggan
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportExcel}
                disabled={filteredOrders.length === 0}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Excel</span>
                <span className="inline sm:hidden">Export</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
                <span className="hidden sm:inline">Refresh</span>
                <span className="inline sm:hidden">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="animate-fade-in mb-6 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-4 shadow-sm dark:border-red-800 dark:from-red-900/20 dark:to-red-900/10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-800 dark:text-red-300">
                  {error}
                </p>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Silakan coba refresh halaman atau hubungi
                  administrator
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {statusOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`cursor-pointer rounded-xl border p-4 transition-all hover:scale-[1.02] ${
                statusFilter === option.value
                  ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg shadow-blue-500/10 dark:border-blue-700 dark:from-blue-900/30 dark:to-blue-800/20'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <option.icon
                    className={`h-5 w-5 ${
                      option.value === 'pending'
                        ? 'text-amber-500'
                        : option.value === 'processing'
                          ? 'text-blue-500'
                          : option.value === 'completed'
                            ? 'text-green-500'
                            : option.value === 'canceled'
                              ? 'text-red-500'
                              : 'text-gray-500'
                    }`}
                  />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {option.count}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {option.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Search and Date */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cari Pesanan
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari kode order, nama, atau restoran..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setPage(1);
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* CRSD Filter */}
          {(userRole === 'superadmin' || userRole === 'admin') && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter CRSD
              </label>
              <div className="flex flex-wrap gap-2">
                {crsdOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setCrsdFilter(option.value);
                      setPage(1);
                      setTimeout(fetchOrders, 100);
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      crsdFilter === option.value
                        ? option.value === 'crsd1'
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : option.value === 'crsd2'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Area & Restaurant Filters - Only for active orders */}
          {(statusFilter === 'all' ||
            statusFilter === 'pending' ||
            statusFilter === 'processing') && (
            <div className="grid gap-4 sm:grid-cols-2">
              {areas.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter Area
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setAreaFilter('all')}
                      className={`rounded-lg px-3 py-1.5 text-sm ${
                        areaFilter === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Semua Area
                    </button>
                    {areas.map((area) => {
                      const count = getAreaOrderCount(area.id);
                      return (
                        <button
                          key={area.id}
                          onClick={() =>
                            setAreaFilter(area.id.toString())
                          }
                          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all ${
                            areaFilter === area.id.toString()
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span>{area.icon || '📍'}</span>
                          <span>{area.name}</span>
                          {count > 0 && (
                            <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {restaurants.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter Restoran
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setRestaurantFilter('all')}
                      className={`rounded-lg px-3 py-1.5 text-sm ${
                        restaurantFilter === 'all'
                          ? 'bg-green-600 text-white'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Semua Restoran
                    </button>
                    {restaurants.slice(0, 5).map((restaurant) => {
                      const count = getRestaurantOrderCount(
                        restaurant.id
                      );
                      return (
                        <button
                          key={restaurant.id}
                          onClick={() =>
                            setRestaurantFilter(
                              restaurant.id.toString()
                            )
                          }
                          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all ${
                            restaurantFilter ===
                            restaurant.id.toString()
                              ? 'bg-green-600 text-white'
                              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Store className="h-3.5 w-3.5" />
                          <span className="truncate">
                            {restaurant.name}
                          </span>
                          {count > 0 && (
                            <span className="ml-1 rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {filteredOrders.length}
            </span>{' '}
            pesanan
            {statusFilter !== 'all' && (
              <span className="ml-2">
                dengan status{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {
                    statusOptions.find(
                      (s) => s.value === statusFilter
                    )?.label
                  }
                </span>
              </span>
            )}
          </div>
          {pages > 1 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Halaman <span className="font-semibold">{page}</span>{' '}
              dari <span className="font-semibold">{pages}</span>
            </div>
          )}
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <>
            <div className="shadow-s hidden overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 sm:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Order
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Pelanggan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Restoran & Area
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {paginatedOrders.map((order) => {
                      const area = getOrderArea(order);
                      return (
                        <>
                          <tr
                            key={order.id}
                            className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                          >
                            {/* Order Column - DIKECILKAN */}
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                                    <Hash className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                                      {order.order_code}
                                    </p>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                      <CalendarDays className="h-3 w-3" />
                                      {new Date(
                                        order.created_at
                                      ).toLocaleDateString('id-ID')}
                                    </div>
                                  </div>
                                </div>
                                {order.crsd_type && (
                                  <div className="pt-1">
                                    <CRSDBadge
                                      type={order.crsd_type}
                                    />
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Customer Column - DIKECILKAN */}
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {order.user.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5 pl-5 text-xs text-gray-600 dark:text-gray-400">
                                  <Phone className="h-3 w-3" />
                                  {order.user.phone}
                                </div>
                              </div>
                            </td>

                            {/* Restaurant & Area Column - DIKECILKAN */}
                            <td className="px-4 py-3">
                              <div className="space-y-2">
                                <RestaurantBadge order={order} />
                                {area && (
                                  <div className="flex items-center gap-1.5 pl-5">
                                    <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {area.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Status Column - DIKECILKAN */}
                            <td className="px-4 py-3">
                              <div className="space-y-2">
                                <div className="flex">
                                  <StatusBadge
                                    status={order.order_status}
                                    type="order"
                                  />
                                </div>
                                <div className="flex">
                                  <StatusBadge
                                    status={order.status}
                                    type="payment"
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Total Column - DIKECILKAN */}
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                  Rp{' '}
                                  {parseInt(
                                    order.total_price
                                  ).toLocaleString('id-ID')}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                  {order.items?.length || 0} item
                                </p>
                              </div>
                            </td>

                            {/* Actions Column */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`/dashboard/orders/${order.id}`}
                                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Detail
                                </a>
                                <button
                                  onClick={() =>
                                    setExpandedOrder(
                                      expandedOrder === order.id
                                        ? null
                                        : order.id
                                    )
                                  }
                                  className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  {expandedOrder === order.id ? (
                                    <ChevronUp className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                                  ) : (
                                    <ChevronDown className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                                  )}
                                </button>
                                <QuickActions order={order} />
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Detail Row - DIKECILKAN */}
                          {expandedOrder === order.id && (
                            <tr className="bg-gray-50/30 dark:bg-gray-800/30">
                              <td colSpan={6} className="px-4 py-3">
                                <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                                  <div className="mb-2 flex items-center justify-between">
                                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                                      Detail Items (
                                      {order.items.length})
                                    </h4>
                                    <button
                                      onClick={() =>
                                        setExpandedOrder(null)
                                      }
                                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    >
                                      Tutup
                                    </button>
                                  </div>
                                  <div className="space-y-2">
                                    {order.items.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded border border-gray-100 p-2 dark:border-gray-700"
                                      >
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-900/20">
                                              <Utensils className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {item.menu.name}
                                              </p>
                                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {item.menu.restaurant
                                                  ?.name || '-'}
                                              </p>
                                            </div>
                                          </div>
                                          {item.notes && (
                                            <p className="mt-1 pl-8 text-xs text-amber-600 dark:text-amber-400">
                                              📝 {item.notes}
                                            </p>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            Rp{' '}
                                            {parseInt(
                                              item.price
                                            ).toLocaleString('id-ID')}
                                          </p>
                                          <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {item.quantity} × Rp{' '}
                                            {parseInt(
                                              item.price
                                            ).toLocaleString('id-ID')}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  {order.notes && (
                                    <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-900/20">
                                      <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                                        Catatan Pesanan:
                                      </p>
                                      <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                                        {order.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-2 sm:hidden">
              {paginatedOrders.map((order) => {
                const area = getOrderArea(order);
                return (
                  <div
                    key={order.id}
                    className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="p-3">
                      {/* Header - DIKECILKAN */}
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                            <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {order.order_code}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                              <CalendarDays className="h-3 w-3" />
                              {new Date(
                                order.created_at
                              ).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {order.crsd_type && (
                            <div className="hidden sm:block">
                              <CRSDBadge type={order.crsd_type} />
                            </div>
                          )}
                          <button
                            onClick={() =>
                              setExpandedOrder(
                                expandedOrder === order.id
                                  ? null
                                  : order.id
                              )
                            }
                            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {expandedOrder === order.id ? (
                              <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Status Badges - DIKECILKAN */}
                      <div className="mb-2 flex flex-wrap items-center gap-1">
                        <StatusBadge
                          status={order.order_status}
                          type="order"
                          size="small"
                        />
                        <StatusBadge
                          status={order.status}
                          type="payment"
                          size="small"
                        />
                        {order.crsd_type && (
                          <div className="sm:hidden">
                            <CRSDBadge type={order.crsd_type} />
                          </div>
                        )}
                      </div>

                      {/* Customer - DIKECILKAN */}
                      <div className="mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {order.user.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {order.user.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Restaurant & Area - DIKECILKAN */}
                      <div className="mb-2 space-y-1.5">
                        <RestaurantBadge order={order} />
                        {area && (
                          <div className="flex items-center gap-1.5 pl-5">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {area.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Total & Info - DIKECILKAN */}
                      <div className="mb-2 flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">
                            Rp{' '}
                            {parseInt(
                              order.total_price
                            ).toLocaleString('id-ID')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {order.items?.length || 0} item
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3" />
                          {new Date(
                            order.created_at
                          ).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>

                      {/* Actions*/}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                        <a
                          href={`/dashboard/orders/${order.id}`}
                          className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Detail
                        </a>
                        <div className="flex items-center gap-1">
                          <QuickActions order={order} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedOrder === order.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
                        <div className="mb-2">
                          <div className="mb-2 flex items-center justify-between">
                            <h5 className="text-xs font-semibold text-gray-900 dark:text-white">
                              Detail Items ({order.items.length})
                            </h5>
                            <button
                              onClick={() => setExpandedOrder(null)}
                              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              Tutup
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {order.items.slice(0, 3).map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between rounded border border-gray-100 bg-white p-1.5 dark:border-gray-700 dark:bg-gray-800"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-900/20">
                                      <Utensils className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                                        {item.menu.name}
                                      </p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {item.menu.restaurant?.name}
                                      </p>
                                    </div>
                                  </div>
                                  {item.notes && (
                                    <p className="mt-1 pl-7 text-xs text-amber-600 dark:text-amber-400">
                                      📝 {item.notes}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                                    {item.quantity} × Rp{' '}
                                    {parseInt(
                                      item.price
                                    ).toLocaleString('id-ID')}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                +{order.items.length - 3} item lainnya
                              </p>
                            )}
                          </div>
                        </div>
                        {order.notes && (
                          <div className="rounded border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-900/20">
                            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                              Catatan:
                            </p>
                            <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                              {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <EmptyState
            message="Tidak Ada Pesanan Ditemukan"
            submessage={`Tidak ada pesanan yang sesuai dengan filter yang Anda pilih. ${
              statusFilter !== 'all' ||
              search ||
              areaFilter !== 'all' ||
              restaurantFilter !== 'all'
                ? 'Coba ubah filter atau kata kunci pencarian.'
                : 'Belum ada pesanan yang tercatat.'
            }`}
            icon={Package}
            actionButton={
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setAreaFilter('all');
                  setRestaurantFilter('all');
                  setCrsdFilter('all');
                  setDateFilter(
                    new Date().toISOString().split('T')[0]
                  );
                  fetchOrders();
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Reset Semua Filter
              </button>
            }
          />
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan {(page - 1) * perPage + 1} -{' '}
              {Math.min(page * perPage, filteredOrders.length)} dari{' '}
              {filteredOrders.length} pesanan
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pages) },
                  (_, i) => {
                    let pageNum;
                    if (pages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= pages - 2)
                      pageNum = pages - 4 + i;
                    else pageNum = page - 2 + i;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`h-8 w-8 rounded-lg text-sm font-medium ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pages}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
