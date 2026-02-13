'use client';

import { RefreshCw, Download, ShoppingCart } from 'lucide-react';
import { Order } from '../types';
import { formatCurrency } from '../utils/orderUtils';
import * as XLSX from 'xlsx';

interface OrdersHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  filteredOrders: Order[];
  onExport?: () => Order[];
}

export const OrdersHeader = ({
  onRefresh,
  isRefreshing,
  filteredOrders,
  onExport
}: OrdersHeaderProps) => {
  const handleExportExcel = () => {
    try {
      const orders = onExport ? onExport() : filteredOrders;

      const worksheet = XLSX.utils.json_to_sheet(
        orders.map((order) => ({
          'Kode Order': order.order_code,
          Pelanggan: order.user.name,
          Email: order.user.email,
          Telepon: order.user.phone,
          'Divisi CRSD': order.user.divisi || '-',
          Restoran:
            order.all_restaurants?.map((r) => r.name).join(', ') ||
            '-',
          Area: order.all_areas?.map((a) => a.name).join(', ') || '-',
          'Status Order':
            order.order_status === 'processing'
              ? 'Menunggu'
              : 'Selesai',
          'Status Pembayaran':
            order.status === 'paid' ? 'Dibayar' : 'Pending',
          Total: order.total_price,
          'Jumlah Item': order.items.length,
          'Jumlah Restoran': order.restaurants_count || 0,
          'Jumlah Area': order.areas_count || 0,
          Tanggal: new Date(order.created_at).toLocaleDateString(
            'id-ID'
          ),
          Waktu: new Date(order.created_at).toLocaleTimeString(
            'id-ID'
          ),
          'Catatan Pesanan': order.notes || '-'
        }))
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

  return (
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
            onClick={onRefresh}
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
  );
};
