export interface VerifyParams {
  success: string | null;
  message: string | null;
}

export interface VerifyState {
  isLoading: boolean;
  isSuccess: boolean;
  message: string;
}

export type VerifyStatus = 'loading' | 'success' | 'error';