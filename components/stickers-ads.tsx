"use client"
import { useState } from 'react'

const STICKERS = ["😍","❤️","🔥","💯","🎉","👑","💋","🌟","😂","🥺","😎","🤩","💖","✨","🙏","👏","😘","🥰","🤗","😜"]

export default function StickersAds({ onAdChange, onSticker }: { onAdChange: (mode:string)=>void, onSticker: (s:string)=>void }) {
  const [adMode, setAdMode] = useState('stop')
  const [activeStickers, setActiveStickers] = useState<string[]>([])

  const setAd = (mode: string) => {
    setAdMode(mode)
    onAdChange(mode)
  }

  const addSticker = (s: string) => {
    setActiveStickers([...activeStickers, s].slice(-5))
    onSticker(s)
  }

  return (
    <div className="border border-pink-600 rounded-lg p-2 mt-2 bg-black">
      <b className="text-xs text-white">🎨 Stickers 20 + Ads 3 Modes</b>
     
      {/* TOP AD PREVIEW */}
      {adMode!=='stop' && (
        <div className="bg-yellow-400 text-black text-[10px] font-black p-1 text-center rounded mt-1">
          TOP AD - Buy Now! jhummkaTok Shop - Active
        </div>
      )}

      <div className="flex gap-1 flex-wrap mt-2">
        {STICKERS.map(s => (
          <span
            key={s}
            onClick={()=>addSticker(s)}
            className="text-xl p-1 border border-gray-700 rounded-lg bg-gray-800 cursor-pointer hover:bg-pink-800"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="text-[10px] text-gray-400 mt-1">
        Active on video: {activeStickers.join(' ') || 'None - Click to add'} | Max 5
      </div>

      {/* BOTTOM AD PREVIEW */}
      {(adMode==='both' || adMode==='bottom') && (
        <div className="bg-green-400 text-black text-[10px] font-black p-1 text-center rounded mt-1">
          BOTTOM AD - Free Shipping - jhummkaTok
        </div>
      )}

      <div className="grid grid-cols-3 gap-1 mt-2">
        <button onClick={()=>setAd('both')} className={`p-2 rounded-lg text-[10px] font-black ${adMode==='both'?'bg-yellow-400 text-black':'bg-gray-700 text-white'}`}>Top+Bottom</button>
        <button onClick={()=>setAd('bottom')} className={`p-2 rounded-lg text-[10px] font-black ${adMode==='bottom'?'bg-green-400 text-black':'bg-gray-700 text-white'}`}>Bottom Only</button>
        <button onClick={()=>setAd('stop')} className={`p-2 rounded-lg text-[10px] ${adMode==='stop'?'bg-red-500 text-white':'bg-gray-700 text-white'}`}>Stop Ads</button>
      </div>

      <div className="text-[8px] text-gray-500 mt-1">
        3 Ad Modes: Top = banner top, Bottom = banner bottom, Both = double ad revenue
      </div>
    </div>
  )
} 
