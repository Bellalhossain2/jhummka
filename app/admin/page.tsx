"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp } from "firebase/firestore"

export default function AdminPage(){
  const [name,setName]=useState("")
  const [price,setPrice]=useState("")
  const [desc,setDesc]=useState("")
  const [category,setCategory]=useState("jhumkas")
  const [image,setImage]=useState("")
  const [loading,setLoading]=useState(false)
  const [products,setProducts]=useState<any[]>([])
  const [msg,setMsg]=useState("")

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
      const MAX=800
      let w=img.width,h=img.height
      if(w>h){ if(w>MAX){ h=h*MAX/w; w=MAX; } } else { if(h>MAX){ w=w*MAX/h; h=MAX; } }
      canvas.width=w; canvas.height=h
      canvas.getContext("2d")?.drawImage(img,0,0,w,h)
      const dataUrl=canvas.toDataURL("image/jpeg",0.7)
      setImage(dataUrl)
      URL.revokeObjectURL(url)
    }
    img.src=url
  }

  const addProduct = async()=>{
    if(!name ||!price ||!image){ alert("Fill name, price, image"); return }
    setLoading(true)
    try{
      await addDoc(collection(db,"products"),{
        name, price:Number(price), description:desc, category, image, createdAt:serverTimestamp()
      })
      setName(""); setPrice(""); setDesc(""); setImage(""); setCategory("jhumkas")
      setMsg("Added! ✅")
      load()
    }catch(err:any){ alert(err.message) }
    setLoading(false)
  }

  const delProduct = async(id:string)=>{
    if(!confirm("Delete this product?")) return
    await deleteDoc(doc(db,"products",id))
    load()
  }

  return (
    <div style={{padding:20, maxWidth:700, margin:"0 auto", background:"#fff", minHeight:"100vh", color:"#000"}}>
      <h1 style={{fontWeight:"bold", fontSize:24}}>JHUMMKA Admin v4 FIXED</h1>
      <p style={{color:"green"}}>{msg}</p>
      <div style={{border:"2px solid #000", padding:20, marginTop:15}}>
        <label>Product Name:</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Temple Gold Jhumka" style={{width:"100%", padding:10, border:"1px solid #000", marginBottom:10, display:"block"}} />
        <label>Price in USD:</label>
        <input value={price} onChange={e=>setPrice(e.target.value)} type="number" placeholder="1200" style={{width:"100%", padding:10, border:"1px solid #000", marginBottom:10, display:"block"}} />
        <label>Category:</label>
        <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:"100%", padding:10, border:"1px solid #000", marginBottom:10, display:"block"}}>
          <option value="electronics">electronics</option>
          <option value="dress">dress</option>
          <option value="home">home</option>
          <option value="jewelry">jewelry</option>
          <option value="cosmetics">cosmetics</option>
          <option value="toys">toys</option>
          <optin value="dress">dress</optin>
          <option value="fashion">fashion</option>
          <option value="barber">barber</option>
        </select>
        <label>Description (NEW!):</label>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description - 22kt, hand-forged..." style={{width:"100%", padding:10, border:"1px solid #000", marginBottom:10, display:"block", height:80}} />
        <label>Photo (auto-compress):</label>
        <input type="file" accept="image/*" onChange={onFile} style={{marginBottom:10, display:"block"}} />
        {image && <img src={image} style={{width:80, height:80, objectFit:"cover", border:"1px solid #000", marginBottom:10}} />}
        <button onClick={addProduct} disabled={loading} style={{width:"100%", background:"black", color:"#FFEB3B", padding:15, fontWeight:"bold", border:"none", cursor:"pointer"}}>
          {loading? "ADDING..." : "ADD PRODUCT TO STORE"}
        </button>
      </div>
      <h2 style={{marginTop:30, fontWeight:"bold"}}>All Products ({products.length}) - With Delete</h2>
      <div style={{marginTop:10}}>
        {products.map(p=>(
          <div key={p.id} style={{border:"1px solid #ccc", padding:10, display:"flex", gap:10, alignItems:"center", marginBottom:8}}>
            <img src={p.image} style={{width:50, height:50, objectFit:"cover"}} />
            <div style={{flex:1}}>
              <b>{p.name}</b> - {"$" + p.price}<br/>
              <small style={{color:"#666"}}>{p.category} | {p.description?.slice(0,60) || "No desc"}</small>
            </div>
            <button onClick={()=>delProduct(p.id)} style={{background:"red", color:"white", border:"none", padding:"6px 12px", cursor:"pointer", fontSize:12}}>DELETE</button>
          </div>
        ))}
      </div>
      <a href="/" style={{display:"block", marginTop:20}}>← View Shop</a>
    </div>
  )
} 
