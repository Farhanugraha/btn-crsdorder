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
    allMenus,
    isLoadingMenus,
    isSubmitting,
    showForm,
    editingId,
    togglingId,
    filterStatus,
    searchQuery,
    message,
    deleteConfirm,
    imagePreview,
    imageFile,
    formData,
    availableCount,
    unavailableCount,

    // Pagination values
    currentPage,
    itemsPerPage,
    totalPages,
    totalMenus,

    // Setters
    setShowForm,
    setFilterStatus,
    setSearchQuery,
    setDeleteConfirm,
    setFormData,
    setImagePreview,
    setImageFile,

    // Pagination handlers
    handlePageChange,
    handleItemsPerPageChange,

    // Actions
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleAvailability,
    handleImageChange,
    handleFormChange,
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

      <RestaurantInfo
        restaurant={restaurant}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

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
              onFormChange={handleFormChange}
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
                totalMenus={allMenus.length}
                availableCount={availableCount}
                unavailableCount={unavailableCount}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
              />

              <div className="p-4 sm:p-6">
                <MenuList
                  menus={menus}
                  isLoading={isLoadingMenus}
                  filterStatus={filterStatus}
                  togglingId={togglingId}
                  totalMenus={totalMenus}
                  onEdit={handleEdit}
                  onToggleAvailability={handleToggleAvailability}
                  onDelete={(id) => setDeleteConfirm(id)}
                  onAddFirst={() => setShowForm(true)}
                  formatCurrency={formatCurrency}
                  getImageSrc={getImageSrc}
                  // Pagination props
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
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
