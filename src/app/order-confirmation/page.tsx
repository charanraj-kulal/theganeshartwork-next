'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Mail, Phone } from 'lucide-react';

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Fetch order details
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg mb-4">Thank you for your purchase</p>
          <div className="bg-gray-50 rounded-lg p-4 inline-block mb-4">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
          </div>
          <div className="mt-4">
            <Link
              href={`/track-order?orderNumber=${order.orderNumber}&email=${order.customerEmail}`}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              📦 Track This Order
            </Link>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Order Details
          </h2>
          
          <div className="space-y-4">
            {order.orderItems?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                  <p className="font-semibold text-gray-900">{item.product.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <p className="text-lg font-bold text-gray-900">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{order.total.toLocaleString()}</p>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm font-semibold text-blue-900">Payment Method</p>
              <p className="text-blue-700">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
          <div className="text-gray-700 space-y-1">
            <p className="font-semibold">{order.customerName}</p>
            <p>{order.shippingAddress}</p>
            <p>{order.city}, {order.state} - {order.pincode}</p>
            <p className="flex items-center gap-2 mt-3">
              <Phone className="w-4 h-4" />
              {order.customerPhone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {order.customerEmail}
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold mb-4">📸 What's Next?</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
              <p>We'll review your uploaded photo and create the design</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
              <p>You'll receive design approval within 4 hours via email/WhatsApp</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
              <p>After approval, we'll start printing and packaging</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
              <p>Estimated delivery: 5-7 business days</p>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/products"
            className="flex-1 bg-white border-2 border-gray-900 text-gray-900 px-6 py-4 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <a
            href="https://wa.me/919353649294"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-colors text-center"
          >
            💬 Contact on WhatsApp
          </a>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800">
            📧 A confirmation email has been sent to <strong>{order.customerEmail}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
