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
  <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-4 md:p-5">
    <div className="flex items-start justify-between gap-2 sm:gap-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <p className="mt-2 break-words text-lg font-bold text-slate-900 dark:text-white sm:text-xl md:text-2xl">
          {value}
        </p>
      </div>
      <div
        className={`rounded-lg ${color} flex-shrink-0 p-2 sm:p-2.5 md:p-3`}
      >
        {icon}
      </div>
    </div>
  </div>
);
