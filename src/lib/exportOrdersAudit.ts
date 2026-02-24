// @/lib/exportOrdersAudit.ts

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  order_id: number;
  order_number: string;
  customer: string;
  order_status: string;  // ✅ Ubah dari 'status' ke 'order_status'
  payment_status: string; // ✅ Tambahkan field baru
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

// ===== COLOR CONSTANTS =====
const COLORS = {
  primary: '1F3A70',
  secondary: '366092',
  accent: 'E8EEF7',
  success: '10B981',
  lightGray: 'F9FAFB',
  gray: 'F3F4F6',
  border: 'D1D5DB'
};

const createHeaderStyle = (
  bgColor = COLORS.primary,
  textColor = 'FFFFFF'
) => ({
  font: { bold: true, color: { rgb: textColor }, size: 12 },
  fill: { fgColor: { rgb: bgColor } },
  alignment: {
    horizontal: 'center' as const,
    vertical: 'center' as const
  },
  border: {
    top: { style: 'thin' as const, color: { rgb: COLORS.border } },
    bottom: { style: 'thin' as const, color: { rgb: COLORS.border } },
    left: { style: 'thin' as const, color: { rgb: COLORS.border } },
    right: { style: 'thin' as const, color: { rgb: COLORS.border } }
  }
});

const createDataStyle = (
  bgColor = 'FFFFFF',
  bold = false,
  alignRight = false
) => ({
  font: { bold, size: 10 },
  fill: { fgColor: { rgb: bgColor } },
  alignment: {
    horizontal: alignRight ? ('right' as const) : ('left' as const),
    vertical: 'center' as const
  },
  numFmt: alignRight ? '#,##0' : '@',
  border: {
    top: { style: 'thin' as const, color: { rgb: COLORS.border } },
    bottom: { style: 'thin' as const, color: { rgb: COLORS.border } },
    left: { style: 'thin' as const, color: { rgb: COLORS.border } },
    right: { style: 'thin' as const, color: { rgb: COLORS.border } }
  }
});

/**
 * Generate Excel dengan styling profesional dan tabel yang indah
 */
export const generateOrdersAuditExcel = async (
  data: OrdersDetail
): Promise<void> => {
  try {
    const XLSX = await import('xlsx');
    const now = new Date();
    const workbook = XLSX.utils.book_new();

    if (!data.orders_by_date || data.orders_by_date.length === 0) {
      throw new Error('Tidak ada data pesanan untuk diexport');
    }

    // ==================== SHEET 1: RINGKASAN EKSEKUTIF ====================
    const summaryData: (string | number)[][] = [
      ['LAPORAN PESANAN - RINGKASAN EKSEKUTIF'],
      [''],
      [
        'Periode',
        `${data.period.start_date} s/d ${data.period.end_date}`
      ],
      ['Tanggal Export', now.toLocaleDateString('id-ID')],
      ['Waktu Export', now.toLocaleTimeString('id-ID')],
      [''],
      ['RINGKASAN KESELURUHAN'],
      ['Total Pesanan', data.summary.total_orders],
      ['Total Revenue', data.summary.total_revenue],
      ['Rata-rata per Pesanan', data.summary.average_order_value],
      ['Jumlah Hari', data.orders_by_date.length]
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 30 }, { wch: 25 }];
    summarySheet['!rows'] = [{ hpx: 25 }, { hpx: 8 }];

    for (let i = 0; i < summaryData.length; i++) {
      const cellA = XLSX.utils.encode_cell({ r: i, c: 0 });
      const cellB = XLSX.utils.encode_cell({ r: i, c: 1 });

      if (i === 0) {
        summarySheet[cellA].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, size: 14 },
          fill: { fgColor: { rgb: COLORS.primary } },
          alignment: {
            horizontal: 'center' as const,
            vertical: 'center' as const
          },
          border: {
            top: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            bottom: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            left: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            right: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            }
          }
        };
      } else if (i === 6) {
        summarySheet[cellA].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, size: 12 },
          fill: { fgColor: { rgb: COLORS.secondary } },
          alignment: {
            horizontal: 'left' as const,
            vertical: 'center' as const
          },
          border: {
            top: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            bottom: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            left: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            right: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            }
          }
        };
      } else if (i >= 7 && i <= 10) {
        summarySheet[cellA].s = {
          font: { bold: true, size: 11 },
          fill: { fgColor: { rgb: COLORS.lightGray } },
          alignment: {
            horizontal: 'left' as const,
            vertical: 'center' as const
          },
          border: {
            top: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            bottom: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            left: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            right: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            }
          }
        };
        summarySheet[cellB].s = {
          font: { bold: true, size: 11 },
          fill: { fgColor: { rgb: COLORS.lightGray } },
          alignment: {
            horizontal: 'right' as const,
            vertical: 'center' as const
          },
          numFmt: '#,##0',
          border: {
            top: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            bottom: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            left: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            right: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            }
          }
        };
      } else if (i !== 1 && i !== 5) {
        summarySheet[cellA].s = {
          font: { size: 10 },
          alignment: {
            horizontal: 'left' as const,
            vertical: 'center' as const
          },
          border: {
            top: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            bottom: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            left: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            right: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            }
          }
        };
        summarySheet[cellB].s = {
          font: { size: 10 },
          alignment: {
            horizontal: 'right' as const,
            vertical: 'center' as const
          },
          numFmt: '#,##0',
          border: {
            top: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            bottom: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            left: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            right: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            }
          }
        };
      }
    }

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

    // ==================== SHEET 2: RINGKASAN HARIAN ====================
    const dailySummaryData: (string | number)[][] = [
      ['RINGKASAN HARIAN PESANAN'],
      ['Tanggal', 'Total Pesanan', 'Daily Total', 'Cumulative Total']
    ];

    data.orders_by_date.forEach((dayData) => {
      dailySummaryData.push([
        dayData.date,
        dayData.total_orders,
        dayData.daily_total,
        dayData.cumulative_total
      ]);
    });

    dailySummaryData.push([
      'TOTAL PERIODE',
      data.summary.total_orders,
      data.summary.total_revenue,
      ''
    ]);

    const dailySummarySheet =
      XLSX.utils.aoa_to_sheet(dailySummaryData);
    dailySummarySheet['!cols'] = [
      { wch: 18 },
      { wch: 16 },
      { wch: 18 },
      { wch: 20 }
    ];

    // Header row
    for (let c = 0; c < 4; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c });
      if (dailySummarySheet[cellAddress]) {
        dailySummarySheet[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, size: 12 },
          fill: { fgColor: { rgb: COLORS.primary } },
          alignment: {
            horizontal: 'center' as const,
            vertical: 'center' as const
          },
          border: {
            top: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            bottom: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            left: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            right: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            }
          }
        };
      }
    }

    // Column headers
    for (let c = 0; c < 4; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 1, c });
      if (dailySummarySheet[cellAddress]) {
        dailySummarySheet[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, size: 11 },
          fill: { fgColor: { rgb: COLORS.secondary } },
          alignment: {
            horizontal: 'center' as const,
            vertical: 'center' as const
          },
          border: {
            top: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            bottom: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            left: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            right: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            }
          }
        };
      }
    }

    // Data rows
    for (let row = 2; row < dailySummaryData.length - 1; row++) {
      for (let col = 0; col < 4; col++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: row,
          c: col
        });
        if (dailySummarySheet[cellAddress]) {
          const bgColor = row % 2 === 0 ? COLORS.gray : 'FFFFFF';
          dailySummarySheet[cellAddress].s = {
            font: { size: 10 },
            fill: { fgColor: { rgb: bgColor } },
            alignment: {
              horizontal:
                col === 0 ? ('left' as const) : ('right' as const),
              vertical: 'center' as const
            },
            numFmt: col > 0 ? '#,##0' : '@',
            border: {
              top: {
                style: 'thin' as const,
                color: { rgb: COLORS.border }
              },
              bottom: {
                style: 'thin' as const,
                color: { rgb: COLORS.border }
              },
              left: {
                style: 'thin' as const,
                color: { rgb: COLORS.border }
              },
              right: {
                style: 'thin' as const,
                color: { rgb: COLORS.border }
              }
            }
          };
        }
      }
    }

    // Total row
    const totalRowIdx = dailySummaryData.length - 1;
    for (let c = 0; c < 4; c++) {
      const cellAddress = XLSX.utils.encode_cell({
        r: totalRowIdx,
        c
      });
      if (dailySummarySheet[cellAddress]) {
        dailySummarySheet[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, size: 11 },
          fill: { fgColor: { rgb: COLORS.success } },
          alignment: {
            horizontal:
              c === 0 ? ('left' as const) : ('right' as const),
            vertical: 'center' as const
          },
          numFmt: c > 0 ? '#,##0' : '@',
          border: {
            top: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            bottom: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            left: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            right: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            }
          }
        };
      }
    }

    XLSX.utils.book_append_sheet(
      workbook,
      dailySummarySheet,
      'Ringkasan Harian'
    );

    // ==================== SHEET 3-N: DETAIL PER HARI ====================
    data.orders_by_date.forEach((dayData, dayIndex) => {
      const sheetName = `${dayData.date}`.substring(0, 31);

      const dayDetailData: (string | number | null)[][] = [
        ['DETAIL PESANAN - ' + dayData.date],
        [''],
        [
          'No.',
          'Nomor Pesanan',
          'Pelanggan',
          'Status Order', // ✅ Ubah dari 'Status' ke 'Status Order'
          'Status Payment', // ✅ Tambahkan kolom baru
          'Nama Produk',
          'Qty',
          'Harga Satuan',
          'Subtotal'
        ]
      ];

      dayData.orders.forEach((order, orderIdx) => {
        let isFirstItem = true;

        order.items.forEach((item) => {
          dayDetailData.push([
            isFirstItem ? orderIdx + 1 : '',
            isFirstItem ? order.order_number : '',
            isFirstItem ? order.customer : '',
            isFirstItem ? order.order_status : '', // ✅ Gunakan order_status
            isFirstItem ? order.payment_status : '', // ✅ Gunakan payment_status
            item.name,
            item.quantity,
            item.price,
            item.subtotal
          ]);
          isFirstItem = false;
        });

        dayDetailData.push([
          '',
          '',
          '',
          '',
          '',
          'TOTAL PESANAN',
          '',
          '',
          order.total
        ]);
      });

      dayDetailData.push(['']);
      dayDetailData.push([
        'TOTAL HARIAN',
        `${dayData.total_orders} Pesanan`,
        '',
        '',
        '',
        '',
        '',
        '',
        dayData.daily_total
      ]);

      const dayDetailSheet = XLSX.utils.aoa_to_sheet(dayDetailData);
      dayDetailSheet['!cols'] = [
        { wch: 8 },
        { wch: 16 },
        { wch: 18 },
        { wch: 12 }, // Status Order
        { wch: 12 }, // Status Payment
        { wch: 25 },
        { wch: 8 },
        { wch: 15 },
        { wch: 15 }
      ];

      // Title
      if (dayDetailSheet['A1']) {
        dayDetailSheet['A1'].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, size: 13 },
          fill: { fgColor: { rgb: COLORS.primary } },
          alignment: {
            horizontal: 'left' as const,
            vertical: 'center' as const
          },
          border: {
            top: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            bottom: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            left: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            },
            right: {
              style: 'thin' as const,
              color: { rgb: COLORS.border }
            }
          }
        };
      }

      // Header row
      for (let c = 0; c < 9; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 2, c });
        if (dayDetailSheet[cellAddress]) {
          dayDetailSheet[cellAddress].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' }, size: 11 },
            fill: { fgColor: { rgb: COLORS.secondary } },
            alignment: {
              horizontal: 'center' as const,
              vertical: 'center' as const
            },
            border: {
              top: {
                style: 'thin' as const,
                color: { rgb: COLORS.border }
              },
              bottom: {
                style: 'thin' as const,
                color: { rgb: COLORS.border }
              },
              left: {
                style: 'thin' as const,
                color: { rgb: COLORS.border }
              },
              right: {
                style: 'thin' as const,
                color: { rgb: COLORS.border }
              }
            }
          };
        }
      }

      // Data rows
      let itemCount = 0;
      for (let row = 3; row < dayDetailData.length; row++) {
        const cellValue = dayDetailData[row][5];
        const isTotalPesanan = cellValue === 'TOTAL PESANAN';
        const isTotalHarian =
          dayDetailData[row][0] === 'TOTAL HARIAN';
        const isSpacerRow = dayDetailData[row][0] === '';

        if (!isSpacerRow) {
          for (let col = 0; col < 9; col++) {
            const cellAddress = XLSX.utils.encode_cell({
              r: row,
              c: col
            });
            if (dayDetailSheet[cellAddress]) {
              let bgColor = 'FFFFFF';
              let fontColor = '000000';

              if (isTotalHarian) {
                bgColor = COLORS.success;
                fontColor = 'FFFFFF';
              } else if (isTotalPesanan) {
                bgColor = COLORS.accent;
              } else {
                itemCount++;
                bgColor =
                  itemCount % 2 === 0 ? COLORS.gray : 'FFFFFF';
              }

              dayDetailSheet[cellAddress].s = {
                font: {
                  bold: isTotalPesanan || isTotalHarian,
                  color: { rgb: fontColor },
                  size: 10
                },
                fill: { fgColor: { rgb: bgColor } },
                alignment: {
                  horizontal:
                    col >= 6 ? ('right' as const) : ('left' as const),
                  vertical: 'center' as const
                },
                numFmt: col >= 6 ? '#,##0' : '@',
                border: {
                  top: {
                    style: 'thin' as const,
                    color: { rgb: COLORS.border }
                  },
                  bottom: {
                    style: isTotalHarian
                      ? ('medium' as const)
                      : ('thin' as const),
                    color: { rgb: COLORS.border }
                  },
                  left: {
                    style: 'thin' as const,
                    color: { rgb: COLORS.border }
                  },
                  right: {
                    style: 'thin' as const,
                    color: { rgb: COLORS.border }
                  }
                }
              };
            }
          }
        }
      }

      XLSX.utils.book_append_sheet(
        workbook,
        dayDetailSheet,
        sheetName
      );
    });

    const fileName = `audit-orders-${data.period.start_date}-to-${data.period.end_date}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    console.log('✅ Excel file generated:', fileName);
  } catch (error) {
    console.error('❌ Error generating Excel:', error);
    throw error;
  }
};

/**
 * Generate PDF dengan tampilan yang lebih user-friendly
 */
export const generateOrdersAuditPDF = async (
  data: OrdersDetail
): Promise<void> => {
  try {
    const { jsPDF } = await import('jspdf');
    const html2canvas = await import('html2canvas');
    const now = new Date();

    // Create main container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
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
            height: auto;
            padding: 0;
            margin: 0;
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
          
          /* Header Styles */
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
            font-weight: 600;
          }
          .header .subtitle { 
            color: #7f8c8d; 
            font-size: 12px; 
            font-style: italic;
          }
          
          /* Info Box */
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
            min-width: 100px;
            display: inline-block;
          }
          
          /* Section Headers */
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
          
          /* Summary Cards */
          .summary-cards {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
            flex-wrap: wrap;
          }
          .card {
            flex: 1;
            min-width: 120px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(52, 152, 219, 0.1);
          }
          .card-value {
            font-size: 18px;
            font-weight: 700;
            color: #2980b9;
            margin-top: 5px;
          }
          .card-label {
            font-size: 11px;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          /* Table Styles - Prevent cutting */
          .table-container {
            margin: 10px 0 20px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
            page-break-inside: avoid;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 9.5px; 
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
            padding: 10px 6px; 
            text-align: left; 
            font-weight: 600;
            white-space: nowrap;
          }
          td { 
            padding: 8px 6px; 
            border-bottom: 1px solid #e0e0e0;
            vertical-align: top;
            text-align: left;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:hover {
            background-color: #f0f7ff;
          }
          
          /* Status Text Colors */
          .status-text {
            font-weight: 500;
            font-size: 9px;
          }
          .status-text.completed {
            color: #1e7e34;
          }
          .status-text.processing {
            color: #b45b0f;
          }
          .status-text.pending {
            color: #b33c3c;
          }
          .status-text.canceled {
            color: #6c757d;
          }
          .status-text.paid {
            color: #0d6efd;
          }
          
          /* Product List */
          .product-item {
            padding: 2px 0;
            border-bottom: 1px dashed #d4e6f1;
          }
          .product-item:last-child {
            border-bottom: none;
          }
          .product-name {
            font-weight: 500;
            color: #2c3e50;
          }
          .product-detail {
            font-size: 8.5px;
            color: #7f8c8d;
            margin-left: 4px;
          }
          
          /* Amount Styles */
          .amount { 
            text-align: right; 
            font-weight: 500;
            white-space: nowrap;
          }
          .qty { 
            text-align: center; 
            font-weight: 500;
          }
          
          /* Total Rows */
          .order-total {
            background-color: #e8f4fc;
          }
          .order-total td {
            font-weight: 600;
            color: #2c3e50;
            border-top: 1px solid #b0d4f0;
            text-align: left;
          }
          .order-total .amount {
            text-align: right;
            font-weight: 700;
            color: #2980b9;
          }
          
          .daily-total {
            background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
            color: white;
          }
          .daily-total td {
            color: white;
            font-weight: 600;
            padding: 10px 6px;
            border: none;
            text-align: left;
          }
          .daily-total .amount {
            color: white;
            text-align: right;
            font-weight: 700;
          }
          
          /* Footer */
          .footer { 
            margin-top: 30px; 
            padding: 15px 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            font-size: 9px; 
            color: #7f8c8d; 
            text-align: center; 
            border-top: 1px solid #dee2e6;
            page-break-inside: avoid;
          }
          .footer-note {
            margin-top: 10px;
            font-size: 9px;
            color: #95a5a6;
          }
          
          /* Keep together */
          .keep-together {
            page-break-inside: avoid;
          }
          
          /* Spacing */
          .mt-20 { margin-top: 20px; }
          .mb-10 { margin-bottom: 10px; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>LAPORAN PESANAN</h1>
            <div class="subtitle">CRSD Order Report</div>
          </div>

          <!-- Info Box -->
          <div class="info-box">
            <p><strong>Periode:</strong> ${data.period.start_date} s/d ${data.period.end_date}</p>
            <p><strong>Tanggal Cetak:</strong> ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><strong>Waktu Cetak:</strong> ${now.toLocaleTimeString('id-ID')}</p>
          </div>

          <!-- Summary Cards -->
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

    // Add each day's data
    data.orders_by_date.forEach((dayData, dayIndex) => {
      htmlContent += `
        <div class="keep-together ${dayIndex > 0 ? 'page-break' : ''}">
          <div class="date-title">
            📅 ${new Date(dayData.date).toLocaleDateString('id-ID', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
            <span style="float: right; font-weight: normal; color: #2980b9;">
              ${dayData.total_orders} Pesanan | Rp ${dayData.daily_total.toLocaleString('id-ID')}
            </span>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 5%;">No</th>
                  <th style="width: 15%;">No. Pesanan</th>
                  <th style="width: 12%;">Pelanggan</th>
                  <th style="width: 10%;">Status</th>
                  <th style="width: 28%;">Produk</th>
                  <th style="width: 5%;">Qty</th>
                  <th style="width: 12%;">Harga</th>
                  <th style="width: 13%;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
      `;

      dayData.orders.forEach((order, orderIdx) => {
        // Baris pertama item
        order.items.forEach((item, itemIdx) => {
          htmlContent += `
            <tr>
              <td style="text-align: left;">${itemIdx === 0 ? orderIdx + 1 : ''}</td>
              <td style="text-align: left;">${itemIdx === 0 ? order.order_number : ''}</td>
              <td style="text-align: left;">${itemIdx === 0 ? order.customer : ''}</td>
              <td style="text-align: left;">
                ${itemIdx === 0 ? `
                  <span class="status-text completed">Selesai</span>
                ` : ''}
              </td>
              <td style="text-align: left;">
                <div class="product-item">
                  <span class="product-name">${item.name}</span>
                  ${item.quantity > 1 ? `<span class="product-detail">x${item.quantity}</span>` : ''}
                </div>
              </td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">Rp ${item.price.toLocaleString('id-ID')}</td>
              <td style="text-align: right;">Rp ${item.subtotal.toLocaleString('id-ID')}</td>
            </tr>
          `;
        });

        // Total per order
        htmlContent += `
          <tr class="order-total">
            <td colspan="7" style="text-align: right; padding-right: 20px; font-weight: 600;">
              Total Pesanan ${order.order_number} :
            </td>
            <td class="amount" style="text-align: right; font-weight: 700; color: #2980b9;">
              Rp ${order.total.toLocaleString('id-ID')}
            </td>
          </tr>
        `;
      });

      // Daily total
      htmlContent += `
          <tr class="daily-total">
            <td colspan="7" style="text-align: right; font-weight: 600;">
              TOTAL HARIAN ${new Date(dayData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} :
            </td>
            <td class="amount" style="text-align: right; font-weight: 700;">
              Rp ${dayData.daily_total.toLocaleString('id-ID')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    `;

      // Cumulative if not last day
      if (dayIndex < data.orders_by_date.length - 1) {
        htmlContent += `
          <div style="text-align: right; font-size: 9px; color: #3498db; margin: 5px 0 15px 0;">
            Kumulatif: Rp ${dayData.cumulative_total.toLocaleString('id-ID')}
          </div>
        `;
      }
    });

    // Final summary
    htmlContent += `
        <div class="keep-together mt-20">
          <div class="section-title">RINGKASAN AKHIR</div>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;">
            <table style="width: 100%; font-size: 11px; background-color: transparent;">
              <tr>
                <td style="padding: 8px; border: none; text-align: left;"><strong>Periode:</strong> ${data.period.start_date} s/d ${data.period.end_date}</td>
                <td style="padding: 8px; border: none; text-align: left;"><strong>Jumlah Hari:</strong> ${data.orders_by_date.length}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: none; text-align: left;"><strong>Total Pesanan:</strong> ${data.summary.total_orders}</td>
                <td style="padding: 8px; border: none; text-align: left;"><strong>Total Pendapatan:</strong> Rp ${data.summary.total_revenue.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: none; text-align: left;"><strong>Rata-rata per Pesanan:</strong> Rp ${data.summary.average_order_value.toLocaleString('id-ID')}</td>
                <td style="padding: 8px; border: none;"></td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div>Laporan ini dibuat secara otomatis oleh sistem</div>
          <div class="footer-note">
            Dicetak pada: ${now.toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
      </body>
      </html>
    `;

    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    // Convert to canvas
    const canvas = await html2canvas.default(container, {
      allowTaint: true,
      useCORS: true,
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff'
    });

    document.body.removeChild(container);

    // Create PDF with calculated height
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Calculate total pages needed
    const totalPages = Math.ceil(imgHeight / pageHeight);
    
    // Create PDF with custom page size if needed
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Add pages with proper positioning to avoid cutting
    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      const yOffset = -i * pageHeight;
      
      pdf.addImage(
        imgData, 
        'JPEG', 
        0, 
        yOffset, 
        imgWidth, 
        imgHeight,
        undefined,
        'FAST'
      );
    }

    // Save PDF
    const filename = `laporan-pesanan-${data.period.start_date}-to-${data.period.end_date}.pdf`;
    pdf.save(filename);

    console.log('✅ PDF file generated successfully with proper page breaks');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
};
/**
 * Generate TXT
 */
export const generateOrdersAuditTXT = (
  data: OrdersDetail
): string => {
  const now = new Date();
  const lines: string[] = [];

  lines.push(
    '╔═══════════════════════════════════════════════════════════════╗'
  );
  lines.push(
    '║               LAPORAN  PESANAN LENGKAP                   ║'
  );
  lines.push(
    '║                  (ORDER AUDIT REPORT)                         ║'
  );
  lines.push(
    '╚═══════════════════════════════════════════════════════════════╝'
  );
  lines.push('');

  lines.push(
    `Periode       : ${data.period.start_date} s/d ${data.period.end_date}`
  );
  lines.push(`Tanggal Export: ${now.toLocaleDateString('id-ID')}`);
  lines.push(`Waktu Export  : ${now.toLocaleTimeString('id-ID')}`);
  lines.push('');

  lines.push(
    '┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'
  );
  lines.push(
    '┃ RINGKASAN EKSEKUTIF                                           ┃'
  );
  lines.push(
    '┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫'
  );
  lines.push(
    `┃ Total Pesanan         : ${String(
      data.summary.total_orders
    ).padEnd(42)} ┃`
  );
  lines.push(
    `┃ Total Revenue         : Rp ${data.summary.total_revenue
      .toLocaleString('id-ID')
      .padEnd(37)} ┃`
  );
  lines.push(
    `┃ Rata-rata per Pesanan : Rp ${data.summary.average_order_value
      .toLocaleString('id-ID')
      .padEnd(37)} ┃`
  );
  lines.push(
    `┃ Jumlah Hari           : ${String(
      data.orders_by_date.length
    ).padEnd(42)} ┃`
  );
  lines.push(
    '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'
  );
  lines.push('');

  data.orders_by_date.forEach((dayData) => {
    lines.push(
      '╔═══════════════════════════════════════════════════════════════╗'
    );
    lines.push(`║ DETAIL TANGGAL: ${dayData.date.padEnd(46)} ║`);
    lines.push(
      '╠═══════════════════════════════════════════════════════════════╣'
    );
    lines.push(
      `║ Total Pesanan  : ${String(dayData.total_orders).padEnd(
        47
      )} ║`
    );
    lines.push(
      `║ Daily Total    : Rp ${dayData.daily_total
        .toLocaleString('id-ID')
        .padEnd(41)} ║`
    );
    lines.push(
      `║ Cumulative     : Rp ${dayData.cumulative_total
        .toLocaleString('id-ID')
        .padEnd(41)} ║`
    );
    lines.push(
      '╠═══════════════════════════════════════════════════════════════╣'
    );
    lines.push('');

    lines.push(
      '┌────┬────────────────────┬──────────────────┬──────────────┬──────────────┬─────────────┬──────┬──────────────┬──────────────┐'
    );
    lines.push(
      '│ No.│ Nomor Pesanan      │ Pelanggan        │ Status Order │ Status Payment│ Produk      │ Qty  │ Harga        │ Subtotal     │'
    );
    lines.push(
      '├────┼────────────────────┼──────────────────┼──────────────┼──────────────┼─────────────┼──────┼──────────────┼──────────────┤'
    );

    dayData.orders.forEach((order, orderIdx) => {
      let isFirstItem = true;

      order.items.forEach((item) => {
        const no = isFirstItem
          ? String(orderIdx + 1).padEnd(2)
          : '  ';
        const orderNum = isFirstItem
          ? order.order_number.padEnd(18)
          : '                  ';
        const customer = isFirstItem
          ? order.customer.substring(0, 16).padEnd(16)
          : '                ';
        const orderStatus = isFirstItem
          ? order.order_status.padEnd(12)
          : '            ';
        const paymentStatus = isFirstItem
          ? order.payment_status.padEnd(12)
          : '            ';
        const product = item.name.substring(0, 11).padEnd(11);
        const qty = String(item.quantity).padStart(4);
        const price = `Rp ${item.price.toLocaleString(
          'id-ID'
        )}`.padStart(12);
        const subtotal = `Rp ${item.subtotal.toLocaleString(
          'id-ID'
        )}`.padStart(12);

        lines.push(
          `│ ${no}│ ${orderNum} │ ${customer} │ ${orderStatus} │ ${paymentStatus} │ ${product} │${qty} │${price} │${subtotal} │`
        );
        isFirstItem = false;
      });

      lines.push(
        '├────┼────────────────────┼──────────────────┼──────────────┼──────────────┼─────────────┼──────┼──────────────┼──────────────┤'
      );
      lines.push(
        `│    │ TOTAL PESANAN      │                  │              │              │             │      │              │ Rp ${order.total
          .toLocaleString('id-ID')
          .padStart(10)} │`
      );
      lines.push(
        '├────┼────────────────────┼──────────────────┼──────────────┼──────────────┼─────────────┼──────┼──────────────┼──────────────┤'
      );
    });

    lines.push('');
    lines.push(`TOTAL HARIAN (${dayData.date})`);
    lines.push(`  • Jumlah Pesanan: ${dayData.total_orders}`);
    lines.push(
      `  • Total Revenue : Rp ${dayData.daily_total.toLocaleString(
        'id-ID'
      )}`
    );
    lines.push(
      `  • Cumulative    : Rp ${dayData.cumulative_total.toLocaleString(
        'id-ID'
      )}`
    );
    lines.push('');
    lines.push(
      '╚═══════════════════════════════════════════════════════════════╝'
    );
    lines.push('');
  });

  lines.push(
    '╔═══════════════════════════════════════════════════════════════╗'
  );
  lines.push(
    '║ RINGKASAN AKHIR                                               ║'
  );
  lines.push(
    '╠═══════════════════════════════════════════════════════════════╣'
  );
  lines.push(
    `║ Periode        : ${data.period.start_date} s/d ${data.period.end_date}`.padEnd(
      63
    ) + '║'
  );
  lines.push(
    `║ Jumlah Hari    : ${data.orders_by_date.length} hari`.padEnd(
      63
    ) + '║'
  );
  lines.push(
    `║ Total Pesanan  : ${data.summary.total_orders}`.padEnd(63) + '║'
  );
  lines.push(
    `║ Total Revenue  : Rp ${data.summary.total_revenue.toLocaleString(
      'id-ID'
    )}`.padEnd(63) + '║'
  );
  lines.push(
    '╚═══════════════════════════════════════════════════════════════╝'
  );
  lines.push('');

  lines.push('CATATAN AUDIT:');
  lines.push(
    'Laporan ini dibuat secara otomatis oleh sistem untuk keperluan audit'
  );
  lines.push(
    'internal. Silakan verifikasi data dengan sumber data utama sebelum'
  );
  lines.push('digunakan untuk keperluan resmi.');
  lines.push('');
  lines.push(
    `Generated by: Audit System | Date: ${now.toISOString()}`
  );

  return lines.join('\n');
};

/**
 * Generate CSV
 */
export const generateOrdersAuditCSV = (
  data: OrdersDetail
): string => {
  const now = new Date();
  const lines: string[] = [];

  lines.push('LAPORAN PESANAN');
  lines.push('');
  lines.push(
    `Periode,${data.period.start_date} s/d ${data.period.end_date}`
  );
  lines.push(`Tanggal Export,${now.toLocaleDateString('id-ID')}`);
  lines.push(`Waktu Export,${now.toLocaleTimeString('id-ID')}`);
  lines.push('');

  lines.push('RINGKASAN KESELURUHAN');
  lines.push(`Total Pesanan,${data.summary.total_orders}`);
  lines.push(`Total Revenue,${data.summary.total_revenue}`);
  lines.push(
    `Rata-rata per Pesanan,${data.summary.average_order_value}`
  );
  lines.push('');

  data.orders_by_date.forEach((dayData) => {
    lines.push(`DETAIL TANGGAL: ${dayData.date}`);
    lines.push(`Total Pesanan Harian,${dayData.total_orders}`);
    lines.push(`Daily Total,${dayData.daily_total}`);
    lines.push(`Cumulative Total,${dayData.cumulative_total}`);
    lines.push('');

    lines.push(
      'No.,Nomor Pesanan,Pelanggan,Status Order,Status Payment,Produk,Qty,Harga Satuan,Subtotal,Total Pesanan'
    );

    dayData.orders.forEach((order, orderIdx) => {
      order.items.forEach((item, itemIdx) => {
        const row = [
          orderIdx + 1,
          order.order_number,
          order.customer,
          order.order_status, // ✅ Gunakan order_status
          order.payment_status, // ✅ Gunakan payment_status
          item.name,
          item.quantity,
          item.price,
          item.subtotal,
          itemIdx === 0 ? order.total : ''
        ];
        lines.push(row.map((v) => `"${v}"`).join(','));
      });
    });

    lines.push('');
    lines.push(
      `SUBTOTAL HARIAN,${dayData.total_orders},,,,,,,,${dayData.daily_total}`
    );
    lines.push(`CUMULATIVE,${dayData.cumulative_total},,,,,,,,`);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

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