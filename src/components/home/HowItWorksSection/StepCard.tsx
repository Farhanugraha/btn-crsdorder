'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '../animations';

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  color: string;
}

export const StepCard = ({
  step,
  title,
  description,
  color
}: StepCardProps) => {
  const gradientColor =
    step === 1
      ? 'from-blue-500 to-blue-600'
      : step === 2
        ? 'from-purple-500 to-purple-600'
        : 'from-green-500 to-green-600';

  return (
    <motion.div
      variants={fadeInUp}
      className="relative z-10 text-center"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${gradientColor} text-3xl font-bold text-white shadow-lg`}
      >
        {step}
      </motion.div>
      <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </motion.div>
  );
};
