'use client';

import Image from 'next/image';
import Link from 'next/link';
import logo from '@public/logo.png';

interface LogoProps {
  dashboardLink: string;
}

export const Logo = ({ dashboardLink }: LogoProps) => {
  return (
    <Link
      href={dashboardLink}
      className="group flex items-center gap-3 transition-all hover:opacity-90"
    >
      <div className="relative h-10 w-20 overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-1.5 shadow-sm transition-all duration-300 group-hover:from-primary/10 group-hover:to-primary/15 group-hover:shadow-md">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]" />
        </div>

        <Image
          src={logo}
          alt="CRSD OBAMA"
          width={64}
          height={44}
          placeholder="blur"
          priority
          className="relative h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/10" />
        <div className="absolute inset-0 rounded-xl border border-primary/10 transition-all duration-300 group-hover:border-primary/20" />

        <div className="absolute left-0 top-0 h-2 w-2 rounded-tl-xl border-l border-t border-primary/20" />
        <div className="absolute right-0 top-0 h-2 w-2 rounded-tr-xl border-r border-t border-primary/20" />
        <div className="absolute bottom-0 left-0 h-2 w-2 rounded-bl-xl border-b border-l border-primary/20" />
        <div className="absolute bottom-0 right-0 h-2 w-2 rounded-br-xl border-b border-r border-primary/20" />
      </div>
    </Link>
  );
};
