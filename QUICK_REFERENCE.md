# 🚀 Quick Reference - Decorior.in Clone

## Instant Commands

### Start Development Server
```powershell
npm run dev -- -p 3001
```
**Access:** http://localhost:3001

### Database Commands
```powershell
# View database in GUI
npx prisma studio

# Reset and reseed database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

## 🔑 Login Credentials

### Admin Account
- **URL:** http://localhost:3001/admin
- **Email:** admin@decorior.in
- **Password:** admin123

## 📍 Important URLs

### Frontend
- Homepage: http://localhost:3001
- Products: http://localhost:3001/products
- Login: http://localhost:3001/login
- Cart: http://localhost:3001/cart

### Admin Panel
- Dashboard: http://localhost:3001/admin
- Products: http://localhost:3001/admin/products
- Orders: http://localhost:3001/admin/orders

### API Endpoints
- Categories: http://localhost:3001/api/categories
- Products: http://localhost:3001/api/products
- Single Product: http://localhost:3001/api/products/[slug]

## 🧪 Quick Test Commands

### Test APIs
```powershell
# Get all categories
Invoke-RestMethod http://localhost:3001/api/categories

# Get all products
Invoke-RestMethod http://localhost:3001/api/products

# Get single product
Invoke-RestMethod http://localhost:3001/api/products/set-of-mini-photo-frames
```

### Database Stats
```powershell
# View all products
npx prisma studio
```

## 📂 Key Files

### Configuration
- `.env` - Environment variables
- `prisma/schema.prisma` - Database schema
- `package.json` - Dependencies

### Authentication
- `src/lib/auth.ts` - NextAuth config
- `src/app/api/auth/[...nextauth]/route.ts` - Auth handler

### Cart
- `src/store/cartStore.ts` - Cart state management
- `src/app/api/cart/route.ts` - Cart API

### Payment
- `src/lib/razorpay.ts` - Razorpay instance
- `src/app/api/orders/create/route.ts` - Create order
- `src/app/api/orders/verify/route.ts` - Verify payment

### Admin
- `src/app/admin/` - Admin pages
- `src/app/api/admin/` - Admin APIs

## 🔧 Troubleshooting

### Server won't start?
```powershell
Remove-Item -Recurse -Force .next
npm run dev -- -p 3001
```

### Database issues?
```powershell
npx prisma migrate reset
npm run seed
```

### Type errors?
```powershell
npx prisma generate
```

## 📊 Project Stats

- **Pages:** 9
- **Components:** 9
- **API Routes:** 16
- **Database Models:** 9
- **Products:** 15
- **Categories:** 8

## 🎯 What Works Now

✅ User authentication  
✅ Product browsing  
✅ Shopping cart  
✅ Order creation  
✅ Payment integration  
✅ Admin panel  
✅ Order management  
✅ All API endpoints  

## ⚠️ Before Production

- [ ] Download images (see IMAGE_DOWNLOAD_GUIDE.md)
- [ ] Get Razorpay API keys
- [ ] Change admin password
- [ ] Update NEXTAUTH_SECRET
- [ ] Switch to PostgreSQL

## 📚 Documentation

- **IMPLEMENTATION_COMPLETE.md** - Full summary
- **BACKEND_COMPLETE_README.md** - Detailed guide
- **IMAGE_DOWNLOAD_GUIDE.md** - Image setup

## 🆘 Need Help?

1. Check error messages
2. Review documentation
3. Check database with Prisma Studio
4. Clear cache and restart

---

**Everything is ready! Start building! 🚀**
