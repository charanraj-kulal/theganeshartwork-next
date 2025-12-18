const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting production database seed...');

  // Create admin user
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@theganeshartwork.com' },
    update: {},
    create: {
      email: 'admin@theganeshartwork.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
      phone: '9876543210',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  console.log('Creating categories...');
  const categories = [
    { name: 'Photo Frames', slug: 'photo-frames', image: '/images/categories/photo-frames.jpg' },
    { name: 'Wall Decor', slug: 'wall-decor', image: '/images/categories/wall-decor.jpg' },
    { name: 'Customized Gifts', slug: 'customized-gifts', image: '/images/categories/customized-gifts.jpg' },
    { name: 'Birthday Frames', slug: 'birthday-frames', image: '/images/categories/birthday-frames.jpg' },
    { name: 'Wedding Frames', slug: 'wedding-frames', image: '/images/categories/wedding-frames.jpg' },
    { name: 'Baby Frames', slug: 'baby-frames', image: '/images/categories/baby-frames.jpg' },
    { name: 'Couple Frames', slug: 'couple-frames', image: '/images/categories/couple-frames.jpg' },
    { name: 'Family Frames', slug: 'family-frames', image: '/images/categories/family-frames.jpg' },
  ];

  const createdCategories = {};
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories[category.slug] = created;
    console.log(`✅ Category created: ${created.name}`);
  }

  // Create products
  console.log('Creating products...');
  const products = [
    {
      name: 'Personalised Photo Frame',
      slug: 'personalised-photo-frame',
      description: 'Beautiful personalized photo frame perfect for your memories',
      price: 599,
      originalPrice: 799,
      image: '/images/products/photo-frame-1.jpg',
      categoryId: createdCategories['photo-frames'].id,
      onSale: true,
      featured: true,
      inStock: true,
    },
    {
      name: 'Birthday Photo Frame with Wishes & Dates',
      slug: 'birthday-photo-frame-wishes-dates',
      description: 'Special birthday frame with customizable wishes and dates',
      price: 699,
      originalPrice: 899,
      image: '/images/products/birthday-frame-1.jpg',
      categoryId: createdCategories['birthday-frames'].id,
      onSale: true,
      featured: true,
      inStock: true,
    },
    {
      name: 'The Baby Journey Frame',
      slug: 'the-baby-journey-frame',
      description: 'Document your baby\'s precious moments in this beautiful frame',
      price: 799,
      originalPrice: 999,
      image: '/images/products/baby-frame-1.jpg',
      categoryId: createdCategories['baby-frames'].id,
      onSale: true,
      featured: true,
      inStock: true,
    },
    {
      name: 'Couple Love Frame',
      slug: 'couple-love-frame',
      description: 'Perfect frame for celebrating your love story',
      price: 649,
      originalPrice: 849,
      image: '/images/products/couple-frame-1.jpg',
      categoryId: createdCategories['couple-frames'].id,
      onSale: true,
      featured: false,
      inStock: true,
    },
    {
      name: 'Wedding Anniversary Frame',
      slug: 'wedding-anniversary-frame',
      description: 'Celebrate your special day with this elegant frame',
      price: 899,
      originalPrice: 1199,
      image: '/images/products/wedding-frame-1.jpg',
      categoryId: createdCategories['wedding-frames'].id,
      onSale: true,
      featured: true,
      inStock: true,
    },
    {
      name: 'Family Tree Photo Frame',
      slug: 'family-tree-photo-frame',
      description: 'Beautiful family tree design with multiple photo slots',
      price: 1299,
      originalPrice: 1599,
      image: '/images/products/family-frame-1.jpg',
      categoryId: createdCategories['family-frames'].id,
      onSale: true,
      featured: false,
      inStock: true,
    },
    {
      name: 'Customized Name Plate',
      slug: 'customized-name-plate',
      description: 'Personalized name plate for your home',
      price: 499,
      originalPrice: 699,
      image: '/images/products/name-plate-1.jpg',
      categoryId: createdCategories['customized-gifts'].id,
      onSale: true,
      featured: false,
      inStock: true,
    },
    {
      name: 'Wall Hanging Photo Collage',
      slug: 'wall-hanging-photo-collage',
      description: 'Create a stunning wall display with multiple photos',
      price: 1499,
      originalPrice: 1899,
      image: '/images/products/wall-collage-1.jpg',
      categoryId: createdCategories['wall-decor'].id,
      onSale: true,
      featured: true,
      inStock: true,
    },
    {
      name: 'Baby\'s First Year Frame',
      slug: 'babys-first-year-frame',
      description: 'Document every month of baby\'s first year',
      price: 1099,
      originalPrice: 1399,
      image: '/images/products/baby-year-frame-1.jpg',
      categoryId: createdCategories['baby-frames'].id,
      onSale: true,
      featured: false,
      inStock: true,
    },
    {
      name: 'Romantic Couple Frame Set',
      slug: 'romantic-couple-frame-set',
      description: 'Set of 3 frames perfect for couples',
      price: 1799,
      originalPrice: 2299,
      image: '/images/products/couple-set-1.jpg',
      categoryId: createdCategories['couple-frames'].id,
      onSale: true,
      featured: false,
      inStock: true,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    console.log(`✅ Product created: ${created.name}`);
  }

  console.log('✅ Production seed completed successfully!');
  console.log('\n📧 Admin Login Credentials:');
  console.log('Email: admin@theganeshartwork.com');
  console.log('Password: admin123');
  console.log('\n⚠️  IMPORTANT: Change admin password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
