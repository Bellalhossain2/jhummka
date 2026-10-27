"use client"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function CheckoutPage() {
  const { items, cartTotal } = useCart() as any
  const [address, setAddress] = useState("")
  const [miles, setMiles] = useState(1)
  const [isUpstairs, setIsUpstairs] = useState(false)
  const [deliveryType, setDeliveryType] = useState("grocery_now")
  const [loadingMiles, setLoadingMiles] = useState(false)

  // YOUR STORE LOCATION - CHANGE THIS TO YOUR ACTUAL STORE!
  const STORE_LAT = 40.7128 // New York City - change to your store lat
  const STORE_LNG = -74.0060 // NYC lng

  // AUTO CALCULATE DISTANCE FROM ADDRESS
  async function calculateDistanceFromAddress() {
    if (!address) return alert("Enter address first!")
    setLoadingMiles(true)
    try {
      // FREE geocoding - OpenStreetMap
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      const data = await res.json()
      if (!data[0]) { alert("Address not found, try: 10001 or Brooklyn, NY"); setLoadingMiles(false); return; }
     
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
     
      // Haversine distance (miles)
      const R = 3959 // Earth radius miles
      const dLat = (lat - STORE_LAT) * Math.PI / 180
      const dLng = (lng - STORE_LNG) * Math.PI / 180
      const a = Math.sin(dLat/2)**2 + Math.cos(STORE_LAT*Math.PI/180)*Math.cos(lat*Math.PI/180)*Math.sin(dLng/2)**2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const distance = R * c

      setMiles(parseFloat(distance.toFixed(1)))
    } catch (e) {
      alert("Error getting distance - enter manually")
    }
    setLoadingMiles(false)
  }

  async function useMyLocation() {
    setLoadingMiles(true)
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      const R = 3959
      const dLat = (lat - STORE_LAT) * Math.PI / 180
      const dLng = (lng - STORE_LNG) * Math.PI / 180
      const a = Math.sin(dLat/2)**2 + Math.cos(STORE_LAT*Math.PI/180)*Math.cos(lat*Math.PI/180)*Math.sin(dLng/2)**2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const distance = R * c
      setMiles(parseFloat(distance.toFixed(1)))
      setAddress(`My GPS Location (${distance.toFixed(1)} miles)`)
      setLoadingMiles(false)
    }, () => { alert("GPS denied - type address"); setLoadingMiles(false) })
  }

  // YOUR DELIVERY FORMULA
  let deliveryCharge = 0
  if (deliveryType === "pickup") deliveryCharge = 0
  else if (deliveryType === "normal") deliveryCharge = 7
  else {
    const base = 10
    const shoppingExtra = Math.max(0, Math.ceil(cartTotal / 20) - 1) * 5
    const milesExtra = miles <= 1 ? 0 : Math.ceil(miles - 1) * 5
    const upstairsExtra = isUpstairs ? Math.ceil(cartTotal / 20) * 5 : 0
    deliveryCharge = base + shoppingExtra + milesExtra + upstairsExtra
  }

  const finalTotal = cartTotal + deliveryCharge

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="font-black mb-4">AUTO-DISTANCE DELIVERY</h1>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Enter delivery address: e.g. 123 Main St, Brooklyn NY 11201" className="w-full bg-black border border-gray-700 p-3 rounded text-sm mb-2"/>
        <div className="flex gap-2">
          <Button onClick={calculateDistanceFromAddress} disabled={loadingMiles} className="flex-1 bg-yellow-400 text-black font-bold h-10">{loadingMiles?"Calculating...":`📍 Calculate Miles (${miles} mi)`}</Button>
          <Button onClick={useMyLocation} variant="outline" className="border-gray-700">📲 Use GPS</Button>
        </div>
        <div className="text-xs text-green-400 mt-2">Auto Distance: {miles} miles from your NYC store</div>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4 space-y-2">
        <div onClick={()=>setDeliveryType("grocery_now")} className={`p-3 border rounded cursor-pointer ${deliveryType==="grocery_now"?"border-yellow-400":"border-gray-700"}`}>🚀 Grocery RIGHT NOW - ${deliveryCharge} (Base $10 + shopping + {miles} miles)</div>
        <div onClick={()=>setDeliveryType("normal")} className={`p-3 border rounded cursor-pointer ${deliveryType==="normal"?"border-yellow-400":"border-gray-700"}`}>📦 Normal All Items - $7 flat</div>
        <div onClick={()=>setDeliveryType("pickup")} className={`p-3 border rounded cursor-pointer ${deliveryType==="pickup"?"border-yellow-400":"border-gray-700"}`}>🚗 Pickup FREE</div>
        <label className="flex items-center gap-2 text-sm pt-2"><input type="checkbox" checked={isUpstairs} onChange={e=>setIsUpstairs(e.target.checked)}/> Upstairs? (+$5 per $20)</label>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm mt-2"><span>Delivery ({miles} miles)</span><span>${deliveryCharge.toFixed(2)}</span></div>
        <div className="flex justify-between font-black text-lg border-t border-gray-700 pt-2 mt-3"><span>TOTAL</span><span className="text-yellow-400">${finalTotal.toFixed(2)}</span></div>
        <Button className="w-full mt-4 bg-yellow-400 text-black font-black h-12 rounded-full">PAY ${finalTotal.toFixed(2)}</Button>
      </div>
    </div>
  )
} 
