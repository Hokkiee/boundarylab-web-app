#!/bin/bash

# BoundaryLab Icon Generation Script
# This script helps generate all required icons from your logo

echo "🎨 BoundaryLab Icon Generation Helper"
echo "====================================="
echo ""

# Check if logo exists
if [ ! -f "src/assets/images/logos/logo-mark.svg" ]; then
    echo "❌ Logo file not found: src/assets/images/logos/logo-mark.svg"
    exit 1
fi

echo "✅ Logo file found!"
echo ""

# Instructions for manual generation
echo "📋 To generate icons manually:"
echo ""
echo "1. PNG Icons (if you have ImageMagick installed):"
echo "   brew install imagemagick"
echo "   convert src/assets/images/logos/logo-mark.svg -resize 16x16 public/favicon-16x16.png"
echo "   convert src/assets/images/logos/logo-mark.svg -resize 32x32 public/favicon-32x32.png"
echo "   convert src/assets/images/logos/logo-mark.svg -resize 180x180 public/apple-touch-icon.png"
echo "   convert src/assets/images/logos/logo-mark.svg -resize 192x192 public/icon-192.png"
echo "   convert src/assets/images/logos/logo-mark.svg -resize 512x512 public/icon-512.png"
echo ""

echo "2. Online Generator (Recommended):"
echo "   Visit: https://favicon.io/favicon-converter/"
echo "   Upload: src/assets/images/logos/logo-mark.svg"
echo "   Download and extract to public/ folder"
echo ""

echo "3. Files to create:"
echo "   public/favicon-16x16.png"
echo "   public/favicon-32x32.png"
echo "   public/apple-touch-icon.png"
echo "   public/icon-192.png"
echo "   public/icon-512.png"
echo "   public/og-image.png (1200x630 for social sharing)"
echo ""

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "🔧 ImageMagick detected! Would you like to auto-generate icons? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🔄 Generating icons..."
        
        # Generate icons
        convert src/assets/images/logos/logo-mark.svg -resize 16x16 -background none public/favicon-16x16.png
        convert src/assets/images/logos/logo-mark.svg -resize 32x32 -background none public/favicon-32x32.png
        convert src/assets/images/logos/logo-mark.svg -resize 180x180 -background none public/apple-touch-icon.png
        convert src/assets/images/logos/logo-mark.svg -resize 192x192 -background none public/icon-192.png
        convert src/assets/images/logos/logo-mark.svg -resize 512x512 -background none public/icon-512.png
        
        echo "✅ Icons generated successfully!"
        echo ""
        echo "📂 Generated files:"
        ls -la public/*.png 2>/dev/null || echo "No PNG files found"
    fi
else
    echo "ℹ️  ImageMagick not found. Use online generator or install ImageMagick."
fi

echo ""
echo "🎉 Setup complete! Your favicon and PWA icons are ready."
echo "💡 Test your PWA by opening the app on mobile and trying to install it."
