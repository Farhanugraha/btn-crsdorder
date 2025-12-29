import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import prisma from '../../../../prisma/client';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2023-10-16',
  typescript: true
});

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  const endpointSecret = `${process.env.STRIPE_SIGNATURE_SECRET}`;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );
    // console.log(event)
    if (event.type === 'checkout.session.completed') {
      const orderId = event?.data?.object?.metadata?.orderId;
      const isPaid = event?.data?.object?.payment_status === 'paid';
      if (isPaid) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paid: true
          }
        });
      }
    }

    return NextResponse.json(
      {
        message: event
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Webhook error: ${error}`
      },
      { status: 500 }
    );
  }
}
