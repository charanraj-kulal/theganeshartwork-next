'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, X } from 'lucide-react';

export default function AddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [mainImage, setMainImage] = useState('');
  const [showcaseImages, setShowcaseImages] = useState<string[]>(['', '', '', '']);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    inStock: true,
    featured: false,
    onSale: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleImageUpload = async (file: File, isMain: boolean, index?: number) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);
    if (!isMain && index !== undefined) {
      setUploadingIndex(index);
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        if (isMain) {
          setMainImage(data.imageUrl);
        } else if (index !== undefined) {
          const newShowcaseImages = [...showcaseImages];
          newShowcaseImages[index] = data.imageUrl;
          setShowcaseImages(newShowcaseImages);
        }
      } else {
        const error = await response.json();
        alert('Upload failed: ' + error.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      setUploadingIndex(null);
    }
  };

  const removeShowcaseImage = (index: number) => {
    const newShowcaseImages = [...showcaseImages];
    newShowcaseImages[index] = '';
    setShowcaseImages(newShowcaseImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mainImage) {
      alert('Please upload a main product image');
      return;
    }

    setLoading(true);

    try {
      // Filter out empty showcase images
      const validShowcaseImages = showcaseImages.filter(img => img !== '');

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          image: mainImage,
          images: JSON.stringify(validShowcaseImages),
        }),
      });

      if (response.ok) {
        alert('Product added successfully!');
        router.push('/admin/products');
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Failed to add product'));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <Link
            href="/admin/products"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Products
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="product-slug"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated from product name</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (₹) - Optional
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1499"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Main Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Product Image * (Required)
            </label>
            <div className="mt-1">
              {mainImage ? (
                <div className="relative">
                  <img
                    src={mainImage}
                    alt="Main"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setMainImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
                    disabled={uploading}
                  />
                </label>
              )}
              {uploading && uploadingIndex === null && (
                <p className="text-sm text-blue-600 mt-2">Uploading main image...</p>
              )}
            </div>
          </div>

          {/* Showcase Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Showcase Images (Up to 4 - Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {showcaseImages.map((img, index) => (
                <div key={index} className="relative">
                  {img ? (
                    <div className="relative">
                      <img
                        src={img}
                        alt={`Showcase ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeShowcaseImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <p className="text-xs text-gray-500 mt-1">Image {index + 1}</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], false, index)}
                        disabled={uploading}
                      />
                    </label>
                  )}
                  {uploading && uploadingIndex === index && (
                    <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.onSale}
                onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">On Sale</span>
            </label>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
