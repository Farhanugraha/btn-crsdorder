export const LOGIN_MESSAGES = {
  SUCCESS: 'Login berhasil!',
  ERROR_INVALID_CREDENTIALS: 'Email atau password salah',
  ERROR_CONNECTION: 'Terjadi kesalahan koneksi. Pastikan server berjalan',
  ERROR_VALIDATION: 'Validasi form gagal',
  ERROR_TOKEN_EXPIRED: 'Sesi telah berakhir. Silakan login kembali'
} as const;

export const REDIRECT_PATHS = {
  superadmin: '/dashboard/superadmin',
  admin: '/dashboard/admin',
  user: '/areas',
  checkout: '/checkout'
} as const;

export const TOKEN_CONFIG = {
  DEFAULT_EXPIRY: 3600, 
  STORAGE_KEYS: {
    TOKEN: 'auth_token',
    USER: 'auth_user',
    EXPIRES: 'token_expires_in'
  }
} as const;