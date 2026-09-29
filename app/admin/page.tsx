"use client";
import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const upload = async () => {
    if (!name ||!price ||!file) { setMsg("❌ Fill name, price + image"); return; }
    setLoading(true); setMsg("⏳ Uploading to Firebase...");
    try {
      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "products"), {
        name, price: Number(price), image: imageUrl, image_url: imageUrl,
        createdAt: serverTimestamp()
      });

      setMsg("✅ SUCCESS! Added to homepage! Go check jhummkatok.com");
      setName(""); setPrice(""); setFile(null);
    } catch (e:any) { setMsg("❌ Error: " + e.message); }
    setLoading(false);
  };

  return (
    <div style={{maxWidth:500, margin:"40px auto", padding:20, fontFamily:"sans-serif", color:"black"}}>
      <h1 style={{fontSize:28, fontWeight:"bold"}}>JHUMMKA Admin 💎</h1>
      <p>Upload new jhumka - will show on homepage</p>
      <input placeholder="Product name - e.g. Gold Jhumka" value={name} onChange={e=>setName(e.target.value)} style={{width:"100%", padding:12, margin:"10px 0", border:"1px solid #ccc"}} />
      <input placeholder="Price - e.g. 499" type="number" value={price} onChange={e=>setPrice(e.target.value)} style={{width:"100%", padding:12, margin:"10px 0", border:"1px solid #ccc"}} />
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} style={{margin:"10px 0", width:"100%"}} />
      {file && <p>Selected: {file.name}</p>}
      <button onClick={upload} disabled={loading} style={{width:"100%", padding:14, background:"black", color:"#FFD700", fontWeight:"bold", fontSize:16, cursor:"pointer", marginTop:10}}>
        {loading? "Uploading..." : "ADD PRODUCT TO SHOP"}
      </button>
      <p style={{marginTop:15, fontWeight:"bold", color: msg.includes("SUCCESS")? "green" : "red"}}>{msg}</p>
      <div style={{marginTop:30}}><a href="/">← View Homepage</a></div>
    </div>
  );
} 
