# Toolkit Optimization Best Practices

**Critical: Always follow project standards before generating any code.**

## Purpose

This guide provides best practices for optimizing the CouchCMS AI Toolkit itself. Use this when you want to improve performance, reduce complexity, or enhance maintainability of toolkit components.

## Optimization Targets

### 1. Script Performance

#### Synchronous I/O to Async

**Problem**: Blocking file operations slow down scripts

**Before**:
```javascript
const content = readFileSync(file, 'utf8')
writeFileSync(output, content)
```

**After**:
```javascript
const content = await readFile(content, 'utf8')
await writeFile(output, content)
```

**Benefits**: Non-blocking, better for large file operations

#### Parallel Processing

**Problem**: Sequential operations when parallel is possible

**Before**:
```javascript
for (const file of files) {
    await processFile(file)
}
```

**After**:
```javascript
await Promise.all(files.map(file => processFile(file)))
```

**Benefits**: Faster execution for independent operations

#### Caching

**Problem**: Repeated expensive operations

**Example**: Cache config file reads

```javascript
const configCache = new Map()

function getCachedConfig(file) {
    if (configCache.has(file)) {
        return configCache.get(file)
    }

    const config = loadConfig(file)
    configCache.set(file, config)
    return config
}
```

### 2. Configuration Optimization

#### Lazy Loading

**Problem**: Loading all configs at startup

**Before**:
```javascript
const defaults = loadDefaults()
const project = loadProject()
const merged = mergeConfigs(defaults, project)
```

**After**:
```javascript
function getConfig() {
    if (!configCache) {
        const defaults = loadDefaults()
        const project = loadProject()
        configCache = mergeConfigs(defaults, project)
    }
    return configCache
}
```

#### Validation Early

**Problem**: Invalid configs discovered late

**Solution**: Validate immediately on load

```javascript
function loadAndValidateConfig(file) {
    const config = loadConfig(file)
    const validation = validateConfig(config)

    if (!validation.valid) {
        throw new ToolkitError(`Invalid config: ${validation.errors.join(', ')}`)
    }

    return config
}
```

### 3. File System Optimization

#### Batch Operations

**Problem**: Many individual file operations

**Before**:
```javascript
for (const file of files) {
    readFileSync(file)
    processFile(file)
    writeFileSync(output)
}
```

**After**:
```javascript
const contents = await Promise.all(files.map(file => readFile(file)))
const processed = contents.map(processFile)
await Promise.all(processed.map((content, i) => writeFile(outputs[i], content)))
```

#### Directory Traversal Optimization

**Problem**: Recursive directory scanning is slow

**Solution**: Use efficient traversal patterns

```javascript
import { glob } from 'glob'

// Fast glob-based pattern matching
const files = await glob('**/*.md', { cwd: toolkitRoot })
```

### 4. Memory Optimization

#### Streaming Large Files

**Problem**: Loading entire files into memory

**Before**:
```javascript
const content = readFileSync(largeFile, 'utf8')
process(content)
```

**After**:
```javascript
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'

await pipeline(
    createReadStream(largeFile),
    transformStream,
    writeStream
)
```

#### Garbage Collection Awareness

**Problem**: Keeping large objects in memory unnecessarily

**Solution**: Clear references when done

```javascript
function processLargeDataset(data) {
    // Process data
    const result = transform(data)

    // Clear reference when done
    data = null

    return result
}
```

### 5. Path Resolution Optimization

#### Resolve Once, Use Many Times

**Problem**: Resolving paths repeatedly

**Before**:
```javascript
function generatePath(base, file) {
    return resolve(projectRoot, base, file)  // Resolved every time
}
```

**After**:
```javascript
const resolvedPaths = new Map()

function getResolvedPath(base, file) {
    const key = `${base}:${file}`
    if (!resolvedPaths.has(key)) {
        resolvedPaths.set(key, resolve(projectRoot, base, file))
    }
    return resolvedPaths.get(key)
}
```

### 6. Template Processing Optimization

#### Pre-compile Templates

**Problem**: Compiling Handlebars templates repeatedly

**Before**:
```javascript
function renderTemplate(template, data) {
    const compiled = Handlebars.compile(template)
    return compiled(data)
}
```

**After**:
```javascript
const templateCache = new Map()

function renderTemplate(template, data) {
    if (!templateCache.has(template)) {
        templateCache.set(template, Handlebars.compile(template))
    }
    const compiled = templateCache.get(template)
    return compiled(data)
}
```

#### Batch Variable Replacement

**Problem**: Multiple regex replacements

**Before**:
```javascript
let result = content
for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
}
```

**After**:
```javascript
// Single pass with compiled regex
const pattern = /\{\{(\w+)\}\}/g
const result = content.replace(pattern, (match, key) => vars[key] || match)
```

### 7. Module System Optimization

#### Lazy Module Loading

**Problem**: Loading all modules at startup

**Before**:
```javascript
const modules = loadAllModules()  // Loads everything
```

**After**:
```javascript
const moduleCache = new Map()

function getModule(name) {
    if (!moduleCache.has(name)) {
        moduleCache.set(name, loadModule(name))
    }
    return moduleCache.get(name)
}
```

#### Module Dependency Caching

**Problem**: Recalculating dependencies

**Solution**: Cache dependency graph

```javascript
const dependencyGraph = new Map()

function getModuleDependencies(name) {
    if (!dependencyGraph.has(name)) {
        const module = getModule(name)
        dependencyGraph.set(name, extractDependencies(module))
    }
    return dependencyGraph.get(name)
}
```

### 8. Validation Optimization

#### Incremental Validation

**Problem**: Validating entire project when only one file changed

**Solution**: Track changes and validate incrementally

```javascript
function validateChanged(changedFiles) {
    // Only validate affected files
    const affected = getAffectedFiles(changedFiles)
    return validateFiles(affected)
}
```

#### Schema Caching

**Problem**: Re-parsing JSON schemas

**Solution**: Cache compiled schemas

```javascript
const schemaCache = new Map()

function validateWithSchema(data, schemaPath) {
    if (!schemaCache.has(schemaPath)) {
        const schema = JSON.parse(readFileSync(schemaPath))
        schemaCache.set(schemaPath, compileSchema(schema))
    }
    const validator = schemaCache.get(schemaPath)
    return validator(data)
}
```

## Performance Measurement

### Benchmarking Scripts

```javascript
async function benchmark(name, fn) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    console.log(`${name}: ${(end - start).toFixed(2)}ms`)
}

await benchmark('sync script', async () => {
    await runSync()
})
```

### Memory Profiling

```javascript
function getMemoryUsage() {
    const usage = process.memoryUsage()
    return {
        rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    }
}
```

## Optimization Checklist

When optimizing toolkit components:

- [ ] **Measure First**: Profile before optimizing
- [ ] **Identify Bottlenecks**: Find actual performance issues
- [ ] **Optimize Incrementally**: One optimization at a time
- [ ] **Verify Results**: Measure improvement after each change
- [ ] **Maintain Readability**: Don't sacrifice clarity for speed
- [ ] **Document Changes**: Explain optimization rationale
- [ ] **Test Thoroughly**: Ensure optimizations don't break functionality
- [ ] **Consider Alternatives**: Sometimes architecture change > optimization

## Common Optimization Patterns

### Pattern 1: Memoization

```javascript
const memoize = (fn) => {
    const cache = new Map()
    return (...args) => {
        const key = JSON.stringify(args)
        if (cache.has(key)) return cache.get(key)
        const result = fn(...args)
        cache.set(key, result)
        return result
    }
}
```

### Pattern 2: Debouncing

```javascript
function debounce(fn, delay) {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn(...args), delay)
    }
}
```

### Pattern 3: Worker Threads (for heavy computation)

```javascript
import { Worker } from 'worker_threads'

function runInWorker(script, data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(script, { workerData: data })
        worker.on('message', resolve)
        worker.on('error', reject)
    })
}
```

## When NOT to Optimize

⚠️ **Don't optimize prematurely**:

- Before identifying actual bottlenecks
- When code is already fast enough
- If it reduces code clarity significantly
- If it adds unnecessary complexity
- Before profiling shows real issues

## Success Criteria

✅ Performance improved (measured)
✅ Memory usage acceptable
✅ Code remains maintainable
✅ Functionality unchanged
✅ Tests still pass
✅ Documentation updated

---

**Remember**: Optimize based on data, not assumptions. Measure, optimize, measure again.
