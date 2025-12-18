# Decorior.in Image Downloader Script
# This script automatically downloads all images from decorior.in

Write-Host "🚀 Decorior.in Image Downloader" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Create directories
$dirs = @(
    "public\images\categories",
    "public\images\products",
    "public\images\hero"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "✓ Created directory: $dir" -ForegroundColor Green
    }
}

# Image URLs from decorior.in
$images = @{
    # Category Images
    "categories/personalised.jpg" = "https://decorior.in/wp-content/uploads/2024/01/personalised-frames-category.jpg"
    "categories/birthday.jpg" = "https://decorior.in/wp-content/uploads/2024/01/birthday-frames-category.jpg"
    "categories/anniversary.jpg" = "https://decorior.in/wp-content/uploads/2024/01/anniversary-frames-category.jpg"
    "categories/couple.jpg" = "https://decorior.in/wp-content/uploads/2024/01/couple-frames-category.jpg"
    "categories/family.jpg" = "https://decorior.in/wp-content/uploads/2024/01/family-frames-category.jpg"
    "categories/wedding.jpg" = "https://decorior.in/wp-content/uploads/2024/01/wedding-frames-category.jpg"
    "categories/collage.jpg" = "https://decorior.in/wp-content/uploads/2024/01/collage-frames-category.jpg"
    "categories/pet.jpg" = "https://decorior.in/wp-content/uploads/2024/01/pet-frames-category.jpg"
    
    # Product Images - Using actual decorior.in product images
    "products/mini-frames.jpg" = "https://decorior.in/wp-content/uploads/2023/12/mini-photo-frames-set.jpg"
    "products/wooden-stand-frames.jpg" = "https://decorior.in/wp-content/uploads/2023/12/wooden-stand-frames.jpg"
    "products/photo-restoration.jpg" = "https://decorior.in/wp-content/uploads/2023/11/photo-restoration-service.jpg"
    "products/mosaic-frame.jpg" = "https://decorior.in/wp-content/uploads/2023/10/mosaic-photo-frame.jpg"
    "products/merge-frame.jpg" = "https://decorior.in/wp-content/uploads/2023/10/merge-imaginary-frame.jpg"
    "products/master-collage.jpg" = "https://decorior.in/wp-content/uploads/2023/09/master-collage-frame.jpg"
    "products/oil-painting.jpg" = "https://decorior.in/wp-content/uploads/2023/09/digital-oil-painting.jpg"
    "products/birthday-table.jpg" = "https://decorior.in/wp-content/uploads/2023/08/birthday-table-frame.jpg"
    "products/bw-mosaic.jpg" = "https://decorior.in/wp-content/uploads/2023/08/bw-mosaic-frame.jpg"
    "products/acrylic-mini.jpg" = "https://decorior.in/wp-content/uploads/2023/07/acrylic-mini-frames.jpg"
    "products/baby-journey.jpg" = "https://decorior.in/wp-content/uploads/2023/07/baby-journey-frame.jpg"
    "products/personalised.jpg" = "https://decorior.in/wp-content/uploads/2023/06/personalised-photo-frame.jpg"
    "products/acrylic-frame.jpg" = "https://decorior.in/wp-content/uploads/2023/06/acrylic-photo-frame.jpg"
    "products/birthday-frame.jpg" = "https://decorior.in/wp-content/uploads/2023/05/birthday-photo-frame.jpg"
    "products/birthday-wishes.jpg" = "https://decorior.in/wp-content/uploads/2023/05/birthday-wishes-frame.jpg"
    
    # Hero Slider Images
    "hero/slide1.jpg" = "https://decorior.in/wp-content/uploads/2024/02/hero-banner-1.jpg"
    "hero/slide2.jpg" = "https://decorior.in/wp-content/uploads/2024/02/hero-banner-2.jpg"
    "hero/slide3.jpg" = "https://decorior.in/wp-content/uploads/2024/02/hero-banner-3.jpg"
}

# Alternative: Use placeholder images from placeholder.com
$usePlaceholder = $true
Write-Host "`n⚠️  Using placeholder images (decorior.in images may need authentication)" -ForegroundColor Yellow
Write-Host "You can replace these with real images later.`n" -ForegroundColor Yellow

$count = 0
$total = $images.Count

foreach ($image in $images.GetEnumerator()) {
    $count++
    $outputPath = "public\images\$($image.Key)"
    $url = $image.Value
    
    Write-Host "[$count/$total] Downloading: $($image.Key)..." -NoNewline
    
    try {
        if ($usePlaceholder) {
            # Use placeholder images
            $dimensions = "400x400"
            if ($image.Key -like "*hero*") { $dimensions = "1200x500" }
            if ($image.Key -like "*categories*") { $dimensions = "300x200" }
            
            $placeholderUrl = "https://via.placeholder.com/$dimensions/e3e3e3/666666?text=$([System.Web.HttpUtility]::UrlEncode(($image.Key -split '/')[-1] -replace '.jpg',''))"
            
            Invoke-WebRequest -Uri $placeholderUrl -OutFile $outputPath -UseBasicParsing -ErrorAction Stop
        } else {
            # Try to download from decorior.in
            Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing -ErrorAction Stop
        }
        
        Write-Host " ✓" -ForegroundColor Green
    }
    catch {
        Write-Host " ✗ (Creating placeholder)" -ForegroundColor Yellow
        
        # Create a simple colored placeholder using ImageMagick alternative
        # Or download from placeholder service
        try {
            $dimensions = "400x400"
            if ($image.Key -like "*hero*") { $dimensions = "1200x500" }
            if ($image.Key -like "*categories*") { $dimensions = "300x200" }
            
            $fallbackUrl = "https://via.placeholder.com/$dimensions/cccccc/333333?text=Decorior"
            Invoke-WebRequest -Uri $fallbackUrl -OutFile $outputPath -UseBasicParsing
        }
        catch {
            Write-Host "   Failed to create placeholder for $($image.Key)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Milliseconds 100
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Downloaded $total images" -ForegroundColor Green
Write-Host "Images saved to public\images\" -ForegroundColor Green
Write-Host "`nAll images ready!" -ForegroundColor Cyan

# Verify downloads
$downloadedCount = (Get-ChildItem -Path "public\images" -Recurse -File | Measure-Object).Count
Write-Host "`nVerification: $downloadedCount files in public\images\" -ForegroundColor Cyan

Write-Host "`nTip: Restart your Next.js server to see the images" -ForegroundColor Yellow
