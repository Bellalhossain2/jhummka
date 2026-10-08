"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"

const CATS=["ALL","JHUMKAS","JEWELRY","ELECTRONICS","BEAUTY","FASHION","BARBER","TOYS","HOME","HOUSEHOLD","DRESS","KIDS","BAGS","SPORTS","BOOKS","GROCERY","KITCHEN"]

export default function ShopPage(){
  const [products,setProducts]=useState<any[]>([])
  const [filter,setFilter]=useState("ALL")
  const [search,setSearch]=useState("")
  const [loading,setLoading]=useState(true)
  const [buyingId,setBuyingId]=useState<string|null>(null)

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

  // NEW: Direct to Stripe with REAL price - no middle page!
  async function buy(p:any){
    setBuyingId(p.id)
    try{
      const res = await fetch("/api/create-payment-intent",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ items:[{ name:p.name, price:Number(p.price), quantity:1 }] })
      })
      const data = await res.json()
      if(data.url){
        window.location.href = data.url
      } else {
        alert("Stripe error: "+data.error)
        setBuyingId(null)
      }
    }catch(e){
      alert("Failed to checkout")
      setBuyingId(null)
    }
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
    <div style={{background:"#fff",minHeight:"100vh"}}>
      {/* Categories */}
      <div style={{background:"#FFC107",padding:"10px",display:"flex",gap:"8px",overflowX:"auto",whiteSpace:"nowrap",position:"sticky",top:0,zIndex:10}}>
        {CATS.map(cat=>(
          <button key={cat} onClick={()=>setFilter(cat)} style={{padding:"6px 14px",borderRadius:"20px",border:"none",background:filter===cat?"#000":"#fff",color:filter===cat?"#fff":"#000",fontWeight:"bold",fontSize:"12px",cursor:"pointer"}}>{cat}</button>
        ))}
      </div>

      <div style={{padding:"10px",background:"#f5f5f5",textAlign:"center",fontSize:"12px"}}>FREE SHIPPING $20+ | Flash Deals 80% OFF | {filtered.length} Live Products</div>

      {/* Product Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"10px",padding:"10px",maxWidth:"1400px",margin:"0 auto"}}>
        {filtered.map((p:any)=>{
          const salePrice = Number(p.price)
          const originalPrice = (salePrice / 0.58).toFixed(1) // FIXED: no more 151.299999...
          const totalWithShipping = (salePrice + 25).toFixed(0)
          return (
            <div key={p.id} style={{background:"#fff",borderRadius:"8px",overflow:"hidden",border:"1px solid #eee"}}>
              <div style={{position:"relative"}}>
                <img src={p.image} alt={p.name} style={{width:"100%",height:"180px",objectFit:"cover"}}/>
                <span style={{position:"absolute",top:"6px",left:"6px",background:"#ff0000",color:"#fff",padding:"2px 6px",borderRadius:"4px",fontSize:"11px"}}>-42%</span>
              </div>
              <div style={{padding:"8px"}}>
                <div style={{fontSize:"12px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>⭐⭐⭐⭐⭐ {p.name}</div>
                <div style={{marginTop:"4px"}}>
                  <span style={{fontWeight:"bold",fontSize:"14px"}}>${salePrice}</span>
                  <span style={{fontSize:"11px",color:"#888",textDecoration:"line-through",marginLeft:"6px"}}>${originalPrice}</span>
                </div>
                <div style={{fontSize:"10px",color:"green"}}>Free Shipping</div>
                <button onClick={()=>buy(p)} disabled={buyingId===p.id} style={{marginTop:"8px",width:"100%",background:"#FFC107",color:"#000",border:"none",padding:"10px",borderRadius:"20px",fontWeight:"bold",cursor:"pointer",fontSize:"13px"}}>
                  {buyingId===p.id ? "Going to Stripe..." : `Buy Now - $${totalWithShipping}`}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 
