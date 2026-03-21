@echo off
cls
echo ====================================
echo  Mavic Portfolio Deployment Script
echo ====================================
echo.
echo Checking for Git...

git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git not found!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b
)

echo [OK] Git is installed
echo.
echo ====================================
echo DEPLOYMENT STEPS:
echo ====================================
echo.
echo 1. Create GitHub repository:
echo    - Go to: https://github.com/new
echo    - Name: mavic-portfolio
echo    - Click "Create repository"
echo.
echo 2. Copy the repository URL (HTTPS)
echo    Example: https://github.com/YOURNAME/mavic-portfolio.git
echo.
echo 3. Press any key to continue after creating repo...
pause >nul

echo.
echo Enter your GitHub repository URL:
set /p REPO_URL=

echo.
echo Setting up remote and pushing...
git remote add origin %REPO_URL% 2>nul
git add .
git commit -m "Update portfolio" 2>nul
git branch -M main
git push -u origin main

echo.
echo ====================================
echo [SUCCESS] Code pushed to GitHub!
echo ====================================
echo.
echo NEXT STEP - Enable GitHub Pages:
echo ------------------------------------
echo 1. Go to your repository on GitHub
echo 2. Click Settings tab
echo 3. Click Pages in left sidebar
echo 4. Select "Deploy from a branch"
echo 5. Select "main" branch, "/ (root)" folder
echo 6. Click Save
echo.
echo Opening GitHub now...
start https://github.com/new

echo.
pause
