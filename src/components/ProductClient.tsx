"use client";

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Product } from '@/types';
import CheckoutModal, { CheckoutData } from './CheckoutModal';

interface ProductClientProps {
  product: Product;
}

const frameSizes = [
  { id: 'A0', label: 'A0 | 36×48', inches: '36×48', priceMultiplier: 3.0 },
  { id: 'A1', label: 'A1 | 24×36', inches: '24×36', priceMultiplier: 2.0 },
  { id: 'A2', label: 'A2 | 18×24', inches: '18×24', priceMultiplier: 1.5 },
  { id: 'A3', label: 'A3 | 12×18', inches: '12×18', priceMultiplier: 1.0 },
  { id: 'A4', label: 'A4 | 8×12', inches: '8×12', priceMultiplier: 0.7 },
];

export default function ProductClient({ product }: ProductClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(frameSizes[3]); // Default A3
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.image); // For image gallery
  const showcaseImages = product.images ? JSON.parse(product.images) : [];
  const allImages = [product.image, ...showcaseImages];

  const calculatedPrice = Math.round(product.price * selectedSize.priceMultiplier);

  // Razorpay payment integration
  const initiateRazorpayPayment = async (order: any, checkoutData: CheckoutData, uploadedImageFile: File | null) => {
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
            // Payment successful - verify and send emails
            try {
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
                // Payment verified - now send emails
                const emailFormData = new FormData();
                if (uploadedImageFile) {
                  emailFormData.append('image', uploadedImageFile);
                }
                emailFormData.append('productName', product.name);
                emailFormData.append('frameSize', selectedSize.label);
                emailFormData.append('price', calculatedPrice.toString());
                emailFormData.append('quantity', quantity.toString());
                emailFormData.append('orderNumber', order.orderNumber);
                emailFormData.append('customerName', checkoutData.customerName);
                emailFormData.append('customerEmail', checkoutData.customerEmail);
                emailFormData.append('customerPhone', checkoutData.customerPhone);
                emailFormData.append('shippingAddress', checkoutData.shippingAddress);
                emailFormData.append('city', checkoutData.city);
                emailFormData.append('state', checkoutData.state);
                emailFormData.append('pincode', checkoutData.pincode);
                emailFormData.append('paymentMethod', 'online');
                emailFormData.append('total', order.total.toString());

                try {
                  await fetch('/api/orders/send-email', {
                    method: 'POST',
                    body: emailFormData,
                  });
                } catch (emailError) {
                  console.error('Email error:', emailError);
                }

                toast.success('Payment successful!');
                router.push(`/order-confirmation?orderId=${order.id}`);
              } else {
                toast.error('Payment verification failed. Please contact support.');
              }
            } catch (error) {
              console.error('Payment verification failed:', error);
              toast.error('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: checkoutData.customerName,
            email: checkoutData.customerEmail,
            contact: checkoutData.customerPhone,
          },
          theme: {
            color: '#1f2937',
          },
          modal: {
            ondismiss: function() {
              toast.info('Payment cancelled. You can retry from order confirmation page.');
              router.push(`/order-confirmation?orderId=${order.id}`);
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };

      script.onerror = () => {
        toast.error('Failed to load payment gateway. Please try again.');
        router.push(`/order-confirmation?orderId=${order.id}`);
      };
    } catch (error) {
      console.error('Razorpay error:', error);
      toast.error('Payment gateway error. Please try Cash on Delivery.');
      router.push(`/order-confirmation?orderId=${order.id}`);
    }
  };

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!session) {
      toast.error('Please login to add items to cart');
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // Require image upload for all products
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    // Fetch real product ID from database
    try {
      const response = await fetch(`/api/products?slug=${product.slug}`);
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        const dbProduct = data.products[0];
        
        // Create a data URL from the uploaded image for preview
        let imageUrl: string | null = null;
        if (uploadedImage) {
          imageUrl = URL.createObjectURL(uploadedImage);
        }
        
        for (let i = 0; i < quantity; i++) {
          addItem({
            id: dbProduct.id,
            productId: dbProduct.id,
            name: `${product.name} (${selectedSize.label})`,
            slug: product.slug,
            price: calculatedPrice,
            image: product.image,
            uploadedImage: uploadedImage,
            uploadedImageUrl: imageUrl,
          });
        }
        toast.success(`${product.name} (${selectedSize.label}) added to cart!`);
        
        // Reset image upload for next item
        setUploadedImage(null);
      } else {
        toast.error('Product not available.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    // Require image upload for all products
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    // Show checkout modal
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async (checkoutData: CheckoutData, discount: number = 0, couponId?: string) => {
    setIsProcessing(true);

    try {
      // Fetch product from database
      const response = await fetch(`/api/products?slug=${product.slug}`);
      const data = await response.json();
      
      if (!data.products || data.products.length === 0) {
        toast.error('Product not available');
        setIsProcessing(false);
        return;
      }

      const dbProduct = data.products[0];
      const orderNumber = `ORD-${Date.now()}`;
      const finalTotal = Math.max(0, calculatedPrice * quantity - discount);

      // Create order
      const orderData = {
        ...checkoutData,
        items: [{
          productId: dbProduct.id,
          quantity: quantity,
          price: calculatedPrice,
        }],
        subtotal: calculatedPrice * quantity,
        total: finalTotal,
        discount: discount,
        ...(couponId && { couponId }),
      };

      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderResult = await orderResponse.json();

      // For COD: Send emails immediately and redirect
      // For Online: Initiate payment first, send emails after successful payment
      if (checkoutData.paymentMethod === 'cod') {
        // Send email notifications for COD orders
        const emailFormData = new FormData();
        if (uploadedImage) {
          emailFormData.append('image', uploadedImage);
        }
        emailFormData.append('productName', product.name);
        emailFormData.append('frameSize', selectedSize.label);
        emailFormData.append('price', calculatedPrice.toString());
        emailFormData.append('quantity', quantity.toString());
        emailFormData.append('orderNumber', orderResult.order.orderNumber);
        emailFormData.append('customerName', checkoutData.customerName);
        emailFormData.append('customerEmail', checkoutData.customerEmail);
        emailFormData.append('customerPhone', checkoutData.customerPhone);
        emailFormData.append('shippingAddress', checkoutData.shippingAddress);
        emailFormData.append('city', checkoutData.city);
        emailFormData.append('state', checkoutData.state);
        emailFormData.append('pincode', checkoutData.pincode);
        emailFormData.append('paymentMethod', checkoutData.paymentMethod);
        emailFormData.append('total', (calculatedPrice * quantity).toString());

        try {
          await fetch('/api/orders/send-email', {
            method: 'POST',
            body: emailFormData,
          });
        } catch (emailError) {
          console.error('Email error:', emailError);
        }

        toast.success('Order placed successfully!');
        setShowCheckoutModal(false);
        router.push(`/order-confirmation?orderId=${orderResult.order.id}`);
      } else {
        // For online payment: Initiate Razorpay
        setShowCheckoutModal(false);
        toast.info('Redirecting to payment gateway...');
        await initiateRazorpayPayment(orderResult.order, checkoutData, uploadedImage);
      }

    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image size should be less than 10MB');
        return;
      }
      setUploadedImage(file);
      toast.success('Image uploaded successfully');
    }
  };

  return (
    <>
      {/* Size Selector */}
      <div className="space-y-3 mb-6 text-gray-900">
        <label className="text-gray-900 font-bold text-lg block">Select Frame Size (in inches)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {frameSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size)}
              className={`p-3 border-2 rounded-lg font-medium transition-all ${
                selectedSize.id === size.id
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            Selected Size: <span className="font-bold">{selectedSize.label}</span>
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{calculatedPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Image Upload - Required */}
      <div className="space-y-3 mb-6">
        <label className="text-gray-900 font-bold text-lg block">
          Upload Your Photo <span className="text-red-500">*</span>
        </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              {uploadedImage ? (
                <div className="space-y-3">
                  <div className="relative w-32 h-32 mx-auto">
                    <img 
                      src={URL.createObjectURL(uploadedImage)} 
                      alt="Uploaded preview" 
                      className="w-full h-full object-cover rounded-lg border-2 border-green-500 shadow-lg"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-green-700 font-medium text-sm">{uploadedImage.name}</p>
                  <p className="text-xs text-gray-600">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-900 font-medium">Click to upload your photo</p>
                  <p className="text-sm text-gray-600">Max size: 10MB (JPG, PNG)</p>
                </div>
              )}
            </label>
          </div>
        <p className="text-sm text-gray-900 bg-blue-50 border border-blue-200 rounded-lg p-3">
          📸 <span className="font-semibold">Your design will be shared within 4 hours for approval before printing</span>
        </p>
      </div>

      {/* Quantity */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-4 text-gray-900">
          <label className="text-gray-700 font-semibold">Quantity:</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-6 py-2 border-x">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button 
          onClick={handleBuyNow}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold py-4 rounded-lg transition-all text-lg shadow-lg"
        >
          Buy Now - ₹{(calculatedPrice * quantity).toLocaleString()}
        </button>
        <button 
          onClick={handleAddToCart}
          className="w-full border-2 border-gray-900 text-gray-900 font-bold py-4 rounded-lg hover:bg-gray-900 hover:text-white transition-colors text-lg"
        >
          Add to Cart
        </button>
      </div>

      {/* Size Chart Button */}
      <button 
        onClick={() => document.getElementById('size-chart')?.scrollIntoView({ behavior: 'smooth' })}
        className="w-full mt-4 text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
      >
        📏 View Size Chart
      </button>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSubmit={handleCheckoutSubmit}
        isProcessing={isProcessing}
        orderTotal={calculatedPrice * quantity}
        productId={product.id.toString()}
        categoryId={product.categoryId}
      />

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Your Order</h3>
            <p className="text-gray-600 mb-4">
              Please wait while we process your payment and send confirmation...
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800 font-semibold">
                ⚠️ Please do not close this window or press back button
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
