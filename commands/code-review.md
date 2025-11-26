# Code Review

Perform a comprehensive code review of the selected files.

## Review Checklist

### Security
- [ ] No XSS vulnerabilities (no `innerHTML` with user input)
- [ ] CSRF protection in forms
- [ ] Authentication checks for protected content
- [ ] Input validation and sanitization
- [ ] No `<cms:` tags in HTML comments (use `[cms:` instead)

### CouchCMS Patterns
- [ ] Uses `<cms:embed>` for shared components
- [ ] Proper use of authentication filters
- [ ] Ownership validation for edit/delete operations
- [ ] Self-closing tags: `<cms:else />` not `<cms:else></cms:else>`
- [ ] Full Alpine.js syntax: `x-on:click` not `@click`

### Code Quality
- [ ] Follows project naming conventions
- [ ] Proper indentation (4 spaces)
- [ ] English-only code and comments
- [ ] No hardcoded values (use configuration)
- [ ] Error handling implemented

### Styling
- [ ] Uses daisyUI semantic colors (`bg-base-100`, not `bg-white`)
- [ ] Mobile-first responsive design
- [ ] Accessibility attributes (ARIA labels, alt text)
- [ ] Theme-aware colors

### Performance
- [ ] No unnecessary database queries
- [ ] Efficient pagination
- [ ] Lazy loading for images
- [ ] Minimal JavaScript bundle size

## Action Items

After review, provide:
1. List of issues found (with line numbers)
2. Priority level (Critical, High, Medium, Low)
3. Suggested fixes
4. Code examples for fixes
