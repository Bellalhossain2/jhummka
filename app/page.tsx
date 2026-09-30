"use client"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function Page(){
  const [products,setProducts]=useState<any[]>([])
  const [search,setSearch]=useState("")
  const [cat,setCat]=useState("All")
  useEffect(()=>{
    getDocs(collection(db,"products")).then(s=>setProducts(s.docs.map(d=>({id:d.id,...d.data()}))))
  },[])
  const cats=["All","electronics","jewelry","car","home","jhumkas"]
  const filtered=products.filter(p=>{
    const mCat=cat==="All"||p.category?.toLowerCase()===cat.toLowerCase()
    const mSearch=p.name?.toLowerCase().includes(search.toLowerCase())
    return mCat&&mSearch
  })
  return(
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="sticky top-0 z-50 bg-black text-white p-3">
        <div className="max-w-7xl mx-auto flex gap-3 items-center">
          <h1 className="font-black text-xl text-yellow-400">JHUMMKA BAZAAR</h1>
          <div className="flex-1 flex">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search car camera, tv, jhumka..." className="w-full p-2.5 rounded-l-full text-black bg-white outline-none"/>
            <button className="bg-yellow-400 text-black px-6 rounded-r-full font-bold">Search</button>
          </div>
          <a href="/admin" className="bg-white text-black px-3 py-1 rounded text-sm">Admin</a>
        </div>
        <div className="max-w-7xl mx-auto flex gap-2 mt-3 overflow-x-auto">
          {cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap font-bold ${cat===c?"bg-yellow-400 text-black":"bg-white/20 text-white"}`}>{c.toUpperCase()}</button>)}
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map(p=>(
          <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
            <img src={p.imageUrl||p.image} alt={p.name} className="w-full h-48 object-cover bg-gray-100"/>
            <div className="p-2.5">
              <h3 className="text-sm font-medium line-clamp-2 h-10">{p.name}</h3>
              <p className="text-[11px] text-gray-500">{p.category}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-black text-lg">${p.price}</span>
                <button className="bg-black text-white text-xs px-3 py-1.5 rounded-full">+ Add</button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
} 
