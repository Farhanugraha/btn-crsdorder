export const getImageUrl = (image: string | null | undefined, apiUrl: string): string => {
  if (!image) return '/foodimages.png';
  
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  
  return `${apiUrl}/storage/uploads/${image}`;
};

export const formatCurrency = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(numPrice);
};

export const calculateTotalPrice = (price: string, quantity: number): string => {
  const numPrice = parseFloat(price);
  return (numPrice * quantity).toLocaleString('id-ID');
};