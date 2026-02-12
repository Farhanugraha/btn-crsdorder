'use client';

import { HeroContent } from './HeroContent';
import { HeroImage } from './HeroImage';

export const HeroSection = () => {
  return (
    <section className="relative mt-4 flex flex-col gap-8 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-6 dark:border-gray-800 dark:from-gray-900 dark:to-slate-900 md:flex-row md:p-12">
      {/* Background Elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-900/20"></div>
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-900/20"></div>

      <HeroContent />
      <HeroImage />
    </section>
  );
};
