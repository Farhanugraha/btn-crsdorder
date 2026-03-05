export const VERIFY_MESSAGES = {
  LOADING: 'Memproses verifikasi...',
  SUCCESS_TITLE: '✨ Verifikasi Berhasil!',
  SUCCESS_MESSAGE: 'Email Anda telah berhasil diverifikasi! 🎉',
  SUCCESS_DESCRIPTION: 'Akun Anda sudah siap digunakan. Silakan login untuk mulai berbelanja di CRSD BTN FOODER.',
  ERROR_TITLE: '⚠️ Verifikasi Gagal',
  ERROR_DEFAULT: 'Gagal memverifikasi email. Link mungkin sudah expired.',
  ERROR_UNVERIFIED: 'Email belum diverifikasi.',
  LOGIN_BUTTON: 'Login Sekarang',
  EXPLORE_BUTTON: '🛒 Jelajahi Menu',
  REGISTER_BUTTON: '📧 Daftar Ulang',
  BACK_TO_LOGIN: 'Kembali ke Login',
  CONTACT_SUPPORT: 'Hubungi Dukungan',
  SUPPORT_TEXT: 'Memiliki masalah?',
  SUCCESS_TIP: '💡 Gunakan email dan password yang telah Anda daftarkan untuk login',
  ERROR_TIP: '💡 Link sudah expired? Silakan daftar ulang untuk mendapatkan link baru'
} as const;

export const VERIFY_LINKS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  AREAS: '/areas'
} as const;