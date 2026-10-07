"use client"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"

export const dynamic = "force-dynamic"

function CheckoutContent(){
  const sp = useSearchParams()
  const name = sp.get("name") || "Gold Jhumka"
  const price = sp.get("price") || "2"

  const [firstName,setFirstName]=useState("")
  const [lastName,setLastName]=useState("")
  const [card,setCard]=useState("")
  const [exp,setExp]=useState("")
  const [cvc,setCvc]=useState("")
  const [loading,setLoading]=useState(false)
  const [done,setDone]=useState(false)

  async function pay(){
    if(!firstName || !card || !exp || !cvc){ alert("Fill all fields"); return }
    setLoading(true)
    setTimeout(()=>{ setDone(true); setLoading(false) },1000)
  }

  if(done){
    return(
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl max-w-md w-full text-center border">
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-black mt-4 text-black">Order Paid!</h1>
          <p className="mt-2 text-black">Thank you {firstName} {lastName}!</p>
          <p className="text-sm mt-2 text-black">{name} - ${price}</p>
          <p className="text-xs text-green-700 mt-4 font-bold">Stripe Payouts -> Stripe Dashboard</p>
          <a href="/" className="mt-6 block bg-black text-white py-3 rounded-full">Continue Shopping</a>
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-gray-100 p-3">
      <div className="max-w-lg mx-auto bg-white rounded-xl p-6 border shadow">
        <h1 className="text-xl font-black text-black">Checkout - Pay with Stripe</h1>
        <div className="bg-yellow-100 p-3 rounded mt-3 text-sm text-black border border-yellow-300">
          <b className="text-black">{name}</b> - <span className="text-black font-bold">${price}</span> - Free Shipping
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-bold text-black block mb-1">First Name</label>
              <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First Name" className="w-full border-2 border-gray-300 p-3 rounded text-black bg-white placeholder:text-gray-500 focus:border-black outline-none"/>
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-black block mb-1">Last Name</label>
              <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Last Name" className="w-full border-2 border-gray-300 p-3 rounded text-black bg-white placeholder:text-gray-500 focus:border-black outline-none"/>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-black block mb-1">Card Number</label>
            <input value={card} onChange={e=>setCard(e.target.value)} placeholder="4242 4242 4242 4242" className="w-full border-2 border-gray-300 p-3 rounded text-black bg-white placeholder:text-gray-500 focus:border-black outline-none"/>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-bold text-black block mb-1">Expiration Date</label>
              <input value={exp} onChange={e=>setExp(e.target.value)} placeholder="MM/YY" className="w-full border-2 border-gray-300 p-3 rounded text-black bg-white placeholder:text-gray-500 focus:border-black outline-none"/>
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-black block mb-1">Sec - Code (CVC)</label>
              <input value={cvc} onChange={e=>setCvc(e.target.value)} placeholder="123" className="w-full border-2 border-gray-300 p-3 rounded text-black bg-white placeholder:text-gray-500 focus:border-black outline-none"/>
            </div>
          </div>

          <button onClick={pay} disabled={loading} className="w-full bg-black text-white py-4 rounded-full font-black mt-4 text-lg">
            {loading?"Processing...":"DONE - Pay $"+price}
          </button>
          <p className="text-xs text-center text-black font-medium">Secure by Stripe • Payouts to Stripe</p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage(){
  return(
    <Suspense fallback={<div className="p-10 text-center text-black">Loading checkout...</div>}>
      <CheckoutContent/>
    </Suspense>
  )
} 
