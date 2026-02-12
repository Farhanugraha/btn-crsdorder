import {
  Building2,
  Target,
  Utensils,
  Navigation,
  Store,
  Home
} from 'lucide-react';
import type { Area } from '../types';

export const getAreaIcon = (icon: string, areaName: string) => {
  const iconMap: Record<string, JSX.Element> = {
    '🏢': (
      <Building2 className="h-12 w-12 text-slate-700 dark:text-slate-300" />
    ),
    '🎯': (
      <Target className="h-12 w-12 text-slate-700 dark:text-slate-300" />
    )
  };

  if (iconMap[icon]) {
    return iconMap[icon];
  }

  if (areaName.toLowerCase().includes('kantin')) {
    return (
      <Utensils className="h-12 w-12 text-slate-700 dark:text-slate-300" />
    );
  }
  if (areaName.toLowerCase().includes('csd')) {
    return (
      <Building2 className="h-12 w-12 text-slate-700 dark:text-slate-300" />
    );
  }
  if (areaName.toLowerCase().includes('riverside')) {
    return (
      <Navigation className="h-12 w-12 text-slate-700 dark:text-slate-300" />
    );
  }
  if (areaName.toLowerCase().includes('yanmar')) {
    return (
      <Store className="h-12 w-12 text-slate-700 dark:text-slate-300" />
    );
  }

  return (
    <Home className="h-12 w-12 text-slate-700 dark:text-slate-300" />
  );
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12
    }
  }
};
