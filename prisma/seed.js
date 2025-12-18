const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const categories = [
    { name: "Personalised Frames", slug: "personalised-frames", image: "/images/categories/personalised.jpg" },
    { name: "Birthday Frames", slug: "birthday-frames", image: "/images/categories/birthday.jpg" },
    { name: "Anniversary Frames", slug: "anniversary-frames", image: "/images/categories/anniversary.jpg" },
    { name: "Couple Frames", slug: "couple-frames", image: "/images/categories/couple.jpg" },
    { name: "Family Frames", slug: "family-frames", image: "/images/categories/family.jpg" },
    { name: "Wedding Frames", slug: "wedding-frames", image: "/images/categories/wedding.jpg" },
    { name: "Collage Frames", slug: "collage-frames", image: "/images/categories/collage.jpg" },
    { name: "Pet Frames", slug: "pet-frames", image: "/images/categories/pet.jpg" },
  ];

  console.log('Creating categories...');
  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      })
    )
  );
  console.log(`✅ Created ${createdCategories.length} categories`);

  // Get category IDs
  const framesCategory = await prisma.category.findUnique({ where: { slug: "personalised-frames" } });
  const birthdayCategory = await prisma.category.findUnique({ where: { slug: "birthday-frames" } });
  const collageCategory = await prisma.category.findUnique({ where: { slug: "collage-frames" } });
  const familyCategory = await prisma.category.findUnique({ where: { slug: "family-frames" } });

  // Create products
  const products = [
    {
      name: "Set of Mini Photo Frames",
      slug: "set-of-mini-photo-frames",
      price: 349,
      image: "/images/products/mini-frames.jpg",
      categoryId: framesCategory.id,
      onSale: true,
      description: "Beautiful set of mini photo frames perfect for desk or wall display.",
    },
    {
      name: "Set of Mini Frames with Wooden Stand",
      slug: "set-of-mini-frames-with-wooden-stand",
      price: 399,
      originalPrice: 499,
      image: "/images/products/wooden-stand-frames.jpg",
      categoryId: framesCategory.id,
      onSale: true,
      description: "Elegant mini frames with premium wooden stand.",
    },
    {
      name: "Old Photo Restoration",
      slug: "old-photo-restoration",
      price: 1199,
      image: "/images/products/photo-restoration.jpg",
      categoryId: framesCategory.id,
      onSale: true,
      description: "Professional photo restoration service to bring your old memories back to life.",
    },
    {
      name: "Mosaic Photo Frame",
      slug: "mosaic-photo-frame",
      price: 499,
      image: "/images/products/mosaic-frame.jpg",
      categoryId: collageCategory.id,
      onSale: true,
      description: "Create beautiful mosaic collage with your favorite photos.",
    },
    {
      name: "Merge Imaginary Frame",
      slug: "merge-imaginary-frame",
      price: 1399,
      image: "/images/products/merge-frame.jpg",
      categoryId: collageCategory.id,
      onSale: true,
      description: "Unique frame that merges reality with imagination.",
    },
    {
      name: "Master Collage Frame",
      slug: "master-collage-frame",
      price: 499,
      image: "/images/products/master-collage.jpg",
      categoryId: collageCategory.id,
      onSale: true,
      description: "Premium collage frame for multiple photos.",
    },
    {
      name: "Digital Oil Painting Frame",
      slug: "digital-oil-painting-frame",
      price: 399,
      image: "/images/products/oil-painting.jpg",
      categoryId: framesCategory.id,
      onSale: true,
      featured: true,
      description: "Transform your photos into beautiful oil painting style artwork.",
    },
    {
      name: "Birthday Table Frame",
      slug: "birthday-table-frame",
      price: 249,
      originalPrice: 399,
      image: "/images/products/birthday-table.jpg",
      categoryId: birthdayCategory.id,
      onSale: true,
      description: "Perfect birthday gift frame for table display.",
    },
    {
      name: "B/W Mosaic Photo Frame with Text",
      slug: "bw-mosaic-photo-frame-with-text",
      price: 499,
      image: "/images/products/bw-mosaic.jpg",
      categoryId: collageCategory.id,
      onSale: true,
      description: "Black and white mosaic frame with custom text option.",
    },
    {
      name: "Acrylic Mini Frames - 5 Frames",
      slug: "acrylic-mini-frames",
      price: 399,
      originalPrice: 599,
      image: "/images/products/acrylic-mini.jpg",
      categoryId: framesCategory.id,
      onSale: true,
      description: "Set of 5 premium acrylic mini frames.",
    },
    {
      name: "The Baby Journey Frame",
      slug: "the-baby-journey-frame",
      price: 499,
      image: "/images/products/baby-journey.jpg",
      categoryId: familyCategory.id,
      onSale: true,
      description: "Document your baby's growth journey with this special frame.",
    },
    {
      name: "Personalised Photo Frame",
      slug: "personalised-photo-frame",
      price: 449,
      image: "/images/products/personalised.jpg",
      categoryId: framesCategory.id,
      onSale: true,
      featured: true,
      description: "Fully customizable photo frame with your choice of text and design.",
    },
    {
      name: "Acrylic Photo Frame",
      slug: "acrylic-photo-frame",
      price: 1499,
      image: "/images/products/acrylic-frame.jpg",
      categoryId: framesCategory.id,
      onSale: true,
      description: "Premium acrylic frame for a modern look.",
    },
    {
      name: "Birthday Photo Frame",
      slug: "birthday-photo-frame",
      price: 499,
      image: "/images/products/birthday-frame.jpg",
      categoryId: birthdayCategory.id,
      onSale: true,
      description: "Special birthday themed photo frame.",
    },
    {
      name: "Birthday Photo Frame - Wishes, Date",
      slug: "birthday-photo-frame-wishes-dates",
      price: 499,
      image: "/images/products/birthday-wishes.jpg",
      categoryId: birthdayCategory.id,
      onSale: true,
      description: "Birthday frame with custom wishes and date.",
    },
  ];

  console.log('Creating products...');
  const createdProducts = await Promise.all(
    products.map((product) =>
      prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      })
    )
  );
  console.log(`✅ Created ${createdProducts.length} products`);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@decorior.in' },
    update: {},
    create: {
      email: 'admin@decorior.in',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      phone: '+91 9448075790',
    },
  });
  console.log(`✅ Created admin user: ${adminUser.email}`);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
