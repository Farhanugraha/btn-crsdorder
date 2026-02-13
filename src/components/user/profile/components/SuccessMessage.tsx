'use client';

interface SuccessMessageProps {
  message: string;
}

export const SuccessMessage = ({ message }: SuccessMessageProps) => {
  if (!message) return null;

  return (
    <div className="animate-fade-in mb-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
        <p className="text-xs font-medium text-green-700 dark:text-green-300">
          {message}
        </p>
      </div>
    </div>
  );
};
