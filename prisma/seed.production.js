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
    { name: 'Restoration', slug: 'restoration', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500' },
    { name: 'Merging', slug: 'merging', image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=500' },
    { name: 'Imaginary Art', slug: 'imaginary-art', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500' },
    { name: 'Oil Painting / Smudge Art', slug: 'oil-painting-smudge-art', image: 'https://images.unsplash.com/photo-1578926078268-6f4b3a0f8c00?w=500' },
    { name: 'Wooden Clog', slug: 'wooden-clog', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500' },
    { name: 'Collage', slug: 'collage', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500' },
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
      name: 'Photo Restoration Service',
      slug: 'photo-restoration-service',
      description: 'Professional photo restoration to bring your old, damaged photos back to life. Remove scratches, tears, and fading.',
      price: 499,
      originalPrice: 699,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
      categoryId: createdCategories['restoration'].id,
      onSale: true,
      featured: true,
      inStock: true,
    },
    {
      name: 'Photo Merging Service',
      slug: 'photo-merging-service',
      description: 'Combine multiple photos into one perfect image. Ideal for group photos, family portraits, and special occasions.',
      price: 399,
      originalPrice: 599,
      image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800',
      categoryId: createdCategories['merging'].id,
      onSale: true,
      featured: true,
      inStock: true,
    },
    {
      name: 'Imaginary Art Creation',
      slug: 'imaginary-art-creation',
      description: 'Transform your ideas into stunning imaginary artwork. Custom digital art based on your vision.',
      price: 899,
      originalPrice: 1199,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      categoryId: createdCategories['imaginary-art'].id,
      onSale: true,
      featured: true,
      inStock: true,
    },
    {
      name: 'Oil Painting Portrait',
      slug: 'oil-painting-portrait',
      description: 'Hand-crafted oil painting style portrait. Transform your photos into beautiful artistic masterpieces.',
      price: 1299,
      originalPrice: 1599,
      image: 'https://images.unsplash.com/photo-1578926078268-6f4b3a0f8c00?w=800',
      categoryId: createdCategories['oil-painting-smudge-art'].id,
      onSale: true,
      featured: true,
      inStock: true,
    },
    {
      name: 'Wooden Clog Photo Frame',
      slug: 'wooden-clog-photo-frame',
      description: 'Rustic wooden clog style photo frame. Perfect for home decor with a natural, artistic touch.',
      price: 799,
      originalPrice: 999,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
      categoryId: createdCategories['wooden-clog'].id,
      onSale: true,
      featured: false,
      inStock: true,
    },
    {
      name: 'Photo Collage Creation',
      slug: 'photo-collage-creation',
      description: 'Custom photo collage design with multiple images. Perfect for memories, events, and special moments.',
      price: 599,
      originalPrice: 799,
      image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
      categoryId: createdCategories['collage'].id,
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
