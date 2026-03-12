'use client';

import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export const AboutContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
      className="flex flex-col justify-center gap-6 md:gap-8"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div className="inline-block rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-1.5 dark:from-blue-900/30 dark:to-purple-900/30">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            🎯 Tentang Obbama
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Solusi Makan Siang{' '}
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
            BTNers
          </span>
        </h1>
      </motion.div>

      {/* Description */}
      <motion.p
        variants={fadeInUp}
        className="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
      >
        Selamat datang{' '}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          BTNers
        </span>{' '}
        di Obbama, platform pemesanan makanan yang kami hadirkan untuk
        memudahkan Anda menikmati beragam hidangan favorit secara
        praktis dan cepat. Obbama dirancang untuk mendukung aktivitas
        BTNers dengan akses mudah ke pilihan kuliner berkualitas dari
        berbagai mitra restoran, menghadirkan pengalaman memesan
        makanan yang efisien, nyaman, dan menyenangkan dalam satu
        genggaman.
      </motion.p>

      {/* Simple Values - 3 columns */}
      <motion.div
        variants={fadeInUp}
        className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950/30">
          <h3 className="font-semibold text-blue-700 dark:text-blue-400">
            Kualitas Terbaik
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Hanya mitra restoran terbaik yang memenuhi standar BTN
          </p>
        </div>

        <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4 dark:bg-green-950/30">
          <h3 className="font-semibold text-green-700 dark:text-green-400">
            Kemudahan Akses
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Platform intuitif yang mudah digunakan semua BTNers
          </p>
        </div>

        <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-950/30">
          <h3 className="font-semibold text-amber-700 dark:text-amber-400">
            Layanan Cepat
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Proses pemesanan hingga pengantaran yang efisien
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
