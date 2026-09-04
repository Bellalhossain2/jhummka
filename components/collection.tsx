"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { PRODUCTS, formatPrice } from "@/lib/products"
import { useCart } from "@/components/cart-provider"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export function Collection() {
  const { addItem } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    const cat = searchParams.get("category")
    if (cat) {
      setActiveCategory(cat)
    } else {
      setActiveCategory("All")
    }
  }, [searchParams])

  const categories = ["All",...Array.from(new Set(PRODUCTS.map((p: any) => p.category)))]

  const filtered = activeCategory === "All"
  ? PRODUCTS
    : PRODUCTS.filter((p: any) => p.category === activeCategory)

  const handleCategory = (cat: string) => {
    setActiveCategory(cat)
    if (cat === "All") {
      router.push(`/#collection`, { scroll: false })
    } else {
      router.push(`/?category=${cat}#collection`, { scroll: false })
    }
    setTimeout(() => {
      document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <section id="collection" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-gold">
            <span className="h-px w-8 bg-gold" />
            The Signature Edit
          </p>
          <h2 className="mt-5 max-w-lg text-balance font-serif text-4xl font-light leading-tight text-foreground md:text-5xl">
            Jhumkas worthy of an heirloom
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Six hand-finished pairs, each cast in solid gold and set by a single artisan from start to finish.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] border transition-all ${
              activeCategory === cat? "bg-black text-white border-black" : "border-black/20 hover:border-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product: any) => (
          <article
            key={product.id}
            className={`group relative overflow-hidden border border-border/60 bg-card ${product.span? "lg:col-span-2" : ""}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={() => addItem(product)}
                className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-[10px] uppercase tracking-widest opacity-60">{product.category}</p>
              <p className="mt-1 font-serif">{product.name}</p>
              <p className="mt-1 text-sm">{formatPrice(product.price)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
