'use client';

import { useState, useRef, MouseEvent } from 'react';

interface ProductImageGalleryProps {
  mainImage: string;
  showcaseImages: string[];
  productName: string;
  onSale: boolean;
}

export default function ProductImageGallery({ 
  mainImage, 
  showcaseImages, 
  productName, 
  onSale 
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  
  // Filter out empty images and create array with main image first
  const allImages = [mainImage, ...showcaseImages.filter(img => img && img.trim() !== '')];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image with Zoom */}
      <div 
        ref={imageRef}
        className="relative bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg group"
        style={{ aspectRatio: '1/1' }}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        {onSale && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              SALE
            </span>
          </div>
        )}
        
        {/* Main Image */}
        <img
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: showZoom ? 0 : 1 }}
        />
        
        {/* Zoomed Image Overlay */}
        {showZoom && (
          <div 
            className="absolute inset-0 bg-white cursor-crosshair"
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: '200%',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
        
        {/* Zoom Indicator */}
        <div className={`absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded-lg transition-opacity duration-300 ${showZoom ? 'opacity-100' : 'opacity-0'}`}>
          🔍 Hover to zoom
        </div>
      </div>
      
      {/* Thumbnail Gallery - Always visible */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((img: string, i: number) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 border-4 ${
                selectedImage === img 
                  ? 'border-orange-500 scale-105 shadow-xl' 
                  : 'border-gray-300 hover:border-orange-300 hover:scale-105 shadow-md'
              }`}
              style={{ width: '100px', height: '100px' }}
            >
              <img 
                src={img} 
                alt={`View ${i + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        
        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="text-center mt-3">
            <p className="text-sm font-medium text-gray-600">
              Viewing {allImages.indexOf(selectedImage) + 1} of {allImages.length} images
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
