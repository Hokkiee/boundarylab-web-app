# BoundaryLab Brand Assets

This folder contains all brand assets for the BoundaryLab web application.

## 📁 Folder Structure

### `/src/assets/` - Development Assets
Assets that are imported directly into React components.

#### `/images/`
- **`/logos/`** - BoundaryLab logo files
  - `logo-main.svg` - Primary logo (recommended)
  - `logo-main.png` - Primary logo (fallback)
  - `logo-horizontal.svg` - Horizontal layout logo
  - `logo-mark.svg` - Logo mark only (no text)
  - `logo-white.svg` - White version for dark backgrounds
  - `logo-monochrome.svg` - Single color version

- **`/icons/`** - UI icons and feature icons
  - `glossary-icon.svg` - Boundary glossary feature icon
  - `scenarios-icon.svg` - Real-life scenarios feature icon
  - `forum-icon.svg` - Community forum feature icon
  - `assessment-icon.svg` - Boundary assessment feature icon

- **`/graphics/`** - Illustrations and graphics
  - `hero-illustration.svg` - Landing page hero graphic
  - `dashboard-graphic.svg` - Dashboard welcome graphic
  - `empty-states/` - Graphics for empty states

- **`/backgrounds/`** - Background images and patterns
  - `hero-bg.jpg` - Hero section background
  - `pattern-subtle.svg` - Subtle background pattern

#### `/fonts/` - Custom fonts (if any)
- Custom fonts that need to be bundled with the app

### `/public/brand/` - Static Brand Assets
Assets accessible via direct URL (for favicons, social sharing, etc.)

- `favicon.ico` - Website favicon
- `logo-192.png` - PWA icon (192x192)
- `logo-512.png` - PWA icon (512x512)
- `social-preview.png` - Social media preview image
- `apple-touch-icon.png` - iOS home screen icon

## 🎨 Brand Guidelines

### Logo Usage
- **Primary Logo**: Use `logo-main.svg` in most cases
- **Minimum Size**: 120px width for horizontal layouts
- **Clear Space**: Maintain clear space equal to the height of the "B" in BoundaryLab
- **Dark Backgrounds**: Use `logo-white.svg`

### Color Palette
```
Primary Brand: #e4a9bd (soft pink)
Accent Color: #9ed5e8 (light blue)
Background: #fffbf3 (warm off-white)
Text: #000000 (black)
```

### Typography
- **Primary Font**: DM Sans (Google Fonts)
- **Weights**: 100-1000 (variable font)
- **Styles**: Normal and Italic

## 📱 File Format Recommendations

### Logos
- **SVG**: Preferred for scalability and web performance
- **PNG**: High-res fallback (minimum 2x resolution)
- **Transparent backgrounds** for overlaying

### Icons
- **SVG**: Vector icons for crisp display at any size
- **24x24px**: Base size for UI icons
- **Stroke width**: 1.5px for consistency

### Images
- **WebP**: Modern format for best compression
- **JPG**: Photography and complex images
- **PNG**: Graphics with transparency
- **Optimize**: Compress all images for web

## 🚀 How to Use

### Import in React Components
```jsx
import logo from '../assets/images/logos/logo-main.svg'
import heroGraphic from '../assets/images/graphics/hero-illustration.svg'

function Component() {
  return <img src={logo} alt="BoundaryLab" />
}
```

### Public Assets (direct URL)
```jsx
// Accessible at /brand/favicon.ico
<link rel="icon" href="/brand/favicon.ico" />
```

## 📋 Asset Checklist

Upload these files when ready:

### Essential
- [ ] Primary logo (SVG + PNG)
- [ ] Favicon
- [ ] Social preview image

### Recommended
- [ ] Logo variations (white, monochrome)
- [ ] Feature icons
- [ ] Hero illustration
- [ ] App icons for PWA

### Optional
- [ ] Custom fonts
- [ ] Background patterns
- [ ] Additional graphics

---

**Need help with any specific assets? Let me know what you'd like to add!**
