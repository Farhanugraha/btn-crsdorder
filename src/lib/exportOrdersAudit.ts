// @/lib/exportOrdersAudit.ts

// ============================================================
// INTERFACES
// ============================================================

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes?: string | null;
}

export interface Order {
  order_id: number;
  order_number: string;
  customer: string;
  order_status: string;
  payment_status: string;
  restaurant_name: string;
  area_name: string;
  area_icon?: string;
  notes?: string | null;
  items: OrderItem[];
  total: number;
  created_at: string;
}

export interface OrderByDate {
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

// ============================================================
// COLOR CONSTANTS
// ============================================================

const COLORS = {
  primary:   '1F3A70',
  secondary: '366092',
  accent:    'E8EEF7',
  success:   '10B981',
  lightGray: 'F9FAFB',
  gray:      'F3F4F6',
  border:    'D1D5DB',
  white:     'FFFFFF',
  dark:      '1F2937',
};

// ============================================================
// EXCEL BORDER HELPERS
// ============================================================

const thinBorder = {
  top:    { style: 'thin' as const, color: { rgb: COLORS.border } },
  bottom: { style: 'thin' as const, color: { rgb: COLORS.border } },
  left:   { style: 'thin' as const, color: { rgb: COLORS.border } },
  right:  { style: 'thin' as const, color: { rgb: COLORS.border } },
};

const mediumBottomBorder = {
  top:    { style: 'thin'   as const, color: { rgb: COLORS.border } },
  bottom: { style: 'medium' as const, color: { rgb: COLORS.border } },
  left:   { style: 'thin'   as const, color: { rgb: COLORS.border } },
  right:  { style: 'thin'   as const, color: { rgb: COLORS.border } },
};

// ============================================================
// EXCEL STYLE HELPERS
// ============================================================

const styleTitlePrimary = () => ({
  font:      { bold: true, color: { rgb: COLORS.white }, size: 14 },
  fill:      { fgColor: { rgb: COLORS.primary } },
  alignment: { horizontal: 'center' as const, vertical: 'center' as const },
  border:    thinBorder,
});

const styleSectionHeader = () => ({
  font:      { bold: true, color: { rgb: COLORS.white }, size: 12 },
  fill:      { fgColor: { rgb: COLORS.secondary } },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const },
  border:    thinBorder,
});

const styleColHeader = () => ({
  font:      { bold: true, color: { rgb: COLORS.white }, size: 11 },
  fill:      { fgColor: { rgb: COLORS.secondary } },
  alignment: { horizontal: 'center' as const, vertical: 'center' as const, wrapText: true },
  border:    thinBorder,
});

const styleDataLabel = (bgColor = COLORS.lightGray) => ({
  font:      { bold: true, size: 11 },
  fill:      { fgColor: { rgb: bgColor } },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const },
  border:    thinBorder,
});

const styleDataValue = (bgColor = COLORS.lightGray) => ({
  font:      { bold: true, size: 11 },
  fill:      { fgColor: { rgb: bgColor } },
  alignment: { horizontal: 'right' as const, vertical: 'center' as const },
  numFmt:    '#,##0',
  border:    thinBorder,
});

const styleNormalLeft = () => ({
  font:      { size: 10 },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const },
  border:    thinBorder,
});

const styleNormalRight = () => ({
  font:      { size: 10 },
  alignment: { horizontal: 'right' as const, vertical: 'center' as const },
  numFmt:    '#,##0',
  border:    thinBorder,
});

const styleDailyData = (bgColor: string, alignRight: boolean) => ({
  font:      { size: 10 },
  fill:      { fgColor: { rgb: bgColor } },
  alignment: { horizontal: alignRight ? ('right' as const) : ('left' as const), vertical: 'center' as const },
  numFmt:    alignRight ? '#,##0' : '@',
  border:    thinBorder,
});

const styleTotalRow = (col: number) => ({
  font:      { bold: true, color: { rgb: COLORS.white }, size: 11 },
  fill:      { fgColor: { rgb: COLORS.success } },
  alignment: { horizontal: col === 0 ? ('left' as const) : ('right' as const), vertical: 'center' as const },
  numFmt:    col > 0 ? '#,##0' : '@',
  border:    thinBorder,
});

const styleDetailTitle = () => ({
  font:      { bold: true, color: { rgb: COLORS.white }, size: 13 },
  fill:      { fgColor: { rgb: COLORS.primary } },
  alignment: { horizontal: 'left' as const, vertical: 'center' as const },
  border:    thinBorder,
});

const styleDetailData = (
  bgColor:    string,
  bold:       boolean,
  alignRight: boolean,
  wrapText:   boolean,
) => ({
  font:      { bold, size: 10, color: { rgb: COLORS.dark } },
  fill:      { fgColor: { rgb: bgColor } },
  alignment: {
    horizontal: alignRight ? ('right' as const) : ('left' as const),
    vertical:   'center' as const,
    wrapText,
  },
  numFmt: alignRight ? '#,##0' : '@',
  border: thinBorder,
});

const styleSubtotalPesanan = (col: number) => ({
  font:      { bold: true, size: 10, color: { rgb: COLORS.dark } },
  fill:      { fgColor: { rgb: COLORS.accent } },
  alignment: {
    horizontal: (col >= 7 || col === 5) ? ('right' as const) : ('left' as const),
    vertical:   'center' as const,
  },
  numFmt: col >= 7 ? '#,##0' : '@',
  border: thinBorder,
});

const styleTotalHarian = (col: number) => ({
  font:      { bold: true, size: 11, color: { rgb: COLORS.white } },
  fill:      { fgColor: { rgb: COLORS.success } },
  alignment: {
    horizontal: col >= 7 ? ('right' as const) : ('left' as const),
    vertical:   'center' as const,
  },
  numFmt: col >= 7 ? '#,##0' : '@',
  border: mediumBottomBorder,
});

// ============================================================
// EXCEL EXPORT
// ============================================================
/**
 * Menghasilkan file Excel dengan 3 jenis sheet:
 *
 * Sheet 1 - Ringkasan        : Info periode + ringkasan keseluruhan
 * Sheet 2 - Ringkasan Harian : Tabel per tanggal (total & kumulatif)
 * Sheet 3+ - Detail Per Hari : Satu sheet per tanggal dengan kolom:
 *   No. | Pelanggan | Restoran | Area | Catatan Pesanan | Nama Produk | Catatan Khusus | Qty | Harga Satuan | Subtotal
 */
export const generateOrdersAuditExcel = async (data: OrdersDetail): Promise<void> => {
  try {
    const XLSX = await import('xlsx');
    const now  = new Date();
    const wb   = XLSX.utils.book_new();

    if (!data.orders_by_date || data.orders_by_date.length === 0) {
      throw new Error('Tidak ada data pesanan untuk diexport');
    }

    // ===========================================================
    // SHEET 1 : RINGKASAN EKSEKUTIF
    // ===========================================================
    const summaryData: (string | number)[][] = [
      ['LAPORAN PESANAN - RINGKASAN EKSEKUTIF'],
      [''],
      ['Periode',               `${data.period.start_date} s/d ${data.period.end_date}`],
      ['Tanggal Export',        now.toLocaleDateString('id-ID')],
      ['Waktu Export',          now.toLocaleTimeString('id-ID')],
      [''],
      ['RINGKASAN KESELURUHAN'],
      ['Total Pesanan',         data.summary.total_orders],
      ['Total Revenue',         data.summary.total_revenue],
      ['Rata-rata per Pesanan', data.summary.average_order_value],
      ['Jumlah Hari',           data.orders_by_date.length],
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    ws1['!cols'] = [{ wch: 30 }, { wch: 28 }];
    ws1['!rows'] = [{ hpx: 28 }, { hpx: 6 }];

    for (let i = 0; i < summaryData.length; i++) {
      const cA = XLSX.utils.encode_cell({ r: i, c: 0 });
      const cB = XLSX.utils.encode_cell({ r: i, c: 1 });

      if (i === 0) {
        // Judul utama
        if (ws1[cA]) ws1[cA].s = styleTitlePrimary();
      } else if (i === 6) {
        // Sub-header "RINGKASAN KESELURUHAN"
        if (ws1[cA]) ws1[cA].s = styleSectionHeader();
      } else if (i >= 7 && i <= 10) {
        // Baris data ringkasan
        if (ws1[cA]) ws1[cA].s = styleDataLabel(COLORS.lightGray);
        if (ws1[cB]) ws1[cB].s = styleDataValue(COLORS.lightGray);
      } else if (i !== 1 && i !== 5) {
        // Baris info periode & tanggal
        if (ws1[cA]) ws1[cA].s = styleNormalLeft();
        if (ws1[cB]) ws1[cB].s = styleNormalRight();
      }
    }

    XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan');

    // ===========================================================
    // SHEET 2 : RINGKASAN HARIAN
    // ===========================================================
    const dailySummaryData: (string | number)[][] = [
      ['RINGKASAN HARIAN PESANAN'],
      ['Tanggal', 'Total Pesanan', 'Daily Total (Rp)', 'Cumulative Total (Rp)'],
    ];

    data.orders_by_date.forEach((dayData) => {
      dailySummaryData.push([
        dayData.date,
        dayData.total_orders,
        dayData.daily_total,
        dayData.cumulative_total,
      ]);
    });

    dailySummaryData.push([
      'TOTAL PERIODE',
      data.summary.total_orders,
      data.summary.total_revenue,
      '',
    ]);

    const ws2 = XLSX.utils.aoa_to_sheet(dailySummaryData);
    ws2['!cols'] = [{ wch: 18 }, { wch: 16 }, { wch: 22 }, { wch: 24 }];
    ws2['!rows'] = [{ hpx: 24 }, { hpx: 20 }];

    // Row 0 - judul
    for (let c = 0; c < 4; c++) {
      const cell = XLSX.utils.encode_cell({ r: 0, c });
      if (ws2[cell]) {
        ws2[cell].s = {
          font:      { bold: true, color: { rgb: COLORS.white }, size: 12 },
          fill:      { fgColor: { rgb: COLORS.primary } },
          alignment: { horizontal: 'center' as const, vertical: 'center' as const },
          border:    thinBorder,
        };
      }
    }

    // Row 1 - header kolom
    for (let c = 0; c < 4; c++) {
      const cell = XLSX.utils.encode_cell({ r: 1, c });
      if (ws2[cell]) ws2[cell].s = styleColHeader();
    }

    // Row 2 dst - data harian
    for (let row = 2; row < dailySummaryData.length - 1; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = XLSX.utils.encode_cell({ r: row, c: col });
        if (ws2[cell]) {
          const bg = row % 2 === 0 ? COLORS.gray : COLORS.white;
          ws2[cell].s = styleDailyData(bg, col > 0);
        }
      }
    }

    // Row terakhir - total
    const totalRowIdx = dailySummaryData.length - 1;
    for (let c = 0; c < 4; c++) {
      const cell = XLSX.utils.encode_cell({ r: totalRowIdx, c });
      if (ws2[cell]) ws2[cell].s = styleTotalRow(c);
    }

    XLSX.utils.book_append_sheet(wb, ws2, 'Ringkasan Harian');

    // ===========================================================
    // SHEET 3+ : DETAIL PER HARI
    // Kolom (10):
    //   0  No.
    //   1  Pelanggan
    //   2  Restoran
    //   3  Area
    //   4  Catatan Pesanan
    //   5  Nama Produk
    //   6  Catatan Khusus
    //   7  Qty
    //   8  Harga Satuan
    //   9  Subtotal
    // ===========================================================
    data.orders_by_date.forEach((dayData) => {
      const sheetName = dayData.date.substring(0, 31);

      const dayRows: (string | number | null)[][] = [
        [`DETAIL PESANAN - ${dayData.date}`],
        [''],
        [
          'No.',
          'Pelanggan',
          'Restoran',
          'Area',
          'Catatan Pesanan',
          'Nama Produk',
          'Catatan Khusus',
          'Qty',
          'Harga Satuan',
          'Subtotal',
        ],
      ];

      dayData.orders.forEach((order, orderIdx) => {
        let isFirstItem = true;

        order.items.forEach((item) => {
          dayRows.push([
            isFirstItem ? orderIdx + 1                         : '',
            isFirstItem ? order.customer                       : '',
            isFirstItem ? (order.restaurant_name || '-')       : '',
            isFirstItem ? (order.area_name        || '-')      : '',
            isFirstItem ? (order.notes            || '-')      : '',
            item.name,
            item.notes || '-',
            item.quantity,
            item.price,
            item.subtotal,
          ]);
          isFirstItem = false;
        });

        // Baris subtotal per pesanan
        dayRows.push([
          '',
          '',
          '',
          '',
          '',
          'TOTAL PESANAN',
          '',
          '',
          '',
          order.total,
        ]);
      });

      dayRows.push(['']); // spasi
      dayRows.push([
        'TOTAL HARIAN',
        `${dayData.total_orders} Pesanan`,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        dayData.daily_total,
      ]);

      const ws = XLSX.utils.aoa_to_sheet(dayRows);

      ws['!cols'] = [
        { wch: 6  }, // No.
        { wch: 20 }, // Pelanggan
        { wch: 22 }, // Restoran
        { wch: 16 }, // Area
        { wch: 28 }, // Catatan Pesanan
        { wch: 26 }, // Nama Produk
        { wch: 28 }, // Catatan Khusus
        { wch: 7  }, // Qty
        { wch: 16 }, // Harga Satuan
        { wch: 16 }, // Subtotal
      ];

      ws['!rows'] = [{ hpx: 22 }, { hpx: 6 }, { hpx: 22 }];

      // Baris 0 : judul sheet
      const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
      if (ws[titleCell]) ws[titleCell].s = styleDetailTitle();

      // Baris 2 : header kolom
      for (let c = 0; c < 10; c++) {
        const cell = XLSX.utils.encode_cell({ r: 2, c });
        if (ws[cell]) ws[cell].s = styleColHeader();
      }

      // Baris 3+ : data
      let itemCount = 0;
      for (let row = 3; row < dayRows.length; row++) {
        const rowData        = dayRows[row];
        const isTotalPesanan = rowData[5] === 'TOTAL PESANAN';
        const isTotalHarian  = rowData[0] === 'TOTAL HARIAN';
        const isSpacer       = rowData[0] === '' && !isTotalPesanan;

        if (isSpacer) continue;

        for (let col = 0; col < 10; col++) {
          const cell = XLSX.utils.encode_cell({ r: row, c: col });
          if (!ws[cell]) continue;

          if (isTotalHarian) {
            ws[cell].s = styleTotalHarian(col);
          } else if (isTotalPesanan) {
            ws[cell].s = styleSubtotalPesanan(col);
          } else {
            itemCount++;
            const bg     = itemCount % 2 === 0 ? COLORS.gray : COLORS.white;
            const isNum  = col >= 7;
            // wrap text untuk kolom notes & produk (col 4, 5, 6)
            const doWrap = col >= 4 && col <= 6;
            ws[cell].s   = styleDetailData(bg, false, isNum, doWrap);
          }
        }
      }

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    // Simpan file
    const fileName = `audit-orders-${data.period.start_date}-to-${data.period.end_date}.xlsx`;
    XLSX.writeFile(wb, fileName);
    console.log('✅ Excel generated:', fileName);
  } catch (error) {
    console.error('❌ Error generating Excel:', error);
    throw error;
  }
};

// ============================================================
// PDF EXPORT
// ============================================================

export const generateOrdersAuditPDF = async (data: OrdersDetail): Promise<void> => {
  try {
    const { jsPDF }   = await import('jspdf');
    const html2canvas = await import('html2canvas');
    const now         = new Date();

    const container                 = document.createElement('div');
    container.style.position        = 'absolute';
    container.style.left            = '-9999px';
    container.style.width           = '210mm';
    container.style.backgroundColor = 'white';
    container.style.fontFamily      = 'Arial, sans-serif';

    // ─── CSS ────────────────────────────────────────────────────────────────────
    const css = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body {
        font-family: 'Segoe UI', Arial, sans-serif;
        color: #2c3e50;
        line-height: 1.5;
        width: 210mm;
        background-color: #ffffff;
      }
      .page-break {
        page-break-after: always;
        page-break-inside: avoid;
      }
      .container {
        padding: 15px 20px;
        width: 100%;
      }

      /* ── Header ────────────────────────────────────── */
      .header {
        text-align: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #3498db;
      }
      .header h1 {
        color: #2c3e50;
        font-size: 20px;
        margin-bottom: 5px;
        font-weight: 700;
        letter-spacing: 1px;
      }
      .header .subtitle {
        color: #7f8c8d;
        font-size: 11px;
        font-style: italic;
      }

      /* ── Info Box ──────────────────────────────────── */
      .info-box {
        background-color: #f8f9fa;
        border-left: 4px solid #3498db;
        padding: 12px 15px;
        margin-bottom: 20px;
        border-radius: 0 4px 4px 0;
        font-size: 11px;
      }
      .info-box p {
        margin: 4px 0;
        color: #34495e;
      }
      .info-box strong {
        color: #2c3e50;
        min-width: 110px;
        display: inline-block;
      }

      /* ── Section Title ─────────────────────────────── */
      .section-title {
        background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
        color: white;
        padding: 8px 15px;
        margin: 20px 0 15px 0;
        font-weight: 600;
        font-size: 14px;
        border-radius: 4px;
        letter-spacing: 0.5px;
      }
      .date-title {
        background-color: #ebf5fb;
        color: #2c3e50;
        padding: 10px 15px;
        margin: 15px 0 10px 0;
        font-weight: 600;
        font-size: 13px;
        border-left: 4px solid #3498db;
        border-radius: 0 4px 4px 0;
      }

      /* ── Summary Cards ─────────────────────────────── */
      .summary-cards {
        display: flex;
        gap: 12px;
        margin-bottom: 25px;
        flex-wrap: wrap;
      }
      .card {
        flex: 1;
        min-width: 110px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 12px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(52, 152, 219, 0.1);
      }
      .card-value {
        font-size: 17px;
        font-weight: 700;
        color: #2980b9;
        margin-top: 4px;
      }
      .card-label {
        font-size: 10px;
        color: #7f8c8d;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* ── Table ─────────────────────────────────────── */
      .table-wrap {
        margin: 8px 0 18px 0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
        page-break-inside: avoid;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 8px;
        background-color: white;
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      thead {
        display: table-header-group;
      }
      tfoot {
        display: table-footer-group;
      }
      th {
        background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
        color: white;
        padding: 8px 5px;
        text-align: left;
        font-weight: 600;
        white-space: nowrap;
      }
      td {
        padding: 6px 5px;
        border-bottom: 1px solid #e0e0e0;
        vertical-align: top;
        text-align: left;
      }
      tr:last-child td {
        border-bottom: none;
      }

      /* ── Notes Styling ─────────────────────────────── */
      .notes-val {
        font-size: 7.5px;
        color: #555e6a;
        font-style: italic;
        word-break: break-word;
        max-width: 100%;
      }
      .notes-empty {
        font-size: 7.5px;
        color: #bdc3c7;
        font-style: italic;
      }
      .product-name {
        font-weight: 600;
        color: #2c3e50;
        font-size: 8px;
      }

      /* ── Total Rows ────────────────────────────────── */
      .order-total td {
        background-color: #e8f4fc;
        font-weight: 600;
        color: #2c3e50;
        border-top: 1px solid #b0d4f0;
      }
      .order-total .amt {
        text-align: right;
        font-weight: 700;
        color: #2980b9;
      }
      .daily-total td {
        background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
        color: white;
        font-weight: 700;
        padding: 8px 5px;
        border: none;
      }
      .daily-total .amt {
        text-align: right;
        color: white;
        font-weight: 700;
      }

      /* ── Footer ────────────────────────────────────── */
      .footer {
        margin-top: 25px;
        padding: 12px 18px;
        background-color: #f8f9fa;
        border-radius: 8px;
        font-size: 8.5px;
        color: #7f8c8d;
        text-align: center;
        border-top: 1px solid #dee2e6;
        page-break-inside: avoid;
      }

      /* ── Utilities ─────────────────────────────────── */
      .keep-together { page-break-inside: avoid; }
      .text-right    { text-align: right !important; }
      .text-center   { text-align: center !important; }
      .mt-20         { margin-top: 20px; }
      .mb-10         { margin-bottom: 10px; }
    `;

    // ─── HTML Build ──────────────────────────────────────────────────────────────
    let htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${css}</style>
</head>
<body>
<div class="container">

  <!-- ── Dokumen Header ── -->
  <div class="header">
    <h1>LAPORAN PESANAN</h1>
    <div class="subtitle">CRSD Order Audit Report</div>
  </div>

  <!-- ── Info Box ── -->
  <div class="info-box">
    <p>
      <strong>Periode:</strong>
      ${data.period.start_date} s/d ${data.period.end_date}
    </p>
    <p>
      <strong>Tanggal Cetak:</strong>
      ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
    </p>
    <p>
      <strong>Waktu Cetak:</strong>
      ${now.toLocaleTimeString('id-ID')}
    </p>
  </div>

  <!-- ── Summary Cards ── -->
  <div class="summary-cards">
    <div class="card">
      <div class="card-label">Total Pesanan</div>
      <div class="card-value">${data.summary.total_orders}</div>
    </div>
    <div class="card">
      <div class="card-label">Total Pendapatan</div>
      <div class="card-value">Rp ${data.summary.total_revenue.toLocaleString('id-ID')}</div>
    </div>
    <div class="card">
      <div class="card-label">Rata-rata</div>
      <div class="card-value">Rp ${data.summary.average_order_value.toLocaleString('id-ID')}</div>
    </div>
    <div class="card">
      <div class="card-label">Hari</div>
      <div class="card-value">${data.orders_by_date.length}</div>
    </div>
  </div>
`;

    // ─── Per-Day Tables ──────────────────────────────────────────────────────────
    data.orders_by_date.forEach((dayData, dayIndex) => {
      const isNotFirst = dayIndex > 0;

      htmlContent += `
  <!-- ── Hari ${dayIndex + 1}: ${dayData.date} ── -->
  <div class="keep-together ${isNotFirst ? 'page-break' : ''}">

    <div class="date-title">
      📅 ${new Date(dayData.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
        year:    'numeric',
      })}
      <span style="float:right; font-weight:normal; color:#2980b9;">
        ${dayData.total_orders} Pesanan &nbsp;|&nbsp; Rp ${dayData.daily_total.toLocaleString('id-ID')}
      </span>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:3%;">No</th>
            <th style="width:11%;">Pelanggan</th>
            <th style="width:13%;">Restoran</th>
            <th style="width:9%;">Area</th>
            <th style="width:13%;">Catatan Pesanan</th>
            <th style="width:17%;">Produk</th>
            <th style="width:13%;">Catatan Khusus</th>
            <th style="width:4%;">Qty</th>
            <th style="width:8%;">Harga</th>
            <th style="width:9%;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
`;

      // Baris item
      dayData.orders.forEach((order, orderIdx) => {
        order.items.forEach((item, itemIdx) => {
          const orderNotesHtml = order.notes
            ? `<span class="notes-val">${order.notes}</span>`
            : `<span class="notes-empty">–</span>`;

          const itemNotesHtml = item.notes
            ? `<span class="notes-val">${item.notes}</span>`
            : `<span class="notes-empty">–</span>`;

          htmlContent += `
          <tr>
            <td class="text-center">${itemIdx === 0 ? orderIdx + 1 : ''}</td>
            <td>${itemIdx === 0 ? order.customer : ''}</td>
            <td>${itemIdx === 0 ? (order.restaurant_name || '–') : ''}</td>
            <td>${itemIdx === 0 ? (order.area_name || '–') : ''}</td>
            <td>${itemIdx === 0 ? orderNotesHtml : ''}</td>
            <td><span class="product-name">${item.name}</span></td>
            <td>${itemNotesHtml}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">Rp ${item.price.toLocaleString('id-ID')}</td>
            <td class="text-right">Rp ${item.subtotal.toLocaleString('id-ID')}</td>
          </tr>
`;
        });

        // Total per pesanan
        htmlContent += `
          <tr class="order-total">
            <td colspan="9" style="text-align:right; padding-right:12px; font-weight:600;">
              Total Pesanan ${order.customer} :
            </td>
            <td class="amt">Rp ${order.total.toLocaleString('id-ID')}</td>
          </tr>
`;
      });

      // Total harian
      htmlContent += `
          <tr class="daily-total">
            <td colspan="9" style="text-align:right; font-weight:600;">
              TOTAL HARIAN ${new Date(dayData.date).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short',
              })} :
            </td>
            <td class="amt">Rp ${dayData.daily_total.toLocaleString('id-ID')}</td>
          </tr>
        </tbody>
      </table>
    </div>
`;

      if (dayIndex < data.orders_by_date.length - 1) {
        htmlContent += `
    <div style="text-align:right; font-size:8.5px; color:#3498db; margin:4px 0 12px 0;">
      Kumulatif: Rp ${dayData.cumulative_total.toLocaleString('id-ID')}
    </div>
`;
      }

      htmlContent += `  </div>\n`; // .keep-together
    });

    // ─── Ringkasan Akhir ─────────────────────────────────────────────────────────
    htmlContent += `
  <!-- ── Ringkasan Akhir ── -->
  <div class="keep-together mt-20">
    <div class="section-title">RINGKASAN AKHIR</div>
    <div style="background-color:#f8f9fa; padding:15px; border-radius:8px; border-left:4px solid #3498db;">
      <table style="width:100%; font-size:11px; background-color:transparent;">
        <tr>
          <td style="padding:7px; border:none;">
            <strong>Periode:</strong> ${data.period.start_date} s/d ${data.period.end_date}
          </td>
          <td style="padding:7px; border:none;">
            <strong>Jumlah Hari:</strong> ${data.orders_by_date.length}
          </td>
        </tr>
        <tr>
          <td style="padding:7px; border:none;">
            <strong>Total Pesanan:</strong> ${data.summary.total_orders}
          </td>
          <td style="padding:7px; border:none;">
            <strong>Total Pendapatan:</strong> Rp ${data.summary.total_revenue.toLocaleString('id-ID')}
          </td>
        </tr>
        <tr>
          <td style="padding:7px; border:none;">
            <strong>Rata-rata per Pesanan:</strong> Rp ${data.summary.average_order_value.toLocaleString('id-ID')}
          </td>
          <td style="padding:7px; border:none;"></td>
        </tr>
      </table>
    </div>
  </div>

  <!-- ── Footer ── -->
  <div class="footer">
    <div>Laporan ini dibuat secara otomatis oleh sistem untuk keperluan audit internal.</div>
    <div style="margin-top:4px; color:#95a5a6;">
      Dicetak pada: ${now.toLocaleDateString('id-ID', {
        day:    'numeric',
        month:  'long',
        year:   'numeric',
        hour:   '2-digit',
        minute: '2-digit',
      })}
    </div>
  </div>

</div>
</body>
</html>`;

    // ─── Render & Save PDF ───────────────────────────────────────────────────────
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    const canvas = await html2canvas.default(container, {
      allowTaint:      true,
      useCORS:         true,
      scale:           2,
      logging:         false,
      backgroundColor: '#ffffff',
    });

    document.body.removeChild(container);

    const imgWidth   = 210;
    const pageHeight = 297;
    const imgHeight  = (canvas.height * imgWidth) / canvas.width;
    const totalPages = Math.ceil(imgHeight / pageHeight);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit:        'mm',
      format:      'a4',
      compress:    true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage();
      pdf.addImage(
        imgData,
        'JPEG',
        0,
        -i * pageHeight,
        imgWidth,
        imgHeight,
        undefined,
        'FAST',
      );
    }

    const fileName = `laporan-pesanan-${data.period.start_date}-to-${data.period.end_date}.pdf`;
    pdf.save(fileName);
    console.log('✅ PDF generated:', fileName);
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
};

// ============================================================
// TXT EXPORT
// ============================================================

export const generateOrdersAuditTXT = (data: OrdersDetail): string => {
  const now   = new Date();
  const lines: string[] = [];

  const TABLE_TOP = '┌────┬──────────────────┬────────────────────┬──────────────┬────────────────────────┬──────────────────────┬────────────────────────┬──────┬──────────────┬──────────────┐';
  const TABLE_HDR = '│ No.│ Pelanggan        │ Restoran           │ Area         │ Catatan Pesanan        │ Produk               │ Catatan Khusus         │ Qty  │ Harga        │ Subtotal     │';
  const TABLE_MID = '├────┼──────────────────┼────────────────────┼──────────────┼────────────────────────┼──────────────────────┼────────────────────────┼──────┼──────────────┼──────────────┤';
  const TABLE_BOT = '└────┴──────────────────┴────────────────────┴──────────────┴────────────────────────┴──────────────────────┴────────────────────────┴──────┴──────────────┴──────────────┘';

  const BOX_W   = 65;
  const BOX_SEP = '═'.repeat(BOX_W);
  const BOX_BLD = '━'.repeat(BOX_W);

  // ─── Judul Dokumen ───────────────────────────────────────────────────────────
  lines.push(`╔${BOX_SEP}╗`);
  lines.push(`║${'LAPORAN PESANAN LENGKAP'.padStart(43).padEnd(BOX_W)}║`);
  lines.push(`║${'(ORDER AUDIT REPORT)'.padStart(42).padEnd(BOX_W)}║`);
  lines.push(`╚${BOX_SEP}╝`);
  lines.push('');
  lines.push(`Periode       : ${data.period.start_date} s/d ${data.period.end_date}`);
  lines.push(`Tanggal Export: ${now.toLocaleDateString('id-ID')}`);
  lines.push(`Waktu Export  : ${now.toLocaleTimeString('id-ID')}`);
  lines.push('');

  // ─── Ringkasan Eksekutif ─────────────────────────────────────────────────────
  lines.push(`┏${BOX_BLD}┓`);
  lines.push(`┃ RINGKASAN EKSEKUTIF${' '.repeat(BOX_W - 20)}┃`);
  lines.push(`┣${BOX_BLD}┫`);
  lines.push(`┃ Total Pesanan         : ${String(data.summary.total_orders).padEnd(BOX_W - 27)}┃`);
  lines.push(`┃ Total Revenue         : Rp ${data.summary.total_revenue.toLocaleString('id-ID').padEnd(BOX_W - 31)}┃`);
  lines.push(`┃ Rata-rata per Pesanan : Rp ${data.summary.average_order_value.toLocaleString('id-ID').padEnd(BOX_W - 31)}┃`);
  lines.push(`┃ Jumlah Hari           : ${String(data.orders_by_date.length).padEnd(BOX_W - 27)}┃`);
  lines.push(`┗${BOX_BLD}┛`);
  lines.push('');

  // ─── Detail Per Hari ─────────────────────────────────────────────────────────
  data.orders_by_date.forEach((dayData) => {

    // Header hari
    lines.push(`╔${BOX_SEP}╗`);
    lines.push(`║ DETAIL TANGGAL: ${dayData.date.padEnd(BOX_W - 17)}║`);
    lines.push(`╠${BOX_SEP}╣`);
    lines.push(`║ Total Pesanan  : ${String(dayData.total_orders).padEnd(BOX_W - 18)}║`);
    lines.push(`║ Daily Total    : Rp ${dayData.daily_total.toLocaleString('id-ID').padEnd(BOX_W - 21)}║`);
    lines.push(`║ Cumulative     : Rp ${dayData.cumulative_total.toLocaleString('id-ID').padEnd(BOX_W - 21)}║`);
    lines.push(`╠${BOX_SEP}╣`);
    lines.push('');

    // Tabel header
    lines.push(TABLE_TOP);
    lines.push(TABLE_HDR);
    lines.push(TABLE_MID);

    // Baris data
    dayData.orders.forEach((order, orderIdx) => {
      let isFirstItem = true;

      order.items.forEach((item) => {
        // Format setiap kolom
        const colNo          = isFirstItem
          ? String(orderIdx + 1).padEnd(2)
          : '  ';
        const colCustomer    = isFirstItem
          ? order.customer.substring(0, 16).padEnd(16)
          : ' '.repeat(16);
        const colRestaurant  = isFirstItem
          ? (order.restaurant_name || '-').substring(0, 18).padEnd(18)
          : ' '.repeat(18);
        const colArea        = isFirstItem
          ? (order.area_name || '-').substring(0, 12).padEnd(12)
          : ' '.repeat(12);
        const colOrderNotes  = isFirstItem
          ? (order.notes || '-').substring(0, 22).padEnd(22)
          : ' '.repeat(22);
        const colProduct     = item.name.substring(0, 20).padEnd(20);
        const colItemNotes   = (item.notes || '-').substring(0, 22).padEnd(22);
        const colQty         = String(item.quantity).padStart(4);
        const colPrice       = `Rp ${item.price.toLocaleString('id-ID')}`.padStart(12);
        const colSubtotal    = `Rp ${item.subtotal.toLocaleString('id-ID')}`.padStart(12);

        lines.push(
          `│ ${colNo}│ ${colCustomer} │ ${colRestaurant} │ ${colArea} │ ${colOrderNotes} │ ${colProduct} │ ${colItemNotes} │${colQty} │${colPrice} │${colSubtotal} │`
        );

        isFirstItem = false;
      });

      // Baris total per pesanan
      const totalPesanan = `Rp ${order.total.toLocaleString('id-ID')}`.padStart(12);
      lines.push(TABLE_MID);
      lines.push(
        `│    │ TOTAL PESANAN    │                    │              │                        │                      │                        │      │              │${totalPesanan} │`
      );
      lines.push(TABLE_MID);
    });

    lines.push(TABLE_BOT);
    lines.push('');

    // Ringkasan harian
    lines.push(`  TOTAL HARIAN (${dayData.date})`);
    lines.push(`    • Jumlah Pesanan : ${dayData.total_orders}`);
    lines.push(`    • Total Revenue  : Rp ${dayData.daily_total.toLocaleString('id-ID')}`);
    lines.push(`    • Cumulative     : Rp ${dayData.cumulative_total.toLocaleString('id-ID')}`);
    lines.push('');
    lines.push(`╚${BOX_SEP}╝`);
    lines.push('');
  });

  // ─── Ringkasan Akhir ─────────────────────────────────────────────────────────
  lines.push(`╔${BOX_SEP}╗`);
  lines.push(`║ RINGKASAN AKHIR${' '.repeat(BOX_W - 16)}║`);
  lines.push(`╠${BOX_SEP}╣`);
  lines.push(
    `║ Periode        : ${data.period.start_date} s/d ${data.period.end_date}`.padEnd(BOX_W + 1) + '║'
  );
  lines.push(
    `║ Jumlah Hari    : ${data.orders_by_date.length} hari`.padEnd(BOX_W + 1) + '║'
  );
  lines.push(
    `║ Total Pesanan  : ${data.summary.total_orders}`.padEnd(BOX_W + 1) + '║'
  );
  lines.push(
    `║ Total Revenue  : Rp ${data.summary.total_revenue.toLocaleString('id-ID')}`.padEnd(BOX_W + 1) + '║'
  );
  lines.push(
    `║ Rata-rata      : Rp ${data.summary.average_order_value.toLocaleString('id-ID')}`.padEnd(BOX_W + 1) + '║'
  );
  lines.push(`╚${BOX_SEP}╝`);
  lines.push('');

  // ─── Catatan Audit ───────────────────────────────────────────────────────────
  lines.push('CATATAN AUDIT:');
  lines.push('Laporan ini dibuat secara otomatis oleh sistem untuk keperluan audit internal.');
  lines.push('Silakan verifikasi data dengan sumber data utama sebelum digunakan untuk keperluan resmi.');
  lines.push('');
  lines.push(`Generated by: Audit System  |  Date: ${now.toISOString()}`);

  return lines.join('\n');
};

// ============================================================
// CSV EXPORT
// ============================================================
export const generateOrdersAuditCSV = (data: OrdersDetail): string => {
  const now   = new Date();
  const lines: string[] = [];

  const esc = (v: string | number | null | undefined): string =>
    `"${String(v ?? '').replace(/"/g, '""')}"`;

  // ─── Header Info ─────────────────────────────────────────────────────────────
  lines.push('LAPORAN PESANAN');
  lines.push('');
  lines.push(`Periode,${data.period.start_date} s/d ${data.period.end_date}`);
  lines.push(`Tanggal Export,${now.toLocaleDateString('id-ID')}`);
  lines.push(`Waktu Export,${now.toLocaleTimeString('id-ID')}`);
  lines.push('');

  // ─── Ringkasan Keseluruhan ───────────────────────────────────────────────────
  lines.push('RINGKASAN KESELURUHAN');
  lines.push(`Total Pesanan,${data.summary.total_orders}`);
  lines.push(`Total Revenue,${data.summary.total_revenue}`);
  lines.push(`Rata-rata per Pesanan,${data.summary.average_order_value}`);
  lines.push('');

  // ─── Detail Per Hari ─────────────────────────────────────────────────────────
  data.orders_by_date.forEach((dayData) => {

    lines.push(`DETAIL TANGGAL: ${dayData.date}`);
    lines.push(`Total Pesanan Harian,${dayData.total_orders}`);
    lines.push(`Daily Total,${dayData.daily_total}`);
    lines.push(`Cumulative Total,${dayData.cumulative_total}`);
    lines.push('');

    // Header kolom
    lines.push(
      [
        'No.',
        'Pelanggan',
        'Restoran',
        'Area',
        'Catatan Pesanan',
        'Produk',
        'Catatan Khusus',
        'Qty',
        'Harga Satuan',
        'Subtotal',
        'Total Pesanan',
      ]
        .map(esc)
        .join(',')
    );

    // Baris data
    dayData.orders.forEach((order, orderIdx) => {
      order.items.forEach((item, itemIdx) => {
        const row = [
          orderIdx + 1,
          order.customer,
          order.restaurant_name || '-',
          order.area_name       || '-',
          order.notes           || '-',
          item.name,
          item.notes            || '-',
          item.quantity,
          item.price,
          item.subtotal,
          itemIdx === 0 ? order.total : '',
        ];
        lines.push(row.map(esc).join(','));
      });
    });

    lines.push('');
    lines.push(`SUBTOTAL HARIAN,${dayData.total_orders},,,,,,,,,,${dayData.daily_total}`);
    lines.push(`CUMULATIVE,${dayData.cumulative_total},,,,,,,,,,`);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  // ─── Ringkasan Akhir ─────────────────────────────────────────────────────────
  lines.push('RINGKASAN AKHIR');
  lines.push(`Periode,${data.period.start_date} s/d ${data.period.end_date}`);
  lines.push(`Jumlah Hari,${data.orders_by_date.length}`);
  lines.push(`Total Pesanan,${data.summary.total_orders}`);
  lines.push(`Total Revenue,${data.summary.total_revenue}`);
  lines.push(`Rata-rata per Pesanan,${data.summary.average_order_value}`);

  return lines.join('\n');
};

// ============================================================
// DOWNLOAD UTILITY
// ============================================================
/**
 * Memicu unduhan file di browser.
 *
 * BOM (\uFEFF) ditambahkan di awal konten agar file CSV/TXT
 * terbuka dengan encoding UTF-8 yang benar di Microsoft Excel.
 *
 * @param content  - isi file sebagai string
 * @param fileName - nama file yang akan diunduh
 * @param type     - MIME type (mis. 'text/csv', 'text/plain')
 */
export const downloadFile = (
  content:  string,
  fileName: string,
  type:     string,
): void => {
  const blob = new Blob(['\uFEFF' + content], { type });
  const url  = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href     = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
};