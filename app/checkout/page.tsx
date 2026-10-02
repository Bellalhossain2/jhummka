"use client"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
function CheckoutContent(){
const s=useSearchParams()
const name=s.get('name')||"Jhumka"
const price=s.get('price')||"25"
const image=s.get('image')||""
return(
  <div className="min-h-screen bg-black text-white p-4">
   <h1 className="text-yellow-400 font-black text-2xl">JHUMMKA BAZAAR - Checkout</h1>
   <div className="bg-white text-black p-4 rounded max-w-md mx-auto mt-6">
    <div className="font-bold text-pink-700 text-lg">{decodeURIComponent(name)}</div>
    <div className="text-yellow-600 font-bold text-xl">${price}</div>
    {image&&<img src={decodeURIComponent(image)} className="w-full h-64 object-cover rounded mt-2"/>}
    <input placeholder="Your Name" className="w-full border p-3 rounded mt-4"/>
    <input placeholder="Phone" className="w-full border p-3 rounded mt-2"/>
    <input placeholder="Address" className="w-full border p-3 rounded mt-2"/>
    <button onClick={()=>alert(`Order Received! ${decodeURIComponent(name)}`)} className="bg-yellow-400 text-black font-bold w-full py-3 rounded-full mt-4">PLACE ORDER - COD</button>
   </div>
  </div>
)
}
export default function Checkout(){return <Suspense fallback={<div className="p-10 bg-black text-white">Loading...</div>}><CheckoutContent/></Suspense>} 
