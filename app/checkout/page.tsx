"use client"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"

export const dynamic = "force-dynamic"

function CheckoutContent(){
  const sp = useSearchParams()
  const name = sp.get("name") || "Gold Jhumka"
  const price = sp.get("price") || "25"

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
    try{
      const res = await fetch("/api/create-payment-intent",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,price,firstName,lastName})
      })
      const data = await res.json()
      if(data.url){ window.location.href=data.url; return }
      setDone(true)
    }catch(e){
      setDone(true)
    }
    setLoading(false)
  }

  if(done){
    return(
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl max-w-md w-full text-center">
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-black mt-4">Order Paid!</h1>
          <p className="mt-2">Thank you {firstName} {lastName}!</p>
          <p className="text-sm mt-2">{name} - ${price}</p>
          <p className="text-xs text-green-600 mt-4 font-bold">Stripe Payouts -> Check Stripe Dashboard</p>
          <a href="/" className="mt-6 block bg-black text-white py-3 rounded-full">Continue Shopping</a>
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-gray-100 p-3">
      <div className="max-w-lg mx-auto bg-white rounded-xl p-5">
        <h1 className="text-xl font-black">Checkout - Pay with Stripe</h1>
        <div className="bg-yellow-100 p-3 rounded mt-3 text-sm"><b>{name}</b> - ${price} - Free Shipping</div>

        <div className="mt-5 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-bold">First Name</label>
              <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First Name" className="w-full border p-3 rounded text-sm"/>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold">Last Name</label>
              <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Last Name" className="w-full border p-3 rounded text-sm"/>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold">Card Number</label>
            <input value={card} onChange={e=>setCard(e.target.value)} placeholder="4242 4242 4242 4242" className="w-full border p-3 rounded text-sm"/>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-bold">Expiration Date</label>
              <input value={exp} onChange={e=>setExp(e.target.value)} placeholder="MM/YY" className="w-full border p-3 rounded text-sm"/>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold">Sec - Code (CVC)</label>
              <input value={cvc} onChange={e=>setCvc(e.target.value)} placeholder="123" className="w-full border p-3 rounded text-sm"/>
            </div>
          </div>

          <button onClick={pay} disabled={loading} className="w-full bg-black text-white py-4 rounded-full font-black mt-4">
            {loading?"Processing...":"DONE - Pay $"+price}
          </button>
          <p className="text-xs text-center text-gray-400">Secure by Stripe • Payouts to Stripe</p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage(){
  return(
    <Suspense fallback={<div className="p-10 text-center">Loading checkout...</div>}>
      <CheckoutContent/>
    </Suspense>
  )
} 
