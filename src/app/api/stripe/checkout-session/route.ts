import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: session.user.email!,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Premium Access',
          },
          unit_amount: 1699,
        },
        quantity: 1,
      },
    ],
    success_url: `${req.nextUrl.origin}/success`,
    cancel_url: `${req.nextUrl.origin}/cancel`,
    metadata: {
      userId: session.user.id,
    },
  });
  

  return NextResponse.json({ url: checkoutSession.url });
}
