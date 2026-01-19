interface StatBoxProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export const StatBox = ({
  title,
  value,
  icon,
  color
}: StatBoxProps) => (
  <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
      <div className={`rounded-lg ${color} flex-shrink-0 p-2.5`}>
        {icon}
      </div>
    </div>
  </div>
);
