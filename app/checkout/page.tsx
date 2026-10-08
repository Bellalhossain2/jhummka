"use client"
import { useState } from "react"

export default function CheckoutPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)

  async function pay() {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ name: "Jhumka", price: 2, quantity: 1 }]
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Stripe error: " + data.error)
        setLoading(false)
      }
    } catch (e) {
      alert("Failed")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Checkout - Virtual</h1>
      <input placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} className="border p-3 w-full mt-4" />
      <input placeholder="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)} className="border p-3 w-full mt-4" />
     
      <button onClick={pay} disabled={loading} className="bg-black text-white p-3 w-full mt-6">
        {loading ? "Loading..." : "Pay $2 with Stripe - Go to Secure Checkout"}
      </button>
      <p className="text-xs mt-3 text-center">You will go to Stripe secure page (Apple Pay, Card, Klarna)</p>
    </div>
  )
} 
