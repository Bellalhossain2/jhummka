"use client"
import { useCart } from "./cart-provider"
import Link from "next/link"

export default function CartDrawer(){
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, cartTotal, cartCount } = useCart() as any

  if(!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={closeCart}></div>

      {/* drawer */}
      <div className="relative bg-black text-white w-[90%] max-w-sm h-full overflow-y-auto flex flex-col">
        {/* header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800 sticky top-0 bg-black">
          <h2 className="font-bold">Cart ({cartCount})</h2>
          <div className="flex gap-3 items-center">
            {cartCount > 0 && (
              <button
                onClick={()=>{ if(confirm('Clear all items?')) clearCart() }}
                className="text-xs bg-red-600 px-3 py-1 rounded-full hover:bg-red-700"
              >
                Clear All
              </button>
            )}
            <button onClick={closeCart} className="text-xl">X</button>
          </div>
        </div>

        {/* items */}
        <div className="flex-1 p-4 space-y-4">
          {items.length === 0? (
            <p className="text-center text-gray-400 mt-10">Cart is empty</p>
          ) : (
            items.map((item:any, idx:number)=>(
              <div key={item.id+idx} className="flex gap-3 border border-gray-800 rounded-lg p-2 relative">
                {/* BOUGHT MARK */}
                {item.bought && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                    ✓ BOUGHT
                  </div>
                )}
                <img src={item.image} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-yellow-400 text-sm">${item.price}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={()=>updateQuantity(item.id, Math.max(1,item.quantity-1))} className="w-6 h-6 bg-gray-800 rounded">-</button>
                    <span className="text-sm">{item.quantity}</span>
                    <button onClick={()=>updateQuantity(item.id, item.quantity+1)} className="w-6 h-6 bg-gray-800 rounded">+</button>
                  </div>
                </div>
                <button onClick={()=>removeItem(item.id)} className="text-xs text-gray-400 hover:text-white">REMOVE</button>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-800 sticky bottom-0 bg-black">
            <div className="flex justify-between mb-1">
              <span>SUBTOTAL</span>
              <span>${cartTotal}</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={closeCart} className="block w-full bg-yellow-400 text-black text-center font-black py-3 rounded-full">
              PROCEED TO CHECKOUT
            </Link>
            <button onClick={closeCart} className="w-full text-center text-xs mt-3 text-gray-400">CONTINUE SHOPPING</button>
          </div>
        )}
      </div>
    </div>
  )
} 
