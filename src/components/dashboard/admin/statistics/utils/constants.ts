export const FILTER_OPTIONS = [
  { key: 'hari-ini' as const, label: 'Hari Ini' },
  { key: 'minggu-ini' as const, label: 'Minggu Ini' },
  { key: 'bulan-ini' as const, label: 'Bulan Ini' },
  { key: 'kustom' as const, label: 'Kustom' }
];

export const STATUS_COLORS = {
  completed: '#10b981',
  processing: '#f59e0b',
  canceled: '#ef4444'
};

export const CHART_COLORS = {
  orders: '#3b82f6',
  revenue: '#10b981'
};

export const PIE_CHART_CONFIG = {
  innerRadius: 60,
  outerRadius: 90,
  paddingAngle: 2,
  animationDuration: 500
};

export const LINE_CHART_CONFIG = {
  margin: { top: 5, right: 30, left: 20, bottom: 5 },
  strokeDasharray: '3 3',
  strokeColor: '#e2e8f0'
};