'use client';

import { useEffect } from 'react';
import {
  Header,
  Alert,
  Loading,
  QRISCard,
  BankCard,
  GlobalCard,
  DeleteConfirmDialog,
  usePaymentSettings,
  useQRISUpload
} from '@/components/dashboard/superadmin/paymentsettings';

export default function PaymentSettingsPage() {
  const {
    isLoading,
    isLoadingData,
    isSaving,
    message,
    settings,
    formData,
    hasChanges,
    imagePreview,
    setImagePreview,
    setFormData,
    checkAuth,
    fetchSettings,
    updateSettings,
    showMessage,
    handleInputChange,
    handleToggle,
    resetToOriginal
  } = usePaymentSettings();

  const {
    isUploading,
    deleteConfirm,
    setDeleteConfirm,
    uploadImage,
    deleteImage
  } = useQRISUpload(fetchSettings, showMessage);

  useEffect(() => {
    const init = async () => {
      const isAuthed = await checkAuth();
      if (isAuthed) {
        await fetchSettings();
      }
    };
    init();
  }, []);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setFormData((prev) => ({
        ...prev,
        qris_image_file: file,
        qris_image_preview: reader.result as string
      }));
    };
    reader.readAsDataURL(file);

    await uploadImage(file);
  };

  // Tampilkan loading spinner selama data belum siap
  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Header
          hasChanges={false}
          isSaving={false}
          onReset={() => {}}
          onSave={() => {}}
        />
        <Loading
          isLoading={isLoading}
          isLoadingData={isLoadingData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header
        hasChanges={hasChanges}
        isSaving={isSaving}
        onReset={resetToOriginal}
        onSave={updateSettings}
      />

      <Alert
        message={message}
        onClose={() => showMessage('info', '')}
      />

      <main className="px-4 py-6 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <QRISCard
            formData={formData}
            imagePreview={imagePreview}
            isUploading={isUploading}
            settings={settings}
            onToggle={handleToggle}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
            onDeleteClick={() => setDeleteConfirm(true)}
          />

          <div className="lg:col-span-1">
            <BankCard
              formData={formData}
              settings={settings}
              onToggle={handleToggle}
              onInputChange={handleInputChange}
            />
            <GlobalCard
              formData={formData}
              settings={settings}
              onToggle={handleToggle}
            />
          </div>
        </div>
      </main>

      <DeleteConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={deleteImage}
      />
    </div>
  );
}
