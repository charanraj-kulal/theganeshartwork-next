# Vercel Deployment Guide

## Step 1: Set Up PostgreSQL Database

Choose one of these options:

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Click on "Storage" tab
3. Click "Create Database" → Select "Postgres"
4. Follow the setup wizard
5. Copy the connection string (starts with `postgresql://...`)

### Option B: Neon (Free Tier Available)
1. Go to https://neon.tech/
2. Sign up and create a new project
3. Copy the connection string from dashboard

### Option C: Supabase (Free Tier Available)
1. Go to https://supabase.com/
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Connection pooling recommended)

## Step 2: Configure Environment Variables on Vercel

Go to your Vercel project → Settings → Environment Variables

Add these variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-a-long-random-secret-key-here

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Base URL
BASE_URL=https://your-domain.vercel.app

# SMTP Email
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ORDER_NOTIFICATION_EMAIL=notification@yourdomain.com
```

**Important:** 
- Replace `your-domain` with your actual Vercel domain
- Generate a secure NEXTAUTH_SECRET: `openssl rand -base64 32`
- Make sure to add variables for ALL environments (Production, Preview, Development)

## Step 3: Update Local Database to PostgreSQL (Optional)

If you want to use PostgreSQL locally too:

1. Install PostgreSQL locally or use Docker:
```bash
docker run --name ganesh-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

2. Update your local `.env`:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/ganesh_artwork"
```

## Step 4: Run Database Migrations

### For Production (One-time setup):

1. Install Vercel CLI if you haven't:
```bash
npm i -g vercel
```

2. Pull your production environment variables:
```bash
vercel env pull .env.production
```

3. Run migrations on production database:
```bash
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

Or directly:
```bash
npx prisma migrate deploy
```

4. Seed the database (optional):
```bash
npm run seed
```

### Alternative: Run migrations from Vercel

Add this to your `package.json`:
```json
"scripts": {
  "vercel-build": "prisma generate && prisma migrate deploy && next build"
}
```

Then in Vercel → Settings → General → Build & Development Settings:
- Build Command: `npm run vercel-build`

## Step 5: Redeploy

1. Push your changes to GitHub:
```bash
git add .
git commit -m "Update to PostgreSQL for production"
git push origin main
```

2. Vercel will automatically redeploy

## Troubleshooting

### Error: "Can't reach database server"
- Check your DATABASE_URL is correct
- Ensure SSL mode is enabled: `?sslmode=require`
- Verify firewall/network settings

### Error: "Prisma Client not generated"
- Make sure `postinstall` script exists in package.json
- Check build logs to see if `prisma generate` runs

### Error: "Table doesn't exist"
- Run migrations: `npx prisma migrate deploy`
- Or use Prisma Studio to create tables manually

### Reset Database (WARNING: Deletes all data)
```bash
npx prisma migrate reset
npm run seed
```

## Verify Deployment

1. Visit your site: `https://your-domain.vercel.app`
2. Try registering a user
3. Check if data persists
4. Monitor Vercel logs for errors

## Database Management Tools

### Prisma Studio (Local)
```bash
npx prisma studio
```

### Vercel Postgres Dashboard
- Access through Vercel project → Storage tab
- Run SQL queries, view data

### PgAdmin (For PostgreSQL)
- Download: https://www.pgadmin.org/
- Connect using your DATABASE_URL credentials

## Quick Commands Reference

```bash
# Generate Prisma Client
npx prisma generate

# Create a migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Seed database
npm run seed

# Reset database (destructive)
npx prisma migrate reset
```

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Neon Docs: https://neon.tech/docs
- Supabase Docs: https://supabase.com/docs
