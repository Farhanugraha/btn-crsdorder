import prisma from '../../../../prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OrderSchema } from '@/types/order';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2023-10-16',
  typescript: true
});

export async function POST(req: NextRequest) {
  try {
    const body: OrderSchema = await req.json();
    const { cart, userId, customerName, email, street, city, phone } =
      body;

    const newOrder = await prisma.order.create({
      data: {
        paid: false,
        cartItems: {
          create: cart.map((item) => ({
            menu: { connect: { id: item.menu.id } },
            size: item.size,
            quantity: item.quantity
          }))
        },
        user: { connect: { id: userId } },
        customerName: customerName,
        email: email,
        street: street,
        city: city,
        phone: phone
      }
    });

    const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      [];

    cart.forEach((item) => {
      stripeLineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: 'EUR',
          product_data: {
            name: item.menu.name,
            description: item.size,
            metadata: {
              size: item.size
            }
          },
          unit_amount: item.menu.price * 100
        }
      });
    });

    const stripeSession = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Delivery fee',
            type: 'fixed_amount',
            fixed_amount: {
              amount: 2 * 100,
              currency: 'EUR'
            }
          }
        }
      ],
      metadata: {
        userId: userId,
        orderId: newOrder.id
      },
      success_url: `${process.env.NEXT_SERVER_URL}/checkout?orderId=${newOrder.id}&success=true`,
      cancel_url: `${process.env.NEXT_SERVER_URL}/checkout?orderId=${newOrder.id}&canceled=true`
    });

    return NextResponse.json(
      {
        stripeSessionUrl: stripeSession.url,
        message: 'Order created'
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error
      },
      { status: 500 }
    );
  }
}
