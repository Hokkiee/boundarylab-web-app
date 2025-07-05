# 🎨 BoundaryLab Brand Colors

## 🎯 **Official Brand Color Palette**

### **Primary Brand Color**
- **Color**: `#e4a9bd` - Soft Pink
- **Usage**: Main brand elements, buttons, highlights
- **Tailwind**: `primary-500`

### **Background Color**
- **Color**: `#fffbf3` - Warm Off-White
- **Usage**: Main app background, page backgrounds
- **Tailwind**: `background-primary`

### **Accent Color**
- **Color**: `#9ed5e8` - Light Blue
- **Usage**: Secondary elements, highlights, call-to-actions
- **Tailwind**: `accent-300`

### **Text Colors**
- **Primary**: `#000000` - Black
- **Secondary**: `#374151` - Dark Gray
- **Muted**: `#6b7280` - Light Gray
- **Font**: DM Sans (variable weight)

## 🛠️ **Implementation**

### **Updated Tailwind Config**
```javascript
primary: {
  500: '#e4a9bd', // Main brand color
  // ... full scale generated
},
accent: {
  300: '#9ed5e8', // Main accent color
  // ... full scale generated
},
background: {
  primary: '#fffbf3', // Main background
  secondary: '#ffffff', // Card backgrounds
},
text: {
  primary: '#000000', // Black text
  secondary: '#374151', // Dark gray
  muted: '#6b7280', // Light gray
}
```

### **Usage Examples**
```jsx
// Primary buttons (using accent color)
<button className="bg-accent-300 hover:bg-accent-400 text-black">
  Primary Action
</button>

// Secondary buttons
<button className="bg-background-secondary hover:bg-gray-50 text-text-primary border border-gray-300">
  Secondary Action
</button>

// Primary brand accents
<div className="text-primary-500">
  Brand element
</div>

// Background
<div className="bg-background-primary">
  Main content
</div>

// Text
<h1 className="text-text-primary">Main heading</h1>
<p className="text-text-secondary">Secondary text</p>
<span className="text-text-muted">Muted text</span>
```

## ✅ **Updated Elements**
- ✅ Tailwind configuration
- ✅ CSS base styles (body background)
- ✅ PWA manifest theme colors
- ✅ HTML meta theme color

## 🚀 **Next Steps**
Ready to apply these brand colors throughout your BoundaryLab interface for a cohesive, branded experience! 🎉
