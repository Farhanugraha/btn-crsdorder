import React from 'react';
import {
  Users,
  Shield,
  UserCheck,
  User as UserIcon,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { User } from '../types';

interface UserStatsProps {
  users: User[];
  totalUsers: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend
}) => (
  <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-current"
        style={{ color }}
      ></div>
    </div>

    <div className="relative">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          {trend >= 0 ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={`text-sm font-medium ${
              trend >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {Math.abs(trend)}% dari bulan lalu
          </span>
        </div>
      )}
    </div>
  </div>
);

export const UserStats: React.FC<UserStatsProps> = ({
  users,
  totalUsers
}) => {
  const stats = [
    {
      title: 'Total User',
      value: totalUsers,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      trend: 12
    },
    {
      title: 'Super Admin',
      value: users.filter((u) => u.role === 'superadmin').length,
      icon: Shield,
      color: 'from-purple-600 to-pink-600',
      trend: 5
    },
    {
      title: 'Admin',
      value: users.filter((u) => u.role === 'admin').length,
      icon: UserCheck,
      color: 'from-amber-500 to-orange-600',
      trend: -2
    },
    {
      title: 'User',
      value: users.filter((u) => u.role === 'user').length,
      icon: UserIcon,
      color: 'from-emerald-500 to-teal-600',
      trend: 8
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
