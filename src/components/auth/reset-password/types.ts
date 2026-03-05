export interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

export interface ResetPasswordParams {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface UrlParams {
  email: string | null;
  token: string | null;
}