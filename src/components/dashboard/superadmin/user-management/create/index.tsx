'use client';

import { useCreateUser } from './hooks/useCreateUser';
import { CreateHeader } from './components/CreateHeader';
import { BasicInfoForm } from './components/BasicInfoForm';
import { SecurityForm } from './components/SecurityForm';
import { RoleSelector } from './components/RoleSelector';
import { DataAccessSelector } from './components/DataAccessSelector';
import { OrganizationInfo } from './components/OrganizationInfo';
import { FormActions } from './components/FormActions';
import { InfoTips } from './components/InfoTips';
import { SuccessAlert } from './components/SuccessAlert';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { AlertTriangle } from 'lucide-react';

export default function CreateUserPage() {
  const {
    mounted,
    isAuthenticated,
    formState,
    formData,
    passwordState,
    divisionState,
    dataAccessState,
    handleInputChange,
    handleDivisiSelect,
    handleCustomDivisiChange,
    handleDataTypeToggle,
    handleRemoveDataType,
    toggleShowDropdown,
    closeDropdown,
    handleRoleChange,
    toggleShowPassword,
    toggleShowConfirmPassword,
    handleSubmit,
    getSelectedDataTypesDisplay
  } = useCreateUser();

  // Hitung validasi password
  const password = formData.password || '';
  const confirmPassword = formData.password_confirmation || '';

  const passwordValid =
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[@$!%*?&]/.test(password);

  const passwordMatch = password === confirmPassword;
  const passwordFilled =
    password.length > 0 && confirmPassword.length > 0;

  if (!mounted) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorState
        error={formState.error || 'Silakan login untuk melanjutkan'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <CreateHeader />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Alerts */}
        {formState.successMessage && (
          <SuccessAlert message={formState.successMessage} />
        )}

        {formState.error && (
          <div className="animate-fade-in mb-6">
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="font-medium text-red-700 dark:text-red-300">
                {formState.error}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="space-y-6">
                <BasicInfoForm
                  formData={formData}
                  onInputChange={handleInputChange}
                />

                <SecurityForm
                  formData={formData}
                  passwordState={passwordState}
                  onInputChange={handleInputChange}
                  onTogglePassword={toggleShowPassword}
                  onToggleConfirmPassword={toggleShowConfirmPassword}
                />

                <RoleSelector
                  selectedRole={formData.role}
                  onRoleChange={handleRoleChange}
                />

                {/* Data Access - Only for Admin */}
                {formData.role === 'admin' && (
                  <DataAccessSelector
                    selectedDataTypes={
                      dataAccessState.selectedDataTypes
                    }
                    dataTypeOptions={dataAccessState.dataTypeOptions}
                    showDropdown={dataAccessState.showDropdown}
                    loadingDataTypes={
                      dataAccessState.loadingDataTypes
                    }
                    onToggle={handleDataTypeToggle}
                    onRemove={handleRemoveDataType}
                    onToggleDropdown={toggleShowDropdown}
                    onCloseDropdown={closeDropdown}
                    getSelectedDisplay={getSelectedDataTypesDisplay}
                  />
                )}

                <OrganizationInfo
                  formData={formData}
                  divisionState={divisionState}
                  onInputChange={handleInputChange}
                  onDivisiSelect={handleDivisiSelect}
                  onCustomDivisiChange={handleCustomDivisiChange}
                />
              </div>
            </div>

            <FormActions
              loading={formState.loading}
              role={formData.role}
              selectedDataTypesLength={
                dataAccessState.selectedDataTypes.length
              }
              // PERBAIKAN: Tambahkan props untuk validasi password
              passwordValid={passwordValid}
              passwordMatch={passwordMatch}
              passwordFilled={passwordFilled}
            />
          </form>
        </div>

        <InfoTips />
      </main>

      {/* Click outside to close dropdown */}
      {dataAccessState.showDropdown && (
        <div className="fixed inset-0 z-0" onClick={closeDropdown} />
      )}
    </div>
  );
}
