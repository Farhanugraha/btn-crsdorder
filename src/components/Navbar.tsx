'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ToggleTheme } from '@/components/ToggleTheme';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from '@/components/ui/menubar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LogOut, Menu } from 'lucide-react';
import logo from '../../public/logobtn.png';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import Loading from './Loading';
import Cart from './Cart';

const Navbar = () => {
  const { status, data: session } = useSession();

  return (
    <nav className="flex flex-row items-center justify-between gap-2 text-lg">
      {/* Desktop Navigation Start*/}
      <div className="hidden flex-row items-center gap-6 md:flex">
        <Link href="/" as={'image'}>
          <Image
            src={logo}
            alt="Logo"
            width={50}
            height={50}
            placeholder="blur"
            blurDataURL={`${logo}`}
          />
        </Link>
        <div className="flex flex-row items-center gap-2">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-16'
            )}
          >
            Home
          </Link>
          <Link
            href="/menu"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-16'
            )}
          >
            Menu
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-16'
            )}
          >
            Contact
          </Link>
          <Link
            href="/support"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-16'
            )}
          >
            Support
          </Link>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-16'
            )}
          >
            About
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex flex-row items-center justify-between gap-2 text-lg md:hidden ">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <Menu />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem asChild>
                <Link href="/">Home</Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link href="/menu">Menu</Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem asChild>
                <Link href="/contact">Contact</Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link href="/support">Support</Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link href="/about">About</Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      {/* Authentication Navigation */}
      <div className="flex flex-row items-center gap-3">
        <div className="flex h-7 flex-row items-center gap-3">
          {status === 'loading' ? (
            <Loading className="h-5 w-5" />
          ) : session?.user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {session?.user.username}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={12}
                  className="min-w-[8rem]"
                >
                  <DropdownMenuItem
                    asChild
                    className="hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link
                      className="w-full"
                      href={`/user/${session.user.id}/profile`}
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link
                      className="w-full"
                      href={`/user/${session.user.id}/orders`}
                    >
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === 'ADMIN' && (
                    <DropdownMenuItem
                      asChild
                      className="hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    >
                      <Link
                        className="w-full"
                        href={`/user/${session.user.id}/admin`}
                      >
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="icon"
                onClick={async () => {
                  await signOut({
                    redirect: true,
                    callbackUrl: '/'
                  });
                }}
              >
                <LogOut />
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'w-16'
                )}
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'w-16'
                )}
              >
                Register
              </Link>
            </>
          )}
          <Separator orientation="vertical" />
          <Cart />
          <ToggleTheme />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
