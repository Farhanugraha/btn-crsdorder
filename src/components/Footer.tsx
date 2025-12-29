import { Facebook, Instagram } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex flex-col items-center gap-10 border-t-2">
      <div className="mt-10 flex flex-col gap-3 md:flex-row md:gap-14">
        <div className="flex flex-col gap-1 md:gap-5">
          <label className="font-bold opacity-60">
            Partner with us
          </label>
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: 'link' }),
                  'p-0'
                )}
              >
                For couriers
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: 'link' }),
                  'p-0'
                )}
              >
                For restaurant
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-1 md:gap-5">
          <label className="font-bold opacity-60">Useful Links</label>
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: 'link' }),
                  'p-0'
                )}
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: 'link' }),
                  'p-0'
                )}
              >
                Developers
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-1 md:gap-5">
          <label className="font-bold opacity-60">Follow us</label>
          <div className="flex flex-col items-start gap-1">
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0'
              )}
            >
              <span className="flex flex-row gap-1">
                <Facebook />
                <p>Facebook</p>
              </span>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0'
              )}
            >
              <span className="flex flex-row gap-1">
                <Instagram />
                <p>Instagram</p>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} CRSD BTN. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with by CRSD Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
