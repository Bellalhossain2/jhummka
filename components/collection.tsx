"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { useCart } from "./cart-provider"
import { supabase } from "@/lib/supabase"

const categories = ["all", "jhumkas", "necklaces", "bridal", "heritage"]

export function Collection() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false })
      if (data) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filtered = activeCategory === "all"? products : products.filter((p) => p.category === activeCategory)

  return (
    <section className="bg-black py-20 px-6">
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 text-[11px] tracking-[2px] border ${activeCategory === cat? "bg-white text-black border-white" : "bg-transparent text-[#888] border-[#333]"}`}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-[#444]">Loading jewels...</p>}
      <p className="text-center text-[#888] text-[11px] mb-4">{products.length} pieces</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((p) => (
          <div key={p.id} className="bg-[#151515] border border-[#222] group overflow-hidden">
            <div className="h-[380px] overflow-hidden bg-black">
              <Image src={p.image} alt={p.name} width={400} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-5">
              <h3 className="text-white text-[14px] tracking-[1px] font-light">{p.name}</h3>
              <p className="text-[#C5A880] mt-2 mb-4 font-bold">{"$" + p.price.toLocaleString("en-US")}</p>
              <div className="flex gap-2">
                <button onClick={() => addItem({ id: p.id, name: p.name, price: p.price, image: p.image })} className="flex-1 bg-white text-black py-3 text-[11px] tracking-[2px] font-bold flex items-center justify-center gap-1">
                  <Plus size={14} /> ADD TO CART
                </button>
                <a href={`https://wa.me/919000000000?text=Hi Jhummka! I want ${encodeURIComponent(p.name)} - ${p.price}`} target="_blank" className="px-4 py-3 border border-[#333] text-[#888] text-[11px]">WHATSAPP</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 
