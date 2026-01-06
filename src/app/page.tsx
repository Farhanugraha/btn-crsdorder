import Image from 'next/image';
import homePic from '../../public/mainpage.png';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="mt-4 flex flex-col gap-5 rounded-lg border border-border bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-slate-900 dark:to-slate-800 md:flex-row md:p-12">
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold md:mb-6 md:text-4xl lg:text-5xl">
            <span className="mb-2 block">
              Hallo{' '}
              <span className="text-blue-600 dark:text-blue-400">
                BTN
              </span>
              <span className="text-red-600 dark:text-red-500">
                ERS
              </span>
              👋
            </span>
            <span className="mt-3 block text-xl font-semibold text-gray-600 dark:text-gray-300 md:text-3xl lg:text-4xl">
              Selamat Datang di Fooder – Solusi Pemesanan Makanan
              untuk Aktivitas Kerja Anda
            </span>
          </div>
          <p className="py-6 font-light leading-relaxed text-gray-700 dark:text-gray-300 md:py-10">
            Fooder hadir sebagai platform pemesanan makanan yang
            dirancang untuk mendukung produktivitas BTNERS di tengah
            aktivitas kerja yang padat. Tanpa perlu keluar kantor atau
            menghabiskan waktu antre, Anda dapat dengan mudah memesan
            berbagai pilihan makanan favorit langsung dari perangkat
            Anda.
          </p>
          <div className="flex gap-4">
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'w-fit px-6'
              )}
            >
              Pesan Sekarang
            </Link>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-fit px-6'
              )}
            >
              Pelajari Lebih
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center md:w-1/2">
          <Image
            src={homePic}
            alt="Fooder - Platform Pemesanan Makanan"
            width={400}
            height={400}
            className="h-auto w-72 rounded-full object-cover shadow-lg md:w-96"
            placeholder="blur"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-6 mt-16 px-4 md:mt-24 md:px-0">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Mengapa BTNERS Memilih Fooder?
          </h2>
          <p className="mb-12 text-center text-gray-600 dark:text-gray-400">
            Kami menyediakan solusi terbaik untuk kebutuhan makanan
            Anda di kantor
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Feature Card 1 */}
            <div className="group rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 transition-all duration-300 hover:shadow-lg dark:border-blue-800 dark:from-blue-950 dark:to-blue-900">
              <div className="mb-4 text-5xl">🍽</div>
              <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                Pilihan Menu Beragam
              </h3>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                Fooder menyediakan berbagai pilihan menu dari mitra
                kuliner terpercaya, mulai dari makanan lokal favorit
                hingga menu modern yang sesuai dengan selera BTNERS.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-8 transition-all duration-300 hover:shadow-lg dark:border-amber-800 dark:from-amber-950 dark:to-amber-900">
              <div className="mb-4 text-5xl">⚡</div>
              <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                Pemesanan Cepat & Mudah
              </h3>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                Dengan antarmuka yang sederhana dan intuitif, proses
                pemesanan dapat dilakukan dalam hitungan menit tanpa
                mengganggu pekerjaan utama Anda.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-8 transition-all duration-300 hover:shadow-lg dark:border-green-800 dark:from-green-950 dark:to-green-900">
              <div className="mb-4 text-5xl">🏢</div>
              <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                Mendukung Aktivitas Kantor
              </h3>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                Cocok untuk kebutuhan makan siang, konsumsi rapat,
                hingga kebutuhan tim saat lembur. Fooder membantu
                memastikan kebutuhan konsumsi kantor terpenuhi dengan
                baik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 rounded-lg border border-border bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-12 text-center dark:from-blue-700 dark:to-indigo-700 md:mt-24 md:py-16">
        <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
          Siap Memesan Makanan Favorit Anda?
        </h2>
        <p className="mb-8 text-blue-100">
          Bergabunglah dengan ribuan BTNERS yang telah menikmati
          kemudahan Fooder
        </p>
        <Link
          href="/menu"
          className={cn(
            buttonVariants({ variant: 'secondary' }),
            'w-fit px-8 text-base'
          )}
        >
          Mulai Memesan Sekarang
        </Link>
      </section>
    </div>
  );
}
