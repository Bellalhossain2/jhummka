"use client"
import { Suspense, useState } from "react"
import { useCart } from "@/components/cart-provider"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export const dynamic = 'force-dynamic'

function CheckoutContent() {
  const { items, subtotal } = useCart()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")

  const urlPrice = searchParams.get("price")
  const urlName = searchParams.get("name")
  const urlId = searchParams.get("id")
  const SHIPPING = 25

  let displayItems: any[] = []
  let cartTotal = 0

  if (items.length > 0) {
    displayItems = items
    cartTotal = subtotal
  } else if (urlPrice) {
    displayItems = [{
      id: urlId || "direct",
      name: urlName || "Product",
      price: Number(urlPrice),
      quantity: 1,
      image: ""
    }]
    cartTotal = Number(urlPrice)
  }

  const finalTotal = cartTotal + (displayItems.length > 0 ? SHIPPING : 0)

  async function pay() {
    if (displayItems.length === 0) {
      alert("Cart empty! Go shop.")
      window.location.href = "/"
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: displayItems.map((i:any)=>({
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity || 1
          }))
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Stripe error: " + (data.error || "No URL"))
        setLoading(false)
      }
    } catch (e) {
      alert("Failed")
      setLoading(false)
    }
  }

  if (displayItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-black">
        <h1 className="text-2xl font-black">Your Cart is Empty</h1>
        <p className="mt-2 text-gray-600">Add products to checkout</p>
        <Link href="/" className="mt-6 bg-yellow-400 text-black px-8 py-3 rounded-full font-black">
          Go Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-4">
        <Link href="/" className="text-sm">← Back</Link>
        <h1 className="text-2xl font-black mt-4">Checkout</h1>
        <div className="bg-white rounded-lg border mt-4 p-4">
          <h2 className="font-bold">Order ({displayItems.length})</h2>
          <div className="mt-3 space-y-2">
            {displayItems.map((item:any, i:number)=>(
              <div key={i} className="flex justify-between text-sm">
                <span className="flex-1 truncate pr-4">{item.name} x {item.quantity || 1}</span>
                <span className="font-bold">${(Number(item.price) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t">
              <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span><span>${SHIPPING.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-lg pt-2 border-t">
              <span>Total</span><span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border mt-4 p-4">
          <input placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} className="border p-3 w-full mt-3 rounded text-black" />
          <input placeholder="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)} className="border p-3 w-full mt-3 rounded text-black" />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-3 w-full mt-3 rounded text-black" />
          <button onClick={pay} disabled={loading} className="bg-yellow-400 text-black p-4 w-full mt-6 font-black rounded-full text-lg disabled:opacity-50">
            {loading ? "Going to Stripe..." : `Pay $${finalTotal.toFixed(2)} - Stripe`}
          </button>
          <p className="text-xs mt-3 text-center">Apple Pay • Card • Klarna - Stripe</p>
        </div>
      </div>
    </div>
  )
}

export default function Page(){
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
} 
