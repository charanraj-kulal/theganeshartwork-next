const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
const productsDir = path.join(imagesDir, 'products');
const categoriesDir = path.join(imagesDir, 'categories');
const heroDir = path.join(imagesDir, 'hero');

[productsDir, categoriesDir, heroDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Using placeholder.com with appropriate sizes and colors
const productImages = [
  'photo-restoration.jpg',
  'wooden-stand-frames.jpg',
  'mini-frames.jpg',
  'mosaic-frame.jpg',
  'merge-frame.jpg',
  'master-collage.jpg',
  'oil-painting.jpg',
  'birthday-table.jpg',
  'bw-mosaic.jpg',
  'acrylic-mini.jpg',
  'baby-journey.jpg',
  'personalised.jpg',
  'acrylic-frame.jpg',
  'birthday-frame.jpg',
  'birthday-wishes.jpg'
];

const categoryImages = [
  'personalised.jpg',
  'birthday.jpg',
  'anniversary.jpg',
  'couple.jpg',
  'family.jpg',
  'wedding.jpg',
  'collage.jpg',
  'pet.jpg'
];

const heroImages = ['slide1.jpg', 'slide2.jpg', 'slide3.jpg'];

function downloadPlaceholder(width, height, text, filepath, bgColor = 'FF6B35', textColor = 'FFFFFF') {
  return new Promise((resolve, reject) => {
    // Use via.placeholder.com instead
    const url = `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
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
  console.log('🎨 Generating placeholder images for products...\n');
  
  const colors = ['FF6B35', 'F7931E', 'C1272D', '0071BC', '00A651', '662D91', 'ED1C24'];
  let downloaded = 0;
  
  console.log('📦 Product Images (600x600):');
  for (let i = 0; i < productImages.length; i++) {
    const filename = productImages[i];
    const productName = filename.replace('.jpg', '').replace(/-/g, ' ').toUpperCase();
    const color = colors[i % colors.length];
    try {
      await downloadPlaceholder(600, 600, productName, path.join(productsDir, filename), color);
      console.log(`✓ ${filename}`);
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.error(`✗ ${filename} - ${err.message}`);
    }
  }
  
  console.log('\n📂 Category Images (600x600):');
  for (let i = 0; i < categoryImages.length; i++) {
    const filename = categoryImages[i];
    const catName = filename.replace('.jpg', '').replace(/-/g, ' ').toUpperCase() + ' FRAMES';
    const color = colors[i % colors.length];
    try {
      await downloadPlaceholder(600, 600, catName, path.join(categoriesDir, filename), color);
      console.log(`✓ ${filename}`);
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.error(`✗ ${filename} - ${err.message}`);
    }
  }
  
  console.log('\n🖼️  Hero Images (1536x512):');
  const heroTexts = ['PERSONALIZED PHOTO FRAMES', 'CUSTOM HOME DECOR', 'FREE DELIVERY'];
  for (let i = 0; i < heroImages.length; i++) {
    const filename = heroImages[i];
    try {
      await downloadPlaceholder(1536, 512, heroTexts[i], path.join(heroDir, filename), 'FF6B35');
      console.log(`✓ ${filename}`);
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.error(`✗ ${filename} - ${err.message}`);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Generated: ${downloaded} images`);
  console.log(`📁 Location: ${imagesDir}`);
  console.log(`${'='.repeat(50)}`);
}

downloadAll().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
