export const formatPrice = (price: string | number): string => {
  return new Intl.NumberFormat('id-ID').format(Number(price));
};

export const formatCurrency = (amount: string | number): string => {
  const numAmount = Number(amount);
  if (numAmount === 0) {
    return 'Rp 0';
  }

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return formatter.format(numAmount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatFullDate = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};