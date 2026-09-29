"use client"
import Image from "next/image"
import { Plus } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export function Collection() {
  const { addItem } = useCart()
  const [activeCategory, setActiveCategory] = useState("All")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"))
        const snap = await getDocs(q)
        const firebaseProducts = snap.docs.map(d => {
          const data = d.data() as any
          return {
            id: d.id,
            name: data.name,
            price: Number(data.price),
            image: data.image,
            category: data.category || "Jhumkas",
            description: data.description || ""
          }
        })
        setProducts(firebaseProducts)
      } catch (e) {
        console.log("Firebase error", e)
      }
      setLoading(false)
    }
    load()

    if (typeof window!== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const cat = params.get("category")
      if (cat) setActiveCategory(cat)
    }
  }, [])

  const allCats = products.map((p) => p.category)
  const uniqueCats = Array.from(new Set(allCats))
  const categories = ["All",...uniqueCats]

  const filtered = activeCategory === "All"? products : products.filter((p) => p.category === activeCategory)

  const handleCategory = (cat: string) => {
    setActiveCategory(cat)
    if (typeof window!== "undefined") {
      if (cat === "All") {
        window.history.pushState(null, "", "/#collection")
      } else {
        window.history.pushState(null, "", `/?category=${cat}#collection`)
      }
    }
  }

  return (
    <section id="collection" className="py-20 px-6 bg-[#0a0a0a]">
      <div className="max-w-[1300px] mx-auto">
        <h2 className="text-center tracking-[5px] text-[24px] text-white">THE COLLECTION</h2>
        <p className="text-center text-[#666] tracking-[3px] text-[11px] mt-3 mb-10">HAND-FORGED • LIVE FROM ATELIER</p>

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-6 py-2 text-[11px] tracking-[2px] border transition-all ${activeCategory === cat? "bg-white text-black border-white" : "bg-transparent text-[#888] border-[#333] hover:border-[#666] hover:text-white"}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-[#444]">Loading jewels...</p>}
        {!loading && products.length === 0 && <p className="text-center text-[#444]">No jewels yet. Add from /admin page</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <div key={p.id} className="bg-[#151515] border border-[#222] group overflow-hidden">
              <div className="h-[380px] overflow-hidden bg-black relative">
                <Image src={p.image} alt={p.name} width={400} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <h3 className="m-0 text-white text-[14px] tracking-[1px] font-light">{p.name}</h3>
                <p className="text-[#C5A880] mt-2 mb-4 font-bold">₹{p.price.toLocaleString("en-IN")}</p>
                <div className="flex gap-2">
                  <button onClick={() => addItem({ id: p.id, name: p.name, price: p.price, image: p.image })} className="flex-1 bg-white text-black text-center py-3 text-[11px] tracking-[2px] font-bold flex items-center justify-center gap-2 hover:bg-[#E6C15A] transition-colors">
                    <Plus size={14} /> ADD TO CART
                  </button>
                  <a href={`https://wa.me/919000000000?text=Hi Jhummka! I want ${encodeURIComponent(p.name)} - Rs ${p.price}`} target="_blank" className="px-4 py-3 border border-[#333] text-[#888] text-[11px] hover:text-white hover:border-white">WHATSAPP</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 
