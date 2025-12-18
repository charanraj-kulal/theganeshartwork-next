# Decorior.in Clone - Backend Documentation

## Database Setup

### Technology Stack
- **Database**: SQLite (file:./dev.db)
- **ORM**: Prisma 5.22.0
- **Authentication**: NextAuth.js (to be implemented)
- **Payment**: Razorpay (to be integrated)
- **State Management**: Zustand (for cart)

### Database Schema

#### Models Created:
1. **User** - User accounts with role (user/admin)
2. **Category** - Product categories  
3. **Product** - Product catalog
4. **CartItem** - Shopping cart items
5. **Order** - Customer orders
6. **OrderItem** - Order line items
7. **Account** - OAuth accounts (NextAuth)
8. **Session** - User sessions (NextAuth)
9. **VerificationToken** - Email verification (NextAuth)

### Seeded Data

✅ **8 Categories:**
- Personalised Frames
- Birthday Frames
- Anniversary Frames
- Couple Frames
- Family Frames
- Wedding Frames
- Collage Frames
- Pet Frames

✅ **15 Products:**
- All products from the original site
- With pricing, descriptions, and category relationships

✅ **Admin User:**
- Email: `admin@decorior.in`
- Password: `admin123`
- Role: admin

### API Endpoints

#### Products
- `GET /api/products` - Get all products
  - Query params: `?category=slug`, `?featured=true`, `?limit=10`
- `GET /api/products/[slug]` - Get product by slug

#### Categories  
- `GET /api/categories` - Get all categories

### Commands

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed database
npm run seed

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Start development server
npm run dev -- -p 3001
```

### Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"

# Razorpay (for payment integration)
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

## Next Steps

### To Be Implemented:
1. **Authentication**
   - NextAuth.js setup with email/password
   - Social login (Google OAuth)
   - Protected routes middleware

2. **Cart Functionality**
   - Zustand store for client-side cart
   - API routes for cart CRUD operations
   - Persist cart to database for logged-in users

3. **Payment Integration**
   - Razorpay checkout flow
   - Order creation API
   - Payment verification webhook
   - Order status updates

4. **Order Management**
   - User order history
   - Order tracking
   - Email notifications
   - Admin order management

5. **Admin Panel** (`/admin`)
   - Dashboard with stats
   - Product CRUD operations
   - Category management
   - Order management
   - User management
   - Upload images

6. **Image Management**
   - Download images from original site
   - Store in `public/images/`
   - Configure Next.js image optimization

## Project Status

### ✅ Completed:
- Full frontend (9 pages, 8 components)
- Database schema design
- Database migration
- Database seeding
- Product & Category API routes
- Prisma Client setup

### ⏳ In Progress:
- Backend API implementation

### ❌ Pending:
- Authentication
- Cart functionality  
- Payment integration
- Order management
- Admin panel
- Image assets

## Troubleshooting

### Prisma Issues
If you encounter Prisma errors:
```bash
# Clear Prisma cache
rm -rf node_modules/.prisma node_modules/@prisma
npm install

# Regenerate client
npx prisma generate
```

### Database Reset
To reset the database:
```bash
# Delete database and migrations
rm prisma/dev.db
rm -rf prisma/migrations

# Recreate
npx prisma migrate dev --name init
npm run seed
```

### Port Issues
If port 3001 is in use:
```bash
# Kill process on port 3001 (Windows)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force

# Or use different port
npm run dev -- -p 3002
```
