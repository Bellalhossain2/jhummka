"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, Lock } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { formatPrice } from "@/lib/products"

const SHIPPING = 25

export function CheckoutClient() {
  const { items, subtotal, count, clearCart } = useCart()
  const { user, signInWithGoogle } = useAuth()
  const [placed, setPlaced] = useState(false)
  const [paidTotal, setPaidTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const total = subtotal + (items.length? SHIPPING : 0)

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total }),
      })
      const data = await res.json()
      if (data.url) {
        setPaidTotal(total)
        window.location.href = data.url
      } else {
        alert("Stripe error: " + (data.error || "Unknown"))
        setLoading(false)
      }
    } catch (err) {
      alert("Failed to create checkout")
      setLoading(false)
    }
  }

  if (placed) {
    return (
      <div className="min-h-[70vh] bg-background px-6 py-20 text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold/10">
            <Check className="size-8 text-gold" />
          </div>
          <h1 className="mt-6 font-serif text-4xl font-light">Order Placed</h1>
          <p className="mt-3 text-muted-foreground">
            Your heirloom jhumkas are being handcrafted. You will receive a confirmation shortly.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Shipping: $25 • Total paid: {formatPrice(paidTotal || total)}</p>
          <Link href="/" className="mt-8 inline-block bg-gold px-8 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-[#d4a017]">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-background px-6 py-20 text-center">
        <h1 className="font-serif text-3xl">Your cart is empty</h1>
        <Link href="/" className="mt-6 inline-block border border-gold/40 px-8 py-3 text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-black">Discover Jhumkas</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-8 lg:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3" /> Back to Shop
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl">Checkout</h1>

            {user && (
              <div className="mt-6 border border-border/60 bg-muted/30 p-4">
                <p className="text-sm">Returning? Sign in for faster checkout.</p>
                <button onClick={signInWithGoogle} className="mt-3 border border-gold/40 px-6 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-black">Sign In with Google</button>
              </div>
            )}

            {/* ORDER SUMMARY ONLY - NO CARD INPUTS! */}
            <div className="mt-8 space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <Image src={item.image} alt={item.name} width={80} height={80} className="rounded" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>$25</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>

            <form onSubmit={handlePlaceOrder} className="mt-8">
              <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/90">
                <Lock className="size-4" />
                {loading? "Redirecting to Secure Stripe Checkout..." : `Pay ${formatPrice(total)} with Stripe`}
              </button>
              <p className="mt-3 text-xs text-center text-muted-foreground">You will be redirected to Stripe's secure checkout (Apple Pay, Card, Klarna, Bank)</p>
            </form>
          </div>

          <div className="bg-muted/20 p-6 h-fit">
            <h3 className="font-serif text-xl">Secure Payment by Stripe</h3>
            <p className="mt-2 text-sm text-muted-foreground">Apple Pay • Link • Card • Bank • Klarna • Affirm</p>
          </div>
        </div>
      </div>
    </div>
  )
} 
