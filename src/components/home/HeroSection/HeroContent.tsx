'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations';

export const HeroContent = () => {
  return (
    <motion.div
      className="flex flex-col justify-center md:w-1/2"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeInUp}>
        <div className="mb-2 inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1.5">
          <span className="flex items-center gap-1 text-sm font-medium text-white">
            <Sparkles className="h-3 w-3" />
            Solusi BTNERS
          </span>
        </div>
      </motion.div>

      <motion.h1
        className="mb-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl"
        variants={fadeInUp}
      >
        <span className="block">
          Hallo{' '}
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
            BTN
          </span>
          <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent dark:from-red-400 dark:to-red-300">
            ERS
          </span>
          <motion.span
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="ml-3 inline-block"
          >
            👋
          </motion.span>
        </span>
        <motion.span
          className="mt-4 block text-xl font-semibold text-gray-700 dark:text-gray-300 md:text-3xl lg:text-4xl"
          variants={fadeInUp}
        >
          Orderan Bang Ahmad - Solusi Makan Siang
        </motion.span>
      </motion.h1>

      <motion.p
        className="py-6 leading-relaxed text-gray-600 dark:text-gray-400 md:py-8 md:text-lg"
        variants={fadeInUp}
      >
        Nikmati pengalaman pemesanan makanan yang praktis dan efisien.
        Tanpa keluar kantor atau antre panjang, berbagai pilihan menu
        siap menemani produktivitas Anda sepanjang hari.
      </motion.p>

      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center"
        variants={fadeInUp}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/areas"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'group flex items-center gap-2 px-8 py-6 text-base font-semibold'
            )}
          >
            <span>Pesan Sekarang</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'group flex items-center gap-2 px-8 py-6 text-base'
            )}
          >
            <span>Pelajari Lebih</span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
