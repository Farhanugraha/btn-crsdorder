'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle,
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
  ShoppingCart,
  PackageOpen,
  CheckSquare,
  X,
  DollarSign,
  Filter,
  ChefHat,
  Building,
  Layers,
  Tag,
  BadgeCheck,
  Sparkles,
  Truck,
  CreditCard
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Interface definitions
interface Area {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  order?: number;
}

interface Restaurant {
  id: number;
  name: string;
  area_id: number;
  area?: Area;
  description?: string;
  address?: string;
  is_open?: boolean;
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
  is_checked: number;
  menu: Menu;
}

interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number | null;
  total_price: number;
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
    unit_kerja?: string;
    data_access?: any[];
    role: string;
  };
  items: OrderItem[];
  restaurant?: Restaurant;
  crsd_type?: 'crsd1' | 'crsd2';
  items_count?: number;
  area_name?: string;
  area_icon?: string;
  area?: Area;
  all_restaurants?: Restaurant[];
  all_areas?: Area[];
  restaurants_count?: number;
  areas_count?: number;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Loading Screen
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
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

// Empty State Component
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
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <Icon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        {message}
      </h3>
      {submessage && (
        <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
          {submessage}
        </p>
      )}
      {actionButton}
    </div>
  );
}

// StatusBadge component dengan warna yang lebih vibrant
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
    size === 'small' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs'
  }`;

  const orderStyles: Record<
    string,
    { bg: string; text: string; icon: any; label: string }
  > = {
    processing: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md',
      text: 'text-white',
      icon: Clock,
      label: 'Menunggu'
    },
    completed: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md',
      text: 'text-white',
      icon: CheckSquare,
      label: 'Selesai'
    }
  };

  const paymentStyles: Record<
    string,
    { bg: string; text: string; icon: any; label: string }
  > = {
    pending: {
      bg: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md',
      text: 'text-white',
      icon: Clock,
      label: 'Pending'
    },
    paid: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md',
      text: 'text-white',
      icon: CheckCircle,
      label: 'Dibayar'
    }
  };

  const config =
    type === 'order'
      ? orderStyles[status] || orderStyles.processing
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
const getOrderAreas = (order: Order): Area[] => {
  if (order.all_areas && order.all_areas.length > 0) {
    return order.all_areas;
  }

  const areas = new Map<number, Area>();
  order.items?.forEach((item) => {
    if (item.menu?.restaurant?.area) {
      const area = item.menu.restaurant.area;
      if (!areas.has(area.id)) {
        areas.set(area.id, area);
      }
    }
  });
  return Array.from(areas.values());
};

const getOrderRestaurants = (order: Order): Restaurant[] => {
  if (order.all_restaurants && order.all_restaurants.length > 0) {
    return order.all_restaurants;
  }

  const restaurants = new Map<number, Restaurant>();
  order.items?.forEach((item) => {
    if (item.menu?.restaurant) {
      const restaurant = item.menu.restaurant;
      if (!restaurants.has(restaurant.id)) {
        restaurants.set(restaurant.id, restaurant);
      }
    }
  });
  return Array.from(restaurants.values());
};

// Improved Restaurant & Area Badge Component dengan ikon Tailwind
function RestaurantAreaBadge({ order }: { order: Order }) {
  const areas = getOrderAreas(order);
  const restaurants = getOrderRestaurants(order);

  if (areas.length === 0 && restaurants.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Store className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Tidak ada data
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Summary Badge */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20">
          <Store className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {restaurants.length} Restoran
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {areas.length} Area
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {order.items?.length || 0} pesanan
          </p>
        </div>
      </div>

      {/* Area Tags - Compact Horizontal Layout */}
      {areas.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Area:
            </span>
          </div>
          <div className="flex flex-wrap gap-1 pl-4">
            {areas.slice(0, 2).map((area) => (
              <span
                key={area.id}
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:from-emerald-900/20 dark:to-emerald-800/20 dark:text-emerald-300"
              >
                <Building className="h-2.5 w-2.5" />
                <span className="max-w-[80px] truncate">
                  {area.name}
                </span>
              </span>
            ))}
            {areas.length > 2 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                <Layers className="h-2.5 w-2.5" />+{areas.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Restaurant Tags - Compact Horizontal Layout */}
      {restaurants.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <ChefHat className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Restoran:
            </span>
          </div>
          <div className="flex flex-wrap gap-1 pl-4">
            {restaurants.slice(0, 2).map((restaurant) => (
              <span
                key={restaurant.id}
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300"
              >
                <Store className="h-2.5 w-2.5" />
                <span className="max-w-[100px] truncate">
                  {restaurant.name}
                </span>
              </span>
            ))}
            {restaurants.length > 2 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                <Layers className="h-2.5 w-2.5" />+
                {restaurants.length - 2}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
        const notification = document.createElement('div');
        notification.className =
          'fixed top-4 right-4 z-50 px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium shadow-lg animate-fade-in';
        notification.textContent = `Kode ${order.order_code} disalin!`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
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
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background: #f8fafc; }
                  .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 32px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                  .header { text-align: center; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
                  .header h2 { color: #1e293b; margin: 0; font-size: 24px; }
                  .header p { color: #64748b; margin: 8px 0 0; }
                  .info { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
                  .info-section h4 { color: #475569; margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
                  .info-section p { color: #1e293b; margin: 6px 0; }
                  table { width: 100%; border-collapse: collapse; margin: 24px 0; }
                  th { background: #f1f5f9; color: #475569; font-weight: 600; text-align: left; padding: 12px 16px; border-bottom: 2px solid #e2e8f0; }
                  td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #334155; }
                  .total { text-align: right; margin-top: 24px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
                  .total h3 { color: #1e293b; margin: 0; font-size: 20px; }
                  .item-group { margin-bottom: 24px; }
                  .item-group-header { background: #f8fafc; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; }
                  .item-group-header h5 { color: #475569; margin: 0; font-size: 16px; }
                  .text-right { text-align: right; }
                  .text-bold { font-weight: 600; }
                </style>
              </head>
              <body>
                <div class="invoice">
                  <div class="header">
                    <h2>Invoice Order #${order.order_code}</h2>
                    <p>Tanggal: ${new Date(
                      order.created_at
                    ).toLocaleString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  <div class="info">
                    <div class="info-section">
                      <h4>Pelanggan</h4>
                      <p class="text-bold">${order.user.name}</p>
                      <p>${order.user.email}</p>
                      <p>${order.user.phone}</p>
                      ${
                        order.user.divisi
                          ? `<p><strong>Divisi:</strong> ${order.user.divisi}</p>`
                          : ''
                      }
                    </div>
                    <div class="info-section">
                      <h4>Status Pesanan</h4>
                      <p><strong>Pembayaran:</strong> ${
                        order.status === 'paid'
                          ? 'Dibayar'
                          : 'Pending'
                      }</p>
                      <p><strong>Status:</strong> ${
                        order.order_status === 'completed'
                          ? 'Selesai'
                          : 'Menunggu'
                      }</p>
                      ${
                        order.crsd_type
                          ? `<p><strong>CRSD:</strong> ${order.crsd_type.toUpperCase()}</p>`
                          : ''
                      }
                    </div>
                  </div>
                  
                  ${(() => {
                    const groupedItems = order.items.reduce(
                      (acc, item) => {
                        const restaurantName =
                          item.menu.restaurant?.name || 'Lainnya';
                        if (!acc[restaurantName])
                          acc[restaurantName] = [];
                        acc[restaurantName].push(item);
                        return acc;
                      },
                      {} as Record<string, OrderItem[]>
                    );

                    return Object.entries(groupedItems)
                      .map(
                        ([restaurantName, items]) => `
                      <div class="item-group">
                        <div class="item-group-header">
                          <h5>${restaurantName}</h5>
                        </div>
                        <table>
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Qty</th>
                              <th class="text-right">Harga</th>
                              <th class="text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${items
                              .map(
                                (item) => `
                              <tr>
                                <td>
                                  <div>${item.menu.name}</div>
                                  ${
                                    item.notes
                                      ? `<div style="font-size: 12px; color: #64748b; margin-top: 4px;">Catatan: ${item.notes}</div>`
                                      : ''
                                  }
                                </td>
                                <td>${item.quantity}</td>
                                <td class="text-right">Rp ${parseInt(
                                  item.price
                                ).toLocaleString('id-ID')}</td>
                                <td class="text-right">Rp ${(
                                  parseInt(item.price) * item.quantity
                                ).toLocaleString('id-ID')}</td>
                              </tr>
                            `
                              )
                              .join('')}
                          </tbody>
                        </table>
                      </div>
                    `
                      )
                      .join('');
                  })()}
                  
                  <div class="total">
                    <h3>Total: Rp ${order.total_price.toLocaleString(
                      'id-ID'
                    )}</h3>
                  </div>
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          setTimeout(() => printWindow.print(), 500);
        }
      }
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Menu aksi"
      >
        <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="animate-fade-in absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
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

// Enhanced CRSD Badge Component
function CRSDBadge({ type }: { type: 'crsd1' | 'crsd2' | string }) {
  const styles = {
    crsd1: {
      bg: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md',
      text: 'text-white',
      icon: Building2,
      label: 'CRSD 1'
    },
    crsd2: {
      bg: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md',
      text: 'text-white',
      icon: Building2,
      label: 'CRSD 2'
    }
  };

  const style = styles[type as keyof typeof styles] || styles.crsd1;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${style.bg} ${style.text}`}
    >
      <Icon className="h-3 w-3" />
      {style.label}
    </span>
  );
}

// Enhanced Filter Chip Component yang lebih sederhana
function FilterChip({
  label,
  isActive,
  onClick,
  icon: Icon
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: any;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}

// Enhanced Stats Card Component yang lebih sederhana
function StatsCard({
  title,
  value,
  icon: Icon,
  color = 'blue'
}: {
  title: string;
  value: string | number;
  icon: any;
  color?: 'blue' | 'green' | 'purple' | 'amber';
}) {
  const iconColors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-emerald-600 dark:text-emerald-400',
    purple: 'text-purple-600 dark:text-purple-400',
    amber: 'text-amber-600 dark:text-amber-400'
  };

  const iconBgColors = {
    blue: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
    green:
      'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30',
    purple:
      'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
    amber:
      'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30'
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {title}
          </p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgColors[color]}`}
        >
          <Icon className={`h-5 w-5 ${iconColors[color]}`} />
        </div>
      </div>
    </div>
  );
}

export default function CompactOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<string>('processing');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [restaurantFilter, setRestaurantFilter] =
    useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(
    null
  );
  const [crsdFilter, setCrsdFilter] = useState<string>('all');
  const [userRole, setUserRole] = useState<string>('');

  const perPage = 10;

  // Fetch orders function
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

        const processedOrders = ordersData.map((order: any) => ({
          ...order,
          crsd_type:
            order.crsd_type ||
            (order.user?.divisi === 'CRSD 2'
              ? 'crsd2'
              : order.user?.divisi === 'CRSD 1'
                ? 'crsd1'
                : undefined),
          items_count: order.items?.length || 0,
          total_price:
            typeof order.total_price === 'string'
              ? parseInt(order.total_price)
              : order.total_price
        }));

        setOrders(processedOrders);

        // Extract areas and restaurants ONLY from processing orders that are paid
        const processingOrders = processedOrders.filter(
          (order: Order) =>
            order.order_status === 'processing' &&
            order.status === 'paid'
        );

        // Extract unique areas from processing orders
        const areaMap = new Map<number, Area>();
        processingOrders.forEach((order: Order) => {
          if (order.all_areas && order.all_areas.length > 0) {
            order.all_areas.forEach((area) => {
              if (!areaMap.has(area.id)) areaMap.set(area.id, area);
            });
          } else {
            order.items?.forEach((item) => {
              if (item.menu?.restaurant?.area) {
                const area = item.menu.restaurant.area;
                if (!areaMap.has(area.id)) areaMap.set(area.id, area);
              }
            });
          }
        });
        setAreas(Array.from(areaMap.values()));

        // Extract unique restaurants from processing orders
        const restaurantMap = new Map<number, Restaurant>();
        processingOrders.forEach((order: Order) => {
          if (
            order.all_restaurants &&
            order.all_restaurants.length > 0
          ) {
            order.all_restaurants.forEach((restaurant) => {
              if (!restaurantMap.has(restaurant.id))
                restaurantMap.set(restaurant.id, restaurant);
            });
          } else {
            order.items?.forEach((item) => {
              if (item.menu?.restaurant) {
                const restaurant = item.menu.restaurant;
                if (!restaurantMap.has(restaurant.id))
                  restaurantMap.set(restaurant.id, restaurant);
              }
            });
          }
        });
        setRestaurants(Array.from(restaurantMap.values()));
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
  };

  const handleExportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredOrders.map((order) => {
          const restaurants = getOrderRestaurants(order);
          const areas = getOrderAreas(order);
          return {
            'Kode Order': order.order_code,
            Pelanggan: order.user.name,
            Email: order.user.email,
            Telepon: order.user.phone,
            'Divisi CRSD': order.user.divisi || '-',
            Restoran:
              restaurants.map((r) => r.name).join(', ') || '-',
            Area: areas.map((a) => a.name).join(', ') || '-',
            'Status Order':
              order.order_status === 'processing'
                ? 'Menunggu'
                : 'Selesai',
            'Status Pembayaran':
              order.status === 'paid' ? 'Dibayar' : 'Pending',
            Total: order.total_price,
            'Jumlah Item': order.items.length,
            'Jumlah Restoran': restaurants.length,
            'Jumlah Area': areas.length,
            Tanggal: new Date(order.created_at).toLocaleDateString(
              'id-ID'
            ),
            Waktu: new Date(order.created_at).toLocaleTimeString(
              'id-ID'
            ),
            'Catatan Pesanan': order.notes || '-'
          };
        })
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
      XLSX.writeFile(
        workbook,
        `orders_${new Date().toISOString().split('T')[0]}.xlsx`
      );
    } catch (err) {
      alert('Gagal mengexport data');
    }
  };

  // Calculate today's statistics for processing orders only
  const todaysStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orders.filter(
      (order) =>
        new Date(order.created_at).toISOString().split('T')[0] ===
          today &&
        order.status === 'paid' &&
        order.order_status === 'processing'
    );

    const totalOrdersToday = todaysOrders.length;
    const totalRevenueToday = todaysOrders.reduce(
      (sum, order) => sum + order.total_price,
      0
    );

    return {
      totalOrdersToday,
      totalRevenueToday
    };
  }, [orders]);

  // Filter logic - ONLY show paid orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filter 1: Hanya pesanan dengan status pembayaran 'paid'
      if (order.status !== 'paid') {
        return false;
      }

      // Filter 2: Status filter
      const matchesStatus =
        statusFilter === 'all' || order.order_status === statusFilter;
      if (!matchesStatus) return false;

      // Filter 3: Date filter
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const orderDate = new Date(order.created_at)
          .toISOString()
          .split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split('T')[0];

        if (dateFilter === 'today') {
          matchesDate = orderDate === today;
        } else if (dateFilter === 'yesterday') {
          matchesDate = orderDate === yesterday;
        } else if (dateFilter === 'thisWeek') {
          const now = new Date();
          const startOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay())
          );
          const orderDateObj = new Date(order.created_at);
          matchesDate = orderDateObj >= startOfWeek;
        }
      }

      if (!matchesDate) return false;

      // Filter 4: Search filter
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
              .includes(search.toLowerCase()) ||
            item.menu?.restaurant?.area?.name
              .toLowerCase()
              .includes(search.toLowerCase())
        );

      if (!hasContent) return false;

      // Filter 5: Area filter - ONLY apply for processing orders
      let matchesArea = true;
      if (
        areaFilter !== 'all' &&
        order.order_status === 'processing'
      ) {
        const areas = getOrderAreas(order);
        matchesArea = areas.some(
          (area) => area.id.toString() === areaFilter
        );
      }

      if (!matchesArea) return false;

      // Filter 6: Restaurant filter - ONLY apply for processing orders
      let matchesRestaurant = true;
      if (
        restaurantFilter !== 'all' &&
        order.order_status === 'processing'
      ) {
        const restaurants = getOrderRestaurants(order);
        matchesRestaurant = restaurants.some(
          (restaurant) =>
            restaurant.id.toString() === restaurantFilter
        );
      }

      if (!matchesRestaurant) return false;

      // Filter 7: CRSD filter
      const matchesCRSD =
        crsdFilter === 'all' || order.crsd_type === crsdFilter;

      return matchesCRSD;
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

  // Calculate counts for filters - ONLY processing orders
  const getProcessingOrderCountByStatus = (status: string) => {
    return orders.filter(
      (order) =>
        order.status === 'paid' &&
        (status === 'all'
          ? order.order_status === 'processing'
          : order.order_status === status)
    ).length;
  };

  const getOrderCountByArea = (areaId: number) => {
    return orders.filter(
      (order) =>
        order.status === 'paid' &&
        order.order_status === 'processing' &&
        getOrderAreas(order).some((area) => area.id === areaId)
    ).length;
  };

  const getOrderCountByRestaurant = (restaurantId: number) => {
    return orders.filter(
      (order) =>
        order.status === 'paid' &&
        order.order_status === 'processing' &&
        getOrderRestaurants(order).some(
          (restaurant) => restaurant.id === restaurantId
        )
    ).length;
  };

  const statusOptions = [
    {
      value: 'processing',
      label: 'Menunggu',
      icon: Clock
    },
    {
      value: 'completed',
      label: 'Selesai',
      icon: CheckSquare
    },
    {
      value: 'all',
      label: 'Semua',
      icon: Filter
    }
  ];

  const dateOptions = [
    { value: 'today', label: 'Hari Ini', icon: Calendar },
    { value: 'yesterday', label: 'Kemarin', icon: Calendar },
    { value: 'thisWeek', label: 'Minggu Ini', icon: Calendar },
    { value: 'all', label: 'Semua', icon: Calendar }
  ];

  const crsdOptions = [
    { value: 'all', label: 'Semua CRSD', icon: Building2 },
    { value: 'crsd1', label: 'CRSD 1', icon: Building2 },
    { value: 'crsd2', label: 'CRSD 2', icon: Building2 }
  ];

  const pages = Math.ceil(filteredOrders.length / perPage);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Get date display text
  const getDateDisplayText = () => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    switch (dateFilter) {
      case 'today':
        return today.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'yesterday':
        return yesterday.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'thisWeek':
        return 'Minggu Ini';
      default:
        return 'Semua Tanggal';
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Daftar Pesanan
                  </h1>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola semua pesanan pelanggan
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportExcel}
                disabled={filteredOrders.length === 0}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow transition-all hover:from-emerald-700 hover:to-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow transition-all hover:from-blue-700 hover:to-blue-800"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
        {/* Enhanced Filter Section */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Filter Pesanan
              </h3>
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('processing');
                  setAreaFilter('all');
                  setRestaurantFilter('all');
                  setCrsdFilter('all');
                  setDateFilter('today');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Reset Filter
              </button>
            </div>

            {/* Search dengan clear button */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
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
                  placeholder="Kode, nama pelanggan, restoran..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter dengan visual yang lebih jelas */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Status Pesanan
              </label>
              <div className="flex flex-wrap gap-1.5">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setPage(1);
                      if (option.value !== 'processing') {
                        setAreaFilter('all');
                        setRestaurantFilter('all');
                      }
                    }}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      statusFilter === option.value
                        ? option.value === 'processing'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow'
                          : option.value === 'completed'
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow'
                            : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <option.icon className="h-3.5 w-3.5" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter dengan dropdown yang lebih baik */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Periode Waktu
              </label>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {dateOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDateFilter(option.value);
                      setPage(1);
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                      dateFilter === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    <Calendar className="h-3 w-3" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CRSD Filter - hanya untuk admin */}
            {(userRole === 'superadmin' || userRole === 'admin') && (
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Divisi CRSD
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {crsdOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setCrsdFilter(option.value);
                        setPage(1);
                        setTimeout(fetchOrders, 100);
                      }}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        crsdFilter === option.value
                          ? option.value === 'crsd1'
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow'
                            : option.value === 'crsd2'
                              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow'
                              : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Area & Restaurant Filters dengan accordion */}
            {(statusFilter === 'processing' ||
              statusFilter === 'all') && (
              <div className="space-y-4">
                {areas.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Area ({areas.length})
                      </label>
                      <button
                        onClick={() => setAreaFilter('all')}
                        className={`text-xs ${
                          areaFilter === 'all'
                            ? 'font-medium text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                      >
                        Semua Area
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {areas.map((area) => {
                        const count = getOrderCountByArea(area.id);
                        return (
                          <button
                            key={area.id}
                            onClick={() =>
                              setAreaFilter(area.id.toString())
                            }
                            className={`group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                              areaFilter === area.id.toString()
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow'
                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                            title={`${area.name} (${count} pesanan)`}
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="max-w-[100px] truncate">
                              {area.name}
                            </span>
                            {count > 0 && (
                              <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
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
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Restoran ({restaurants.length})
                      </label>
                      <button
                        onClick={() => setRestaurantFilter('all')}
                        className={`text-xs ${
                          restaurantFilter === 'all'
                            ? 'font-medium text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                      >
                        Semua Restoran
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {restaurants.slice(0, 8).map((restaurant) => {
                        const count = getOrderCountByRestaurant(
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
                            className={`group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                              restaurantFilter ===
                              restaurant.id.toString()
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow'
                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                            title={`${restaurant.name} (${count} pesanan)`}
                          >
                            <Store className="h-3.5 w-3.5" />
                            <span className="max-w-[100px] truncate">
                              {restaurant.name}
                            </span>
                            {count > 0 && (
                              <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                      {restaurants.length > 8 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{restaurants.length - 8} restoran lainnya
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Informasi untuk non-processing status */}
            {statusFilter !== 'processing' &&
              statusFilter !== 'all' && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <AlertCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
                        Filter Khusus
                      </p>
                      <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-400">
                        Filter area dan restoran hanya tersedia untuk
                        pesanan dengan status "Menunggu"
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Active Filters Summary */}
            {(search ||
              statusFilter !== 'processing' ||
              areaFilter !== 'all' ||
              restaurantFilter !== 'all' ||
              dateFilter !== 'today' ||
              crsdFilter !== 'all') && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Filter Aktif:
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {search && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      <Search className="h-2.5 w-2.5" />"{search}"
                    </span>
                  )}
                  {statusFilter !== 'processing' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      <Filter className="h-2.5 w-2.5" />
                      {
                        statusOptions.find(
                          (s) => s.value === statusFilter
                        )?.label
                      }
                    </span>
                  )}
                  {dateFilter !== 'today' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      <Calendar className="h-2.5 w-2.5" />
                      {
                        dateOptions.find(
                          (d) => d.value === dateFilter
                        )?.label
                      }
                    </span>
                  )}
                  {crsdFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                      <Building2 className="h-2.5 w-2.5" />
                      {
                        crsdOptions.find(
                          (c) => c.value === crsdFilter
                        )?.label
                      }
                    </span>
                  )}
                  {areaFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <MapPin className="h-2.5 w-2.5" />
                      {
                        areas.find(
                          (a) => a.id.toString() === areaFilter
                        )?.name
                      }
                    </span>
                  )}
                  {restaurantFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      <Store className="h-2.5 w-2.5" />
                      {
                        restaurants.find(
                          (r) => r.id.toString() === restaurantFilter
                        )?.name
                      }
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Today's Summary Stats - Dipindahkan ke bawah filter */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Ringkasan Hari Ini
            </h2>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatsCard
              title="Pesanan Diproses"
              value={todaysStats.totalOrdersToday}
              icon={ShoppingCart}
              color="blue"
            />
            <StatsCard
              title="Total Pendapatan"
              value={`Rp ${todaysStats.totalRevenueToday.toLocaleString(
                'id-ID'
              )}`}
              icon={CreditCard}
              color="green"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="animate-fade-in mb-6 rounded-lg border border-red-300 bg-gradient-to-r from-red-50 to-red-100 p-4 dark:border-red-800 dark:from-red-900/20 dark:to-red-800/20">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  {error}
                </p>
                <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                  Silakan coba refresh halaman atau hubungi
                  administrator
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {filteredOrders.length}
            </span>{' '}
            pesanan ditemukan
            {statusFilter !== 'all' && (
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                • Status:{' '}
                {
                  statusOptions.find((s) => s.value === statusFilter)
                    ?.label
                }
              </span>
            )}
          </div>
          {pages > 1 && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Halaman{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {page}
              </span>{' '}
              dari{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {pages}
              </span>
            </div>
          )}
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Pesanan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Pelanggan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Restoran & Area
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {paginatedOrders.map((order) => {
                      const restaurants = getOrderRestaurants(order);
                      const areas = getOrderAreas(order);

                      return (
                        <Fragment key={order.id}>
                          <tr className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                            {/* Order Column */}
                            <td className="px-4 py-3">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20">
                                    <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                      {order.order_code}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                      <CalendarDays className="h-3 w-3" />
                                      {new Date(
                                        order.created_at
                                      ).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short'
                                      })}
                                      <ClockIcon className="h-3 w-3" />
                                      {new Date(
                                        order.created_at
                                      ).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </div>
                                  </div>
                                </div>
                                {order.crsd_type && (
                                  <CRSDBadge type={order.crsd_type} />
                                )}
                              </div>
                            </td>

                            {/* Customer Column */}
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800">
                                    <User className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
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
                            </td>

                            {/* Restaurant & Area Column */}
                            <td className="px-4 py-3">
                              <RestaurantAreaBadge order={order} />
                            </td>

                            {/* Status Column */}
                            <td className="px-4 py-3">
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

                            {/* Total Column */}
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                  Rp{' '}
                                  {order.total_price.toLocaleString(
                                    'id-ID'
                                  )}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {order.items?.length || 0} pesanan
                                </p>
                              </div>
                            </td>

                            {/* Actions Column */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`/dashboard/orders/${order.id}`}
                                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 text-xs font-medium text-white shadow transition-all hover:from-blue-700 hover:to-blue-800"
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
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 shadow-sm transition-all hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:text-gray-300"
                                >
                                  {expandedOrder === order.id ? (
                                    <ChevronUp className="h-3.5 w-3.5" />
                                  ) : (
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  )}
                                </button>
                                <QuickActions order={order} />
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Detail Row */}
                          {expandedOrder === order.id && (
                            <tr className="bg-gray-50/50 dark:bg-gray-700/30">
                              <td colSpan={6} className="px-4 py-3">
                                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                  <div className="mb-4 flex items-center justify-between">
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Detail Pesanan
                                      </h4>
                                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                        {restaurants.length} restoran
                                        • {areas.length} area •{' '}
                                        {order.items.length} pesanan
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        setExpandedOrder(null)
                                      }
                                      className="rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 dark:from-gray-700 dark:to-gray-800 dark:text-gray-300"
                                    >
                                      Tutup
                                    </button>
                                  </div>

                                  {/* Group items by restaurant */}
                                  {(() => {
                                    const groupedItems =
                                      order.items.reduce(
                                        (acc, item) => {
                                          const restaurantName =
                                            item.menu.restaurant
                                              ?.name || 'Lainnya';
                                          const areaName =
                                            item.menu.restaurant?.area
                                              ?.name ||
                                            'Tidak Diketahui';
                                          const key = `${restaurantName}-${areaName}`;

                                          if (!acc[key]) {
                                            acc[key] = {
                                              restaurant:
                                                item.menu.restaurant,
                                              area:
                                                item.menu.restaurant
                                                  ?.area || null,
                                              items: []
                                            };
                                          }
                                          acc[key].items.push(item);
                                          return acc;
                                        },
                                        {} as Record<
                                          string,
                                          {
                                            restaurant: Restaurant | null;
                                            area: Area | null;
                                            items: OrderItem[];
                                          }
                                        >
                                      );

                                    return Object.entries(
                                      groupedItems
                                    ).map(([key, group]) => (
                                      <div
                                        key={key}
                                        className="mb-6 last:mb-0"
                                      >
                                        {/* Restaurant Header */}
                                        <div className="mb-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-3 dark:from-blue-900/20 dark:to-blue-800/20">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-800">
                                                <Store className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                              </div>
                                              <div>
                                                <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                                  {group.restaurant
                                                    ?.name ||
                                                    'Restoran Tidak Diketahui'}
                                                </h5>
                                                {group.area && (
                                                  <div className="mt-0.5 flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                      {
                                                        group.area
                                                          .name
                                                      }
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {group.items.length}{' '}
                                                pesanan
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Items List */}
                                        <div className="space-y-2">
                                          {group.items.map(
                                            (item, index) => (
                                              <div
                                                key={`${order.id}-item-${index}`}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                                              >
                                                <div className="flex-1">
                                                  <div className="flex items-start gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                                                      <Utensils className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <div>
                                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {
                                                          item.menu
                                                            .name
                                                        }
                                                      </p>
                                                      <div className="mt-1 flex items-center gap-2">
                                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                          Jumlah:{' '}
                                                          {
                                                            item.quantity
                                                          }
                                                        </span>
                                                        {item.is_checked ===
                                                          1 && (
                                                          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                            <CheckSquare className="h-3 w-3" />
                                                            Dicek
                                                          </span>
                                                        )}
                                                      </div>
                                                      {item.notes && (
                                                        <div className="mt-2 rounded bg-amber-50 p-2 dark:bg-amber-900/20">
                                                          <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                                                            Catatan:
                                                          </p>
                                                          <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                                                            {
                                                              item.notes
                                                            }
                                                          </p>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="text-right">
                                                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    Rp{' '}
                                                    {parseInt(
                                                      item.price
                                                    ).toLocaleString(
                                                      'id-ID'
                                                    )}
                                                  </p>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    ));
                                  })()}

                                  {order.notes && (
                                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                                      <div className="flex items-start gap-2">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                                          <FileText className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                                            Catatan Pesanan:
                                          </p>
                                          <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                                            {order.notes}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 sm:hidden">
              {paginatedOrders.map((order) => {
                const restaurants = getOrderRestaurants(order);
                const areas = getOrderAreas(order);

                return (
                  <div
                    key={order.id}
                    className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="p-3">
                      {/* Header */}
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20">
                            <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {order.order_code}
                            </p>
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <CalendarDays className="h-3 w-3" />
                              {new Date(
                                order.created_at
                              ).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {order.crsd_type && (
                            <CRSDBadge type={order.crsd_type} />
                          )}
                          <button
                            onClick={() =>
                              setExpandedOrder(
                                expandedOrder === order.id
                                  ? null
                                  : order.id
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
                          >
                            {expandedOrder === order.id ? (
                              <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="mb-3 flex flex-wrap items-center gap-1.5">
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
                      </div>

                      {/* Customer */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800">
                            <User className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                          </div>
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

                      {/* Restaurant & Area */}
                      <div className="mb-3">
                        <RestaurantAreaBadge order={order} />
                      </div>

                      {/* Total & Actions */}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            Rp{' '}
                            {order.total_price.toLocaleString(
                              'id-ID'
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`/dashboard/orders/${order.id}`}
                            className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-2.5 py-1.5 text-xs font-medium text-white"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                          </a>
                          <QuickActions order={order} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedOrder === order.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
                        <div className="mb-3">
                          <div className="mb-2 flex items-center justify-between">
                            <h5 className="text-xs font-semibold text-gray-900 dark:text-white">
                              Detail Pesanan ({order.items.length})
                            </h5>
                            <button
                              onClick={() => setExpandedOrder(null)}
                              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                              Tutup
                            </button>
                          </div>
                          <div className="space-y-2">
                            {order.items
                              .slice(0, 2)
                              .map((item, index) => (
                                <div
                                  key={`${order.id}-mobile-item-${index}`}
                                  className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                                          <Utensils className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                                            {item.menu.name}
                                          </p>
                                          <p className="text-[10px] text-gray-600 dark:text-gray-400">
                                            {
                                              item.menu.restaurant
                                                ?.name
                                            }
                                          </p>
                                        </div>
                                      </div>
                                      {item.notes && (
                                        <div className="mt-1.5 pl-8">
                                          <p className="text-[10px] text-amber-600 dark:text-amber-400">
                                            📝 {item.notes}
                                          </p>
                                        </div>
                                      )}
                                      <div className="mt-1.5 flex items-center gap-1.5 pl-8">
                                        <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                          Qty: {item.quantity}
                                        </span>
                                        {item.is_checked === 1 && (
                                          <span className="flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                            <CheckSquare className="h-2.5 w-2.5" />
                                            Checked
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                                        Rp{' '}
                                        {parseInt(
                                          item.price
                                        ).toLocaleString('id-ID')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            {order.items.length > 2 && (
                              <div className="text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  +{order.items.length - 2} item
                                  lainnya
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {order.notes && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-900/20">
                            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                              Catatan Pesanan:
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
            message={
              statusFilter === 'processing'
                ? 'Tidak Ada Pesanan Menunggu'
                : 'Tidak Ada Pesanan Ditemukan'
            }
            submessage={
              statusFilter === 'processing'
                ? "Tidak ada pesanan dengan status 'Menunggu' yang sesuai dengan filter yang dipilih."
                : 'Tidak ada pesanan yang sesuai dengan filter yang Anda pilih. Coba ubah filter atau kata kunci pencarian.'
            }
            icon={statusFilter === 'processing' ? Clock : Package}
            actionButton={
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('processing');
                  setAreaFilter('all');
                  setRestaurantFilter('all');
                  setCrsdFilter('all');
                  setDateFilter('today');
                  fetchOrders();
                }}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800"
              >
                Reset Filter
              </button>
            }
          />
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Menampilkan{' '}
              <span className="font-semibold">
                {(page - 1) * perPage + 1}
              </span>{' '}
              -{' '}
              <span className="font-semibold">
                {Math.min(page * perPage, filteredOrders.length)}
              </span>{' '}
              dari{' '}
              <span className="font-semibold">
                {filteredOrders.length}
              </span>{' '}
              pesanan
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Sebelumnya
              </button>
              <div className="flex items-center gap-0.5">
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
                        className={`h-8 w-8 rounded-md text-xs font-medium transition-all ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow'
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
                className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                Selanjutnya
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
