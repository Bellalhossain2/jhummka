"use client"
export const dynamic = 'force-dynamic'
import { useCart } from "@/components/cart-provider"
import { Button } from "@//components/ui/button"
import { useState, useEffect } from "react"

export default function CheckoutPage() {
  const cart = useCart() as any
  const items = cart?.items || []
  const safeCartTotal = cart?.cartTotal || 0
  const [mounted, setMounted] = useState(false)

  const [address, setAddress] = useState("")
  const [drivingMiles, setDrivingMiles] = useState(0)
  const [isUpstairs, setIsUpstairs] = useState(false)
  const [deliveryType, setDeliveryType] = useState("grocery_now")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  // ====== YOUR 4 STORES ======
  const STORES = [
    { id: 1, name: "Ozone Park - 1196 Liberty Ave", lat: 40.6829, lng: -73.8483 },
    { id: 2, name: "Brooklyn - 774 Grand St", lat: 40.7112, lng: -73.9396 },
    { id: 3, name: "Brooklyn - 416 Crescent St", lat: 40.6789, lng: -73.9072 },
    { id: 4, name: "Jamaica - 168-07 Hillside Ave", lat: 40.7086, lng: -73.7962 },
  ]
  const [store, setStore] = useState(STORES[0])

  useEffect(()=>{ setMounted(true) },[])

  // ====== AUTO DETECT: Is cart ONLY GROCERY? ======
  const isGroceryItem = (item:any) => {
    const cat = (item?.category || item?.product?.category || item?.product?.categoryName || "").toString().toLowerCase()
    const name = (item?.name || item?.product?.name || "").toString().toLowerCase()
    return cat.includes("grocery") || cat.includes("vegetable") || cat.includes("fruit") || name.includes("pumpkin") || name.includes("grocery")
  }
 
  const hasAnyGrocery = items.some(isGroceryItem)
  const isOnlyGrocery = items.length > 0 && items.every(isGroceryItem)
  const isTemuAmazon = !isOnlyGrocery // if has baby dress, electronics, etc

  async function getMiles() {
    if (!address) return alert("Enter customer address!")
    setLoading(true)
    try {
      const geo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      const data = await geo.json()
      if (!data[0]) { alert("Address not found!"); setLoading(false); return; }
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      const route = await fetch(`https://router.project-osrm.org/route/v1/driving/${lng},${lat};${store.lng},${store.lat}?overview=false`)
      const rd = await route.json()
      let mi = rd.routes?.[0] ? rd.routes[0].distance/1609.34 : 0
      if (!mi) {
        const R=3959, dLat=(lat-store.lat)*Math.PI/180, dLng=(lng-store.lng)*Math.PI/180
        const a=Math.sin(dLat/2)**2+Math.cos(store.lat*Math.PI/180)*Math.cos(lat*Math.PI/180)*Math.sin(dLng/2)**2
        mi=R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
      }
      setDrivingMiles(parseFloat(mi.toFixed(1))); setDone(true)
    } catch {}
    setLoading(false)
  }

  // ====== FEE CALCULATION ======
  let deliveryCharge = 0
  if (isOnlyGrocery) {
    // GROCERY LOGIC: Base $10 + $5 per $20 + $5 per mile + upstairs
    if (deliveryType === "pickup") deliveryCharge = 0
    else if (deliveryType === "normal") deliveryCharge = 7
    else {
      const shoppingExtra = Math.max(0, Math.ceil(safeCartTotal/20)-1)*5
      const milesExtra = drivingMiles<=1 ? 0 : Math.ceil(drivingMiles-1)*5
      const upstairsExtra = isUpstairs ? Math.ceil(safeCartTotal/20)*5 : 0
      deliveryCharge = 10 + shoppingExtra + milesExtra + upstairsExtra
    }
  } else {
    // TEMU/AMAZON LOGIC: Free shipping over $50 or $7.99 flat
    deliveryCharge = safeCartTotal > 50 ? 0 : 7.99
  }

  const finalTotal = safeCartTotal + deliveryCharge
  if (!mounted) return <div className="min-h-screen bg-black text-white p-4">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-lg mx-auto">
      <h1 className="font-black text-xl mb-2">Checkout - {isOnlyGrocery ? "🥦 GROCERY" : "📦 TEMU/AMAZON"}</h1>
     
      <div className="text-xs bg-zinc-800 p-2 rounded mb-4">
        Cart: {items.length} items | Grocery? {isOnlyGrocery ? "YES - Miles Fee ON" : "NO - Temu/Amazon Free Shipping"}
      </div>

      {isOnlyGrocery ? (
        <>
          <div className="bg-zinc-900 p-3 rounded-xl mb-3 border border-yellow-400/30">
            <label className="text-xs text-yellow-400 font-bold">CHOOSE STORE</label>
            <select value={store.id} onChange={e=>setStore(STORES.find(s=>s.id.toString()===e.target.value)!)} className="w-full bg-black border border-zinc-700 p-3 rounded text-sm text-white mt-1">
              {STORES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="bg-zinc-900 p-4 rounded-xl mb-3 border border-zinc-800">
            <label className="text-xs text-yellow-400 font-bold">CUSTOMER ADDRESS</label>
            <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="102-10 Atlantic Ave, Queens, NY" className="w-full bg-black border border-yellow-400/30 p-3 rounded text-sm mt-1 text-white"/>
            <Button onClick={getMiles} disabled={loading} className="w-full bg-yellow-400 text-black font-black h-12 mt-2 text-sm">
              {loading ? "Calculating..." : done ? `✓ ${drivingMiles} mi to store` : "📍 GET MILES & FEE"}
            </Button>
            {done && <div className="mt-2 text-xs text-green-400 font-bold">🚗 {drivingMiles} miles | Fee: ${deliveryCharge.toFixed(2)}</div>}
          </div>

          <div className="bg-zinc-900 p-3 rounded-xl mb-3 space-y-2">
            <div onClick={()=>setDeliveryType("grocery_now")} className={`p-3 border rounded cursor-pointer ${deliveryType==="grocery_now"?"border-yellow-400 bg-yellow-400/10":"border-zinc-700"}`}>
              <div className="font-bold text-sm">🚀 RIGHT NOW - ${deliveryCharge.toFixed(2)}</div>
              <div className="text-[10px] text-gray-400">Base $10 + Cart + Miles ({drivingMiles}mi) + {isUpstairs?"Upstairs":""}</div>
            </div>
            <div onClick={()=>setDeliveryType("pickup")} className={`p-3 border rounded cursor-pointer ${deliveryType==="pickup"?"border-yellow-400":"border-zinc-700"}`}>🚗 Pickup FREE at {store.name}</div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isUpstairs} onChange={e=>setIsUpstairs(e.target.checked)}/> Upstairs? (+$5 per $20)</label>
          </div>
        </>
      ) : (
        <div className="bg-zinc-900 p-4 rounded-xl mb-3 border border-zinc-800">
          <h2 className="font-bold text-sm">📦 Standard Shipping (Temu/Amazon style)</h2>
          <div className="text-xs text-gray-400 mt-2">Free shipping over $50, otherwise $7.99</div>
          <div className="mt-2 font-bold">Shipping: ${deliveryCharge.toFixed(2)} {safeCartTotal>50 && "(FREE!)"}</div>
        </div>
      )}

      <div className="bg-zinc-900 p-4 rounded-xl">
        <div className="flex justify-between text-sm"><span>Items</span><span>${safeCartTotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm mt-2 font-bold"><span>Delivery ({isOnlyGrocery?`${drivingMiles}mi`:"Standard"})</span><span className="text-yellow-400">${deliveryCharge.toFixed(2)}</span></div>
        <div className="flex justify-between font-black text-lg border-t border-zinc-700 pt-2 mt-2"><span>TOTAL</span><span className="text-yellow-400">${finalTotal.toFixed(2)}</span></div>
        <Button className="w-full mt-4 bg-yellow-400 text-black font-black h-12 rounded-full">PAY ${finalTotal.toFixed(2)}</Button>
      </div>
    </div>
  )
} 
