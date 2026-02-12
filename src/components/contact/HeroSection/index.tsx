'use client';

import Image from 'next/image';
import contactPic from '@public/contactpages.png';

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
      <div className="relative h-64 md:h-80">
        <Image
          src={contactPic}
          alt="BTN Support Team"
          fill
          className="object-cover"
          placeholder="blur"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
      </div>
    </div>
  );
};
