import { 
  Order, 
  Area, 
  Restaurant, 
  FilteredStats, 
  DateFilterType, 
  OrderStatusFilter,
  CrsdFilterType,
  OrderItem 
} from '../types';

export const formatCurrency = (amount: number): string => {
  if (amount === 0) return 'Rp 0';
  const formatter = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return `Rp ${formatter.format(amount)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTimeFull = (dateString: string): string => {
  return `${formatDate(dateString)} ${formatDateTime(dateString)}`;
};

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  });
};

export const getOrderAreas = (order: Order): Area[] => {
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

export const getOrderRestaurants = (order: Order): Restaurant[] => {
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

export const getOrderEndpoint = (userRole: string, crsdFilter: string): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (userRole === 'superadmin' || userRole === 'admin') {
    if (crsdFilter === 'crsd1') return `${apiUrl}/api/admin/crsd1/orders`;
    if (crsdFilter === 'crsd2') return `${apiUrl}/api/admin/crsd2/orders`;
    return `${apiUrl}/api/admin/orders`;
  }

  return `${apiUrl}/api/admin/orders`;
};

export const filterOrdersByDate = (orders: Order[], dateFilter: DateFilterType): Order[] => {
  if (dateFilter === 'all') return orders;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    orderDate.setHours(0, 0, 0, 0);

    if (dateFilter === 'today') {
      return orderDate.getTime() === today.getTime();
    }
    if (dateFilter === 'yesterday') {
      return orderDate.getTime() === yesterday.getTime();
    }
    if (dateFilter === 'thisWeek') {
      const startOfWeek = new Date(today);
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const orderDateTime = new Date(order.created_at);
      return orderDateTime >= startOfWeek;
    }
    return true;
  });
};

export const filterOrdersByStatus = (orders: Order[], statusFilter: OrderStatusFilter): Order[] => {
  if (statusFilter === 'all') {
    return orders.filter(order => order.status === 'paid');
  }
  return orders.filter(order =>
    order.status === 'paid' && order.order_status === statusFilter
  );
};

export const filterOrdersByCRSD = (orders: Order[], crsdFilter: CrsdFilterType): Order[] => {
  if (crsdFilter === 'all') return orders;
  return orders.filter(order => order.crsd_type === crsdFilter);
};

export const filterOrdersBySearch = (orders: Order[], searchQuery: string): Order[] => {
  if (!searchQuery.trim()) return orders;

  const query = searchQuery.toLowerCase();
  return orders.filter(order =>
    order.order_code.toLowerCase().includes(query) ||
    order.user.name.toLowerCase().includes(query) ||
    order.user.email.toLowerCase().includes(query) ||
    order.user.phone?.toLowerCase().includes(query) ||
    order.items?.some(
      item =>
        item.menu?.name.toLowerCase().includes(query) ||
        item.menu?.restaurant?.name.toLowerCase().includes(query) ||
        item.menu?.restaurant?.area?.name.toLowerCase().includes(query)
    )
  );
};

export const filterOrdersByArea = (orders: Order[], areaId: string): Order[] => {
  if (areaId === 'all') return orders;
  return orders.filter(order =>
    order.order_status === 'processing' &&
    order.status === 'paid' &&
    getOrderAreas(order).some(area => area.id.toString() === areaId)
  );
};

export const filterOrdersByRestaurant = (orders: Order[], restaurantId: string): Order[] => {
  if (restaurantId === 'all') return orders;
  return orders.filter(order =>
    order.order_status === 'processing' &&
    order.status === 'paid' &&
    getOrderRestaurants(order).some(restaurant => restaurant.id.toString() === restaurantId)
  );
};

export const calculateRevenueByDateFilter = (
  orders: Order[],
  dateFilter: DateFilterType,
  crsdFilter: CrsdFilterType
): FilteredStats => {
  let filtered = orders.filter(order => order.status === 'paid');
  filtered = filterOrdersByDate(filtered, dateFilter);
  filtered = filterOrdersByCRSD(filtered, crsdFilter);

  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((sum, order) => sum + order.total_price, 0);

  return { totalOrders, totalRevenue };
};

export const calculateOrderCountByStatusFilter = (
  orders: Order[],
  statusFilter: OrderStatusFilter,
  dateFilter: DateFilterType,
  crsdFilter: CrsdFilterType
): FilteredStats => {
  let filtered = orders.filter(order => order.status === 'paid');
  filtered = filterOrdersByStatus(filtered, statusFilter);
  filtered = filterOrdersByDate(filtered, dateFilter);
  filtered = filterOrdersByCRSD(filtered, crsdFilter);

  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((sum, order) => sum + order.total_price, 0);

  return { totalOrders, totalRevenue };
};

export const calculateFilteredStats = (
  orders: Order[],
  statusFilter: OrderStatusFilter,
  dateFilter: DateFilterType,
  crsdFilter: CrsdFilterType
): FilteredStats => {
  return calculateOrderCountByStatusFilter(orders, statusFilter, dateFilter, crsdFilter);
};

export const calculateWeeklyRevenue = (orders: Order[]): number => {
  const today = new Date();
  const day = today.getDay();

  const startOfWeek = new Date(today);
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const weeklyOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= startOfWeek &&
           orderDate <= endOfWeek &&
           order.status === 'paid';
  });

  return weeklyOrders.reduce((sum, order) => sum + order.total_price, 0);
};

export const getProcessingOrderCountByStatus = (orders: Order[], status: string): number => {
  return orders.filter(
    order =>
      order.status === 'paid' &&
      order.order_status === 'processing'
  ).length;
};

export const getOrderCountByArea = (orders: Order[], areaId: number): number => {
  return orders.filter(
    order =>
      order.status === 'paid' &&
      order.order_status === 'processing' &&
      getOrderAreas(order).some(area => area.id === areaId)
  ).length;
};

export const getOrderCountByRestaurant = (orders: Order[], restaurantId: number): number => {
  return orders.filter(
    order =>
      order.status === 'paid' &&
      order.order_status === 'processing' &&
      getOrderRestaurants(order).some(restaurant => restaurant.id === restaurantId)
  ).length;
};

export const getDateDisplayText = (dateFilter: DateFilterType): string => {
  switch (dateFilter) {
    case 'today': return 'Hari Ini';
    case 'yesterday': return 'Kemarin';
    case 'thisWeek': return 'Minggu Ini';
    default: return 'Semua Waktu';
  }
};

export const extractAreasFromOrders = (orders: Order[]): Area[] => {
  const areaMap = new Map<number, Area>();

  const processingOrders = orders.filter(
    order => order.order_status === 'processing' && order.status === 'paid'
  );

  processingOrders.forEach((order) => {
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

  return Array.from(areaMap.values());
};

export const extractRestaurantsFromOrders = (orders: Order[]): Restaurant[] => {
  const restaurantMap = new Map<number, Restaurant>();

  const processingOrders = orders.filter(
    order => order.order_status === 'processing' && order.status === 'paid'
  );

  processingOrders.forEach((order) => {
    if (order.all_restaurants && order.all_restaurants.length > 0) {
      order.all_restaurants.forEach((restaurant) => {
        if (!restaurantMap.has(restaurant.id)) restaurantMap.set(restaurant.id, restaurant);
      });
    } else {
      order.items?.forEach((item) => {
        if (item.menu?.restaurant) {
          const restaurant = item.menu.restaurant;
          if (!restaurantMap.has(restaurant.id)) restaurantMap.set(restaurant.id, restaurant);
        }
      });
    }
  });

  return Array.from(restaurantMap.values());
};

export const paginateOrders = (orders: Order[], page: number, perPage: number): Order[] => {
  return orders.slice((page - 1) * perPage, page * perPage);
};

export const getGroupedItemsByRestaurant = (items: OrderItem[]) => {
  return items.reduce((acc, item) => {
    const restaurantName = item.menu.restaurant?.name || 'Lainnya';
    const areaName = item.menu.restaurant?.area?.name || 'Tidak Diketahui';
    const key = `${restaurantName}-${areaName}`;

    if (!acc[key]) {
      acc[key] = {
        restaurant: item.menu.restaurant,
        area: item.menu.restaurant?.area || null,
        items: []
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, { restaurant: Restaurant | null; area: Area | null; items: OrderItem[] }>);
};