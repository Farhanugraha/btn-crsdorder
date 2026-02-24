export const PAYMENT_API = {
  GET: '/api/superadmin/payment-settings',
  UPDATE: '/api/superadmin/payment-settings',
  UPLOAD_QRIS: '/api/superadmin/payment-settings/upload-qris',
  DELETE_QRIS: '/api/superadmin/payment-settings/delete-qris'
} as const;

export const PAYMENT_MESSAGES = {
  SUCCESS: {
    UPDATE: 'Pengaturan pembayaran berhasil diperbarui',
    UPLOAD: 'Gambar QRIS berhasil diunggah',
    DELETE: 'Gambar QRIS berhasil dihapus'
  },
  ERROR: {
    FETCH: 'Gagal memuat pengaturan pembayaran',
    UPDATE: 'Gagal menyimpan pengaturan',
    UPLOAD: 'Gagal mengunggah gambar',
    DELETE: 'Gagal menghapus gambar'
  }
} as const;

export const VALIDATION = {
  MAX_FILE_SIZE: 2 * 1024 * 1024,
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
} as const;