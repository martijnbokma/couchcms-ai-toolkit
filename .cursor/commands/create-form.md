# Create Form

Create a new CouchCMS DataBound Form with validation and security.

## Form Structure

Create form in `snippets/forms/{name}.html`:

```html
<cms:form name='{name}' method='post' enctype='multipart/form-data'>
    <cms:if k_success>
        <!-- Success message -->
    </cms:if>

    <cms:if k_error>
        <!-- Error messages -->
    </cms:if>

    <!-- Form fields -->
    <cms:input name='field_name' type='text' required='1' />

    <button type='submit' class='btn btn-primary'>Submit</button>
</cms:form>
```

## Requirements

- Form name (kebab-case)
- Form purpose/description
- Required fields
- Validation rules
- Success/error handling

## Security

- [ ] CSRF protection (automatic with `<cms:form>`)
- [ ] Input validation
- [ ] Output sanitization
- [ ] File upload limits (if applicable)
- [ ] Authentication check (if needed)

## Styling

- Use daisyUI form classes
- Responsive layout
- Error message styling
- Loading states

## Steps

1. Create form file
2. Add form structure
3. Add validation
4. Add success/error handling
5. Style with daisyUI
6. Add authentication if needed
