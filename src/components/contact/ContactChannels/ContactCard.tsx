'use client';

import type { ContactCardProps } from '@/types/contact';

export const ContactCard = ({
  icon,
  title,
  subtitle,
  bgColor,
  borderColor,
  hoverColor,
  children
}: ContactCardProps) => {
  return (
    <div
      className={`group rounded-xl border-2 ${borderColor} bg-white p-6 transition-all hover:border-${hoverColor} hover:shadow-xl dark:bg-gray-900`}
    >
      <div className="mb-4 flex flex-col items-center">
        <div
          className={`mb-3 rounded-full ${bgColor} p-3 transition-transform group-hover:scale-110`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-center text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>
      <div className="text-center">{children}</div>
    </div>
  );
};
