import Image from 'next/image';
import homePic from '../../public/home.jpg';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <div className="mt-4 flex flex-col gap-5 rounded border bg-stone-200 p-5 dark:bg-stone-900 md:flex-row">
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold md:mb-6 md:text-4xl">
            Welcome to Fooder - Your Gateway to Culinary Delights!
          </div>
          <p className="py-10 font-light opacity-90">
            At Fooder, we believe that great food should be just a
            click away. Welcome to our online food ordering platform,
            where we bring the finest local flavors right to your
            doorstep. Whether you&apos;re craving comfort classics,
            exploring exotic cuisines, or seeking healthier
            alternatives, we&apos;ve got a diverse menu curated with
            your taste buds in mind.
          </p>
          <div className="mx-auto mb-3">
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'w-28'
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
      <div className="mb-6 mt-6">
        <h2 className="mb-3 text-center text-2xl md:text-4xl">
          Why Choose Fooder?
        </h2>
        <div className="flex flex-col gap-3">
          <div>
            <b>Unrivaled Variety:</b>{' '}
            <span className="text-muted-foreground">
              From beloved neighborhood gems to hidden culinary
              treasures, our platform showcases a wide array of
              restaurants to suit every palate.
            </span>
          </div>
          <div>
            <b>Effortless Ordering:</b>{' '}
            <span className="text-muted-foreground">
              Our user-friendly interface makes ordering your favorite
              dishes a breeze. Browse menus, customize your
              selections, and place an order with just a few clicks -
              it&apos;s that simple!
            </span>
          </div>
          <div>
            <b>Local Love, Global Flavors:</b>{' '}
            <span className="text-muted-foreground">
              We celebrate local culinary talent while also offering a
              global feast for your senses. Explore a world of tastes
              without leaving the comfort of your home.
            </span>
          </div>
          <div>
            <b>Speedy Delivery:</b>{' '}
            <span className="text-muted-foreground">
              We understand the anticipation that comes with a
              delicious meal. Our dedicated delivery partners work
              tirelessly to ensure your order arrives fresh and
              timely.
            </span>
          </div>
          <div>
            <b>Exclusive Deals:</b>{' '}
            <span className="text-muted-foreground">
              Enjoy exclusive discounts, promotions, and loyalty
              rewards when you order through Fooder. Your satisfaction
              is our priority, and we love treating our customers to a
              little extra delight.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
