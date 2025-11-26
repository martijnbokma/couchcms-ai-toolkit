# Create View

Create a new CouchCMS view (list, detail, or full CRUD).

## View Types

- **List View** - Display multiple items
- **Detail View** - Single item display
- **Edit View** - Edit form
- **Create View** - Create form
- **Full CRUD** - All views together

## View Structure

Create views in `{{paths.views}}/{name}/`:

```
{{paths.views}}/{name}/
├── list.html      # List view
├── detail.html    # Detail view
├── edit.html      # Edit view (optional)
└── create.html    # Create view (optional)
```

## Requirements

- View name (kebab-case)
- View type (list, detail, or crud)
- Template to use
- Fields to display
- Pagination (if list)
- Authentication (if needed)

## List View Template

```html
<cms:pages masterpage='{template}.php' limit='10'>
    <div class="view-item">
        <!-- Item content -->
    </div>
    <cms:paginator />
</cms:pages>
```

## Detail View Template

```html
<cms:show k_page_title />
<cms:show k_page_content />
<!-- Additional fields -->
```

## Steps

1. Determine view type
2. Create view directory
3. Create view files
4. Add pagination (if list)
5. Add authentication (if needed)
6. Style with daisyUI
7. Add routing (if custom routes)
