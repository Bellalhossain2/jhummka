"use client"
import { useState, useEffect } from "react"
import { useCart } from "@/components/cart-provider"
import { useSearchParams } from "next/navigation"

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  // Get price from URL if direct buy ?price=50&name=Shirt
  const urlPrice = searchParams.get("price")
  const urlName = searchParams.get("name") || "Jhummka Product"
 
  const SHIPPING = 25
  let displayItems: any[] = []
  let total = 0

  if (items.length > 0) {
    // From cart
    displayItems = items
    total = subtotal + SHIPPING
  } else if (urlPrice) {
    // Direct buy from product page
    displayItems = [{ name: urlName, price: Number(urlPrice), quantity: 1 }]
    total = Number(urlPrice) + SHIPPING
  } else {
    // Default fallback - $2 product
    displayItems = [{ name: "Jhummka - Sample", price: 2, quantity: 1 }]
    total = 27
  }

  async function pay() {
    setLoading(true)
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: displayItems }),
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
    <div className="max-w-md mx-auto p-6 mt-10 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold">Checkout - Virtual</h1>
     
      <div className="mt-6 space-y-2 text-sm border border-white/20 p-4">
        {displayItems.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span>{item.name} x {item.quantity}</span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-white/20">
          <span>Shipping</span><span>$25</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2">
          <span>Total</span><span>${total}</span>
        </div>
      </div>

      <input placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} className="border p-3 w-full mt-6 bg-transparent text-white" />
      <input placeholder="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)} className="border p-3 w-full mt-4 bg-transparent text-white" />
     
      <button onClick={pay} disabled={loading} className="bg-white text-black p-3 w-full mt-6 font-bold">
        {loading ? "Redirecting..." : `Pay $${total} with Stripe - Secure Checkout`}
      </button>
      <p className="text-xs mt-3 text-center opacity-70">Apple Pay • Card • Klarna • Bank • Link</p>

      {items.length === 0 && !urlPrice && (
        <p className="text-xs mt-6 text-yellow-300 text-center">
          Note: Cart empty - showing demo $2 product. Add to cart or use Buy Now with ?price
        </p>
      )}
    </div>
  )
} 
