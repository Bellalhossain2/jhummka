"use client"
import { useEffect } from "react"
import { useCart } from "@/components/cart-provider"
import Link from "next/link"

export default function SuccessPage(){
  const { clearCart } = useCart()

  useEffect(()=>{
    // Clear cart after successful payment
    clearCart()
  },[])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-8 text-center shadow-xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-2xl font-black mb-2">Payment Successful!</h1>
        <p className="text-gray-600 text-sm mb-1">Thank you for shopping with</p>
        <p className="font-black text-lg mb-4">jhummka<span className="text-yellow-500">Tok</span></p>
       
        <div className="bg-gray-50 rounded-lg p-3 mb-6 text-left text-xs">
          <p>✓ Order confirmed</p>
          <p>✓ You will receive email receipt from Stripe</p>
          <p>✓ Shipping in 2-3 days</p>
        </div>

        <Link href="/" className="block w-full bg-black text-white font-bold py-3 rounded-full hover:bg-gray-800">
          Continue Shopping
        </Link>
       
        <p className="text-xs text-gray-400 mt-4">Order ID: #{Math.random().toString(36).substr(2,9).toUpperCase()}</p>
      </div>
    </div>
  )
} 
