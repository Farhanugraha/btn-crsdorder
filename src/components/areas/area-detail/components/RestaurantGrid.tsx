'use client';

import { RestaurantCard } from './RestaurantCard';
import type { Restaurant } from '../types';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  apiUrl: string;
}

export const RestaurantGrid = ({
  restaurants,
  apiUrl
}: RestaurantGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          apiUrl={apiUrl}
        />
      ))}
    </div>
  );
};
