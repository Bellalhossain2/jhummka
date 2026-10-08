"use client"
import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/products"

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)

  const SHIPPING = 25
  const total = subtotal + (items.length ? SHIPPING : 0)

  async function pay() {
    if (items.length === 0) {
      alert("Cart is empty!")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total }),
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

  if (items.length === 0) {
    return <div className="p-10 text-center">Cart empty - Add products first!</div>
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold">Checkout - {items.length} items</h1>
     
      <div className="mt-6 space-y-2 text-sm">
        {items.map((item: any) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name} x {item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-white/20">
          <span>Shipping</span><span>$25</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2">
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </div>

      <input placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} className="border p-3 w-full mt-6 bg-transparent text-white" />
      <input placeholder="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)} className="border p-3 w-full mt-4 bg-transparent text-white" />
     
      <button onClick={pay} disabled={loading} className="bg-white text-black p-3 w-full mt-6 font-bold">
        {loading ? "Redirecting..." : `Pay ${formatPrice(total)} with Stripe`}
      </button>
      <p className="text-xs mt-3 text-center opacity-70">Apple Pay • Card • Klarna • Bank • Link - Secure Stripe page</p>
    </div>
  )
} 
