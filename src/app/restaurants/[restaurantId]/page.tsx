'use client';

import { useParams } from 'next/navigation';
import {
  useRestaurantMenu,
  LoadingState,
  ErrorState,
  RestaurantHeader,
  MenuGrid,
  EmptyState
} from '@/components/restaurants/detail';

export default function RestaurantMenuPage() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;

  const {
    isLoading,
    restaurant,
    menuList,
    searchQuery,
    error,
    dialogOpen,
    selectedQuantity,
    notes,
    isAddingToCart,
    areaId,
    isLoggedIn,
    toggleDialog,
    handleAddToCart,
    handleBack,
    handleLoginRedirect,
    setSelectedQuantity,
    setNotes,
    handleSearchChange
  } = useRestaurantMenu(restaurantId);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  if (isLoading) return <LoadingState />;
  if (error || !restaurant)
    return <ErrorState error={error || 'Restoran tidak ditemukan'} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <RestaurantHeader
        restaurant={restaurant}
        areaId={areaId}
        onBack={handleBack}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Search info */}
        {searchQuery && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Menampilkan{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {menuList.length}
              </span>{' '}
              menu untuk pencarian "{searchQuery}"
            </p>
            {menuList.length === 0 && (
              <button
                onClick={() => handleSearchChange('')}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Reset pencarian
              </button>
            )}
          </div>
        )}

        {menuList.length === 0 ? (
          <div className="relative">
            <EmptyState />
            {searchQuery && (
              <div className="mt-4 text-center">
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                  Tidak ada menu yang cocok dengan pencarian "
                  {searchQuery}"
                </p>
                <button
                  onClick={() => handleSearchChange('')}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  Tampilkan semua menu
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                Daftar Menu
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {menuList.length} dari{' '}
                {restaurant.menus_count || menuList.length} pilihan
                menu spesial
              </p>
            </div>

            <MenuGrid
              menuList={menuList}
              isLoggedIn={isLoggedIn}
              apiUrl={apiUrl}
              dialogOpen={dialogOpen}
              selectedQuantity={selectedQuantity}
              notes={notes}
              isAddingToCart={isAddingToCart}
              onToggleDialog={toggleDialog}
              onQuantityChange={(menuId, quantity) =>
                setSelectedQuantity((prev) => ({
                  ...prev,
                  [String(menuId)]: quantity
                }))
              }
              onNotesChange={(menuId, noteText) =>
                setNotes((prev) => ({
                  ...prev,
                  [String(menuId)]: noteText
                }))
              }
              onAddToCart={handleAddToCart}
              onLoginRedirect={handleLoginRedirect}
            />
          </div>
        )}
      </main>
    </div>
  );
}
