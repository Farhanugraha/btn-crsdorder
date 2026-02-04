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
  FileText,
  ExternalLink,
  Filter
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Interface definitions
interface Area {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

interface OrderItem {
  id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  menu: {
    id: number;
    name: string;
    restaurant_id: number;
    restaurant: {
      id: number;
      name: string;
      area_id: number;
      area: Area;
    };
  };
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
  };
  items: OrderItem[];
  areas: Area[];
  crsd_type?: 'crsd1' | 'crsd2'; // Tambahkan field untuk CRSD type
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// StatusBadge component
function StatusBadge({
  status,
  type,
  size = 'default'
}: {
  status: string;
  type: 'order' | 'payment';
  size?: 'small' | 'default';
}) {
  const base = `inline-flex items-center gap-1 rounded-full font-bold uppercase ${
    size === 'small'
      ? 'px-2 py-0.5 text-[10px]'
      : 'px-2.5 py-1 text-xs'
  }`;

  const orderStyles: Record<
    string,
    { bg: string; text: string; icon: any; label: string }
  > = {
    processing: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      icon: Clock,
      label: 'Menunggu'
    },
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      icon: CheckCircle,
      label: 'Selesai'
    },
    canceled: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      icon: XCircle,
      label: 'Dibatalkan'
    },
    pending: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-300',
      icon: Clock,
      label: 'Pending'
    }
  };

  const paymentStyles: Record<
    string,
    { bg: string; text: string; icon: any; label: string }
  > = {
    pending: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-300',
      icon: Clock,
      label: 'Pending'
    },
    paid: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      icon: CheckCircle,
      label: 'Dibayar'
    },
    canceled: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      icon: XCircle,
      label: 'Dibatalkan'
    },
    failed: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      icon: XCircle,
      label: 'Gagal'
    }
  };

  const config =
    type === 'order'
      ? orderStyles[status] || orderStyles.canceled
      : paymentStyles[status] || paymentStyles.canceled;
  const Icon = config.icon;

  return (
    <span className={`${base} ${config.bg} ${config.text}`}>
      <Icon
        className={size === 'small' ? 'h-2.5 w-2.5' : 'h-3 w-3'}
      />
      {config.label}
    </span>
  );
}

// Loading component
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
      <div className="relative">
        <Loader2 className="h-14 w-14 animate-spin text-blue-600 dark:text-blue-400" />
        <div className="absolute inset-0 -z-10 rounded-full bg-blue-50 blur-sm dark:bg-blue-900/10"></div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
          Memuat halaman
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Harap tunggu sebentar...
        </p>
      </div>
    </div>
  );
}

// Quick Action Menu component - Mobile & Desktop
function QuickActions({
  order,
  isMobile = false
}: {
  order: Order;
  isMobile?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      label: 'Detail Pesanan',
      icon: Eye,
      action: () =>
        window.open(`/dashboard/orders/${order.id}`, '_blank')
    },
    {
      label: 'Salin Kode Order',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(order.order_code);
        alert('Kode order disalin: ' + order.order_code);
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

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          <MoreVertical className="h-3.5 w-3.5" />
          <span>Aksi</span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <action.icon className="h-3.5 w-3.5" />
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
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-800 dark:text-purple-300',
      label: 'CRSD 1'
    },
    crsd2: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-800 dark:text-indigo-300',
      label: 'CRSD 2'
    }
  };

  const style = styles[type as keyof typeof styles] || styles.crsd1;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase ${style.bg} ${style.text}`}
    >
      <Building2 className="h-3 w-3" />
      {style.label}
    </span>
  );
}

export default function CompactOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<string>('processing');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(
    null
  );
  const [crsdFilter, setCrsdFilter] = useState<string>('all'); // all, crsd1, crsd2
  const [userRole, setUserRole] = useState<string>(''); // admin, superadmin

  const perPage = 10;

  useEffect(() => {
    fetchUserInfo();
    fetchInitialData();
  }, []);

  // Fetch user info to determine role
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

  const fetchInitialData = async () => {
    await Promise.all([fetchOrders(), fetchAreas()]);
  };

  const fetchAreas = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/areas`);
      if (!res.ok) throw new Error('Failed to fetch areas');

      const data = await res.json();
      if (data.success && data.data) {
        setAreas(data.data);
      }
    } catch (err) {
      console.error('Error fetching areas:', err);
    }
  };

  // Determine which endpoint to fetch based on user role and CRSD filter
  const getOrdersEndpoint = () => {
    // Superadmin can see all orders
    if (userRole === 'superadmin') {
      if (crsdFilter === 'crsd1') {
        return `${apiUrl}/api/admin/crsd1/orders`;
      } else if (crsdFilter === 'crsd2') {
        return `${apiUrl}/api/admin/crsd2/orders`;
      } else {
        return `${apiUrl}/api/admin/orders`;
      }
    }

    // Regular admin - based on CRSD filter
    if (crsdFilter === 'crsd1') {
      return `${apiUrl}/api/admin/crsd1/orders`;
    } else if (crsdFilter === 'crsd2') {
      return `${apiUrl}/api/admin/crsd2/orders`;
    } else {
      // Default untuk admin biasa (mungkin harus memilih CRSD dulu)
      return `${apiUrl}/api/admin/orders`;
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
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

      if (!res.ok) throw new Error('Failed to fetch orders');

      const data = await res.json();
      if (data.success && data.data) {
        // Add CRSD type based on endpoint or response
        const ordersWithCRSD = data.data.map((order: Order) => {
          if (endpoint.includes('crsd1')) {
            return { ...order, crsd_type: 'crsd1' };
          } else if (endpoint.includes('crsd2')) {
            return { ...order, crsd_type: 'crsd2' };
          }
          return order;
        });
        setOrders(ordersWithCRSD);
      }
      setPage(1);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Gagal memuat pesanan');
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
    const worksheet = XLSX.utils.json_to_sheet(
      filteredOrders.map((order) => ({
        'Kode Order': order.order_code,
        Pelanggan: order.user.name,
        Email: order.user.email,
        Telepon: order.user.phone,
        Area: order.areas?.map((a) => a.name).join(', ') || '-',
        CRSD: order.crsd_type ? order.crsd_type.toUpperCase() : '-',
        'Status Order': order.order_status,
        'Status Pembayaran': order.status,
        Total: order.total_price,
        Tanggal: new Date(order.created_at).toLocaleDateString(
          'id-ID'
        )
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(
      workbook,
      `orders_${dateFilter}_${crsdFilter}.xlsx`
    );
  };

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const hasContent =
        o.order_code.toLowerCase().includes(search.toLowerCase()) ||
        o.user.name.toLowerCase().includes(search.toLowerCase()) ||
        o.user.email.toLowerCase().includes(search.toLowerCase()) ||
        o.items?.some(
          (item) =>
            item.menu?.restaurant?.name
              .toLowerCase()
              .includes(search.toLowerCase())
        );

      const matchesStatus =
        statusFilter === 'all' || o.order_status === statusFilter;

      const matchesArea =
        areaFilter === 'all' ||
        (o.areas &&
          o.areas.some((area) => area.id.toString() === areaFilter));

      const orderDate = new Date(o.created_at)
        .toISOString()
        .split('T')[0];
      const matchesDate = orderDate === dateFilter;

      const matchesCRSD =
        crsdFilter === 'all' || o.crsd_type === crsdFilter;

      return (
        o.order_status !== null &&
        hasContent &&
        matchesStatus &&
        matchesArea &&
        matchesDate &&
        matchesCRSD
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    areaFilter,
    dateFilter,
    crsdFilter
  ]);

  const pages = Math.ceil(filteredOrders.length / perPage);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const statusOptions = [
    { value: 'processing', label: 'Menunggu', icon: Clock },
    { value: 'completed', label: 'Selesai', icon: CheckCircle },
    { value: 'canceled', label: 'Dibatalkan', icon: XCircle },
    { value: 'all', label: 'Semua', icon: Clock }
  ];

  const crsdOptions = [
    { value: 'all', label: 'Semua CRSD', icon: Filter },
    { value: 'crsd1', label: 'CRSD 1', icon: Building2 },
    { value: 'crsd2', label: 'CRSD 2', icon: Building2 }
  ];

  const getAreaOrderCount = (areaId: number) => {
    return orders.filter(
      (o) =>
        o.areas &&
        o.areas.some((area) => area.id === areaId) &&
        (statusFilter === 'all' || o.order_status === statusFilter) &&
        (crsdFilter === 'all' || o.crsd_type === crsdFilter) &&
        new Date(o.created_at).toISOString().split('T')[0] ===
          dateFilter
    ).length;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
        {/* HEADER SECTION */}
        <div className="mb-5 sm:mb-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                Pesanan{' '}
                {crsdFilter !== 'all' &&
                  `CRSD ${crsdFilter.slice(4).toUpperCase()}`}
              </h1>
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                Kelola semua pesanan pelanggan
                {userRole === 'superadmin' && ' - Superadmin Mode'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Export Excel</span>
                <span className="inline sm:hidden">Export</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    isRefreshing ? 'animate-spin' : ''
                  } sm:h-4 sm:w-4`}
                />
                <span className="hidden sm:inline">Refresh</span>
                <span className="inline sm:hidden">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="animate-fade-in mb-4 rounded-lg border border-red-200 bg-red-50 p-2.5 dark:border-red-800 dark:bg-red-900/20 sm:p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400 sm:h-4 sm:w-4" />
              <p className="text-xs font-medium text-red-700 dark:text-red-300 sm:text-sm">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* MAIN FILTERS SECTION */}
        <div className="mb-4 space-y-4 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 sm:p-4">
          {/* CRSD FILTER - Only for Superadmin or when needed */}
          {(userRole === 'superadmin' || userRole === 'admin') && (
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                  Filter CRSD
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {crsdOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setCrsdFilter(option.value);
                        setPage(1);
                        setTimeout(() => fetchOrders(), 100); // Refetch data dengan filter baru
                      }}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition-all ${
                        crsdFilter === option.value
                          ? option.value === 'crsd1'
                            ? 'bg-purple-600 text-white'
                            : option.value === 'crsd2'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-blue-600 text-white'
                          : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* AREA FILTER CHIPS */}
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                Area
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  setAreaFilter('all');
                  setPage(1);
                }}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition-all ${
                  areaFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Semua
                <span className="ml-0.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">
                  {
                    orders.filter(
                      (o) =>
                        (statusFilter === 'all' ||
                          o.order_status === statusFilter) &&
                        (crsdFilter === 'all' ||
                          o.crsd_type === crsdFilter) &&
                        new Date(o.created_at)
                          .toISOString()
                          .split('T')[0] === dateFilter
                    ).length
                  }
                </span>
              </button>

              {areas.map((area) => {
                const count = getAreaOrderCount(area.id);
                return (
                  <button
                    key={area.id}
                    onClick={() => {
                      setAreaFilter(area.id.toString());
                      setPage(1);
                    }}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition-all ${
                      areaFilter === area.id.toString()
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-sm">
                      {area.icon || '🏢'}
                    </span>
                    <span className="max-w-[80px] truncate sm:max-w-none">
                      {area.name}
                    </span>
                    {count > 0 && (
                      <span
                        className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                          areaFilter === area.id.toString()
                            ? 'bg-white/20'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEARCH AND DATE FILTER */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Cari Pesanan
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari kode/nama..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Tanggal
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setPage(1);
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* STATUS FILTER */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setPage(1);
                    }}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition-all ${
                      statusFilter === option.value
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RESULTS INFO */}
        <div className="mb-3 px-1 text-xs text-gray-600 dark:text-gray-400 sm:px-0 sm:text-sm">
          {filteredOrders.length > 0 ? (
            <>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {filteredOrders.length}
              </span>{' '}
              pesanan ditemukan
              {crsdFilter !== 'all' && (
                <span className="ml-2">
                  di{' '}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    CRSD {crsdFilter.slice(4).toUpperCase()}
                  </span>
                </span>
              )}
              {areaFilter !== 'all' && (
                <span className="ml-2">
                  di{' '}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {
                      areas.find(
                        (a) => a.id.toString() === areaFilter
                      )?.name
                    }
                  </span>
                </span>
              )}
            </>
          ) : (
            <span className="text-amber-600 dark:text-amber-400">
              Tidak ada pesanan
            </span>
          )}
        </div>

        {/* ORDERS TABLE - DESKTOP */}
        {filteredOrders.length > 0 ? (
          <>
            <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:block">
              <table className="w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-4">
                      Order
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-4">
                      Pelanggan
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-4">
                      Area
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-4">
                      Tanggal
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-4">
                      Status
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-4">
                      Total
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-4">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {paginatedOrders.map((order) => (
                    <>
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-3 py-3 sm:px-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Hash className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                              <div>
                                <p className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                  #{order.order_code}
                                </p>
                                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                                  {order.items.length} item
                                </p>
                              </div>
                            </div>
                            {order.crsd_type && (
                              <CRSDBadge type={order.crsd_type} />
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 sm:px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {order.user.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                              <Phone className="h-3 w-3" />
                              {order.user.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 sm:px-4">
                          {order.areas && order.areas.length > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {order.areas[0].name}
                                {order.areas.length > 1 &&
                                  ` +${order.areas.length - 1}`}
                              </span>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400">-</p>
                          )}
                        </td>
                        <td className="px-3 py-3 sm:px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {new Date(
                                  order.created_at
                                ).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                              <ClockIcon className="h-3 w-3" />
                              {new Date(
                                order.created_at
                              ).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 sm:px-4">
                          <div className="space-y-1.5">
                            <StatusBadge
                              status={order.order_status}
                              type="order"
                            />
                            <StatusBadge
                              status={order.status}
                              type="payment"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-3 sm:px-4">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            Rp{' '}
                            {parseInt(
                              order.total_price
                            ).toLocaleString('id-ID')}
                          </p>
                        </td>
                        <td className="px-3 py-3 sm:px-4">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`/dashboard/orders/${order.id}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
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
                              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
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

                      {/* Expanded Detail Row */}
                      {expandedOrder === order.id && (
                        <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                          <td
                            colSpan={7}
                            className="px-3 py-3 sm:px-4"
                          >
                            <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                              <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                                    Detail Items
                                  </h4>
                                  {order.crsd_type && (
                                    <CRSDBadge
                                      type={order.crsd_type}
                                    />
                                  )}
                                </div>
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
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item.menu.name}
                                      </p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {item.menu.restaurant?.name ||
                                          '-'}
                                      </p>
                                      {item.notes && (
                                        <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* ORDERS CARDS - MOBILE */}
            <div className="space-y-2.5 sm:hidden">
              {paginatedOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  {/* Header with Order Code and Status */}
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5 text-blue-500" />
                        <p className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                          #{order.order_code}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
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
                          <CRSDBadge type={order.crsd_type} />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id
                        )
                      }
                      className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900/30">
                        <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.user.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {order.user.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          Area
                        </p>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {order.areas?.[0]?.name || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
                      <CalendarDays className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          Tanggal
                        </p>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {new Date(
                            order.created_at
                          ).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total and Actions */}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Total
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Rp{' '}
                        {parseInt(order.total_price).toLocaleString(
                          'id-ID'
                        )}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <a
                        href={`/dashboard/orders/${order.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Detail
                      </a>
                      <QuickActions order={order} isMobile={true} />
                    </div>
                  </div>

                  {/* Expanded Details - Mobile */}
                  {expandedOrder === order.id && (
                    <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded border border-gray-100 p-2 dark:border-gray-700"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.menu.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {item.menu.restaurant?.name || '-'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Rp{' '}
                                {parseInt(item.price).toLocaleString(
                                  'id-ID'
                                )}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {item.quantity} × Rp{' '}
                                {parseInt(item.price).toLocaleString(
                                  'id-ID'
                                )}
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
                      {order.notes && (
                        <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-900/20">
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
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <AlertCircle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Tidak ada pesanan
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Coba ubah filter atau tanggal
            </p>
            {crsdFilter !== 'all' && (
              <button
                onClick={() => {
                  setCrsdFilter('all');
                  fetchOrders();
                }}
                className="mt-3 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Tampilkan Semua CRSD
              </button>
            )}
          </div>
        )}

        {/* PAGINATION */}
        {pages > 1 && (
          <div className="mt-5 sm:mt-6">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Halaman <span className="font-semibold">{page}</span>{' '}
                dari <span className="font-semibold">{pages}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-0.5">
                  {Array.from(
                    { length: Math.min(5, pages) },
                    (_, i) => {
                      let pageNum;
                      if (pages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= pages - 2) {
                        pageNum = pages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`h-7 w-7 rounded-lg text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm ${
                            page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  disabled={page === pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
