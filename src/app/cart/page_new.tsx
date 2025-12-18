"use client";

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Trash2, Plus, Minus, Upload, Check, ShoppingBag, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ImageUploadModal from '@/components/ImageUploadModal';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, updateItemImage, loadFromServer } = useCartStore();
  const { data: session } = useSession();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);

  // Load cart from server when user logs in
  useEffect(() => {
    if (session) {
      loadFromServer();
    }
  }, [session, loadFromServer]);

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast.success('Item removed from cart');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(productId, quantity);
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const openUploadModal = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setUploadModalOpen(true);
  };

  const handleImageUpload = (file: File, imageUrl: string) => {
    if (selectedProduct) {
      updateItemImage(selectedProduct.id, file, imageUrl);
      toast.success('Image uploaded successfully!');
    }
  };

  const isCollageProduct = (productName: string) => {
    return productName.toLowerCase().includes('collage');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm flex items-center gap-2">
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">Shopping Cart</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping to find amazing personalized frames!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-lg transition-colors shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 pr-4">
                            <Link 
                              href={`/product/${item.slug}`}
                              className="font-bold text-lg text-gray-900 hover:text-gray-700 transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                              ₹{(item.price * item.quantity).toLocaleString()}
                              <span className="text-sm font-normal text-gray-500 ml-2">
                                (₹{item.price} each)
                              </span>
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                          <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-6 py-2 font-bold text-gray-900 min-w-[60px] text-center border-x-2 border-gray-300">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Image Upload Status */}
                        {!isCollageProduct(item.name) && (
                          <div className="mt-4">
                            {item.uploadedImageUrl ? (
                              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-green-800">Image Uploaded</p>
                                  <p className="text-xs text-green-600">Your photo has been attached to this item</p>
                                </div>
                                <button
                                  onClick={() => openUploadModal(item.productId, item.name)}
                                  className="text-xs text-green-700 hover:text-green-800 font-semibold underline"
                                >
                                  Change
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => openUploadModal(item.productId, item.name)}
                                className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-3 rounded-lg border-2 border-blue-200 transition-colors"
                              >
                                <Upload className="w-4 h-4" />
                                Upload Your Photo
                              </button>
                            )}
                          </div>
                        )}

                        {/* Collage Product Note */}
                        {isCollageProduct(item.name) && (
                          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-sm text-amber-800">
                              <strong>📧 Collage Product:</strong> Send multiple photos via email after checkout. We'll send instructions to your registered email.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-semibold">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold py-4 rounded-lg transition-all text-center text-lg shadow-lg"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="block w-full mt-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-colors text-center"
                >
                  Continue Shopping
                </Link>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-semibold mb-2">💡 Important Notes:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Upload photos for non-collage items before checkout</li>
                    <li>• Design approval within 4 hours</li>
                    <li>• Free delivery across Karnataka</li>
                    <li>• 5-7 business days delivery</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setSelectedProduct(null);
        }}
        onUpload={handleImageUpload}
        productName={selectedProduct?.name || ''}
      />
    </main>
  );
}
