'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import noImageUrl from '../../../../../../public/no-image.png';
import { cn, formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import Loading from '@/components/Loading';
import { useSession } from 'next-auth/react';
import { ExtendedOrder } from '@/types/order';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

const deliveryFee = 2;

const formattedDeliveryFee = formatPrice(deliveryFee, {
  currency: 'EUR',
  notation: 'compact'
});

type OrderProps = {
  orderItem: ExtendedOrder;
};

const OrderId = ({ params }: { params: { orderId: string } }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<ExtendedOrder>();
  const [isError, setIsError] = useState(false);

  const { orderId } = params;

  const { status, data: session } = useSession();

  const calcTotalPrice = () => {
    const totalCartPrice = order!.cartItems.reduce((total, item) => {
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

    return formattedTotalCartPrice;
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/user/${session?.user.id}/orders/${orderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          cache: 'no-cache'
        }
      );

      if (response.ok) {
        const data: OrderProps = await response.json();
        setOrder(data.orderItem);
      } else {
        setIsError(true);
        toast.error('An unexpected error occurred');
      }
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      toast.error('An unexpected error is occured');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (status === 'loading' || isLoading) {
    return (
      <div className="m-auto my-20">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      {isError ? (
        <p className="m-auto my-10 text-center text-lg">
          OrderId:{' '}
          <span className="text-muted-foreground">{orderId}</span>{' '}
          does not exist!
        </p>
      ) : (
        <div className="mt-5 flex flex-row gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex h-8 w-8 items-center justify-center">
                <Link
                  href={`/user/${order?.userId}/orders`}
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
                      size: 'icon'
                    }),
                    'h-6 w-6'
                  )}
                >
                  <ArrowLeft />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to oders</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="space-y-3">
            <div className="flex h-12 flex-row items-center gap-3 md:h-8">
              <h1 className="text-font flex flex-col items-start gap-1 md:flex-row md:items-center">
                Order Id:
                <span className="text-muted-foreground">
                  {orderId}
                </span>
              </h1>
              <div
                className={cn(
                  'h-7 w-20 rounded-sm p-1 text-center text-sm text-white',
                  {
                    'bg-red-600': !order?.paid,
                    'bg-green-600': order?.paid
                  }
                )}
              >
                {order?.paid ? 'Paid' : 'Not Paid'}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col md:flex-row md:gap-10">
                <div className="mb-5">
                  <ScrollArea
                    className={cn({
                      'h-96': order?.cartItems.length! > 3
                    })}
                  >
                    <div className="mr-3 space-y-2">
                      {order?.cartItems.map((item, index) => (
                        <div key={item.id}>
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
                                    currency: 'IDR',
                                    notation: 'compact'
                                  })}
                                </span>
                              </div>
                            </div>
                            <span className="w-12 text-center">
                              Qty {item.quantity}
                            </span>
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
                      <span> {calcTotalPrice()}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-5 flex flex-col">
                  <h1 className="text-top mb-5 text-2xl font-bold">
                    Order Informations
                  </h1>
                  <div className="flex flex-row gap-2">
                    <div className="w-16 space-y-3">
                      <div>Name</div>
                      <div>Email</div>
                      <div>Street</div>
                      <div>City</div>
                      <div>Phone</div>
                    </div>
                    <div className="space-y-3">
                      <div className="font-bold">
                        {order?.customerName}
                      </div>
                      <div className="font-bold">{order?.email}</div>
                      <div className="font-bold">{order?.street}</div>
                      <div className="font-bold">{order?.city}</div>
                      <div className="font-bold">{order?.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderId;
