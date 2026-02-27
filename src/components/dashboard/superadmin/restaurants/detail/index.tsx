'use client';

import { useParams } from 'next/navigation';
import { useRestaurantDetail } from './hooks/useRestaurantDetail';
import { DetailHeader } from './components/DetailHeader';
import { MessageAlert } from './components/MessageAlert';
import { RestaurantInfo } from './components/RestaurantInfo';
import { MenuForm } from './components/MenuForm';
import { MenuFilter } from './components/MenuFilter';
import { MenuList } from './components/MenuList';
import { DeleteModal } from './components/DeleteModal';
import { LoadingState } from './components/LoadingState';
import { NotFoundState } from './components/NotFoundState';
import {
  DetailHeaderSkeleton,
  RestaurantInfoSkeleton,
  MenuFilterSkeleton
} from './components/skeleton';

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = params?.id as string;

  const {
    // State
    isLoading,
    isInitialized,
    restaurant,
    menus,
    isLoadingMenus,
    isSubmitting,
    showForm,
    editingId,
    togglingId,
    filterStatus,
    message,
    deleteConfirm,
    imagePreview,
    imageFile,
    formData,
    availableCount,
    unavailableCount,
    filteredMenus,

    // Setters
    setShowForm,
    setFilterStatus,
    setDeleteConfirm,
    setFormData, // <-- SEKARANG TERSEDIA
    setImagePreview, // <-- SEKARANG TERSEDIA
    setImageFile, // <-- SEKARANG TERSEDIA

    // Actions
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleAvailability,
    handleImageChange,
    showMessage,

    // Helpers
    formatCurrency,
    getImageSrc
  } = useRestaurantDetail(restaurantId);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <DetailHeaderSkeleton />
        <RestaurantInfoSkeleton />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="sticky top-24 h-[500px] animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <MenuFilterSkeleton />
                <div className="p-4 sm:p-6">
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4"
                      >
                        <div className="h-16 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                          <div className="h-6 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!isInitialized) {
    return null;
  }

  if (!restaurant) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <DetailHeader
        restaurant={restaurant}
        showForm={showForm}
        onAddClick={() => setShowForm(true)}
      />

      {/* Alert Messages */}
      {message && (
        <MessageAlert
          message={message}
          onClose={() => showMessage('success', '')}
        />
      )}

      <RestaurantInfo restaurant={restaurant} />

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div
          className={`grid gap-6 ${
            showForm ? 'lg:grid-cols-4' : 'lg:grid-cols-1'
          }`}
        >
          {/* Form Section */}
          {showForm && (
            <MenuForm
              formData={formData}
              editingId={editingId}
              isSubmitting={isSubmitting}
              imagePreview={imagePreview}
              imageFile={imageFile}
              onFormChange={(e) => {
                const { name, value, type, checked } = e.target;
                setFormData((prev: any) => ({
                  ...prev,
                  [name]: type === 'checkbox' ? checked : value
                }));
              }}
              onImageChange={handleImageChange}
              onRemoveImage={() => {
                setImagePreview('');
                setImageFile(null);
              }}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          )}

          {/* Menus List */}
          <div
            className={showForm ? 'lg:col-span-3' : 'lg:col-span-1'}
          >
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <MenuFilter
                totalMenus={menus.length}
                availableCount={availableCount}
                unavailableCount={unavailableCount}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
              />

              <div className="p-4 sm:p-6">
                <MenuList
                  menus={filteredMenus}
                  isLoading={isLoadingMenus}
                  filterStatus={filterStatus}
                  togglingId={togglingId}
                  totalMenus={menus.length}
                  onEdit={handleEdit}
                  onToggleAvailability={handleToggleAvailability}
                  onDelete={(id) => setDeleteConfirm(id)}
                  onAddFirst={() => setShowForm(true)}
                  formatCurrency={formatCurrency}
                  getImageSrc={getImageSrc}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteConfirm !== null}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
