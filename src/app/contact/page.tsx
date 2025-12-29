import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import contactPic from '../../../public/contactpages.png';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <Image
          src={contactPic}
          alt="contact picture"
          width="0"
          height="0"
          className="h-auto w-full"
          placeholder="blur"
          blurDataURL={`${contactPic}`}
          loading="lazy"
        />
      </div>

      {/* Welcome Section */}
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold md:text-4xl">
            Hallo{' '}
            <span className="text-blue-900 dark:text-blue-400">
              BTNers!
            </span>{' '}
            👋
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground">
            Kami siap membantu memastikan pengalaman Anda dalam
            menggunakan sistem pemesanan makanan internal BTN berjalan
            dengan lancar, nyaman, dan efisien. Masukan dan pertanyaan
            Anda sangat berarti bagi kami.
          </p>

          <p className="text-lg leading-relaxed text-muted-foreground">
            Silakan hubungi kami melalui kanal berikut untuk bantuan,
            kendala teknis, maupun saran pengembangan sistem.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Phone Card */}
          <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-6 transition-shadow hover:shadow-lg dark:from-blue-950 dark:to-blue-900">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-lg bg-blue-200 p-3 dark:bg-blue-800">
                <Phone className="h-6 w-6 text-blue-900 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold">Telepon</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Hubungi kami untuk bantuan langsung
            </p>
            <p className="text-xl font-semibold text-blue-900 dark:text-blue-400">
              (021) 1500-286
            </p>
          </div>

          {/* Email Card */}
          <div className="rounded-lg border bg-gradient-to-br from-green-50 to-green-100 p-6 transition-shadow hover:shadow-lg dark:from-green-950 dark:to-green-900">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-lg bg-green-200 p-3 dark:bg-green-800">
                <Mail className="h-6 w-6 text-green-900 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold">Email</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Kirim pesan atau pertanyaan tertulis
            </p>
            <p className="break-all text-lg font-semibold text-green-900 dark:text-green-400">
              support.internal@btn.co.id
            </p>
          </div>

          {/* Address Card */}
          <div className="rounded-lg border bg-gradient-to-br from-amber-50 to-amber-100 p-6 transition-shadow hover:shadow-lg dark:from-amber-950 dark:to-amber-900">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-lg bg-amber-200 p-3 dark:bg-amber-800">
                <MapPin className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold">Kantor Pusat</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Kunjungi kami secara langsung
            </p>
            <p className="text-lg font-semibold">
              Menara BTN, Jakarta Pusat, Indonesia
            </p>
          </div>

          {/* Hours Card */}
          <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100 p-6 transition-shadow hover:shadow-lg dark:from-purple-950 dark:to-purple-900">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-lg bg-purple-200 p-3 dark:bg-purple-800">
                <Clock className="h-6 w-6 text-purple-900 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold">Jam Operasional</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Layanan support tersedia pada
            </p>
            <div className="space-y-1">
              <p className="font-semibold">Senin - Jumat</p>
              <p className="text-sm">09:00 - 18:00 WIB</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 space-y-4 rounded-lg border-2 bg-gradient-to-r from-blue-50 to-blue-100 p-8 text-center dark:from-blue-950 dark:to-blue-900">
          <h2 className="text-2xl font-bold">Ada Pertanyaan?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Tim support kami siap membantu Anda. Jangan ragu untuk
            menghubungi kami melalui salah satu kanal di atas.
          </p>
          <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
            <a href="tel:(021)1500-286">
              <Button variant="default" className="w-full sm:w-auto">
                Hubungi Kami
              </Button>
            </a>
            <a href="mailto:support.internal@btn.co.id">
              <Button variant="outline" className="w-full sm:w-auto">
                Kirim Email
              </Button>
            </a>
          </div>
        </div>

        {/* Closing Message */}
        <div className="space-y-3 border-t py-8 text-center">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Terima kasih telah menggunakan sistem pemesanan makanan
            internal
            <span className="font-bold text-blue-700 dark:text-blue-600">
              {' '}
              BTN
            </span>
            .
          </p>
          <p className="text-lg font-semibold">
            Kenyamanan dan produktivitas BTNers adalah prioritas kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
