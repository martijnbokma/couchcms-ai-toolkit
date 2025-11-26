---
id: users
name: "Users"
category: "user-features"
version: "2.x"
description: "User management, access control, and authentication"
required: false
requires: [couchcms-core]
conflicts: []
---

# users




## Users and Access Control

Learn about CouchCMS user accounts, access levels, and how to implement access control in your website

### Template Access Control

```php
<cms:template title='News' clonable='1' access_level='2'>
    <!-- Editable regions and Folders are usually defined here -->
</cms:template>
```

### Element Access Control

```php
<cms:if k_user_access_level ge '4' >
    <h1>If you can see this you must at least be an Authenticated User (Special)</h1>
<cms:else />
    <cms:if k_logged_out >
        <p>
            You need to be logged in as an Authenticated User (Special) or higher to access this area
        </p>
        <p>
            Please <a href="<cms:show k_login_link />">Login</a>.
        </p>
    <cms:else />
        <p>
            You do not have sufficient privileges to access this area
        </p>
        <p>
            You need to be logged in as an Authenticated User (Special) or higher.
        </p>
        <p>
            Please <a href="<cms:show k_logout_link />">Logout</a> and login again with the right credentials.
        </p>
    </cms:if>
</cms:if>
```
