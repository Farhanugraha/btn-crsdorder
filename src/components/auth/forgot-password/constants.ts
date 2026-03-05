export const FORGOT_PASSWORD_MESSAGES = {
  SUCCESS: 'Link reset password telah dikirim ke email Anda',
  ERROR_EMAIL_NOT_FOUND: 'Email tidak ditemukan',
  ERROR_GENERAL: 'Terjadi kesalahan. Silakan coba lagi.',
  ERROR_CONNECTION: 'Terjadi kesalahan koneksi. Pastikan server berjalan',
  EMAIL_SENT_TITLE: 'Email Terkirim!',
  EMAIL_SENT_SUBTITLE: 'Link reset password telah dikirim ke email Anda',
  EMAIL_SENT_DESCRIPTION: 'Silakan cek email Anda dan klik link reset password. Link akan berlaku selama 1 jam.',
  EMAIL_NOT_RECEIVED: 'Tidak menerima email?',
  REDIRECT_MESSAGE: 'Akan diarahkan ke login dalam 5 detik...',
  TOKEN_EXPIRY: 'Link akan berlaku selama 1 jam'
} as const;

export const FORGOT_PASSWORD_LINKS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register'
} as const;

export const REDIRECT_DELAY = 5000; // 5 detik
export const TOKEN_EXPIRY_HOURS = 1;