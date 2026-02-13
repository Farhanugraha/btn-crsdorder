'use client';

import { ReactNode } from 'react';

interface ProfileFieldProps {
  label: string;
  value: string | ReactNode;
  icon?: ReactNode;
  isEditing?: boolean;
  name?: string;
  inputValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
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
  type = 'text'
}: ProfileFieldProps) => {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {isEditing ? (
        <>
          <div className="relative">
            {icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {icon}
              </div>
            )}
            <input
              type={type}
              name={name}
              value={inputValue}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full rounded-lg border border-gray-300 bg-white py-2 ${
                icon ? 'pl-10' : 'px-3'
              } pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
            />
          </div>
          {error && error.length > 0 && (
            <p className="mt-1 text-xs text-red-500">{error[0]}</p>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700/50">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="text-gray-400 dark:text-gray-500">
                {icon}
              </div>
            )}
            <p className="text-sm text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
