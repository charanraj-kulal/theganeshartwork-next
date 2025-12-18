const puppeteer = require('puppeteer');
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

async function scrapeImages() {
  console.log('🚀 Launching browser to scrape decorior.in...\n');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    // Go to products page
    await page.goto('https://decorior.in/shop/', { waitUntil: 'networkidle0', timeout: 60000 });
    
    // Extract all product image URLs
    const productImages = await page.evaluate(() => {
      const images = [];
      document.querySelectorAll('.products .product img').forEach(img => {
        if (img.src && img.src.includes('decorior.in')) {
          images.push({
            url: img.src,
            alt: img.alt || ''
          });
        }
      });
      return images;
    });
    
    console.log(`📦 Found ${productImages.length} product images\n`);
    
    // Download product images
    let downloaded = 0;
    const productMapping = [
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
    
    for (let i = 0; i < Math.min(productImages.length, productMapping.length); i++) {
      const img = productImages[i];
      const filename = productMapping[i];
      
      try {
        await downloadImage(img.url, path.join(productsDir, filename));
        console.log(`✓ ${filename}`);
        downloaded++;
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`✗ ${filename} - ${err.message}`);
      }
    }
    
    // Get category images
    await page.goto('https://decorior.in/', { waitUntil: 'networkidle0' });
    
    const categoryImages = await page.evaluate(() => {
      const images = [];
      document.querySelectorAll('.category-item img, .categories img').forEach(img => {
        if (img.src && img.src.includes('decorior.in')) {
          images.push({
            url: img.src,
            alt: img.alt || ''
          });
        }
      });
      return images;
    });
    
    console.log(`\n📂 Found ${categoryImages.length} category images\n`);
    
    const categoryMapping = [
      'personalised.jpg',
      'birthday.jpg',
      'anniversary.jpg',
      'couple.jpg',
      'family.jpg',
      'wedding.jpg',
      'collage.jpg',
      'pet.jpg'
    ];
    
    for (let i = 0; i < Math.min(categoryImages.length, categoryMapping.length); i++) {
      const img = categoryImages[i];
      const filename = categoryMapping[i];
      
      try {
        await downloadImage(img.url, path.join(categoriesDir, filename));
        console.log(`✓ ${filename}`);
        downloaded++;
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`✗ ${filename} - ${err.message}`);
      }
    }
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Downloaded ${downloaded} images from decorior.in`);
    console.log(`${'='.repeat(50)}`);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

scrapeImages().catch(console.error);
