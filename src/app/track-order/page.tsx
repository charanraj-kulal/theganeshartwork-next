'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prefill form from URL parameters
  useEffect(() => {
    const urlOrderNumber = searchParams.get('orderNumber');
    const urlEmail = searchParams.get('email');
    
    if (urlOrderNumber) setOrderNumber(urlOrderNumber);
    if (urlEmail) setEmail(decodeURIComponent(urlEmail));
  }, [searchParams]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/orders/track?orderNumber=${orderNumber}&email=${email}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Order not found');
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      setError('Failed to track order. Please try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'shipped':
        return <Truck className="w-8 h-8 text-blue-500" />;
      case 'processing':
        return <Package className="w-8 h-8 text-orange-500" />;
      default:
        return <Clock className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order details to track your shipment</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., ORD-1234567890"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all font-semibold text-lg shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order Status</h2>
                    <p className="text-gray-600">Order #{order.orderNumber}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full border-2 font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <div className={`flex items-center gap-4 ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? '' : 'opacity-50'}`}>
                  <div className={`w-4 h-4 rounded-full ${order.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 ${['processing', 'shipped', 'delivered'].includes(order.status) ? '' : 'opacity-50'}`}>
                  <div className={`w-4 h-4 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">Design approval & production</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 ${['shipped', 'delivered'].includes(order.status) ? '' : 'opacity-50'}`}>
                  <div className={`w-4 h-4 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Shipped</p>
                    <p className="text-sm text-gray-600">On the way to you</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 ${order.status === 'delivered' ? '' : 'opacity-50'}`}>
                  <div className={`w-4 h-4 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Delivered</p>
                    <p className="text-sm text-gray-600">Package delivered successfully</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Details</h3>
              
              <div className="space-y-4">
                {order.orderItems?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-200">
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

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-900">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h3>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{order.customerName}</p>
                <p>{order.shippingAddress}</p>
                <p>{order.city}, {order.state} - {order.pincode}</p>
                <p className="pt-2">Phone: {order.customerPhone}</p>
                <p>Email: {order.customerEmail}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href="/products"
                className="flex-1 bg-white border-2 border-gray-900 text-gray-900 px-6 py-4 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors text-center"
              >
                Continue Shopping
              </Link>
              <a
                href={`https://wa.me/919448075790?text=I%20need%20help%20with%20my%20order%20number%20${order.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-colors text-center"
              >
                💬 Contact Support
              </a>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!order && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-6">
              You can find your order number in the confirmation email sent to your registered email address.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/contact-us"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/faqs"
                className="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors"
              >
                View FAQs
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
