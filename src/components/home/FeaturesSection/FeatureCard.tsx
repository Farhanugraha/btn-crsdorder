'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '../animations';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'blue' | 'amber' | 'green';
  index: number;
}

const colorConfig = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-200/50 dark:border-blue-800/30',
    gradientBg:
      'from-white to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20'
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-200/50 dark:border-amber-800/30',
    gradientBg:
      'from-white to-amber-50/50 dark:from-gray-900/50 dark:to-amber-900/20'
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-500/10',
    border: 'border-green-200/50 dark:border-green-800/30',
    gradientBg:
      'from-white to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20'
  }
};

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
  index
}: FeatureCardProps) => {
  const config = colorConfig[color];

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`group relative overflow-hidden rounded-2xl border ${config.border} bg-gradient-to-br ${config.gradientBg} p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl`}
    >
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${config.bg} blur-xl`}
      ></div>
      <motion.div
        whileHover={{ rotate: 15 }}
        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${config.gradient}`}
      >
        <Icon className="h-8 w-8 text-white" />
      </motion.div>
      <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="leading-relaxed text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </motion.div>
  );
};
