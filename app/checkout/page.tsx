"use client"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

// Tell Vercel don't prerender this page
export const dynamic = 'force-dynamic'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const product = {
    name: searchParams.get('name') || 'Mobile Stand',
    price: Number(searchParams.get('price')) || 9.94,
    image: searchParams.get('image') || '/placeholder.jpg',
    qty: 1
  }

  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(1.54)
  const [showCoupon, setShowCoupon] = useState(false)
  const [loading, setLoading] = useState(false)

  const itemTotal = product.price
  const subtotal = itemTotal - discount
  const shipping = 2.99
  const tax = 1.02
  const orderTotal = subtotal + shipping + tax

  const applyCoupon = () => {
    if(coupon.toUpperCase() === 'SAVE10') { setDiscount(2.5); alert('Applied!') }
    else alert('Use SAVE10')
  }

  const handleOrderAndPay = async () => {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name: product.name, price: orderTotal })
    })
    const data = await res.json()
    if(data.url) window.location.href = data.url
    else { alert('Error'); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[600px] mx-auto bg-white p-4 pb-24">
        <div className="flex items-start gap-2 border-b pb-3">
          <div className="w-3 h-3 bg-black rounded-full mt-1"></div>
          <div className="flex-1">
            <p className="font-bold">Bellal Hossain <span className="font-normal text-gray-600">+1 (516) 272-1370</span></p>
            <p className="text-orange-600 text-sm">288 Logan St, BROOKLYN, NY 11208...</p>
          </div>
        </div>

        <div className="flex gap-3 py-3 border-b">
          <img src={product.image} alt="" className="w-20 h-20 object-cover rounded" />
          <div className="flex-1">
            <p className="font-bold">${subtotal.toFixed(2)} <span className="line-through text-gray-400">${itemTotal.toFixed(2)}</span> <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">16% OFF</span></p>
            <p className="text-green-700 text-sm mt-1">🚚 Shipping: ${shipping}, 3-7 days</p>
          </div>
        </div>

        <div className="py-4 border-b">
          <h3 className="font-bold text-lg mb-3">Payment methods</h3>
          <div className="flex items-center gap-2">
            <div className="bg-[#009CDE] text-white px-2 py-1 text-sm rounded font-bold">PayPal</div>
            <span>PayPal s***5@gmail.com</span>
          </div>
          <div className="flex gap-1 mt-3 text-xs">
            <span className="border px-2 py-1 rounded">Pay</span>
            <span className="border px-2 py-1 rounded bg-red-500 text-white">●●</span>
            <span className="border px-2 py-1 rounded bg-[#009CDE] text-white">PayPal</span>
            <span className="border px-2 py-1 rounded bg-green-500 text-white">$</span>
            <span className="border px-2 py-1 rounded">Klarna</span>
            <span className="border px-2 py-1 rounded bg-black text-white">zip</span>
            <span className="text-sm ml-2">View all</span>
          </div>
        </div>

        <div className="py-3 space-y-2">
          <div className="flex justify-between"><span>Item(s) total:</span><span>${itemTotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Discount:</span><span className="text-red-500">-${discount.toFixed(2)}</span></div>
          <div className="flex justify-between items-center py-2 border-t cursor-pointer" onClick={()=>setShowCoupon(!showCoupon)}><span>Apply coupon code</span><span>›</span></div>
          {showCoupon && <div className="flex gap-2"><input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="SAVE10" className="border p-2 flex-1 rounded" /><button onClick={applyCoupon} className="bg-black text-white px-4 rounded">Apply</button></div>}
          <div className="flex justify-between pt-2 border-t"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping:</span><span>${shipping.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Sales tax:</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Order total:</span><span className="text-green-700">${orderTotal.toFixed(2)}</span></div>
        </div>
        <div className="border-2 border-green-600 rounded-lg p-3 text-green-700 mt-2">$ Submit now to enjoy Price Match Guarantee.</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-between items-center max-w-[600px] mx-auto">
        <div><p className="font-bold text-xl">${orderTotal.toFixed(2)}</p><p className="text-orange-600 text-sm">Saved ${discount.toFixed(2)}</p></div>
        <button onClick={handleOrderAndPay} disabled={loading} className="bg-[#FF6A00] text-white px-8 py-3 rounded-full font-bold text-lg">{loading? 'Processing...' : `Order and Pay (1)`}</button>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
} 
