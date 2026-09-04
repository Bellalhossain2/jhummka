"use client"

import { useState } from "react"
import { Menu, Search, ShoppingBag, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { AccountMenu } from "@/components/account-menu"

const NAV = [
  { label: "Jhumkas", href: "/?category=All#collection" },
  { label: "Necklaces", href: "/?category=Temple#collection" },
  { label: "Bridal", href: "/?category=Bridal#collection" },
  { label: "Heritage", href: "#craft" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { count, openCart } = useCart()

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <nav className="hidden flex-1 items-center gap-8 md:flex">
          {NAV.slice(0, 2).map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#top" className="flex flex-col items-center leading-none">
          <span className="font-serif text-2xl font-semibold tracking-[0.2em] text-gold md:text-3xl">
            JHUMMKA
          </span>
          <span className="mt-1 text-[9px] uppercase tracking-[0.45em] text-muted-foreground">
            Fine Gold Atelier
          </span>
        </a>

        <div className="hidden flex-1 items-center justify-end gap-6 md:flex">
          {NAV.slice(2).map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
          <div className="flex items-center gap-5 text-foreground">
            <button aria-label="Search" className="transition-colors hover:text-gold">
              <Search className="size-[18px]" />
            </button>
            <AccountMenu />
            <button
              aria-label="Cart"
              onClick={openCart}
              className="relative transition-colors hover:text-gold"
            >
              <ShoppingBag className="size-[18px]" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-primary-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <AccountMenu compact />
          <button
            aria-label="Cart"
            onClick={openCart}
            className="relative text-foreground"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-primary-foreground">
                {count}
              </span>
            )}
          </button>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="text-foreground"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background px-5 py-4 md:hidden">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
