'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  color: string | null;
  minOrderAmount: number | null;
  minQuantity: number | null;
  applicabilityType: string | null;
  maxUses: number | null;
  usedCount: number;
  startDate: string | null;
  endDate: string | null;
}

export default function OffersSection() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveCoupons();
  }, []);

  const fetchActiveCoupons = async () => {
    try {
      const response = await fetch('/api/coupons/active');
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied!`);
  };

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    }
    return `₹${coupon.discountValue} OFF`;
  };

  const getConditionsText = (coupon: Coupon) => {
    const conditions = [];
    if (coupon.minOrderAmount) {
      conditions.push(`Min. ₹${coupon.minOrderAmount}`);
    }
    if (coupon.minQuantity) {
      conditions.push(`Buy ${coupon.minQuantity}+ items`);
    }
    
    const type = coupon.applicabilityType || 'all';
    if (type === 'products') {
      conditions.push('Selected products only');
    } else if (type === 'categories') {
      conditions.push('Selected categories only');
    } else {
      conditions.push('All products');
    }

    return conditions.join(' • ');
  };

  const getValidityText = (coupon: Coupon) => {
    if (coupon.endDate) {
      const endDate = new Date(coupon.endDate);
      const now = new Date();
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysLeft <= 0) return null; // Don't show expired coupons
      if (daysLeft === 1) return 'Expires today';
      if (daysLeft <= 7) return `${daysLeft} days left`;
      return `Valid till ${endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
    }
    return null;
  };

  const getUsageText = (coupon: Coupon) => {
    if (coupon.maxUses) {
      const remaining = coupon.maxUses - coupon.usedCount;
      if (remaining <= 0) return null; // Don't show fully used coupons
      if (remaining <= 10) return `Only ${remaining} left`;
    }
    return null;
  };

  // Filter out invalid coupons
  const validCoupons = coupons.filter(coupon => {
    // Check if expired
    if (coupon.endDate && new Date(coupon.endDate) < new Date()) return false;
    // Check if not started
    if (coupon.startDate && new Date(coupon.startDate) > new Date()) return false;
    // Check if max uses reached
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return false;
    return true;
  });

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (validCoupons.length === 0) {
    return null; // Don't show section if no coupons
  }

  return (
    <section className="py-12 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🎁 Special Offers
          </h2>
          <p className="text-gray-600 text-lg">
            Save big on your orders with our exclusive coupon codes!
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {validCoupons.map((coupon) => {
            const validity = getValidityText(coupon);
            const usage = getUsageText(coupon);

            return (
              <div
                key={coupon.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200"
              >
                {/* Coupon Header with Discount Badge */}
                <div
                  className="p-6 text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${coupon.color || '#8B5CF6'} 0%, ${coupon.color || '#8B5CF6'}dd 100%)`
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-1">
                      {getDiscountText(coupon)}
                    </h3>
                    {coupon.description && (
                      <p className="text-white text-opacity-90 text-sm">
                        {coupon.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Coupon Body */}
                <div className="p-6">
                  {/* Coupon Code */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
                      Coupon Code
                    </p>
                    <div className="flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3">
                      <code className="text-lg font-bold text-gray-900 tracking-wider">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => handleCopyCoupon(coupon.code)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
                      How to Avail
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {getConditionsText(coupon)}
                    </p>
                  </div>

                  {/* Validity & Usage Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {validity && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {validity}
                      </span>
                    )}
                    {usage && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {usage}
                      </span>
                    )}
                  </div>
                </div>

                {/* Coupon Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <a
                    href="/cart"
                    className="block text-center text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors"
                  >
                    Shop Now & Apply →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-gray-600 text-sm">
            💡 <strong>Tip:</strong> Copy the code and apply it at checkout to get instant discount!
          </p>
        </div>
      </div>
    </section>
  );
}
