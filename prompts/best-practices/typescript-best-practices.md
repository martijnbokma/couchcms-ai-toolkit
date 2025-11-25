# TypeScript Best Practices

**Critical: Always follow project standards (standards.md) before generating any code.**

This document contains **universal TypeScript coding standards** for modern web development.
All rules are framework-agnostic and should be adapted to your project's `standards.md` configuration.

---

## 🌐 Language & Consistency

1. **Language**: Follow language requirements from `standards.md` (typically English-only)
2. **Indentation**: Use consistent indentation as defined in `standards.md`
3. **Line length**: Follow maximum line length from `standards.md`
4. **Naming conventions**:
    - Variables & functions → `camelCase`
    - Files → `camelCase.ts` or `kebab-case.ts` (check `standards.md`)
    - Classes & Interfaces → `PascalCase`
    - Types → `PascalCase`
    - Directories → `lowercase-dash` or `camelCase`

---

## 📂 Project Structure & Modularity

5. **Folder structure** (adapt to your framework):
    - `components/` → UI components with TypeScript interfaces
    - `modules/` or `lib/` → Complex logic with strict typing
    - `utils/` or `helpers/` → Pure helpers with comprehensive type definitions
    - `types/` → Shared type definitions and interfaces
    - `config/` → Constants with proper typing

6. **Type definitions**:
    - Always define interfaces for objects
    - Use `type` for unions, primitives, and computed types
    - Avoid `any` - use `unknown` or specific types
    - Use generic types for reusable components

7. **Import/Export patterns**:
    - Use named exports exclusively
    - No barrel files (`index.ts` with re-exports)
    - Import directly from source files
    - Use `import type` for type-only imports

---

## ⚡ Code Quality

8. **Strict TypeScript**:
    - Enable `strict: true` in tsconfig.json
    - Use `noImplicitAny: true`
    - Enable `strictNullChecks: true`
    - Use `noUnusedLocals` and `noUnusedParameters`

9. **Type safety**:
    - Define return types for public functions
    - Use type guards for runtime checks
    - Prefer type assertions with `as` over angle brackets
    - Use discriminated unions for state management

10. **Error handling**:
    - Use Result types (Ok/Err) for expected errors
    - Define custom error classes with proper typing
    - Use exhaustive switch statements for union types
    - Handle async errors with proper typing

---

## 🔒 Security in TypeScript

11. **Input validation**:
    - Use Zod or similar for runtime validation
    - Define strict interfaces for external data
    - Sanitize user inputs before processing
    - Use branded types for sensitive data

12. **Type guards**:
    - Implement runtime type checking
    - Use `instanceof` for class validation
    - Create custom type guard functions
    - Validate external API responses

---

## 🎨 Design System & Theming

13. **Component typing**:
    - Define props interfaces for all components
    - Use generic types for reusable components
    - Type event handlers properly
    - Define theme types for consistent styling

14. **State management**:
    - Use typed state management patterns
    - Define action types for state updates
    - Use discriminated unions for complex state
    - Type context providers properly

---

## ⚙️ Performance & Maintainability

15. **Type optimization**:
    - Use `const assertions` for immutable data
    - Leverage TypeScript's type inference where possible
    - Use `Readonly<T>` for immutable objects
    - Prefer composition over inheritance

16. **Code organization**:
    - Keep type definitions close to usage
    - Use module augmentation for extending types
    - Define utility types for common patterns
    - Use mapped types for transformations

---

## 🧪 Testing & Review

17. **Type testing**:
    - Test type definitions with `expectType`
    - Use `@ts-expect-error` for intentional type errors
    - Validate complex types with type-level tests
    - Test generic type constraints

18. **Code review checklist**:
    - Language requirements met (check `standards.md`)
    - Strict TypeScript enabled
    - No `any` types used
    - Proper error handling
    - Type guards implemented
    - Generic types used appropriately
    - Tests cover type scenarios

---

## 📚 Modern TypeScript Features

19. **ES2024+ features**:
    - Use `const` assertions for literal types
    - Leverage template literal types for string manipulation
    - Use conditional types for complex logic
    - Implement branded types for domain modeling

20. **Advanced patterns**:
    - Use mapped types for transformations
    - Implement recursive types for nested structures
    - Use template literal types for API endpoints
    - Leverage utility types (`Partial`, `Pick`, `Omit`, etc.)

---

## 🔧 Framework Integration Notes

When using TypeScript with specific frameworks, additional patterns apply:

- **React**: Use `React.FC`, proper event types, and generic components
- **Vue**: Use `defineComponent` with type inference
- **Node.js**: Use `@types/node` and proper async typing
- **Express**: Type request/response with generics

Check your project's `standards.md` and module documentation for framework-specific guidelines.

---

## Quick Reference Checklist

- [ ] Strict mode enabled in tsconfig
- [ ] No `any` types (use `unknown` if needed)
- [ ] Named exports only (no default exports)
- [ ] No barrel files or index re-exports
- [ ] Type-only imports use `import type`
- [ ] Interfaces for all objects
- [ ] Type guards for runtime validation
- [ ] Proper error handling with typed errors
- [ ] Tests cover type scenarios
