import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
   
    // Support both formats: old {name,price} and new {items:[]}
    let items: any[] = []
    if (body.items && Array.isArray(body.items)) {
      items = body.items
    } else if (body.price) {
      // Old format
      items = [{ name: body.name || 'Product', price: body.price, quantity: 1 }]
    } else {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const SHIPPING_CENTS = 2500 // $25

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

    // Add shipping
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Shipping & Handling' },
        unit_amount: SHIPPING_CENTS,
      },
      quantity: 1,
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'https://jhummkatok.com/success',
      cancel_url: 'https://jhummkatok.com/',
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
} 
