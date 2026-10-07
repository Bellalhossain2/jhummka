"use client"
import { useState, useEffect } from "react"

export default function AdminPage(){
  const [name,setName]=useState("")
  const [price,setPrice]=useState("")
  const [category,setCategory]=useState("jewelry")
  const [msg,setMsg]=useState("")
  const [list,setList]=useState<any[]>([])

  useEffect(()=>{
    const saved=localStorage.getItem("jhummka_products")
    if(saved) setList(JSON.parse(saved))
  },[])

  function add(){
    if(!name||!price) {setMsg("Enter name & price"); return}
    const newP={name,price:Number(price),cat:category,img:"https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400",sold:"New"}
    const updated=[newP,...list]
    setList(updated)
    localStorage.setItem("jhummka_products",JSON.stringify(updated))
    // Also save for main page
    const all=localStorage.getItem("admin_products")
    const arr=all?JSON.parse(all):[]
    localStorage.setItem("admin_products",JSON.stringify([...arr,newP]))
    setMsg("✅ Added! Now shows on shop!")
    setName(""); setPrice("")
  }

  function clearAll(){
    localStorage.removeItem("jhummka_products")
    localStorage.removeItem("admin_products")
    setList([]); setMsg("Cleared")
  }

  return(
    <div style={{padding:20,maxWidth:700,margin:"0 auto",background:"#fff",minHeight:"100vh",color:"#000"}}>
      <h1 style={{fontWeight:"bold",fontSize:24}}>JHUMMKA Admin v4 FIXED</h1>
      <p style={{color:"green"}}>{msg}</p>
      <div style={{border:"2px solid #000",padding:20,marginTop:15}}>
        <label>Product Name:</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Temple Gold Jhumka" style={{width:"100%",padding:10,border:"1px solid #999",marginBottom:10}}/>
        <label>Price in USD:</label>
        <input value={price} onChange={e=>setPrice(e.target.value)} type="number" placeholder="1200" style={{width:"100%",padding:10,border:"1px solid #999",marginBottom:10}}/>
        <label>Category:</label>
        <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:"100%",padding:10,border:"1px solid #999",marginBottom:10}}>
          <option value="electronics">electronics</option>
          <option value="jewelry">jewelry</option>
          <option value="beauty">beauty</option>
          <option value="fashion">fashion</option>
          <option value="toys">toys</option>
          <option value="home">home</option>
          <option value="barber">barber</option>
          <option value="kids">kids</option>
          <option value="household">household</option>
          <option value="bags">bags</option>
          <option value="sports">sports</option>
          <option value="men">men</option>
          <option value="women">women</option>
          <option value="grocery">grocery</option>
          <option value="kitchen">kitchen</option>
          <option value="books">books</option>
        </select>
        <button onClick={add} style={{background:"#ffbf00",padding:12,width:"100%",fontWeight:"bold",marginTop:10}}>Add Product</button>
        <button onClick={clearAll} style={{background:"#000",color:"#fff",padding:8,width:"100%",marginTop:10}}>Clear All Custom</button>
      </div>

      <h3 style={{marginTop:20,fontWeight:"bold"}}>Your Products ({list.length}):</h3>
      {list.map((p,i)=><div key={i} style={{border:"1px solid #ddd",padding:8,marginTop:5}}>{p.name} - ${p.price} - {p.cat}</div>)}
      <div style={{marginTop:20}}>
        <a href="/" style={{background:"black",color:"white",padding:10}}>Go to Shop</a>
      </div>
    </div>
  )
} 
