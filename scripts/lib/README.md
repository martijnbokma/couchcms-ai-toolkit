# Scripts Library

This directory contains modular, reusable components for the CouchCMS AI Toolkit scripts.

## Modules

### `cache.js`
Module caching system for improved performance.

**Exports:**
- `ModuleCache` - In-memory cache with statistics tracking

**Usage:**
```javascript
import { ModuleCache } from './lib/cache.js'

const cache = new ModuleCache()
cache.set('key', value)
const value = cache.get('key')
const stats = cache.getStats() // { hits, misses, total, hitRate }
```

### `errors.js`
Centralized error handling with custom error types.

**Exports:**
- `ToolkitError` - Base error class
- `ConfigError` - Configuration errors
- `ModuleError` - Module loading errors
- `TemplateError` - Template rendering errors
- `FileSystemError` - File system errors
- `handleError(error, context)` - Consistent error display
- `formatValidationErrors(errors)` - Format validation error arrays

**Usage:**
```javascript
import { ConfigError, handleError } from './lib/errors.js'

try {
    throw new ConfigError('Invalid configuration')
} catch (error) {
    handleError(error, 'Config Loading')
}
```

### `file-utils.js`
Common file system operations with error handling.

**Exports:**
- `ensureDir(dirPath)` - Create directory if needed
- `readFileSafe(filePath)` - Read file with error handling
- `writeFileSafe(filePath, content)` - Write file with error handling
- `hasChanged(filePath, newContent)` - Check if file content changed
- `findFileUp(fileName, startDir)` - Find file in parent directories
- `resolvePath(path, projectDir)` - Resolve relative/absolute paths

**Usage:**
```javascript
import { writeFileSafe, hasChanged } from './lib/file-utils.js'

if (hasChanged(filePath, newContent)) {
    writeFileSafe(filePath, newContent)
}
```

### `string-utils.js`
String manipulation and formatting utilities.

**Exports:**
- `replaceVariables(content, variables)` - Replace {{variable}} placeholders
- `toKebabCase(str)` - Convert to kebab-case
- `toCamelCase(str)` - Convert to camelCase
- `toPascalCase(str)` - Convert to PascalCase
- `truncate(str, maxLength)` - Truncate with ellipsis
- `pluralize(count, singular, plural)` - Pluralize words

**Usage:**
```javascript
import { replaceVariables, toKebabCase } from './lib/string-utils.js'

const content = replaceVariables('Hello {{name}}', { name: 'World' })
const slug = toKebabCase('My Module Name') // 'my-module-name'
```

### `logger.js`
Consistent logging with levels and formatting.

**Exports:**
- `LogLevel` - Log level constants (DEBUG, INFO, WARN, ERROR)
- `setLogLevel(level)` - Set current log level
- `debug(...args)` - Debug logging
- `info(...args)` - Info logging
- `success(...args)` - Success logging
- `warn(...args)` - Warning logging
- `error(...args)` - Error logging
- `progress(message)` - Progress indicator
- `section(title)` - Section header

**Usage:**
```javascript
import { success, warn, progress } from './lib/logger.js'

progress('Loading modules...')
success('Modules loaded!')
warn('Deprecated feature used')
```

### `index.js`
Central export point for all library modules. Import everything from here:

```javascript
import {
    ModuleCache,
    ConfigError,
    handleError,
    writeFileSafe,
    replaceVariables,
    success
} from './lib/index.js'
```

## Testing

All library modules have corresponding test files in `tests/lib/`:

```bash
bun test tests/lib/
```

## Design Principles

1. **Single Responsibility** - Each module has one clear purpose
2. **Error Handling** - All functions handle errors gracefully
3. **Type Safety** - JSDoc comments for better IDE support
4. **Testability** - Pure functions where possible, easy to test
5. **Reusability** - Generic utilities usable across all scripts
