'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  CheckCircle,
  Loader2,
  Minus,
  Plus,
  X,
  XCircle
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import noImageUrl from '../../../public/no-image.png';
import { cn, formatPrice } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { orderFormSchema } from '@/lib/validation/orderFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { useSearchParams } from 'next/navigation';

type formType = z.infer<typeof orderFormSchema>;

const deliveryFee = 2;

const formattedDeliveryFee = formatPrice(deliveryFee, {
  currency: 'EUR',
  notation: 'compact'
});

const Checkout = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
  } = useCartStore();

  const searchParams = useSearchParams();

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const orderId = searchParams.get('orderId');

  const form = useForm<formType>({
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
  }, []);

  useEffect(() => {
    if (mounted && success === 'true') {
      clearCart();
    }
  }, [mounted, success]);

  useEffect(() => {
    if (status !== 'loading' && status === 'authenticated') {
      form.setValue('username', session?.user.username);
      form.setValue('email', session?.user.email!);
      form.setValue('street', session?.user.street || '');
      form.setValue('city', session?.user.city || '');
      form.setValue('phone', session?.user.phone || '');
    }
  }, [status]);

  const totalCartPrice = cart.reduce((total, item) => {
    const itemPrice = item.menu.price * item.quantity;
    return total + itemPrice;
  }, 0);

  const formattedTotalCartPrice = formatPrice(
    totalCartPrice + deliveryFee,
    {
      currency: 'EUR',
      notation: 'compact'
    }
  );

  const onSubmit = async (data: z.infer<typeof orderFormSchema>) => {
    const toastId = toast.loading('Preparing your oder...');
    try {
      setSubmitting(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart,
          userId: session?.user.id,
          customerName: data.username,
          email: data.email,
          street: data.street,
          city: data.city,
          phone: data.phone
        })
      });

      const body: { stripeSessionUrl: string } =
        await response.json();

      if (response.ok) {
        setSubmitting(false);
        toast.success('Redirecting to payment', {
          id: toastId
        });
        window.location.href = `${body.stripeSessionUrl}`;
      } else {
        setSubmitting(false);
        const body = await response.json();
        if (body.message) {
          toast.error(body.message);
        } else {
          toast.error('An unexpected error occurred', {
            id: toastId
          });
        }
      }
    } catch (error) {
      setSubmitting(false);
      toast.error('An unexpected error is occured', {
        id: toastId
      });
    }
  };

  if (status === 'loading') {
    return (
      <div className="m-auto my-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col gap-3">
      {success === 'true' || canceled === 'true' ? (
        <div className="my-5 flex flex-grow flex-col items-center justify-center gap-20">
          {success === 'true' && (
            <>
              <div>
                <p className="mt-3 p-1 text-center text-3xl">
                  Thank you for your order. Menu will be at you soon.
                </p>
                <p className="mt-3 p-1 text-center text-xl">
                  Order ID:{' '}
                  <span className="text-muted-foreground">
                    {orderId}
                  </span>
                </p>
              </div>
              <CheckCircle className="h-40 w-40 text-green-600" />
            </>
          )}
          {canceled === 'true' && (
            <>
              <p className="mt-3 p-1 text-center text-3xl">
                Something went wrong during payment. Please try again.
              </p>
              <XCircle className="h-40 w-40 text-red-600" />
            </>
          )}
        </div>
      ) : cart.length === 0 ? (
        <div className="spaxe-y-1 flex flex-col items-center justify-center">
          <p className="m-auto my-5 text-lg">Cart is empty</p>
          <Link
            href="/menu"
            className={buttonVariants({
              variant: 'link',
              size: 'sm',
              className: 'text-sm text-muted-foreground'
            })}
          >
            Add menu to your cart before checkout
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:gap-10">
          <div className="my-5">
            <ScrollArea className={cn({ 'h-96': cart.length > 3 })}>
              <div className="space-y-2">
                {cart.map((item, index) => (
                  <div key={item.menu.id + index}>
                    <div className="flex flex-row items-center justify-between gap-3">
                      <div className="flex flex-row items-center gap-2">
                        {item.menu.images.length === 0 ? (
                          <div className="hidden h-[100px] flex-col justify-center p-1 sm:flex">
                            <Image
                              src={noImageUrl}
                              alt="No image"
                              width="100"
                              height="100"
                              placeholder="blur"
                              blurDataURL={`${noImageUrl}`}
                              loading="lazy"
                              className="rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="hidden h-[100px] flex-col justify-center p-1 sm:flex">
                            <Image
                              src={`${item.menu.images[0].url}`}
                              alt={item.menu.images[0].id}
                              width="100"
                              height="100"
                              placeholder="blur"
                              blurDataURL={`${item.menu.images[0].url}`}
                              loading="lazy"
                              className="rounded-md"
                            />
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="w-40 md:w-60">
                            <h1 className="line-clamp-1">
                              {item.menu.name}
                            </h1>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.size}
                          </div>
                          <span className="text-sky-400">
                            {formatPrice(item.menu.price, {
                              currency: 'EUR',
                              notation: 'compact'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-3">
                        <div className="flex flex-row items-center gap-1">
                          {success !== 'true' && (
                            <Button
                              disabled={
                                isSubmitting || item.quantity === 1
                                  ? true
                                  : false
                              }
                              type="button"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  decreaseQuantity(
                                    item.menu.id,
                                    item.size
                                  );
                                }
                              }}
                            >
                              <Minus className="h-5 w-5" />
                            </Button>
                          )}
                          <span
                            className={cn('w-8 text-center', {
                              'w-12': success === 'true'
                            })}
                          >
                            Qty {item.quantity}
                          </span>
                          {success !== 'true' && (
                            <Button
                              disabled={isSubmitting}
                              type="button"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                increaseQuantity(
                                  item.menu.id,
                                  item.size
                                )
                              }
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                        {success !== 'true' && (
                          <div className="flex items-center justify-center">
                            <Button
                              disabled={isSubmitting}
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="mr-2 h-7 w-7"
                              onClick={() =>
                                removeFromCart(
                                  item.menu.id,
                                  item.size
                                )
                              }
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div>
              <div className="mb-2 mt-4 flex flex-row justify-end gap-2">
                <div>Delivery:</div>
                <span>{formattedDeliveryFee}</span>
              </div>
              <div className="mb-10 flex flex-row justify-end gap-2">
                <div>Total:</div>
                <span> {formattedTotalCartPrice}</span>
              </div>
            </div>
          </div>
          {session?.user ? (
            <div className="flex flex-col">
              <h1 className="text-top my-5 text-center text-2xl font-bold md:text-start">
                Order Informations
              </h1>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mx-auto mb-8 flex max-w-md flex-col gap-3"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="username"
                            disabled={
                              isSubmitting || success === 'true'
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="example@email.com"
                            disabled={
                              isSubmitting || success === 'true'
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="street"
                            disabled={
                              isSubmitting || success === 'true'
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="city"
                            disabled={
                              isSubmitting || success === 'true'
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="+4859657"
                            disabled={
                              isSubmitting || success === 'true'
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {success !== 'true' && (
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="flex w-28 gap-1 text-right"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Pay
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          ) : (
            <div className="mb-10 mt-5 text-center">
              Please
              <Link
                href="/auth/login?redirect=checkout"
                className={cn(
                  buttonVariants({ variant: 'link', size: 'sm' }),
                  'p-1'
                )}
              >
                log in
              </Link>
              before you will be redirected to payment!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout;
