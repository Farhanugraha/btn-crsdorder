'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { fixedPositions } from '../animations';

export const CTASection = () => {
  return (
    <section className="relative mt-20 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-16 text-center md:py-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {fixedPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            style={{ left: pos.left, top: pos.top }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
          Siap Mengubah Waktu Makan Menjadi Lebih Produktif?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100">
          Bergabunglah dengan BTNERS yang sudah merasakan kemudahan
          OBAMA
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/areas"
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'group inline-flex items-center gap-3 px-10 py-6 text-lg font-semibold shadow-lg'
            )}
          >
            <span>Mulai Pemesanan Sekarang</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};
