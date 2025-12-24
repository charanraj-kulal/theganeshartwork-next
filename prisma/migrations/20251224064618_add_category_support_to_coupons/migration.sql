-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN "applicabilityType" TEXT DEFAULT 'all';
ALTER TABLE "Coupon" ADD COLUMN "applicableCategories" TEXT;
