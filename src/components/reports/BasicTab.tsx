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
    <div className="space-y-6">
      {/* Summary */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Ringkasan
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <div className="space-y-6">
          {/* Export Button */}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={handleExportOrdersCSV}
              disabled={isLoadingOrdersDetail}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
            >
              <Download className="h-4 w-4" />
              Export (.CSV)
            </button>
          </div>

          {/* Orders Summary */}
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total Pesanan
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {ordersDetail.summary.total_orders}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total Revenue
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(ordersDetail.summary.total_revenue)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Rata-rata Per Pesanan
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
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
              <div className="border-b border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-700">
                <div className="grid grid-cols-4 gap-4 text-sm font-bold text-slate-900 dark:text-white">
                  <div>{dayData.date}</div>
                  <div>Pesanan: {dayData.total_orders}</div>
                  <div>
                    Total: {formatCurrency(dayData.daily_total)}
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    Akum: {formatCurrency(dayData.cumulative_total)}
                  </div>
                </div>
              </div>

              {/* Orders Table - FIXED */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                        No. Pesanan
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                        Pelanggan
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                        Produk
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                        Harga
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                        Subtotal
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                        Total Order
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
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
                            className="border-t border-slate-200 px-4 py-3 font-medium text-slate-900 dark:border-slate-700 dark:text-white"
                          >
                            {order.order_number}
                          </td>
                          <td
                            rowSpan={orderItemsCount}
                            className="border-t border-slate-200 px-4 py-3 text-slate-700 dark:border-slate-700 dark:text-slate-300"
                          >
                            {order.customer}
                          </td>
                          {order.items.length > 0 ? (
                            <>
                              {/* First Item */}
                              <td className="border-t border-slate-200 px-4 py-3 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {order.items[0].name}
                              </td>
                              <td className="border-t border-slate-200 px-4 py-3 text-center text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {order.items[0].quantity}
                              </td>
                              <td className="border-t border-slate-200 px-4 py-3 text-right text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {formatCurrency(order.items[0].price)}
                              </td>
                              <td className="border-t border-slate-200 px-4 py-3 text-right font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                                {formatCurrency(
                                  order.items[0].subtotal
                                )}
                              </td>
                              <td
                                rowSpan={orderItemsCount}
                                className="border-t border-slate-200 px-4 py-3 text-right font-bold text-blue-600 dark:border-slate-700 dark:text-blue-400"
                              >
                                {formatCurrency(order.total)}
                              </td>
                              <td
                                rowSpan={orderItemsCount}
                                className="border-t border-slate-200 px-4 py-3 text-center dark:border-slate-700"
                              >
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
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
                              <td className="border-t border-slate-200 px-4 py-3 text-slate-500 dark:border-slate-700">
                                No items
                              </td>
                              <td className="border-t border-slate-200 dark:border-slate-700"></td>
                              <td className="border-t border-slate-200 dark:border-slate-700"></td>
                              <td className="border-t border-slate-200 dark:border-slate-700"></td>
                              <td
                                rowSpan={orderItemsCount}
                                className="border-t border-slate-200 px-4 py-3 text-right font-bold text-blue-600 dark:border-slate-700 dark:text-blue-400"
                              >
                                {formatCurrency(order.total)}
                              </td>
                              <td
                                rowSpan={orderItemsCount}
                                className="border-t border-slate-200 px-4 py-3 text-center dark:border-slate-700"
                              >
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
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

                    {/* Additional Item Rows (if more than 1 item per order) */}
                    {dayData.orders.map((order, orderIdx) =>
                      order.items.slice(1).map((item, itemIdx) => (
                        <tr
                          key={`${dayIdx}-${orderIdx}-item-${
                            itemIdx + 1
                          }`}
                          className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                        >
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
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
          <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Pesanan Berdasarkan Status
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
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
                    <td className="px-4 py-3 capitalize text-slate-700 dark:text-slate-300">
                      {item.status}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
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
          <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Ringkasan Pembayaran
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    Transaksi
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
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
                    <td className="px-4 py-3 capitalize text-slate-700 dark:text-slate-300">
                      {item.status}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                      {item.total}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
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
          <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Top 10 Pengguna
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
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
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
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
