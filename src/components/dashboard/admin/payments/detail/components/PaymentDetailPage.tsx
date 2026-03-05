'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { usePaymentDetail } from '../hooks/usePaymentDetail';
import { PaymentLoading } from './PaymentLoading';
import { PaymentError } from './PaymentError';
import { PaymentHeader } from './PaymentHeader';
import { PaymentStatusCard } from './PaymentStatusCard';
import { OrderItemsList } from './OrderItemsList';
import { ProofImage } from './ProofImage';
import { OrderSummaryCard } from './OrderSummaryCard';
import { CustomerInfoCard } from './CustomerInfoCard';
import { NotesCard } from './NotesCard';

interface PaymentDetailPageProps {
  paymentId: string;
}

export const PaymentDetailPage: React.FC<PaymentDetailPageProps> = ({
  paymentId
}) => {
  const {
    isAuthChecking,
    isLoading,
    payment,
    isEditing,
    editStatus,
    isSaving,
    isRefreshing,
    error,
    setIsEditing,
    setEditStatus,
    updatePaymentStatus,
    handleRefresh,
    router
  } = usePaymentDetail(paymentId);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  if (isAuthChecking || isLoading) {
    return <PaymentLoading />;
  }

  if (!payment) {
    return (
      <PaymentError error={error} onBack={() => router.back()} />
    );
  }

  const order = payment.order;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PaymentHeader
        transactionId={payment.transaction_id}
        onBack={() => router.back()}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-4 lg:col-span-2">
            <PaymentStatusCard
              payment={payment}
              isEditing={isEditing}
              editStatus={editStatus}
              isSaving={isSaving}
              onEdit={() => setIsEditing(true)}
              onStatusChange={setEditStatus}
              onSave={updatePaymentStatus}
              onCancel={() => {
                setIsEditing(false);
                setEditStatus(payment.payment_status);
              }}
            />

            <OrderItemsList items={order.items} />

            {payment.proof_image && (
              <ProofImage
                imageUrl={payment.proof_image}
                apiUrl={apiUrl}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <OrderSummaryCard order={order} />
            <CustomerInfoCard user={order.user} />
            <NotesCard
              paymentNotes={payment.notes}
              orderNotes={order.notes}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
