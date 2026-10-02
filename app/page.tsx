"use client"
import { useState, useEffect } from "react"

export default function Home(){
const [products, setProducts] = useState<any[]>([
  {id:"1", name:"Gold Jhumka Earrings", price:"25", image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500"},
  {id:"2", name:"Bridal Jhumka Set", price:"45", image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500"},
  {id:"3", name:"Oxidized Silver Jhumka", price:"18", image:"https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500"},
])

function buy(p:any){
  const url = `/checkout?id=${p.id}&name=${encodeURIComponent(p.name)}&price=${p.price}&image=${encodeURIComponent(p.image)}`
  window.location.href = url
}

return(
  <div className="min-h-screen bg-black text-white p-4">
   <h1 className="text-yellow-400 font-black text-3xl text-center py-6">JHUMMKA BAZAAR</h1>
   <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
    {products.map((p)=>(
     <div key={p.id} className="bg-white text-black rounded-lg p-3">
      <img src={p.image} className="w-full h-40 object-cover rounded"/>
      <div className="font-bold mt-2 text-pink-700">{p.name}</div>
      <div className="text-yellow-600 font-bold">${p.price}</div>
      <button onClick={()=>buy(p)} className="bg-yellow-400 text-black font-bold w-full py-2 rounded-full mt-2 text-sm">Shop Now</button>
     </div>
    ))}
   </div>
  </div>
)
} 
