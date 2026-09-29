"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AdminPage() {
  const [name,setName]=useState("");
  const [price,setPrice]=useState("");
  const [image,setImage]=useState<string>("");
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");

  const onFile = (e:any)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const upload=async()=>{
    if(!name||!price||!image){ setMsg("❌ Fill all"); return; }
    setLoading(true); setMsg("⏳ Saving...");
    try{
      await addDoc(collection(db,"products"),{
        name, price:Number(price), image, image_url:image,
        createdAt:serverTimestamp()
      });
      setMsg("✅ SUCCESS! Added! Go to homepage!");
      setName(""); setPrice(""); setImage("");
    }catch(e:any){ setMsg("❌ "+e.message); }
    setLoading(false);
  };

  return (
    <div style={{maxWidth:500,margin:"30px auto",padding:20,background:"white",color:"black",borderRadius:12}}>
      <h1>JHUMMKA Admin 💎</h1>
      <label>Name:</label>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Gold Jhumka" style={{width:"100%",padding:12,margin:"5px 0 15px",border:"2px solid #000",background:"white",color:"black"}} />
      <label>Price:</label>
      <input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="499" style={{width:"100%",padding:12,margin:"5px 0 15px",border:"2px solid #000",background:"white",color:"black"}} />
      <label>Image:</label>
      <input type="file" accept="image/*" onChange={onFile} style={{width:"100%",margin:"5px 0"}} />
      {image&&<img src={image} style={{width:"100%",maxHeight:200,objectFit:"contain",margin:"10px 0",border:"1px solid #ccc"}} />}
      <button onClick={upload} disabled={loading} style={{width:"100%",padding:15,background:"black",color:"gold",fontWeight:"bold",fontSize:18}}>{loading?"Saving...":"ADD PRODUCT TO SHOP"}</button>
      <p style={{marginTop:15,fontWeight:"bold"}}>{msg}</p>
      <a href="/">← View Shop</a>
    </div>
  );
} 
