# BoundaryLab

BoundaryLab is a social enterprise on a mission to reshape how we understand and uphold personal boundaries — especially for young female adults and beyond — through real-life education, story-driven tools, and community-led learning.

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   npm run dev
   ```

2. **The app will run in demo mode with sample data.** To connect to a real database, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

3. **Navigate to** `http://localhost:3000` to explore the features:
   - **Glossary**: Learn boundary-related terms and definitions
   - **Scenarios**: Practice boundary-setting in interactive situations
   - **Forum**: Connect with the community (sample posts in demo mode)
   - **Profile**: Track your learning progress

---

## 🌱 Mission

To empower young adults, starting with young women, to identify, define, and reinforce their personal boundaries in response to subtle mistreatments often normalised in daily life.

## 🎯 Vision

A world where everyone — regardless of gender — can feel safe, respected, and confident in drawing the line.  
Where stories become tools, silence becomes dialogue, and blurry moments become learning opportunities.

---

## 🚩 The Problem

While overt harassment is often condemned, subtle forms of mistreatment — such as boundary-blurring jokes, inappropriate compliments, or uncomfortable interactions — go unnoticed or are dismissed.

These experiences:
- Are hard to articulate  
- Leave lasting emotional and professional harm  
- Are often internalised and not addressed  

Young female professionals, in particular, are disproportionately affected, often second-guessing or blaming themselves due to social pressure and lack of experience.

---

## 🧩 Our Solution

BoundaryLab is building a *living platform* of boundary education. Through shared stories and co-created tools, we:
1. *Raise awareness* — by giving words to everyday discomfort  
2. *Facilitate learning* — through relatable, scenario-based toolkits  
3. *Foster action* — by helping users reflect, prepare, and respond in real time

---

## 🧪 Features

- **📚 Boundary Glossary:** Learn to articulate complex feelings and identify subtle mistreatments.
- **🧵 Forum:** Share and validate experiences through community stories.
- **🎭 Real-Life Scenarios:** Interactive situations to practise how you'd respond and reflect on your choices.
- **🔍 Boundary Type:** Discover your boundary patterns and where you might want to grow.

---

## 🛠 Products & Revenue

We believe access to knowledge should be free — but we sustain ourselves through *educational products with purpose*:

1. **Scenario-Based Learning Toolkits:**  
   Interactive modules that help individuals or teams build their boundary-setting confidence. Available in both digital and physical formats.

2. **Meaningful Merchandise:**  
   Plushies, journals, tote bags — emotionally resonant items designed to affirm the boundary-setting journey.

---

## 👥 Target Users

- **Primary:** Young female professionals  
- **Secondary:** Queer/non-binary individuals, male allies, HR teams  
- **Geography:** Starting in London (UK), with plans to scale to Asia-Pacific and beyond

---

## 📐 Business Model

- **B2C:** Direct sales of toolkits and merchandise to individuals  
- **B2B:** Discounted pilot workshops and toolkits to small orgs; long-term growth through corporate training  
- **Community:** Platform remains free to access — monetisation comes from insights-powered products

---

## 🌏 SDG Impact

Aligned with:
- **SDG 5:** Gender Equality  
- **SDG 3:** Good Health and Wellbeing

By creating safe spaces and practical learning tools, we tackle gendered mistreatment from the ground up.

---

## 🧠 The Team

BoundaryLab was founded by three MSc Social Innovation students at UCL — from Thailand, China, and Indonesia — each bringing unique lived experiences and entrepreneurial skills to build a more empathetic, inclusive society.

---

## 🚧 Project Status

**Status:** Alpha  
Currently under solo development — MVP first version focused on core toolkit and dashboard functionality. Seeking feedback before public beta.

## 🧪 Tech Stack

- **Frontend**: React (Functional Components + Hooks)
- **Styling**: TailwindCSS
- **Backend**: Supabase (Auth + Database)
- **Build Tool**: Vite (recommended for fast development)
- **Hosting**: Vercel (auto-deploy planned)

## 📁 Project Structure (MVP)

```
src/
├── components/       # Reusable UI components
├── pages/           # Route-level components
├── lib/             # Utilities and helpers
├── hooks/           # Custom React hooks
├── styles/          # Tailwind config and global CSS
├── services/        # Supabase and external API logic
└── App.js           # Main app component
```

## 🛠️ Development Principles

### Core Rules
- **Functional React Only**: No class components, hooks for all state management
- **Minimal Dependencies**: Only essential packages (React, Tailwind, Supabase)
- **Mobile-First Design**: Responsive and accessible UI components
- **Clean Architecture**: Clear separation of concerns and consistent naming

### What's NOT Included
- ❌ AI integrations
- ❌ Analytics or tracking
- ❌ Unnecessary third-party libraries
- ❌ Complex state management (Redux, Zustand, etc.)

## ⚙️ Getting Started (for developers)

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Supabase account

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd boundarylab-web-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase keys to .env.local

# Start development server
npm run dev
```

> *Note: Future versions will include `.env.example` and setup docs. Currently solo-built.*

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Essential Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "@supabase/supabase-js": "^2.x"
  },
  "devDependencies": {
    "vite": "^4.x",
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^3.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x"
  }
}
```

## 🎨 UI Guidelines

- **Mobile-First**: Design for mobile, enhance for desktop
- **Accessibility**: Use semantic HTML and ARIA labels
- **TailwindCSS**: Utility-first styling approach
- **Consistent Spacing**: Use Tailwind's spacing scale
- **Color Palette**: Define and stick to a consistent color scheme

## 🔐 Authentication Flow

Supabase handles all authentication:
- User registration
- Email/password login
- Session management
- Protected routes

## 📝 Development Workflow

1. **Plan**: Break features into small, focused tasks
2. **Code**: Follow the established folder structure and naming conventions
3. **Test**: Ensure components work across devices and browsers
4. **Commit**: Small, descriptive commits with clear messages
5. **Deploy**: Fast iterations with working features

## 🤝 Contributions

This project is currently in early-stage solo development.  
Contributions will be open once the MVP is stable and public.  
Stay tuned ✨

### For AI Assistants (Cursor)
- Ask for clarification on unclear requirements
- Suggest, don't auto-apply major changes
- Always explain reasoning for non-trivial edits
- Use search to understand existing code before editing

### For Developers
- Follow the `.cursor/rules.md` guidelines
- Keep dependencies minimal
- Prioritize performance and accessibility
- Maintain clean, readable code

## 📋 Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Linting & Formatting
npm run lint         # Run ESLint
npm run format       # Format with Prettier

# Testing
npm run test         # Run tests (if implemented)
```

## 🔧 Configuration Files

- `tailwind.config.js` - TailwindCSS configuration
- `vite.config.js` - Vite build configuration
- `.env.local` - Environment variables (not committed)
- `package.json` - Dependencies and scripts

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## � License

All rights reserved – BoundaryLab 2025 ©

---

## 📬 Contact

- Instagram: [@boundarylab](https://www.instagram.com/boundary.lab)
- LinkedIn: [BoundaryLab](https://www.linkedin.com/company/boundary-lab/?)
- Email: [info.boundarylab@gmail.com](mailto:info.boundarylab@gmail.com)

---

*Webapp coming soon!*
