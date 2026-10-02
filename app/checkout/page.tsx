"use client"
import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

function CheckoutContent(){
const s=useSearchParams()
const id=s.get('id')||""
const [p,setP]=useState<any>(null)
const [cust,setCust]=useState({name:"",phone:"",address:""})

useEffect(()=>{
  const load=async()=>{
   if(!id) return
   const snap=await getDoc(doc(db,"products",id))
   if(snap.exists()) setP({id:snap.id,...snap.data()})
  }
  load()
},[id])

function order(){
  if(!cust.name||!cust.phone||!cust.address){ alert("Fill all fields"); return }
  const msg=`NEW ORDER%0AProduct: ${p.name}%0APrice: $${p.price}%0ACat: ${p.category}%0A%0ACustomer: ${cust.name}%0APhone: ${cust.phone}%0AAddress: ${cust.address}`
  window.open(`https://wa.me/17163282102?text=${msg}`,"_blank")
  alert("Order Placed!")
}

if(!p) return <div className="min-h-screen bg-black text-white p-10">Loading {id}...</div>

return(
  <div className="min-h-screen bg-black text-white p-4">
   <a href="/" className="text-yellow-400">{"<- Back"}</a>
   <div className="max-w-md mx-auto bg-white text-black rounded-xl p-4 mt-6">
    <img src={p.image} className="w-full h-80 object-cover rounded-lg"/>
    <div className="font-black text-lg mt-3">{p.name}</div>
    <div className="text-sm text-gray-500">{p.category}</div>
    <div className="text-2xl font-black text-yellow-600">${p.price}</div>
    <div className="border-t mt-4 pt-4">
     <input value={cust.name} onChange={e=>setCust({...cust,name:e.target.value})} placeholder="Full Name" className="w-full border p-3 rounded mb-2"/>
     <input value={cust.phone} onChange={e=>setCust({...cust,phone:e.target.value})} placeholder="Phone" className="w-full border p-3 rounded mb-2"/>
     <textarea value={cust.address} onChange={e=>setCust({...cust,address:e.target.value})} placeholder="Address" className="w-full border p-3 rounded mb-3 min-h-[80px]"/>
     <button onClick={order} className="bg-yellow-400 text-black font-black w-full py-4 rounded-full">PLACE ORDER - COD</button>
    </div>
   </div>
  </div>
)
}
export default function Checkout(){return <Suspense fallback={<div className="p-10 bg-black text-white">Loading...</div>}><CheckoutContent/></Suspense>} 
