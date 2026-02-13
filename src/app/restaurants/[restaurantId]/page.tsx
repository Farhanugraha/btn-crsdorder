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
    setNotes
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
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {menuList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                Daftar Menu
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {menuList.length} pilihan menu spesial
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
