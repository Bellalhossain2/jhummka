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

  const total = subtotal + (items.length? SHIPPING : 0)

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    setPaidTotal(total)
    console.log("[v0] Placing order for", count, "items, total", total)
    setPlaced(true)
    setTimeout(() => clearCart(), 100)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
          <Link
            href="/"
            className="mt-8 inline-block bg-gold px-8 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-[#d4a017]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-background px-6 py-20 text-center">
        <h1 className="font-serif text-3xl">Your cart is empty</h1>
        <Link href="/" className="mt-6 inline-block border border-gold/40 px-8 py-3 text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-black">
          Discover Jhumkas
        </Link>
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

            {!user && (
              <div className="mt-6 border border-border/60 bg-muted/30 p-4">
                <p className="text-sm">Returning? Sign in for faster checkout.</p>
                <button onClick={signInWithGoogle} className="mt-3 border border-gold/40 px-6 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-black">
                  Sign in with Google
                </button>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="mt-8 space-y-8">
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em]">Shipping Information</h2>
                <div className="mt-4 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required placeholder="First Name" className="border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-gold/50" />
                    <input required placeholder="Last Name" className="border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-gold/50" />
                  </div>
                  <input required type="email" placeholder="Email Address" defaultValue={user?.email || ""} className="w-full border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-gold/50" />
                  <input required placeholder="Address" className="w-full border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-gold/50" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required placeholder="City" className="border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-gold/50" />
                    <input required placeholder="Postal Code" className="border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-gold/50" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xs uppercase tracking-[0.2em]">Payment</h2>
                <div className="mt-4 border border-border/60 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Lock className="size-4 text-gold" /> Secure payment • Cash on delivery available for heritage orders
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">This is a demo store. No real charge will be made. Your order will be confirmed via email.</p>
                </div>
              </div>

              <button type="submit" className="flex w-full items-center justify-center gap-2 bg-gold py-4 text-xs uppercase tracking-[0.3em] text-black transition-colors hover:bg-[#d4a017]">
                <Lock className="size-4" /> Place Order • {formatPrice(total)}
              </button>
            </form>
          </div>

          <div className="h-fit border border-border/60 bg-muted/20 p-6 lg:sticky lg:top-8">
            <h2 className="font-serif text-xl">Order Summary ({count})</h2>
            <div className="mt-6 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative size-20 shrink-0 overflow-hidden border border-border/60 bg-background">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" sizes="80px" />
                    <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-gold text-[10px] text-black">{item.quantity}</span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-serif text-[14px] leading-tight">{item.name}</p>
                    <p className="mt-auto text-xs text-muted-foreground">Qty {item.quantity} • {formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-border/60 pt-6 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatPrice(SHIPPING)}</span></div>
              <div className="flex justify-between border-t border-border/60 pt-3 font-serif text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
