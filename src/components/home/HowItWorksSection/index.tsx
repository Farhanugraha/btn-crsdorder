'use client';

import { motion } from 'framer-motion';
import { StepCard } from './StepCard';
import { fadeInUp, staggerContainer } from '../animations';

const steps = [
  {
    step: 1,
    title: 'Pilih Area',
    description:
      'Tentukan lokasi pengiriman atau pickup sesuai area kantor Anda',
    color: 'blue'
  },
  {
    step: 2,
    title: 'Pilih Menu',
    description:
      'Jelajahi ratusan pilihan menu dan tambahkan ke keranjang',
    color: 'purple'
  },
  {
    step: 3,
    title: 'Checkout & Nikmati',
    description:
      'Bayar dengan mudah dan tunggu makanan tiba di lokasi Anda',
    color: 'green'
  }
];

export const HowItWorksSection = () => {
  return (
    <section className="mt-20 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/30 px-6 py-12 dark:from-gray-900 dark:to-blue-900/20 md:py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Cara Kerja Fooder
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-gray-600 dark:text-gray-400">
            Hanya 3 langkah sederhana untuk mendapatkan makanan
            favorit Anda
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {steps.map((step) => (
            <StepCard key={step.step} {...step} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
