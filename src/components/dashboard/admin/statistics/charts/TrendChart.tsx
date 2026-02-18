'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Info } from 'lucide-react';
import { LINE_CHART_CONFIG } from '../utils/constants';

interface TrendChartProps {
  data: Array<{ date: string; orders: number; revenue: number }>;
  formatters: {
    currency: (value: number) => string;
    number: (value: number) => string;
  };
}

export const TrendChart = ({ data, formatters }: TrendChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Tidak ada data grafik tersedia
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-white p-3 shadow-lg dark:bg-gray-800">
          <p className="mb-2 font-medium text-gray-900 dark:text-white">
            Tanggal: {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}:{' '}
              {entry.name === 'Pendapatan'
                ? formatters.currency(entry.value)
                : formatters.number(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={LINE_CHART_CONFIG.margin}>
        <CartesianGrid
          strokeDasharray={LINE_CHART_CONFIG.strokeDasharray}
          stroke={LINE_CHART_CONFIG.strokeColor}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickFormatter={formatters.number}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={data.length <= 30}
          name="Pesanan"
          isAnimationActive={true}
          animationDuration={500}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2}
          dot={data.length <= 30}
          name="Pendapatan"
          isAnimationActive={true}
          animationDuration={500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
