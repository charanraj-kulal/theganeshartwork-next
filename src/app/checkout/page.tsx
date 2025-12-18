"use client";

import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: session?.user?.name || '',
    customerEmail: session?.user?.email || '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    paymentMethod: 'cod'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Razorpay payment integration
  const initiateRazorpayPayment = async (order: any) => {
    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy',
          amount: Math.round(order.total * 100), // Amount in paise
          currency: 'INR',
          name: 'Ganesh Artwork',
          description: `Order #${order.orderNumber}`,
          order_id: order.razorpayOrderId,
          handler: async function (response: any) {
            // Payment successful - verify payment
            try {
              setLoading(true);
              const verifyResponse = await fetch('/api/orders/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: order.id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              if (verifyResponse.ok) {
                // Send emails after successful payment
                toast.success('Payment successful! Sending confirmation emails...');
                
                // Send single email for all cart items
                const emailFormData = new FormData();
                
                // Add order details
                emailFormData.append('orderNumber', order.orderNumber);
                emailFormData.append('customerName', formData.customerName);
                emailFormData.append('customerEmail', formData.customerEmail);
                emailFormData.append('customerPhone', formData.customerPhone);
                emailFormData.append('shippingAddress', formData.shippingAddress);
                emailFormData.append('city', formData.city);
                emailFormData.append('state', formData.state);
                emailFormData.append('pincode', formData.pincode);
                emailFormData.append('paymentMethod', 'online');
                emailFormData.append('total', order.total.toString());
                
                // Add cart items as JSON
                emailFormData.append('cartItems', JSON.stringify(items));
                
                // Add images with index (image_0, image_1, etc.)
                items.forEach((item, index) => {
                  if (item.uploadedImage) {
                    emailFormData.append(`image_${index}`, item.uploadedImage);
                  }
                });

                try {
                  await fetch('/api/orders/send-cart-email', {
                    method: 'POST',
                    body: emailFormData,
                  });
                } catch (emailError) {
                  console.error('Email error:', emailError);
                }

                clearCart();
                toast.success('Order confirmed!');
                router.push(`/order-confirmation?orderId=${order.id}`);
              } else {
                toast.error('Payment verification failed. Please contact support.');
              }
            } catch (error) {
              console.error('Payment verification failed:', error);
              toast.error('Payment verification failed. Please contact support.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: formData.customerName,
            email: formData.customerEmail,
            contact: formData.customerPhone,
          },
          theme: {
            color: '#1f2937',
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              toast.info('Payment cancelled. Your order is saved.');
              router.push(`/order-confirmation?orderId=${order.id}`);
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };

      script.onerror = () => {
        setLoading(false);
        toast.error('Failed to load payment gateway. Please try again.');
        router.push(`/order-confirmation?orderId=${order.id}`);
      };
    } catch (error) {
      console.error('Razorpay error:', error);
      setLoading(false);
      toast.error('Payment gateway error. Please try Cash on Delivery.');
      router.push(`/order-confirmation?orderId=${order.id}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate form
    if (!formData.customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      toast.error('Please enter a valid email');
      return;
    }
    if (!formData.customerPhone.trim() || !/^\d{10}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.shippingAddress.trim()) {
      toast.error('Please enter your address');
      return;
    }
    if (!formData.city.trim()) {
      toast.error('Please enter your city');
      return;
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);

    try {
      // Show processing message
      if (formData.paymentMethod === 'online') {
        toast.info('Creating order... Please wait');
      } else {
        toast.info('Processing your order...');
      }

      // Validate and fetch real product IDs from database
      const validatedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const res = await fetch(`/api/products?slug=${item.slug}`);
            const data = await res.json();
            if (data.products && data.products.length > 0) {
              return {
                productId: data.products[0].id, // Real database UUID
                quantity: item.quantity,
                price: item.price
              };
            }
            return null;
          } catch (err) {
            console.error('Error validating product:', item.slug, err);
            return null;
          }
        })
      );

      // Filter out any null items
      const validItems = validatedItems.filter(item => item !== null);

      if (validItems.length === 0) {
        toast.error('No valid items in cart. Please add products again.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: validItems,
          subtotal: getTotalPrice(),
          total: getTotalPrice()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.details || data.error || 'Failed to place order');
        setLoading(false);
        return;
      }

      // For COD: Send emails immediately and redirect
      // For Online: Initiate payment first, send emails after successful payment
      if (formData.paymentMethod === 'cod') {
        toast.info('Sending confirmation emails...');
        
        // Send single email for all cart items
        const emailFormData = new FormData();
        
        // Add order details
        emailFormData.append('orderNumber', data.order.orderNumber);
        emailFormData.append('customerName', formData.customerName);
        emailFormData.append('customerEmail', formData.customerEmail);
        emailFormData.append('customerPhone', formData.customerPhone);
        emailFormData.append('shippingAddress', formData.shippingAddress);
        emailFormData.append('city', formData.city);
        emailFormData.append('state', formData.state);
        emailFormData.append('pincode', formData.pincode);
        emailFormData.append('paymentMethod', 'cod');
        emailFormData.append('total', getTotalPrice().toString());
        
        // Add cart items as JSON
        emailFormData.append('cartItems', JSON.stringify(items));
        
        // Add images with index (image_0, image_1, etc.)
        items.forEach((item, index) => {
          if (item.uploadedImage) {
            emailFormData.append(`image_${index}`, item.uploadedImage);
          }
        });

        try {
          await fetch('/api/orders/send-cart-email', {
            method: 'POST',
            body: emailFormData,
          });
        } catch (emailError) {
          console.error('Email error:', emailError);
        }

        clearCart();
        toast.success('Order placed successfully!');
        setLoading(false);
        router.push(`/order-confirmation?orderId=${data.order.id}`);
      } else {
        // For online payment: Initiate Razorpay
        toast.info('Opening payment gateway...');
        await initiateRazorpayPayment(data.order);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some items to proceed to checkout</p>
            <Link
              href="/products"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Address *</label>
                    <textarea
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-900">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-gray-700 font-semibold">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-900">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleChange}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-gray-700 font-semibold">Online Payment (Razorpay)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-gray-900">₹{getTotalPrice()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Your Order</h3>
            <p className="text-gray-600 mb-4">
              {formData.paymentMethod === 'online' 
                ? 'Please wait while we process your payment...' 
                : 'Sending confirmation emails...'}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800 font-semibold">
                ⚠️ Please do not close this window or press back button
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
