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
  status: string;
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
      ['LAPORAN AUDIT PESANAN - RINGKASAN EKSEKUTIF'],
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
          'Status',
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
            isFirstItem ? order.status : '',
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
        dayData.daily_total
      ]);

      const dayDetailSheet = XLSX.utils.aoa_to_sheet(dayDetailData);
      dayDetailSheet['!cols'] = [
        { wch: 8 },
        { wch: 16 },
        { wch: 18 },
        { wch: 14 },
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
      for (let c = 0; c < 8; c++) {
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
        const cellValue = dayDetailData[row][4];
        const isTotalPesanan = cellValue === 'TOTAL PESANAN';
        const isTotalHarian =
          dayDetailData[row][0] === 'TOTAL HARIAN';
        const isSpacerRow = dayDetailData[row][0] === '';

        if (!isSpacerRow) {
          for (let col = 0; col < 8; col++) {
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
                    col >= 5 ? ('right' as const) : ('left' as const),
                  vertical: 'center' as const
                },
                numFmt: col >= 5 ? '#,##0' : '@',
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
 * Generate PDF menggunakan jsPDF dan html2canvas dengan multi-page support
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

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { 
            font-family: Arial, sans-serif; 
            color: #333; 
            line-height: 1.3;
            width: 210mm;
            height: auto;
            padding: 0;
            margin: 0;
          }
          .page-break { page-break-after: always; margin-bottom: 20px; padding-bottom: 20px; }
          .container { padding: 15px 20px; width: 100%; }
          .header { text-align: center; margin-bottom: 15px; }
          .header h1 { color: #1F3A70; font-size: 16px; margin-bottom: 3px; }
          .header p { color: #666; font-size: 11px; }
          .info { font-size: 9px; margin-bottom: 15px; line-height: 1.5; }
          .info p { margin: 2px 0; }
          .section-header { background-color: #1F3A70; color: white; padding: 8px; margin: 10px 0 8px 0; font-weight: bold; font-size: 11px; }
          .day-header { background-color: #366092; color: white; padding: 6px; margin-top: 10px; margin-bottom: 6px; font-weight: bold; font-size: 10px; }
          .summary-line { font-size: 9px; margin-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 8px; }
          th { background-color: #366092; color: white; padding: 4px 3px; text-align: left; border: 0.5px solid #999; font-weight: bold; }
          td { padding: 3px; border: 0.5px solid #ddd; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .total-row { background-color: #E8EEF7; font-weight: bold; }
          .daily-total { background-color: #10B981; color: white; font-weight: bold; }
          .amount { text-align: right; }
          .qty { text-align: center; }
          .note { font-size: 8px; color: #666; margin-top: 10px; line-height: 1.4; padding: 8px; background-color: #f3f4f6; }
          .footer { font-size: 7px; color: #999; text-align: center; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LAPORAN AUDIT PESANAN CRSD</h1>
            <p>(ORDER AUDIT REPORT CRSD)</p>
          </div>

          <div class="info">
            <p><strong>Periode:</strong> ${
              data.period.start_date
            } s/d ${data.period.end_date}</p>
            <p><strong>Tanggal Export:</strong> ${now.toLocaleDateString(
              'id-ID'
            )}</p>
            <p><strong>Waktu Export:</strong> ${now.toLocaleTimeString(
              'id-ID'
            )}</p>
          </div>

          <div class="section-header">RINGKASAN EKSEKUTIF</div>
          <div class="info">
            <p>• Total Pesanan: ${data.summary.total_orders} unit</p>
            <p>• Total Revenue: Rp ${data.summary.total_revenue.toLocaleString(
              'id-ID'
            )}</p>
            <p>• Rata-rata per Pesanan: Rp ${data.summary.average_order_value.toLocaleString(
              'id-ID'
            )}</p>
            <p>• Jumlah Hari: ${data.orders_by_date.length} hari</p>
          </div>
        </div>
    `;

    // Add each day's data with page break logic
    data.orders_by_date.forEach(
      (dayData: OrderByDate, dayIndex: number) => {
        htmlContent += `
        <div class="page-break">
          <div class="container">
            <div class="day-header">DETAIL TANGGAL: ${
              dayData.date
            }</div>
            <div class="summary-line">
              Total Pesanan: ${
                dayData.total_orders
              } | Daily Total: Rp ${dayData.daily_total.toLocaleString(
                'id-ID'
              )} | Cumulative: Rp ${dayData.cumulative_total.toLocaleString(
                'id-ID'
              )}
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 5%;">No.</th>
                  <th style="width: 14%;">Nomor Pesanan</th>
                  <th style="width: 14%;">Pelanggan</th>
                  <th style="width: 11%;">Status</th>
                  <th style="width: 18%;">Produk</th>
                  <th style="width: 5%;" class="qty">Qty</th>
                  <th style="width: 11%;" class="amount">Harga</th>
                  <th style="width: 11%;" class="amount">Subtotal</th>
                </tr>
              </thead>
              <tbody>
      `;

        dayData.orders.forEach((order: Order) => {
          let isFirstItem = true;
          order.items.forEach((item: OrderItem) => {
            htmlContent += `
            <tr>
              <td>${isFirstItem ? order.order_id : ''}</td>
              <td>${isFirstItem ? order.order_number : ''}</td>
              <td>${isFirstItem ? order.customer : ''}</td>
              <td>${isFirstItem ? order.status : ''}</td>
              <td>${item.name}</td>
              <td class="qty">${item.quantity}</td>
              <td class="amount">Rp ${item.price.toLocaleString(
                'id-ID'
              )}</td>
              <td class="amount">Rp ${item.subtotal.toLocaleString(
                'id-ID'
              )}</td>
            </tr>
          `;
            isFirstItem = false;
          });

          htmlContent += `
          <tr class="total-row">
            <td colspan="7">TOTAL PESANAN</td>
            <td class="amount">Rp ${order.total.toLocaleString(
              'id-ID'
            )}</td>
          </tr>
        `;
        });

        htmlContent += `
              <tr class="daily-total">
                <td>TOTAL HARIAN</td>
                <td>${dayData.total_orders} Pesanan</td>
                <td colspan="5"></td>
                <td class="amount">Rp ${dayData.daily_total.toLocaleString(
                  'id-ID'
                )}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
      }
    );

    // Add summary at the end
    htmlContent += `
      <div class="container">
        <div class="section-header">RINGKASAN AKHIR</div>
        <div class="info">
          <p><strong>Periode:</strong> ${
            data.period.start_date
          } s/d ${data.period.end_date}</p>
          <p><strong>Jumlah Hari:</strong> ${
            data.orders_by_date.length
          } hari</p>
          <p><strong>Total Pesanan:</strong> ${
            data.summary.total_orders
          }</p>
          <p><strong>Total Revenue:</strong> Rp ${data.summary.total_revenue.toLocaleString(
            'id-ID'
          )}</p>
        </div>

        <div class="note">
          <p><strong>CATATAN AUDIT:</strong></p>
          <p>Laporan ini dibuat secara otomatis oleh sistem untuk keperluan audit internal. Silakan verifikasi data dengan sumber data utama sebelum digunakan untuk keperluan resmi.</p>
        </div>

        <div class="footer">
          Generated by: Audit System | Date: ${now.toISOString()}
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
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const totalPages = Math.ceil(imgHeight / pageHeight);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add remaining pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    const filename = `audit-orders-${data.period.start_date}-to-${data.period.end_date}.pdf`;
    pdf.save(filename);

    console.log('✅ PDF file generated with multiple pages support');
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
    '║               LAPORAN AUDIT PESANAN LENGKAP                   ║'
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
      '┌────┬────────────────────┬──────────────────┬──────────────┬─────────────┬──────┬──────────────┬──────────────┐'
    );
    lines.push(
      '│ No.│ Nomor Pesanan      │ Pelanggan        │ Status       │ Produk      │ Qty  │ Harga        │ Subtotal     │'
    );
    lines.push(
      '├────┼────────────────────┼──────────────────┼──────────────┼─────────────┼──────┼──────────────┼──────────────┤'
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
        const status = isFirstItem
          ? order.status.padEnd(12)
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
          `│ ${no}│ ${orderNum} │ ${customer} │ ${status} │ ${product} │${qty} │${price} │${subtotal} │`
        );
        isFirstItem = false;
      });

      lines.push(
        '├────┼────────────────────┼──────────────────┼──────────────┼─────────────┼──────┼──────────────┼──────────────┤'
      );
      lines.push(
        `│    │ TOTAL PESANAN      │                  │              │             │      │              │ Rp ${order.total
          .toLocaleString('id-ID')
          .padStart(10)} │`
      );
      lines.push(
        '├────┼────────────────────┼──────────────────┼──────────────┼─────────────┼──────┼──────────────┼──────────────┤'
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

  lines.push('LAPORAN AUDIT PESANAN');
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
      'No.,Nomor Pesanan,Pelanggan,Status,Produk,Qty,Harga Satuan,Subtotal,Total Pesanan'
    );

    dayData.orders.forEach((order, orderIdx) => {
      order.items.forEach((item, itemIdx) => {
        const row = [
          orderIdx + 1,
          order.order_number,
          order.customer,
          order.status,
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
      `SUBTOTAL HARIAN,${dayData.total_orders},,,,,,,${dayData.daily_total}`
    );
    lines.push(`CUMULATIVE,${dayData.cumulative_total},,,,,,,`);
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
