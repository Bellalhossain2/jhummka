"use client"
import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"

function CheckoutContent(){
const s=useSearchParams()
const id=s.get('id')||""
const [p,setP]=useState<any>(null)
const [cust,setCust]=useState({name:"",phone:"",address:""})
const [done,setDone]=useState(false)
const [orderId,setOrderId]=useState("")

useEffect(()=>{
  if(!id) return
  getDoc(doc(db,"products",id)).then(snap=>{
   if(snap.exists()) setP({id:snap.id,...snap.data()})
  })
},[id])

const placeOrder = async()=>{
  if(!cust.name||!cust.phone||!cust.address){ alert("Fill all fields"); return }

  // 1. Save to Firebase orders collection
  try{
   const orderRef = await addDoc(collection(db,"orders"),{
    productId: p.id,
    productName: p.name,
    price: p.price,
    category: p.category,
    image: p.image,
    customerName: cust.name,
    customerPhone: cust.phone,
    customerAddress: cust.address,
    status: "new",
    createdAt: serverTimestamp()
   })
   setOrderId(orderRef.id)
  }catch(e){ console.log(e) }

  // 2. Try WhatsApp
  const msg=`NEW ORDER - JHUMMKA BAZAAR%0A%0AProduct: ${p.name}%0APrice: $${p.price}%0ACategory: ${p.category}%0A%0ACustomer: ${cust.name}%0APhone: ${cust.phone}%0AAddress: ${cust.address}`

  // For mobile, open whatsapp app directly
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if(isMobile){
   window.location.href=`whatsapp://send?phone=17163282102&text=${msg}`
   setTimeout(()=> window.open(`https://wa.me/17163282102?text=${msg}`,"_blank"), 500)
  } else {
   window.open(`https://wa.me/17163282102?text=${msg}`,"_blank")
  }
  setDone(true)
}

if(done){
  return(
   <div className="min-h-screen bg-white flex items-center justify-center p-6 text-black">
    <div className="text-center max-w-md">
     <div className="text-6xl">✅</div>
     <h1 className="text-3xl font-black mt-4">Order Placed!</h1>
     <p className="mt-3">Thank you <b>{cust.name}</b>!<br/>Your order for <b>{p?.name}</b> - ${p?.price} is confirmed.</p>
     <div className="bg-yellow-50 border p-3 rounded-lg mt-4 text-sm text-left">
      Order ID: {orderId.slice(0,8)}<br/>
      We will call you at {cust.phone}<br/>
      Delivery: {cust.address}
     </div>
     <p className="text-xs text-gray-500 mt-3">We also sent WhatsApp message. If not opened, we will contact you!</p>
     <a href="/" className="inline-block mt-6 bg-black text-yellow-400 font-black px-10 py-3 rounded-full">Continue Shopping</a>
    </div>
   </div>
  )
}

if(!p) return <div className="p-10 text-center">Loading...</div>

return(
  <div className="min-h-screen bg-[#f5f5f5] text-black">
   <div className="bg-black text-yellow-400 p-3 font-black">JHUMMKA BAZAAR - Checkout</div>
   <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 p-4">
    <div className="bg-white rounded-xl p-4 shadow">
     <img src={p.image} className="w-full h-[400px] object-cover rounded-lg"/>
     <div className="font-black text-xl mt-3">{p.name}</div>
     <div className="text-gray-500 text-sm">{p.category}</div>
     <div className="text-3xl font-black">${p.price}</div>
    </div>
    <div className="bg-white rounded-xl p-6 shadow h-fit">
     <h2 className="font-black text-lg mb-4">Delivery Details</h2>
     <input value={cust.name} onChange={e=>setCust({...cust,name:e.target.value})} placeholder="Full Name" className="w-full border-2 p-3 rounded-lg mb-3"/>
     <input value={cust.phone} onChange={e=>setCust({...cust,phone:e.target.value})} placeholder="Phone" className="w-full border-2 p-3 rounded-lg mb-3"/>
     <textarea value={cust.address} onChange={e=>setCust({...cust,address:e.target.value})} placeholder="Full Address" className="w-full border-2 p-3 rounded-lg mb-4 min-h-[100px]"/>
     <button onClick={placeOrder} className="bg-yellow-400 text-black font-black w-full py-4 rounded-full">PLACE ORDER - COD</button>
     <div className="text-xs text-center text-gray-400 mt-2">Order saves automatically + WhatsApp</div>
    </div>
   </div>
  </div>
)
}
export default function Checkout(){return <Suspense><CheckoutContent/></Suspense>} 
