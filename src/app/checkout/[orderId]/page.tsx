'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  useCheckout,
  LoadingState,
  CheckoutHeader,
  OrderCodeCard,
  OrderSummary,
  PaymentMethodSelection,
  PaymentDetailsQRIS,
  PaymentDetailsTransfer,
  UploadProof,
  CheckoutSidebar,
  ActionButtons,
  SuccessDialog,
  CancelDialog,
  NoPaymentDialog,
  NoPaymentMethodsDialog
} from '@/components/checkout';

export default function CheckoutConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const {
    mounted,
    order,
    restaurants,
    paymentSettings,
    isLoading,
    isLoadingPaymentMethods,
    isSubmitting,
    isCancelling,
    showSuccessModal,
    setShowSuccessModal,
    showNoPaymentDialog,
    setShowNoPaymentDialog,
    showNoPaymentMethodsDialog,
    setShowNoPaymentMethodsDialog,
    paymentMethod,
    setPaymentMethod,
    availablePaymentMethods,
    copiedText,
    proofImagePreview,
    confirmationNotes,
    setConfirmationNotes,
    showCancelDialog,
    setShowCancelDialog,
    groupedItems,
    totalPrice,
    handleImageChange,
    handleSubmitConfirmation,
    handleCancelOrder,
    copyToClipboard,
    resetProofImage,
    loadOrderData
  } = useCheckout(orderId);

  if (!mounted) return null;
  if (isLoading || isLoadingPaymentMethods)
    return (
      <LoadingState
        message={
          isLoadingPaymentMethods
            ? 'Memuat metode pembayaran...'
            : 'Memuat pembayaran...'
        }
        submessage={
          isLoadingPaymentMethods
            ? 'Mengambil data metode pembayaran...'
            : 'Sedang mengambil data pembayaran anda, harap tunggu.'
        }
      />
    );

  if (
    availablePaymentMethods.length === 0 &&
    paymentSettings?.active === false
  ) {
    return (
      <NoPaymentMethodsDialog
        open={showNoPaymentMethodsDialog}
        onOpenChange={setShowNoPaymentMethodsDialog}
      />
    );
  }

  if (!order) {
    return (
      <NoPaymentDialog
        open={showNoPaymentDialog}
        onOpenChange={setShowNoPaymentDialog}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <CheckoutHeader />
        <OrderCodeCard
          orderCode={order.order_code}
          copiedText={copiedText}
          onCopy={copyToClipboard}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {groupedItems && (
              <OrderSummary
                groupedItems={groupedItems}
                restaurants={restaurants}
                totalPrice={totalPrice}
              />
            )}

            <PaymentMethodSelection
              availableMethods={availablePaymentMethods}
              paymentSettings={paymentSettings}
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />

            {availablePaymentMethods.length > 0 &&
              paymentSettings?.active && (
                <>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                    {paymentMethod === 'qris' &&
                      paymentSettings?.qris_active && (
                        <PaymentDetailsQRIS
                          paymentSettings={paymentSettings}
                        />
                      )}
                    {paymentMethod === 'transfer' &&
                      paymentSettings?.bank_active && (
                        <PaymentDetailsTransfer
                          paymentSettings={paymentSettings}
                          totalPrice={totalPrice}
                          copiedText={copiedText}
                          onCopy={copyToClipboard}
                        />
                      )}
                  </div>

                  <UploadProof
                    proofImagePreview={proofImagePreview}
                    confirmationNotes={confirmationNotes}
                    onImageChange={handleImageChange}
                    onResetImage={resetProofImage}
                    onNotesChange={setConfirmationNotes}
                  />
                </>
              )}
          </div>

          <div className="space-y-6">
            <CheckoutSidebar order={order} />
            <ActionButtons
              isSubmitting={isSubmitting}
              isCancelling={isCancelling}
              isPaymentActive={paymentSettings?.active || false}
              hasProofImage={!!proofImagePreview}
              onSubmit={handleSubmitConfirmation}
              onBack={() => router.push('/')}
              onCancel={() => setShowCancelDialog(true)}
            />
          </div>
        </div>
      </div>

      <SuccessDialog
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        orderCode={order.order_code}
        onConfirm={() => router.push('/order')}
      />

      <CancelDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        orderCode={order.order_code}
        isCancelling={isCancelling}
        onConfirm={handleCancelOrder}
      />
    </div>
  );
}
