# Decorior.in Clone

An exact clone of the decorior.in website built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Responsive Design**: Fully responsive across all devices
- **Product Catalog**: 15+ products with detailed pages
- **Categories**: 8 different product categories
- **Hero Slider**: Animated homepage slider
- **Fast Navigation**: Sticky header with search functionality
- **Contact Forms**: Contact and login pages
- **SEO Optimized**: Proper meta tags and page structure

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about-us/          # About page
│   ├── cart/              # Shopping cart
│   ├── categories/[slug]/ # Dynamic category pages
│   ├── contact-us/        # Contact page
│   ├── faqs/              # FAQ page
│   ├── login/             # Login/Register page
│   ├── product/[slug]/    # Dynamic product pages
│   ├── products/          # Products listing
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer
│   ├── HeroSlider.tsx     # Homepage slider
│   ├── ProductCard.tsx    # Product card
│   ├── ProductGrid.tsx    # Products grid
│   ├── CategoriesSection.tsx
│   ├── FeaturesSection.tsx
│   └── DeliveryBanner.tsx
├── data/                  # Static data
│   ├── products.ts        # Product data
│   └── categories.ts      # Category data
└── types/                 # TypeScript types
    └── index.ts

public/
└── images/               # Image assets
    ├── products/         # Product images
    ├── categories/       # Category images
    └── slider/           # Slider images
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd "C:\Users\Charanraj\OneDrive - mresult.com\documents\Ganesh"
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📄 Available Pages

- **Homepage** (`/`) - Hero slider, products, categories, features
- **Products** (`/products`) - All products listing
- **Product Detail** (`/product/[slug]`) - Individual product pages
- **Categories** (`/categories/[slug]`) - Category-specific products
- **About Us** (`/about-us`) - Company information
- **Contact Us** (`/contact-us`) - Contact form and info
- **FAQ** (`/faqs`) - Frequently asked questions
- **Login** (`/login`) - Login/Register forms
- **Cart** (`/cart`) - Shopping cart

## 🎨 Customization

### Adding Images

Replace placeholder images in the `public/images/` directory:
- Product images: `public/images/products/`
- Category images: `public/images/categories/`
- Slider images: `public/images/slider/`
- Logo: `public/images/logo.png`

### Adding Products

Edit `src/data/products.ts` to add or modify products:

```typescript
{
  id: 16,
  name: "Your Product Name",
  price: 499,
  originalPrice: 599, // optional
  slug: "your-product-slug",
  image: "/images/products/your-image.jpg",
  category: "Category Name",
  onSale: true,
}
```

### Adding Categories

Edit `src/data/categories.ts` to add or modify categories.

## 🔧 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (SVG)
- **Fonts**: System fonts (Arial, Helvetica)

## 📱 Key Features Implemented

### Header
- Sticky navigation
- Search bar
- Mobile menu
- Cart icon with counter
- Login/Call links

### Homepage
- Auto-rotating hero slider
- Featured products grid
- Category showcase
- Delivery banner
- Features section (support, delivery, experience)

### Product Pages
- Product details
- Image display
- Price with discounts
- Add to cart button
- Category links
- Breadcrumb navigation

### Footer
- Company information
- Navigation links
- Social media links
- Contact details
- Multiple columns layout

## 🌐 Contact Information

- **Email**: support@decorior.in
- **Phone/WhatsApp**: +91 9448075790
- **Address**: Near Gurudwara Nanak Jhira, Bidar, Karnataka – 585401

## 📝 Notes

- This is a frontend clone - backend functionality needs to be implemented
- Product images are placeholders - replace with actual images
- Cart and checkout functionality are UI-only
- Forms don't submit data yet - needs backend integration

## 🚀 Next Steps (Backend Integration)

1. Set up database (MongoDB/PostgreSQL)
2. Implement API routes for products
3. Add user authentication
4. Implement cart functionality
5. Add payment gateway integration
6. Set up order management
7. Add admin panel

## 📄 License

This project is for educational purposes.

---

Made with ❤️ following the original Decorior.in design

