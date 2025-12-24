-- AlterTable for PostgreSQL
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "applicabilityType" TEXT DEFAULT 'all';
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "applicableCategories" TEXT;
