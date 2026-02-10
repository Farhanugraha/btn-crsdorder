'use client';

import Image from 'next/image';
import homePic from '../../public/mainpage.png';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Coffee,
  Zap,
  Building2,
  Clock,
  CheckCircle,
  Users,
  ArrowRight,
  Sparkles,
  Utensils
} from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const
    }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const
    }
  };

  const floatAnimationDelayed = {
    y: [0, 10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 0.5
    }
  };

  // Fixed positions untuk menghindari hydration mismatch
  const fixedPositions = [
    { left: '10%', top: '20%' },
    { left: '30%', top: '40%' },
    { left: '50%', top: '10%' },
    { left: '70%', top: '60%' },
    { left: '90%', top: '30%' },
    { left: '15%', top: '70%' },
    { left: '40%', top: '80%' },
    { left: '60%', top: '90%' },
    { left: '85%', top: '75%' },
    { left: '25%', top: '15%' },
    { left: '45%', top: '50%' },
    { left: '65%', top: '25%' },
    { left: '5%', top: '45%' },
    { left: '35%', top: '65%' },
    { left: '75%', top: '85%' },
    { left: '95%', top: '55%' },
    { left: '20%', top: '95%' },
    { left: '55%', top: '35%' },
    { left: '80%', top: '5%' },
    { left: '100%', top: '100%' }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative mt-4 flex flex-col gap-8 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-6 dark:border-gray-800 dark:from-gray-900 dark:to-slate-900 md:flex-row md:p-12">
        {/* Background Elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-900/20"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-900/20"></div>

        <motion.div
          className="flex flex-col justify-center md:w-1/2"
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
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
            Nikmati pengalaman pemesanan makanan yang praktis dan
            efisien. Tanpa keluar kantor atau antre panjang, berbagai
            pilihan menu siap menemani produktivitas Anda sepanjang
            hari.
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

        {/* Hero Image */}
        <motion.div
          className="flex items-center justify-center md:w-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            scale: isVisible ? 1 : 0.8,
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
                placeholder="blur"
                priority
              />
              {/* Floating Elements */}
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
      </section>

      {/* Features Section */}
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
              Mengapa BTNERS Memilih Fooder?
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
            {/* Feature Card 1 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-white to-blue-50/50 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-blue-800/30 dark:from-gray-900/50 dark:to-blue-900/20"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-xl"></div>
              <motion.div
                whileHover={{ rotate: 15 }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600"
              >
                <Coffee className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Menu Lengkap & Berkualitas
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                Dari masakan tradisional hingga modern, semua terjamin
                kualitasnya. Kerjasama dengan vendor terbaik untuk
                memastikan kepuasan Anda.
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-br from-white to-amber-50/50 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-amber-800/30 dark:from-gray-900/50 dark:to-amber-900/20"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/10 blur-xl"></div>
              <motion.div
                whileHover={{ rotate: 15 }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600"
              >
                <Zap className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Proses Kilat & Mudah
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                Hanya dalam 3 klik, pesanan Anda langsung diproses.
                Interface yang intuitif membuat pengalaman pemesanan
                menyenangkan.
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl border border-green-200/50 bg-gradient-to-br from-white to-green-50/50 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-green-800/30 dark:from-gray-900/50 dark:to-green-900/20"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/10 blur-xl"></div>
              <motion.div
                whileHover={{ rotate: 15 }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600"
              >
                <Building2 className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Support Aktivitas Kantor
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                Catering rapat, makan siang tim, hingga konsumsi
                lembur. Semua kebutuhan kuliner kantor dalam satu
                platform.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
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
            {/* Step 1 */}
            <motion.div
              variants={fadeInUp}
              className="relative z-10 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-3xl font-bold text-white shadow-lg"
              >
                1
              </motion.div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                Pilih Area
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tentukan lokasi pengiriman atau pickup sesuai area
                kantor Anda
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={fadeInUp}
              className="relative z-10 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-3xl font-bold text-white shadow-lg"
              >
                2
              </motion.div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                Pilih Menu
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Jelajahi ratusan pilihan menu dan tambahkan ke
                keranjang
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={fadeInUp}
              className="relative z-10 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-3xl font-bold text-white shadow-lg"
              >
                3
              </motion.div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                Checkout & Nikmati
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bayar dengan mudah dan tunggu makanan tiba di lokasi
                Anda
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - FIXED: Tidak pakai Math.random */}
      <section className="relative mt-20 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-16 text-center md:py-20">
        {/* Animated Background - Fixed positions */}
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
            Bergabunglah BTNERS yang sudah merasakan kemudahan OBAMA
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

      {/* Floating Action Button */}
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
          >
            <Utensils className="h-6 w-6 text-white" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Tambahkan CSS untuk custom animations di global.css jika perlu */}
      <style jsx global>{`
        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(10deg);
          }
          75% {
            transform: rotate(-10deg);
          }
        }
        .animate-wave {
          animation: wave 2s infinite;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
      `}</style>
    </div>
  );
}
