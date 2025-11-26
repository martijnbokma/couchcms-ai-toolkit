# Refactor File

Refactor the selected file(s) using toolkit patterns and best practices.

## Refactoring Process

1. **Analyze** - Review current code structure
2. **Identify** - Find refactoring opportunities
3. **Plan** - Create refactoring plan
4. **Execute** - Apply changes with confirmation
5. **Verify** - Check for regressions

## Common Refactorings

### CouchCMS Templates
- Extract repeated patterns to snippets
- Use `<cms:embed>` for shared components
- Add authentication filters where needed
- Fix Alpine.js syntax (full syntax required)

### TypeScript Files
- Add explicit return types
- Replace `any` with proper types
- Extract interfaces for object shapes
- Use named exports

### CSS Files
- Convert to TailwindCSS utilities
- Use daisyUI semantic colors
- Remove hardcoded colors
- Add responsive modifiers

## Safety Checks

Before refactoring:
- [ ] Backup current code
- [ ] Identify all usages
- [ ] Check for breaking changes
- [ ] Verify tests pass (if available)

## Output

Provide:
1. Summary of changes
2. Before/after code examples
3. Migration notes (if breaking)
4. Testing recommendations
