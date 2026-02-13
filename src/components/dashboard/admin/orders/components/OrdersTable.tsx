'use client';

import { Fragment } from 'react';
import {
  Hash,
  CalendarDays,
  Clock as ClockIcon,
  User,
  ChevronUp,
  ChevronDown,
  Eye,
  Utensils,
  CheckSquare,
  MapPin,
  Store,
  FileText
} from 'lucide-react';
import { Order } from '../types';
import {
  formatShortDate,
  formatDateTime,
  getOrderAreas,
  getOrderRestaurants,
  getGroupedItemsByRestaurant
} from '../utils/orderUtils';
import { StatusBadge } from './StatusBadge';
import { CRSDBadge } from './CRSDBadge';
import { RestaurantAreaBadge } from './RestaurantBadge';
import { QuickActions } from './QuickActions';

interface OrdersTableProps {
  orders: Order[];
  expandedOrder: number | null;
  onExpandOrder: (orderId: number | null) => void;
}

export const OrdersTable = ({
  orders,
  expandedOrder,
  onExpandOrder
}: OrdersTableProps) => {
  if (orders.length === 0) return null;

  return (
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
            {orders.map((order) => {
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
                              {formatShortDate(order.created_at)}
                              <ClockIcon className="h-3 w-3" />
                              {formatDateTime(order.created_at)}
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
                          {order.total_price.toLocaleString('id-ID')}
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
                            onExpandOrder(
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
                                {restaurants.length} restoran •{' '}
                                {areas.length} area •{' '}
                                {order.items.length} pesanan
                              </p>
                            </div>
                            <button
                              onClick={() => onExpandOrder(null)}
                              className="rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 dark:from-gray-700 dark:to-gray-800 dark:text-gray-300"
                            >
                              Tutup
                            </button>
                          </div>

                          {/* Group items by restaurant */}
                          {Object.entries(
                            getGroupedItemsByRestaurant(order.items)
                          ).map(([key, group]) => (
                            <div key={key} className="mb-6 last:mb-0">
                              {/* Restaurant Header */}
                              <div className="mb-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-3 dark:from-blue-900/20 dark:to-blue-800/20">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-800">
                                      <Store className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {group.restaurant?.name ||
                                          'Restoran Tidak Diketahui'}
                                      </h5>
                                      {group.area && (
                                        <div className="mt-0.5 flex items-center gap-1">
                                          <MapPin className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                          <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {group.area.name}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                      {group.items.length} pesanan
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Items List */}
                              <div className="space-y-2">
                                {group.items.map((item, index) => (
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
                                            {item.menu.name}
                                          </p>
                                          <div className="mt-1 flex items-center gap-2">
                                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                              Jumlah: {item.quantity}
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
                                                {item.notes}
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
                                        ).toLocaleString('id-ID')}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}

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
  );
};
