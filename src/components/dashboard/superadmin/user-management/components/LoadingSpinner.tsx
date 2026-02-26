import React from 'react';
import { Loader2, User } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Memuat data...',
  fullScreen = false
}) => {
  const content = (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <User className="h-8 w-8 animate-pulse text-blue-600" />
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-800">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};
