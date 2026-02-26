'use client';

import { useParams } from 'next/navigation';
import { useEditUser } from './hooks/useEditUser';
import { EditHeader } from './components/EditHeader';
import { UserInfoForm } from './components/UserInfoForm';
import { DivisionSelector } from './components/DivisionSelector';
import { OrganizationInfo } from './components/OrganizationInfo';
import { PasswordChangeCard } from './components/PasswordChangeCard';
import { UserStatusCard } from './components/UserStatusCard';
import { FormActions } from './components/FormActions';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;

  const {
    mounted,
    isAuthenticated,
    user,
    formState,
    formData,
    divisionState,
    passwordData,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleDivisiSelect,
    handleCustomDivisiChange,
    handlePasswordChange,
    handleDivisionToggle,
    handleSelectAllDivisions,
    handleClearAllDivisions,
    handleSubmit,
    handleChangePassword,
    resetForm,
    formatDate,
    getRoleLabel
  } = useEditUser(userId);

  // Gunakan LoadingState untuk kondisi !mounted
  if (!mounted) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30">
              <AlertTriangle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">
            Autentikasi Diperlukan
          </h2>
          <p className="mb-4 text-center text-slate-600 dark:text-slate-300">
            {formState.error || 'Silakan login untuk melanjutkan'}
          </p>
        </div>
      </div>
    );
  }

  if (formState.loading) {
    return <LoadingState />;
  }

  if (formState.error && !user) {
    return <ErrorState error={formState.error} userId={userId} />;
  }

  if (!user) {
    return (
      <ErrorState error="Pengguna tidak ditemukan" userId={userId} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <EditHeader userId={userId} userName={user.name} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Alerts */}
        {formState.error && (
          <div className="animate-fade-in mb-6">
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <p className="font-medium text-red-700 dark:text-red-300">
                  {formState.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {formState.successMessage && (
          <div className="animate-fade-in mb-6">
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="flex-1">
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  {formState.successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Edit Form */}
          <div className="space-y-6 lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <UserInfoForm
                formData={formData}
                divisionState={divisionState}
                updating={formState.updating}
                error={formState.error}
                onInputChange={handleInputChange}
                onDivisiSelect={handleDivisiSelect}
                onCustomDivisiChange={handleCustomDivisiChange}
              />

              {/* Division Selector untuk Admin */}
              {divisionState.showDivisionSelector && (
                <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Akses Divisi CRSD
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Pilih divisi yang dapat diakses oleh admin
                    </p>
                  </div>
                  <div className="p-5">
                    <DivisionSelector
                      selectedDivisions={
                        divisionState.selectedDivisions
                      }
                      onToggle={handleDivisionToggle}
                      onSelectAll={handleSelectAllDivisions}
                      onClearAll={handleClearAllDivisions}
                    />
                  </div>
                </div>
              )}

              <OrganizationInfo
                formData={formData}
                updating={formState.updating}
                onInputChange={handleInputChange}
              />

              <FormActions
                updating={formState.updating}
                onReset={resetForm}
              />
            </form>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <PasswordChangeCard
              passwordData={passwordData}
              showPassword={showPassword}
              updating={formState.updating}
              onPasswordChange={handlePasswordChange}
              onToggleShowPassword={() =>
                setShowPassword(!showPassword)
              }
              onSubmit={handleChangePassword}
            />

            <UserStatusCard
              user={user}
              selectedDivisions={divisionState.selectedDivisions}
              formatDate={formatDate}
              getRoleLabel={getRoleLabel}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
