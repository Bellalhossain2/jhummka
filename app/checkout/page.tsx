"use client"
export const dynamic = 'force-dynamic'
import { useState, useEffect } from "react"

export default function CheckoutPage() {
  const [address, setAddress] = useState("")
  const [drivingMiles, setDrivingMiles] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [cartTotal] = useState(45) // test $45 groceries

  const STORES = [
    { id: 1, name: "Ozone Park - 1196 Liberty Ave", lat: 40.6829, lng: -73.8483 },
    { id: 2, name: "Brooklyn - 774 Grand St", lat: 40.7112, lng: -73.9396 },
    { id: 3, name: "Brooklyn - 416 Crescent St", lat: 40.6789, lng: -73.9072 },
    { id: 4, name: "Jamaica - 168-07 Hillside Ave", lat: 40.7086, lng: -73.7962 },
  ]
  const [store, setStore] = useState(STORES[0])

  async function getMiles() {
    if (!address) return alert("Type customer address first!")
    setLoading(true)
    try {
      const geo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      const data = await geo.json()
      if (!data[0]) { alert("Address not found! Use full address like: 87-01 101st Ave, Queens, NY"); setLoading(false); return; }
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      const route = await fetch(`https://router.project-osrm.org/route/v1/driving/${lng},${lat};${store.lng},${store.lat}?overview=false`)
      const routeData = await route.json()
      let mi = 0
      if (routeData.routes?.[0]) mi = routeData.routes[0].distance / 1609.34
      else {
        const R=3959, dLat=(lat-store.lat)*Math.PI/180, dLng=(lng-store.lng)*Math.PI/180
        const a=Math.sin(dLat/2)**2+Math.cos(store.lat*Math.PI/180)*Math.cos(lat*Math.PI/180)*Math.sin(dLng/2)**2
        mi = R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
      }
      setDrivingMiles(parseFloat(mi.toFixed(1))); setDone(true)
    } catch(e){ alert("Error - try again") }
    setLoading(false)
  }

  const base=10, cartExtra=Math.max(0,Math.ceil(cartTotal/20)-1)*5, mileExtra=drivingMiles<=1?0:Math.ceil(drivingMiles-1)*5
  const fee=base+cartExtra+mileExtra
  const total=cartTotal+fee

  return (
    <div style={{minHeight:'100vh', background:'black', color:'white', padding:'16px', maxWidth:'500px', margin:'0 auto'}}>
      <h1 style={{fontWeight:'900', fontSize:'20px'}}>🏪 TEST MILES & FEE</h1>
     
      <div style={{background:'#18181b', padding:'16px', borderRadius:'12px', marginTop:'16px', border:'1px solid #333'}}>
        <label style={{fontSize:'12px', color:'#facc15', fontWeight:'bold'}}>SELECT STORE</label>
        <select value={store.id} onChange={e=>{setStore(STORES.find(s=>s.id.toString()===e.target.value)!); setDone(false)}} style={{width:'100%', background:'black', border:'1px solid #444', padding:'12px', borderRadius:'8px', color:'white', marginTop:'8px'}}>
          {STORES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div style={{background:'#18181b', padding:'16px', borderRadius:'12px', marginTop:'12px', border:'1px solid #333'}}>
        <label style={{fontSize:'12px', color:'#facc15', fontWeight:'bold'}}>CUSTOMER ADDRESS</label>
        <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="102-10 Atlantic Ave, Ozone Park, NY" style={{width:'100%', background:'black', border:'1px solid #facc15', padding:'12px', borderRadius:'8px', color:'white', marginTop:'8px'}}/>
        <button onClick={getMiles} disabled={loading} style={{width:'100%', background:'#facc15', color:'black', fontWeight:'900', padding:'14px', borderRadius:'8px', marginTop:'12px'}}>
          {loading ? "Calculating..." : done ? `✓ ${drivingMiles} mi to ${store.name}` : "📍 GET MILES & FEE"}
        </button>
        {done && (
          <div style={{background:'black', padding:'12px', borderRadius:'8px', marginTop:'12px', fontSize:'12px'}}>
            <div>Customer: {address}</div>
            <div style={{color:'#facc15', marginTop:'4px'}}>Store: {store.name}</div>
            <div style={{color:'#4ade80', fontWeight:'bold', marginTop:'8px', fontSize:'14px'}}>🚗 Driving: {drivingMiles} miles</div>
            <div style={{marginTop:'8px'}}>Fee: Base $10 + Cart ${cartExtra} + Miles ${drivingMiles}mi (${mileExtra}) = <span style={{color:'#facc15', fontWeight:'bold'}}>${fee}</span></div>
            <div style={{fontWeight:'900', fontSize:'16px', marginTop:'8px', borderTop:'1px solid #333', paddingTop:'8px'}}>TOTAL: Groceries ${cartTotal} + Fee ${fee} = ${total}</div>
          </div>
        )}
      </div>

      <div style={{background:'#18181b', padding:'12px', borderRadius:'8px', marginTop:'12px', fontSize:'11px', color:'#888'}}>
        How to check: 1) Select store 2) Type customer address 3) Click button 4) See miles & fee auto! Real driving distance Customer → Store.
      </div>
    </div>
  )
} 
