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
const [payMethod,setPayMethod]=useState("cod")
const [txnId,setTxnId]=useState("")
const [senderNum,setSenderNum]=useState("")
const [done,setDone]=useState(false)
const [orderId,setOrderId]=useState("")

// === CHANGE THESE TO YOUR BUSINESS ACCOUNTS ===
const MY_BKASH = "017XXXXXXXX - Bellal Hossain (Personal)"
const MY_NAGAD = "017XXXXXXXX - Bellal Hossain"
const MY_BANK = "Bank: XXXX - Ac: 123456789 - Bellal Hossain"

useEffect(()=>{
  if(!id) return
  getDoc(doc(db,"products",id)).then(snap=>{
   if(snap.exists()) setP({id:snap.id,...snap.data()})
  })
},[id])

const placeOrder = async()=>{
  if(!cust.name||!cust.phone||!cust.address){ alert("Fill Name, Phone, Address"); return }
  if(payMethod!=="cod" &&!txnId){ alert("Please enter Transaction ID after payment"); return }

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
    paymentMethod: payMethod, // cod, bkash, nagad, bank
    transactionId: txnId,
    senderNumber: senderNum,
    shippingStatus: "pending", // pending, paid_shopkeeper, shipped, delivered
    profit: 0, // you can add later
    createdAt: serverTimestamp(),
    status: payMethod==="cod"? "new_cod" : "paid_wait_verify"
   })
   setOrderId(orderRef.id)
   setDone(true)
   // WhatsApp notify you
   const msg=`NEW ORDER ${payMethod.toUpperCase()}%0AProduct: ${p.name} $${p.price}%0ACust: ${cust.name} ${cust.phone}%0AAddr: ${cust.address}%0APay: ${payMethod} Txn: ${txnId} From: ${senderNum}`
   window.open(`https://wa.me/17163282102?text=${msg}`,"_blank")
  }catch(e:any){ alert(e.message) }
}

if(done){
  return(
   <div className="min-h-screen bg-white flex items-center justify-center p-6 text-black">
    <div className="text-center max-w-md border-2 border-green-500 rounded-xl p-6 bg-green-50">
     <div className="text-5xl">✅</div>
     <h1 className="text-2xl font-black mt-3">Order Placed!</h1>
     <p className="mt-2 text-sm">ID: {orderId.slice(0,8)} - {p?.name} - ${p?.price}</p>
     {payMethod!=="cod"? (
      <div className="bg-yellow-100 p-3 rounded mt-3 text-sm text-left">
       <b>We received your payment!</b><br/>
       Method: {payMethod.toUpperCase()}<br/>
       Txn ID: {txnId}<br/>
       We will verify in 5 mins and confirm your order!
      </div>
     ) : (
      <p className="mt-2 text-sm">COD - Pay when receive</p>
     )}
     <a href="/" className="inline-block mt-5 bg-black text-yellow-400 font-black px-8 py-3 rounded-full">Continue Shopping</a>
     <div className="mt-4 text-xs text-gray-500">Shipping partner: <a href="https://www.pathao.com" target="_blank" className="underline">Pathao / Steadfast link</a> - You will book after verification</div>
    </div>
   </div>
  )
}

if(!p) return <div className="p-10 text-center">Loading...</div>

return(
  <div className="min-h-screen bg-gray-100 text-black">
   <div className="bg-black text-yellow-400 p-3 font-black"><a href="/" className="text-yellow-400">{"<- Back"} </a> JHUMMKA - Secure Checkout</div>
   <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 p-4">
    <div className="bg-white rounded-xl p-4 shadow">
     <img src={p.image} className="w-full h-[350px] object-cover rounded-lg"/>
     <div className="font-black text-xl mt-3">{p.name}</div>
     <div className="text-gray-500 text-sm">{p.category} - Stock: Available</div>
     <div className="text-3xl font-black mt-2">${p.price}</div>
     <div className="text-xs text-gray-500 mt-2">After customer pay, you pay shopkeeper + shipping. Your profit = Customer Price - Shopkeeper Price - Shipping</div>
    </div>
    <div className="bg-white rounded-xl p-5 shadow h-fit">
     <h2 className="font-black text-lg mb-3">1. Delivery Details</h2>
     <input value={cust.name} onChange={e=>setCust({...cust,name:e.target.value})} placeholder="Full Name" className="w-full border-2 p-3 rounded-lg mb-2"/>
     <input value={cust.phone} onChange={e=>setCust({...cust,phone:e.target.value})} placeholder="Phone" className="w-full border-2 p-3 rounded-lg mb-2"/>
     <textarea value={cust.address} onChange={e=>setCust({...cust,address:e.target.value})} placeholder="Full Address" className="w-full border-2 p-3 rounded-lg mb-4 min-h-[80px]"/>

     <h2 className="font-black text-lg mb-3">2. Pay Options - Pay to Us</h2>
     <div className="grid grid-cols-2 gap-2 mb-3">
      <button onClick={()=>setPayMethod("cod")} className={`p-3 rounded-lg border-2 font-bold text-sm ${payMethod==="cod"?"bg-black text-yellow-400 border-black":"bg-white"}`}>Cash on Delivery</button>
      <button onClick={()=>setPayMethod("bkash")} className={`p-3 rounded-lg border-2 font-bold text-sm ${payMethod==="bkash"?"bg-pink-600 text-white border-pink-600":"bg-white"}`}>bKash</button>
      <button onClick={()=>setPayMethod("nagad")} className={`p-3 rounded-lg border-2 font-bold text-sm ${payMethod==="nagad"?"bg-orange-600 text-white border-orange-600":"bg-white"}`}>Nagad</button>
      <button onClick={()=>setPayMethod("bank")} className={`p-3 rounded-lg border-2 font-bold text-sm ${payMethod==="bank"?"bg-blue-600 text-white border-blue-600":"bg-white"}`}>Bank Transfer</button>
     </div>

     {payMethod!=="cod" && (
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 mb-3 text-sm">
       <b>Pay to our Business Account:</b><br/>
       {payMethod==="bkash" && <><span className="font-black text-pink-600">{MY_BKASH}</span><br/>Send Money: ${p.price}<br/>Reference: {p.name.slice(0,10)}</>}
       {payMethod==="nagad" && <><span className="font-black text-orange-600">{MY_NAGAD}</span><br/>Send: ${p.price}</>}
       {payMethod==="bank" && <><span className="font-black text-blue-600">{MY_BANK}</span><br/>Amount: ${p.price}</>}
       <div className="mt-3">
        <input value={senderNum} onChange={e=>setSenderNum(e.target.value)} placeholder="Your bKash/Nagad Number (Sender)" className="w-full border p-2 rounded mb-2"/>
        <input value={txnId} onChange={e=>setTxnId(e.target.value)} placeholder="Transaction ID - TrxID" className="w-full border-2 border-green-500 p-2 rounded font-bold"/>
        <div className="text-xs text-gray-500 mt-1">After sending money, enter Transaction ID here</div>
       </div>
      </div>
     )}

     <h2 className="font-black text-lg mb-2">3. Shipping</h2>
     <div className="text-xs bg-gray-50 p-2 rounded mb-3">
      For you (admin): After verifying payment, pay shopkeeper, then book shipping:<br/>
      - Pathao: <a href="https://merchant.pathao.com" className="underline text-blue-600">merchant.pathao.com</a><br/>
      - Steadfast: <a href="https://steadfast.com.bd" className="underline text-blue-600">steadfast.com.bd</a><br/>
      - Paperfly etc. Cost $2-3 will cut from your profit.
     </div>

     <button onClick={placeOrder} className="bg-yellow-400 text-black font-black w-full py-4 rounded-full text-lg">
      {payMethod==="cod"? "PLACE ORDER - COD" : `CONFIRM - PAID ${txnId? "✓" : ""}`}
     </button>
    </div>
   </div>
  </div>
)
}
export default function Checkout(){return <Suspense><CheckoutContent/></Suspense>} 
