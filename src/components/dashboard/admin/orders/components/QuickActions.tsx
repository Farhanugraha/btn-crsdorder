'use client';

import { useState } from 'react';
import { MoreVertical, Eye, Copy, FileText } from 'lucide-react';
import { Order } from '../types';

interface QuickActionsProps {
  order: Order;
}

export const QuickActions = ({ order }: QuickActionsProps) => {
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
          const html = generateInvoiceHTML(order);
          printWindow.document.write(html);
          printWindow.document.close();
          setTimeout(() => printWindow.print(), 500);
        }
      }
    }
  ];

  const generateInvoiceHTML = (order: Order): string => {
    const groupedItems = order.items.reduce(
      (acc, item) => {
        const restaurantName =
          item.menu.restaurant?.name || 'Lainnya';
        if (!acc[restaurantName]) acc[restaurantName] = [];
        acc[restaurantName].push(item);
        return acc;
      },
      {} as Record<string, typeof order.items>
    );

    return `
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
              <p>Tanggal: ${new Date(order.created_at).toLocaleString(
                'id-ID',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }
              )}</p>
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
                  order.status === 'paid' ? 'Dibayar' : 'Pending'
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
            
            ${Object.entries(groupedItems)
              .map(
                ([restaurantName, items]) => `
              <div class="item-group">
                <div class="item-group-header">
                  <h5>${restaurantName}</h5>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Pesanan</th>
                      <th>Jumlah</th>
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
              .join('')}
            
            <div class="total">
              <h3>Total: Rp ${order.total_price.toLocaleString(
                'id-ID'
              )}</h3>
            </div>
          </div>
        </body>
      </html>
    `;
  };

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
};
