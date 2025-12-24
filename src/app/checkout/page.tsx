"use client";

import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get coupon info from URL params
  const couponId = searchParams.get('coupon');
  const couponDiscount = parseFloat(searchParams.get('discount') || '0');
  
  const [formData, setFormData] = useState({
    customerName: session?.user?.name || '',
    customerEmail: session?.user?.email || '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    paymentMethod: 'online' // Default to online payment only
  });

  const getFinalTotal = () => {
    return Math.max(0, getTotalPrice() - couponDiscount);
  };

  // Refs for scrolling to errors
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const pincodeRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let firstErrorRef: any = null;

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
      if (!firstErrorRef) firstErrorRef = nameRef;
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
      if (!firstErrorRef) firstErrorRef = emailRef;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
      if (!firstErrorRef) firstErrorRef = emailRef;
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
      if (!firstErrorRef) firstErrorRef = phoneRef;
    } else if (!/^\d{10}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      newErrors.customerPhone = 'Phone number must be 10 digits';
      if (!firstErrorRef) firstErrorRef = phoneRef;
    }

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Shipping address is required';
      if (!firstErrorRef) firstErrorRef = addressRef;
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      if (!firstErrorRef) firstErrorRef = cityRef;
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
      if (!firstErrorRef) firstErrorRef = pincodeRef;
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
      if (!firstErrorRef) firstErrorRef = pincodeRef;
    }

    setErrors(newErrors);

    // Scroll to first error
    if (firstErrorRef && firstErrorRef.current) {
      firstErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorRef.current.focus();
      toast.error('Please fill in all required fields correctly');
    }

    return Object.keys(newErrors).length === 0;
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
          amount: Math.round(getFinalTotal() * 100), // Amount in paise
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
    if (!validateForm()) {
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
          discount: couponDiscount,
          total: getFinalTotal(),
          couponId: couponId || null
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
                    <label className="block text-gray-700 font-semibold mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={nameRef}
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                        errors.customerName 
                          ? 'border-red-500 bg-red-50 focus:border-red-600 animate-shake' 
                          : 'border-gray-300 focus:border-gray-900'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.customerName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={phoneRef}
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                        errors.customerPhone 
                          ? 'border-red-500 bg-red-50 focus:border-red-600 animate-shake' 
                          : 'border-gray-300 focus:border-gray-900'
                      }`}
                      placeholder="9876543210"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.customerPhone}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                        errors.customerEmail 
                          ? 'border-red-500 bg-red-50 focus:border-red-600 animate-shake' 
                          : 'border-gray-300 focus:border-gray-900'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.customerEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      ref={addressRef}
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      required
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors resize-none ${
                        errors.shippingAddress 
                          ? 'border-red-500 bg-red-50 focus:border-red-600 animate-shake' 
                          : 'border-gray-300 focus:border-gray-900'
                      }`}
                      placeholder="House No., Street, Area, Landmark"
                    />
                    {errors.shippingAddress && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.shippingAddress}
                      </p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={cityRef}
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                          errors.city 
                            ? 'border-red-500 bg-red-50 focus:border-red-600 animate-shake' 
                            : 'border-gray-300 focus:border-gray-900'
                        }`}
                        placeholder="Your City"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                      >
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Telangana">Telangana</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={pincodeRef}
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        maxLength={6}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                          errors.pincode 
                            ? 'border-red-500 bg-red-50 focus:border-red-600 animate-shake' 
                            : 'border-gray-300 focus:border-gray-900'
                        }`}
                        placeholder="560001"
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">Secure Online Payment</h4>
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">SAFE</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        Pay securely using Razorpay payment gateway. 100% secure and encrypted.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 border border-gray-200 shadow-sm">💳 Credit Card</span>
                        <span className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 border border-gray-200 shadow-sm">💳 Debit Card</span>
                        <span className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 border border-gray-200 shadow-sm">📱 UPI</span>
                        <span className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 border border-gray-200 shadow-sm">🏦 Net Banking</span>
                        <span className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 border border-gray-200 shadow-sm">👛 Wallets</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-yellow-800 font-semibold">
                      Cash on Delivery is not available. We only accept online payments for faster order processing and confirmation.
                    </p>
                  </div>
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
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
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
