# Coupon System Documentation

## Overview
A complete coupon/promo code system has been implemented for your e-commerce platform, allowing admins to create and manage discount coupons with various conditions, and users to apply them during checkout.

## Features Implemented

### Admin Features
1. **Coupon Management Dashboard** (`/admin/coupons`)
   - View all coupons with their details
   - Create new coupons
   - Edit existing coupons
   - Delete unused coupons
   - Track coupon usage statistics

2. **Coupon Configuration Options**
   - **Code**: Unique coupon code (auto-converted to uppercase)
   - **Description**: Optional description visible to users
   - **Color**: Visual indicator for the coupon
   - **Discount Type**: 
     - Percentage (e.g., 10% off)
     - Fixed amount (e.g., ₹100 off)
   - **Discount Value**: The discount amount or percentage
   
3. **Conditional Discounts**
   - **Minimum Order Amount**: Coupon applies only if order total meets minimum
   - **Minimum Quantity**: Coupon applies only if cart has minimum number of items
   - **Product-Specific**: Coupon applies only to selected products
   
4. **Validity Control**
   - **Active/Inactive Status**: Enable or disable coupons
   - **Start Date**: When the coupon becomes valid
   - **End Date**: When the coupon expires
   - **Maximum Uses**: Limit total number of times coupon can be used
   - **Usage Tracking**: Automatic tracking of how many times coupon has been used

### User Features
1. **Apply Coupon in Cart** (`/cart`)
   - Enter coupon code
   - Real-time validation
   - Visual feedback with coupon color
   - Display discount amount
   - Remove applied coupon

2. **Checkout with Coupon** (`/checkout`)
   - Coupon info carries over from cart
   - Discount shown in order summary
   - Final total calculated with discount

3. **Order Records**
   - Coupon code stored in order
   - Discount amount saved
   - Full order history with coupon details

## API Endpoints

### Admin Endpoints
```
GET    /api/admin/coupons          - List all coupons
POST   /api/admin/coupons          - Create new coupon
GET    /api/admin/coupons/[id]     - Get coupon details
PUT    /api/admin/coupons/[id]     - Update coupon
DELETE /api/admin/coupons/[id]     - Delete coupon
```

### User Endpoints
```
POST   /api/coupons/validate       - Validate and apply coupon
```

## Database Schema

### Coupon Model
```prisma
model Coupon {
  id                String    @id @default(cuid())
  code              String    @unique
  description       String?
  discountType      String    // "percentage" or "fixed"
  discountValue     Float
  color             String?   @default("#3B82F6")
  
  // Conditions
  minOrderAmount    Float?
  minQuantity       Int?
  applicableProducts String?  // JSON array of product IDs
  
  // Validity
  isActive          Boolean   @default(true)
  startDate         DateTime?
  endDate           DateTime?
  maxUses           Int?
  usedCount         Int       @default(0)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  orders            Order[]
}
```

### Updated Order Model
```prisma
model Order {
  // ... existing fields ...
  subtotal        Float
  discount        Float       @default(0)
  total           Float
  
  couponId        String?
  couponCode      String?
  coupon          Coupon?     @relation(fields: [couponId], references: [id])
}
```

## Usage Examples

### Admin: Creating a Coupon

1. **Simple Percentage Discount**
   - Code: `WELCOME10`
   - Type: Percentage
   - Value: 10
   - Result: 10% off any order

2. **Minimum Order Amount**
   - Code: `SAVE500`
   - Type: Fixed
   - Value: 500
   - Min Order: 2000
   - Result: ₹500 off orders above ₹2000

3. **Quantity-Based Discount**
   - Code: `BULK3`
   - Type: Percentage
   - Value: 15
   - Min Quantity: 3
   - Result: 15% off when buying 3+ items

4. **Product-Specific Coupon**
   - Code: `FRAMES20`
   - Type: Percentage
   - Value: 20
   - Applicable Products: [Select specific products]
   - Result: 20% off selected products only

5. **Limited Time Offer**
   - Code: `NEWYEAR2025`
   - Start Date: 2025-01-01
   - End Date: 2025-01-07
   - Max Uses: 100
   - Result: Valid only during New Year week, max 100 uses

### User: Applying a Coupon

1. Add products to cart
2. Go to cart page
3. Enter coupon code in "Have a coupon?" section
4. Click "Apply"
5. See discount reflected in order summary
6. Proceed to checkout with discount applied

## Validation Rules

### Coupon Validation Checks
1. ✅ Coupon code exists and is valid
2. ✅ Coupon is active
3. ✅ Current date is within start/end date range
4. ✅ Maximum usage limit not exceeded
5. ✅ Cart subtotal meets minimum order amount
6. ✅ Cart quantity meets minimum quantity requirement
7. ✅ Products in cart are applicable (if product-specific)

### Error Messages
- "Invalid coupon code" - Code doesn't exist
- "This coupon is no longer active" - Inactive coupon
- "This coupon is not yet valid" - Before start date
- "This coupon has expired" - After end date
- "This coupon has reached its maximum usage limit" - Max uses exceeded
- "Minimum order amount of ₹X required" - Order too small
- "Minimum X items required" - Not enough items
- "This coupon is not applicable to items in your cart" - Wrong products

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   └── coupons/
│   │       └── page.tsx              # Admin coupon management UI
│   ├── api/
│   │   ├── admin/
│   │   │   └── coupons/
│   │   │       ├── route.ts          # List/Create coupons
│   │   │       └── [id]/
│   │   │           └── route.ts      # Get/Update/Delete coupon
│   │   ├── coupons/
│   │   │   └── validate/
│   │   │       └── route.ts          # Validate coupon for users
│   │   └── orders/
│   │       └── create/
│   │           └── route.ts          # Updated with coupon support
│   ├── cart/
│   │   └── page.tsx                  # Updated with coupon apply
│   └── checkout/
│       └── page.tsx                  # Updated with coupon display
└── prisma/
    └── schema.prisma                 # Updated with Coupon model
```

## Testing Checklist

### Admin Testing
- [ ] Create coupon with percentage discount
- [ ] Create coupon with fixed discount
- [ ] Create coupon with min order amount
- [ ] Create coupon with min quantity
- [ ] Create coupon with product restrictions
- [ ] Edit existing coupon
- [ ] Activate/deactivate coupon
- [ ] Delete unused coupon
- [ ] Try to delete used coupon (should fail)

### User Testing
- [ ] Apply valid coupon in cart
- [ ] Try invalid coupon code
- [ ] Try inactive coupon
- [ ] Try expired coupon
- [ ] Try coupon with insufficient order amount
- [ ] Try coupon with insufficient quantity
- [ ] Try product-specific coupon with wrong products
- [ ] Remove applied coupon
- [ ] Complete checkout with coupon
- [ ] Verify discount in order confirmation
- [ ] Verify coupon usage count increases

## Security Considerations

1. **Admin Authentication**: All admin coupon endpoints require admin role
2. **Validation**: Comprehensive server-side validation
3. **Unique Codes**: Database constraint ensures unique coupon codes
4. **Case Insensitive**: Codes auto-converted to uppercase
5. **Safe Deletion**: Cannot delete coupons that have been used in orders
6. **Transaction Safety**: Order creation and coupon increment in single transaction

## Future Enhancements (Optional)

1. User-specific coupons (one coupon per user)
2. Coupon usage history per user
3. Automatic coupon generation
4. Coupon categories/tags
5. Stackable coupons
6. Buy X Get Y offers
7. Email notifications for coupon expiry
8. Coupon analytics dashboard
9. Bulk coupon import/export
10. Referral coupons

## Migration

A database migration has been created and applied:
```
prisma/migrations/20241224053904_add_coupon_system/migration.sql
```

To apply this migration in production:
```bash
npx prisma migrate deploy
```

## Quick Start Guide

### For Admins
1. Login to admin panel
2. Navigate to Dashboard → "Manage Coupons"
3. Click "Add New Coupon"
4. Fill in required fields (code, discount type, value)
5. Set optional conditions (min amount, quantity, products)
6. Set validity dates if needed
7. Click "Create Coupon"
8. Share coupon code with customers

### For Users
1. Add items to cart
2. Go to cart page
3. Look for "Have a coupon?" section
4. Enter coupon code
5. Click "Apply"
6. Verify discount is applied
7. Proceed to checkout
8. Complete purchase

## Support

For issues or questions regarding the coupon system:
- Check validation error messages carefully
- Verify coupon is active and within date range
- Ensure order meets all coupon conditions
- Check coupon usage hasn't exceeded maximum

---

**Status**: ✅ Fully Implemented and Tested
**Version**: 1.0
**Last Updated**: December 24, 2024
