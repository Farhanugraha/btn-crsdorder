'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

export const FloatingActionButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link
          href="/areas"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 transition-shadow hover:shadow-amber-500/50"
          aria-label="Pesan Sekarang"
        >
          <Utensils className="h-6 w-6 text-white" />
        </Link>
      </motion.div>
    </motion.div>
  );
};
