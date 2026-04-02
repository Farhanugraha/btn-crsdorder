'use client';

import { useAreas } from './hooks/useAreas';
import { AreasHeader } from './components/AreasHeader';
import { LoadingState } from './components/LoadingState';
import { MessageAlert } from './components/MessageAlert';
import { AreaForm } from './components/AreaForm';
import { AreasList } from './components/AreasList';
import { DeleteModal } from './components/DeleteModal';
import { MapPin } from 'lucide-react';

export default function AreasPage() {
  const {
    user,
    areas,
    isLoading,
    isLoadingAreas,
    isSubmitting,
    showForm,
    viewMode,
    formData,
    editingId,
    message,
    deleteConfirm,
    nextOrder,
    setShowForm,
    setDeleteConfirm,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleActive,
    handleFormChange,
    handleIconSelect,
    handleIconCustom,
    toggleViewMode,
    showMessage
  } = useAreas();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AreasHeader
        showForm={showForm}
        areasCount={areas.length}
        viewMode={viewMode}
        onViewModeChange={toggleViewMode}
        onAddClick={() => setShowForm(true)}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {message && (
          <MessageAlert
            message={message}
            onClose={() => showMessage('success', '')}
          />
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          {showForm && (
            <AreaForm
              formData={formData}
              editingId={editingId}
              isSubmitting={isSubmitting}
              nextOrder={nextOrder}
              onFormChange={handleFormChange}
              onIconSelect={handleIconSelect}
              onIconCustom={handleIconCustom}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          )}

          <div className="flex-1">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Daftar Area
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {areas.length} area terdaftar dalam sistem
                      </p>
                    </div>
                  </div>

                  {areas.length > 0 && !showForm && (
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span className="text-blue-600 dark:text-blue-400">
                        {areas.length}
                      </span>{' '}
                      total area
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <AreasList
                  areas={areas}
                  isLoading={isLoadingAreas}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteConfirm(id)}
                  onToggleActive={handleToggleActive}
                  onAddFirst={() => setShowForm(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <DeleteModal
        isOpen={deleteConfirm !== null}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
