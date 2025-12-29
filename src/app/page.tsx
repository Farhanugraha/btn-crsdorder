import Image from 'next/image';
import homePic from '../../public/mainpage.png';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <div className="mt-4 flex flex-col gap-5 rounded border bg-stone-200 p-5 dark:bg-stone-900 md:flex-row">
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold md:mb-6 md:text-4xl">
            <span className="mb-2 block">
              Hallo{' '}
              <span className="text-blue-700 dark:text-blue-500">
                BTN
              </span>
              <span className="text-red-600 dark:text-red-500">
                ERS
              </span>
              👋
            </span>
            <span className="mt-3 block text-xl font-semibold md:text-3xl">
              Selamat Datang di Fooder – Solusi Pemesanan Makanan
              untuk Aktivitas Kerja Anda
            </span>
          </div>
          <p className="py-10 font-light leading-relaxed opacity-90">
            Fooder hadir sebagai platform pemesanan makanan yang
            dirancang untuk mendukung produktivitas BTNERS di tengah
            aktivitas kerja yang padat. Tanpa perlu keluar kantor atau
            menghabiskan waktu antre, Anda dapat dengan mudah memesan
            berbagai pilihan makanan favorit langsung dari perangkat
            Anda.
          </p>
          <div className="mx-auto mb-3">
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'w-32 text-base'
              )}
            >
              Order now
            </Link>
          </div>
        </div>
        <Image
          src={homePic}
          alt="home picture"
          width="0"
          height="0"
          className="mx-auto h-auto w-72 rounded-full"
          placeholder="blur"
          blurDataURL={`${homePic}`}
          loading="lazy"
        />
      </div>

      <div className="mb-6 mt-12">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-4xl">
          Mengapa BTNERS Memilih Fooder?
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-6 transition-shadow hover:shadow-lg dark:from-blue-950 dark:to-blue-900">
            <div className="mb-3 text-3xl">🍽</div>
            <h3 className="mb-2 text-lg font-bold">
              Pilihan Menu Beragam
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Fooder menyediakan berbagai pilihan menu dari mitra
              kuliner terpercaya, mulai dari makanan lokal favorit
              hingga menu modern yang sesuai dengan selera BTNERS.
            </p>
          </div>

          <div className="rounded-lg border bg-gradient-to-br from-amber-50 to-amber-100 p-6 transition-shadow hover:shadow-lg dark:from-amber-950 dark:to-amber-900">
            <div className="mb-3 text-3xl">⚡</div>
            <h3 className="mb-2 text-lg font-bold">
              Pemesanan Cepat & Mudah
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Dengan antarmuka yang sederhana dan intuitif, proses
              pemesanan dapat dilakukan dalam hitungan menit tanpa
              mengganggu pekerjaan utama Anda.
            </p>
          </div>

          <div className="rounded-lg border bg-gradient-to-br from-green-50 to-green-100 p-6 transition-shadow hover:shadow-lg dark:from-green-950 dark:to-green-900">
            <div className="mb-3 text-3xl">🏢</div>
            <h3 className="mb-2 text-lg font-bold">
              Mendukung Aktivitas Kantor
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Cocok untuk kebutuhan makan siang, konsumsi rapat,
              hingga kebutuhan tim saat lembur. Fooder membantu
              memastikan kebutuhan konsumsi kantor terpenuhi dengan
              baik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
