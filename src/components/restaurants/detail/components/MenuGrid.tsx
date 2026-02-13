'use client';

import { MenuCard } from './MenuCard';
import { MenuDialog } from './MenuDialog';
import type { Menu } from '../types';

interface MenuGridProps {
  menuList: Menu[];
  isLoggedIn: boolean;
  apiUrl: string;
  dialogOpen: { [key: string]: boolean };
  selectedQuantity: { [key: string]: number };
  notes: { [key: string]: string };
  isAddingToCart: boolean;
  onToggleDialog: (menuId: number) => void;
  onQuantityChange: (menuId: number, quantity: number) => void;
  onNotesChange: (menuId: number, notes: string) => void;
  onAddToCart: (menu: Menu) => void;
  onLoginRedirect: () => void;
}

export const MenuGrid = ({
  menuList,
  isLoggedIn,
  apiUrl,
  dialogOpen,
  selectedQuantity,
  notes,
  isAddingToCart,
  onToggleDialog,
  onQuantityChange,
  onNotesChange,
  onAddToCart,
  onLoginRedirect
}: MenuGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {menuList.map((menu) => (
        <div key={menu.id}>
          <MenuCard
            menu={menu}
            isLoggedIn={isLoggedIn}
            apiUrl={apiUrl}
            onToggleDialog={onToggleDialog}
            onLoginRedirect={onLoginRedirect}
          />

          {isLoggedIn && (
            <MenuDialog
              menu={menu}
              open={dialogOpen[String(menu.id)] || false}
              onOpenChange={() => onToggleDialog(menu.id)}
              quantity={selectedQuantity[String(menu.id)] || 1}
              notes={notes[String(menu.id)] || ''}
              isAddingToCart={isAddingToCart}
              apiUrl={apiUrl}
              onQuantityChange={onQuantityChange}
              onNotesChange={onNotesChange}
              onAddToCart={onAddToCart}
            />
          )}
        </div>
      ))}
    </div>
  );
};
