'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import aboutPic from '@public/aboutus.png';

export const AboutHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative w-full"
    >
      {/* Background Blur Effect */}
      <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl" />

      {/* Image Container - Menggunakan aspect ratio */}
      <div className="relative aspect-[5/6] w-full overflow-hidden rounded-2xl shadow-2xl">
        <Image
          src={aboutPic}
          alt="About Fooder - Platform Pemesanan Makanan BTN"
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 90vw, 35vw"
          priority
          quality={100}
        />
      </div>

      {/* Floating Badge */}
      <motion.div
        animate={{
          y: [0, -8, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg md:-right-4 md:-top-4 md:px-4 md:py-2 md:text-sm"
      >
        🏆 Terpercaya
      </motion.div>
    </motion.div>
  );
};
