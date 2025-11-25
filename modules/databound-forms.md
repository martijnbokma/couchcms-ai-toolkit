---
id: databound-forms
name: "DataBound Forms"
version: "2.x"
description: "CouchCMS DataBound Forms implementation patterns"
required: false
requires: [couchcms-core]
conflicts: []
---

# DataBound Forms Standards

## Basic Structure

```html
<cms:form 
    masterpage='items.php' 
    mode='create'
    enctype='multipart/form-data'
    method='post'
    anchor='0'>
    
    <cms:if k_success>
        <cms:redirect k_redirect_link />
    </cms:if>
    
    <cms:if k_error>
        <div class="alert alert-error">
            <cms:each k_error>
                <cms:show item /><br/>
            </cms:each>
        </div>
    </cms:if>
    
    <cms:input name='title' type='bound' />
    <cms:input name='content' type='bound' />
    
    <button type="submit" class="btn btn-primary">Submit</button>
</cms:form>
```

## Form Modes

### Create Mode
```html
<cms:form masterpage='items.php' mode='create'>
```

### Edit Mode
```html
<cms:form masterpage='items.php' mode='edit' page_id=item_id>
```

## Input Types

### Text Input
```html
<cms:input name='title' type='bound' class='input input-bordered w-full' />
```

### Textarea
```html
<cms:input name='description' type='bound' class='textarea textarea-bordered w-full' />
```

### File Upload
```html
<cms:input name='image' type='bound' class='file-input file-input-bordered' />
```

### Dropdown
```html
<cms:input name='category' type='bound' class='select select-bordered w-full' />
```

### Checkbox
```html
<cms:input name='is_published' type='bound' class='checkbox' />
```

### Relation Field
```html
<cms:input name='related_items' type='bound' class='select select-bordered w-full' />
```

## Validation

### Built-in Validators
```html
<cms:input 
    name='email' 
    type='bound' 
    validator='email' 
    required='1' />

<cms:input 
    name='password' 
    type='bound' 
    validator='min_len=8' 
    required='1' />
```

### Custom Validation
```html
<cms:if k_submitted>
    <cms:validate 
        field='custom_field' 
        validator='my_validator' 
        msg='Custom error message' />
</cms:if>
```

## File Handling

### Image Upload with Preview
```html
<div x-data="{ preview: '<cms:show image />' }">
    <cms:input 
        name='image' 
        type='bound' 
        @change="preview = URL.createObjectURL($event.target.files[0])" />
    
    <img x-bind:src="preview" x-show="preview" class="mt-4 max-h-48" />
</div>
```

### Multiple Files
```html
<cms:input name='gallery' type='bound' />
```

## Security

### CSRF Protection
DataBound Forms include CSRF protection by default. The token is automatically included.

### Ownership Validation
```html
<cms:if "<cms:not_empty k_user_id />">
    <cms:if "<cms:is_equal k_page_owner k_user_id />">
        <!-- User owns this content -->
        <cms:form mode='edit' page_id=k_page_id>
            ...
        </cms:form>
    </cms:if>
</cms:if>
```

## Success Handling

### Redirect After Success
```html
<cms:if k_success>
    <cms:redirect "<cms:link masterpage='items.php' />" />
</cms:if>
```

### Show Success Message
```html
<cms:if k_success>
    <div class="alert alert-success">
        Item saved successfully!
    </div>
</cms:if>
```

### Set Page Data on Success
```html
<cms:if k_success>
    <cms:db_persist_form
        _invalidate_cache='1'
        _auto_title='1' />
    <cms:redirect k_redirect_link />
</cms:if>
```

## Complete Example

```html
<cms:embed 'filters/authenticated.html' />

<cms:form 
    masterpage='projects.php' 
    mode='create'
    enctype='multipart/form-data'
    anchor='0'>
    
    <cms:if k_success>
        <cms:db_persist_form 
            content_owner=k_user_id
            _invalidate_cache='1' />
        <cms:redirect "<cms:link masterpage='projects.php' />" />
    </cms:if>
    
    <cms:if k_error>
        <div class="alert alert-error mb-4">
            <cms:each k_error>
                <p><cms:show item /></p>
            </cms:each>
        </div>
    </cms:if>
    
    <div class="form-control mb-4">
        <label class="label">
            <span class="label-text">Title</span>
        </label>
        <cms:input name='title' type='bound' required='1'
            class='input input-bordered w-full' />
    </div>
    
    <div class="form-control mb-4">
        <label class="label">
            <span class="label-text">Description</span>
        </label>
        <cms:input name='description' type='bound'
            class='textarea textarea-bordered w-full' />
    </div>
    
    <div class="form-control mb-4">
        <label class="label">
            <span class="label-text">Cover Image</span>
        </label>
        <cms:input name='cover_image' type='bound'
            class='file-input file-input-bordered w-full' />
    </div>
    
    <button type="submit" class="btn btn-primary">
        Create Project
    </button>
</cms:form>
```

## Best Practices

### DO
- Always include CSRF protection (automatic with DataBound Forms)
- Validate ownership before allowing edits
- Use proper error handling and display
- Redirect after successful submission
- Use bound inputs for all form fields

### DON'T
- Allow unauthenticated form submissions for protected content
- Skip validation on file uploads
- Forget to handle errors gracefully
- Use inline form handling for complex logic
