'use client';

import {
  Hash,
  CalendarDays,
  User,
  ChevronUp,
  ChevronDown,
  Eye,
  Utensils,
  CheckSquare
} from 'lucide-react';
import { Order } from '../types';
import {
  formatDate,
  getOrderAreas,
  getOrderRestaurants
} from '../utils/orderUtils';
import { StatusBadge } from './StatusBadge';
import { CRSDBadge } from './CRSDBadge';
import { RestaurantAreaBadge } from './RestaurantBadge';
import { QuickActions } from './QuickActions';

interface OrdersMobileCardsProps {
  orders: Order[];
  expandedOrder: number | null;
  onExpandOrder: (orderId: number | null) => void;
}

export const OrdersMobileCards = ({
  orders,
  expandedOrder,
  onExpandOrder
}: OrdersMobileCardsProps) => {
  if (orders.length === 0) return null;

  return (
    <div className="space-y-3 sm:hidden">
      {orders.map((order) => {
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
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {order.crsd_type && (
                    <CRSDBadge type={order.crsd_type} />
                  )}
                  <button
                    onClick={() =>
                      onExpandOrder(
                        expandedOrder === order.id ? null : order.id
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
                    Rp {order.total_price.toLocaleString('id-ID')}
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
                      onClick={() => onExpandOrder(null)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    >
                      Tutup
                    </button>
                  </div>
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, index) => (
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
                                  {item.menu.restaurant?.name}
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
                                Jumlah: {item.quantity}
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
                              {parseInt(item.price).toLocaleString(
                                'id-ID'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          +{order.items.length - 2} item lainnya
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
  );
};
