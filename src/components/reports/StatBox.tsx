interface StatBoxProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
  isCurrency?: boolean;
  formatCurrency?: (value: number) => string;
}

export const StatBox = ({
  title,
  value,
  icon,
  color,
  description,
  isCurrency = false,
  formatCurrency
}: StatBoxProps) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 ${color} p-4 dark:border-gray-700`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {isCurrency && formatCurrency
              ? formatCurrency(value)
              : value.toLocaleString('id-ID')}
          </p>
          {description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              {description}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-white p-2 dark:bg-gray-800">
          {icon}
        </div>
      </div>
    </div>
  );
};
