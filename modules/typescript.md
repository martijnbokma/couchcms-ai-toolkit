---
id: typescript
name: "TypeScript"
version: "5.x"
description: "TypeScript standards and patterns"
required: false
requires: []
conflicts: []
---

# TypeScript Standards

## Configuration

### tsconfig.json
```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true,
        "outDir": "./dist",
        "rootDir": "./src"
    },
    "include": ["src/**/*", "assets/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

## Naming Conventions

- **Variables**: `camelCase` (e.g., `userName`, `isActive`)
- **Functions**: `camelCase` (e.g., `getUserProfile`, `validateInput`)
- **Interfaces/Types**: `PascalCase` (e.g., `UserProfile`, `VideoConfig`)
- **Constants**: `SCREAMING_SNAKE_CASE` or `camelCase` (e.g., `MAX_RETRIES`, `defaultConfig`)
- **Files**: `kebab-case.ts` (e.g., `user-profile.ts`, `video-player.ts`)

## Type Definitions

### Interfaces (Preferred for Objects)
```typescript
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}
```

### Types (For Unions/Complex Types)
```typescript
export type VideoStatus = 'playing' | 'paused' | 'ended';
export type EventHandler = (event: Event) => void;
```

### Avoid Enums
```typescript
// ❌ Avoid enums
enum Status { Active, Inactive }

// ✅ Use const objects or unions
const Status = {
    Active: 'active',
    Inactive: 'inactive'
} as const;
type Status = typeof Status[keyof typeof Status];
```

## Function Patterns

### RORO Pattern (Receive Object, Return Object)
```typescript
interface GetUserOptions {
    id: string;
    includeProfile?: boolean;
}

interface GetUserResult {
    user: User;
    profile?: Profile;
}

export function getUser(options: GetUserOptions): GetUserResult {
    const { id, includeProfile = false } = options;
    // ...
    return { user, profile };
}
```

### Guard Clauses
```typescript
export function processUser(user: User | null): string {
    if (!user) {
        return 'No user';
    }
    
    if (!user.isActive) {
        return 'User inactive';
    }
    
    return user.name;
}
```

## Error Handling

### Result Types
```typescript
type Result<T, E = Error> = 
    | { success: true; data: T }
    | { success: false; error: E };

function parseJson<T>(json: string): Result<T> {
    try {
        return { success: true, data: JSON.parse(json) };
    } catch (error) {
        return { success: false, error: error as Error };
    }
}
```

### Validation
```typescript
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
```

## Module Organization

### Named Exports Only
```typescript
// ✅ GOOD: Named exports
export function createPlayer() { ... }
export interface PlayerConfig { ... }

// ❌ BAD: Default exports
export default class Player { ... }
```

### No Barrel Files
```typescript
// ❌ BAD: index.ts barrel file
export * from './player';
export * from './utils';

// ✅ GOOD: Direct imports
import { createPlayer } from './player';
import { formatTime } from './utils';
```

## DOM Interaction

### Type-Safe Element Selection
```typescript
function getElement<T extends HTMLElement>(
    selector: string, 
    parent: Document | Element = document
): T | null {
    return parent.querySelector<T>(selector);
}

const button = getElement<HTMLButtonElement>('#submit-btn');
if (button) {
    button.disabled = true;
}
```

### Event Handling
```typescript
function handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // ...
}

element.addEventListener('click', handleClick);
```

## Best Practices

### DO
- Use strict mode (`"strict": true`)
- Prefer interfaces for object types
- Use named exports only
- Implement proper error handling
- Write self-documenting code

### DON'T
- Use `any` type (use `unknown` if needed)
- Use enums (use const objects or unions)
- Use default exports
- Create barrel files (index.ts re-exports)
- Ignore TypeScript errors with `@ts-ignore`

## CSS Variables in JavaScript

### 🚨 CRITICAL: No var() in Inline SVG
```typescript
// ❌ BAD: CSS var() doesn't work in SVG attributes
element.innerHTML = `<svg fill="var(--primary)">`;

// ✅ GOOD: Use getComputedStyle
const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary').trim();
element.innerHTML = `<svg fill="${primaryColor}">`;
```
