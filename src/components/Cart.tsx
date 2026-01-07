'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button, buttonVariants } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, X, Trash2 } from 'lucide-react';
import Loading from '@/components/Loading';
import { cn, formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface CartMenu {
  id: number;
  restaurant_id: number;
  name: string;
  price: string;
  image: string;
  is_available: number;
  created_at: string;
  updated_at: string;
}

interface CartItem {
  id: number;
  cart_id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  created_at: string;
  updated_at: string;
  menu: CartMenu;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  is_open: number;
  created_at: string;
  updated_at: string;
}

interface Cart {
  id: number;
  user_id: number;
  restaurant_id: number;
  created_at: string;
  updated_at: string;
  items: CartItem[];
  restaurant?: Restaurant;
}

const CartComponent = () => {
  const [mounted, setMounted] = useState(false);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCart();

    const handleCartUpdate = () => {
      console.log('Cart update event received');
      fetchCart();
    };

    const handleLogout = () => {
      console.log('Logout event received');
      setCarts([]);
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        console.warn('No auth token found');
        setCarts([]);
        return;
      }

      const response = await fetch('http://localhost:8000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      if (data.success) {
        setCarts(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `http://localhost:8000/api/cart/items/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      );

      if (!response.ok) {
        toast.error('Gagal menghapus item');
        return;
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Item dihapus dari keranjang');
        await fetchCart();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat menghapus item');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateQuantity = async (
    itemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `http://localhost:8000/api/cart/items/${itemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          },
          body: JSON.stringify({ quantity: newQuantity })
        }
      );

      if (!response.ok) {
        toast.error('Gagal mengupdate quantity');
        return;
      }

      const data = await response.json();
      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat mengupdate quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `http://localhost:8000/api/cart/clear`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      );

      if (!response.ok) {
        toast.error('Gagal mengosongkan keranjang');
        return;
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Keranjang dikosongkan');
        setShowClearConfirm(false);
        await fetchCart();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat mengosongkan keranjang');
    } finally {
      setIsUpdating(false);
    }
  };

  const totalCartItems = carts.reduce((total, cart) => {
    return (
      total +
      cart.items.reduce(
        (itemTotal, item) => itemTotal + item.quantity,
        0
      )
    );
  }, 0);

  const totalCartPrice = carts.reduce((total, cart) => {
    return (
      total +
      cart.items.reduce(
        (itemTotal, item) =>
          itemTotal + parseFloat(item.price) * item.quantity,
        0
      )
    );
  }, 0);

  const cartsWithItems = carts.filter(
    (cart) => cart.items.length > 0
  );

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="relative">
            <ShoppingCart />
            {mounted && totalCartItems > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {totalCartItems}
              </span>
            ) : null}
          </Button>
        </SheetTrigger>
        <SheetContent className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Keranjang</SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col overflow-hidden">
            {mounted ? (
              cartsWithItems.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center">
                  <p className="mb-5 text-lg text-muted-foreground">
                    Keranjang kosong
                  </p>
                  <SheetClose asChild>
                    <Link
                      href="/menu"
                      className={buttonVariants({
                        variant: 'link',
                        size: 'sm',
                        className: 'text-sm text-muted-foreground'
                      })}
                    >
                      Tambahkan menu ke keranjang Anda
                    </Link>
                  </SheetClose>
                </div>
              ) : (
                <div className="flex flex-1 flex-col">
                  <ScrollArea className="flex-1">
                    <div className="space-y-6 pr-4">
                      {cartsWithItems.map((cart) => (
                        <div key={cart.id}>
                          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700/50">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                              {cart.restaurant?.name ||
                                `Restaurant ${cart.restaurant_id}`}
                            </h4>
                          </div>

                          <div className="space-y-4">
                            {cart.items.map((item, index) => (
                              <div key={item.id + index}>
                                <div className="flex flex-row items-start justify-between gap-3">
                                  <div className="flex-1 space-y-1">
                                    <div>
                                      <h3 className="line-clamp-2 text-sm font-semibold">
                                        {item.menu.name}
                                      </h3>
                                    </div>
                                    {item.notes && (
                                      <p className="line-clamp-1 text-xs text-muted-foreground">
                                        {item.notes}
                                      </p>
                                    )}
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                      Rp{' '}
                                      {parseFloat(
                                        item.menu.price
                                      ).toLocaleString('id-ID')}
                                    </p>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex flex-row items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                      <Button
                                        disabled={
                                          item.quantity === 1 ||
                                          isUpdating
                                        }
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            item.id,
                                            item.quantity - 1
                                          )
                                        }
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="w-6 text-center text-sm font-semibold">
                                        {item.quantity}
                                      </span>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        disabled={isUpdating}
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            item.id,
                                            item.quantity + 1
                                          )
                                        }
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      disabled={isUpdating}
                                      className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                                      onClick={() =>
                                        handleRemoveItem(item.id)
                                      }
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <Separator className="mt-4" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="mt-6 space-y-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                    <div className="flex flex-row items-center justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        Rp {totalCartPrice.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <SheetFooter className="flex w-full flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowClearConfirm(true)}
                        disabled={isUpdating}
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Kosongkan Keranjang
                      </Button>
                      <SheetClose asChild>
                        <Link
                          href="/checkout"
                          className={cn(
                            buttonVariants({ variant: 'default' }),
                            'w-full',
                            isUpdating &&
                              'pointer-events-none opacity-50'
                          )}
                        >
                          Checkout
                        </Link>
                      </SheetClose>
                    </SheetFooter>
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <Loading />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
      >
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Kosongkan Keranjang?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Anda yakin ingin menghapus semua item dari keranjang?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              ⚠️ Semua pesanan akan dihapus
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            <AlertDialogCancel className="flex-1">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCart}
              disabled={isUpdating}
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
            >
              {isUpdating ? 'Menghapus...' : 'Hapus Semua'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CartComponent;
