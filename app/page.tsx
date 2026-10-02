"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export default function Home(){
const [products,setProducts]=useState<any[]>([])
const [filter,setFilter]=useState("ALL")
const [search,setSearch]=useState("")

useEffect(()=>{
  const load=async()=>{
   const q=query(collection(db,"products"),orderBy("createdAt","desc"))
   const snap=await getDocs(q)
   setProducts(snap.docs.map(d=>({id:d.id,...d.data() as any})))
  }
  load()
},[])

const cats=["ALL","jhumkas","electronics","jewelry","dress","home","beauty","fashion","toys"]

const filtered = products.filter(p=>{
  const matchCat = filter==="ALL" || p.category?.toLowerCase()===filter.toLowerCase()
  const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
  return matchCat && matchSearch
})

function buy(p:any){
  window.location.href=`/checkout?id=${p.id}&name=${encodeURIComponent(p.name)}&price=${p.price}&image=${encodeURIComponent(p.image||"")}&cat=${p.category}`
}

return(
  <div className="min-h-screen bg-white text-black">
   {/* HEADER */}
   <div className="bg-black text-white p-3 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto flex items-center gap-4">
     <h1 className="text-yellow-400 font-black text-xl">JHUMMKA BAZAAR</h1>
     <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Jhumka..." className="flex-1 bg-white text-black px-3 py-1 rounded-full text-sm max-w-md" />
     <a href="/admin" className="text-xs text-gray-400">Admin</a>
    </div>
    {/* CATEGORIES */}
    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
     {cats.map(c=>(
      <button key={c} onClick={()=>setFilter(c)} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${filter===c?"bg-yellow-400 text-black":"bg-white/20 text-white"}`}>{c.toUpperCase()}</button>
     ))}
    </div>
   </div>

   {/* GRID */}
   <div className="max-w-7xl mx-auto p-4">
    <div className="text-sm text-gray-500 mb-3">{filtered.length} products {filter!=="ALL"&&`in ${filter}`}</div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
     {filtered.map(p=>(
      <div key={p.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
       <img src={p.image} className="w-full h-56 object-cover bg-purple-100" />
       <div className="p-2">
        <div className="font-bold text-sm truncate">{p.name}</div>
        <div className="text-xs text-gray-500">{p.category}</div>
        <div className="font-black text-yellow-600 mt-1">${p.price}</div>
        <button onClick={()=>buy(p)} className="bg-black text-yellow-400 font-black w-full py-2 rounded-full mt-2 text-xs">Shop Now</button>
       </div>
      </div>
     ))}
    </div>
    {filtered.length===0 && <div className="text-center py-20 text-gray-400">No products in {filter}. Add in /admin</div>}
   </div>
  </div>
)
} 
