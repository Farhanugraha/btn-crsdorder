import { DivisiOption } from './types';

export const DIVISI_OPTIONS: DivisiOption[] = [
  { value: 'CRSD 1', label: 'CRSD 1' },
  { value: 'CRSD 2', label: 'CRSD 2' },
  { value: 'Lainnya', label: 'Lainnya' }
];

export const REGISTER_MESSAGES = {
  SUCCESS: 'Registrasi berhasil! Silakan cek email Anda.',
  ERROR_GENERAL: 'Registrasi gagal. Silakan coba lagi.',
  ERROR_CONNECTION: 'Terjadi kesalahan koneksi. Pastikan server berjalan.',
  ERROR_FORM: 'Terjadi kesalahan pada form',
  ERROR_API_URL: 'Konfigurasi API tidak ditemukan. Silakan hubungi administrator.',
  PASSWORD_MISMATCH: 'Password tidak cocok'
} as const;

export const PASSWORD_REQUIREMENTS = [
  'Minimal 6 karakter',
  'Minimal 1 huruf BESAR (A-Z)',
  'Minimal 1 huruf kecil (a-z)',
  'Minimal 1 angka (0-9)',
  'Minimal 1 simbol (@$!%*?&)'
] as const;