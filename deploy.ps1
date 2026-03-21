# GitHub Pages Auto-Deploy Script for Mavic Portfolio
# Run this in PowerShell to deploy your portfolio

Write-Host "Mavic Portfolio Deployment Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git found: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git not found"
    }
} catch {
    Write-Host "ERROR: Git not found!" -ForegroundColor Red
    Write-Host "Please install Git first: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

# Set working directory
$portfolioPath = "C:\Users\Luigi\.openclaw\workspace\portfolio"
Set-Location $portfolioPath

Write-Host ""
Write-Host "Step-by-Step Deployment Guide:" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check for remote
$remote = git remote -v 2>$null
if (-not $remote) {
    Write-Host "STEP 1: Create a GitHub repository:" -ForegroundColor Yellow
    Write-Host "    a) Go to: https://github.com/new" -ForegroundColor White
    Write-Host "    b) Repository name: mavic-portfolio" -ForegroundColor White
    Write-Host "    c) Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    Write-Host "    Then paste the repository URL below"
    Write-Host "    (Example: https://github.com/YOURUSERNAME/mavic-portfolio.git)"
    $repoUrl = Read-Host "Repository URL"
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "Remote added successfully" -ForegroundColor Green
    } else {
        Write-Host "ERROR: No URL provided. Exiting." -ForegroundColor Red
        exit
    }
} else {
    Write-Host "Remote repository already configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "STEP 2: Pushing code to GitHub..." -ForegroundColor Yellow

# Push to main branch
git add .
git commit -m "Update portfolio" 2>$null
git branch -M main
$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Code pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "Push may need authentication. Check your browser for login." -ForegroundColor Yellow
    Write-Host "Then run: git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "STEP 3: Enable GitHub Pages:" -ForegroundColor Yellow
Write-Host "    a) Go to your repository on GitHub" -ForegroundColor White
Write-Host "    b) Click 'Settings' tab" -ForegroundColor White  
Write-Host "    c) Click 'Pages' in left sidebar" -ForegroundColor White
Write-Host "    d) Under 'Build and deployment' select 'Deploy from a branch'" -ForegroundColor White
Write-Host "    e) Select 'main' branch and '/ (root)' folder" -ForegroundColor White
Write-Host "    f) Click 'Save'" -ForegroundColor White
Write-Host ""

# Try to open the settings page
$remoteUrl = git remote get-url origin 2>$null
if ($remoteUrl) {
    # Convert git URL to web URL
    if ($remoteUrl -match "github\.com[:/](.+?)\.git") {
        $usernameRepo = $matches[1]
        $pagesUrl = "https://github.com/$usernameRepo/settings/pages"
        Write-Host "Opening GitHub Pages settings..." -ForegroundColor Cyan
        Start-Process $pagesUrl
        
        $username = $usernameRepo.Split('/')[0]
        $reponame = $usernameRepo.Split('/')[1]
        $liveUrl = "https://$username.github.io/$reponame"
        Write-Host ""
        Write-Host "Your website will be live at:" -ForegroundColor Green
        Write-Host "    $liveUrl" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Note: GitHub Pages may take 1-2 minutes to deploy." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
