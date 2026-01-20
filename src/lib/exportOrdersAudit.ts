interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
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
  orders: Order[];
}

export interface OrdersDetail {
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

/**
 * Generate professional TXT export untuk audit (format pretty)
 */
export const generateOrdersAuditTXT = (
  data: OrdersDetail
): string => {
  const now = new Date();
  const lines: string[] = [];

  // Header - Company Info
  lines.push(
    '┌─────────────────────────────────────────────────────────────┐'
  );
  lines.push(
    '│                  LAPORAN AUDIT PESANAN                       │'
  );
  lines.push(
    '│                    (ORDER AUDIT REPORT)                      │'
  );
  lines.push(
    '└─────────────────────────────────────────────────────────────┘'
  );
  lines.push('');

  // Meta Information
  lines.push(
    `Periode:              ${data.period.start_date} s/d ${data.period.end_date}`
  );
  lines.push(
    `Tanggal Export:       ${now.toLocaleDateString('id-ID')}`
  );
  lines.push(
    `Waktu Export:         ${now.toLocaleTimeString('id-ID')}`
  );
  lines.push('');

  // Summary Section
  lines.push(
    '═════════════════════════════════════════════════════════════'
  );
  lines.push('RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)');
  lines.push(
    '═════════════════════════════════════════════════════════════'
  );
  lines.push('');
  lines.push(
    `  Total Pesanan         : ${data.summary.total_orders.toLocaleString(
      'id-ID'
    )} unit`
  );
  lines.push(
    `  Total Revenue         : Rp ${data.summary.total_revenue.toLocaleString(
      'id-ID'
    )}`
  );
  lines.push(
    `  Rata-rata per Pesanan : Rp ${data.summary.average_order_value.toLocaleString(
      'id-ID'
    )}`
  );
  lines.push('');
  lines.push(
    '═════════════════════════════════════════════════════════════'
  );
  lines.push('');

  // Detail by Date
  lines.push('DETAIL PESANAN HARIAN (DAILY ORDER DETAILS)');
  lines.push(
    '═════════════════════════════════════════════════════════════'
  );
  lines.push('');

  data.orders_by_date.forEach((dayData, dayIdx) => {
    // Day Header
    lines.push(
      '┌─────────────────────────────────────────────────────────────┐'
    );
    lines.push(`│ TANGGAL: ${dayData.date.padEnd(53)} │`);
    lines.push(
      '├─────────────────────────────────────────────────────────────┤'
    );
    lines.push(
      `│ Total Pesanan Hari Ini: ${String(
        dayData.total_orders
      ).padEnd(37)} │`
    );
    lines.push(
      `│ Total Harian:           Rp ${String(
        dayData.daily_total.toLocaleString('id-ID')
      ).padEnd(31)} │`
    );
    lines.push(
      `│ Akumulasi Kumulatif:    Rp ${String(
        dayData.cumulative_total.toLocaleString('id-ID')
      ).padEnd(31)} │`
    );
    lines.push(
      '├─────────────────────────────────────────────────────────────┤'
    );
    lines.push('');

    // Orders Table Header
    lines.push(
      '┌──────┬──────────────────┬──────────────────┬──────────┬─────────┬──────────┬───────────────┐'
    );
    lines.push(
      '│ No.  │ Nomor Pesanan    │ Pelanggan        │ Status   │ Qty     │ Harga    │ Subtotal      │'
    );
    lines.push(
      '├──────┼──────────────────┼──────────────────┼──────────┼─────────┼──────────┼───────────────┤'
    );

    // Orders Data
    dayData.orders.forEach((order, orderIdx) => {
      order.items.forEach((item, itemIdx) => {
        const rowNum = String(orderIdx + 1).padEnd(4);
        const orderNum = order.order_number.padEnd(16);
        const customer = order.customer.substring(0, 16).padEnd(16);
        const status = order.status.padEnd(8);
        const qty = String(item.quantity).padStart(7);
        const price = `Rp ${item.price.toLocaleString(
          'id-ID'
        )}`.padStart(8);
        const subtotal = `Rp ${item.subtotal.toLocaleString(
          'id-ID'
        )}`.padStart(13);

        if (itemIdx === 0) {
          lines.push(
            `│ ${rowNum} │ ${orderNum} │ ${customer} │ ${status} │${qty} │${price} │${subtotal} │`
          );
        } else {
          lines.push(
            `│      │ (lanjutan)       │                  │          │${qty} │${price} │${subtotal} │`
          );
        }
      });

      // Order total row
      lines.push(
        `│      │ TOTAL PESANAN    │                  │          │       │          │ Rp ${String(
          order.total.toLocaleString('id-ID')
        ).padStart(9)} │`
      );
      lines.push(
        '├──────┼──────────────────┼──────────────────┼──────────┼─────────┼──────────┼───────────────┤'
      );
    });

    // Day Summary
    lines.push(
      `│ TOTAL HARIAN       : ${String(dayData.total_orders).padEnd(
        26
      )} Pesanan                     │`
    );
    lines.push(
      `│ TOTAL REVENUE      : Rp ${String(
        dayData.daily_total.toLocaleString('id-ID')
      ).padEnd(42)} │`
    );
    lines.push(
      `│ AKUMULASI          : Rp ${String(
        dayData.cumulative_total.toLocaleString('id-ID')
      ).padEnd(42)} │`
    );
    lines.push(
      '└─────────────────────────────────────────────────────────────┘'
    );
    lines.push('');
  });

  // Final Summary
  lines.push(
    '═════════════════════════════════════════════════════════════'
  );
  lines.push('RINGKASAN AKHIR (FINAL SUMMARY)');
  lines.push(
    '═════════════════════════════════════════════════════════════'
  );
  lines.push('');
  lines.push(
    `  Periode Laporan       : ${data.period.start_date} s/d ${data.period.end_date}`
  );
  lines.push(
    `  Jumlah Hari           : ${data.orders_by_date.length} hari`
  );
  lines.push(
    `  Total Pesanan         : ${data.summary.total_orders.toLocaleString(
      'id-ID'
    )} unit`
  );
  lines.push(
    `  Total Revenue         : Rp ${data.summary.total_revenue.toLocaleString(
      'id-ID'
    )}`
  );
  lines.push(
    `  Rata-rata Per Pesanan : Rp ${data.summary.average_order_value.toLocaleString(
      'id-ID'
    )}`
  );
  lines.push('');
  lines.push(
    '═════════════════════════════════════════════════════════════'
  );
  lines.push('');

  // Signature
  lines.push('Catatan Audit / Audit Notes:');
  lines.push(
    '─────────────────────────────────────────────────────────────'
  );
  lines.push(
    'Laporan ini dibuat secara otomatis oleh sistem untuk keperluan'
  );
  lines.push(
    'audit internal. Silakan verifikasi data dengan sumber data'
  );
  lines.push('utama sebelum digunakan untuk keperluan resmi.');
  lines.push('');
  lines.push(
    'This report is generated automatically by the system for'
  );
  lines.push(
    'internal audit purposes. Please verify the data with the'
  );
  lines.push(
    'primary data source before using for official purposes.'
  );
  lines.push('');
  lines.push(
    '═════════════════════════════════════════════════════════════'
  );
  lines.push(`Generated by: Audit System`);
  lines.push(`Date: ${now.toISOString()}`);
  lines.push(
    '═════════════════════════════════════════════════════════════'
  );

  return lines.join('\n');
};

/**
 * Generate Excel-style CSV dengan separator
 */
export const generateOrdersAuditCSV = (
  data: OrdersDetail
): string => {
  const now = new Date();
  const lines: string[] = [];

  // Header
  lines.push('LAPORAN AUDIT PESANAN');
  lines.push('ORDER AUDIT REPORT');
  lines.push('');
  lines.push(
    `Periode,${data.period.start_date} s/d ${data.period.end_date}`
  );
  lines.push(`Tanggal Export,${now.toLocaleDateString('id-ID')}`);
  lines.push(`Waktu Export,${now.toLocaleTimeString('id-ID')}`);
  lines.push('');

  // Summary
  lines.push('RINGKASAN EKSEKUTIF');
  lines.push('Total Pesanan,' + data.summary.total_orders);
  lines.push('Total Revenue,' + data.summary.total_revenue);
  lines.push(
    'Rata-rata per Pesanan,' + data.summary.average_order_value
  );
  lines.push('');

  // Detail by Date
  lines.push('DETAIL PESANAN HARIAN');
  lines.push('');

  data.orders_by_date.forEach((dayData) => {
    lines.push(`Tanggal,${dayData.date}`);
    lines.push(`Total Pesanan Hari Ini,${dayData.total_orders}`);
    lines.push(`Total Harian,${dayData.daily_total}`);
    lines.push(`Akumulasi Kumulatif,${dayData.cumulative_total}`);
    lines.push('');

    // Table Header
    lines.push(
      'No.,Nomor Pesanan,Pelanggan,Status,Produk,Qty,Harga,Subtotal,Total Pesanan'
    );

    // Orders Data
    dayData.orders.forEach((order, orderIdx) => {
      order.items.forEach((item, itemIdx) => {
        const row = [
          String(orderIdx + 1),
          order.order_number,
          order.customer,
          order.status,
          item.name,
          String(item.quantity),
          String(item.price),
          String(item.subtotal),
          itemIdx === 0 ? String(order.total) : ''
        ];
        lines.push(row.map((v) => `"${v}"`).join(','));
      });
    });

    lines.push('');
    lines.push(`Total Harian,${dayData.daily_total}`);
    lines.push(`Akumulasi,${dayData.cumulative_total}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  // Final Summary
  lines.push('RINGKASAN AKHIR');
  lines.push(
    `Periode,${data.period.start_date} s/d ${data.period.end_date}`
  );
  lines.push(`Jumlah Hari,${data.orders_by_date.length}`);
  lines.push(`Total Pesanan,${data.summary.total_orders}`);
  lines.push(`Total Revenue,${data.summary.total_revenue}`);
  lines.push(
    `Rata-rata Per Pesanan,${data.summary.average_order_value}`
  );

  return lines.join('\n');
};

/**
 * Generate Excel-style CSV (alias for backward compatibility)
 */
export const generateOrdersAuditCSVExcel = (
  data: OrdersDetail
): string => {
  return generateOrdersAuditCSV(data);
};

/**
 * Download file utility
 */
export const downloadFile = (
  content: string,
  fileName: string,
  type: string
): void => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
