# TypeScript Best Practices — Matters (2025)

This document contains the **TypeScript coding standards** for the Matters project.
All rules are derived from the project's SSOF and apply to **frontend TypeScript code** only.
PHP and CouchCMS-specific rules are intentionally left out.

---

## 🌐 Language & Consistency

1. **English only**: all variables, functions, comments, and documentation.
2. **Indentation**: always 4 spaces.
3. **Line length**: maximum 120 characters.
4. **Naming conventions**:
    - Variables & functions → `camelCase`
    - Files → `camelCase.ts`
    - Classes & Interfaces → `PascalCase`
    - Types → `PascalCase` or `camelCase` for primitives
    - Directories → `lowercase-dash`

---

## 📂 Project Structure & Modularity

5. **Folder structure in `src/js/`**:
    - `components/` → UI components with TypeScript interfaces
    - `modules/` → complex logic with strict typing
    - `utils/` → pure helpers with comprehensive type definitions
    - `types/` → shared type definitions and interfaces
    - `config/` → constants with proper typing

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
    - Define return types for functions
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
    - English only
    - 4-space indentation
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
    - Leverage utility types from `@types/utility-types`

---
