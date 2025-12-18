# Simple Image Downloader for Decorior.in Clone
Write-Host "Starting image download..." -ForegroundColor Green

# Create directories
New-Item -ItemType Directory -Force -Path "public/images/categories" | Out-Null
New-Item -ItemType Directory -Force -Path "public/images/products" | Out-Null
New-Item -ItemType Directory -Force -Path "public/images/hero" | Out-Null

# Download placeholder images
$images = @(
    @{path="categories/personalised.jpg"; size="300x200"; text="Personalised"},
    @{path="categories/birthday.jpg"; size="300x200"; text="Birthday"},
    @{path="categories/anniversary.jpg"; size="300x200"; text="Anniversary"},
    @{path="categories/couple.jpg"; size="300x200"; text="Couple"},
    @{path="categories/family.jpg"; size="300x200"; text="Family"},
    @{path="categories/wedding.jpg"; size="300x200"; text="Wedding"},
    @{path="categories/collage.jpg"; size="300x200"; text="Collage"},
    @{path="categories/pet.jpg"; size="300x200"; text="Pet"},
    @{path="products/mini-frames.jpg"; size="400x400"; text="Mini+Frames"},
    @{path="products/wooden-stand-frames.jpg"; size="400x400"; text="Wooden+Stand"},
    @{path="products/photo-restoration.jpg"; size="400x400"; text="Photo+Restore"},
    @{path="products/mosaic-frame.jpg"; size="400x400"; text="Mosaic"},
    @{path="products/merge-frame.jpg"; size="400x400"; text="Merge+Frame"},
    @{path="products/master-collage.jpg"; size="400x400"; text="Collage"},
    @{path="products/oil-painting.jpg"; size="400x400"; text="Oil+Painting"},
    @{path="products/birthday-table.jpg"; size="400x400"; text="Birthday"},
    @{path="products/bw-mosaic.jpg"; size="400x400"; text="BW+Mosaic"},
    @{path="products/acrylic-mini.jpg"; size="400x400"; text="Acrylic"},
    @{path="products/baby-journey.jpg"; size="400x400"; text="Baby+Journey"},
    @{path="products/personalised.jpg"; size="400x400"; text="Personalised"},
    @{path="products/acrylic-frame.jpg"; size="400x400"; text="Acrylic+Frame"},
    @{path="products/birthday-frame.jpg"; size="400x400"; text="Birthday+Frame"},
    @{path="products/birthday-wishes.jpg"; size="400x400"; text="Birthday+Wishes"},
    @{path="hero/slide1.jpg"; size="1200x500"; text="Decorior"},
    @{path="hero/slide2.jpg"; size="1200x500"; text="Photo+Frames"},
    @{path="hero/slide3.jpg"; size="1200x500"; text="Home+Decor"}
)

$count = 0
foreach ($img in $images) {
    $count++
    $url = "https://via.placeholder.com/$($img.size)/e0e0e0/333333?text=$($img.text)"
    $output = "public/images/$($img.path)"
    Write-Host "[$count/$($images.Count)] Downloading $($img.path)..." -NoNewline
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
        Write-Host " Done" -ForegroundColor Green
    } catch {
        Write-Host " Failed" -ForegroundColor Red
    }
}

Write-Host "`nCompleted! Downloaded $count images" -ForegroundColor Green
