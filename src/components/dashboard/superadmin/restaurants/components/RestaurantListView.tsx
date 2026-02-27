'use client';

import { RestaurantListItem } from './RestaurantListItem';
import type { Restaurant } from '../types';

interface RestaurantListViewProps {
  restaurants: Restaurant[];
  togglingId: number | null;
  onEdit: (restaurant: Restaurant) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

export const RestaurantListView = ({
  restaurants,
  togglingId,
  onEdit,
  onToggleStatus,
  onDelete
}: RestaurantListViewProps) => {
  return (
    <div className="space-y-4">
      {restaurants.map((restaurant) => (
        <RestaurantListItem
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
