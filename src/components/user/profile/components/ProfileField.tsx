'use client';

import { ReactNode } from 'react';

interface ProfileFieldProps {
  label: string;
  value?: string | ReactNode;
  icon?: ReactNode;
  isEditing?: boolean;
  name?: string;
  inputValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  children?: ReactNode;
}

export const ProfileField = ({
  label,
  value,
  icon,
  isEditing = false,
  name,
  inputValue,
  placeholder,
  disabled = false,
  error,
  onChange,
  type = 'text',
  children
}: ProfileFieldProps) => {
  return (
    <div className="space-y-1.5">
      {/* Label - konsisten dengan style yang sama */}
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </label>

      {isEditing ? (
        <>
          <div className="relative">
            {/* Icon selalu di posisi yang sama */}
            {icon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-400 dark:text-gray-500">
                  {icon}
                </span>
              </div>
            )}

            {children ? (
              // Jika ada children (custom input), render langsung tanpa padding tambahan
              <div className="w-full">{children}</div>
            ) : (
              // Input biasa dengan padding konsisten
              <input
                type={type}
                name={name}
                value={inputValue}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`
                  w-full rounded-lg border bg-white py-2.5 text-sm
                  text-gray-900 placeholder-gray-500
                  focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  disabled:cursor-not-allowed disabled:opacity-50
                  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                  ${icon ? 'pl-10' : 'px-3'}
                  ${
                    error && error.length > 0
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }
                `}
              />
            )}
          </div>

          {/* Error message dengan jarak yang pas */}
          {error && error.length > 0 && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {error[0]}
            </p>
          )}
        </>
      ) : (
        // Mode view - konsisten dengan py-2.5
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-700/50">
          {icon && (
            <div className="text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          <div className="text-sm text-gray-900 dark:text-white">
            {value}
          </div>
        </div>
      )}
    </div>
  );
};
