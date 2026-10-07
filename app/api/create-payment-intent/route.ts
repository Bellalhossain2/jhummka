import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
})

export async function POST(req: NextRequest) {
  try {
    const { name, price } = await req.json()
    const amount = Math.round(Number(price) * 100)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: name || 'Jhummka Product' },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://jhummkatok.com/success',
      cancel_url: 'https://jhummkatok.com/checkout',
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
} 
