"use client"
import { useState } from "react"

export default function CheckoutPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)

  async function pay() {
    setLoading(true)
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Jhumka - $2 + $25 Shipping", price: 27 }),
      })
      const data = await res.json()
      console.log(data)
      if (data.url) {
        window.location.href = data.url // Goes to BIG Stripe form!
      } else {
        alert("Stripe error: " + data.error)
        setLoading(false)
      }
    } catch (e) {
      alert("Failed to connect to Stripe")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold">Checkout - Virtual</h1>
      <input placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} className="border p-3 w-full mt-4" />
      <input placeholder="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)} className="border p-3 w-full mt-4" />
      <button onClick={pay} disabled={loading} className="bg-black text-white p-3 w-full mt-6">
        {loading ? "Redirecting to Stripe..." : "Pay $27 with Stripe - Secure Checkout"}
      </button>
      <p className="text-xs mt-3 text-center">Apple Pay • Card • Klarna • Bank • Link - Secure Stripe page</p>
    </div>
  )
} 
