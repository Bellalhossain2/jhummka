"use client"
import { useState } from "react"

const allProducts = [
  { id: 1, name: "Temple Gold Jhumka", price: 25, cat: "jewelry", img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400", rating: 4.8, sold: "2k+ sold" },
  { id: 2, name: "DOVE Soap 4-Pack", price: 13, cat: "beauty", img: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400", rating: 4.5, sold: "5k+ sold" },
  { id: 3, name: "AXE Perfume Fresh", price: 8, cat: "fashion", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400", rating: 4.6, sold: "1k+ sold" },
  { id: 4, name: "Mobile Stand Holder", price: 10, cat: "electronics", img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", rating: 4.3, sold: "3k+ sold" },
  { id: 5, name: "Power Bank 20000mAh", price: 89, cat: "electronics", img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", rating: 4.7, sold: "800 sold" },
  { id: 6, name: "Hair Cutter USB", price: 18, cat: "barber", img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400", rating: 4.4, sold: "1.2k sold" },
  { id: 7, name: "Hillside Honda Keychain", price: 5, cat: "fashion", img: "https://images.unsplash.com/photo-1611923134232-9d6b0bb0f0e1?w=400", rating: 4.9, sold: "10k+ sold" },
  { id: 8, name: "Kids Toy Car", price: 12, cat: "toys", img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400", rating: 4.6, sold: "4k sold" },
  { id: 9, name: "Bridal Heavy Jhumka", price: 45, cat: "jhumkas", img: "https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=400", rating: 5.0, sold: "900 sold" },
  { id: 10, name: "Home LED Light", price: 15, cat: "home", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", rating: 4.2, sold: "2k sold" },
]

const cats = ["ALL","JHUMKAS","ELECTRONICS","JEWELRY","KIDS","HOME","HOUSEHOLD","DRESS","COSMETICS","TOYS","FASHION","BARBER","MEN","BEAUTY","BOOKS","GROCERY","KITCHEN"]

export default function AmazonStore(){
  const [filter,setFilter]=useState("ALL")
  const [search,setSearch]=useState("")

  function buy(p:any){
    const name=encodeURIComponent(p.name)
    window.location.href='/checkout?name='+name+'&price='+p.price+'&id='+p.id
  }

  const filtered = allProducts.filter(p=>{
    const matchCat = filter==="ALL" || p.cat.toLowerCase()===filter.toLowerCase() || (filter==="JEWELRY" && p.cat==="jhumkas")
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return(
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* AMAZON HEADER */}
