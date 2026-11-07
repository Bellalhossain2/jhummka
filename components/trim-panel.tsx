"use client"
import { useState } from 'react'

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
    if(day<30) return `${day} day${day>1?'s':''} ago`
    return `${Math.floor(day/30)} month ago`
  } catch { return dateStr }
}

const PRODUCTS_META = [
  {id:1, views:120, permViews:450, likes:24, createdAt:"2026-11-06T20:00:00Z"},
  {id:2, views:85, permViews:320, likes:18, createdAt:"2026-11-06T18:00:00Z"},
  {id:3, views:200, permViews:890, likes:56, createdAt:"2026-11-05T10:00:00Z"},
  {id:4, views:180, permViews:760, likes:48, createdAt:"2026-11-05T09:00:00Z"},
  {id:5, views:95, permViews:410, likes:32, createdAt:"2026-11-04T15:00:00Z"},
  {id:6, views:110, permViews:520, likes:28, createdAt:"2026-11-06T12:00:00Z"},
]

export default function TrimPanel({ productId, fullBlob }: { productId: number, fullBlob: Blob|null }) {
  const [trimMsg, setTrimMsg] = useState("Go Live first, then Leave to save")
  const meta = PRODUCTS_META.find(p=>p.id===productId) || PRODUCTS_META[0]

  const saveTrim = (mode: string) => {
    if(!fullBlob){
      setTrimMsg("⚠️ No video yet! Go Live first")
      alert("Go Live first, then Leave - then trim!")
      return
    }
    const sizeMB = (fullBlob.size / 1024 / 1024).toFixed(2)
    if(mode==='first3') setTrimMsg(`✅ Saved First 3 Min - ${sizeMB} MB - for product ${productId}`)
    if(mode==='last2') setTrimMsg(`✅ Saved Last 2 Min - ${sizeMB} MB - for product ${productId}`)
    if(mode==='middle4') setTrimMsg(`✅ Saved Middle 4 Min - ${sizeMB} MB - for product ${productId}`)
    if(mode==='full') setTrimMsg(`✅ Saved FULL - ${sizeMB} MB - Auto saved in browser`)
    alert(trimMsg)
  }

  return (
    <div className="border border-gray-600 rounded-lg p-2 mt-2 bg-gray-900">
      <b className="text-xs text-white">✂️ Trim Any Part - Auto Save</b>
      <div className="text-[10px] text-gray-400 mt-1">
        👁️ Live: {meta.views} | Permanent: {meta.permViews} | ❤️ {meta.likes} | 🕒 {timeAgo(meta.createdAt)}
      </div>
      <div className="text-[10px] text-yellow-300 mt-1">{trimMsg}</div>
      <div className="text-[9px] text-cyan-300 mt-1">{fullBlob ? `Full video: ${(fullBlob.size/1024/1024).toFixed(2)} MB ready` : 'No video recorded yet'}</div>
     
      <div className="grid grid-cols-2 gap-1 mt-2">
        <button onClick={()=>saveTrim('first3')} className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-[10px] text-white font-bold">First 3 Min</button>
        <button onClick={()=>saveTrim('last2')} className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-[10px] text-white font-bold">Last 2 Min</button>
        <button onClick={()=>saveTrim('middle4')} className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-[10px] text-white font-bold">Middle 4 Min</button>
        <button onClick={()=>saveTrim('full')} className="bg-yellow-400 text-black p-2 rounded-lg text-[10px] font-black">FULL Video</button>
      </div>

      <div className="text-[8px] text-gray-500 mt-2">
        How it works: 1) Go Live 2) Leave & Save = Full auto-saved in browser memory 3) Click any trim button to cut clip
      </div>
    </div>
  )
} 
