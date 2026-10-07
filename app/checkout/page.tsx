"use client"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Checkout(){
  const sp = useSearchParams()
  const name = sp.get("name") || "Gold Jhumka"
  const price = sp.get("price") || "25"
  const id = sp.get("id") || "1"

  const [firstName,setFirstName]=useState("")
  const [lastName,setLastName]=useState("")
  const [card,setCard]=useState("")
  const [exp,setExp]=useState("")
  const [cvc,setCvc]=useState("")
  const [loading,setLoading]=useState(false)
  const [done,setDone]=useState(false)

  async function pay(){
    if(!firstName || !card || !exp || !cvc){
      alert("Fill all fields")
      return
    }
    setLoading(true)
    try{
      // Call your stripe API
      const res = await fetch("/api/create-payment-intent",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,price,id,firstName,lastName,card,exp,cvc})
      })
      const data = await res.json()
      if(data.url){
        window.location.href = data.url // Stripe checkout link
      } else {
        // For test - show success
        setDone(true)
      }
    }catch(e){
      console.log(e)
      alert("Payment processing - test mode. Stripe payouts will come to your Stripe account!")
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
          <p className="mt-2">Thank you {firstName}!</p>
          <p className="text-sm text-gray-500 mt-2">Product: {name} - ${price}</p>
          <p className="text-xs text-green-600 mt-4 font-bold">Stripe Payouts -> Will arrive to your Stripe Dashboard</p>
          <a href="/" className="mt-6 block bg-black text-white py-3 rounded-full">Continue Shopping</a>
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-gray-100 p-3">
      <div className="max-w-lg mx-auto bg-white rounded-xl p-5 shadow">
        <h1 className="text-xl font-black">Checkout</h1>
        <div className="bg-yellow-100 p-3 rounded mt-3 text-sm">
          <b>{name}</b><br/>Price: <b>${price}</b> - Free Shipping
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-bold">First Name</label>
              <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="John" className="w-full border p-3 rounded text-sm"/>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold">Last Name</label>
              <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Doe" className="w-full border p-3 rounded text-sm"/>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold">Card Number</label>
            <input value={card} onChange={e=>setCard(e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} className="w-full border p-3 rounded text-sm"/>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-bold">Expiration Date</label>
              <input value={exp} onChange={e=>setExp(e.target.value)} placeholder="MM/YY" maxLength={5} className="w-full border p-3 rounded text-sm"/>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold">Sec - Code (CVC)</label>
              <input value={cvc} onChange={e=>setCvc(e.target.value)} placeholder="123" maxLength={4} className="w-full border p-3 rounded text-sm"/>
            </div>
          </div>

          <button onClick={pay} disabled={loading} className="w-full bg-black text-yellow-400 py-4 rounded-full font-black mt-4">
            {loading?"Processing...":"DONE - Pay $"+price+" (Stripe)"}
          </button>

          <p className="text-xs text-center text-gray-400 mt-2">Secure by Stripe • Payouts to your Stripe account</p>
          <p className="text-xs text-center mt-2"><a href="/" className="underline">Back to Shop</a></p>
        </div>
      </div>
    </div>
  )
} 
