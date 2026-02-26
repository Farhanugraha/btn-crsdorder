export interface Area {
  id: number;
  name: string;
  description: string;
  icon: string;
  order: number;
  slug: string;
  created_at: string;
}

export interface FormData {
  name: string;
  description: string;
  icon: string;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
}

export const EMOJI_PRESETS = [
  '🏢', '🍽️', '☕', '🍔', '🥗', '🍜', '🎂', '🥤',
  '🎪', '🛒', '🎮', '🎯', '🎨', '🎭', '🎼', '🏖️'
];

export type ViewMode = 'grid' | 'list';