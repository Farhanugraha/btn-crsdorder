import { Suspense } from 'react';
import {
  PaymentDetailPage,
  PaymentLoading
} from '@/components/dashboard/admin/payments/detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentDetailPage paymentId={params.id} />
    </Suspense>
  );
}
