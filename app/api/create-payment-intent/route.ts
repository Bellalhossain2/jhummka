import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
   
    let items: any[] = []
    if (body.items && Array.isArray(body.items)) {
      items = body.items
    } else if (body.price) {
      items = [{ name: body.name || 'Product', price: body.price, quantity: 1 }]
    } else {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const SHIPPING_CENTS = 500 // $5 shipping only!

    const line_items = items.map((item: any) => {
      let price = Number(item.price)
      if (isNaN(price) || price <= 0) price = 2 // fallback
      return {
        price_data: {
          currency: 'usd',
          product_data: { name: item.name || 'JhummkaTok Product' },
          unit_amount: Math.round(price * 100),
        },
        quantity: Number(item.quantity) || 1,
      }
    })

    // Calculate subtotal to check free shipping
    const subtotalCents = line_items.reduce((sum: number, li: any) => sum + li.price_data.unit_amount * li.quantity, 0)
   
    // FREE shipping if order >= $20 (2000 cents)
    const shippingCents = subtotalCents >= 2000 ? 0 : SHIPPING_CENTS

    if (shippingCents > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping & Handling' },
          unit_amount: shippingCents,
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'https://jhummkatok.com/success',
      cancel_url: 'https://jhummkatok.com/',
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
} 
