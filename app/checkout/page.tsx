"use client"
export const dynamic = 'force-dynamic'
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function CheckoutPage() {
  const cart = useCart() as any
  const items = cart?.items || []
  const safeCartTotal = cart?.cartTotal || 0
 
  const [address, setAddress] = useState("")
  const [miles, setMiles] = useState(0)
  const [drivingMiles, setDrivingMiles] = useState(0)
  const [isUpstairs, setIsUpstairs] = useState(false)
  const [deliveryType, setDeliveryType] = useState("grocery_now")
  const [loadingMiles, setLoadingMiles] = useState(false)
  const [autoCalculated, setAutoCalculated] = useState(false)
  const [mounted, setMounted] = useState(false)

  // ====== ADD YOUR STORES HERE - CUSTOMER SELECTS ANY STORE ======
  const STORES = [
    { id: 1, name: "premium supermrket - Ozone Park", address: "1196 Liberty Ave, Ozone Park, NY 11416", lat: 40.6829, lng: -73.8483 },
    { id: 2, name: "whole food market - wiilumesburg", address: "774 grand st, brooklyn, NY 11211", lat: 40.7112, lng: -73.9396 },
    { id: 3, name: "golden farms supermarket - Brooklyn", address: "416 cresent st, Brooklyn, NY 11208", lat: 406789, lng: -73.9072 },
    { id: 4, name: "premium supermarket - jamaica", address: "168-07 hillside ave,jamaica, NY 11432", lat:407086, lng: -73.7962 }, 
  ]
  const [selectedStore, setSelectedStore] = useState(STORES[0])

  useEffect(() => {
    setMounted(true)
    const savedAddr = localStorage.getItem("customer_delivery_address")
    const savedMiles = localStorage.getItem("customer_delivery_miles")
    const savedStoreId = localStorage.getItem("selected_store_id")
    if (savedAddr) setAddress(savedAddr)
    if (savedMiles) { setMiles(parseFloat(savedMiles)); setDrivingMiles(parseFloat(savedMiles)); setAutoCalculated(true) }
    if (savedStoreId) {
      const found = STORES.find(s => s.id.toString() === savedStoreId)
      if (found) setSelectedStore(found)
    }
  }, [])

  async function calculateDistanceFromAddress() {
    if (!address) return alert("Enter customer address first!")
    setLoadingMiles(true)
    try {
      const geo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      const geoData = await geo.json()
      if (!geoData[0]) { alert("Address not found! Try: 87-01 101st Ave, Queens, NY"); setLoadingMiles(false); return; }
      const custLat = parseFloat(geoData[0].lat)
      const custLng = parseFloat(geoData[0].lon)

      // REAL DRIVING DISTANCE: Customer -> Selected Store
      try {
        const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${custLng},${custLat};${selectedStore.lng},${selectedStore.lat}?overview=false`)
        const routeData = await routeRes.json()
        if (routeData.routes && routeData.routes[0]) {
          const realMiles = routeData.routes[0].distance / 1609.34
          const final = parseFloat(realMiles.toFixed(1))
          setMiles(final); setDrivingMiles(final); setAutoCalculated(true)
          localStorage.setItem("customer_delivery_address", address)
          localStorage.setItem("customer_delivery_miles", final.toString())
          localStorage.setItem("selected_store_id", selectedStore.id.toString())
          setLoadingMiles(false); return
        }
      } catch {}

      // Fallback straight line
      const R = 3959
      const dLat = (custLat - selectedStore.lat) * Math.PI / 180
      const dLng = (custLng - selectedStore.lng) * Math.PI / 180
      const a = Math.sin(dLat/2)**2 + Math.cos(selectedStore.lat*Math.PI/180)*Math.cos(custLat*Math.PI/180)*Math.sin(dLng/2)**2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const final = parseFloat((R * c).toFixed(1))
      setMiles(final); setDrivingMiles(final); setAutoCalculated(true)
      localStorage.setItem("customer_delivery_address", address)
      localStorage.setItem("customer_delivery_miles", final.toString())
      localStorage.setItem("selected_store_id", selectedStore.id.toString())
    } catch (e) { alert("Error") }
    setLoadingMiles(false)
  }

  let deliveryCharge = 0
  if (deliveryType === "pickup") deliveryCharge = 0
  else if (deliveryType === "normal") deliveryCharge = 7
  else {
    const base = 10
    const shoppingExtra = Math.max(0, Math.ceil(safeCartTotal / 20) - 1) * 5
    const milesExtra = drivingMiles <= 1 ? 0 : Math.ceil(drivingMiles - 1) * 5
    const upstairsExtra = isUpstairs ? Math.ceil(safeCartTotal / 20) * 5 : 0
    deliveryCharge = base + shoppingExtra + milesExtra + upstairsExtra
  }
  const finalTotal = safeCartTotal + deliveryCharge

  if (!mounted) return <div className="min-h-screen bg-black text-white p-4">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-lg mx-auto">
      <h1 className="font-black mb-3 text-xl">🏪 Select Store</h1>

      <div className="bg-zinc-900 p-3 rounded-xl mb-4 border border-yellow-400/30">
        <label className="text-xs text-yellow-400 font-bold mb-2 block">CHOOSE STORE</label>
        <select value={selectedStore.id} onChange={e=>{ const s = STORES.find(x=>x.id.toString()===e.target.value); if(s){setSelectedStore(s); setAutoCalculated(false)} }} className="w-full bg-black border border-zinc-700 p-3 rounded text-sm text-white">
          {STORES.map(s => <option key={s.id} value={s.id}>{s.name} - {s.address}</option>)}
        </select>
        <div className="text-[11px] text-gray-400 mt-2">Selected: {selectedStore.address}</div>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4 border border-zinc-800">
        <label className="text-xs text-yellow-400 font-bold mb-1 block">CUSTOMER ADDRESS</label>
        <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Ex: 102-10 Atlantic Ave, Ozone Park, NY" className="w-full bg-black border border-yellow-400/30 p-3 rounded text-sm mb-2 text-white"/>
        <Button onClick={calculateDistanceFromAddress} disabled={loadingMiles} className="w-full bg-yellow-400 text-black font-black h-12 text-sm">
          {loadingMiles ? "Calculating..." : autoCalculated ? `✓ ${drivingMiles} mi to ${selectedStore.name}` : "📍 GET MILES & FEE"}
        </Button>
        {autoCalculated && (
          <div className="mt-3 bg-black p-3 rounded text-xs">
            <div className="flex justify-between"><span>Customer:</span><span className="text-gray-300 truncate ml-2">{address}</span></div>
            <div className="flex justify-between mt-1"><span>Store:</span><span className="text-yellow-400">{selectedStore.name}</span></div>
            <div className="flex justify-between mt-2 font-bold text-green-400"><span>🚗 Distance:</span><span>{drivingMiles} miles</span></div>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4 space-y-2 border border-zinc-800">
        <div onClick={()=>setDeliveryType("grocery_now")} className={`p-3 border rounded cursor-pointer ${deliveryType==="grocery_now"?"border-yellow-400 bg-yellow-400/10":"border-gray-700"}`}>
          <div className="font-bold text-sm">🚀 RIGHT NOW - ${(deliveryCharge||0).toFixed(2)}</div>
          <div className="text-[11px] text-gray-400">Base $10 + Cart ${Math.max(0, Math.ceil(safeCartTotal/20)-1)*5} + Miles {drivingMiles}mi ({drivingMiles<=1?0:Math.ceil(drivingMiles-1)*5})</div>
        </div>
        <div onClick={()=>setDeliveryType("normal")} className={`p-3 border rounded cursor-pointer ${deliveryType==="normal"?"border-yellow-400":"border-gray-700"}`}>📦 Normal - $7.00</div>
        <div onClick={()=>setDeliveryType("pickup")} className={`p-3 border rounded cursor-pointer ${deliveryType==="pickup"?"border-yellow-400":"border-gray-700"}`}>🚗 Pickup FREE at {selectedStore.name}</div>
        <label className="flex items-center gap-2 text-sm pt-2"><input type="checkbox" checked={isUpstairs} onChange={e=>setIsUpstairs(e.target.checked)}/> Upstairs?</label>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="flex justify-between text-sm"><span>Groceries</span><span>${(safeCartTotal||0).toFixed(2)}</span></div>
        <div className="flex justify-between text-sm mt-2 font-bold"><span>Fee ({drivingMiles} mi to {selectedStore.name})</span><span className="text-yellow-400">${(deliveryCharge||0).toFixed(2)}</span></div>
        <div className="flex justify-between font-black text-lg border-t border-gray-700 pt-2 mt-3"><span>TOTAL</span><span className="text-yellow-400">${(finalTotal||0).toFixed(2)}</span></div>
        <Button className="w-full mt-4 bg-yellow-400 text-black font-black h-12 rounded-full">PAY ${(finalTotal||0).toFixed(2)}</Button>
      </div>
    </div>
  )
} 
