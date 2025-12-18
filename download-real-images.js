const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create directories
const imagesDir = path.join(__dirname, 'public', 'images');
const categoriesDir = path.join(imagesDir, 'categories');
const productsDir = path.join(imagesDir, 'products');
const heroDir = path.join(imagesDir, 'hero');

[categoriesDir, productsDir, heroDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Image URLs from decorior.in
const images = {
  categories: [
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T173659.925-600x533.png', name: 'photo-frames.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T173733.098-600x533.png', name: 'wall-decor.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T173849.453-600x533.png', name: 'collage-frames.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T173817.473-600x533.png', name: 'table-frames.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T173932.313-600x533.png', name: 'digital-prints.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T174020.913-600x533.png', name: 'name-plates.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T174127.697-600x533.png', name: 'wedding-frames.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T174202.505-600x533.png', name: 'custom-gifts.jpg' }
  ],
  products: [
    { url: 'https://decorior.in/wp-content/uploads/2025/04/1-9-600x493.webp', name: 'classic-wooden-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/2-8-600x600.webp', name: 'modern-acrylic-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/3-7-600x600.webp', name: 'vintage-gold-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/4-7-600x600.webp', name: 'collage-12photos.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/5-7-600x600.webp', name: 'family-tree-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/6-7-600x600.webp', name: 'table-calendar-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/7-7-600x600.webp', name: 'led-photo-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/8-7-600x600.webp', name: 'magnetic-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/9-6-600x600.webp', name: 'canvas-wall-art.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/10-6-600x600.webp', name: 'quote-wall-decor.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/11-5-600x600.webp', name: 'name-plate-wooden.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/12-5-600x600.webp', name: 'couple-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/13-5-600x600.webp', name: 'anniversary-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/14-5-600x600.webp', name: 'baby-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/15-4-600x600.webp', name: 'personalized-cushion.jpg' }
  ],
  hero: [
    { url: 'https://decorior.in/wp-content/uploads/2024/03/Untitled-design-11-1536x512.png', name: 'slide1.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/Untitled-design-12-1536x512.png', name: 'slide2.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/Untitled-design-13-1536x512.png', name: 'slide3.jpg' }
  ]
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        fs.unlink(filepath, () => {});
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Starting download of 26 images from decorior.in...\n');
  
  let downloaded = 0;
  let failed = 0;
  
  // Download categories
  console.log('Downloading category images...');
  for (const img of images.categories) {
    try {
      await downloadImage(img.url, path.join(categoriesDir, img.name));
      downloaded++;
    } catch (err) {
      console.error(`✗ Failed: ${img.name} - ${err.message}`);
      failed++;
    }
  }
  
  // Download products
  console.log('\nDownloading product images...');
  for (const img of images.products) {
    try {
      await downloadImage(img.url, path.join(productsDir, img.name));
      downloaded++;
    } catch (err) {
      console.error(`✗ Failed: ${img.name} - ${err.message}`);
      failed++;
    }
  }
  
  // Download hero images
  console.log('\nDownloading hero slider images...');
  for (const img of images.hero) {
    try {
      await downloadImage(img.url, path.join(heroDir, img.name));
      downloaded++;
    } catch (err) {
      console.error(`✗ Failed: ${img.name} - ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n========================================`);
  console.log(`Download Complete!`);
  console.log(`Success: ${downloaded} images`);
  console.log(`Failed: ${failed} images`);
  console.log(`Location: ${imagesDir}`);
  console.log(`========================================`);
}

downloadAll().catch(err => {
  console.error('Download error:', err);
  process.exit(1);
});
