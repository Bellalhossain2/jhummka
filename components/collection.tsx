"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"
import { PRODUCTS, formatPrice } from "@/lib/products"
import { useCart } from "@/components/cart-provider"

const CATEGORIES = ["All", "Classic", "Bridal", "Temple", "Statement", "Minimal"]

export function Collection() {
  const { addItem } = useCart()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    const param = searchParams.get("category")
    if (param && CATEGORIES.includes(param)) {
      setActiveCategory(param)
    }
  }, [searchParams])

  const filteredProducts =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === activeCategory)

  return (
    <section id="collection" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-gold">
            <span className="h-px w-8 bg-gold" />
            The Signature Edit
          </p>
          <h2 className="mt-5 max-w-lg text-balance font-serif text-4xl font-light leading-tight text-foreground md:text-6xl">
            Jhumkas worthy of an heirloom
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Six hand-finished pairs, each cast in solid gold and set by a single artisan from start to finish.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <article
            key={product.id}
            className={`group relative overflow-hidden border border-border/60 bg-card ${
              product.span ? "lg:col-span-2" : ""
            }`}
          >
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[520px]">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
              <button
                aria-label={`Add ${product.name} to cart`}
                onClick={() => addItem(product)}
                className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-gold/40 bg-background/60 text-gold opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-primary-foreground group-hover:opacity-100"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                    {product.category}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-medium text-foreground">
                    {product.name}
                  </h3>
                </div>
                <p className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatPrice(product.price)}
                </p>
              </div>
              <button
                onClick={() => addItem(product)}
                className="w-full border border-gold/40 bg-background/40 py-3 text-[11px] uppercase tracking-[0.25em] text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-primary-foreground"
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
