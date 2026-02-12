'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import homePic from '@public/mainpage.png'; // ✅ Pakai alias @public
import { Coffee, Zap } from 'lucide-react';
import {
  pulseAnimation,
  floatAnimation,
  floatAnimationDelayed
} from '../animations';

export const HeroImage = () => {
  return (
    <motion.div
      className="flex items-center justify-center md:w-1/2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, delay: 0.3 }
      }}
    >
      <div className="relative">
        <motion.div
          animate={pulseAnimation}
          className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
        />
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src={homePic}
            alt="Fooder - Platform Pemesanan Makanan"
            width={500}
            height={500}
            className="h-auto w-full object-cover"
            placeholder="blur" // ✅ Bisa pakai blur karena import
            priority
          />
          <motion.div
            animate={floatAnimation}
            className="absolute left-4 top-4 rounded-full bg-green-500/90 p-2 backdrop-blur-sm"
          >
            <Coffee className="h-5 w-5 text-white" />
          </motion.div>
          <motion.div
            animate={floatAnimationDelayed}
            className="absolute bottom-4 right-4 rounded-full bg-amber-500/90 p-2 backdrop-blur-sm"
          >
            <Zap className="h-5 w-5 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
