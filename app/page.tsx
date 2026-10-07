"use client"
import { useState } from "react"
const products=[
{name:"Gold Jhumka",price:25,cat:"jewelry",img:"https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400",sold:"2k+ sold"},
{name:"DOVE Soap 4-Pack",price:13,cat:"beauty",img:"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400",sold:"5k+ sold"},
{name:"AXE Perfume",price:8,cat:"fashion",img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",sold:"1k+ sold"},
{name:"Mobile Stand",price:10,cat:"electronics",img:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",sold:"3k+ sold"},
{name:"Power Bank",price:89,cat:"electronics",img:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",sold:"800 sold"},
{name:"Hair Cutter",price:18,cat:"barber",img:"https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400",sold:"1.2k sold"},
{name:"Bridal Jhumka",price:45,cat:"jewelry",img:"https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=400",sold:"900 sold"},
{name:"Toy Car",price:12,cat:"toys",img:"https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400",sold:"4k sold"},
]
const cats=["ALL","JEWELRY","ELECTRONICS","BEAUTY","FASHION","BARBER","TOYS","HOME"]
export default function Page(){
const [filter,setFilter]=useState("ALL")
const [q,setQ]=useState("")
function buy(p:any){
window.location.href='/checkout?name='+encodeURIComponent(p.name)+'&price='+p.price
}
const list=products.filter(p=>{
const mCat=filter==="ALL"||p.cat===filter.toLowerCase()||(filter==="JEWELRY"&&p.name.includes("Jhumka"))
const mQ=p.name.toLowerCase().includes(q.toLowerCase())
return mCat&&mQ
})
return(
<div className="min-h-screen bg-[#f5f5f5]">
<div className="bg-[#131921] text-white p-2 sticky top-0 z-20 flex items-center gap-2">
<div className="font-black">jhummka<span className="text-[#febd69]">Tok</span></div>
<div className="flex-1 flex bg-white rounded overflow-hidden"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search JhummkaTok" className="flex-1 px-2 py-1.5 text-black text-sm outline-none"/><button className="bg-[#febd69] px-3 text-black">🔍</button></div>
</div>
<div className="bg-[#ffbf00] text-center text-[11px] font-bold py-1">FREE SHIPPING $20+ | Flash Deals -80% OFF</div>
<div className="bg-white p-2 flex gap-2 overflow-auto border-b sticky top-[40px] z-10">
{cats.map(c=><button key={c} onClick={()=>setFilter(c)} className={`px-3 py-1 rounded-full text-[11px] font-bold border ${filter===c?'bg-black text-white':'bg-[#ffbf00] text-black'}`}>{c}</button>)}
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 max-w-[1400px] mx-auto">
{list.map((p,i)=><div key={i} className="bg-white rounded border p-2">
<div className="h-[120px] bg-gray-100 overflow-hidden rounded"><img src={p.img} className="w-full h-full object-cover"/></div>
<div className="text-[12px] mt-1 h-[28px]">{p.name}</div>
<div className="text-[11px] text-orange-500">★★★★★ <span className="text-gray-400">{p.sold}</span></div>
<div className="font-black">${p.price} <span className="text-gray-400 line-through text-[10px]">${(p.price*1.8).toFixed(0)}</span></div>
<div className="text-[9px] text-green-600 font-bold">✓ Free Shipping</div>
<button onClick={()=>buy(p)} className="w-full mt-2 bg-[#ffbf00] py-1.5 rounded-full text-xs font-black">Buy Now</button>
</div>)}
</div>
</div>
)
} 
