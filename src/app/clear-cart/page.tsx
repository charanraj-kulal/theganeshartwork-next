"use client";

import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function ClearCartPage() {
  const { clearCart, items } = useCartStore();
  const router = useRouter();

  const handleClearCart = () => {
    clearCart();
    // Also clear localStorage completely
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart-storage');
    }
    toast.success('Cart cleared! Please add products again.');
    setTimeout(() => {
      router.push('/products');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Clear Cart & Fix Checkout Error
        </h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-red-800 mb-2">
            <strong>Why clear cart?</strong>
          </p>
          <p className="text-xs text-red-700">
            Your cart has old product IDs that don't match the database. This causes checkout errors. 
            Clearing will fix this issue.
          </p>
        </div>

        <div className="text-sm text-gray-600 mb-6 text-left">
          <p className="mb-2"><strong>Current cart items:</strong> {items.length}</p>
          {items.length > 0 && (
            <ul className="space-y-1 text-xs">
              {items.map(item => (
                <li key={item.id} className="text-gray-500">
                  • {item.name} (ID: {item.productId.substring(0, 8)}...)
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleClearCart}
          className="w-full bg-gray-500 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-3"
        >
          Clear Cart & Add Fresh Items
        </button>

        <button
          onClick={() => router.push('/products')}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Cancel
        </button>

        <p className="text-xs text-gray-500 mt-4">
          After clearing, add products again to get correct IDs
        </p>
      </div>
    </main>
  );
}
