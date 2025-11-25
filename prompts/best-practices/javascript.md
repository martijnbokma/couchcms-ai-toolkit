# JavaScript Best Practices — Matters (2025)

This document contains the **JavaScript/TypeScript coding standards** for the Matters project.
All rules are derived from the project’s SSOF and apply to **frontend code** only.
PHP and CouchCMS-specific rules are intentionally left out.

---

## 🌐 Language & Consistency

1. **English only**: all variables, functions, comments, and documentation.
2. **Indentation**: always 4 spaces.
3. **Line length**: maximum 120 characters.
4. **Naming conventions**:
    - Variables & functions → `camelCase`
    - Files → `camelCase.ts` / `camelCase.js`
    - Classes → `PascalCase`
    - Directories → `lowercase-dash`

---

## 📂 Project Structure & Modularity

5. **Folder structure in `js/src/`**:
    - `components/` → small UI interactions (Alpine.js)
    - `modules/` → complex logic (TypeScript)
    - `utils/` → pure helpers, DRY functions
    - `config/` → constants, endpoints, theme config
    - `main.ts` → frontend entry point
    - `admin.ts` → CouchCMS admin entry point

6. **Separation of concerns**:
    - Alpine.js → simple UI interactions
    - TypeScript → complex logic, API calls, validation
    - Tailwind + daisyUI → styling
    - CouchCMS → content/templates only

7. **Entry points**: only `main.ts` and `admin.ts` are bundled via Bun/esbuild.

8. **No barrel files**: do not create `index.js` or `index.ts` files with re-exports.

9. **Tree shaking enabled**: always import directly, never via barrels.

---

## ⚡ Code Quality

10. **DRY principle**: no duplication; reusable helpers go into `utils/`.
11. **Small & focused functions**: one responsibility per function.
12. **Meaningful names**: avoid vague names like `doStuff()`.
13. **Comments**: explain _why_, not _what_.
14. **ESLint + Prettier**: mandatory for linting and formatting.
15. **Tests mirror structure**: `tests/` should follow the same folder structure as `src/`.

---

## 🔒 Security in JavaScript

16. **Never use `eval()` or dynamic code injection**.
17. **Validate inputs & sanitize outputs** in `utils/` or `modules/`.
18. **CSRF & authentication**: ensure frontend requests align with CouchCMS filters.
19. **Error handling**: wrap async code with `try/catch` and use custom error classes if needed.

---

## 🎨 Design System & Theming

20. **Design system is the single source of truth**: always reuse components.
21. **DaisyUI + Tailwind**: use standard components and content-aware colors.
22. **No hardcoded themes**: always load via `config/theme.ts` and `theme_loader.html`.
23. **Theme persistence**: use `localStorage`, not inline hacks.

---

## ⚙️ Performance & Maintainability

24. **Lazy loading**: load heavy modules dynamically using `import()`.
25. **Code splitting**: Bun/esbuild should bundle only required modules.
26. **Optimize DOM usage**: minimize reflows and use event delegation.
27. **Pure helpers**: `utils/` functions must have no side effects.
28. **Cache/memoize expensive operations** where possible.

---

## 🧪 Testing & Review

29. **Unit & integration tests**: required for `utils/` and `modules/`.
30. **Accessibility (WCAG 2.1 AA)**: keyboard navigation, ARIA attributes, proper contrast.
31. **Code review checklist**:

- English only
- 4-space indentation
- No barrel files
- Tree shaking works
- DRY applied
- Design system referenced
- Errors handled correctly
- Tests present

---
