import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

interface CustomerInfoCardProps {
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  user
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 dark:border-gray-700 dark:from-slate-800 dark:to-slate-900">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          <User className="h-5 w-5" />
          Pelanggan
        </h2>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Nama
          </p>
          <p className="mt-1 truncate font-semibold text-gray-900 dark:text-gray-100">
            {user.name}
          </p>
        </div>

        <div>
          <p className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
            <Mail className="h-3.5 w-3.5" />
            Email
          </p>
          <p className="mt-1 truncate text-sm text-gray-900 dark:text-gray-100">
            {user.email}
          </p>
        </div>

        <div>
          <p className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
            <Phone className="h-3.5 w-3.5" />
            Telepon
          </p>
          <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
            {user.phone}
          </p>
        </div>
      </div>
    </div>
  );
};
