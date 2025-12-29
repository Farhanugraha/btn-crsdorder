import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'IDR';
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
) {
  const { currency = 'IDR', notation = 'compact' } = options;

  const numericPrice =
    typeof price === 'string' ? parseFloat(price) : price;

  let locales = '';

  switch (currency) {
    case 'USD':
      locales = 'en-US';
      break;
    case 'EUR':
      locales = 'de-DE';
      break;
    case 'IDR':
      locales = 'id-ID';
      break;
    default:
      locales = 'id-ID';
      break;
  }

  return new Intl.NumberFormat(locales, {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2
  }).format(numericPrice);
}
