import type { PaymentSettings, PaymentFormData } from '../types';

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