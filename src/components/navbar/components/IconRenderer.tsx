'use client';

import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer = ({
  name,
  className = 'h-4 w-4'
}: IconRendererProps) => {
  // Dynamically get the icon component from lucide-react
  const IconComponent = (Icons as any)[name] as
    | LucideIcon
    | undefined;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return <IconComponent className={className} />;
};
