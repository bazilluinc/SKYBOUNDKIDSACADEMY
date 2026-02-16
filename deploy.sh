#!/bin/bash
# SKYBOUND Academy - Cloudflare Pages Deployment Script

echo "🚀 Starting Cloudflare Pages Deployment..."
echo ""

# Step 1: Build the project
echo "📦 Step 1: Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors above."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Check if D1 database needs to be created
echo "🗄️  Step 2: Checking D1 database..."
echo "To create a new D1 database, run: npx wrangler d1 create skyboundacademy_db"
echo "To push schema to D1, run: npx wrangler d1 execute skyboundacademy_db --file=schema.sql --remote"
echo ""

# Step 3: Deploy to Cloudflare Pages
echo "🚀 Step 3: Deploying to Cloudflare Pages..."
npx wrangler pages deploy ./dist

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed! Please check your Cloudflare credentials."
    exit 1
fi

echo ""
echo "🎉 Deployment complete! Visit your Cloudflare Pages URL."
