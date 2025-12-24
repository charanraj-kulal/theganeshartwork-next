'use client';

import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutData, discount: number, couponId?: string) => void;
  isProcessing?: boolean;
  orderTotal: number;
  productId?: string;
  categoryId?: string;
}

export interface CheckoutData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'online' | 'cod';
}

interface AppliedCoupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  color: string | null;
}

export default function CheckoutModal({ isOpen, onClose, onSubmit, isProcessing, orderTotal, productId, categoryId }: CheckoutModalProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    paymentMethod: 'online', // Default to online payment only
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  // Refs for scrolling to errors
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const pincodeRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CheckoutData, string>> = {};
    let firstErrorRef: any = null;

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
      if (!firstErrorRef) firstErrorRef = nameRef;
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
      if (!firstErrorRef) firstErrorRef = emailRef;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
      if (!firstErrorRef) firstErrorRef = emailRef;
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone is required';
      if (!firstErrorRef) firstErrorRef = phoneRef;
    } else if (!/^\d{10}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      newErrors.customerPhone = 'Phone must be 10 digits';
      if (!firstErrorRef) firstErrorRef = phoneRef;
    }

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Address is required';
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
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, discount, appliedCoupon?.id);
    }
  };

  const handleChange = (field: keyof CheckoutData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    try {
      const cartItems = [{
        productId: productId || '',
        categoryId: categoryId,
        quantity: 1,
        price: orderTotal
      }];

      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          cartItems,
          subtotal: orderTotal
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
    return Math.max(0, orderTotal - discount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold">Complete Your Order</h2>
            <p className="text-gray-300 text-sm mt-1">Fill in your details to proceed</p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Order Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Order Subtotal:</span>
                <span className="text-xl font-semibold text-gray-900">₹{orderTotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="font-medium">Discount:</span>
                  <span className="text-xl font-semibold">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Total Amount:</span>
                <span className="text-3xl font-bold text-gray-900">₹{getFinalTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Have a Coupon Code?
            </h3>
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isValidating || isProcessing}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidating || isProcessing}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:bg-gray-400 transition-colors"
                >
                  {isValidating ? 'Validating...' : 'Apply'}
                </button>
              </div>
            ) : (
              <div 
                className="flex items-center justify-between p-3 rounded-lg border"
                style={{ 
                  backgroundColor: `${appliedCoupon.color}15`,
                  borderColor: `${appliedCoupon.color}40`
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: appliedCoupon.color || '#8B5CF6' }}
                  />
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{appliedCoupon.code}</div>
                    {appliedCoupon.description && (
                      <div className="text-xs text-gray-600">{appliedCoupon.description}</div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  disabled={isProcessing}
                  className="text-red-500 hover:text-red-600 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameRef}
                type="text"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                  errors.customerName ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                disabled={isProcessing}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleChange('customerEmail', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                    errors.customerEmail ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                  disabled={isProcessing}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  ref={phoneRef}
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleChange('customerPhone', e.target.value)}
                  maxLength={10}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                    errors.customerPhone ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-300'
                  }`}
                  placeholder="9876543210"
                  disabled={isProcessing}
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
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Shipping Address</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea
                ref={addressRef}
                value={formData.shippingAddress}
                onChange={(e) => handleChange('shippingAddress', e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none transition-colors ${
                  errors.shippingAddress ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-300'
                }`}
                placeholder="House No., Street, Area"
                disabled={isProcessing}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  ref={cityRef}
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                    errors.city ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-300'
                  }`}
                  placeholder="City"
                  disabled={isProcessing}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  disabled={isProcessing}
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  ref={pincodeRef}
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                    errors.pincode ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-300'
                  }`}
                  placeholder="560001"
                  maxLength={6}
                  disabled={isProcessing}
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

          {/* Payment Method */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Payment Method</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    Pay securely using Razorpay payment gateway
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 border border-gray-200">Credit Card</span>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 border border-gray-200">Debit Card</span>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 border border-gray-200">UPI</span>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 border border-gray-200">Net Banking</span>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 border border-gray-200">Wallets</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Cash on Delivery is not available. We only accept online payments for faster processing.</span>
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all font-medium disabled:opacity-50 shadow-lg"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Place Order - ₹${getFinalTotal().toFixed(2)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
