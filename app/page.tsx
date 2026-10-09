"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { useCart } from "@/components/cart-provider"

const CATS=["ALL","JHUMKAS","JEWELRY","ELECTRONICS","BEAUTY","FASHION","BARBER","TOYS","HOME","HOUSEHOLD","DRESS","KIDS","BAGS","SPORTS","BOOKS","GROCERY","KITCHEN"]

export default function ShopPage(){
  const [products,setProducts]=useState<any[]>([])
  const [filter,setFilter]=useState("ALL")
  const [search,setSearch]=useState("")
  const [loading,setLoading]=useState(true)
  const [buyingId,setBuyingId]=useState<string|null>(null)
  const { addItem, openCart } = useCart()

  useEffect(()=>{
    const load=async()=>{
      try{
        const q=query(collection(db,"products"),orderBy("createdAt","desc"))
        const snap=await getDocs(q)
        setProducts(snap.docs.map(d=>({id:d.id, ...d.data() as any})))
      }catch{}
      setLoading(false)
    }
    load()
  },[])

  async function buyNow(p:any){
    setBuyingId(p.id)
    try{
      const res = await fetch("/api/create-payment-intent",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ items:[{ name:p.name, price:Number(p.price), quantity:1 }] })
      })
      const data = await res.json()
      if(data.url) window.location.href = data.url
      else { alert(data.error); setBuyingId(null) }
    }catch{ setBuyingId(null) }
  }

  function handleAdd(p:any){
    addItem({ id:p.id, name:p.name, price:Number(p.price), image:p.image } as any)
    openCart()
  }

  const filtered=products.filter(p=>{
    const c=(p.category||"").toLowerCase()
    const f=filter.toLowerCase()
    const matchCat=filter==="ALL"||c===f
    const matchQ=p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat&&matchQ
  })

  if(loading) return <div style={{padding:50,textAlign:"center"}}>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-black text-white p-2 sticky top-0 z-20 flex gap-2">
        <div className="font-black">jhummka<span className="text-yellow-400">Tok</span></div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" className="flex-1 px-3 py-1 rounded text-black text-sm"/>
      </div>
      <div className="bg-white p-2 flex gap-2 overflow-auto">
        {CATS.map(c=><button key={c} onClick={()=>setFilter(c)} className={`px-3 py-1 rounded-full text-xs border ${filter===c?'bg-black text-white':''}`}>{c}</button>)}
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-2 p-2">
        {filtered.map((p:any)=>{
          const price=Number(p.price)
          return (
            <div key={p.id} className="bg-white rounded border overflow-hidden">
              <img src={p.image} className="w-full h-40 object-cover"/>
              <div className="p-2">
                <div className="text-xs h-8 overflow-hidden">{p.name}</div>
                <div className="font-bold">${price} <span className="text-xs line-through text-gray-400">${(price*1.7).toFixed(1)}</span></div>
                <div className="flex gap-1 mt-2">
                  <button onClick={()=>handleAdd(p)} className="flex-1 bg-black text-white text-xs py-2 rounded-full">Add to Cart</button>
                  <button onClick={()=>buyNow(p)} className="flex-1 bg-yellow-400 text-black text-xs py-2 rounded-full font-black">{buyingId===p.id?"...":"Buy Now"}</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 
