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
const cats=["All","jhumkas","electronics","jewelry","kids","home","household","dress","cosmetics","toys","fashion","barber","men","shorts","musical","beauty","office","women","books","grocery","sports"]
const filtered=products.filter(p=>{
  const mCat=cat==="All"||p.category?.toLowerCase()===cat.toLowerCase()
  const mSearch=p.name?.toLowerCase().includes(search.toLowerCase())
  return mCat&&mSearch
})
return(
  <div className="min-h-screen bg-black">
   <header className="sticky top-0 z-50 bg-black text-white p-3">
    <div className="max-w-7xl mx-auto flex gap-3 items-center">
     <h1 className="font-black text-xl text-yellow-400">JHUMMKA BAZAAR</h1>
     <div className="flex-1 flex">
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search car camera, tv, jhumka..." className="w-full p-2.5 rounded-l-full text-black bg-white outline-none" />
      <button className="bg-yellow-400 text-black px-6 rounded-r-full font-bold">Search</button>
     </div>
     <a href="/admin" className="bg-white text-black px-3 py-1 rounded text-sm">Admin</a>
    </div>
   </header>
   <div className="max-w-7xl mx-auto p-3 flex gap-2 overflow-auto">
    {cats.map(c=>(
     <button key={c} onClick={()=>setCat(c)} className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${cat===c?'bg-black text-white':'bg-yellow-400 text-black'}`}>{c.toUpperCase()}</button>
    ))}
   </div>
   <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 p-3">
    {filtered.map((p:any)=>(
     <div key={p.id} className="bg-white p-3 rounded">
      <img src={p.image} className="w-full h-40 object-cover rounded" />
      <div className="font-bold mt-2 text-pink-700 text-[16px]">{p.name}</div>
      <div className="text-yellow-600">${p.price}</div>
      <div className="text-xs text-gray-500">{p.category}</div>
       <button onClick={()=>window.location.href=`/checkout?id=${p.id}&name=${encodeURIComponent(p.name)}&price=${p.price}&image=${encodeURIComponent(p.image||'')}`} className="bg-yellow-400 text-black font-bold w-full py-2 rounded-full mt-2 text-sm">Shop Now</button>
       ))}
   </div>
  </div>
)
} 
