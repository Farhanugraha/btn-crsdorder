'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { VerifyState, VerifyParams } from '../types';
import { VERIFY_MESSAGES } from '../constants';

export const useEmailVerify = () => {
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerifyState>({
    isLoading: true,
    isSuccess: false,
    message: ''
  });

  useEffect(() => {
    const successParam = searchParams.get('success');
    const messageParam = searchParams.get('message');

    if (successParam === 'true') {
      setState({
        isLoading: false,
        isSuccess: true,
        message: VERIFY_MESSAGES.SUCCESS_MESSAGE
      });
    } else if (successParam === 'false') {
      setState({
        isLoading: false,
        isSuccess: false,
        message: messageParam || VERIFY_MESSAGES.ERROR_DEFAULT
      });
    } else {
      setState({
        isLoading: false,
        isSuccess: false,
        message: VERIFY_MESSAGES.ERROR_UNVERIFIED
      });
    }
  }, [searchParams]);

  const params: VerifyParams = {
    success: searchParams.get('success'),
    message: searchParams.get('message')
  };

  return {
    ...state,
    params
  };
};