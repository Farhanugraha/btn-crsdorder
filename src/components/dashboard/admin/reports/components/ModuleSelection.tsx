'use client';

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
  onClose: () => void;
}

export const ModuleSelection = ({
  availableModules,
  selectedModule,
  error,
  isLoading,
  onModuleSelect,
  onClose
}: ModuleSelectionProps) => {
  // Filter hanya module yang valid
  const validModules = availableModules.filter(
    (m) => m === 'crsd1' || m === 'crsd2'
  );

  // Tambahkan 'general' jika ada lebih dari satu module
  const displayModules =
    validModules.length > 1
      ? ['general', ...validModules]
      : validModules;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-20 blur-3xl dark:from-blue-900/20 dark:to-purple-900/20"></div>
        <div className="absolute -right-4 bottom-1/4 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 opacity-20 blur-3xl dark:from-emerald-900/20 dark:to-blue-900/20"></div>
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="w-full max-w-4xl">
            {/* Header Section */}
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-white/80 px-6 py-3 backdrop-blur-sm dark:bg-gray-800/80">
                <div className="text-left">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Pilih Modul Dashboard
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Anda memiliki akses ke beberapa divisi
                  </p>
                </div>
              </div>

              <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
                Pilih Mode Tampilan
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                Pilih tampilan dashboard yang sesuai dengan kebutuhan
                Anda:
              </p>
            </div>

            {/* Module Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayModules.map((module) => {
                const colors = getModuleColor(module);
                const isSelected = selectedModule === module;

                return (
                  <div
                    key={module}
                    className={`group relative overflow-hidden rounded-2xl border-2 bg-white p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:bg-gray-800 ${
                      isSelected
                        ? `${colors.border} border-2 shadow-xl`
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                    onClick={() => onModuleSelect(module)}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute -right-6 -top-6 h-12 w-12 rounded-bl-full bg-gradient-to-br from-blue-500 to-purple-500">
                        <CheckCircle className="absolute right-2 top-2 h-4 w-4 text-white" />
                      </div>
                    )}

                    {/* Icon badge */}
                    <div
                      className={`mb-6 inline-flex rounded-xl p-3 ${colors.bg}`}
                    >
                      {module === 'crsd1' && (
                        <Building2 className="h-6 w-6 text-white" />
                      )}
                      {module === 'crsd2' && (
                        <Building2 className="h-6 w-6 text-white" />
                      )}
                      {module === 'general' && (
                        <Globe className="h-6 w-6 text-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {getModuleDisplayName(module)}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {getModuleDescription(module)}
                        </p>
                      </div>

                      {/* CTA */}
                      <button
                        className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                        disabled={isLoading}
                      >
                        {isSelected ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Dipilih
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Pilih Dashboard
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Hover effect */}
                    <div
                      className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5 ${colors.bg.replace(
                        'bg-gradient-to-br',
                        ''
                      )}`}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* Error Display */}
            {error && (
              <div className="animate-fade-in mt-6 rounded-xl border border-red-200 bg-red-50/50 p-4 backdrop-blur-sm dark:border-red-800/30 dark:bg-red-900/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-300">
                      Terjadi Kesalahan
                    </p>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Back button */}
            <div className="mt-8 text-center">
              <button
                onClick={onClose}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← Kembali ke dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
