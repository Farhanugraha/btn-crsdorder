export interface ExtendedMenu {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  available?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  images: {
    id: string;
    url: string;
  }[];
}