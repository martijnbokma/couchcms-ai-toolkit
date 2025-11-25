---
name: TypeScript Error Fixer
version: "1.0"
type: daily
description: Automatically fix TypeScript compilation errors
tags:
  - typescript
  - errors
  - debugging
  - compilation
requires:
  - typescript
---

# TypeScript Error Fixer Agent

Automatically fix TypeScript compilation errors in a systematic way per file, focusing on missing properties, type mismatches, and interface compliance issues.

## When to Use

- TypeScript compilation errors in your codebase
- Missing required properties in interfaces
- Type mismatches that prevent compilation
- Interface compliance issues

## Error Categories

### 1. Missing Properties

**Pattern:** `Property 'X' is missing in type`
**Solution:** Add the missing property to the object/interface

```typescript
// Before (error)
const state: ApplicationState = {
  isInitialized: true,
  // missing: initializationAttempts
};

// After (fixed)
const state: ApplicationState = {
  isInitialized: true,
  initializationAttempts: 0,
};
```

### 2. Type Mismatches

**Pattern:** `Type 'X' is not assignable to type 'Y'`
**Solution:** Ensure proper type casting or interface compliance

```typescript
// Before (error)
const value: string = someNumber;

// After (fixed)
const value: string = String(someNumber);
```

### 3. Interface Compliance

**Pattern:** Interface requirements not met
**Solution:** Implement all required properties and methods

```typescript
// Before (error)
class MyClass implements MyInterface {
  // missing required method
}

// After (fixed)
class MyClass implements MyInterface {
  requiredMethod(): void {
    // implementation
  }
}
```

### 4. Generic Constraints

**Pattern:** Generic type constraint violations
**Solution:** Adjust generic type parameters or constraints

```typescript
// Before (error)
function process<T>(item: T): T {
  return item.value; // T has no 'value' property
}

// After (fixed)
function process<T extends { value: unknown }>(item: T): T["value"] {
  return item.value;
}
```

## Best Practices

1. **Minimal Changes**: Only fix what's necessary for compilation
2. **Preserve Logic**: Maintain existing business logic
3. **Type Safety**: Ensure the fix improves type safety
4. **Consistency**: Follow existing code patterns
5. **Documentation**: Add comments for complex fixes

## Quality Checklist

- [ ] Error is resolved
- [ ] Code compiles successfully
- [ ] Existing functionality preserved
- [ ] Type safety maintained
- [ ] Code follows project standards
- [ ] All text in English
- [ ] Proper indentation (4 spaces)

## Common Quick Fixes

### Optional Chaining

```typescript
// Before
const name = user && user.profile && user.profile.name;

// After
const name = user?.profile?.name;
```

### Nullish Coalescing

```typescript
// Before
const value = input !== null && input !== undefined ? input : "default";

// After
const value = input ?? "default";
```

### Type Assertion (use sparingly)

```typescript
// When you're certain of the type
const element = document.getElementById("my-id") as HTMLInputElement;
```

### Type Guard

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

if (isString(input)) {
  // input is now typed as string
  console.log(input.toUpperCase());
}
```
