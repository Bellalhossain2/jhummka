"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"

const CATS=["ALL","JHUMKAS","JEWELRY","ELECTRONICS","BEAUTY","FASHION","BARBER","TOYS","HOME","HOUSEHOLD","DRESS","COSMETICS","OFFICE","PETS","MUSICAL","FOOD","BOOKS","KITCHEN","HEALTH","AUTOMOTIVE","GROCERY","KIDS","MEN","WOMEN","BAGS"]

export default function ShopPage(){
  const [products,setProducts]=useState<any[]>([])
  const [filter,setFilter]=useState("ALL")
  const [q,setQ]=useState("")
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const load=async()=>{
      try{
        const qq=query(collection(db,"products"),orderBy("createdAt","desc"))
        const snap=await getDocs(qq)
        const data=snap.docs.map(d=>({id:d.id,...d.data() as any}))
        setProducts(data)
      }catch(e){console.log(e)}
      setLoading(false)
    }
    load()
  },[])

  function buy(p:any){
    const url=`/checkout?name=${encodeURIComponent(p.name)}&price=${p.price}&id=${p.id}&img=${encodeURIComponent(p.image||"")}`
    window.location.href=url
  }

  const filtered=products.filter(p=>{
    const c=(p.category||"").toLowerCase()
    const f=filter.toLowerCase()
    const matchCat=filter==="ALL"||c===f||(f==="jhumkas"&&(c==="jhumkas"||c==="jewelry"))||(f==="jewelry"&&(c==="jewelry"||c==="jhumkas"))
    const matchQ=p.name.toLowerCase().includes(q.toLowerCase())
    return matchCat&&matchQ
  })

  return(
    <div className="min-h-screen bg-[#f2f2f2]">
      <div className="bg-[#131921] text-white p-2 sticky top-0 z-20 flex gap-2 items-center">
        <div className="font-black text-lg">jhummka<span className="text-[#febd69]">Tok</span></div>
        <div className="flex-1 flex bg-white rounded overflow-hidden">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search JhummkaTok - all items" className="flex-1 px-3 py-2 text-black text-sm outline-none"/>
          <button className="bg-[#febd69] px-4 text-black font-bold">🔍</button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#ff6a00] to-[#ffbf00] text-black text-center py-1.5 text-xs font-bold">🎉 FREE SHIPPING $20+ | ⚡ Temu Style Flash -80% OFF | {products.length} Products Live</div>

      <div className="bg-white border-b p-2 flex gap-2 overflow-auto whitespace-nowrap sticky top-[48px] z-10">
        {CATS.map(c=><button key={c} onClick={()=>setFilter(c)} className={`px-3 py-1 rounded-full text-[11px] font-bold border ${filter===c?'bg-black text-white border-black':'bg-[#ffbf00] border-[#ffbf00] text-black'}`}>{c}</button>)}
      </div>

      {loading?<div className="p-10 text-center">Loading products from Admin...</div>:
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
        {filtered.length===0?<div className="col-span-5 p-10 text-center bg-white rounded">No products in {filter}. Add in /admin</div>:
        filtered.map((p)=>
          <div key={p.id} className="bg-white rounded-lg border hover:shadow-lg overflow-hidden">
            <div className="h-[160px] bg-[#f5e6ff] relative">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover"/>
              <div className="absolute top-1 left-1 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">-42%</div>
              <div className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs">♡</div>
              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] px-1 rounded">{p.category}</div>
            </div>
            <div className="p-2">
              <div className="text-[12px] line-clamp-2 h-[30px] leading-tight">{p.name}</div>
              <div className="text-[11px] text-[#ff8 
