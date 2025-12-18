const https = require('https');
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

// Sample images from working URL
const validImageBase = 'https://decorior.in/wp-content/uploads/2025/04/1-9-600x493.webp';

// We'll use a generic photo frame image for now
const images = {
  categories: [
    { url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600', name: 'photo-frames.jpg' },
    { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600', name: 'wall-decor.jpg' },
    { url: 'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=600', name: 'collage-frames.jpg' },
    { url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600', name: 'table-frames.jpg' },
    { url: 'https://images.unsplash.com/photo-1579762593131-eb3e60c6c48d?w=600', name: 'digital-prints.jpg' },
    { url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600', name: 'name-plates.jpg' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', name: 'wedding-frames.jpg' },
    { url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600', name: 'custom-gifts.jpg' }
  ],
  products: [
    { url: validImageBase, name: 'photo-restoration.jpg' },
    { url: 'https://images.unsplash.com/photo-1588595887304-f5f53c60e3c4?w=600', name: 'mini-frames.jpg' },
    { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600', name: 'wooden-stand-frames.jpg' },
    { url: 'https://images.unsplash.com/photo-1579762593131-eb3e60c6c48d?w=600', name: 'mosaic-frame.jpg' },
    { url: 'https://images.unsplash.com/photo-1589652717406-1c69efaf1ff8?w=600', name: 'merge-frame.jpg' },
    { url: 'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=600', name: 'master-collage.jpg' },
    { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600', name: 'oil-painting.jpg' },
    { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600', name: 'birthday-table.jpg' },
    { url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600', name: 'bw-mosaic.jpg' },
    { url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600', name: 'acrylic-mini.jpg' },
    { url: 'https://images.unsplash.com/photo-1576567416565-7d8b58de2759?w=600', name: 'baby-journey.jpg' },
    { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600', name: 'personalised.jpg' },
    { url: 'https://images.unsplash.com/photo-1589652717406-1c69efaf1ff8?w=600', name: 'acrylic-frame.jpg' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', name: 'birthday-frame.jpg' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', name: 'birthday-wishes.jpg' }
  ],
  hero: [
    { url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&h=500', name: 'slide1.jpg' },
    { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=500', name: 'slide2.jpg' },
    { url: 'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=1200&h=500', name: 'slide3.jpg' }
  ],
  categories_real: [
    { name: 'personalised.jpg' },
    { name: 'birthday.jpg' },
    { name: 'anniversary.jpg' },
    { name: 'couple.jpg' },
    { name: 'family.jpg' },
    { name: 'wedding.jpg' },
    { name: 'collage.jpg' },
    { name: 'pet.jpg' }
  ]
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      // Follow redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${path.basename(filepath)}`);
            resolve();
          });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        fs.unlink(filepath, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Downloading images from Unsplash (royalty-free)...\n');
  
  let downloaded = 0;
  let failed = 0;
  
  // Download category images
  console.log('Downloading category images...');
  for (const img of images.categories) {
    try {
      await downloadImage(img.url, path.join(categoriesDir, img.name));
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit
    } catch (err) {
      console.error(`✗ Failed: ${img.name}`);
      failed++;
    }
  }
  
  // Create additional category images needed
  for (const img of images.categories_real) {
    const sourcePath = path.join(categoriesDir, images.categories[0].name);
    const targetPath = path.join(categoriesDir, img.name);
    if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied: ${img.name}`);
      downloaded++;
    }
  }
  
  // Download product images
  console.log('\nDownloading product images...');
  for (const img of images.products) {
    try {
      await downloadImage(img.url, path.join(productsDir, img.name));
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit
    } catch (err) {
      console.error(`✗ Failed: ${img.name}`);
      failed++;
    }
  }
  
  // Download hero images
  console.log('\nDownloading hero slider images...');
  for (const img of images.hero) {
    try {
      await downloadImage(img.url, path.join(heroDir, img.name));
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit
    } catch (err) {
      console.error(`✗ Failed: ${img.name}`);
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
