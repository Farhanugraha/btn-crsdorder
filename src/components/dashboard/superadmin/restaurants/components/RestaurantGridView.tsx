'use client';

import { RestaurantCard } from './RestaurantCard';
import type { Restaurant } from '../types';

interface RestaurantGridViewProps {
  restaurants: Restaurant[];
  togglingId: number | null;
  onEdit: (restaurant: Restaurant) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

export const RestaurantGridView = ({
  restaurants,
  togglingId,
  onEdit,
  onToggleStatus,
  onDelete
}: RestaurantGridViewProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          isToggling={togglingId === restaurant.id}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
