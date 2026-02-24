import { VALIDATION } from './constants';
import type { PaymentSettings, PaymentFormData } from '../types';

const isValidFileType = (fileType: string): fileType is typeof VALIDATION.ALLOWED_FILE_TYPES[number] => {
  return VALIDATION.ALLOWED_FILE_TYPES.includes(fileType as any);
};

export const validateImageFile = (file: File): string | null => {
  
  if (!isValidFileType(file.type)) {
    return 'Format file tidak valid. Gunakan JPG, PNG, atau GIF.';
  }
  
  if (file.size > VALIDATION.MAX_FILE_SIZE) {
    return 'Ukuran file maksimal 2MB.';
  }
  
  return null;
};

export const createFormDataFromSettings = (
  settings: PaymentSettings | null
): PaymentFormData => ({
  qris_title: settings?.qris_title || 'QRIS Pembayaran',
  qris_active: Boolean(settings?.qris_active),
  bank_name: settings?.bank_name || '',
  account_number: settings?.account_number || '',
  account_name: settings?.account_name || '',
  bank_active: Boolean(settings?.bank_active),
  active: Boolean(settings?.active),
  qris_image_preview: settings?.qris_image_url
});

export const hasFormChanges = (
  formData: PaymentFormData,
  settings: PaymentSettings | null
): boolean => {
  if (!settings) return false;
  
  return (
    formData.qris_title !== settings.qris_title ||
    formData.qris_active !== settings.qris_active ||
    formData.bank_name !== settings.bank_name ||
    formData.account_number !== settings.account_number ||
    formData.account_name !== settings.account_name ||
    formData.bank_active !== settings.bank_active ||
    formData.active !== settings.active ||
    formData.qris_image_file !== undefined
  );
};

export const getModuleName = (module: string) => {
  switch (module) {
    case 'general': return 'Umum';
    case 'crsd1': return 'CRSD 1';
    case 'crsd2': return 'CRSD 2';
    default: return module;
  }
};