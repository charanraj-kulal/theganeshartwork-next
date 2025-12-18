# Create placeholder images using PowerShell
Add-Type -AssemblyName System.Drawing

function Create-PlaceholderImage {
    param($path, $width, $height, $text)
    
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    $backgroundColor = [System.Drawing.Color]::FromArgb(224, 224, 224)
    $textColor = [System.Drawing.Color]::FromArgb(100, 100, 100)
    
    $graphics.Clear($backgroundColor)
    
    $font = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush($textColor)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $rect = New-Object System.Drawing.RectangleF(0, 0, $width, $height)
    $graphics.DrawString($text, $font, $brush, $rect, $format)
    
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    $graphics.Dispose()
    $bitmap.Dispose()
}

Write-Host "Creating images..." -ForegroundColor Green

New-Item -ItemType Directory -Force -Path "public/images/categories" | Out-Null
New-Item -ItemType Directory -Force -Path "public/images/products" | Out-Null
New-Item -ItemType Directory -Force -Path "public/images/hero" | Out-Null

$images = @(
    @{path="public/images/categories/personalised.jpg"; w=300; h=200; text="Personalised Frames"},
    @{path="public/images/categories/birthday.jpg"; w=300; h=200; text="Birthday Frames"},
    @{path="public/images/categories/anniversary.jpg"; w=300; h=200; text="Anniversary Frames"},
    @{path="public/images/categories/couple.jpg"; w=300; h=200; text="Couple Frames"},
    @{path="public/images/categories/family.jpg"; w=300; h=200; text="Family Frames"},
    @{path="public/images/categories/wedding.jpg"; w=300; h=200; text="Wedding Frames"},
    @{path="public/images/categories/collage.jpg"; w=300; h=200; text="Collage Frames"},
    @{path="public/images/categories/pet.jpg"; w=300; h=200; text="Pet Frames"},
    @{path="public/images/products/mini-frames.jpg"; w=400; h=400; text="Mini Frames"},
    @{path="public/images/products/wooden-stand-frames.jpg"; w=400; h=400; text="Wooden Stand"},
    @{path="public/images/products/photo-restoration.jpg"; w=400; h=400; text="Photo Restore"},
    @{path="public/images/products/mosaic-frame.jpg"; w=400; h=400; text="Mosaic Frame"},
    @{path="public/images/products/merge-frame.jpg"; w=400; h=400; text="Merge Frame"},
    @{path="public/images/products/master-collage.jpg"; w=400; h=400; text="Master Collage"},
    @{path="public/images/products/oil-painting.jpg"; w=400; h=400; text="Oil Painting"},
    @{path="public/images/products/birthday-table.jpg"; w=400; h=400; text="Birthday Table"},
    @{path="public/images/products/bw-mosaic.jpg"; w=400; h=400; text="BW Mosaic"},
    @{path="public/images/products/acrylic-mini.jpg"; w=400; h=400; text="Acrylic Mini"},
    @{path="public/images/products/baby-journey.jpg"; w=400; h=400; text="Baby Journey"},
    @{path="public/images/products/personalised.jpg"; w=400; h=400; text="Personalised"},
    @{path="public/images/products/acrylic-frame.jpg"; w=400; h=400; text="Acrylic Frame"},
    @{path="public/images/products/birthday-frame.jpg"; w=400; h=400; text="Birthday Frame"},
    @{path="public/images/products/birthday-wishes.jpg"; w=400; h=400; text="Birthday Wishes"},
    @{path="public/images/hero/slide1.jpg"; w=1200; h=500; text="Decorior - Personalised Frames"},
    @{path="public/images/hero/slide2.jpg"; w=1200; h=500; text="Beautiful Photo Frames"},
    @{path="public/images/hero/slide3.jpg"; w=1200; h=500; text="Home Decor"}
)

$count = 0
foreach ($img in $images) {
    $count++
    Write-Host "[$count/$($images.Count)] Creating $($img.path)..." -NoNewline
    Create-PlaceholderImage -path $img.path -width $img.w -height $img.h -text $img.text
    Write-Host " Done" -ForegroundColor Green
}

Write-Host "`nCompleted! Created $count images" -ForegroundColor Green
Write-Host "Images saved in public/images/" -ForegroundColor Cyan
