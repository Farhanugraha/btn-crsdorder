'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetClose,
  SheetContent,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Minus,
  Plus,
  ShoppingCart,
  X,
  Trash2,
  MapPin,
  Edit2
} from 'lucide-react';
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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [checkoutNotes, setCheckoutNotes] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showEditNotesDialog, setShowEditNotesDialog] =
    useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(
    null
  );
  const [editingNotes, setEditingNotes] = useState('');

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
      setSheetOpen(false);
      setShowClearConfirm(false);
    };

    const handleLogin = () => {
      console.log('Login event received');
      fetchCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('logout', handleLogout);
    window.addEventListener('login', handleLogin);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('login', handleLogin);
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

  const handleOpenEditNotesDialog = (item: CartItem) => {
    setEditingItemId(item.id);
    setEditingNotes(item.notes || '');
    setShowEditNotesDialog(true);
  };

  const handleUpdateItemNotes = async () => {
    if (!editingItemId) return;

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `http://localhost:8000/api/cart/items/${editingItemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          },
          body: JSON.stringify({ notes: editingNotes || null })
        }
      );

      if (!response.ok) {
        toast.error('Gagal mengupdate catatan');
        return;
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Catatan berhasil diperbarui');
        setShowEditNotesDialog(false);
        setEditingItemId(null);
        setEditingNotes('');
        await fetchCart();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat mengupdate catatan');
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

  const handleCheckoutSubmit = async () => {
    try {
      setIsCheckingOut(true);
      const token = localStorage.getItem('auth_token');

      const cartsWithItems = carts.filter(
        (cart) => cart.items.length > 0
      );

      if (cartsWithItems.length === 0) {
        toast.error('Keranjang Anda kosong');
        setIsCheckingOut(false);
        return;
      }

      console.log('🛒 Submitting checkout...');
      console.log('Carts with items:', cartsWithItems.length);
      console.log('Checkout notes:', checkoutNotes);

      const response = await fetch(
        'http://localhost:8000/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          },
          body: JSON.stringify({
            notes: checkoutNotes || ''
          })
        }
      );

      const data = await response.json();
      console.log('📦 Checkout response:', data);

      if (!response.ok) {
        console.error('❌ Backend error:', data);
        throw new Error(data.message || 'Failed to create order');
      }

      if (data.success) {
        toast.success('Pesanan berhasil dibuat!');

        await fetch('http://localhost:8000/api/cart/clear', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        });

        setCarts([]);
        setShowCheckoutDialog(false);
        setCheckoutNotes('');
        setSheetOpen(false);

        console.log('📍 Navigating to order:', data.data.id);
        router.push(`/checkout/${data.data.id}`);
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal membuat pesanan'
      );
    } finally {
      setIsCheckingOut(false);
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
          <Button
            size="icon"
            variant="outline"
            className="relative hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && totalCartItems > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {totalCartItems}
              </span>
            ) : null}
          </Button>
        </SheetTrigger>
        <SheetContent className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-slate-900 sm:w-96">
          <SheetHeader className="flex-shrink-0 border-b border-slate-200 pb-4 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
              <SheetTitle className="text-xl">Keranjang</SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {mounted ? (
              cartsWithItems.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center">
                  <div className="mb-4 text-5xl">🛒</div>
                  <p className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    Keranjang Kosong
                  </p>
                  <p className="mb-6 px-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    Mulai tambahkan menu favorit Anda
                  </p>
                  <SheetClose asChild>
                    <Link
                      href="/areas"
                      className={buttonVariants({
                        variant: 'default',
                        size: 'sm',
                        className:
                          'bg-emerald-600 hover:bg-emerald-700'
                      })}
                    >
                      Lihat Menu
                    </Link>
                  </SheetClose>
                </div>
              ) : (
                <div className="flex h-full flex-1 flex-col overflow-hidden">
                  <ScrollArea className="flex-1">
                    <div className="space-y-6 px-4 py-4 pb-32">
                      {cartsWithItems.map((cart) => (
                        <div key={cart.id} className="space-y-4">
                          {/* Restaurant Header */}
                          <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-emerald-800/10">
                            <h4 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">
                              {cart.restaurant?.name ||
                                `Restaurant ${cart.restaurant_id}`}
                            </h4>
                            {cart.restaurant?.address && (
                              <p className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                                <MapPin className="h-3 w-3" />
                                {cart.restaurant.address}
                              </p>
                            )}
                            {/* Restaurant Total Items */}
                            <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                              {cart.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                              )}{' '}
                              item
                            </p>
                          </div>

                          {/* Items */}
                          <div className="space-y-3">
                            {cart.items.map((item) => (
                              <div key={item.id} className="group">
                                <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50">
                                  {/* Header: Name and Delete Button */}
                                  <div className="flex items-start justify-between gap-3">
                                    <h3 className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold text-slate-900 dark:text-white">
                                      {item.menu.name}
                                    </h3>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      disabled={isUpdating}
                                      className="h-6 w-6 flex-shrink-0 text-slate-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                      onClick={() =>
                                        handleRemoveItem(item.id)
                                      }
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  {/* Notes Section with Edit Button */}
                                  <div className="space-y-2">
                                    {item.notes ? (
                                      <div className="flex items-start gap-2">
                                        <div className="max-h-20 flex-1 overflow-y-auto overflow-x-hidden rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-slate-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-slate-400">
                                          <p className="whitespace-pre-wrap break-all">
                                            <span className="font-medium">
                                              💬
                                            </span>{' '}
                                            {item.notes}
                                          </p>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          disabled={isUpdating}
                                          className="h-6 w-6 flex-shrink-0 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                                          onClick={() =>
                                            handleOpenEditNotesDialog(
                                              item
                                            )
                                          }
                                        >
                                          <Edit2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-full border-slate-300 text-xs dark:border-slate-600"
                                        disabled={isUpdating}
                                        onClick={() =>
                                          handleOpenEditNotesDialog(
                                            item
                                          )
                                        }
                                      >
                                        <Edit2 className="mr-1 h-3 w-3" />
                                        Tambah Catatan
                                      </Button>
                                    )}
                                  </div>

                                  {/* Price */}
                                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                    Rp{' '}
                                    {parseFloat(
                                      item.menu.price
                                    ).toLocaleString('id-ID')}
                                  </p>

                                  {/* Quantity Controls */}
                                  <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900">
                                    <Button
                                      disabled={
                                        item.quantity === 1 ||
                                        isUpdating
                                      }
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      }
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="flex-1 text-center text-sm font-bold text-slate-900 dark:text-white">
                                      Jumlah: {item.quantity}
                                    </span>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                      disabled={isUpdating}
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  {/* Subtotal */}
                                  <div className="border-t border-slate-200 pt-2 text-right text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                                    Subtotal: Rp{' '}
                                    {(
                                      parseFloat(item.price) *
                                      item.quantity
                                    ).toLocaleString('id-ID')}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Footer - Sticky */}
                  <div className="shrink-0 space-y-4 border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="space-y-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Subtotal
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          Rp {totalCartPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          Rp {totalCartPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Button
                        type="button"
                        onClick={() => setShowClearConfirm(true)}
                        disabled={isUpdating}
                        className="h-10 w-full rounded-lg border border-red-200 bg-red-50 font-medium text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Semua
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowCheckoutDialog(true)}
                        className="h-10 w-full rounded-lg bg-emerald-600 font-medium text-white transition-colors hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-50"
                        disabled={isUpdating}
                      >
                        Checkout
                      </Button>
                    </div>
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

      {/* Clear Cart Confirmation Modal */}
      <AlertDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
      >
        <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Kosongkan Keranjang?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-slate-600 dark:text-slate-400">
              Semua item akan dihapus dari keranjang. Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-6 rounded-lg border-l-4 border-l-red-600 bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              ⚠️ Peringatan: Semua pesanan akan dihapus permanen
            </p>
          </div>
          <AlertDialogCancel className="rounded-lg border-slate-300 dark:border-slate-700">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClearCart}
            disabled={isUpdating}
            className="rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {isUpdating ? '⏳ Menghapus...' : '🗑️ Hapus Semua'}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Notes Dialog */}
      <Dialog
        open={showEditNotesDialog}
        onOpenChange={setShowEditNotesDialog}
      >
        <DialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Edit Catatan Item
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600 dark:text-slate-400">
              Ubah catatan untuk pesanan ini
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <textarea
              placeholder="Contoh: Pedas, Tidak pakai sambal, Extra, dll..."
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              className="min-h-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-emerald-400"
              maxLength={200}
            />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {editingNotes.length} / 200 karakter
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditNotesDialog(false);
                setEditingItemId(null);
                setEditingNotes('');
              }}
              disabled={isUpdating}
              className="rounded-lg border-slate-300 dark:border-slate-600"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleUpdateItemNotes}
              disabled={isUpdating}
              className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isUpdating ? '⏳ Menyimpan...' : '✓ Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checkout Notes Dialog */}
      <Dialog
        open={showCheckoutDialog}
        onOpenChange={setShowCheckoutDialog}
      >
        <DialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Catatan Pesanan
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600 dark:text-slate-400">
              Tambahkan catatan atau instruksi khusus untuk pesanan
              Anda (opsional)
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <textarea
              placeholder="Contoh: Antar sebelum jam 12 siang, dll..."
              value={checkoutNotes}
              onChange={(e) => setCheckoutNotes(e.target.value)}
              className="min-h-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-emerald-400"
              maxLength={500}
            />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {checkoutNotes.length} / 500 karakter
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCheckoutDialog(false);
                setCheckoutNotes('');
              }}
              disabled={isCheckingOut}
              className="rounded-lg border-slate-300 dark:border-slate-600"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleCheckoutSubmit}
              disabled={isCheckingOut}
              className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isCheckingOut
                ? '⏳ Memproses...'
                : '✓ Lanjut ke Checkout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartComponent;
