# Validate Code

Validate selected code against project standards and best practices.

## Validation Checks

### Pre-Flight Checks (Critical)
- [ ] No `<cms:` tags in HTML comments
- [ ] Self-closing tags: `<cms:else />`
- [ ] No XSS vulnerabilities
- [ ] No `eval()` usage

### Code Standards
- [ ] English-only code and comments
- [ ] 4-space indentation
- [ ] Proper naming conventions
- [ ] No TypeScript `any` type

### CouchCMS Patterns
- [ ] Authentication checks present
- [ ] CSRF protection in forms
- [ ] Proper use of `<cms:embed>`
- [ ] Full Alpine.js syntax

### Styling
- [ ] daisyUI semantic colors
- [ ] No hardcoded colors
- [ ] Responsive design
- [ ] Accessibility attributes

## Output Format

```
✅ PASSED: 12 checks
⚠️  WARNINGS: 2
   - Line 45: console.log detected
   - Line 67: Missing alt text
❌ FAILED: 1
   - Line 23: CouchCMS tag in HTML comment
```

## Action Items

For each issue:
1. Line number
2. Issue description
3. Suggested fix
4. Code example
