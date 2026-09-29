"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp } from "firebase/firestore"

export default function AdminPage(){
  const [name,setName]=useState("")
  const [price,setPrice]=useState("")
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
      const MAX=600
      let w=img.width,h=img.height
      if(w>h){ if(w>MAX){ h=h*MAX/w; w=MAX; } } else { if(h>MAX){ w=w*MAX/h; h=MAX; } }
      canvas.width=w; canvas.height=h
      canvas.getContext("2d")?.drawImage(img,0,0,w,h)
      const data=canvas.toDataURL("image/jpeg",0.6)
      setImage(data)
      setMsg(`✅ Compressed: ${Math.round(data.length/1024)}KB - Ready to upload!`)
      URL.revokeObjectURL(url)
    }
    img.src=url
  }

  const addProduct=async(e:any)=>{
    e.preventDefault()
    if(!name||!price||!image) return alert("Fill all")
    setLoading(true)
    await addDoc(collection(db,"products"), { name, price:Number(price), image, category:"Jhumkas", createdAt:serverTimestamp() })
    setName(""); setPrice(""); setImage(""); setMsg("✅ Added!")
    setLoading(false); load()
  }

  const del = async(id:string)=>{
    if(!confirm("Delete this product?")) return
    await deleteDoc(doc(db,"products",id))
    load()
  }

  return(
    <div style={{minHeight:"100vh", background:"#0a0a0a", color:"#fff", padding:30}}>
      <div style={{maxWidth:900, margin:"0 auto"}}>
        <h1 style={{letterSpacing:4}}>JHUMMKA ADMIN</h1>
        <a href="/" style={{color:"#C5A880", fontSize:12}}>← View Shop</a>

        <div style={{background:"#151515", border:"1px solid #222", padding:24, marginTop:20}}>
          <form onSubmit={addProduct} style={{display:"grid", gap:12}}>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Product Name" style={{padding:12, background:"#000", border:"1px solid #333", color:"#fff"}} />
            <input value={price} onChange={e=>setPrice(e.target.value)} type="number" placeholder="Price" style={{padding:12, background:"#000", border:"1px solid #333", color:"#fff"}} />
            <input type="file" accept="image/*" onChange={onFile} style={{color:"#fff"}} />
            {msg && <p style={{color:"#C5A880", fontSize:12}}>{msg}</p>}
            {image && <img src={image} style={{width:120, height:120, objectFit:"cover", border:"1px solid #333"}} />}
            <button disabled={loading} style={{background:"#E6C15A", color:"#000", padding:12, fontWeight:"bold"}}>{loading?"Adding...":"ADD PRODUCT"}</button>
          </form>
        </div>

        <h3 style={{marginTop:40}}>ALL PRODUCTS ({products.length}) - Click DELETE to remove TV test</h3>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, marginTop:16}}>
          {products.map((p:any)=>(
            <div key={p.id} style={{background:"#151515", border:"1px solid #222", padding:10}}>
              <img src={p.image} style={{width:"100%", height:150, objectFit:"cover"}} />
              <p style={{fontSize:13, margin:"8px 0 4px"}}>{p.name} - ₹{p.price}</p>
              <button onClick={()=>del(p.id)} style={{width:"100%", background:"#ff3b3b", color:"#fff", border:"none", padding:8, cursor:"pointer", fontWeight:"bold"}}>🗑️ DELETE</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
