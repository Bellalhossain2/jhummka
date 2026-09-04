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
    const syncFromURL = () => {
      const params = new URLSearchParams(window.location.search)
      const param = params.get("category") || searchParams.get("category")
      if (param && CATEGORIES.includes(param)) {
        setActiveCategory(param)
      }
    }
    syncFromURL()
    const interval = setInterval(syncFromURL, 500)
    window.addEventListener("popstate", syncFromURL)
    return () => {
      clearInterval(interval)
      window.removeEventListener("popstate", syncFromURL)
    }
  }, [searchParams])

  const filteredProducts =
    activeCategory === "All"
     ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === activeCategory)

  return (
    <section id="collection" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="mb-12 flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat)
              const url = cat === "All"? "/#collection" : `/?category=${cat}#collection`
              window.history.pushState({}, "", url)
            }}
            className={`rounded-full border px-6 py-2 text-sm uppercase tracking-widest transition ${
              activeCategory === cat? "bg-black text-white border-black" : "bg-white text-black border-black/20 hover:border-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
              <button
                onClick={() => addItem(product)}
                className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-lg">{product.name}</h3>
              <p className="text-sm text-neutral-600">{formatPrice(product.price)}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">{product.category}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
