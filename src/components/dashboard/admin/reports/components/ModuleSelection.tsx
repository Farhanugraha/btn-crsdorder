'use client';

import { useState } from 'react';
import {
  CheckCircle,
  ChevronRight,
  AlertCircle,
  Building2,
  Globe
} from 'lucide-react';
import {
  getModuleDisplayName,
  getModuleDescription,
  getModuleColor
} from '../utils/moduleHelpers';

interface ModuleSelectionProps {
  availableModules: string[];
  selectedModule: string;
  error: string | null;
  isLoading: boolean;
  onModuleSelect: (module: string) => void;
}

export const ModuleSelection = ({
  availableModules,
  selectedModule,
  error,
  isLoading,
  onModuleSelect
}: ModuleSelectionProps) => {
  const [hoveredModule, setHoveredModule] = useState<string | null>(
    null
  );

  // Filter valid modules
  const validModules = availableModules.filter(
    (m) => m === 'crsd1' || m === 'crsd2'
  );

  // Add 'general' if multiple modules
  const displayModules =
    validModules.length > 1
      ? ['general', ...validModules]
      : validModules;

  // Empty state
  if (displayModules.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Tidak Ada Modul Tersedia
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Anda tidak memiliki akses ke modul manapun.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-block rounded-2xl bg-white/80 px-6 py-3 shadow-lg backdrop-blur-md dark:bg-gray-800/80">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              ✨ Pilih Dashboard
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Selamat Datang,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Administrator
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Anda memiliki akses ke beberapa divisi. Silakan pilih
            dashboard yang ingin Anda kelola.
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayModules.map((module) => {
            const colors = getModuleColor(module);
            const isSelected = selectedModule === module;
            const isHovered = hoveredModule === module;

            return (
              <div
                key={module}
                className={`group relative overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-lg transition-all duration-300 dark:bg-gray-800 ${
                  isSelected
                    ? `${colors.border} scale-[1.02] shadow-xl`
                    : 'border-gray-200 shadow-md hover:scale-[1.02] hover:shadow-xl dark:border-gray-700'
                } ${
                  isLoading
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }`}
                onClick={() => !isLoading && onModuleSelect(module)}
                onMouseEnter={() => setHoveredModule(module)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                {/* Selected badge */}
                {isSelected && (
                  <div className="absolute -right-6 -top-6 h-16 w-16 rotate-12 bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                    <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-white" />
                  </div>
                )}

                {/* Background hover effect */}
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 ${
                    isHovered ? 'opacity-10' : ''
                  } ${colors.bg}`}
                />

                {/* Icon */}
                <div
                  className={`relative mb-6 inline-flex rounded-xl p-3 ${colors.bg}`}
                >
                  {module === 'crsd1' && (
                    <Building2 className="h-7 w-7 text-white" />
                  )}
                  {module === 'crsd2' && (
                    <Building2 className="h-7 w-7 text-white" />
                  )}
                  {module === 'general' && (
                    <Globe className="h-7 w-7 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getModuleDisplayName(module)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {getModuleDescription(module)}
                    </p>
                  </div>

                  {/* Quick info */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {module === 'general'
                        ? 'Semua Divisi'
                        : module === 'crsd1'
                          ? 'Divisi CRSD 1'
                          : 'Divisi CRSD 2'}
                    </span>
                  </div>

                  {/* Action button */}
                  <button
                    className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isSelected
                        ? `bg-gradient-to-r ${colors.bg} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onModuleSelect(module);
                    }}
                  >
                    {isSelected ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Dashboard Aktif
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                            Memuat...
                          </>
                        ) : (
                          <>
                            Pilih Dashboard
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <div className="animate-fade-in mt-8 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Pilih salah satu dashboard untuk mulai mengelola laporan
          </p>
        </div>
      </div>
    </div>
  );
};
