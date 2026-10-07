"use client"
import { useState } from "react"

const products = [
  { id: 1, name: "Golden Jhumka", title: "Golden Jhumka", price: 25, cat: "Gold" },
  { id: 2, name: "Silver Jhumka", title: "Silver Jhumka", price: 22, cat: "Silver" },
  { id: 3, name: "Bridal Jhumka", title: "Bridal Jhumka", price: 45, cat: "Bridal" },
  { id: 4, name: "Oxidised Jhumka", title: "Oxidised Jhumka", price: 20, cat: "Oxidised" },
]

export default function Home() {
  const [filter, setFilter] = useState("All")

  function buy(p:any){
    const name = encodeURIComponent(p.name || p.title || "Jhumka")
    const price = p.price || 20
    window.location.href='/checkout?name='+name+'&price='+price+'&id='+p.id
  }

  const cats = ["All", "Gold", "Silver", "Bridal", "Oxidised"]
  const filtered = filter==="All" ? products : products.filter(x=>x.cat===filter)

  return(
    <div className="min-h-screen bg-white text-black">
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold">JhummkaTok</h1>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 justify-center">
          {cats.map((c)=>
            <button key={c} onClick={()=>setFilter(c)} className={'px-3 py-1 rounded-full text-xs font-bold '+(filter===c?'bg-black text-white':'bg-gray-200')}>
              {c}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {filtered.map((p)=>
            <div key={p.id} className="border p-3 rounded">
              <div className="font-bold">{p.name}</div>
              <div>${p.price}</div>
              <button onClick={()=>buy(p)} className="mt-2 bg-black text-white px-3 py-1 rounded w-full">Buy Now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
