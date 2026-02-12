'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  apiUrl: string;
}

export const RestaurantCard = ({
  restaurant,
  apiUrl
}: RestaurantCardProps) => {
  const isOpen = restaurant.is_open;

  const getImageSrc = () => {
    if (restaurant.photo) {
      return `${apiUrl}/storage/${restaurant.photo}`;
    }
    return '/restaurant.png';
  };

  return (
    <Link
      href={isOpen ? `/restaurants/${restaurant.id}` : '#'}
      onClick={(e) => !isOpen && e.preventDefault()}
      className="block"
    >
      <div
        className={`group flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-300 ${
          !isOpen
            ? 'border-slate-200 bg-white opacity-50 dark:border-slate-800 dark:bg-slate-900'
            : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-900/20'
        } ${!isOpen ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {/* Image Container */}
        <div className="relative h-40 flex-shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={getImageSrc()}
            alt={restaurant.name}
            className={`h-full w-full object-cover transition-transform duration-500 ${
              isOpen ? 'group-hover:scale-105' : ''
            }`}
            onError={(e) => {
              e.currentTarget.src = '/restaurant.png';
            }}
          />

          {/* Status Badge */}
          <div className="absolute right-2.5 top-2.5">
            {isOpen ? (
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                Buka
              </div>
            ) : (
              <div className="rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm">
                Tutup
              </div>
            )}
          </div>

          {/* Menu Count */}
          {restaurant.menus_count > 0 && (
            <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold text-slate-900 shadow-md backdrop-blur-sm dark:bg-slate-800/95 dark:text-white">
              {restaurant.menus_count} Menu
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
            {restaurant.name}
          </h3>
          <p className="mb-3 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
            {restaurant.description}
          </p>

          {/* Address */}
          <div className="mb-3 flex flex-1 items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>

          {/* Button */}
          <Button
            disabled={!isOpen}
            className={`h-9 w-full rounded-lg text-xs font-semibold transition-all ${
              isOpen
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            }`}
          >
            {isOpen ? 'Lihat Menu' : 'Tutup'}
          </Button>
        </div>
      </div>
    </Link>
  );
};
