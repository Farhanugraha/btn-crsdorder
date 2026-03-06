'use client';

import { motion } from 'framer-motion';
import { Coffee, Zap, Building2 } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { fadeInUp, staggerContainer } from '../animations';

const features = [
  {
    icon: Coffee,
    title: 'Menu Lengkap & Berkualitas',
    description:
      'Dari masakan tradisional hingga modern, semua terjamin kualitasnya. Kerjasama dengan vendor terbaik untuk memastikan kepuasan Anda.',
    color: 'blue' as const
  },
  {
    icon: Zap,
    title: 'Proses Kilat & Mudah',
    description:
      'Hanya dalam 3 klik, pesanan Anda langsung diproses. Interface yang intuitif membuat pengalaman pemesanan menyenangkan.',
    color: 'amber' as const
  },
  {
    icon: Building2,
    title: 'Support Aktivitas Kantor',
    description:
      'Catering rapat, makan siang tim, hingga konsumsi lembur. Semua kebutuhan kuliner kantor dalam satu platform.',
    color: 'green' as const
  }
];

export const FeaturesSection = () => {
  return (
    <section className="mb-6 mt-20 px-4 md:mt-32 md:px-0">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center"
        >
          <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-1.5 dark:from-blue-900/30 dark:to-purple-900/30">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              🚀 Keunggulan Fooder
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Mengapa BTNERS Memilih OBBAMA?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-gray-600 dark:text-gray-400">
            Solusi lengkap untuk semua kebutuhan kuliner Anda di
            lingkungan kerja
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
