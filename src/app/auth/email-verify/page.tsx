import { Suspense } from 'react';
import {
  EmailVerifyPage,
  LoadingState
} from '@/components/auth/email-verify';

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EmailVerifyPage />
    </Suspense>
  );
}
