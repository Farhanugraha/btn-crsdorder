'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { PIE_CHART_CONFIG } from '../utils/constants';
import type { PieChartData } from '../types';
import type { FormattersType } from '../hooks/useStatistics';

interface StatusPieChartProps {
  data: PieChartData;
  formatters: FormattersType;
}

export const StatusPieChart = ({
  data,
  formatters
}: StatusPieChartProps) => {
  if (data.rechartsData.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Tidak ada data status tersedia
        </p>
      </div>
    );
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data.rechartsData}
            cx="50%"
            cy="50%"
            innerRadius={PIE_CHART_CONFIG.innerRadius}
            outerRadius={PIE_CHART_CONFIG.outerRadius}
            paddingAngle={PIE_CHART_CONFIG.paddingAngle}
            dataKey="value"
            label={(entry) =>
              `${entry.name}: ${formatters.number(entry.value)}`
            }
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={PIE_CHART_CONFIG.animationDuration}
          >
            {data.rechartsData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || data.colors[index]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: unknown) => [
              formatters.number(Number(value) || 0),
              'Jumlah'
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {data.data.map((item, index) => (
          <div key={item.name} className="text-center">
            <div className="inline-flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: data.colors[index] }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <p
              className="mt-1 text-xl font-bold"
              style={{ color: data.colors[index] }}
            >
              {formatters.number(item.value)}
            </p>
            <p className="text-xs text-gray-500">
              {item.percentage.toFixed(1)}% dari total
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
