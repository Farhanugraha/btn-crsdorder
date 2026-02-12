export interface Area {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  restaurants_count: number;
  featured?: boolean;
}

export type SortBy = 'name' | 'restaurants';