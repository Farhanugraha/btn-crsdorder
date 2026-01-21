import {
  ShoppingCart,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Users
} from 'lucide-react';
import { StatBox } from './StatBox';

interface DashboardData {
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    canceled: number;
  };
  payments: {
    total_revenue: number;
    pending_payments: number;
  };
  users: {
    total_users: number;
    total_admins: number;
  };
}

interface DashboardTabProps {
  data: DashboardData;
  formatCurrency: (value: number) => string;
}

export const DashboardTab = ({
  data,
  formatCurrency
}: DashboardTabProps) => {
  return (
    <div className="w-full space-y-4 sm:space-y-5 md:space-y-6">
      {/* Orders Section */}
      <div className="w-full">
        <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white sm:mb-4 sm:text-base md:text-lg">
          Ringkasan Pesanan
        </h2>
        <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
          <StatBox
            title="Total"
            value={data.orders.total}
            icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatBox
            title="Tertunda"
            value={data.orders.pending}
            icon={<Calendar className="h-5 w-5 text-yellow-600" />}
            color="bg-yellow-100 dark:bg-yellow-900/30"
          />
          <StatBox
            title="Diproses"
            value={data.orders.processing}
            icon={<FileText className="h-5 w-5 text-amber-600" />}
            color="bg-amber-100 dark:bg-amber-900/30"
          />
          <StatBox
            title="Selesai"
            value={data.orders.completed}
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
          />
          <StatBox
            title="Dibatalkan"
            value={data.orders.canceled}
            icon={<AlertCircle className="h-5 w-5 text-red-600" />}
            color="bg-red-100 dark:bg-red-900/30"
          />
        </div>
      </div>

      {/* Payments Section */}
      <div className="w-full">
        <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white sm:mb-4 sm:text-base md:text-lg">
          Ringkasan Pembayaran
        </h2>
        <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:gap-4">
          <StatBox
            title="Total Revenue"
            value={formatCurrency(data.payments.total_revenue)}
            icon={<TrendingUp className="h-5 w-5 text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
          />
          <StatBox
            title="Pembayaran Tertunda"
            value={data.payments.pending_payments}
            icon={<CreditCard className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
        </div>
      </div>

      {/* Users Section */}
      <div className="w-full">
        <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white sm:mb-4 sm:text-base md:text-lg">
          Ringkasan Pengguna
        </h2>
        <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:gap-4">
          <StatBox
            title="Total Pengguna"
            value={data.users.total_users}
            icon={<Users className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatBox
            title="Total Admin"
            value={data.users.total_admins}
            icon={<FileText className="h-5 w-5 text-purple-600" />}
            color="bg-purple-100 dark:bg-purple-900/30"
          />
        </div>
      </div>
    </div>
  );
};
