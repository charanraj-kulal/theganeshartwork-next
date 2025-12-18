# 🚀 Production Deployment Complete Guide

## ✅ What's Been Done

### 1. Database Setup
- ✅ PostgreSQL schema for production
- ✅ SQLite for local development
- ✅ Production seed script with admin user and products

### 2. Image Upload System
- ✅ File upload API endpoint (`/api/upload`)
- ✅ Admin add product page with image upload
- ✅ Admin edit product page with image upload
- ✅ Images stored in `/public/uploads/products`

### 3. Admin Features
- ✅ Order details modal on admin orders page
- ✅ Complete order information display
- ✅ Product management with image upload

---

## 📋 Deployment Steps

### Step 1: Set Up PostgreSQL Database

**Choose one option:**

#### Option A: Vercel Postgres (Recommended)
1. Go to https://vercel.com/dashboard
2. Select your project: `theganeshartwork-next`
3. Click "Storage" → "Create Database" → "Postgres"
4. Copy the connection string

#### Option B: Neon (Free Forever)
1. Go to https://neon.tech/
2. Create project → Copy connection string

### Step 2: Configure Environment Variables

Go to Vercel → Project Settings → Environment Variables

Add these for **Production, Preview, Development**:

```bash
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_URL=https://theganeshartwork-next.vercel.app
NEXTAUTH_SECRET=decorior-secret-key-change-in-production-very-long-and-secure-2024
RAZORPAY_KEY_ID=rzp_test_Rsf3FlEZ74uuFj
RAZORPAY_KEY_SECRET=kjMA86MJSaq3qGUt9p8WKuOf
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Rsf3FlEZ74uuFj
BASE_URL=https://theganeshartwork-next.vercel.app
SMTP_EMAIL=c191542709@gmail.com
SMTP_PASSWORD=ixozqitszfdnlryk
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ORDER_NOTIFICATION_EMAIL=naikganesha32@gmail.com
```

### Step 3: Update Build Settings

Vercel → Settings → General → Build & Development Settings:
- **Build Command:** Leave as default (it will use `vercel-build` from package.json)
- The script automatically:
  - Generates Prisma client
  - Creates database tables
  - Builds the app

### Step 4: Deploy

#### Option A: Automatic (Recommended)
```bash
git add .
git commit -m "Production ready with image uploads and admin features"
git push origin main
```

#### Option B: Manual Redeploy
- Go to Vercel → Deployments
- Click "..." on latest → "Redeploy"

### Step 5: Seed Production Database

After successful deployment, seed the database:

1. **Using Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run seed script with production database
DATABASE_URL="your_production_url" npm run seed:prod
```

2. **Or manually via Vercel Dashboard:**
- Go to your Vercel project
- Click "..." menu → "Connect to Git Repository" → "Run Command"
- Execute: `npm run seed:prod`

---

## 🔑 Admin Access

After seeding, you can log in with:

**Email:** `admin@theganeshartwork.com`  
**Password:** `admin123`

⚠️ **IMPORTANT:** Change the admin password immediately after first login!

---

## 📦 What Gets Created on Deployment

### Admin User
- Email: admin@theganeshartwork.com
- Role: admin
- Can manage products, categories, and orders

### Categories (8 total)
1. Photo Frames
2. Wall Decor
3. Customized Gifts
4. Birthday Frames
5. Wedding Frames
6. Baby Frames
7. Couple Frames
8. Family Frames

### Products (10 sample products)
- Personalised Photo Frame
- Birthday Photo Frame with Wishes & Dates
- The Baby Journey Frame
- Couple Love Frame
- Wedding Anniversary Frame
- Family Tree Photo Frame
- Customized Name Plate
- Wall Hanging Photo Collage
- Baby's First Year Frame
- Romantic Couple Frame Set

---

## 🎨 Image Upload Features

### For Admin Users:
1. **Add Product:**
   - Navigate to Admin → Products → Add Product
   - Upload image directly (max 5MB)
   - Supports: JPG, PNG, WebP

2. **Edit Product:**
   - Navigate to Admin → Products → Edit
   - Change existing image or upload new one
   - Preview before saving

### Image Storage:
- Images stored in: `/public/uploads/products/`
- Accessible via: `/uploads/products/filename.jpg`

---

## 📊 Admin Order Management

### View Orders:
- Admin → Orders
- See all orders with status and payment info

### Order Details Modal:
- Click "View Details" on any order
- Shows:
  - Complete customer information
  - Shipping address
  - All order items with images
  - Payment status
  - Order timeline

### Update Order Status:
- Change status directly from orders list
- Options: Pending, Processing, Shipped, Delivered, Cancelled

---

## 🔧 Local Development

### Running Locally:
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Seed local database
npm run seed
```

### Local vs Production:
- **Local:** Uses SQLite (`file:./dev.db`)
- **Production:** Uses PostgreSQL

---

## 🛠️ Troubleshooting

### Build Fails on Vercel:
1. Check environment variables are set
2. Verify DATABASE_URL is correct
3. Check build logs for specific errors

### Images Not Uploading:
1. Check file size (must be < 5MB)
2. Verify file type (JPG, PNG, WebP only)
3. Check upload API logs

### Products Not Showing:
1. Run seed script: `npm run seed:prod`
2. Check database connection
3. Verify Prisma client is generated

### Admin Can't Login:
1. Ensure seed script ran successfully
2. Check admin credentials
3. Verify NextAuth configuration

---

## 📱 Testing Your Deployment

### 1. Homepage
- Visit: https://theganeshartwork-next.vercel.app
- Should show products and categories

### 2. Admin Login
- Go to: /login
- Use admin credentials
- Should redirect to admin dashboard

### 3. Add Product
- Admin → Products → Add Product
- Upload an image
- Verify product appears on homepage

### 4. Place Test Order
- Add product to cart
- Go through checkout
- Check order in admin panel

---

## 🎯 Production Checklist

- [ ] PostgreSQL database created
- [ ] All environment variables set on Vercel
- [ ] Deployment successful
- [ ] Database seeded with admin and products
- [ ] Admin login working
- [ ] Products visible on homepage
- [ ] Image upload working
- [ ] Order details modal working
- [ ] Email notifications configured
- [ ] Razorpay payment configured
- [ ] Admin password changed from default

---

## 🔐 Security Notes

1. **Change Admin Password** immediately after first login
2. **Update NEXTAUTH_SECRET** to a strong random value
3. **Secure API Keys** - Never commit sensitive keys to git
4. **Email Password** - Use app-specific password for Gmail
5. **Database URL** - Keep secure, never expose publicly

---

## 📧 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify all environment variables
4. Check database connection

---

## 🎉 You're All Set!

Your production-ready e-commerce site is now deployed with:
- ✅ Admin dashboard
- ✅ Product management
- ✅ Image uploads
- ✅ Order management
- ✅ Payment integration
- ✅ Email notifications

Happy selling! 🛍️
