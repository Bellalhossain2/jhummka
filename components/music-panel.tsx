"use client"
import { useState, useEffect } from 'react'

const SONGS = [
{id:"s1",title:"Trending Beat 1",artist:"DJ Bellal",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",uses:120},
{id:"s2",title:"Love Vibe",artist:"Jhumka",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",uses:98},
{id:"s3",title:"Dance Floor",artist:"TikTok Hit",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",uses:85},
{id:"s4",title:"Chill LoFi",artist:"LoFi Girl",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",uses:70},
{id:"s5",title:"Energetic",artist:"Power",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",uses:65},
{id:"s6",title:"Romantic",artist:"Love Songs",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",uses:60},
{id:"s7",title:"Hip Hop",artist:"Urban",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",uses:55},
{id:"s8",title:"Bengali Beat",artist:"Dhaka",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",uses:50},
{id:"s9",title:"Bollywood Hit",artist:"Mumbai",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",uses:45},
{id:"s10",title:"Viral TikTok",artist:"Viral",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",uses:40},
{id:"s11",title:"Party Anthem",artist:"Party",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",uses:38},
{id:"s12",title:"Sad Song",artist:"Emo",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",uses:35},
{id:"s13",title:"Happy Day",artist:"Joy",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",uses:32},
{id:"s14",title:"Trap Beat",artist:"Trap",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",uses:30},
{id:"s15",title:"Acoustic",artist:"Guitar",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",uses:28},
{id:"s16",title:"EDM Drop",artist:"EDM",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",uses:25},
{id:"s17",title:"Piano Chill",artist:"Piano",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3",uses:22},
{id:"s18",title:"Bass Boosted",artist:"Bass",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3",uses:20},
{id:"s19",title:"Morning Vibe",artist:"Morning",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3",uses:18},
{id:"s20",title:"Night Drive",artist:"Night",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3",uses:15},
]

export default function MusicPanel({ onSelect }: { onSelect: (song:any)=>void }) {
  const [usage, setUsage] = useState<any>({})
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    setUsage(JSON.parse(localStorage.getItem('jhumma_music_usage')||'{}'))
  }, [])

  const sorted = [...SONGS].sort((a,b)=> (usage[b.id]||b.uses) - (usage[a.id]||a.uses))

  return (
    <div className="border border-yellow-600 rounded-lg p-2 mt-2 bg-black">
      <b className="text-xs text-white">🎵 Music Library - 20 Songs - Trending First</b>
      <div className="text-[9px] opacity-60 text-white">Selected: {selected ? selected.title : 'None'} - Trending sorted by uses</div>
      <div className="max-h-[220px] overflow-auto mt-2">
        {sorted.map((s,i)=>(
          <div key={s.id} onClick={()=>{
            setSelected(s)
            const newU = {...usage, [s.id]:(usage[s.id]||s.uses)+1}
            setUsage(newU)
            localStorage.setItem('jhumma_music_usage', JSON.stringify(newU))
            onSelect(s)
          }} className={`p-2 border rounded-lg my-1 cursor-pointer flex justify-between ${i<3?'border-yellow-400 bg-yellow-900/30':'border-gray-700 bg-gray-800'}`}>
            <div><b className="text-xs text-white">{i<3?'🔥 ':''}{s.title}</b><br/><small className="text-[10px] text-gray-400">{s.artist} | Used {usage[s.id]||s.uses} times {i<3?'| TRENDING':''}</small></div>
            <button className="bg-cyan-400 text-black px-2 py-1 rounded-full text-[10px] font-black">Use</button>
          </div>
        ))}
      </div>
    </div>
  )
} 
