"use client"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

function CheckoutContent(){
const s=useSearchParams()
const name=s.get('name')||"Jhumka"
const price=s.get('price')||"0"
const image=s.get('image')||""
const cat=s.get('cat')||""
const [cust,setCust]=useState({name:"",phone:"",address:""})

function order(){
  if(!cust.name||!cust.phone||!cust.address){ alert("Fill Name, Phone, Address"); return }
  const msg=`NEW ORDER - JHUMMKA BAZAAR%0AProduct: ${decodeURIComponent(name)}%0APrice: $${price}%0ACategory: ${cat}%0A%0ACustomer: ${cust.name}%0APhone: ${cust.phone}%0AAddress: ${cust.address}`
  window.open(`https://wa.me/17163282102?text=${msg}`,"_blank")
  alert(`Order Placed! ${decodeURIComponent(name)} - We will call you!`)
}

return(
  <div className="min-h-screen bg-black text-white p-4">
   <a href="/" className="text-yellow-400">{"<- Back to Shop"}</a>
   <div className="max-w-md mx-auto bg-white text-black rounded-xl p-4 mt-6">
    <img src={decodeURIComponent(image)} className="w-full h-72 object-cover rounded-lg bg-purple-100"/>
    <div className="font-black text-lg mt-3">{decodeURIComponent(name)}</div>
    <div className="text-sm text-gray-500">{cat}</div>
    <div className="text-2xl font-black text-yellow-600">${price}</div>
    <div className="border-t mt-4 pt-4">
     <input value={cust.name} onChange={e=>setCust({...cust,name:e.target.value})} placeholder="Your Full Name" className="w-full border p-3 rounded mb-2"/>
     <input value={cust.phone} onChange={e=>setCust({...cust,phone:e.target.value})} placeholder="Phone Number" className="w-full border p-3 rounded mb-2"/>
     <textarea value={cust.address} onChange={e=>setCust({...cust,address:e.target.value})} placeholder="Full Delivery Address" className="w-full border p-3 rounded mb-3 min-h-[80px]"/>
     <button onClick={order} className="bg-yellow-400 text-black font-black w-full py-4 rounded-full">PLACE ORDER - COD</button>
     <div className="text-xs text-center text-gray-500 mt-2">Cash on Delivery - Pay after receiving</div>
    </div>
   </div>
  </div>
)
}
export default function Checkout(){return <Suspense fallback={<div className="p-10 bg-black text-white">Loading...</div>}><CheckoutContent/></Suspense>} 
