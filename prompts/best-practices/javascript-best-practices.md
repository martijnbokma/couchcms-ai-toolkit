# JavaScript Best Practices

**Critical: Always follow project standards before generating any code.**

Look for project standards in:

- `standards.md` (project root or `docs/` directory)
- `project.md` (if using CouchCMS AI Toolkit)
- Project-specific configuration files

This document contains **universal JavaScript coding standards** for modern web development.
All rules are framework-agnostic and should be adapted to your project's standards configuration.

---

## 🌐 Language & Consistency

1. **Language**: Follow language requirements from your project's `project.md` (typically English-only for international projects)
2. **Indentation**: Use consistent indentation as defined in `project.md` (commonly 4 spaces or 2 spaces)
3. **Line length**: Follow maximum line length from `project.md` (commonly 80-120 characters)
4. **Naming conventions**:
    - Variables & functions → `camelCase`
    - Files → `camelCase.js` or `kebab-case.js` (check `project.md`)
    - Classes → `PascalCase`
    - Constants → `UPPER_SNAKE_CASE` (for true constants)
    - Directories → `lowercase-dash` or `camelCase`

---

## 📂 Project Structure & Modularity

5. **Folder structure** (adapt to your framework):
    - `components/` → UI interactions and components
    - `modules/` or `lib/` → Complex logic and utilities
    - `utils/` or `helpers/` → Pure helper functions
    - `config/` → Constants, endpoints, configuration
    - Entry points → As defined by your build tools

6. **Separation of concerns**:
    - UI framework → Simple UI interactions and state
    - Utility modules → Complex logic, API calls, validation
    - CSS framework → Styling (avoid inline styles)
    - Backend/CMS → Content and templates only

7. **Entry points**: Only designated entry files should be bundled (check `standards.md`)

8. **No barrel files**: Avoid creating `index.js` files that only re-export (kills tree-shaking)

9. **Tree shaking**: Always import directly from source files, never via barrel exports

---

## ⚡ Code Quality

10. **DRY principle**: No duplication; create reusable helpers in utils/
11. **Small & focused functions**: One responsibility per function (< 50 lines ideal)
12. **Meaningful names**: Avoid vague names like `doStuff()`, `handleData()`
13. **Comments**: Explain _why_, not _what_ (code should be self-documenting)
14. **Linting & Formatting**: Use ESLint + Prettier (or project-defined tools)
15. **Tests mirror structure**: `tests/` or `__tests__/` should follow the same folder structure as source

---

## 🔒 Security in JavaScript

16. **Never use `eval()` or dynamic code injection**
17. **Validate inputs & sanitize outputs** in utility functions
18. **CSRF & authentication**: Ensure frontend requests align with backend security patterns
19. **Error handling**: Wrap async code with `try/catch` and use custom error classes if needed
20. **Avoid exposing sensitive data**: Never store secrets in client-side code

---

## 🎨 Design System & Theming

21. **Design system is the single source of truth**: Always reuse existing components
22. **CSS framework integration**: Use your project's configured CSS framework classes
23. **No hardcoded themes**: Load themes via configuration, not inline
24. **Theme persistence**: Use `localStorage` or proper state management

---

## ⚙️ Performance & Maintainability

25. **Lazy loading**: Load heavy modules dynamically using `import()`
26. **Code splitting**: Build tools should bundle only required modules
27. **Optimize DOM usage**: Minimize reflows; use event delegation
28. **Pure helpers**: Utility functions must have no side effects
29. **Cache/memoize expensive operations** where appropriate
30. **Debounce/throttle** event handlers that fire frequently

---

## 🧪 Testing & Review

31. **Unit & integration tests**: Required for utils/ and modules/
32. **Accessibility (WCAG 2.1 AA)**: Keyboard navigation, ARIA attributes, proper contrast
33. **Code review checklist**:
    - Language requirements met (check `standards.md`)
    - Consistent indentation
    - No barrel files
    - Tree shaking works
    - DRY applied
    - Design system referenced
    - Errors handled correctly
    - Tests present
    - No security issues

---

## 📚 Modern JavaScript Features

34. **ES Modules**: Use `import`/`export`, avoid CommonJS in frontend
35. **Async/Await**: Prefer over raw Promises for readability
36. **Optional chaining**: Use `?.` for safe property access
37. **Nullish coalescing**: Use `??` instead of `||` for defaults
38. **Destructuring**: Use for cleaner variable assignment
39. **Spread operator**: Use for immutable operations
40. **Template literals**: Use for string interpolation

---

## 🔧 Framework Integration Notes

When using JavaScript with specific frameworks, additional patterns apply:

- **React/Vue/Svelte**: Follow component patterns from framework documentation
- **Alpine.js**: Keep inline logic minimal; extract complex logic to modules
- **Vanilla JS**: Use module pattern or ES modules for organization
- **Node.js**: Additional backend-specific patterns may apply

Check your project's `standards.md` and module documentation for framework-specific guidelines.

---

## Quick Reference Checklist

- [ ] Follows naming conventions from `standards.md`
- [ ] No barrel files or index re-exports
- [ ] Functions are small and focused
- [ ] Errors are properly handled
- [ ] No `eval()` or dynamic code execution
- [ ] Uses modern ES features appropriately
- [ ] Tests are present for critical code
- [ ] Accessibility requirements met
- [ ] Performance optimizations applied
