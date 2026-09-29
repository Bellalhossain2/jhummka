"use client";
import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File|null>(null);
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");

  const upload = async()=>{
    if(!name||!price||!file){ setMsg("❌ Fill all: name, price, image"); return; }
    setLoading(true); setMsg("⏳ Uploading...");
    try{
      const r=ref(storage,`products/${Date.now()}-${file.name}`);
      await uploadBytes(r,file);
      const url=await getDownloadURL(r);
      await addDoc(collection(db,"products"),{name,price:Number(price),image:url,image_url:url,createdAt:serverTimestamp()});
      setMsg("✅ ADDED! Check homepage jhummkatok.com in 10 sec");
      setName("");setPrice("");setFile(null);
    }catch(e:any){setMsg("❌ "+e.message+" - Need to enable Storage in Firebase console")}
    setLoading(false);
  };

  return (
    <div style={{maxWidth:500,margin:"30px auto",padding:20,background:"white",color:"black",borderRadius:12}}>
      <h1>JHUMMKA Admin 💎</h1>
      <label>Name:</label>
      <input placeholder="Gold Jhumka" value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:12,margin:"5px 0 15px",border:"2px solid #000",color:"black",background:"white"}} />
      <label>Price:</label>
      <input placeholder="499" type="number" value={price} onChange={e=>setPrice(e.target.value)} style={{width:"100%",padding:12,margin:"5px 0 15px",border:"2px solid #000",color:"black",background:"white"}} />
      <label>Image:</label>
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} style={{width:"100%",margin:"5px 0 15px"}} />
      {file&&<p>✅ Selected: {file.name}</p>}
      <button onClick={upload} disabled={loading} style={{width:"100%",padding:15,background:"black",color:"gold",fontWeight:"bold",fontSize:18}}>{loading?"Uploading...":"ADD PRODUCT TO SHOP"}</button>
      <p style={{marginTop:15,fontWeight:"bold",fontSize:16}}>{msg}</p>
      <a href="/">← View Shop</a>
    </div>
  );
} 
