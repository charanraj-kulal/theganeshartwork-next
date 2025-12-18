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

// Real image URLs from decorior.in
const images = {
  products: [
    { url: 'https://decorior.in/wp-content/uploads/2025/09/Photo-Restoration-Thumbnail.webp', name: 'photo-restoration.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/09/1-1-600x600.webp', name: 'wooden-stand-frames.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-16.webp', name: 'mini-frames.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-8-600x600.webp', name: 'mosaic-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/09/1-6.webp', name: 'merge-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/09/1-7.webp', name: 'master-collage.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/09/1-5.webp', name: 'oil-painting.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-17.webp', name: 'birthday-table.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-8.webp', name: 'bw-mosaic.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-9.webp', name: 'acrylic-mini.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-13.webp', name: 'baby-journey.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/09/1-4-600x600.webp', name: 'personalised.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-11.webp', name: 'acrylic-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-14.webp', name: 'birthday-frame.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2025/11/1-15.webp', name: 'birthday-wishes.jpg' }
  ],
  categories: [
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T173659.925-600x533.png', name: 'personalised.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T173733.098-600x533.png', name: 'birthday.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T173817.473-600x533.png', name: 'anniversary.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T173849.453-600x533.png', name: 'couple.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T173932.313-600x533.png', name: 'family.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T174127.697-600x533.png', name: 'wedding.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T174020.913-600x533.png', name: 'collage.jpg' },
    { url: 'https://decorior.in/wp-content/uploads/2024/03/New-Project-2024-03-11T174202.505-600x533.png', name: 'pet.jpg' }
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
              console.log(`✓ ${path.basename(filepath)}`);
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
          console.log(`✓ ${path.basename(filepath)}`);
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
  console.log('🎨 Downloading real images from decorior.in...\n');
  
  let downloaded = 0;
  let failed = 0;
  
  // Download product images
  console.log('📦 Product Images:');
  for (const img of images.products) {
    try {
      await downloadImage(img.url, path.join(productsDir, img.name));
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error(`✗ ${img.name} - ${err.message}`);
      failed++;
    }
  }
  
  // Download category images
  console.log('\n📂 Category Images:');
  for (const img of images.categories) {
    try {
      await downloadImage(img.url, path.join(categoriesDir, img.name));
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error(`✗ ${img.name} - ${err.message}`);
      failed++;
    }
  }
  
  // Download hero images
  console.log('\n🖼️  Hero Slider Images:');
  for (const img of images.hero) {
    try {
      await downloadImage(img.url, path.join(heroDir, img.name));
      downloaded++;
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error(`✗ ${img.name} - ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Download Complete!`);
  console.log(`   Success: ${downloaded} images`);
  if (failed > 0) {
    console.log(`   Failed: ${failed} images`);
  }
  console.log(`   Location: ${imagesDir}`);
  console.log(`${'='.repeat(50)}`);
}

downloadAll().catch(err => {
  console.error('Download error:', err);
  process.exit(1);
});
