'use client';

import { Zap, Shield, Users, ThumbsUp } from 'lucide-react';
import type { SupportFeature } from '@/types/contact';

const supportFeatures: SupportFeature[] = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Respon Cepat',
    description: 'Tim kami merespon dalam 1-2 jam kerja'
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Aman & Terpercaya',
    description: 'Data Anda terlindungi dengan enkripsi terbaik'
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Tim Berpengalaman',
    description: 'Dikelola oleh profesional IT BTN'
  },
  {
    icon: <ThumbsUp className="h-5 w-5" />,
    title: 'Kepuasan User',
    description: '99% user puas dengan layanan kami'
  }
];

export const WelcomeSection = () => {
  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-blue-50/50 to-white p-6 dark:from-blue-950/30 dark:to-gray-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Hallo{' '}
          <span className="text-blue-700 dark:text-blue-400">
            BTNers!
          </span>{' '}
          👋
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Support Terbaik untuk Pengalaman Terbaik
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <p className="text-center text-lg leading-relaxed">
          Kami berkomitmen untuk memastikan pengalaman Anda dalam
          menggunakan sistem pemesanan makanan internal BTN berjalan
          dengan{' '}
          <span className="font-semibold text-primary">
            lancar, nyaman, dan efisien
          </span>
          . Masukan dan pertanyaan Anda sangat berarti bagi
          pengembangan sistem kami.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {supportFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
            >
              <div className="text-primary">{feature.icon}</div>
              <div className="text-sm font-medium">
                {feature.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
