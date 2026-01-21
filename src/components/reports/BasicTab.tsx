import { ShoppingCart, Users, Download } from 'lucide-react';
import { StatBox } from './StatBox';
import {
  generateOrdersAuditCSV,
  downloadFile
} from '@/lib/exportOrdersAudit';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface DayOrder {
  order_id: number;
  order_number: string;
  customer: string;
  status: string;
  items: OrderItem[];
  total: number;
  created_at: string;
}

interface OrderByDate {
  date: string;
  total_orders: number;
  daily_total: number;
  cumulative_total: number;
  orders: DayOrder[];
}

interface ReportsData {
  total_orders: number;
  orders_by_status: Array<{
    status: string;
    total: number;
  }>;
  payment_summary: Array<{
    status: string;
    total: number;
    total_amount: number;
  }>;
  user_statistics: {
    total_users: number;
    total_admins: number;
    active_users: number;
  };
  top_users: Array<{
    id: number;
    name: string;
    email: string;
    orders_count: number;
  }>;
}

interface OrdersDetail {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
  };
  orders_by_date: OrderByDate[];
}

interface BasicTabProps {
  data: ReportsData;
  ordersDetail?: OrdersDetail;
  formatCurrency: (value: number) => string;
  onExportOrders?: () => void;
  isLoadingOrdersDetail?: boolean;
}

export const BasicTab = ({
  data,
  ordersDetail,
  formatCurrency,
  onExportOrders,
  isLoadingOrdersDetail = false
}: BasicTabProps) => {
  const handleExportOrdersCSV = () => {
    if (!ordersDetail) return;

    try {
      let csv = generateOrdersAuditCSV(ordersDetail);

      downloadFile(
        csv,
        `audit-orders-${ordersDetail.period.start_date}-to-${ordersDetail.period.end_date}.csv`,
        'text/csv;charset=utf-8'
      );
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary */}
      <div>
        <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white sm:mb-4 sm:text-lg">
          Ringkasan
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <StatBox
            title="Total Pesanan"
            value={data.total_orders}
            icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatBox
            title="Pengguna Aktif"
            value={data.user_statistics.active_users}
            icon={<Users className="h-5 w-5 text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
          />
        </div>
      </div>

      {/* Orders Detail with Items */}
      {ordersDetail && (
        <div className="space-y-4 sm:space-y-6">
          {/* Export Button */}
          <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
            <button
              onClick={handleExportOrdersCSV}
              disabled={isLoadingOrdersDetail}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600 sm:px-4 sm:text-sm"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Export (.CSV)</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>

          {/* Orders Summary */}
          <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-3 sm:gap-4 sm:p-4 md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total Pesanan
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white sm:text-xl lg:text-2xl">
                {ordersDetail.summary.total_orders}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total Revenue
              </p>
              <p className="mt-2 break-words text-lg font-bold text-slate-900 dark:text-white sm:text-xl lg:text-2xl">
                {formatCurrency(ordersDetail.summary.total_revenue)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Rata-rata Per Pesanan
              </p>
              <p className="mt-2 break-words text-lg font-bold text-slate-900 dark:text-white sm:text-xl lg:text-2xl">
                {formatCurrency(
                  ordersDetail.summary.average_order_value
                )}
              </p>
            </div>
          </div>

          {/* Orders by Date Table */}
          {ordersDetail.orders_by_date.map((dayData, dayIdx) => (
            <div
              key={dayIdx}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
            >
              {/* Day Header */}
              <div className="border-b border-slate-200 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-700 sm:p-4">
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-900 dark:text-white sm:grid-cols-4 sm:gap-4 sm:text-sm">
                  <div className="truncate">
                    <span className="sm:hidden">Tgl: </span>
                    {dayData.date}
                  </div>
                  <div className="truncate">
                    <span className="sm:hidden">Psn: </span>
                    {dayData.total_orders}
                  </div>
                  <div className="hidden truncate sm:block">
                    Total: {formatCurrency(dayData.daily_total)}
                  </div>
                  <div className="truncate text-green-600 dark:text-green-400">
                    <span className="sm:hidden">Akm: </span>
                    {formatCurrency(dayData.cumulative_total)}
                  </div>
                </div>
              </div>

              {/* Orders Table - Responsive Scroll */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                    <tr>
                      <th className="whitespace-nowrap px-2 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                        No. Pesanan
                      </th>
                      <th className="whitespace-nowrap px-2 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                        Pelanggan
                      </th>
                      <th className="whitespace-nowrap px-2 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                        Produk
                      </th>
                      <th className="whitespace-nowrap px-2 py-2 text-center font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                        Qty
                      </th>
                      <th className="whitespace-nowrap px-2 py-2 text-right font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                        Harga
                      </th>
                      <th className="whitespace-nowrap px-2 py-2 text-right font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                        Subtotal
                      </th>
                      <th className="whitespace-nowrap px-2 py-2 text-right font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                        Total Order
                      </th>
                      <th className="whitespace-nowrap px-2 py-2 text-center font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayData.orders.map((order, orderIdx) => {
                      const orderItemsCount = order.items.length || 1;
                      return (
                        <tr key={`${dayIdx}-${orderIdx}`}>
                          <td
                            rowSpan={orderItemsCount}
                            className="whitespace-nowrap border-t border-slate-200 px-2 py-2 font-medium text-slate-900 dark:border-slate-700 dark:text-white sm:px-4 sm:py-3"
                          >
                            {order.order_number}
                          </td>
                          <td
                            rowSpan={orderItemsCount}
                            className="max-w-[100px] truncate border-t border-slate-200 px-2 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-300 sm:px-4 sm:py-3"
                          >
                            {order.customer}
                          </td>
                          {order.items.length > 0 ? (
                            <>
                              {/* First Item */}
                              <td className="max-w-[120px] truncate border-t border-slate-200 px-2 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                                {order.items[0].name}
                              </td>
                              <td className="whitespace-nowrap border-t border-slate-200 px-2 py-2 text-center text-slate-700 dark:border-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                                {order.items[0].quantity}
                              </td>
                              <td className="whitespace-nowrap border-t border-slate-200 px-2 py-2 text-right text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300 sm:px-4 sm:py-3 sm:text-sm">
                                {formatCurrency(order.items[0].price)}
                              </td>
                              <td className="whitespace-nowrap border-t border-slate-200 px-2 py-2 text-right text-xs font-semibold text-slate-900 dark:border-slate-700 dark:text-white sm:px-4 sm:py-3 sm:text-sm">
                                {formatCurrency(
                                  order.items[0].subtotal
                                )}
                              </td>
                              <td
                                rowSpan={orderItemsCount}
                                className="whitespace-nowrap border-t border-slate-200 px-2 py-2 text-right text-xs font-bold text-blue-600 dark:border-slate-700 dark:text-blue-400 sm:px-4 sm:py-3 sm:text-sm"
                              >
                                {formatCurrency(order.total)}
                              </td>
                              <td
                                rowSpan={orderItemsCount}
                                className="border-t border-slate-200 px-2 py-2 text-center dark:border-slate-700 sm:px-4 sm:py-3"
                              >
                                <span
                                  className={`inline-block whitespace-nowrap rounded-full px-1.5 py-0.5 text-xs font-semibold sm:px-2 sm:py-1 ${
                                    order.status === 'completed'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : order.status === 'processing'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="border-t border-slate-200 px-2 py-2 text-slate-500 dark:border-slate-700 sm:px-4 sm:py-3">
                                No items
                              </td>
                              <td className="border-t border-slate-200 dark:border-slate-700"></td>
                              <td className="border-t border-slate-200 dark:border-slate-700"></td>
                              <td className="border-t border-slate-200 dark:border-slate-700"></td>
                              <td
                                rowSpan={orderItemsCount}
                                className="whitespace-nowrap border-t border-slate-200 px-2 py-2 text-right text-xs font-bold text-blue-600 dark:border-slate-700 dark:text-blue-400 sm:px-4 sm:py-3 sm:text-sm"
                              >
                                {formatCurrency(order.total)}
                              </td>
                              <td
                                rowSpan={orderItemsCount}
                                className="border-t border-slate-200 px-2 py-2 text-center dark:border-slate-700 sm:px-4 sm:py-3"
                              >
                                <span
                                  className={`inline-block whitespace-nowrap rounded-full px-1.5 py-0.5 text-xs font-semibold sm:px-2 sm:py-1 ${
                                    order.status === 'completed'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : order.status === 'processing'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}

                    {/* Additional Item Rows */}
                    {dayData.orders.map((order, orderIdx) =>
                      order.items.slice(1).map((item, itemIdx) => (
                        <tr
                          key={`${dayIdx}-${orderIdx}-item-${
                            itemIdx + 1
                          }`}
                          className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                        >
                          <td className="max-w-[120px] truncate px-2 py-2 text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                            {item.name}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-center text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                            {item.quantity}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-right text-xs text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3 sm:text-sm">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-right text-xs font-semibold text-slate-900 dark:text-white sm:px-4 sm:py-3 sm:text-sm">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders by Status Table */}
      {data.orders_by_status.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
              Pesanan Berdasarkan Status
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                    Status
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.orders_by_status.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-3 py-2 capitalize text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                      {item.status}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white sm:px-4 sm:py-3">
                      {item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      {data.payment_summary.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
              Ringkasan Pembayaran
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                    Transaksi
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                    Jumlah
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.payment_summary.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-3 py-2 capitalize text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                      {item.status}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                      {item.total}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white sm:px-4 sm:py-3">
                      {formatCurrency(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Users */}
      {data.top_users.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
              Top 10 Pengguna
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                    Nama
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                    Email
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700 dark:text-slate-300 sm:px-4 sm:py-3">
                    Pesanan
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.top_users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                  >
                    <td className="max-w-[120px] truncate px-3 py-2 font-medium text-slate-900 dark:text-white sm:px-4 sm:py-3">
                      {user.name}
                    </td>
                    <td className="max-w-[150px] truncate px-3 py-2 text-xs text-slate-600 dark:text-slate-400 sm:px-4 sm:py-3 sm:text-sm">
                      {user.email}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white sm:px-4 sm:py-3">
                      {user.orders_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
