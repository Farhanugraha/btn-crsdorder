'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { ContactCard } from './ContactCard';

const contactChannels = [
  {
    icon: (
      <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
    ),
    title: 'Telepon',
    subtitle: 'Bantuan langsung via telepon',
    bgColor: 'bg-blue-100 dark:bg-blue-900/50',
    borderColor: 'border-blue-200/50',
    hoverColor: 'blue-400',
    content: (
      <>
        <a
          href="tel:(021)1500-286"
          className="text-xl font-bold text-blue-700 transition-colors hover:text-blue-800 dark:text-blue-400"
        >
          (0856) 9281-4722
        </a>
        <p className="mt-2 text-sm text-muted-foreground">
          Ext. (IT Support)
        </p>
      </>
    )
  },
  {
    icon: (
      <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
    ),
    title: 'Email',
    subtitle: 'Kirim email untuk pertanyaan detail',
    bgColor: 'bg-green-100 dark:bg-green-900/50',
    borderColor: 'border-green-200/50',
    hoverColor: 'green-400',
    content: (
      <>
        <a
          href="mailto:support.internal@btn.co.id"
          className="break-all text-lg font-bold text-green-700 transition-colors hover:text-green-800 dark:text-green-400"
        >
          support.internal@btn.co.id
        </a>
        <p className="mt-2 text-sm text-muted-foreground">
          Balasan dalam 1-2 jam kerja
        </p>
      </>
    )
  },
  {
    icon: (
      <MapPin className="h-8 w-8 text-amber-600 dark:text-amber-400" />
    ),
    title: 'Kantor',
    subtitle: 'Kunjungi kami langsung',
    bgColor: 'bg-amber-100 dark:bg-amber-900/50',
    borderColor: 'border-amber-200/50',
    hoverColor: 'amber-400',
    content: (
      <>
        <p className="font-semibold">Menara BTN</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Jl. Gajah Mada No.1
        </p>
        <p className="text-sm text-muted-foreground">Jakarta Pusat</p>
      </>
    )
  },
  {
    icon: (
      <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'Jam Operasional',
    subtitle: 'Layanan tersedia',
    bgColor: 'bg-purple-100 dark:bg-purple-900/50',
    borderColor: 'border-purple-200/50',
    hoverColor: 'purple-400',
    content: (
      <div className="space-y-1">
        <p className="font-semibold">Senin - Jumat</p>
        <p className="text-sm">08:00 - 17:00 WIB</p>
        <p className="mt-2 text-xs text-muted-foreground">
          *Sabtu hanya emergency
        </p>
      </div>
    )
  }
];

export const ContactChannels = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold">
        Kanal Kontak Kami
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {contactChannels.map((channel, index) => (
          <ContactCard
            key={index}
            icon={channel.icon}
            title={channel.title}
            subtitle={channel.subtitle}
            bgColor={channel.bgColor}
            borderColor={channel.borderColor}
            hoverColor={channel.hoverColor}
          >
            {channel.content}
          </ContactCard>
        ))}
      </div>
    </div>
  );
};
