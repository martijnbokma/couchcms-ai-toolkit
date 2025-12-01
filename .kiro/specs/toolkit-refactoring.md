# Toolkit Refactoring & Optimization

Complete guide for refactoring and optimizing the CouchCMS AI Toolkit itself.

## Overview

The toolkit now includes specialized prompts and commands for refactoring and optimizing toolkit components. This allows you to improve the toolkit using the toolkit itself.

## Available Resources

### 1. Toolkit Refactoring Specialist

**Location**: `prompts/refactoring/toolkit.md`

**Purpose**: Comprehensive refactoring of toolkit components

**Handles**:
- Scripts (`scripts/*.js`)
- Configuration files (`*.yaml`, `defaults.yaml`)
- Prompts (`prompts/**/*.md`)
- Modules (`modules/*.md`)
- Agents (`agents/*.md`)
- Rules (`rules/*.mdc`)
- Commands (`commands/*.md`)

**Usage**:
```text
Refactor @scripts/sync.js using @prompts/refactoring/toolkit.md
```text

### 2. Toolkit Optimization Guide

**Location**: `prompts/best-practices/toolkit-optimization.md`

**Purpose**: Performance optimization strategies for toolkit components

**Covers**:
- Script performance (async I/O, parallel processing, caching)
- Configuration optimization (lazy loading, early validation)
- File system optimization (batch operations, efficient traversal)
- Memory optimization (streaming, garbage collection)
- Template processing optimization
- Module system optimization

**Usage**:
```text
Optimize @scripts/sync.js using @prompts/best-practices/toolkit-optimization.md
```

### 3. Refactor Toolkit Command

**Location**: `commands/refactor-toolkit.md`

**Purpose**: Quick access command for toolkit refactoring

**Usage**:
```text
/refactor-toolkit @scripts/sync.js
/refactor-toolkit @prompts/refactoring/router.md
```text

## Integration with Refactor Router

The refactor router (`prompts/refactoring/router.md`) automatically detects toolkit refactoring requests:

- **File paths**: Files in `scripts/`, `prompts/`, `modules/`, `agents/`, `rules/`, `commands/`
- **Keywords**: "refactor toolkit", "optimize sync script", etc.
- **Content**: Path variables (`{{paths.xxx}}`), Handlebars templates, toolkit patterns

The router will automatically select the toolkit refactoring specialist when appropriate.

## Refactoring Workflow

### Step 1: Identify Component

Select the toolkit component to refactor:
- Script file
- Configuration file
- Prompt file
- Module file
- Agent file
- Rule file
- Command file

### Step 2: Load Specialist

Use the refactor router or load directly:

**Via Router**:
```text
Refactor @scripts/sync.js
```

**Direct Load**:
```text
@prompts/refactoring/toolkit.md Refactor @scripts/sync.js
```javascript

### Step 3: Analysis

The specialist will:
1. Read and analyze the component
2. 📝 Understand dependencies
3. 📝 Identify refactoring opportunities
4. ⚙️ Create a refactoring plan

### Step 4: Execute

The specialist will:
1. Apply changes incrementally
2. 📝 Update dependencies
3. 📝 Maintain consistency
4. ✅ Verify functionality

### Step 5: Document

The specialist will:
1. Update CHANGELOG.md
2. 📝 Update documentation
3. 📝 Update examples
4. 📝 Document breaking changes (if any)

## Optimization Workflow

### Step 1: Profile First

Measure performance before optimizing:
```javascript
async function benchmark(name, fn) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    console.log(`${name}: ${(end - start).toFixed(2)}ms`)
}
```

### Step 2: Identify Bottlenecks

Use profiling to find actual performance issues:
- Slow file I/O operations
- Memory leaks
- Inefficient algorithms
- Unnecessary repeated operations

### Step 3: Apply Optimizations

Follow the toolkit optimization guide patterns:
- Async I/O for file operations
- Caching for repeated operations
- Parallel processing for independent tasks
- Lazy loading for large configs

### Step 4: Verify Results

Measure improvement after each optimization:
- Performance improvement (measured)
- Memory usage (acceptable)
- Functionality (unchanged)

## Common Refactoring Patterns

### Pattern 1: Extract Shared Utilities

**Problem**: Multiple scripts use similar logic

**Solution**: Extract to `utils.js`

```javascript
// Extract to utils.js
export function findConfigFile(projectRoot) {
    // ... implementation
}

// Use in multiple scripts
import { findConfigFile } from './utils.js'
```text

### Pattern 2: Standardize Configuration Loading

**Problem**: Multiple scripts load configuration differently

**Solution**: Centralized config loader

```javascript
// Standardized config loader in utils.js
export function loadProjectConfig(projectRoot) {
    // ... implementation
}
```

### Pattern 3: Consistent Error Handling

**Problem**: Error handling differs across scripts

**Solution**: Standardized error handling

```javascript
export class ToolkitError extends Error {
    constructor(message, code, cause) {
        super(message)
        this.code = code
        this.cause = cause
        this.name = 'ToolkitError'
    }
}
```text

## Checklist

Before completing refactoring:

- [ ] All related files have been updated
- [ ] Dependencies have been verified
- [ ] `bun scripts/sync.js` runs without errors
- [ ] `bun scripts/validate.js` passes
- [ ] CHANGELOG.md has been updated
- [ ] Documentation has been updated
- [ ] Examples still work
- [ ] Cross-references are correct
- [ ] Breaking changes are documented
- [ ] Migration steps are documented (if needed)
- [ ] Code follows toolkit conventions
- [ ] Consistent patterns are maintained

## Examples

### Example 1: Refactor Script

**Request**:
```text
Refactor @scripts/sync.js - Extract configuration loading into separate functions
```

**Result**:
- Configuration loading extracted to separate functions
- Better error handling
- Improved testability
- CHANGELOG.md updated

### Example 2: Optimize Prompt

**Request**:
```text
Optimize @prompts/refactoring/router.md - Improve router logic and error handling
```yaml

**Result**:
- Improved router logic
- Better error handling
- Clearer structure
- Updated examples

### Example 3: Refactor Module

**Request**:
```text
Refactor @modules/typescript.md - Standardize module structure and add examples
```

**Result**:
- Standardized structure
- Added examples
- Updated cross-references
- Improved documentation

## Recent Refactorings

### November 2025 - sync.js & validate.js Refactoring

**Completed**: Major refactoring of core toolkit scripts following the 10-step workflow from `prompts/refactoring/toolkit.md`.

**Changes**:

1. **sync.js** - Extracted functions for better modularity:
   - `loadProjectConfiguration()` - Config discovery and parsing
   - `loadToolkitResources()` - Module/agent/framework loading
   - `generateAllConfigurations()` - Configuration generation orchestration
   - `getTemplateMap()`, `renderTemplate()`, `writeConfigFile()` - Template utilities
   - ~~`generateTabnineSettings()`, `generateCodeWhispererReadme()`~~ - Tool-specific generators (removed - editors no longer supported)
   - Main `sync()` function reduced from ~166 lines to ~34 lines (orchestrator pattern)

2. **validate.js** - Eliminated code duplication:
   - Removed duplicate `findProjectFile()` and `resolveToolkitPath()` functions
   - Now imports shared utilities from `utils.js`
   - Fixed missing `join` import

3. **utils.js** - Enhanced with shared utilities:
   - Added `findProjectFile()` - Config file discovery
   - Added `resolveToolkitPath()` - Path resolution with tilde expansion
   - Added `replaceVariables()` - Recursive variable replacement

4. **Configuration files** - Enhanced documentation:
   - `defaults.yaml` - Added schema documentation
   - `smart-defaults.yaml` - Comprehensive schema docs
   - `preflight-checks.yaml` - Severity levels and check structure documented

**Results**:
- ✅ All scripts execute successfully
- ✅ 100% validation compliance score
- ✅ No breaking changes (backward compatible)
- ✅ Improved maintainability and code organization
- ✅ Reduced code duplication across scripts

**See**: [CHANGELOG.md](../CHANGELOG.md) for complete details.

## Best Practices

1. **Always measure first**: Profile before optimizing
2. 📝 **Refactor incrementally**: One logical change at a time
3. 📝 **Maintain consistency**: Follow toolkit conventions
4. 📝 **Update documentation**: Keep docs in sync with code
5. ✅ **Verify functionality**: Test after each change
6. 📝 **Document breaking changes**: Update CHANGELOG.md
7. 📝 **Preserve backward compatibility**: When possible

## Related Documentation

- [Refactoring Prompts](../prompts/refactoring/README.md)
- [Best Practices Prompts](../prompts/best-practices/)
- [Commands](../commands/README.md)
- [Refactor Router](../prompts/refactoring/router.md)

---

**Remember**: When refactoring the toolkit, you're improving the tool that improves other projects. Maintain high standards, consistency, and backward compatibility where possible.
