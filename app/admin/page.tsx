"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AdminPage(){
  const [name,setName]=useState("");
  const [price,setPrice]=useState("");
  const [image,setImage]=useState("");
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");

  const onFile=(e:any)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    const img=new Image();
    const url=URL.createObjectURL(file);
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      const MAX=600;
      let w=img.width,h=img.height;
      if(w>h){ if(w>MAX){ h*=MAX/w; w=MAX; } } else { if(h>MAX){ w*=MAX/h; h=MAX; } }
      canvas.width=w; canvas.height=h;
      canvas.getContext("2d")?.drawImage(img,0,0,w,h);
      const data=canvas.toDataURL("image/jpeg",0.6);
      setImage(data);
      setMsg(`✅ Compressed: ${Math.round(data.length/1024)}KB - Ready to upload!`);
      URL.revokeObjectURL(url);
    };
    img.src=url;
  };

  const upload=async()=>{
    if(!name||!price||!image){ setMsg("❌ Fill all"); return; }
    setLoading(true); setMsg("⏳ Saving...");
    try{
      await addDoc(collection(db,"products"),{name,price:Number(price),image,image_url:image,createdAt:serverTimestamp()});
      setMsg("✅ SUCCESS! ADDED TO SHOP!"); setName(""); setPrice(""); setImage("");
    }catch(e:any){ setMsg("❌ "+e.message); }
    setLoading(false);
  };

  return (
    <div style={{maxWidth:500,margin:"20px auto",padding:20,background:"white",color:"black",borderRadius:12,fontFamily:"sans-serif"}}>
      <h2>JHUMMKA Admin 💎 v3</h2>
      <label>Name:</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Gold Jhumka" style={{width:"100%",padding:10,margin:"5px 0 12px",border:"2px solid #000",color:"black",background:"white"}} />
      <label>Price:</label><input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="499" style={{width:"100%",padding:10,margin:"5px 0 12px",border:"2px solid #000",color:"black",background:"white"}} />
      <label>Image (auto-compress):</label><input type="file" accept="image/*" onChange={onFile} style={{width:"100%",margin:"5px 0"}} />
      {image&&<><img src={image} style={{width:"100%",maxHeight:250,objectFit:"contain",border:"1px solid #ccc",marginTop:10}} /><p style={{color:"green"}}>Ready!</p></>}
      <button onClick={upload} disabled={loading} style={{width:"100%",padding:14,background:"black",color:"gold",fontWeight:"bold",marginTop:10}}>{loading?"Saving...":"ADD PRODUCT TO SHOP"}</button>
      <p style={{fontWeight:"bold",color:msg.includes("SUCCESS")?"green":"red"}}>{msg}</p>
      <a href="/">← View Shop</a>
    </div>
  );
} 
