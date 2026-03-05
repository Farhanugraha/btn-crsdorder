export const PAYMENT_MESSAGES = {
  LOADING: 'Memuat Detail Pembayaran',
  LOADING_DESC: 'Sedang mengambil detail pembayaran...',
  NOT_FOUND: 'Pembayaran Tidak Ditemukan',
  NOT_FOUND_DESC: 'Data pembayaran tidak ditemukan',
  INVALID_DATA: 'Data pembayaran tidak valid',
  UPDATE_SUCCESS: 'Status pembayaran berhasil diperbarui',
  UPDATE_ERROR: 'Gagal memperbarui status pembayaran',
  CONFIRM_SUCCESS: 'Pembayaran berhasil dikonfirmasi',
  REJECT_SUCCESS: 'Pembayaran berhasil ditolak',
  BACK_BUTTON: 'Kembali',
  REFRESH_BUTTON: 'Refresh',
  SAVE_BUTTON: 'Simpan',
  CANCEL_BUTTON: 'Batal',
  VERIFY_BUTTON: 'Verifikasi Pembayaran',
  CONFIRM_BUTTON: 'Konfirmasi',
  REJECT_BUTTON: 'Tolak'
} as const;

export const PAYMENT_METHODS: Record<string, string> = {
  qris: 'QRIS',
  bank_transfer: 'Transfer Bank',
  credit_card: 'Kartu Kredit',
  e_wallet: 'E-Wallet'
};

export const PAYMENT_STATUS = {
  pending: {
    label: 'Menunggu Verifikasi',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
  },
  completed: {
    label: 'Terverifikasi',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
  },
  rejected: {
    label: 'Ditolak',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  }
};

export const ORDER_STATUS = {
  processing: {
    label: 'Sedang Diproses',
    color: 'text-blue-600 dark:text-blue-400'
  },
  paid: {
    label: 'Dibayar',
    color: 'text-green-600 dark:text-green-400'
  },
  completed: {
    label: 'Selesai',
    color: 'text-emerald-600 dark:text-emerald-400'
  }
};