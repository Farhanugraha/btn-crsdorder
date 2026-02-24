'use client';

import { useState } from 'react';

export const useQRISUpload = (
  fetchSettings: () => Promise<void>,
  showMessage: (type: 'success' | 'error' | 'info', text: string) => void
) => {
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const validateImageFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return 'Format file tidak valid. Gunakan JPG, PNG, atau GIF.';
    }
    
    if (file.size > maxSize) {
      return 'Ukuran file maksimal 2MB.';
    }
    
    return null;
  };

  const uploadImage = async (file: File) => {
    const error = validateImageFile(file);
    if (error) {
      showMessage('error', error);
      return false;
    }

    setIsUploading(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const formData = new FormData();
      formData.append('qris_image', file);

      const response = await fetch(`${apiUrl}/api/superadmin/payment-settings/upload-qris`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Gambar QRIS berhasil diunggah');
        await fetchSettings();
        return true;
      }
      
      showMessage('error', data.message || 'Gagal mengunggah gambar');
      return false;
    } catch {
      showMessage('error', 'Gagal mengunggah gambar');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async () => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/superadmin/payment-settings/delete-qris`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Gambar QRIS berhasil dihapus');
        await fetchSettings();
      } else {
        showMessage('error', data.message || 'Gagal menghapus gambar');
      }
    } catch {
      showMessage('error', 'Gagal menghapus gambar');
    } finally {
      setDeleteConfirm(false);
    }
  };

  return {
    isUploading,
    deleteConfirm,
    setDeleteConfirm,
    uploadImage,
    deleteImage
  };
};