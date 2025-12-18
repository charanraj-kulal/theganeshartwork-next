# Create GitHub Repository and Push Code
Write-Host "GitHub Repository Creator" -ForegroundColor Green
Write-Host ""

# Prompt for token
$token = Read-Host "Enter your GitHub Personal Access Token"

# Create repository using GitHub API
Write-Host "Creating repository on GitHub..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "token $token"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    "name" = "theganeshartwork-next"
    "description" = "E-commerce website for Ganesh Artwork - Photo frames and home decor"
    "private" = $false
    "auto_init" = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Repository created successfully!" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "Repository already exists, continuing..." -ForegroundColor Yellow
    } else {
        Write-Host "Error creating repository: $_" -ForegroundColor Red
        exit 1
    }
}

# Configure and push
Write-Host "Configuring git remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
$remoteUrl = "https://$token@github.com/charanraj-kulal/theganeshartwork-next.git"
git remote add origin $remoteUrl

Write-Host "Pushing code to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/charanraj-kulal/theganeshartwork-next" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Push failed" -ForegroundColor Red
}

# Clean up
git remote set-url origin https://github.com/charanraj-kulal/theganeshartwork-next.git
