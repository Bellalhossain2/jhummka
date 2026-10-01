"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function CheckoutContent(){
const id = useSearchParams().get('id')
const [p, setP] = useState<any>(null)

useEffect(()=>{
  const all = JSON.parse(localStorage.getItem('jhummka_products') || '[]')
  const found = all.find((x:any)=> String(x.id) === String(id))
  if(found) setP(found)
  else setP({name: "Jhumka Product", price: "5", image: ""})
},[id])

return(
  <div className="min-h-screen bg-black text-white p-4">
   <h1 className="text-yellow-400 font-black text-2xl">JHUMMKA BAZAAR - Checkout</h1>
   <div className="bg-white text-black p-4 rounded max-w-md mx-auto mt-6">
    <div className="font-bold text-pink-700 text-lg">{p?.name}</div>
    <div className="text-yellow-600 font-bold text-xl">${p?.price}</div>
    {p?.image && <img src={p.image} className="w-full h-64 object-cover rounded mt-2" />}
    <input placeholder="Your Name" className="w-full border p-3 rounded mt-4" />
    <input placeholder="Phone" className="w-full border p-3 rounded mt-2" />
    <input placeholder="Address" className="w-full border p-3 rounded mt-2" />
    <button onClick={()=>alert('Order Received! COD')} className="bg-yellow-400 text-black font-bold w-full py-3 rounded-full mt-4">
     PLACE ORDER - CASH ON DELIVERY
    </button>
    <button onClick={()=>window.location.href='/'} className="w-full mt-2 text-sm">Back</button>
   </div>
  </div>
)
}

export default function Checkout(){
return <Suspense fallback={<div className="bg-black text-white p-10">Loading...</div>}>
  <CheckoutContent/>
</Suspense>
} 