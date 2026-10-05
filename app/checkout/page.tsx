"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  // Get product from URL or use default
  const product = {
    name: searchParams.get('name') || 'Mobile Stand',
    price: Number(searchParams.get('price')) || 9.94,
    image: searchParams.get('image') || '/product.jpg',
    qty: 1
  }

  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(1.54)
  const [showCoupon, setShowCoupon] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('paypal')

  // Calculations like your screenshot
  const itemTotal = product.price
  const subtotal = itemTotal - discount // 8.40
  const shipping = 2.99
  const tax = 1.02
  const orderTotal = subtotal + shipping + tax // 12.41

  const applyCoupon = () => {
    if(coupon.toUpperCase() === 'SAVE10') {
      setDiscount(2.5)
      alert('Coupon applied!')
    } else {
      setDiscount(1.54)
      alert('Use code SAVE10 for extra discount')
    }
  }

  const handleOrderAndPay = async () => {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        name: product.name,
        price: orderTotal, // final total
        image: product.image,
        quantity: product.qty,
      })
    })
    const data = await res.json()
    if(data.url) window.location.href = data.url
    else { alert('Error'); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[600px] mx-auto bg-white p-4 pb-24">

        {/* Address */}
        <div className="flex items-start gap-2 border-b pb-3">
          <div className="w-3 h-3 bg-black rounded-full mt-1"></div>
          <div className="flex-1">
            <p className="font-bold">Bellal Hossain <span className="font-normal text-gray-600">+1 (516) 272-1370</span></p>
            <p className="text-orange-600 text-sm">288 Logan St, Last floor, BROOKLYN, NY 11208-2510, Uni...</p>
          </div>
        </div>

        {/* Product */}
        <div className="flex gap-3 py-3 border-b">
          <img src={product.image} alt="" className="w-20 h-20 object-cover rounded" />
          <div className="flex-1">
            <p className="font-bold">${subtotal.toFixed(2)} <span className="line-through text-gray-400 font-normal">${itemTotal.toFixed(2)}</span> <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-1">16% OFF</span></p>
            <p className="text-green-700 text-sm mt-1">🚚 Standard shipping: <b>${shipping}</b>, delivery: 3-7 business days, fastest delivery in 3 business days ›</p>
          </div>
          <div className="text-sm">1 ⌄</div>
        </div>

        {/* Payment Methods */}
        <div className="py-4 border-b">
          <h3 className="font-bold text-lg mb-3">Payment methods</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center"><div className="w-3 h-3 bg-white rounded-full"></div></div>
              <div className="bg-[#009CDE] text-[#003087] font-bold px-2 py-1 text-sm rounded">PayPal</div>
              <span>PayPal s***5@gmail.com</span>
            </div>
            <span className="text-gray-500 text-sm">Edit</span>
          </div>
          <div className="flex gap-1 mt-3 flex-wrap items-center">
            <span className="border px-2 py-1 rounded text-xs">Pay</span>
            <span className="border px-2 py-1 rounded text-xs bg-red-500 text-white">●●</span>
            <span className="border px-2 py-1 rounded text-xs bg-[#009CDE] text-white">PayPal</span>
            <span className="border px-2 py-1 rounded text-xs bg-green-500 text-white">$</span>
            <span className="border px-2 py-1 rounded text-xs">Klarna</span>
            <span className="border px-2 py-1 rounded text-xs bg-black text-white">zip</span>
            <span className="border px-2 py-1 rounded text-xs bg-blue-600 text-white">affirm</span>
            <span className="text-sm ml-2">View all ⌄</span>
          </div>
        </div>

        {/* Totals */}
        <div className="py-3 space-y-2">
          <div className="flex justify-between"><span>Item(s) total:</span><span>${itemTotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Item(s) discount:</span><span className="text-red-500">-${discount.toFixed(2)}</span></div>

          <div className="flex justify-between items-center py-2 border-t cursor-pointer" onClick={()=>setShowCoupon(!showCoupon)}>
            <span>Apply coupon code</span><span>›</span>
          </div>
          {showCoupon && (
            <div className="flex gap-2">
              <input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Enter SAVE10" className="border p-2 flex-1 rounded" />
              <button onClick={applyCoupon} className="bg-black text-white px-4 rounded">Apply</button>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping:</span><span>${shipping.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Sales tax:</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Order total:</span><span className="text-green-700">${orderTotal.toFixed(2)}</span></div>
        </div>

        {/* Guarantee */}
        <div className="border-2 border-green-600 rounded-lg p-3 text-green-700 mt-2">
          $ Submit your order now to enjoy our Price Match Guarantee.
        </div>
      </div>

      {/* Bottom Fixed Bar - Like your photo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-between items-center max-w-[600px] mx-auto">
        <div>
          <p className="font-bold text-xl">${orderTotal.toFixed(2)} <span className="text-sm">^</span></p>
          <p className="text-orange-600 text-sm">Saved ${discount.toFixed(2)}</p>
        </div>
        <button
          onClick={handleOrderAndPay}
          disabled={loading}
          className="bg-[#FF6A00] text-white px-8 py-3 rounded-full font-bold text-lg"
        >
          {loading? 'Processing...' : `Order and Pay (1)`}
        </button>
      </div>
    </div>
  )
} 
