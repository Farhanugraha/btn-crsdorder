export const RESET_PASSWORD_MESSAGES = {
  SUCCESS: 'Password berhasil direset! Silakan login dengan password baru.',
  ERROR_GENERAL: 'Gagal mereset password. Silakan coba lagi.',
  ERROR_CONNECTION: 'Terjadi kesalahan koneksi. Pastikan server berjalan.',
  ERROR_INVALID_LINK: 'Link reset password tidak valid atau sudah expired.',
  INVALID_LINK_TITLE: 'Invalid Link',
  INVALID_LINK_DESCRIPTION: 'Link reset password tidak valid atau sudah expired',
  BACK_TO_FORGOT: 'Kembali ke Forgot Password',
  REMEMBER_PASSWORD: 'Sudah ingat password?',
  LOGIN_HERE: 'Login di sini',
  PASSWORD_SECURE: 'Password Anda akan dienkripsi dan aman bersama kami.'
} as const;

export const RESET_PASSWORD_LINKS = {
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password'
} as const;

export const REDIRECT_DELAY = 2000; // 2 detik
export const PASSWORD_MIN_LENGTH = 6;