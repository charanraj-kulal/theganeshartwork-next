"use client";

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface AppliedCoupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  color: string | null;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please login to view your cart');
      router.push('/login?callbackUrl=/cart');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast.success('Item removed from cart');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(productId, quantity);
    toast.info('Cart updated');
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      setAppliedCoupon(null);
      setDiscount(0);
      setCouponCode('');
      toast.success('Cart cleared');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    try {
      const cartItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          cartItems,
          subtotal: getTotalPrice()
        })
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon(data.coupon);
        setDiscount(data.discount);
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error('Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const getFinalTotal = () => {
    return Math.max(0, getTotalPrice() - discount);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">Cart</span>
        </nav>

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products to your cart and they will appear here
            </p>
            <Link
              href="/products"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-900 font-bold mb-2">₹{item.price}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-600 text-sm font-semibold"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>
                
                {/* Coupon Section */}
                <div className="mb-4 pb-4 border-b">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have a coupon?
                  </label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        disabled={isValidating}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isValidating}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:bg-gray-400"
                      >
                        {isValidating ? 'Validating...' : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: `${appliedCoupon.color}20` }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: appliedCoupon.color || '#3B82F6' }}
                        />
                        <div>
                          <div className="font-semibold text-sm">{appliedCoupon.code}</div>
                          {appliedCoupon.description && (
                            <div className="text-xs text-gray-600">{appliedCoupon.description}</div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-600 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-gray-900">₹{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  href={`/checkout${appliedCoupon ? `?coupon=${appliedCoupon.id}&discount=${discount}` : ''}`}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-colors mb-3 block text-center"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/products"
                  className="block text-center text-gray-900 hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
