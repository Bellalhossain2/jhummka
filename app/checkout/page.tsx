"use client"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"

export const dynamic = "force-dynamic"

function Inner() {
  const sp = useSearchParams()
  const name = sp.get("name") || "Mobile Stand"
  const price = Number(sp.get("price") || "9.94")
  const [load, setLoad] = useState(false)
  const total = 12.41

  const pay = async () => {
    setLoad(true)
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: total }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else { alert("error"); setLoad(false) }
  }

  return (
    <div style={{ background: "#fff", color: "#000", minHeight: "100vh", padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ color: "#000", fontWeight: 700 }}>Checkout</h1>
      <p style={{ color: "#000" }}>Bellal Hossain +1 (516) 272-1370</p>
      <p style={{ color: "#ea580c" }}>288 Logan St, Brooklyn, NY 11208</p>
      <hr />
      <p style={{ color: "#000", marginTop: 10 }}>Item: {name} - ${price}</p>
      <p style={{ color: "#000" }}>Item total: ${price}</p>
      <p style={{ color: "red" }}>Discount: -$1.54</p>
      <p style={{ color: "#000" }}>Shipping: $2.99</p>
      <p style={{ color: "#000" }}>Tax: $1.02</p>
      <h2 style={{ color: "green", fontWeight: 700 }}>Order total: ${total}</h2>
      <button onClick={pay} style={{ background: "#FF6A00", color: "#fff", padding: "14px 30px", borderRadius: 30, border: "none", fontWeight: 700, marginTop: 20, width: "100%" }}>
        {load ? "Loading..." : "Order and Pay (1)"}
      </button>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner />
    </Suspense>
  )
} 
