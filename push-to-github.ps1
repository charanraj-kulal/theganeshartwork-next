# GitHub Push Helper Script
Write-Host "GitHub Push Helper" -ForegroundColor Green
Write-Host "=" -ForegroundColor Green
Write-Host ""

# Prompt for token
$token = Read-Host "Enter your GitHub Personal Access Token"

# Reset remote URL
Write-Host "Configuring remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
$remoteUrl = "https://$token@github.com/charanraj-kulal/theganeshartwork-next.git"
git remote add origin $remoteUrl

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Push failed. Please check your token and repository" -ForegroundColor Red
}

# Clean up
Write-Host "Cleaning up..." -ForegroundColor Yellow
git remote set-url origin https://github.com/charanraj-kulal/theganeshartwork-next.git
