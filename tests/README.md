# Tests

Test suite for the CouchCMS AI Toolkit.

## Test Structure

```
tests/
├── lib/                          # Library module tests
│   ├── cache.test.js            # Unit tests for cache
│   ├── file-utils.test.js       # Unit tests for file utilities
│   ├── string-utils.test.js     # Unit tests for string utilities
│   └── string-utils.property.test.js  # Property-based tests
├── git-flow/                     # Git flow tests
└── README.md                     # This file
```

## Running Tests

### Run all tests
```bash
bun test
```

### Run specific test file
```bash
bun test tests/lib/cache.test.js
```

### Run tests in a directory
```bash
bun test tests/lib/
```

### Run with coverage (if configured)
```bash
bun test --coverage
```

## Test Types

### Unit Tests
Traditional unit tests that verify specific functionality with concrete examples.

**Naming:** `*.test.js`

**Example:**
```javascript
import { describe, test, expect } from 'bun:test'

describe('MyModule', () => {
    test('should do something', () => {
        expect(myFunction(input)).toBe(expectedOutput)
    })
})
```

### Property-Based Tests
Tests that verify properties hold across many randomly generated inputs using fast-check.

**Naming:** `*.property.test.js`

**Configuration:** 100 iterations per test (minimum)

**Example:**
```javascript
import { describe, test } from 'bun:test'
import * as fc from 'fast-check'

describe('MyModule - Property Tests', () => {
    test('property should hold for all inputs', () => {
        fc.assert(
            fc.property(fc.string(), (str) => {
                // Property that should always be true
                return myFunction(str).length >= 0
            }),
            { numRuns: 100 }
        )
    })
})
```

## Testing Framework

- **Test Runner:** Bun's built-in test runner
- **Property Testing:** fast-check v3.15.0+
- **Assertions:** Bun's built-in expect API

## Best Practices

1. **Test Organization:** Group related tests in describe blocks
2. **Test Names:** Use descriptive names that explain what is being tested
3. **Setup/Teardown:** Use beforeEach/afterEach for test isolation
4. **Property Tests:** Run minimum 100 iterations
5. **Coverage:** Focus on core logic and edge cases
6. **Mocking:** Avoid mocks when possible, test real functionality

## Writing New Tests

### Unit Test Template
```javascript
#!/usr/bin/env bun
import { describe, test, expect, beforeEach } from 'bun:test'
import { myFunction } from '../../scripts/lib/my-module.js'

describe('MyModule', () => {
    beforeEach(() => {
        // Setup
    })

    test('should handle normal case', () => {
        expect(myFunction('input')).toBe('output')
    })

    test('should handle edge case', () => {
        expect(myFunction('')).toBe('')
    })
})
```

### Property Test Template
```javascript
#!/usr/bin/env bun
import { describe, test } from 'bun:test'
import * as fc from 'fast-check'
import { myFunction } from '../../scripts/lib/my-module.js'

describe('MyModule - Property Tests', () => {
    test('property description', () => {
        fc.assert(
            fc.property(
                fc.string(),
                (input) => {
                    const result = myFunction(input)
                    // Assert property that should always hold
                    return result !== null
                }
            ),
            { numRuns: 100 }
        )
    })
})
```

## Continuous Integration

Tests are run automatically on:
- Pull requests
- Commits to main/develop branches
- Release workflows

See `.github/workflows/` for CI configuration.
