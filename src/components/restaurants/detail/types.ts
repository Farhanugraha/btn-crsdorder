export interface Area {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Menu {
  id: number;
  restaurant_id: number;
  name: string;
  price: string;
  image: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  description?: string;
}

export interface Restaurant {
  id: number;
  area_id: number;
  name: string;
  description: string;
  address: string;
  photo?: string;
  is_open: boolean;
  menus_count: number;
  area?: Area;
  menus?: Menu[];
}

export interface CartItemPayload {
  menu_id: number;
  restaurant_id?: number;
  quantity: number;
  notes: string;
}