---
name: PHP Agent
version: "1.0"
type: daily
description: PHP development, CouchCMS integration, and security
tags:
  - php
  - couchcms
  - security
  - backend
---

# PHP Agent

**Quick Daily Tool**: PHP Development & CouchCMS Integration
**Use For**: Server-side logic, form processing, database operations, security
**Time**: 2-5 minutes

## Your Capabilities

1. **Write** secure PHP code with proper validation
2. **Integrate** with CouchCMS functions and templates
3. **Process** forms securely with CSRF protection
4. **Optimize** database operations

## Quick PHP Commands

```bash
# Check PHP syntax
php -l file.php

# Run PHP scripts
php script.php

# Check PHP version
php --version

# Install PHP dependencies
composer install
```

## CouchCMS Template Logic

```php
<?php
// Custom functions for CouchCMS
function get_user_content($user_name, $template, $limit = 10) {
    global $FUNCS;

    try {
        $pages = $FUNCS->get_pages(
            $template,
            array(
                'custom_field' => 'content_owner=' . $FUNCS->escape($user_name),
                'orderby' => 'publish_date',
                'order' => 'desc',
                'limit' => $limit
            )
        );

        return $pages;
    } catch (Exception $e) {
        error_log('Error fetching user content: ' . $e->getMessage());
        return array();
    }
}
?>
```

## Secure Form Processing

```php
<?php
function process_form() {
    global $FUNCS;

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        return array('success' => false, 'message' => 'Invalid request method');
    }

    // Validate CSRF token
    if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        return array('success' => false, 'message' => 'Invalid CSRF token');
    }

    // Sanitize input
    $form_data = array(
        'title' => htmlspecialchars(trim($_POST['title'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'description' => htmlspecialchars(trim($_POST['description'] ?? ''), ENT_QUOTES, 'UTF-8'),
    );

    // Validate data
    $errors = validate_form_data($form_data);
    if (!empty($errors)) {
        return array('success' => false, 'errors' => $errors);
    }

    return array('success' => true, 'data' => $form_data);
}
?>
```

## Security Functions

```php
<?php
// Input sanitization
function sanitize_input($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Validation
function validate_form_data($data) {
    $errors = array();

    if (empty($data['title']) || strlen($data['title']) < 3) {
        $errors['title'] = 'Title must be at least 3 characters long';
    }

    if (empty($data['description']) || strlen($data['description']) < 10) {
        $errors['description'] = 'Description must be at least 10 characters long';
    }

    return $errors;
}

// CSRF token generation
function generate_csrf_token() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}
?>
```

## Secure Database Operations

```php
<?php
class ContentManager {
    private $db;

    public function __construct() {
        global $FUNCS;
        $this->db = $FUNCS->get_db();
    }

    public function get_by_user($user_name, $template, $limit = 20) {
        try {
            $sql = "SELECT * FROM couch_pages
                    WHERE template = ?
                    AND content_owner = ?
                    AND is_published = 1
                    ORDER BY publish_date DESC
                    LIMIT ?";

            $stmt = $this->db->prepare($sql);
            $stmt->bind_param('ssi', $template, $user_name, $limit);
            $stmt->execute();

            return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e) {
            error_log('Database error: ' . $e->getMessage());
            return array();
        }
    }
}
?>
```

## Quick Fixes

### "PHP syntax error"

```bash
# Check syntax
php -l file.php

# Common fixes:
# - Missing semicolons
# - Unclosed brackets
# - Incorrect variable syntax
```

### "Database connection failed"

```php
<?php
try {
    $pdo = new PDO($dsn, $username, $password);
    echo "Database connected successfully";
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
}
?>
```

### "Form submission not working"

```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log('Form submitted: ' . print_r($_POST, true));

    $required_fields = ['title', 'description'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            error_log("Missing required field: $field");
        }
    }
}
?>
```

## Success Indicators

- ✅ No syntax errors
- ✅ Proper error handling
- ✅ Secure input validation
- ✅ Optimized database queries
- ✅ Clean, readable code

## Warning Signs

- ⚠️ PHP errors in logs
- ⚠️ Slow database queries
- ⚠️ Security vulnerabilities
- ⚠️ Poor error handling
- ⚠️ Code duplication
