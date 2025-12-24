# Coupon System - Quick Reference

## 🎯 What's Been Added

### ✅ Complete Coupon Management System
- Admin can create, edit, and delete coupons
- Users can apply coupons for discounts
- Automatic validation and discount calculation
- Order tracking with coupon information

---

## 📱 How to Use

### For Admins

#### Access Coupon Management
1. Login as admin
2. Go to: `http://localhost:3001/admin/coupons`
3. Or click "Manage Coupons" from admin dashboard

#### Create a New Coupon
1. Click "Add New Coupon"
2. Fill in the form:
   - **Code**: e.g., `WELCOME10` (auto-uppercase)
   - **Description**: e.g., "Welcome offer for new customers"
   - **Discount Type**: Percentage or Fixed
   - **Discount Value**: e.g., 10 for 10% or 100 for ₹100
   - **Color**: Pick a color (optional)

3. Set Conditions (all optional):
   - **Min Order Amount**: e.g., 500 (coupon only works on orders ≥ ₹500)
   - **Min Quantity**: e.g., 2 (coupon needs at least 2 items in cart)
   - **Applicable Products**: Select specific products (or leave empty for all)

4. Set Validity (all optional):
   - **Start Date**: When coupon becomes active
   - **End Date**: When coupon expires
   - **Max Uses**: Total times coupon can be used

5. Toggle "Active" checkbox
6. Click "Create Coupon"

#### Example Coupons to Create

**Example 1: Welcome Discount**
```
Code: WELCOME10
Type: Percentage
Value: 10
Description: 10% off your first order
Active: Yes
```

**Example 2: Bulk Purchase Discount**
```
Code: BULK3
Type: Percentage
Value: 15
Min Quantity: 3
Description: 15% off when you buy 3+ items
Active: Yes
```

**Example 3: High-Value Order Discount**
```
Code: SAVE500
Type: Fixed
Value: 500
Min Order Amount: 2000
Description: Save ₹500 on orders above ₹2000
Active: Yes
```

**Example 4: Product-Specific Discount**
```
Code: FRAMES20
Type: Percentage
Value: 20
Applicable Products: [Select specific frame products]
Description: 20% off on selected frames
Active: Yes
```

---

### For Users

#### Apply a Coupon
1. Add items to cart
2. Go to cart page (`/cart`)
3. Find "Have a coupon?" section
4. Enter coupon code (e.g., `WELCOME10`)
5. Click "Apply"
6. ✅ Discount is applied!
7. Proceed to checkout

#### What Users See
- **Green message**: "Coupon applied! You saved ₹XXX"
- **Colored badge**: Shows coupon code with admin-defined color
- **Discount line**: Shows negative amount in order summary
- **Updated total**: Final price after discount

---

## 🔍 Features Breakdown

### Discount Types
1. **Percentage**: 
   - Example: 10% means 10% off the order
   - Maximum: 100%

2. **Fixed Amount**: 
   - Example: ₹500 off the order
   - Never exceeds order total (min ₹0)

### Conditions

#### 1. Minimum Order Amount
- Order subtotal must be ≥ this amount
- Example: Min ₹500 means coupon only works if cart total is ₹500 or more
- Error if not met: "Minimum order amount of ₹500 required"

#### 2. Minimum Quantity
- Total items in cart must be ≥ this number
- Example: Min 3 means need at least 3 items
- Error if not met: "Minimum 3 items required"

#### 3. Applicable Products
- Coupon only applies to selected products
- If specified, discount calculated only on those products
- Error if none in cart: "This coupon is not applicable to items in your cart"

### Validity Controls

#### Active Status
- Only active coupons can be used
- Admins can toggle on/off anytime

#### Start Date
- Coupon not usable before this date
- Error: "This coupon is not yet valid"

#### End Date
- Coupon not usable after this date
- Error: "This coupon has expired"

#### Maximum Uses
- Total times coupon can be used across all customers
- Automatically incremented when order is placed
- Error when exceeded: "This coupon has reached its maximum usage limit"

---

## 📊 Admin Dashboard Features

### Coupon List View
Shows all coupons with:
- Code and description
- Discount amount/percentage
- Conditions summary
- Active/Inactive status
- Usage count (e.g., "5/100" = used 5 times out of 100 max)
- Actions: Edit, Delete

### Edit Coupon
- Click "Edit" to modify existing coupon
- All fields can be updated
- Code can be changed (must remain unique)

### Delete Coupon
- Click "Delete" to remove coupon
- ⚠️ Cannot delete if already used in orders
- Confirmation prompt before deletion

---

## 🧪 Testing Guide

### Test Scenario 1: Basic Percentage Discount
1. Create coupon: `TEST10` (10% off)
2. Add ₹1000 item to cart
3. Apply `TEST10`
4. Verify discount: ₹100
5. Final total: ₹900

### Test Scenario 2: Minimum Order Amount
1. Create coupon: `MIN500` (₹100 off, min ₹500)
2. Add ₹300 item to cart
3. Apply `MIN500`
4. Should fail: "Minimum order amount of ₹500 required"
5. Add more items to reach ₹500+
6. Apply again - should work

### Test Scenario 3: Product-Specific
1. Create coupon: `FRAMES20` (20% off specific products)
2. Select 2-3 products when creating coupon
3. Add non-selected product to cart
4. Apply `FRAMES20`
5. Should fail: "not applicable to items in your cart"
6. Add selected product
7. Apply - should work on selected products only

### Test Scenario 4: Usage Limit
1. Create coupon: `LIMITED` (max uses: 2)
2. Complete order #1 with coupon
3. Complete order #2 with coupon
4. Try order #3 with coupon
5. Should fail: "maximum usage limit"

---

## 🚨 Common Issues & Solutions

### Issue: Coupon code not found
✅ **Solution**: Verify code is spelled correctly (auto-uppercase)

### Issue: Coupon not working despite valid code
✅ **Solution**: Check:
- Is it active?
- Is current date within validity range?
- Does order meet minimum amount/quantity?
- Are correct products in cart?
- Has max usage been reached?

### Issue: Cannot delete coupon
✅ **Solution**: Coupon has been used in orders (by design, for record keeping)

### Issue: Discount not showing in checkout
✅ **Solution**: Ensure you applied coupon in cart and used checkout link from cart page

---

## 🎨 Customization

### Coupon Colors
- Admins can set custom colors for visual distinction
- Colors appear as:
  - Badge background in cart
  - Dot indicator in coupon list
  - Visual cue for users

### Coupon Descriptions
- Shown to users when coupon is applied
- Use to explain the offer clearly
- Example: "Welcome offer - 10% off your first order"

---

## 📈 Usage Analytics

### Track Coupon Performance
In coupon list, see:
- **Usage Count**: Times coupon has been used
- **Orders Count**: Number of orders using this coupon
- Monitor which coupons are popular
- Adjust strategy based on data

---

## 🔐 Security Features

✅ **Admin-only creation**: Only admins can create/edit coupons
✅ **Server-side validation**: All checks done on backend
✅ **Unique codes**: Database prevents duplicate codes
✅ **Case handling**: Auto-uppercase for consistency
✅ **Safe deletion**: Protects order history integrity
✅ **Transaction safety**: Atomic order creation + coupon update

---

## 📝 Quick Commands

### Create Migration (Already done)
```bash
npx prisma migrate dev --name add_coupon_system
```

### Reset Database (If needed)
```bash
npx prisma migrate reset
```

### View Database
```bash
npx prisma studio
```

---

## 🎁 Example Marketing Campaigns

### Campaign 1: New Customer Welcome
- Code: `WELCOME15`
- Discount: 15% off
- Description: "Welcome! Enjoy 15% off your first order"
- Max Uses: 100
- Duration: 1 month

### Campaign 2: Festival Sale
- Code: `DIWALI25`
- Discount: 25% off
- Min Order: ₹1000
- Start: Festival start date
- End: Festival end date
- Description: "Diwali Special - 25% off orders above ₹1000"

### Campaign 3: Flash Sale
- Code: `FLASH500`
- Discount: ₹500 off
- Min Order: ₹2500
- Max Uses: 50
- Duration: 24 hours
- Description: "Flash Sale! Save ₹500 on orders above ₹2500"

### Campaign 4: Category Sale
- Code: `FRAMES30`
- Discount: 30% off
- Applicable Products: All frame products
- Duration: Weekend only
- Description: "Weekend Special - 30% off all photo frames"

---

## 📱 User Experience Flow

```
1. Browse Products → Add to Cart
                ↓
2. View Cart → See "Have a coupon?" section
                ↓
3. Enter Code → Click "Apply"
                ↓
4. Validation → Success or Error Message
                ↓
5. View Discount → Colored badge + amount
                ↓
6. Checkout → Discount carried over
                ↓
7. Complete Order → Coupon saved in order history
```

---

## 🎯 Business Tips

1. **Test Coupons**: Create with high max uses during testing
2. **Limited Offers**: Use max uses to create urgency
3. **Tiered Discounts**: Min amounts encourage larger orders
4. **Product Push**: Product-specific coupons for inventory management
5. **Time-Limited**: Start/end dates for seasonal campaigns
6. **Monitor Usage**: Check usage counts regularly
7. **Deactivate**: Use active toggle instead of deleting
8. **Clear Descriptions**: Help users understand the offer

---

## ✅ Implementation Complete!

All features are live and ready to use. Start by:
1. Creating your first test coupon
2. Testing it in the cart
3. Completing a test order
4. Checking the admin panel for usage

**Happy Couponing! 🎉**
