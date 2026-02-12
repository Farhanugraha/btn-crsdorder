export interface Area {
  id: number;
  name: string;
  icon: string;
  description: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  photo?: string;
  is_open: boolean;
  menus_count: number;
}

export type FilterStatus = 'all' | 'open' | 'closed';