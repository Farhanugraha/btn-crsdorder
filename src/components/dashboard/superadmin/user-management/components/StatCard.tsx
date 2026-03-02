import type { StatCardProps } from '../types';

const StatCard = ({
  label,
  count,
  Icon,
  iconBg,
  iconRing,
  iconColor,
  barFrom,
  barTo
}: StatCardProps) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/80">
    <div
      className={`h-0.5 w-full bg-gradient-to-r ${barFrom} ${barTo}`}
    />
    <div className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {label}
          </p>
          <p className="mt-1.5 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
            {count}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-110 ${iconBg} ${iconRing}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  </div>
);

interface StatCardsProps {
  totalUsers: number;
  superadminCount: number;
  adminCount: number;
  userCount: number;
}

export const StatCards = ({
  totalUsers,
  superadminCount,
  adminCount,
  userCount
}: StatCardsProps) => {
  const stats: StatCardProps[] = [
    {
      label: 'Total Pengguna',
      count: totalUsers,
      Icon: (props) => <Users {...props} />,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-50 dark:bg-blue-900/40',
      iconRing: 'ring-blue-100 dark:ring-blue-800/50',
      iconColor: 'text-blue-600 dark:text-blue-400',
      barFrom: 'from-blue-500',
      barTo: 'to-blue-400'
    },
    {
      label: 'Super Admin',
      count: superadminCount,
      Icon: (props) => <Shield {...props} />,
      gradient: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/40',
      iconRing: 'ring-indigo-100 dark:ring-indigo-800/50',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      barFrom: 'from-indigo-500',
      barTo: 'to-indigo-400'
    },
    {
      label: 'Admin',
      count: adminCount,
      Icon: (props) => <UserCheck {...props} />,
      gradient: 'from-sky-500 to-sky-600',
      iconBg: 'bg-sky-50 dark:bg-sky-900/40',
      iconRing: 'ring-sky-100 dark:ring-sky-800/50',
      iconColor: 'text-sky-600 dark:text-sky-400',
      barFrom: 'from-sky-500',
      barTo: 'to-sky-400'
    },
    {
      label: 'Pengguna',
      count: userCount,
      Icon: (props) => <User {...props} />,
      gradient: 'from-slate-400 to-slate-500',
      iconBg: 'bg-slate-100 dark:bg-slate-700/60',
      iconRing: 'ring-slate-200 dark:ring-slate-600/50',
      iconColor: 'text-slate-600 dark:text-slate-300',
      barFrom: 'from-slate-400',
      barTo: 'to-slate-300'
    }
  ];

  return (
    <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};

// Import icons
import { Users, Shield, UserCheck, User } from 'lucide-react';
