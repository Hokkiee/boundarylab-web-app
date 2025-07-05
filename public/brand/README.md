# Brand Assets - Public Folder

This folder contains static brand assets that are served directly by the web server.

## Files to Add:

### Essential Files
- `favicon.ico` - Website favicon (16x16, 32x32, 48x48 sizes)
- `logo-192.png` - PWA app icon (192x192px)
- `logo-512.png` - PWA app icon (512x512px)
- `apple-touch-icon.png` - iOS home screen icon (180x180px)

### Social Media
- `social-preview.png` - Open Graph image (1200x630px)
- `twitter-card.png` - Twitter card image (1200x675px)

### Additional
- `logo-main.png` - High-res logo for external use
- `brand-guide.pdf` - Brand guidelines document

## Usage in HTML
```html
<!-- Favicon -->
<link rel="icon" href="/brand/favicon.ico" />

<!-- PWA Icons -->
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
<link rel="icon" sizes="192x192" href="/brand/logo-192.png" />

<!-- Social Preview -->
<meta property="og:image" content="/brand/social-preview.png" />
```

Files in this folder are accessible at: `https://yourdomain.com/brand/filename`
