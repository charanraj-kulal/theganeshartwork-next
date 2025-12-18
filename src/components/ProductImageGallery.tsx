'use client';

import { useState } from 'react';

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
  const allImages = [mainImage, ...showcaseImages];

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative border-2 border-gray-200">
        {onSale && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            Sale!
          </span>
        )}
        <img
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-2">
        {allImages.map((img: string, i: number) => (
          <div 
            key={i} 
            className={`aspect-square bg-gray-100 rounded border-2 overflow-hidden cursor-pointer hover:border-orange-500 transition-colors ${
              selectedImage === img ? 'border-orange-500' : 'border-gray-200'
            }`}
            onClick={() => setSelectedImage(img)}
          >
            <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
