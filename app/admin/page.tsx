"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp } from "firebase/firestore"

export default function AdminPage(){
  const [name,setName]=useState("")
  const [price,setPrice]=useState("")
  const [desc,setDesc]=useState("")
  const [image,setImage]=useState("")
  const [loading,setLoading]=useState(false)
  const [msg,setMsg]=useState("")
  const [products,setProducts]=useState<any[]>([])

  const load = async()=>{
    const q = query(collection(db,"products"), orderBy("createdAt","desc"))
    const snap = await getDocs(q)
    setProducts(snap.docs.map(d=>({id:d.id,...(d.data() as any)})))
  }
  useEffect(()=>{load()},[])

  const onFile=(e:any)=>{
    const file=e.target.files?.[0]
    if(!file) return
    const img=new Image()
    const url=URL.createObjectURL(file)
    img.onload=()=>{
      const canvas=document.createElement("canvas")
      const MAX=700
      let w=img.width,h=img.height
      if(w>h){ if(w>MAX){ h=h*MAX/w; w=MAX; } } else { if(h>MAX){ w=w*MAX/h; h=MAX; } }
      canvas.width=w; canvas.height=h
      canvas.getContext("2d")?.drawImage(img,0,0,w,h)
      const data=canvas.toDataURL("image/jpeg",0.6)
      setImage(data)
      setMsg(`✅ Image compressed: ${Math.round(data.length/1024)}KB`)
      URL.revokeObjectURL(url)
    }
    img.src=url
  }

  const addProduct=async(e:any)=>{
    e.preventDefault()
    if(!name||!price||!image) return alert("Name, Price, Image required")
    setLoading(true)
    await addDoc(collection(db,"products"), {
      name,
      price:Number(price),
      description: desc || "22K Gold • Handcrafted • BIS Hallmarked",
      image,
      category:"Jhumkas",
      createdAt:serverTimestamp()
    })
    setName(""); setPrice(""); setDesc(""); setImage(""); setMsg("✅ Added!")
    setLoading(false); load()
  }

  const del = async(id:string)=>{
    if(!confirm("Delete?")) return
    await deleteDoc(doc(db,"products",id))
    load()
  }

  return(
    <div style={{minHeight:"100vh", background:"#0a0a0a", color:"#fff", padding:30, fontFamily:"sans-serif"}}>
      <div style={{maxWidth:900, margin:"0 auto"}}>
        <h1 style={{letterSpacing:4, margin:0}}>JHUMMKA ADMIN</h1>
        <a href="/" style={{color:"#C5A880", fontSize:12, textDecoration:"none"}}>← View Shop</a>

        <div style={{background:"#151515", border:"1px solid #222", padding:24, marginTop:20, borderRadius:8}}>
          <h3 style={{color:"#C5A880", marginTop:0}}>Add New Jhumka</h3>
          <form onSubmit={addProduct} style={{display:"grid", gap:12}}>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Product Name - e.g. Royal Temple Jhumka" style={{padding:14, background:"#000", border:"1px solid #333", color:"#fff", borderRadius:4}} />
            <input value={price} onChange={e=>setPrice(e.target.value)} type="number" placeholder="Price - e.g. 1299" style={{padding:14, background:"#000", border:"1px solid #333", color:"#fff", borderRadius:4}} />

            {/* NEW DESCRIPTION FIELD */}
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description - e.g. 22K Gold plated, Lightweight for daily wear, Temple design, Gift box included..." rows={3} style={{padding:14, background:"#000", border:"1px solid #333", color:"#fff", borderRadius:4, resize:"vertical"}} />

            <div style={{border:"1px dashed #444", padding:12, borderRadius:4}}>
              <label style={{fontSize:12, color:"#aaa"}}>Product Photo (auto compresses): </label>
              <input type="file" accept="image/*" onChange={onFile} style={{marginLeft:10, color:"#fff"}} />
              {msg && <p style={{color:"#C5A880", fontSize:11, margin:"8px 0 0"}}>{msg}</p>}
              {image && <img src={image} style={{width:100, height:100, objectFit:"cover", marginTop:10, border:"1px solid #333"}} />}
            </div>

            <button disabled={loading} style={{background:"#E6C15A", color:"#000", padding:14, fontWeight:"bold", letterSpacing:1, cursor:"pointer", border:"none", borderRadius:4}}>
              {loading?"Adding...":"ADD PRODUCT"}
            </button>
          </form>
        </div>

        <h3 style={{marginTop:40, letterSpacing:2}}>ALL PRODUCTS ({products.length})</h3>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, marginTop:16}}>
          {products.map((p:any)=>(
  <div key={p.id} style={{background:"#151515", border:"1px solid #222", padding:10, borderRadius:6}}>
    <img src={p.image} style={{width:"100%", height:150, objectFit:"cover", borderRadius:4}} />
    <p style={{fontSize:13, margin:"8px 0 2px", fontWeight:"bold"}}>{p.name}</p>
    <p style={{fontSize:11, margin:"0 0 4px", color:"#aaa", lineHeight:"14px"}}>{p.description?.slice(0,60)}...</p>
    <p style={{color:"#C5A880", fontWeight:"bold", margin:"0 0 8px"}}>${p.price}</p>
    <button onClick={()=>del(p.id)} style={{width:"100%", background:"#ff3b3b", color:"#fff", border:"none", padding:8, cursor:"pointer", fontWeight:"bold", borderRadius:4}}>DELETE</button>
  </div>
))} 
