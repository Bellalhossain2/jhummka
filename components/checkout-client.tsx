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

  const total = subtotal + (items.length ? SHIPPING : 0)

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    console.log("[v0] Placing order for", count, "items, total", total)
    setPlaced(true)
    clearCart()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (placed) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full border border-gold/40 text-gold">
          <Check className="size-7" />
        </span>
        <h1 className="mt-8 font-serif text-4xl font-light text-foreground md:text-5xl">
          Order confirmed
        </h1>
        <p className="mt-4 text-balance leading-relaxed text-muted-foreground">
          Thank you{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}. Your jhumkas are
          being hand-polished and prepared for dispatch. A confirmation has been sent to your inbox.
        </p>
        <Link
          href="/"
          className="mt-8 border border-gold/40 px-10 py-4 text-xs uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
        >
          Return home
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
        <h1 className="font-serif text-4xl font-light text-foreground md:text-5xl">
          Your cart is empty
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Add a pair of jhumkas to begin your order.
        </p>
        <Link
          href="/#collection"
          className="mt-8 border border-gold/40 px-10 py-4 text-xs uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
        >
          Browse the collection
        </Link>
      </div>
    )
  }

  return (
    <>
      <Link
        href="/#collection"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
      >
        <ArrowLeft className="size-4" />
        Continue shopping
      </Link>

      <h1 className="mt-6 font-serif text-5xl font-light text-foreground md:text-6xl">
        Checkout
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr]">
        {/* Details form */}
        <form onSubmit={handlePlaceOrder} className="flex flex-col gap-10">
          {!user && (
            <div className="flex flex-col items-start gap-3 border border-gold/20 bg-card p-6">
              <p className="text-sm text-muted-foreground">
                Sign in for faster checkout and to track your order.
              </p>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="text-xs uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
              >
                Sign in with Google
              </button>
            </div>
          )}

          <fieldset className="flex flex-col gap-5">
            <legend className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Contact & Shipping
            </legend>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="First name" name="firstName" defaultValue={user?.displayName?.split(" ")[0] ?? ""} required />
              <Field label="Last name" name="lastName" required />
            </div>
            <Field label="Email" name="email" type="email" defaultValue={user?.email ?? ""} required />
            <Field label="Address" name="address" required />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field label="City" name="city" required />
              <Field label="State" name="state" required />
              <Field label="ZIP" name="zip" required />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-5">
            <legend className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Payment
            </legend>
            <Field label="Card number" name="card" placeholder="4242 4242 4242 4242" required />
            <div className="grid grid-cols-2 gap-5">
              <Field label="Expiry" name="expiry" placeholder="MM / YY" required />
              <Field label="CVC" name="cvc" placeholder="123" required />
            </div>
          </fieldset>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gold px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Lock className="size-4" />
            Place order · {formatPrice(total)}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            This is a demo checkout — no payment is processed.
          </p>
        </form>

        {/* Order summary */}
        <aside className="h-fit border border-border/60 bg-card p-6 lg:sticky lg:top-28">
          <h2 className="text-xs uppercase tracking-[0.3em] text-foreground">
            Order Summary
          </h2>
          <ul className="mt-6 flex flex-col divide-y divide-border/60">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4">
                <div className="relative size-16 shrink-0 overflow-hidden border border-border/60 bg-background">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-primary-foreground">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div>
                    <p className="font-serif text-base font-medium leading-tight text-foreground">
                      {item.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                      {item.category}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2 border-t border-border/60 pt-6 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value={formatPrice(SHIPPING)} />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Total
            </span>
            <span className="font-serif text-2xl font-medium text-gold">
              {formatPrice(total)}
            </span>
          </div>
        </aside>
      </div>
    </>
  )
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  defaultValue?: string
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-gold"
      />
    </label>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}
