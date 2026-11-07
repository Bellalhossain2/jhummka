"use client"
import { useState, useEffect, useRef } from 'react'
import { ref, set, onValue, remove, get } from 'firebase/database'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'

const PRODUCTS = [
  {id:1, name:"Fresh Guava", price:"0.8", image:"https://images.unsplash.com/photo-1536511132770-e5058c7fbf0a?w=400", views:120, permViews:450, likes:24, createdAt:"2026-11-06T20:00:00Z"},
  {id:2, name:"Pumpkin Fresh", price:"6-8", image:"https://images.unsplash.com/photo-1570586437263-160f0d94a200?w=400", views:85, permViews:320, likes:18, createdAt:"2026-11-06T18:00:00Z"},
  {id:3, name:"Barbie Kids Set", price:"20-4", image:"https://i.imgur.com/8Km9tLL.jpg", views:200, permViews:890, likes:56, createdAt:"2026-11-05T10:00:00Z"},
  {id:4, name:"Barbie Pink Set", price:"3-4", image:"https://i.imgur.com/8Km9tLL.jpg", views:180, permViews:760, likes:48, createdAt:"2026-11-05T09:00:00Z"},
  {id:5, name:"Green Saree", price:"151-3", image:"https://images.unsplash.com/photo-1583391733956-3750e72a19a5?w=400", views:95, permViews:410, likes:32, createdAt:"2026-11-04T15:00:00Z"},
  {id:6, name:"Dove Soap", price:"22-1", image:"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400", views:110, permViews:520, likes:28, createdAt:"2026-11-06T12:00:00Z"},
  {id:7, name:"Car Mount", price:"30-6", image:"https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400", views:70, permViews:280, likes:15, createdAt:"2026-11-03T08:00:00Z"},
  {id:8, name:"Phone Holder", price:"17-0", image:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", views:65, permViews:250, likes:12, createdAt:"2026-11-02T14:00:00Z"},
  {id:9, name:"Axe Body Spray", price:"13-6", image:"https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400", views:150, permViews:620, likes:38, createdAt:"2026-11-06T16:00:00Z"},
  {id:10, name:"Keychain", price:"8-5", image:"https://images.unsplash.com/photo-1590732596287-4a7d3d0c3f48?w=400", views:40, permViews:180, likes:9, createdAt:"2026-11-01T11:00:00Z"},
]

const STICKERS = ["😍","❤️","🔥","💯","🎉","👑","💋","🌟","😂","🥺","😎","🤩","💖","✨","🙏","👏","😘","🥰","🤗","😜"]
const SONGS = [
{id:"s1",title:"Trending Beat 1",artist:"DJ Bellal",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",uses:120},
{id:"s2",title:"Love Vibe",artist:"Jhumka",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",uses:98},
{id:"s3",title:"Dance Floor",artist:"TikTok Hit",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",uses:85},
]

function timeAgo(dateStr: string) {
try {
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()
  const sec = Math.floor(diff/1000)
  if(sec<60) return `${sec} sec ago`
  const min = Math.floor(sec/60)
  if(min<60) return `${min} min ago`
  const hr = Math.floor(min/60)
  if(hr<24) return `${hr} hour${hr>1?'s':''} ago`
  const day = Math.floor(hr/24)
  if(day<365) return `${day} day${day>1?'s':''} ago`
  return `${Math.floor(day/365)} year ago`
} catch { return dateStr }
}

export default function Page() {
  const [cart, setCart] = useState<any[]>([])
  const [rooms, setRooms] = useState<any>({})
  const [showLive, setShowLive] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(1)
  const [isLive, setIsLive] = useState(false)
  const [adMode, setAdMode] = useState('stop')
  const [user, setUser] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(PRODUCTS[0])
  const [selectedMusic, setSelectedMusic] = useState<any>(null)
  const [showMusic, setShowMusic] = useState(false)
  const [fullBlob, setFullBlob] = useState<Blob|null>(null)
  const [musicUsage, setMusicUsage] = useState<any>({})

  const localVid = useRef<HTMLVideoElement>(null)
  const mediaRecorder = useRef<MediaRecorder|null>(null)
  const recordedChunks = useRef<Blob[]>([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    const roomsRef = ref(db, 'jhummka_shop_rooms_v24')
    onValue(roomsRef, (snap) => setRooms(snap.val() || {}))
    setMusicUsage(JSON.parse(localStorage.getItem('jhumma_music_usage')||'{}'))
    return () => unsub()
  }, [])

  const loginGoogle = async () => {
    try { await signInWithPopup(auth, new GoogleAuthProvider()) }
    catch { alert("Enable Google in Firebase Console -> Authentication -> Sign-in method -> Google -> Enable") }
  }

  const joinLive = async (roomNum: number, product?: any) => {
    if(!user){ alert("Login with Google first!"); return }
    if(product) setSelectedProduct(product)
    setSelectedRoom(roomNum)
    setShowLive(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
      if(localVid.current){
        localVid.current.srcObject = stream
        localVid.current.style.display='block'
      }
      recordedChunks.current = []
      mediaRecorder.current = new MediaRecorder(stream)
      mediaRecorder.current.ondataavailable = (e) => { if(e.data.size>0) recordedChunks.current.push(e.data) }
      mediaRecorder.current.start(1000)
     
      const roomRef = ref(db, `jhummka_shop_rooms_v24/room_${roomNum}`)
      await set(roomRef, {
        seller: user.displayName,
        sellerId: user.uid,
        photo: user.photoURL,
        productId: product ? product.id : selectedProduct.id,
        productName: product ? product.name : selectedProduct.name,
        price: product ? product.price : selectedProduct.price,
        time: Date.now(),
        music: selectedMusic
      })
      setIsLive(true)
    } catch(e:any){ alert("Camera error: "+e.message) }
  }

  const leaveAndSave = async () => {
    if(mediaRecorder.current && mediaRecorder.current.state !== 'inactive'){
      mediaRecorder.current.stop()
      await new Promise(r=>setTimeout(r,800))
    }
    if(recordedChunks.current.length>0){
      const blob = new Blob(recordedChunks.current, {type:'video/webm'})
      setFullBlob(blob)
      alert(`AUTO-SAVED! Live for ${selectedProduct.name}`)
    }
    const roomRef = ref(db, `jhummka_shop_rooms_v24/room_${selectedRoom}`)
    const snap = await get(roomRef)
    if(snap.exists() && snap.val().sellerId === user?.uid) await remove(roomRef)
    setIsLive(false)
  }

  const saveTrim = (mode: string) => {
    if(!fullBlob){ alert("Go Live first, then Leave"); return }
    alert(`Trim Saved! ${mode} clip for ${selectedProduct.name}`)
  }

  const addToCart = (p:any) => { setCart([...cart, p]); alert(`${p.name} added!`) }

  const sortedSongs = [...SONGS].sort((a,b)=> (musicUsage[b.id]||b.uses) - (musicUsage[a.id]||a.uses))

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="sticky top-0 z-40 bg-black text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <b className="text-yellow-400">jhummka<span className="text-white">Tok</span></b>
          <span className="bg-white text-black px-2 py-1 rounded-full text-xs font-black">ALL</span>
          <span className="text-xs">🛒 {cart.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={user?.photoURL || "https://i.pravatar.cc/40"} className="w-8 h-8 rounded-full" alt="user" />
          <button onClick={()=>setShowLive(true)} className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-black">🔴 {Object.keys(rooms).length} LIVE</button>
          {!user ? <button onClick={loginGoogle} className="bg-white text-black px-3 py-1 rounded-full text-xs font-black">Google Login</button> : <span className="text-xs">{user.displayName}</span>}
        </div>
      </div>

      <div className="p-2 grid grid-cols-2 md:grid-cols-5 gap-2">
        {PRODUCTS.map(p => {
          const liveRoom: any = Object.values(rooms).find((r:any)=> r.productId === p.id)
          return (
            <div key={p.id} className="border rounded-lg overflow-hidden bg-white shadow-sm relative">
              {liveRoom && <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-full animate-pulse z-10">🔴 LIVE</div>}
              <img src={p.image} alt={p.name} className="w-full h-32 object-cover" />
              <div className="p-2">
                <div className="text-[11px] opacity-60">${p.price} | 👁️ {p.permViews} | {timeAgo(p.createdAt)}</div>
                <div className="font-bold text-xs truncate">{p.name}</div>
                <div className="flex gap-1 mt-2">
                  <button onClick={()=>addToCart(p)} className="flex-1 bg-black text-white text-[10px] py-2 rounded-full font-bold">Add to Cart</button>
                  <button onClick={()=>addToCart(p)} className="flex-1 bg-yellow-400 text-black text-[10px] py-2 rounded-full font-bold">Buy Now</button>
                </div>
                <button onClick={()=>joinLive((p.id % 15)+1, p)} className="w-full mt-1 bg-green-500 text-black text-[10px] py-1 rounded-full font-black">🔴 Live Sell This</button>
              </div>
            </div>
          )
        })}
      </div>

      {showLive && (
        <div className="fixed inset-0 bg-black/95 z-50 p-2 overflow-auto">
          <div className="bg-[#1a1a1a] max-w-[700px] mx-auto rounded-2xl p-4 text-white border border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm">🔴 15 Rooms - {selectedProduct.name}</h3>
              <button onClick={()=>setShowLive(false)} className="text-2xl">X</button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => {
