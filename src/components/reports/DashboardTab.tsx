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
  selectedModule?: string; // Tambahkan prop ini untuk konsistensi
}

export const DashboardTab = ({
  data,
  formatCurrency,
  selectedModule
}: DashboardTabProps) => {
  return (
    <div className="w-full space-y-4 sm:space-y-5 md:space-y-6">
      {/* Module Badge */}
      {selectedModule && (
        <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2 dark:bg-blue-700">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 dark:text-white">
                Dashboard Divisi{' '}
                {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Overview statistik dan performa
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders Section */}
      <div className="w-full">
        <h2 className="mb-3 text-sm font-bold text-blue-900 dark:text-white sm:mb-4 sm:text-base md:text-lg">
          Ringkasan Pesanan{' '}
          {selectedModule &&
            `(${selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'})`}
        </h2>
        <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
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
        <h2 className="mb-3 text-sm font-bold text-blue-900 dark:text-white sm:mb-4 sm:text-base md:text-lg">
          Ringkasan Pembayaran{' '}
          {selectedModule &&
            `(${selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'})`}
        </h2>
        <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:gap-4">
          <StatBox
            title="Total Revenue"
            value={data.payments.total_revenue}
            icon={<TrendingUp className="h-5 w-5 text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
            isCurrency={true}
            formatCurrency={formatCurrency}
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
        <h2 className="mb-3 text-sm font-bold text-blue-900 dark:text-white sm:mb-4 sm:text-base md:text-lg">
          Ringkasan Pengguna{' '}
          {selectedModule &&
            `(${selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'})`}
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

      {/* Summary Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Ringkasan Dashboard
          </h3>
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.orders.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Pesanan
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(data.payments.total_revenue)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Revenue
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.users.total_users}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Pengguna
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.users.total_admins}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Admin
            </div>
          </div>
        </div>

        {selectedModule && (
          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/30">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Dashboard Divisi{' '}
                  {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Update terakhir:{' '}
                  {new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
