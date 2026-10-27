"use client"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function CheckoutPage() {
  const { items, cartTotal } = useCart() as any
  const [address, setAddress] = useState("")
  const [miles, setMiles] = useState(1)
  const [isUpstairs, setIsUpstairs] = useState(false)
  const [deliveryType, setDeliveryType] = useState("grocery_now")
  const [loadingMiles, setLoadingMiles] = useState(false)
  const [autoCalculated, setAutoCalculated] = useState(false)

  // YOUR STORE - 1196 Liberty Ave, Ozone Park, NY 11416
  const STORE_LAT = 40.6829
  const STORE_LNG = -73.8483
  const STORE_ADDRESS = "1196 Liberty Ave, Ozone Park, NY 11416"

  // 1. AUTO-FILL from saved address on load
  useEffect(() => {
    const savedAddress = localStorage.getItem("customer_delivery_address")
    const savedMiles = localStorage.getItem("customer_delivery_miles")
   
    // Try profile address if you have auth - uncomment if you have user
    // const profileAddress = user?.address || user?.profile?.address
   
    if (savedAddress) {
      setAddress(savedAddress)
      if (savedMiles) setMiles(parseFloat(savedMiles))
      // Auto calculate on load like Uber
      setTimeout(() => {
        calculateDistanceFromAddress(savedAddress)
      }, 500)
    }
  }, [])

  // Save address for next time
  function saveAddress(newAddress: string, newMiles: number) {
    localStorage.setItem("customer_delivery_address", newAddress)
    localStorage.setItem("customer_delivery_miles", newMiles.toString())
  }

  async function calculateDistanceFromAddress(customAddress?: string) {
    const addrToUse = customAddress || address
    if (!addrToUse) return alert("Enter address first!")
    setLoadingMiles(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addrToUse)}`, {
        headers: { 'Accept-Language': 'en-US' }
      })
      const data = await res.json()
      if (!data[0]) {
        alert("Address not found - try: 87-01 101st Ave, Ozone Park NY 11416");
        setLoadingMiles(false);
        return;
      }
     
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      const R = 3959
      const dLat = (lat - STORE_LAT) * Math.PI / 180
      const dLng = (lng - STORE_LNG) * Math.PI / 180
      const a = Math.sin(dLat/2)**2 + Math.cos(STORE_LAT*Math.PI/180)*Math.cos(lat*Math.PI/180)*Math.sin(dLng/2)**2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const distance = R * c
      const finalMiles = parseFloat(distance.toFixed(1))
     
      setMiles(finalMiles)
      setAutoCalculated(true)
      saveAddress(addrToUse, finalMiles)
      setAddress(addrToUse) // update input if using saved
    } catch (e) {
      alert("Error - check internet")
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
      const finalMiles = parseFloat(distance.toFixed(1))
      const gpsAddr = `My Current Location (${finalMiles} miles away)`
      setMiles(finalMiles)
      setAddress(gpsAddr)
      saveAddress(gpsAddr, finalMiles)
      setAutoCalculated(true)
      setLoadingMiles(false)
    }, () => { alert("GPS denied - type address"); setLoadingMiles(false) })
  }

  // YOUR FORMULA
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
    <div className="min-h-screen bg-black text-white p-4 max-w-lg mx-auto">
      <h1 className="font-black mb-1 text-xl">🚀 AUTO-DISTANCE</h1>
      <p className="text-xs text-gray-400 mb-4">Store: {STORE_ADDRESS}</p>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4 border border-zinc-800">
        <label className="text-xs text-gray-400 mb-1 block">Delivery Address (auto-saved)</label>
        <input value={address} onChange={e=>setAddress(e.target.value)} onBlur={()=> address && calculateDistanceFromAddress()} placeholder="87-01 101st Ave, Ozone Park NY" className="w-full bg-black border border-gray-700 p-3 rounded text-sm mb-2 text-white"/>
        <div className="flex gap-2">
          <Button onClick={()=>calculateDistanceFromAddress()} disabled={loadingMiles} className="flex-1 bg-yellow-400 text-black font-bold h-12 text-sm">{loadingMiles?"Calculating...": autoCalculated ? `✓ ${miles} mi - Recalculate` : `📍 Calculate Miles`}</Button>
          <Button onClick={useMyLocation} variant="outline" className="border-gray-600 text-white h-12">📲 GPS</Button>
        </div>
        {autoCalculated && <div className="text-xs text-green-400 mt-2 font-bold animate-pulse">✓ Auto Distance: {miles} miles from {STORE_ADDRESS} (Saved for next order)</div>}
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4 space-y-2 border border-zinc-800">
        <div onClick={()=>setDeliveryType("grocery_now")} className={`p-3 border rounded cursor-pointer ${deliveryType==="grocery_now"?"border-yellow-400 bg-yellow-400/10":"border-gray-700"}`}>
          <div className="font-bold text-sm">🚀 RIGHT NOW - ${deliveryCharge.toFixed(2)}</div>
          <div className="text-[11px] text-gray-400">$10 + $5/$20 + $5/mile ({miles}mi) {isUpstairs?"+ upstairs":""}</div>
        </div>
        <div onClick={()=>setDeliveryType("normal")} className={`p-3 border rounded cursor-pointer ${deliveryType==="normal"?"border-yellow-400":"border-gray-700"}`}>📦 Normal - $7</div>
        <div onClick={()=>setDeliveryType("pickup")} className={`p-3 border rounded cursor-pointer ${deliveryType==="pickup"?"border-yellow-400":"border-gray-700"}`}>🚗 Pickup FREE</div>
        <label className="flex items-center gap-2 text-sm pt-2"><input type="checkbox" checked={isUpstairs} onChange={e=>setIsUpstairs(e.target.checked)}/> Upstairs? (+$5 per $20)</label>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm mt-2 font-bold"><span>Delivery ({miles} mi)</span><span className="text-yellow-400">${deliveryCharge.toFixed(2)}</span></div>
        <div className="flex justify-between font-black text-lg border-t border-gray-700 pt-2 mt-3"><span>TOTAL</span><span className="text-yellow-400">${finalTotal.toFixed(2)}</span></div>
        <Button className="w-full mt-4 bg-yellow-400 text-black font-black h-12 rounded-full">PAY ${finalTotal.toFixed(2)}</Button>
      </div>
    </div>
  )
} 
