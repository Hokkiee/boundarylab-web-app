# ✍️ BoundaryLab Typography Guide

## 🎯 **Font Family: DM Sans**

### **About DM Sans**
- **Type**: Modern geometric sans-serif
- **Designer**: Colophon Foundry
- **Style**: Clean, friendly, professional
- **Perfect for**: Apps, websites, user interfaces

### **Font Characteristics**
- **Readability**: Excellent at all sizes
- **Personality**: Approachable yet professional
- **Versatility**: Works for both headlines and body text
- **Accessibility**: High legibility for users with dyslexia

## 📊 **Font Weights & Usage**

### **Available Weights** (Variable Font)
- **100-200**: Extra Light (rarely used)
- **300**: Light (subtle text, captions)
- **400**: Regular (body text, paragraphs)
- **500**: Medium (labels, form fields)
- **600**: Semi Bold (subheadings, important text)
- **700**: Bold (headings, CTAs)
- **800-1000**: Extra Bold (large headlines, impact text)

## 🎨 **Typography Scale**

### **Headings**
```css
h1: font-weight: 700; /* Bold */
h2: font-weight: 600; /* Semi Bold */
h3: font-weight: 600; /* Semi Bold */
h4: font-weight: 500; /* Medium */
```

### **Body Text**
```css
body: font-weight: 400; /* Regular */
strong: font-weight: 600; /* Semi Bold */
em: font-style: italic; /* Italic available */
```

### **UI Elements**
```css
buttons: font-weight: 500; /* Medium */
labels: font-weight: 500; /* Medium */
captions: font-weight: 400; /* Regular */
```

## 💡 **Implementation**

### **CSS Import**
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
```

### **Tailwind Config**
```javascript
fontFamily: {
  sans: ['DM Sans', 'system-ui', 'sans-serif'],
}
```

### **Usage Examples**
```jsx
// Headings
<h1 className="text-3xl font-bold">Main Heading</h1>
<h2 className="text-2xl font-semibold">Section Heading</h2>

// Body text
<p className="text-base font-normal">Regular paragraph text</p>
<span className="text-sm font-medium">Label text</span>

// UI elements
<button className="font-medium">Button Text</button>
```

## 🚀 **Why DM Sans for BoundaryLab?**

1. **Friendly & Approachable**: Perfect for a mental health/boundaries app
2. **Highly Readable**: Excellent for long-form content
3. **Professional**: Builds trust and credibility
4. **Variable Font**: Efficient loading and flexible weights
5. **Accessibility**: Great for users with reading difficulties

Your BoundaryLab app now has beautiful, professional typography! 🎉
