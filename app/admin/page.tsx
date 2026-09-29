"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleUpload = async () => {
    if (!name ||!price ||!file) {
      setMsg("Fill all fields + image!");
      return;
    }
    setLoading(true);
    setMsg("Uploading...");
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("products").upload(fileName, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("products").getPublicUrl(fileName);

      const { error: dbErr } = await supabase.from("products").insert({
        name, price: Number(price), image_url: data.publicUrl,
        description: name
      });
      if (dbErr) throw dbErr;
      setMsg("✅ Product added! Check homepage!");
      setName(""); setPrice(""); setFile(null);
    } catch (e:any) {
      setMsg("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{maxWidth:500, margin:"50px auto", padding:20, fontFamily:"sans-serif"}}>
      <h1 style={{fontSize:28, fontWeight:"bold"}}>JHUMMKA Admin</h1>
      <p>Add new jhumka</p>
      <input placeholder="Product Name (e.g. Royal Gold Jhumka)" value={name} onChange={e=>setName(e.target.value)} style={{width:"100%", padding:12, margin:"10px 0", border:"1px solid #ccc"}}/>
      <input placeholder="Price (e.g. 499)" type="number" value={price} onChange={e=>setPrice(e.target.value)} style={{width:"100%", padding:12, margin:"10px 0", border:"1px solid #ccc"}}/>
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} style={{margin:"10px 0"}}/>
      <button onClick={handleUpload} disabled={loading} style={{width:"100%", padding:14, background:"black", color:"gold", fontWeight:"bold", cursor:"pointer"}}>
        {loading? "Uploading..." : "ADD PRODUCT"}
      </button>
      <p style={{marginTop:15, fontWeight:"bold"}}>{msg}</p>
      <a href="/" style={{display:"block", marginTop:20}}>← Back to website</a>
    </div>
  );
} 
