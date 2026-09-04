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
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-gold/20 bg-card shadow-2xl transition-transform duration-400 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="size-[18px] text-gold" />
            <h2 className="text-xs uppercase tracking-[0.3em] text-foreground">
              Your Cart{count > 0 ? ` (${count})` : ""}
            </h2>
          </div>
          <button
            aria-label="Close cart"
            onClick={closeCart}
            className="text-muted-foreground transition-colors hover:text-gold"
          >
            <X className="size-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/50" strokeWidth={1} />
            <p className="font-serif text-2xl font-light text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Discover jhumkas worthy of an heirloom.
            </p>
            <button
              onClick={closeCart}
              className="mt-2 border border-gold/40 px-8 py-3 text-xs uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
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
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                            {item.category}
                          </p>
                          <h3 className="mt-1 font-serif text-lg font-medium leading-tight text-foreground">
                            {item.name}
                          </h3>
                        </div>
                        <button
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground transition-colors hover:text-gold"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border/60">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-gold"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-8 text-center text-sm text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-gold"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <p className="text-sm text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-border/60 px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-serif text-2xl font-medium text-gold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Shipping and duties calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-5 flex items-center justify-center bg-gold px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                Proceed to checkout
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
