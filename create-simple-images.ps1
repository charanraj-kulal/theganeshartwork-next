# Simple image creation script without special characters
Add-Type -AssemblyName System.Drawing

# Create images directory if not exists
$imagesDir = "public\images"
New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null

# Define all image files needed
$images = @(
    @{path="categories\photo-frames.jpg"; width=400; height=300; color="Orange"; text="Photo Frames"},
    @{path="categories\wall-decor.jpg"; width=400; height=300; color="BlueViolet"; text="Wall Decor"},
    @{path="categories\collage-frames.jpg"; width=400; height=300; color="Crimson"; text="Collage Frames"},
    @{path="categories\table-frames.jpg"; width=400; height=300; color="DarkGreen"; text="Table Frames"},
    @{path="categories\digital-prints.jpg"; width=400; height=300; color="Navy"; text="Digital Prints"},
    @{path="categories\name-plates.jpg"; width=400; height=300; color="DarkOrange"; text="Name Plates"},
    @{path="categories\wedding-frames.jpg"; width=400; height=300; color="DeepPink"; text="Wedding Frames"},
    @{path="categories\custom-gifts.jpg"; width=400; height=300; color="Purple"; text="Custom Gifts"},
    @{path="products\classic-wooden-frame.jpg"; width=500; height=500; color="SaddleBrown"; text="Classic Wooden"},
    @{path="products\modern-acrylic-frame.jpg"; width=500; height=500; color="CornflowerBlue"; text="Modern Acrylic"},
    @{path="products\vintage-gold-frame.jpg"; width=500; height=500; color="Goldenrod"; text="Vintage Gold"},
    @{path="products\collage-12photos.jpg"; width=500; height=500; color="Teal"; text="12 Photos Collage"},
    @{path="products\family-tree-frame.jpg"; width=500; height=500; color="ForestGreen"; text="Family Tree"},
    @{path="products\table-calendar-frame.jpg"; width=500; height=500; color="Indigo"; text="Table Calendar"},
    @{path="products\led-photo-frame.jpg"; width=500; height=500; color="DarkSlateBlue"; text="LED Frame"},
    @{path="products\magnetic-frame.jpg"; width=500; height=500; color="Maroon"; text="Magnetic Frame"},
    @{path="products\canvas-wall-art.jpg"; width=500; height=500; color="DarkCyan"; text="Canvas Wall Art"},
    @{path="products\quote-wall-decor.jpg"; width=500; height=500; color="DarkMagenta"; text="Quote Wall Decor"},
    @{path="products\name-plate-wooden.jpg"; width=500; height=500; color="Sienna"; text="Wooden Name Plate"},
    @{path="products\couple-frame.jpg"; width=500; height=500; color="HotPink"; text="Couple Frame"},
    @{path="products\anniversary-frame.jpg"; width=500; height=500; color="Crimson"; text="Anniversary Frame"},
    @{path="products\baby-frame.jpg"; width=500; height=500; color="LightSeaGreen"; text="Baby Frame"},
    @{path="products\personalized-cushion.jpg"; width=500; height=500; color="MediumPurple"; text="Personalized Cushion"},
    @{path="hero\slide1.jpg"; width=1200; height=500; color="DarkOrange"; text="Premium Photo Frames"},
    @{path="hero\slide2.jpg"; width=1200; height=500; color="RoyalBlue"; text="Custom Wall Decor"},
    @{path="hero\slide3.jpg"; width=1200; height=500; color="MediumVioletRed"; text="Personalized Gifts"}
)

Write-Host "Creating 26 images..." -ForegroundColor Cyan

foreach ($img in $images) {
    $fullPath = Join-Path $imagesDir $img.path
    $dir = Split-Path $fullPath -Parent
    
    # Create subdirectory if needed
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    
    # Create bitmap
    $bitmap = New-Object System.Drawing.Bitmap($img.width, $img.height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill background
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromName($img.color))
    $graphics.FillRectangle($brush, 0, 0, $img.width, $img.height)
    
    # Add text
    $font = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $rect = New-Object System.Drawing.Rectangle(0, 0, $img.width, $img.height)
    $graphics.DrawString($img.text, $font, $textBrush, $rect, $format)
    
    # Save
    $bitmap.Save($fullPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $textBrush.Dispose()
    $font.Dispose()
    
    Write-Host "Created: $($img.path)" -ForegroundColor Green
}

Write-Host "`nAll 26 images created successfully!" -ForegroundColor Green
Write-Host "Location: $imagesDir" -ForegroundColor Yellow
