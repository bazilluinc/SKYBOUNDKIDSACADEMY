@echo off
REM SKYBOUND Academy - Cloudflare Pages Deployment Script (Windows)

echo.
echo =====================================================
echo 🚀 SKYBOUND ACADEMY - CLOUDFLARE DEPLOYMENT
echo =====================================================
echo.

REM Step 1: Build the project
echo 📦 Step 1: Building the project...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ Build failed! Please fix the errors above.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Step 2: Copy _headers to dist folder
echo 📋 Step 2: Copying _headers to dist folder...
copy /Y _headers dist\

if %ERRORLEVEL% neq 0 (
    echo ⚠️  Warning: Could not copy _headers file
)

echo ✅ Headers configured!
echo.

REM Step 3: Check D1 database
echo 🗄️  Step 3: D1 Database Setup...
echo To create a new D1 database, run: npx wrangler d1 create skyboundacademy_db
echo To push schema to D1, run: npx wrangler d1 execute skyboundacademy_db --file=schema.sql --remote
echo Note: Your database ID is: 4d391d81-6279-4ded-bad2-74c5e6ad4e97
echo.

REM Step 4: Deploy to Cloudflare Pages
echo 🚀 Step 4: Deploying to Cloudflare Pages...
npx wrangler pages deploy ./dist

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ Deployment failed! Please check your Cloudflare credentials.
    echo Make sure you are logged in: npx wrangler login
    pause
    exit /b 1
)

echo.
echo =====================================================
echo 🎉 DEPLOYMENT COMPLETE!
echo =====================================================
echo.
echo 📱 Your app is live at: https://skybound-academy.pages.dev
echo.
echo 🔧 Next steps:
echo    1. Push database schema: npx wrangler d1 execute skyboundacademy_db --file=schema.sql --remote
echo    2. Build Android APK: npm run android:build
echo.
pause
