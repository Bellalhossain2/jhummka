"use client"
import { useState, useEffect, useRef } from 'react'
import { ref, set, onValue, remove, get } from 'firebase/database'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import MusicPanel from '@/components/music-panel'
import TrimPanel from '@/components/trim-panel'

const PRODUCTS = [
  {id:1, name:"Fresh Guava", price:"0.8", image:"https://images.unsplash.com/photo-1536511132770-e5058c7fbf0a?w=400"},
  {id:2, name:"Pumpkin Fresh", price:"6-8", image:"https://images.unsplash.com/photo-1570586437263-160f0d94a200?w=400"},
  {id:3, name:"Barbie Kids Set", price:"20-4", image:"https://picsum.photos/400/400?random=3"},
  {id:4, name:"Barbie Pink Set", price:"3-4", image:"https://picsum.photos/400/400?random=4"},
  {id:5, name:"Green Saree", price:"151-3", image:"https://images.unsplash.com/photo-1583391733956-3750e72a19a5?w=400"},
  {id:6, name:"Dove Soap", price:"22-1", image:"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400"},
]

export default function Page() {
  const [cart, setCart] = useState<any[]>([])
  const [rooms, setRooms] = useState<any>({})
  const [showLive, setShowLive] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(1)
  const [isLive, setIsLive] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(PRODUCTS[0])
  const [selectedMusic, setSelectedMusic] = useState<any>(null)
  const [fullBlob, setFullBlob] = useState<Blob|null>(null)
  const localVid = useRef<HTMLVideoElement>(null)
  const mediaRecorder = useRef<MediaRecorder|null>(null)
  const recordedChunks = useRef<Blob[]>([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    onValue(ref(db, 'jhummka_shop_rooms_v24'), (s) => setRooms(s.val() || {}))
    return () => unsub()
  }, [])

  const loginGoogle = async () => {
    try { await signInWithPopup(auth, new GoogleAuthProvider()) }
    catch { alert("Enable Google in Firebase") }
  }

  const joinLive = async (roomNum: number, product?: any) => {
    if(!user){ alert("Login first"); return }
    if(product) setSelectedProduct(product)
    setSelectedRoom(roomNum)
    setShowLive(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
      if(localVid.current){ localVid.current.srcObject = stream; localVid.current.style.display='block' }
      recordedChunks.current = []
      mediaRecorder.current = new MediaRecorder(stream)
      mediaRecorder.current.ondataavailable = (e) => { if(e.data.size>0) recordedChunks.current.push(e.data) }
      mediaRecorder.current.start(1000)
      await set(ref(db, 'jhummka_shop_rooms_v24/room_'+roomNum), { seller: user.displayName, sellerId: user.uid, productId: product ? product.id : selectedProduct.id, productName: product ? product.name : selectedProduct.name, music: selectedMusic?.title || 'No Music', time: Date.now() })
      setIsLive(true)
    } catch(e:any){ alert(e.message) }
  }

  const leaveAndSave = async () => {
    if(mediaRecorder.current && mediaRecorder.current.state !== 'inactive'){
      mediaRecorder.current.stop()
      await new Promise(r=>setTimeout(r,600))
    }
    if(recordedChunks.current.length>0){
      const blob = new Blob(recordedChunks.current, {type:'video/webm'})
      setFullBlob(blob)
    }
    const snap = await get(ref(db, 'jhummka_shop_rooms_v24/room_'+selectedRoom))
    if(snap.exists() && snap.val().sellerId === user?.uid) await remove(ref(db, 'jhummka_shop_rooms_v24/room_'+selectedRoom))
    setIsLive(false)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="sticky top-0 bg-black text-white p-3 flex justify-between">
        <b className="text-yellow-400">jhummkaTok</b>
        <div className="flex gap-2">
          <button onClick={()=>setShowLive(true)} className="bg-green-500 text-black px-3 py-1 rounded-full text-xs">LIVE {Object.keys(rooms).length}</button>
          {!user ? <button onClick={loginGoogle} className="bg-white text-black px-3 py-1 rounded-full text-xs">Google Login</button> : <span className="text-xs">{user.displayName}</span>}
        </div>
      </div>
      <div className="p-2 grid grid-cols-2 gap-2">
        {PRODUCTS.map(p => (
          <div key={p.id} className="border rounded-lg overflow-hidden">
            <img src={p.image} alt={p.name} className="w-full h-32 object-cover" />
            <div className="p-2">
              <div className="font-bold text-xs">{p.name} - ${p.price}</div>
              <button onClick={()=>setCart([...cart, p])} className="w-full bg-black text-white text-xs py-2 rounded-full mt-1">Add to Cart</button>
              <button onClick={()=>joinLive((p.id % 15)+1, p)} className="w-full bg-green-500 text-black text-xs py-1 rounded-full mt-1 font-black">Live Sell This</button>
            </div>
          </div>
        ))}
      </div>
      {showLive && (
        <div className="fixed inset-0 bg-black/95 z-50 p-2 overflow-auto">
          <div className="bg-gray-900 max-w-md mx-auto rounded-2xl p-4 text-white">
            <div className="flex justify-between"><h3 className="font-black text-sm">15 Rooms - {selectedProduct.name}</h3><button onClick={()=>setShowLive(false)}>X</button></div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => {
                const data = rooms['room_'+n]
                return <div key={n} onClick={()=>setSelectedRoom(n)} className="p-2 rounded-xl text-xs text-center border-2 border-gray-600 cursor-pointer">Room {n}<br/><small>{data ? data.seller : 'Empty'}</small></div>
              })}
            </div>
            <div className="relative w-full h-64 bg-black rounded-xl mt-3 border">
              <video ref={localVid} autoPlay muted playsInline className="w-full h-full object-cover hidden" />
              {!isLive && <div className="flex h-full items-center justify-center opacity-60">Camera - Go Live</div>}
              {isLive && <div className="absolute bottom-2 left-2 bg-red-600 px-2 py-1 rounded-full text-xs">REC Room {selectedRoom}</div>}
            </div>
            <MusicPanel onSelect={(song)=> setSelectedMusic(song)} />
            <TrimPanel productId={selectedProduct.id} fullBlob={fullBlob} />
            <div className="flex gap-2 mt-3">
              <button onClick={()=>joinLive(selectedRoom)} className="flex-1 bg-green-500 text-black font-black p-3 rounded-xl text-xs">Live + Auto Save</button>
              <button onClick={leaveAndSave} className="flex-1 bg-gray-700 font-black p-3 rounded-xl text-xs">Leave & Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
