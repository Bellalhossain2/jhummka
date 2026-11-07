"use client"
import { useState, useEffect, useRef } from 'react'
import { ref, set, onValue, remove, get } from 'firebase/database'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import Peer from 'peerjs'

// Your products from screenshot + more
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
  const d = new Date(dateStr); const diff = Date.now() - d.getTime()
  const sec = Math.floor(diff/1000); if(sec<60) return `${sec} sec ago`
  const min = Math.floor(sec/60); if(min<60) return `${min} min ago`
  const hr = Math.floor(min/60); if(hr<24) return `${hr} hour${hr>1?'s':''} ago`
  const day = Math.floor(hr/24); if(day<365) return `${day} day${day>1?'s':''} ago`
  return `${Math.floor(day/365)} year${Math.floor(day/365)>1?'s':''} ago`
} catch { return dateStr }
}

export default function JhummkaShopLive() {
  const [cart, setCart] = useState<any[]>([])
  const [rooms, setRooms] = useState<any>({})
  const [showLive, setShowLive] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(1)
  const [isLive, setIsLive] = useState(false)
  const [adMode, setAdMode] = useState<'stop'|'both'|'bottom'>('stop')
  const [user, setUser] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(PRODUCTS[0])
  const [selectedMusic, setSelectedMusic] = useState<any>(null)
  const [showMusic, setShowMusic] = useState(false)
  const [musicUsage, setMusicUsage] = useState<any>({})
  const [fullBlob, setFullBlob] = useState<Blob|null>(null)

  const localVid = useRef<HTMLVideoElement>(null)
  const previewAudio = useRef<HTMLAudioElement>(null)
  const mediaRecorder = useRef<MediaRecorder|null>(null)
  const recordedChunks = useRef<Blob[]>([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    onValue(ref(db, 'jhummka_shop_rooms_v24'), (snap) => setRooms(snap.val() || {}))
    setMusicUsage(JSON.parse(localStorage.getItem('jhumma_music_usage')||'{}'))
    return () => unsub()
  }, [])

  const loginGoogle = async () => {
    try { await signInWithPopup(auth, new GoogleAuthProvider()) }
    catch { alert("Enable Google: Firebase Console -> Auth -> Sign-in method -> Google -> Enable + Add jhummka.vercel.app to Authorized domains") }
  }

  const joinLive = async (roomNum: number, product?: any) => {
    if(!user){ alert("Login with Google first!"); return }
    if(product) setSelectedProduct(product)
    setSelectedRoom(roomNum); setShowLive(true)
    const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
    if(localVid.current){ localVid.current.srcObject = stream; localVid.current.style.display='block' }
    recordedChunks.current = []
    try { mediaRecorder.current = new MediaRecorder(stream) } catch { mediaRecorder.current = new MediaRecorder(stream) }
    mediaRecorder.current.ondataavailable = (e) => { if(e.data.size>0) recordedChunks.current.push(e.data) }
    mediaRecorder.current.start(1000)
    const newPeer = new Peer(`shop_${roomNum}_${user.uid}_${Date.now()}`)
    newPeer.on('open', async (id) => {
      await set(ref(db, `jhummka_shop_rooms_v24/room_${roomNum}`), {
        seller: user.displayName, sellerId: user.uid, photo: user.photoURL,
        productId: product?.id || selectedProduct.id, productName: product?.name || selectedProduct.name,
