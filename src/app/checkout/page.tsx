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
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import noImageUrl from '../../../public/no-image.png';
import { cn, formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { orderFormSchema } from '@/lib/validation/orderFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type FormType = z.infer<typeof orderFormSchema>;

/* =========================
   MOCK CONFIG (BYPASS)
========================= */
const MOCK_LOGIN = true;
const deliveryFee = 2;

const MOCK_USER = {
  id: 'demo-user',
  username: 'Demo User',
  email: 'demo@email.com',
  street: 'Demo Street',
  city: 'Demo City',
  phone: '08123456789'
};

const fieldLabels: Record<keyof FormType, string> = {
  username: 'Username',
  email: 'Email',
  street: 'Street',
  city: 'City',
  phone: 'Phone'
};

const Checkout = () => {
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

  const formattedTotalCartPrice = formatPrice(
    totalCartPrice + deliveryFee,
    { currency: 'EUR', notation: 'compact' }
  );

  const formattedDeliveryFee = formatPrice(deliveryFee, {
    currency: 'EUR',
    notation: 'compact'
  });

  const onSubmit = async () => {
    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success('Checkout success (mock)');
    clearCart();

    setSubmitting(false);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-grow flex-col gap-3">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="my-5 text-lg">Cart is empty</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:gap-10">
          {/* CART */}
          <div className="my-5">
            <ScrollArea className={cn({ 'h-96': cart.length > 3 })}>
              <div className="space-y-2">
                {cart.map((item, index) => (
                  <div key={item.menu.id + index}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src={
                            item.menu.images.length
                              ? item.menu.images[0].url
                              : noImageUrl
                          }
                          alt="menu"
                          width={100}
                          height={100}
                          className="hidden rounded-md sm:block"
                        />
                        <div>
                          <h1 className="line-clamp-1 w-40 md:w-60">
                            {item.menu.name}
                          </h1>
                          <span className="text-sm text-muted-foreground">
                            {item.size}
                          </span>
                          <div className="text-sky-400">
                            {formatPrice(item.menu.price, {
                              currency: 'EUR'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          disabled={item.quantity === 1}
                          onClick={() =>
                            decreaseQuantity(item.menu.id, item.size)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span>Qty {item.quantity}</span>

                        <Button
                          size="icon"
                          onClick={() =>
                            increaseQuantity(item.menu.id, item.size)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            removeFromCart(item.menu.id, item.size)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 text-right">
              <p>Delivery: {formattedDeliveryFee}</p>
              <p className="font-semibold">
                Total: {formattedTotalCartPrice}
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="flex flex-col">
            <h1 className="my-5 text-2xl font-bold">
              Order Information
            </h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex max-w-md flex-col gap-3"
              >
                {(
                  Object.keys(fieldLabels) as Array<keyof FormType>
                ).map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fieldLabels[fieldName]}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="w-28"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Pay
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
