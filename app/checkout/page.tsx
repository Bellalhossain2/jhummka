"use client"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"

export const dynamic = "force-dynamic"

function CheckoutInner() {
  const searchParams = useSearchParams()
  const name = searchParams.get("name") || "Mobile Stand"
  const price = Number(searchParams.get("price") || "9.94")
  const img = searchParams.get("image") || ""

  const [coupon, setCoupon] = useState("")
  const [showCoupon, setShowCoupon] = useState(false)
  const [loading, setLoading] = useState(false)
  const discount = coupon === "SAVE10" ? 2.5 : 1.54

  const itemTotal = price
  const subtotal = itemTotal - discount
  const shipping = 2.99
  const tax = 1.02
  const total = subtotal + shipping + tax

  const pay = async () => {
    setLoading(true)
    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: total }),
    })
    const d = await r.json()
    if (d.url) window.location.href = d.url
    else { alert("Checkout error"); setLoading(false) }
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", color: "#000" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", padding: 16, paddingBottom: 90 }}>
        <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
          <div style={{ width: 10, height: 10, background: "#000", borderRadius: 50, marginTop: 5 }} />
          <div>
            <div style={{ fontWeight: 700, color: "#000" }}>Bellal Hossain +1 (516) 272-1370</div>
            <div style={{ color: "#ea580c", fontSize: 13 }}>288 Logan St, BROOKLYN, NY 11208...</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #eee" }}>
          <div style={{ width: 80, height: 80, background: "#eee", borderRadius: 8, overflow: "hidden" }}>
            {img && <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#000" }}>${subtotal.toFixed(2)} <span style={{ textDecoration: "line-through", color: "#999", fontWeight: 400 }}>${itemTotal.toFixed(2)}</span> <span style={{ background: "red", color: "#fff", fontSize: 11, padding: "2px 6px", borderRadius: 4, marginLeft: 6 }}>16% OFF</span></div>
            <div style={{ color: "#15803d", fontSize: 13, marginTop: 6 }}>🚚 Shipping: ${shipping}, 3-7 days</div>
          </div>
        </div>

        <h3 style={{ fontWeight: 700, fontSize: 18, margin: "16px 0 8px", color: "#000" }}>Payment methods</h3>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", fontSize: 12 }}>
          <span style={{ border: "1px solid #ddd", padding: "4px 8px", borderRadius: 4 }}>Pay</span>
          <span style={{ background: "red", color: "#fff", padding: "4px 8px", borderRadius: 4 }}>●●</span>
          <span style={{ background: "#009CDE", color: "#fff", padding: "4px 8px", borderRadius: 4, fontWeight: 700 }}>PayPal</span>
          <span style={{ background: "green", color: "#fff", padding: "4px 8px", borderRadius: 4 }}>$</span>
          <span style={{ border: "1px solid #ddd", padding: "4px 8px", borderRadius: 4 }}>Klarna</span>
          <span style={{ background: "#000", color: "#fff", padding: "4px 8px", borderRadius: 4 }}>zip</span>
        </div>

        <div style={{ marginTop: 20, color: "#000" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span>Item(s) total:</span><span>${itemTotal.toFixed(2)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span>Discount:</span><span style={{ color: "red" }}>-${discount.toFixed(2)}</span></div>
          <div onClick={() => setShowCoupon(!showCoupon)} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #eee", cursor: "pointer" }}><span>Apply coupon code</span><span>›</span></div>
          {showCoupon && <div style={{ display: "flex", gap: 8, marginBottom: 10 }}><input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="SAVE10" style={{ border: "1px solid #ccc", padding: 8, flex: 1, borderRadius: 6 }} /><button onClick={() => alert(coupon ? "Applied!" : "Enter SAVE10")} style={{ background: "#000", color: "#fff", padding: "0 16px", borderRadius: 6 }}>Apply</button></div>}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #eee" }}><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span>Shipping:</span><span>${shipping.toFixed(2)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span>Sales tax:</span><span>${tax.toFixed(2)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #eee", fontWeight: 700, fontSize: 18 }}><span>Order total:</span><span style={{ color: "green" }}>${total.toFixed(2)}</span></div>
          <div style={{ border: "2px solid green", padding: 12, borderRadius: 8, color: "green", marginTop: 8 }}>$ Submit now to enjoy Price Match Guarantee.</div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #ddd", padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 600, margin: "0 auto" }}>
        <div><div style={{ fontWeight: 700, fontSize: 20, color: "#000" }} 
