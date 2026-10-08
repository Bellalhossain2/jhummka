"use client"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection as fbCollection, getDocs, query, orderBy } from "firebase/firestore"
import { Plus } from "lucide-react"
import { useCart } from "./cart-provider"

const categories = ["all", "jhumkas", "necklaces", "bridal", "heritage"]

export function Collection() {
  const [products, setProducts] = useState<any[]>([])
  const [filter, setFilter] = useState("all")
  const { addToCart } = useCart()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const q = query(fbCollection(db, "products"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      setProducts(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })))
    }
    load()
  }, [])

  const filtered = filter === "all" ? products : products.filter((p: any) => p.category === filter)

  async function buyNow(product: any) {
    setLoadingId(product.id)
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ name: product.name, price: product.price, quantity: 1 }] }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Stripe error: " + data.error)
      }
    } catch (e) {
      alert("Failed")
    }
    setLoadingId(null)
  }

  return (
    <section id="collection" style={{ padding: "40px 20px", background: "#fff", color: "#000" }}>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px", justifyContent: "center" }}>
        {categories.map((c: string) => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: "8px 16px", border: "1px solid #000", background: filter === c ? "#000" : "#fff", color: filter === c ? "#fff" : "#000", cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {filtered.map((p: any) => (
          <div key={p.id} style={{ border: "1px solid #ddd", background: "#fff" }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", height: "250px", objectFit: "cover" }} />
            <div style={{ padding: "15px" }}>
              <h3 style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>{p.name}</h3>
              <p style={{ color: "#666", fontSize: "13px", margin: "0 0 10px 0" }}>{p.description || ""}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <b>{"$" + p.price}</b>
                <button onClick={() => addToCart(p)} style={{ background: "#000", color: "#FFE8B3", border: "none", padding: "8px 12px", cursor: "pointer" }}>+ Cart</button>
              </div>
              <button onClick={() => buyNow(p)} disabled={loadingId === p.id} style={{ width: "100%", background: "#FFE8B3", color: "#000", border: "1px solid #000", padding: "10px", cursor: "pointer", fontWeight: "bold" }}>
                {loadingId === p.id ? "Going to Stripe..." : `Buy Now - $${p.price + 25} Total`}
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: "center", marginTop: "20px" }}>No products yet. Add from /admin</p>}
    </section>
  )
}

export default Collection 
