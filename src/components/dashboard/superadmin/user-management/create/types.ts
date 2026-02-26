export interface AuthData {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'superadmin';
  };
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string;
  unit_kerja: string;
  data_access?: string[];
}

export interface DataTypeOption {
  value: string;
  label: string;
  description: string;
}

export interface FormState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface PasswordState {
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export interface DivisionState {
  showCustomInput: boolean;
  customDivisi: string;
}

export interface DataAccessState {
  selectedDataTypes: string[];
  showDropdown: boolean;
  loadingDataTypes: boolean;
  dataTypeOptions: DataTypeOption[];
}

// Divisi options untuk dropdown
export const DIVISI_OPTIONS = [
  { value: 'CRSD 1', label: 'CRSD 1' },
  { value: 'CRSD 2', label: 'CRSD 2' },
  { value: 'Other', label: 'Lainnya...' }
];