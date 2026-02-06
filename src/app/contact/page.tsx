import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  MessageSquare,
  HelpCircle,
  Shield,
  Zap,
  ThumbsUp
} from 'lucide-react';
import contactPic from '../../../public/contactpages.png';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const supportFeatures = [
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

  const commonIssues = [
    'Kesalahan login atau autentikasi',
    'Kendala saat melakukan pemesanan',
    'Masalah pembayaran atau invoice',
    'Lupa password atau reset akun',
    'Permintaan menu atau restoran baru',
    'Laporan bug atau kendala teknis'
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
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

      {/* Main Content */}
      <div className="mx-auto max-w-6xl space-y-12 px-4">
        {/* Welcome Section */}
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
              menggunakan sistem pemesanan makanan internal BTN
              berjalan dengan{' '}
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

        {/* Contact Channels Grid */}
        <div className="space-y-6">
          <h2 className="text-center text-2xl font-bold">
            Kanal Kontak Kami
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Phone Card */}
            <div className="group rounded-xl border-2 border-blue-200/50 bg-white p-6 transition-all hover:border-blue-400 hover:shadow-xl dark:bg-gray-900">
              <div className="mb-4 flex flex-col items-center">
                <div className="mb-3 rounded-full bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-900/50">
                  <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold">Telepon</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Bantuan langsung via telepon
                </p>
              </div>
              <div className="text-center">
                <a
                  href="tel:(021)1500-286"
                  className="text-xl font-bold text-blue-700 transition-colors hover:text-blue-800 dark:text-blue-400"
                >
                  (021) 1500-286
                </a>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ext. 1234 (IT Support)
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="group rounded-xl border-2 border-green-200/50 bg-white p-6 transition-all hover:border-green-400 hover:shadow-xl dark:bg-gray-900">
              <div className="mb-4 flex flex-col items-center">
                <div className="mb-3 rounded-full bg-green-100 p-3 transition-transform group-hover:scale-110 dark:bg-green-900/50">
                  <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold">Email</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Kirim email untuk pertanyaan detail
                </p>
              </div>
              <div className="text-center">
                <a
                  href="mailto:support.internal@btn.co.id"
                  className="break-all text-lg font-bold text-green-700 transition-colors hover:text-green-800 dark:text-green-400"
                >
                  support.internal@btn.co.id
                </a>
                <p className="mt-2 text-sm text-muted-foreground">
                  Balasan dalam 1-2 jam kerja
                </p>
              </div>
            </div>

            {/* Address Card */}
            <div className="group rounded-xl border-2 border-amber-200/50 bg-white p-6 transition-all hover:border-amber-400 hover:shadow-xl dark:bg-gray-900">
              <div className="mb-4 flex flex-col items-center">
                <div className="mb-3 rounded-full bg-amber-100 p-3 transition-transform group-hover:scale-110 dark:bg-amber-900/50">
                  <MapPin className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold">Kantor</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Kunjungi kami langsung
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Menara BTN</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Jl. Gajah Mada No.1
                </p>
                <p className="text-sm text-muted-foreground">
                  Jakarta Pusat
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="group rounded-xl border-2 border-purple-200/50 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl dark:bg-gray-900">
              <div className="mb-4 flex flex-col items-center">
                <div className="mb-3 rounded-full bg-purple-100 p-3 transition-transform group-hover:scale-110 dark:bg-purple-900/50">
                  <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold">Jam Operasional</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Layanan tersedia
                </p>
              </div>
              <div className="text-center">
                <div className="space-y-1">
                  <p className="font-semibold">Senin - Jumat</p>
                  <p className="text-sm">09:00 - 18:00 WIB</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    *Sabtu hanya emergency
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Issues & FAQ */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Common Issues */}
          <div className="rounded-xl border bg-white p-6 dark:bg-gray-900">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                <h2 className="text-xl font-bold">Masalah Umum</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Beberapa kendala yang sering dilaporkan
              </p>
            </div>
            <div className="space-y-3">
              {commonIssues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm">{issue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="rounded-xl border bg-white p-6 dark:bg-gray-900">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-xl font-bold">Tips Cepat</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Saran untuk pengalaman lebih baik
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400">
                  📱 Gunakan Browser Terbaru
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pastikan browser Anda sudah update untuk performa
                  optimal
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
                <h4 className="font-semibold text-green-700 dark:text-green-400">
                  🔄 Clear Cache Secara Rutin
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bersihkan cache browser jika ada masalah loading
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/30">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400">
                  ⚡ Cek Koneksi Internet
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pastikan koneksi stabil sebelum melakukan transaksi
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950/30">
                <h4 className="font-semibold text-purple-700 dark:text-purple-400">
                  📸 Screenshot Error
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Screenshot error untuk memudahkan troubleshooting
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              Butuh Bantuan Segera?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Tim support kami siap membantu menyelesaikan kendala
              Anda dengan cepat dan efisien.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="tel:(021)1500-286">
                <Button
                  size="lg"
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Phone className="h-4 w-4" />
                  Telepon Sekarang
                </Button>
              </a>
              <a href="mailto:support.internal@btn.co.id">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-2"
                >
                  <Mail className="h-4 w-4" />
                  Kirim Email
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Responsif • Profesional • Solutif
            </p>
          </div>
        </div>

        {/* Closing Message */}
        <div className="rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-8 text-center dark:from-gray-900 dark:to-gray-800">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-2xl font-bold">
              Terima Kasih atas Kepercayaan Anda
            </h3>
            <p className="mt-4 text-lg text-muted-foreground">
              Sistem pemesanan makanan internal BTN hadir untuk
              meningkatkan produktivitas dan kenyamanan kerja Anda.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3">
              <span className="font-semibold text-primary">
                🎯 Kepuasan BTNers adalah Prioritas Kami
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
