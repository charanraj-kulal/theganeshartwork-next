'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

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
  applicableProducts: string | null;
  applicableCategories: string | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  maxUses: number | null;
  usedCount: number;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

export default function CouponsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCoupon, setViewingCoupon] = useState<Coupon | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    color: '#3B82F6',
    minOrderAmount: '',
    minQuantity: '',
    applicabilityType: 'all',
    applicableProducts: [] as string[],
    applicableCategories: [] as string[],
    isActive: true,
    startDate: '',
    endDate: '',
    maxUses: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchCoupons();
      fetchProducts();
      fetchCategories();
    }
  }, [status, session, router]);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons');
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCoupon 
        ? `/api/admin/coupons/${editingCoupon.id}`
        : '/api/admin/coupons';
      
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          applicableProducts: formData.applicabilityType === 'products' && formData.applicableProducts.length > 0 
            ? formData.applicableProducts 
            : null,
          applicableCategories: formData.applicabilityType === 'categories' && formData.applicableCategories.length > 0 
            ? formData.applicableCategories 
            : null,
        }),
      });

      if (response.ok) {
        alert(`Coupon ${editingCoupon ? 'updated' : 'created'} successfully!`);
        setShowModal(false);
        resetForm();
        fetchCoupons();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Failed to save coupon');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      color: coupon.color || '#3B82F6',
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      minQuantity: coupon.minQuantity?.toString() || '',
      applicabilityType: coupon.applicabilityType || 'all',
      applicableProducts: coupon.applicableProducts 
        ? JSON.parse(coupon.applicableProducts) 
        : [],
      applicableCategories: coupon.applicableCategories 
        ? JSON.parse(coupon.applicableCategories) 
        : [],
      isActive: coupon.isActive,
      startDate: coupon.startDate ? coupon.startDate.split('T')[0] : '',
      endDate: coupon.endDate ? coupon.endDate.split('T')[0] : '',
      maxUses: coupon.maxUses?.toString() || '',
    });
    setShowModal(true);
  };

  const handleView = (coupon: Coupon) => {
    setViewingCoupon(coupon);
    setShowViewModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Coupon deleted successfully!');
        fetchCoupons();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      color: '#3B82F6',
      minOrderAmount: '',
      minQuantity: '',
      applicabilityType: 'all',
      applicableProducts: [],
      applicableCategories: [],
      isActive: true,
      startDate: '',
      endDate: '',
      maxUses: '',
    });
  };

  const handleProductToggle = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      applicableProducts: prev.applicableProducts.includes(productId)
        ? prev.applicableProducts.filter(id => id !== productId)
        : [...prev.applicableProducts, productId]
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      applicableCategories: prev.applicableCategories.includes(categoryId)
        ? prev.applicableCategories.filter(id => id !== categoryId)
        : [...prev.applicableCategories, categoryId]
    }));
  };

  const handleSelectAllProducts = () => {
    setFormData(prev => ({
      ...prev,
      applicableProducts: prev.applicableProducts.length === products.length 
        ? [] 
        : products.map(p => p.id)
    }));
  };

  const handleSelectAllCategories = () => {
    setFormData(prev => ({
      ...prev,
      applicableCategories: prev.applicableCategories.length === categories.length 
        ? [] 
        : categories.map(c => c.id)
    }));
  };

  const getApplicabilityText = (coupon: Coupon) => {
    const type = coupon.applicabilityType || 'all';
    if (type === 'all') return 'All Products';
    if (type === 'products') {
      const count = coupon.applicableProducts ? JSON.parse(coupon.applicableProducts).length : 0;
      return `${count} Product${count !== 1 ? 's' : ''}`;
    }
    if (type === 'categories') {
      const count = coupon.applicableCategories ? JSON.parse(coupon.applicableCategories).length : 0;
      return `${count} Categor${count !== 1 ? 'ies' : 'y'}`;
    }
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            + Add New Coupon
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applies To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conditions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                        style={{ backgroundColor: coupon.color || '#3B82F6' }}
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {coupon.code}
                        </div>
                        {coupon.description && (
                          <div className="text-xs text-gray-500 max-w-xs truncate">
                            {coupon.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getApplicabilityText(coupon)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.minOrderAmount && (
                      <div className="flex items-center text-xs">
                        <span className="font-medium">Min:</span> ₹{coupon.minOrderAmount}
                      </div>
                    )}
                    {coupon.minQuantity && (
                      <div className="flex items-center text-xs">
                        <span className="font-medium">Qty:</span> {coupon.minQuantity}+
                      </div>
                    )}
                    {!coupon.minOrderAmount && !coupon.minQuantity && (
                      <span className="text-xs text-gray-400">No conditions</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coupon.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.usedCount}
                      {coupon.maxUses && ` / ${coupon.maxUses}`}
                    </div>
                    {coupon.maxUses && (
                      <div className="text-xs text-gray-500">
                        {Math.round((coupon.usedCount / coupon.maxUses) * 100)}% used
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleView(coupon)}
                      className="text-green-600 hover:text-green-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No coupons found. Create your first coupon to get started!
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full my-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coupon Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="e.g., WELCOME10"
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Badge Color
                    </label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Welcome offer for new customers"
                    />
                  </div>

                  {/* Discount Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                    />
                  </div>

                  {/* Min Order Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Order Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>

                  {/* Min Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.minQuantity}
                      onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Max Uses */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Uses
                    </label>
                    <input
                      type="number"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Unlimited if empty"
                    />
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center pt-7">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-900">
                      Active
                    </label>
                  </div>

                  {/* Applicability Type */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applies To *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="applicabilityType"
                          value="all"
                          checked={formData.applicabilityType === 'all'}
                          onChange={(e) => setFormData({ ...formData, applicabilityType: e.target.value, applicableProducts: [], applicableCategories: [] })}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">All Products</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="applicabilityType"
                          value="products"
                          checked={formData.applicabilityType === 'products'}
                          onChange={(e) => setFormData({ ...formData, applicabilityType: e.target.value, applicableCategories: [] })}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">Specific Products</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="applicabilityType"
                          value="categories"
                          checked={formData.applicabilityType === 'categories'}
                          onChange={(e) => setFormData({ ...formData, applicabilityType: e.target.value, applicableProducts: [] })}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">Specific Categories</span>
                      </label>
                    </div>
                  </div>

                  {/* Specific Products Selection */}
                  {formData.applicabilityType === 'products' && (
                    <div className="md:col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Products
                        </label>
                        <button
                          type="button"
                          onClick={handleSelectAllProducts}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {formData.applicableProducts.length === products.length ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {products.map((product) => (
                            <label key={product.id} className="flex items-center hover:bg-white p-2 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.applicableProducts.includes(product.id)}
                                onChange={() => handleProductToggle(product.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-900">{product.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.applicableProducts.length} of {products.length} products selected
                      </p>
                    </div>
                  )}

                  {/* Specific Categories Selection */}
                  {formData.applicabilityType === 'categories' && (
                    <div className="md:col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Categories
                        </label>
                        <button
                          type="button"
                          onClick={handleSelectAllCategories}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {formData.applicableCategories.length === categories.length ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categories.map((category) => (
                            <label key={category.id} className="flex items-center hover:bg-white p-2 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.applicableCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-900">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.applicableCategories.length} of {categories.length} categories selected
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                  >
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showViewModal && viewingCoupon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Coupon Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Code and Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: viewingCoupon.color || '#3B82F6' }}
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{viewingCoupon.code}</h3>
                      {viewingCoupon.description && (
                        <p className="text-sm text-gray-600 mt-1">{viewingCoupon.description}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      viewingCoupon.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {viewingCoupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Discount Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Discount</p>
                    <p className="text-xl font-bold text-blue-600">
                      {viewingCoupon.discountType === 'percentage'
                        ? `${viewingCoupon.discountValue}%`
                        : `₹${viewingCoupon.discountValue}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {viewingCoupon.discountType === 'percentage' ? 'Percentage Off' : 'Fixed Amount'}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Usage</p>
                    <p className="text-xl font-bold text-purple-600">
                      {viewingCoupon.usedCount}{viewingCoupon.maxUses && ` / ${viewingCoupon.maxUses}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {viewingCoupon.maxUses 
                        ? `${Math.round((viewingCoupon.usedCount / viewingCoupon.maxUses) * 100)}% used`
                        : 'Unlimited uses'}
                    </p>
                  </div>
                </div>

                {/* Applicability */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Applies To:</p>
                  <p className="text-base text-gray-900">
                    {getApplicabilityText(viewingCoupon)}
                  </p>
                  {viewingCoupon.applicabilityType === 'products' && viewingCoupon.applicableProducts && (
                    <div className="mt-2 text-sm text-gray-600">
                      {JSON.parse(viewingCoupon.applicableProducts).map((id: string) => {
                        const product = products.find(p => p.id === id);
                        return product ? product.name : null;
                      }).filter(Boolean).join(', ')}
                    </div>
                  )}
                  {viewingCoupon.applicabilityType === 'categories' && viewingCoupon.applicableCategories && (
                    <div className="mt-2 text-sm text-gray-600">
                      {JSON.parse(viewingCoupon.applicableCategories).map((id: string) => {
                        const category = categories.find(c => c.id === id);
                        return category ? category.name : null;
                      }).filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>

                {/* Conditions */}
                {(viewingCoupon.minOrderAmount || viewingCoupon.minQuantity) && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Conditions:</p>
                    <div className="space-y-1">
                      {viewingCoupon.minOrderAmount && (
                        <p className="text-sm text-gray-900">
                          • Minimum order amount: ₹{viewingCoupon.minOrderAmount}
                        </p>
                      )}
                      {viewingCoupon.minQuantity && (
                        <p className="text-sm text-gray-900">
                          • Minimum quantity: {viewingCoupon.minQuantity} items
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Validity Period */}
                {(viewingCoupon.startDate || viewingCoupon.endDate) && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Validity Period:</p>
                    <div className="space-y-1">
                      {viewingCoupon.startDate && (
                        <p className="text-sm text-gray-900">
                          • Starts: {new Date(viewingCoupon.startDate).toLocaleDateString()}
                        </p>
                      )}
                      {viewingCoupon.endDate && (
                        <p className="text-sm text-gray-900">
                          • Ends: {new Date(viewingCoupon.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Created Date */}
                <div className="text-sm text-gray-500 text-center pt-4 border-t">
                  Created on {new Date(viewingCoupon.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingCoupon);
                  }}
                  className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Edit Coupon
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
