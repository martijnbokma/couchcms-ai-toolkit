# Add Authentication

Add authentication checks to a template or view.

## Authentication Patterns

### Basic Authentication Check

```html
<cms:embed 'snippets/filters/authenticated.html' />
```

### Ownership Check

```html
<cms:embed 'snippets/filters/owns_project.html' />
```

### Admin Check

```html
<cms:embed 'snippets/filters/admin.html' />
```

## Usage

1. **Identify** - Determine what needs protection
2. **Select** - Choose appropriate filter
3. **Add** - Insert filter at top of protected content
4. **Test** - Verify access control works

## Common Patterns

### Protected Page

```html
<cms:embed 'snippets/filters/authenticated.html' />

<!-- Protected content here -->
```

### Owner-Only Edit

```html
<cms:embed 'snippets/filters/owns_project.html' />

<!-- Edit form here -->
```

### Admin-Only Section

```html
<cms:embed 'snippets/filters/admin.html' />

<!-- Admin content here -->
```

## Requirements

- Filter file must exist in `snippets/filters/`
- Proper error handling
- User-friendly error messages
- Redirect to login (if not authenticated)

## Steps

1. Determine protection level needed
2. Check if filter exists
3. Add filter embed at top
4. Add error handling
5. Test authentication flow
