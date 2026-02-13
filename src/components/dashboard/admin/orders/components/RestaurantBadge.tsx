'use client';

import {
  Store,
  MapPin,
  Building,
  Layers,
  ChefHat
} from 'lucide-react';
import { Order } from '../types';
import {
  getOrderAreas,
  getOrderRestaurants
} from '../utils/orderUtils';

interface RestaurantAreaBadgeProps {
  order: Order;
}

export const RestaurantAreaBadge = ({
  order
}: RestaurantAreaBadgeProps) => {
  const areas = getOrderAreas(order);
  const restaurants = getOrderRestaurants(order);

  if (areas.length === 0 && restaurants.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Store className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Tidak ada data
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20">
          <Store className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {restaurants.length} Restoran
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {areas.length} Area
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {order.items?.length || 0} pesanan
          </p>
        </div>
      </div>

      {areas.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Area:
            </span>
          </div>
          <div className="flex flex-wrap gap-1 pl-4">
            {areas.slice(0, 2).map((area) => (
              <span
                key={area.id}
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:from-emerald-900/20 dark:to-emerald-800/20 dark:text-emerald-300"
              >
                <Building className="h-2.5 w-2.5" />
                <span className="max-w-[80px] truncate">
                  {area.name}
                </span>
              </span>
            ))}
            {areas.length > 2 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                <Layers className="h-2.5 w-2.5" />+{areas.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {restaurants.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <ChefHat className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Restoran:
            </span>
          </div>
          <div className="flex flex-wrap gap-1 pl-4">
            {restaurants.slice(0, 2).map((restaurant) => (
              <span
                key={restaurant.id}
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300"
              >
                <Store className="h-2.5 w-2.5" />
                <span className="max-w-[100px] truncate">
                  {restaurant.name}
                </span>
              </span>
            ))}
            {restaurants.length > 2 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                <Layers className="h-2.5 w-2.5" />+
                {restaurants.length - 2}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
