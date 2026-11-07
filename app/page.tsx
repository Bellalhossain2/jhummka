"use client"
import { useState } from "react"

const PRODUCTS = [
  {id:1, name:"Gold Jhumka Earrings", price:"12,500", image:"https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400"},
  {id:2, name:"Bridal Jhumka Set", price:"25,000", image:"https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400"},
  {id:3, name:"Traditional Jhumka", price:"18,500", image:"https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400"},
  {id:4, name:"Designer Jhumka", price:"15,000", image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"},
]

export default function Page(){
  const [cart,setCart]=useState<any[]>([])
  return (
    <div style={{minHeight:'100vh', background:'white', color:'black'}}>
      <div style={{position:'sticky', top:0, background:'black', color:'white', padding:'12px', display:'flex', justifyContent:'space-between'}}>
        <b style={{color:'#facc15'}}>Jhummka - Gold Jewelry</b>
        <span>Cart ({cart.length})</span>
      </div>
      <div style={{padding:'8px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
        {PRODUCTS.map(p=>(
          <div key={p.id} style={{border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden'}}>
            <img src={p.image} alt={p.name} style={{width:'100%', height:'130px', objectFit:'cover'}}/>
            <div style={{padding:'8px'}}>
              <div style={{fontWeight:'bold', fontSize:'12px'}}>{p.name} - ৳{p.price}</div>
              <button onClick={()=>setCart([...cart,p])} style={{width:'100%', background:'black', color:'white', fontSize:'12px', padding:'8px', borderRadius:'20px', marginTop:'8px'}}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:'16px', textAlign:'center', fontSize:'11px', color:'gray'}}>
        Contact: jhummka.shop@gmail.com | Privacy | About<br/>Authentic Gold Jewelry Since 2024
      </div>
    </div>
  )
} 
