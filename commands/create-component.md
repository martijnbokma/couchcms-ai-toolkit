# Create Component

Create a new CouchCMS component with proper structure.

## Component Structure

Create a component bundle in `{{paths.components}}/`:

1. **Component file**: `{{paths.components}}/{name}.html`
2. **Optional CSS**: `{{paths.css}}/components/{name}.css`
3. **Optional TypeScript**: `{{paths.typescript}}/components/{name}.ts`

## Template

```html
<!-- {{paths.components}}/{name}.html -->
<cms:embed '{{paths.layouts}}/base.html' />

<cms:block 'content'>
    <div class="component-{name}">
        <!-- Component content -->
    </div>
</cms:block>
```

## Requirements

- Component name (kebab-case)
- Description of component purpose
- Required props/parameters
- Optional: Alpine.js state
- Optional: TypeScript types

## Steps

1. Create component HTML file
2. Add component structure with semantic HTML
3. Apply daisyUI classes for styling
4. Add Alpine.js if interactive
5. Create TypeScript types if needed
6. Add to component index (if exists)

## Example

**Input**: `/create-component card`

**Output**: Creates `{{paths.components}}/card.html` with:
- Card structure using daisyUI `card` classes
- Proper semantic HTML
- Optional Alpine.js integration
- TypeScript types if requested
