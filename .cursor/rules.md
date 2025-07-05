# .cursor/rules.md

## BoundaryLab Project: Cursor Rules

1. **Functional React Only**  
   All components must be functional (no class components). Use hooks for state and effects.

2. **Minimal Dependencies**  
   Only install packages essential for the MVP (React, TailwindCSS, Supabase). Avoid extra libraries.

3. **Folder Structure Discipline**  
   - `src/`: App entry and setup.
   - `components/`: Reusable UI elements.
   - `pages/`: Route-level components.
   - `lib/`: Utilities and helpers.
   - `hooks/`: Custom React hooks.
   - `styles/`: Tailwind config and global CSS.
   - `services/`: Supabase and external logic.

4. **Mobile-First, Accessible UI**  
   All layouts/components must be responsive and accessible. Use Tailwind for styling.

5. **No AI, Analytics, or Tracking**  
   Do not add AI, analytics, or tracking code. Keep logic simple and focused.

6. **Safe Cursor Usage**  
   - Never run destructive commands without explicit user approval.
   - Confirm before bulk edits or refactors.
   - Use search to understand code before editing.

7. **Consistent Naming**  
   Use clear, descriptive names for files, components, and variables. Follow React and Tailwind conventions.

8. **Fast, Clean Commits**  
   Ship working features quickly. Keep commits small, focused, and well-described.

9. **Supabase Only for Auth & Data**  
   All authentication and database logic must use Supabase.

10. **AI Collaboration**  
    - Ask for clarification if requirements are unclear.
    - Suggest, but do not auto-apply, major changes.
    - Always explain reasoning for non-trivial edits.
