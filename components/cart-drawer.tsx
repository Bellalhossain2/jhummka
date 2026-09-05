"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/products"

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    updateQuantity,
    removeItem,
    count,
  } = useCart()

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!isOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[61] flex h-[100dvh] w-full max-w-[420px] flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <h2 className="font-serif text-xl tracking-wide">
            Cart <span className="text-muted-foreground">({count})</span>
          </h2>
          <button
            aria-label="Close cart"
            onClick={closeCart}
            className="text-muted-foreground transition-colors hover:text-gold"
          >
            <X className="size-5" />
          </button>
        </header>

        {items.length === 0? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/50" strokeWidth={1} />
            <p className="font-serif text-2xl font-light text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Discover jhumkas worthy of an heirloom.
            </p>
            <button
              onClick={closeCart}
              className="mt-2 border border-gold/40 px-8 py-3 text-xs uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-black"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="flex flex-col divide-y divide-border/60">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-5">
                    <div className="relative size-24 shrink-0 overflow-hidden border border-border/60 bg-background">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-[15px] leading-tight">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                      <div className="mt-auto flex items-center gap-3">
                        <div className="flex items-center border border-border/60">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-muted"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-muted"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-border/60 bg-muted/30 px-6 py-6">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-widest text-muted-foreground">Subtotal</span>
                <span className="font-serif text-lg">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Shipping calculated at checkout</p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-5 flex w-full items-center justify-center bg-gold px-6 py-4 text-xs uppercase tracking-[0.3em] text-black transition-colors hover:bg-[#d4a017]"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="mt-3 w-full py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
