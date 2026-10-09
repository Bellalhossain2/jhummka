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
  const { addToCart } = useCart()

  useEffect(()=>{
    const load=async()=>{
      try{
        const q=query(collection(db,"products"),orderBy("createdAt","desc"))
        const snap=await getDocs(q)
        setProducts(snap.docs.map(d=>({id:d.id, ...d.data() as any})))
      }catch(e){}
      setLoading(false)
    }
    load()
  },[])

  // Buy Now - Direct to Stripe with REAL price
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
      else { alert("Error: "+data.error); setBuyingId(null) }
    }catch(e){ alert("Failed"); setBuyingId(null) }
  }

  const filtered=products.filter(p=>{
    const c=(p.category||"").toLowerCase()
    const f=filter.toLowerCase()
    const matchCat=filter==="ALL"||c===f||(f==="jhumkas"&&(c==="jhumkas"||c==="jewelry"))||(f==="jewelry"&&(c==="jewelry"||c==="jhumkas"))
    const matchQ=p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat&&matchQ
  })

  if(loading) return <div style={{padding:50,textAlign:"center"}}>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-black text-white p-2 sticky top-0 z-20 flex gap-2 items-center">
        <div className="font-black text-lg">jhummka<span className="text-yellow-400">Tok</span></div>
        <div className="flex-1 flex bg-white rounded overflow-hidden">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search JhummkaTok" className="flex-1 px-3 py-2 text-black text-sm outline-none"/>
          <button className="bg-yellow-400 px-4 text-black font-bold">Search</button>
        </div>
      </div>
      <div className="bg-yellow-400 text-black text-center py-1.5 text-xs font-bold">FREE SHIPPING $20+ | Flash Deals 80% OFF | {products.length} Live Products</div>
      <div className="bg-white border-b p-2 flex gap-2 overflow-auto whitespace-nowrap sticky top-12 z-10">
        {CATS.map(c=><button key={c} onClick={()=>setFilter(c)} className={`px-3 py-1 rounded-full text-xs font-bold border ${filter===c?'bg-black text-white':'bg-white text-black'}`}>{c}</button>)}
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
        {filtered.map((p:any)=>{
          const price = Number(p.price)
          const original = (price * 1.7).toFixed(1)
          return (
            <div key={p.id} className="bg-white rounded-lg border overflow-hidden">
              <div className="h-40 bg-purple-100 relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover"/>
                <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-1 rounded">-42%</div>
              </div>
              <div className="p-2">
                <div className="text-xs h-8 overflow-hidden">{p.name}</div>
                <div className="text-xs text-orange-500 mt-1">★★★★★ <span className="text-gray-400">{p.category}</span></div>
                <div className="font-black mt-1">${price} <span className="text-xs line-through text-gray-400 ml-1">${original}</span></div>
                <div className="text-xs text-green-600">Free Shipping</div>
               
                {/* 2 BUTTONS - Add to Cart + Buy Now */}
                <div className="flex gap-1 mt-2">
                  <button onClick={()=>{addToCart(p); alert("Added to Cart!")}} className="flex-1 bg-black text-white text-xs font-bold py-2 rounded-full">Add to Cart</button>
                  <button onClick={()=>buyNow(p)} disabled={buyingId===p.id} className="flex-1 bg-yellow-400 text-black text-xs font-black py-2 rounded-full">{buyingId===p.id?"...":"Buy Now"}</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 
