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
    <div className="space-y-6">
      {/* Orders Section */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Ringkasan Pesanan
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Ringkasan Pembayaran
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Ringkasan Pengguna
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
