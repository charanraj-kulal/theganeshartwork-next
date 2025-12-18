# Image Download Guide for Decorior.in Clone

## Overview
This guide will help you download all product and category images from the original decorior.in website and organize them in your project.

## Directory Structure
Create the following directories in your project:
```
public/
├── images/
│   ├── categories/
│   │   ├── personalised.jpg
│   │   ├── birthday.jpg
│   │   ├── anniversary.jpg
│   │   ├── couple.jpg
│   │   ├── family.jpg
│   │   ├── wedding.jpg
│   │   ├── collage.jpg
│   │   └── pet.jpg
│   ├── products/
│   │   ├── mini-frames.jpg
│   │   ├── wooden-stand-frames.jpg
│   │   ├── photo-restoration.jpg
│   │   ├── mosaic-frame.jpg
│   │   ├── merge-frame.jpg
│   │   ├── master-collage.jpg
│   │   ├── oil-painting.jpg
│   │   ├── birthday-table.jpg
│   │   ├── bw-mosaic.jpg
│   │   ├── acrylic-mini.jpg
│   │   ├── baby-journey.jpg
│   │   ├── personalised.jpg
│   │   ├── acrylic-frame.jpg
│   │   ├── birthday-frame.jpg
│   │   └── birthday-wishes.jpg
│   ├── hero/
│   │   ├── slide1.jpg
│   │   ├── slide2.jpg
│   │   └── slide3.jpg
│   └── placeholder.jpg
```

## Method 1: Manual Download (Recommended)

### Step 1: Visit the Original Site
1. Go to https://decorior.in
2. Browse through products and categories
3. Right-click on product images → "Save Image As..."
4. Save to the appropriate folder in `public/images/`

### Step 2: Name Files Correctly
Use the following naming convention:
- Category images: Use the slug name (e.g., `personalised-frames.jpg`)
- Product images: Use the product slug (e.g., `set-of-mini-photo-frames.jpg`)

## Method 2: Browser DevTools

### Step 1: Open DevTools
1. Visit https://decorior.in
2. Press F12 to open DevTools
3. Go to "Network" tab
4. Filter by "Img"

### Step 2: Download Images
1. Reload the page to capture all image requests
2. Right-click on image URLs
3. Select "Open in new tab"
4. Save images with appropriate names

## Method 3: Automated Script (PowerShell)

Create a file `download-images.ps1`:

```powershell
# Create directories
New-Item -ItemType Directory -Force -Path "public\images\categories"
New-Item -ItemType Directory -Force -Path "public\images\products"
New-Item -ItemType Directory -Force -Path "public\images\hero"

# Add image URLs from decorior.in here
$images = @{
    "categories/personalised.jpg" = "URL_FROM_DECORIOR_IN"
    "categories/birthday.jpg" = "URL_FROM_DECORIOR_IN"
    # Add more URLs...
}

# Download images
foreach ($image in $images.GetEnumerator()) {
    $outputPath = "public\images\$($image.Key)"
    Write-Host "Downloading $($image.Key)..."
    Invoke-WebRequest -Uri $image.Value -OutFile $outputPath
}

Write-Host "All images downloaded successfully!"
```

Run with: `.\download-images.ps1`

## Method 4: Use Image Placeholder

If you can't access original images, create placeholder images:

```powershell
# Install ImageMagick first: https://imagemagick.org/script/download.php

# Generate placeholder for products (400x400)
magick -size 400x400 xc:lightgray -pointsize 30 -draw "text 100,200 'Product Image'" public\images\placeholder.jpg

# Copy to all locations
Copy-Item public\images\placeholder.jpg public\images\categories\
Copy-Item public\images\placeholder.jpg public\images\products\
```

## Required Images List

### Category Images (8 images)
1. personalised.jpg - Personalised Frames
2. birthday.jpg - Birthday Frames
3. anniversary.jpg - Anniversary Frames
4. couple.jpg - Couple Frames
5. family.jpg - Family Frames
6. wedding.jpg - Wedding Frames
7. collage.jpg - Collage Frames
8. pet.jpg - Pet Frames

### Product Images (15 images)
1. mini-frames.jpg - Set of Mini Photo Frames
2. wooden-stand-frames.jpg - Set of Mini Frames with Wooden Stand
3. photo-restoration.jpg - Old Photo Restoration
4. mosaic-frame.jpg - Mosaic Photo Frame
5. merge-frame.jpg - Merge Imaginary Frame
6. master-collage.jpg - Master Collage Frame
7. oil-painting.jpg - Digital Oil Painting Frame
8. birthday-table.jpg - Birthday Table Frame
9. bw-mosaic.jpg - B/W Mosaic Photo Frame with Text
10. acrylic-mini.jpg - Acrylic Mini Frames - 5 Frames
11. baby-journey.jpg - The Baby Journey Frame
12. personalised.jpg - Personalised Photo Frame
13. acrylic-frame.jpg - Acrylic Photo Frame
14. birthday-frame.jpg - Birthday Photo Frame
15. birthday-wishes.jpg - Birthday Photo Frame - Wishes, Date

### Hero Slider Images (3 images)
1. slide1.jpg - Main banner image
2. slide2.jpg - Second banner image
3. slide3.jpg - Third banner image

## After Downloading

1. **Verify all images are downloaded**
   ```powershell
   Get-ChildItem -Path public\images -Recurse -File | Measure-Object
   ```

2. **Check file sizes** (should be reasonable, not too large)
   ```powershell
   Get-ChildItem -Path public\images -Recurse -File | Select-Object Name, Length
   ```

3. **Optimize images** (optional, for better performance)
   - Use online tools like TinyPNG or ImageOptim
   - Or install `sharp` and run an optimization script

## Image Optimization Script (Optional)

```javascript
// optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = './public/images';

function optimizeImages(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      optimizeImages(filePath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      sharp(filePath)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(filePath.replace(/\.[^.]+$/, '-optimized.jpg'))
        .then(() => console.log(`Optimized: ${file}`))
        .catch(err => console.error(`Error: ${file}`, err));
    }
  });
}

optimizeImages(imagesDir);
```

Run with: `npm install sharp && node optimize-images.js`

## Notes

- All images should be in JPEG or PNG format
- Recommended size: 400x400 to 800x800 pixels for products
- Category images: 300x200 to 600x400 pixels
- Hero slider: 1200x500 to 1920x800 pixels
- Keep file sizes under 200KB per image for best performance

## Troubleshooting

**Images not showing?**
- Check file names match exactly (case-sensitive)
- Verify files are in correct directories
- Clear Next.js cache: `Remove-Item -Recurse -Force .next`
- Restart dev server

**Images too large?**
- Use image optimization tools
- Consider using Next.js Image Optimization
- Implement lazy loading

## Contact Original Site

If you need high-quality images, you can:
1. Contact Decorior.in team directly
2. Email: info@decorior.in
3. Phone: +91 9448075790
4. Request permission to use images for educational purposes
