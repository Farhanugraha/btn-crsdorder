'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus, X, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { cn, formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { orderFormSchema } from '@/lib/validation/orderFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

type FormType = z.infer<typeof orderFormSchema>;

/* =========================
   MOCK CONFIG (BYPASS)
========================= */
const MOCK_LOGIN = true;
const deliveryFee = 25000;

const MOCK_USER = {
  id: 'demo-user',
  username: 'John Doe',
  email: 'john@example.com',
  street: 'Jl. Merdeka No. 123',
  city: 'Jakarta',
  phone: '08123456789'
};

const fieldLabels: Record<keyof FormType, string> = {
  username: 'Nama Lengkap',
  email: 'Email',
  street: 'Alamat Jalan',
  city: 'Kota',
  phone: 'Nomor Telepon'
};

const CheckoutPage = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
  } = useCartStore();

  const form = useForm<FormType>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      username: '',
      email: '',
      street: '',
      city: '',
      phone: ''
    }
  });

  useEffect(() => {
    setMounted(true);

    if (MOCK_LOGIN) {
      form.setValue('username', MOCK_USER.username);
      form.setValue('email', MOCK_USER.email);
      form.setValue('street', MOCK_USER.street);
      form.setValue('city', MOCK_USER.city);
      form.setValue('phone', MOCK_USER.phone);
    }
  }, [form]);

  const totalCartPrice = cart.reduce((total, item) => {
    return total + item.menu.price * item.quantity;
  }, 0);

  const grandTotal = totalCartPrice + deliveryFee;

  const formattedTotalCartPrice = formatPrice(totalCartPrice, {
    currency: 'IDR',
    notation: 'compact'
  });

  const formattedDeliveryFee = formatPrice(deliveryFee, {
    currency: 'IDR',
    notation: 'compact'
  });

  const formattedGrandTotal = formatPrice(grandTotal, {
    currency: 'IDR',
    notation: 'compact'
  });

  const onSubmit = async (data: FormType) => {
    setSubmitting(true);

    console.log('Order submitted:', {
      ...data,
      items: cart,
      total: grandTotal
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Pesanan berhasil dibuat!');
    clearCart();

    setSubmitting(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-4">
            <Link
              href="/menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              Checkout
            </h1>
          </div>
          <p className="text-muted-foreground">
            Selesaikan pemesanan Anda
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-8 text-lg text-muted-foreground">
                Keranjang kosong
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Kembali ke Menu
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Order Summary */}
              <div className="order-2 lg:order-1 lg:col-span-2">
                <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-foreground">
                    Informasi Pengiriman
                  </h2>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      {(
                        Object.keys(fieldLabels) as Array<
                          keyof FormType
                        >
                      ).map((fieldName) => (
                        <FormField
                          key={fieldName}
                          control={form.control}
                          name={fieldName}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">
                                {fieldLabels[fieldName]}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={isSubmitting}
                                  className="border-border focus:ring-2 focus:ring-primary"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}

                      {/* Submit Buttons */}
                      <div className="flex gap-3 border-t border-border pt-6">
                        <Link
                          href="/menu"
                          className="inline-flex flex-1 items-center justify-center rounded-md border border-input bg-background px-4 py-2 hover:bg-accent"
                        >
                          Batal
                        </Link>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          size="lg"
                          className="flex-1"
                        >
                          {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {isSubmitting
                            ? 'Memproses...'
                            : 'Konfirmasi Pesanan'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>

              {/* Order Details */}
              <div className="order-1 lg:order-2 lg:col-span-1">
                <div className="sticky top-20 rounded-lg border border-border bg-card p-6 shadow-lg">
                  <h2 className="mb-4 text-xl font-bold text-foreground">
                    Ringkasan Pesanan
                  </h2>

                  <ScrollArea
                    className={cn({ 'h-80': cart.length > 3 })}
                  >
                    <div className="space-y-3 pr-4">
                      {cart.map((item, index) => (
                        <div key={item.menu.id + index}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="line-clamp-1 font-semibold text-foreground">
                                {item.menu.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {item.size}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                x{item.quantity}
                              </p>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={item.quantity === 1}
                                onClick={() =>
                                  decreaseQuantity(
                                    item.menu.id,
                                    item.size
                                  )
                                }
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  increaseQuantity(
                                    item.menu.id,
                                    item.size
                                  )
                                }
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  removeFromCart(
                                    item.menu.id,
                                    item.size
                                  )
                                }
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="mt-2 text-right">
                            <p className="text-sm font-semibold text-primary">
                              {formatPrice(
                                item.menu.price * item.quantity,
                                {
                                  currency: 'IDR',
                                  notation: 'compact'
                                }
                              )}
                            </p>
                          </div>

                          <Separator className="mt-3" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Price Summary */}
                  <div className="mt-6 space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal
                      </span>
                      <span className="font-semibold">
                        {formattedTotalCartPrice}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Ongkos Kirim
                      </span>
                      <span className="font-semibold">
                        {formattedDeliveryFee}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-foreground">
                        Total
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {formattedGrandTotal}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-6 rounded-lg bg-muted p-4">
                    <p className="text-xs text-muted-foreground">
                      💡 Pesanan akan diproses setelah konfirmasi.
                      Anda akan menerima notifikasi via email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
