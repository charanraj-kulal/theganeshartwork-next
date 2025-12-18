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

// Working image URLs from decorior.in (extracted from HTML)
const images = {
  products: [
    { url: 'https://decorior.in/wp-content/uploads/2025/09/Photo-Restoration-Thumbnail-600x493.webp', name: 'photo-restoration.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/09/1-1-600x600.webp', name: 'wooden-stand-frames.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-16-600x493.webp', name: 'mini-frames.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-8-600x600.webp', name: 'mosaic-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/09/1-6-600x493.webp', name: 'merge-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/09/1-7-600x600.webp', name: 'master-collage.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/09/1-5-600x493.webp', name: 'oil-painting.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-17-600x493.webp', name: 'birthday-table.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-8-1-600x493.webp', name: 'bw-mosaic.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-9-600x493.webp', name: 'acrylic-mini.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-13-600x493.webp', name: 'baby-journey.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/09/1-4-600x600.webp', name: 'personalised.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-11-600x493.webp', name: 'acrylic-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-14-600x493.webp', name: 'birthday-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-15-600x493.webp', name: 'birthday-wishes.jpg' }
  ],
  categories: [
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-4-600x600.webp', name: 'personalised.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/5-600x600.webp', name: 'birthday.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/ANNI-600x600.webp', name: 'anniversary.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/couple-600x600.webp', name: 'couple.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-600x600.webp', name: 'family.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/wed-600x600.webp', name: 'wedding.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-1-1-600x600.webp', name: 'collage.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/3-3-600x600.webp', name: 'pet.jpg' }
  ],
  hero: [
    { url: 'https://decorior.in/wp-content/uploads/2024/03/Untitled-design-11-1536x512.png', name: 'slide1.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/Untitled-design-12-1536x512.png', name: 'slide2.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/Untitled-design-13-1536x512.png', name: 'slide3.jpg' }
  ]
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (redirectResponse) => {
          if (redirectResponse.statusCode === 200) {
            redirectResponse.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          } else {
            fs.unlink(filepath, () => {});
            reject(new Error(`HTTP ${redirectResponse.statusCode}`));
          }
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
  console.log('🎨 Downloading REAL images from decorior.in...\n');
  
  let downloaded = 0;
  let failed = 0;
  
  console.log('📦 Product Images:');
  for (const img of images.products) {
    try {
      await downloadImage(img.url, path.join(productsDir, img.name));
      console.log(`✓ ${img.name}`);
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error(`✗ ${img.name} - ${err.message}`);
      failed++;
    }
  }
  
  console.log('\n📂 Category Images:');
  for (const img of images.categories) {
    try {
      await downloadImage(img.url, path.join(categoriesDir, img.name));
      console.log(`✓ ${img.name}`);
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error(`✗ ${img.name} - ${err.message}`);
      failed++;
    }
  }
  
  console.log('\n🖼️  Hero Images:');
  for (const img of images.hero) {
    try {
      await downloadImage(img.url, path.join(heroDir, img.name));
      console.log(`✓ ${img.name}`);
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error(`✗ ${img.name} - ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Success: ${downloaded} images`);
  if (failed > 0) console.log(`❌ Failed: ${failed} images`);
  console.log(`📁 Location: ${imagesDir}`);
  console.log(`${'='.repeat(50)}`);
}

downloadAll().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
