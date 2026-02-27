'use client';

import { useRestaurants } from './hooks/useRestaurants';
import { RestaurantsHeader } from './components/RestaurantsHeader';
import { MessageAlert } from './components/MessageAlert';
import { SearchBar } from './components/SearchBar';
import { RestaurantForm } from './components/RestaurantForm';
import { FilterToolbar } from './components/FilterToolbar';
import { RestaurantGridView } from './components/RestaurantGridView';
import { RestaurantListView } from './components/RestaurantListView';
import { DeleteModal } from './components/DeleteModal';
import { LoadingState } from './components/LoadingState';
import { GridSkeleton } from './components/skeleton/GridSkeleton';
import { ListSkeleton } from './components/skeleton/ListSkeleton';
import { FilterSkeleton } from './components/skeleton/FilterSkeleton';
// HAPUS import API_URL karena tidak digunakan di sini

export default function RestaurantsPage() {
  const {
    // State
    isLoading,
    restaurants,
    areas,
    isLoadingRestaurants,
    isSubmitting,
    showForm,
    viewMode,
    filterStatus,
    filterArea,
    editingId,
    message,
    deleteConfirm,
    togglingId,
    searchQuery,
    formData,
    filteredRestaurants,
    openCount,
    closedCount,

    // Setters
    setShowForm,
    setViewMode,
    setFilterStatus,
    setFilterArea,
    setSearchQuery,
    setDeleteConfirm,

    // Actions
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleStatus,
    handleFormChange,
    handlePhotoUpload,
    handleRemovePhoto,
    showMessage,

    // Helpers
    getIsOpen
  } = useRestaurants();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <RestaurantsHeader
        showForm={showForm}
        restaurantsCount={restaurants.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddClick={() => setShowForm(true)}
      />

      {/* Alert Messages */}
      {message && (
        <MessageAlert
          message={message}
          onClose={() => showMessage('success', '')}
        />
      )}

      {/* Search Bar Section */}
      {!showForm && restaurants.length > 0 && (
        <SearchBar
          searchQuery={searchQuery}
          filteredCount={filteredRestaurants.length}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      )}

      {/* Main Content */}
      <main className="px-4 py-6 pt-6 sm:px-6 lg:px-8">
        <div
          className={`grid gap-6 ${
            showForm ? 'lg:grid-cols-4' : 'lg:grid-cols-1'
          }`}
        >
          {/* Form Section */}
          {showForm && (
            <RestaurantForm
              formData={formData}
              areas={areas}
              editingId={editingId}
              isSubmitting={isSubmitting}
              // HAPUS prop apiUrl dari sini
              onFormChange={handleFormChange}
              onPhotoUpload={handlePhotoUpload}
              onRemovePhoto={handleRemovePhoto}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          )}

          {/* Restaurants List */}
          <div
            className={showForm ? 'lg:col-span-3' : 'lg:col-span-1'}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
              {/* Filter Toolbar */}
              <FilterToolbar
                filterStatus={filterStatus}
                filterArea={filterArea}
                areas={areas}
                openCount={openCount}
                closedCount={closedCount}
                totalCount={restaurants.length}
                onStatusChange={setFilterStatus}
                onAreaChange={setFilterArea}
              />

              {/* Content */}
              <div className="p-4 sm:p-6">
                {isLoadingRestaurants ? (
                  // Skeleton Loading
                  viewMode === 'grid' ? (
                    <GridSkeleton />
                  ) : (
                    <ListSkeleton />
                  )
                ) : filteredRestaurants.length > 0 ? (
                  viewMode === 'grid' ? (
                    <RestaurantGridView
                      restaurants={filteredRestaurants}
                      togglingId={togglingId}
                      onEdit={handleEdit}
                      onToggleStatus={handleToggleStatus}
                      onDelete={(id) => setDeleteConfirm(id)}
                    />
                  ) : (
                    <RestaurantListView
                      restaurants={filteredRestaurants}
                      togglingId={togglingId}
                      onEdit={handleEdit}
                      onToggleStatus={handleToggleStatus}
                      onDelete={(id) => setDeleteConfirm(id)}
                    />
                  )
                ) : (
                  <div className="py-20 text-center font-medium text-slate-500">
                    Restoran tidak ditemukan
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteConfirm !== null}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
