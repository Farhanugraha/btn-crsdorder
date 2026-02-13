'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  useOrderDetail,
  LoadingState,
  ErrorState,
  OrderDetailHeader,
  OrderInfoCard,
  RestaurantGroup,
  OrderNotes,
  OrderTotal,
  ActionButtons,
  CancelOrderDialog,
  calculateSubtotal,
  groupItemsByRestaurant
} from '@/components/order/detail';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const {
    mounted,
    order,
    restaurants,
    isLoading,
    isCancelling,
    showCancelDialog,
    setShowCancelDialog,
    error,
    totalPrice,
    groupedItems,
    loadOrderData,
    handleCancelOrder,
    handleBack,
    handleCheckout
  } = useOrderDetail(orderId);

  if (!mounted) return null;
  if (isLoading) return <LoadingState />;
  if (error || !order) {
    return (
      <ErrorState
        orderId={orderId}
        error={error || 'Pesanan tidak ditemukan'}
        onRetry={loadOrderData}
        onBack={handleBack}
      />
    );
  }

  const groupedItemsData = groupedItems || {};

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <OrderDetailHeader
          onBack={handleBack}
          status={order.status}
        />
        <OrderInfoCard
          orderCode={order.order_code}
          status={order.status}
          createdAt={order.created_at}
        />

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Rincian Pesanan
          </h2>

          <div className="space-y-6">
            {Object.entries(groupedItemsData).map(
              ([restoId, items]) => {
                const restaurant = restaurants.get(parseInt(restoId));
                const subtotal = calculateSubtotal(items);

                return (
                  <RestaurantGroup
                    key={restoId}
                    restaurant={restaurant}
                    items={items}
                    subtotal={subtotal}
                  />
                );
              }
            )}
          </div>

          <OrderNotes notes={order.notes} />
          <OrderTotal totalPrice={totalPrice} />
        </div>

        <ActionButtons
          status={order.status}
          orderId={order.id}
          onCheckout={handleCheckout}
          onCancel={() => setShowCancelDialog(true)}
          onBack={handleBack}
        />
      </div>

      <CancelOrderDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        orderCode={order.order_code}
        isCancelling={isCancelling}
        onConfirm={handleCancelOrder}
      />
    </div>
  );
}
