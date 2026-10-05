import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { items } = await req.json()
 
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map((item:any) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: 1
    })),
    success_url: 'https://jhummka.vercel.app/success',
    cancel_url: 'https://jhummka.vercel.app/cancel',
  })
  return Response.json({ url: session.url })
} 
