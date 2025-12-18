# Cloudinary Setup Instructions

## 1. Create Free Cloudinary Account
1. Go to https://cloudinary.com/
2. Click "Sign Up Free"
3. Verify your email

## 2. Get Your Credentials
1. Login to Cloudinary Dashboard
2. You'll see your credentials on the dashboard:
   - Cloud Name
   - API Key
   - API Secret

## 3. Add to Vercel Environment Variables
Go to your Vercel project → Settings → Environment Variables

Add these 3 variables:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 4. Also Add to Local .env File
```
CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
CLOUDINARY_API_KEY="your_api_key_here"
CLOUDINARY_API_SECRET="your_api_secret_here"
```

## That's it!
Your image uploads will now work in both development and production!
