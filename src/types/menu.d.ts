import { Menu } from '@prisma/client';

export interface ExtendedMenu extends Menu {
  images: {
    id: string;
    url: string;
  }[];
}
