"use client";
import { useState } from "react";

export default function Shopkeeper() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    shopkeeperName: "", storeName: "", idType: "driving licence",
    idNumber: "", house: "", city: "", state: "", country: "India"
  });

  if (done) {
    return (
      <div style={{padding:40, maxWidth:600, margin:"auto"}}>
        <h1 style={{fontSize:30, fontWeight:"bold"}}>Welcome {form.storeName}!</h1>
        <p>Shopkeeper: {form.shopkeeperName}</p>
        <p>ID: {form.idType} - {form.idNumber}</p>
        <p>{form.house}, {form.city}, {form.state}, {form.country}</p>
        <div style={{marginTop:30, border:"2px dashed #000", padding:20, background:"#FFF9C4"}}>
          <h2>Product Upload Page - Coming Next!</h2>
          <p>Now you can upload jhumkas!</p>
          <button onClick={()=>setDone(false)} style={{marginTop:10, background:"black", color:"white", padding:"8px 16px"}}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:40, maxWidth:500, margin:"auto"}}>
      <h1 style={{fontSize:28, fontWeight:"bold", textAlign:"center"}}>Shopkeeper Login</h1>
      <p style={{textAlign:"center"}}>Enter shop details - where mouse was pointing</p>
      <form onSubmit={(e)=>{e.preventDefault(); setDone(true);}} style={{marginTop:20, display:"grid", gap:12, border:"1px solid #ddd", padding:20, borderRadius:12}}>
        <input required placeholder="Shopkeeper Name - ex: Priya Sharma" style={{border:"1px solid #ccc", padding:12, borderRadius:8}} value={form.shopkeeperName} onChange={e=>setForm({...form, shopkeeperName:e.target.value})} />
        <input required placeholder="Store Name - ex: Noor Jhumka House" style={{border:"1px solid #ccc", padding:12, borderRadius:8}} value={form.storeName} onChange={e=>setForm({...form, storeName:e.target.value})} />
        <div style={{display:"flex", gap:8}}>
          <select style={{border:"1px solid #ccc", padding:12, borderRadius:8, width:"50%"}} value={form.idType} onChange={e=>setForm({...form, idType:e.target.value})}>
            <option>driving licence</option><option>passport</option><option>aadhaar</option>
          </select>
          <input required placeholder="ID Number" style={{border:"1px solid #ccc", padding:12, borderRadius:8, width:"50%"}} value={form.idNumber} onChange={e=>setForm({...form, idNumber:e.target.value})} />
        </div>
        <input required placeholder="House / Building Number" style={{border:"1px solid #ccc", padding:12, borderRadius:8}} value={form.house} onChange={e=>setForm({...form, house:e.target.value})} />
        <input required placeholder="City" style={{border:"1px solid #ccc", padding:12, borderRadius:8}} value={form.city} onChange={e=>setForm({...form, city:e.target.value})} />
        <input required placeholder="State" style={{border:"1px solid #ccc", padding:12, borderRadius:8}} value={form.state} onChange={e=>setForm({...form, state:e.target.value})} />
        <input required placeholder="Country" style={{border:"1px solid #ccc", padding:12, borderRadius:8}} value={form.country} onChange={e=>setForm({...form, country:e.target.value})} />
        <button type="submit" style={{background:"black", color:"white", padding:12, borderRadius:8, fontWeight:"bold"}}>Save & Open Shop</button>
      </form>
    </div>
  );
} 