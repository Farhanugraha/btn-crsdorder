'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AreaCard } from './AreaCard';
import { containerVariants } from '../utils/areaUtils';
import type { Area } from '../types';

interface AreasGridProps {
  areas: Area[];
}

export const AreasGrid = ({ areas }: AreasGridProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {areas.map((area) => (
          <AreaCard key={area.id} area={area} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
