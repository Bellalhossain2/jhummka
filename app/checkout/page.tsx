"use client"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage(){
  const params = useSearchParams()
  const name = params.get("name") || "Product"
  const price = params.get("price") || "2"
  const [firstName,setFirstName]=useState("")
  const [lastName,setLastName]=useState("")
  const [card,setCard]=useState("")
  const [exp,setExp]=useState("")
  const [cvc,setCvc]=useState("")
  const [loading,setLoading]=useState(false)

  async function pay(){
    if(!firstName || !card || !exp || !cvc){ alert("Fill all fields"); return }
    setLoading(true)
    try{
      const res = await fetch("/api/create-payment-intent",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name, price })
      })
      const data = await res.json()
      if(data.url){
        window.location.href = data.url
      } else {
        alert("Stripe error: " + data.error)
        setLoading(false)
      }
    } catch(e){
      alert("Failed")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold">{name} - ${price}</h1>
      <input placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} className="border p-2 w-full mt-2"/>
      <input placeholder="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)} className="border p-2 w-full mt-2"/>
      <input placeholder="Card Number" value={card} onChange={e=>setCard(e.target.value)} className="border p-2 w-full mt-2"/>
      <div className="flex gap-2 mt-2">
        <input placeholder="MM/YY" value={exp} onChange={e=>setExp(e.target.value)} className="border p-2 w-full"/>
        <input placeholder="CVC" value={cvc} onChange={e=>setCvc(e.target.value)} className="border p-2 w-full"/>
      </div>
      <button onClick={pay} disabled={loading} className="bg-black text-white p-3 w-full mt-4">
        {loading ? "Loading..." : "DONE - Pay $" + price}
      </button>
    </div>
  )
} 
