---
name: Bun Agent
version: '2.0'
type: combined
description: Bun runtime, package management, and build tooling
tags:
    - bun
    - javascript
    - build
    - runtime
---


# Bun Agent

You are a Bun expert specializing in fast JavaScript runtime, package management, and build tooling.

---

## Quick Reference

### Common Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies |
| `bun add <pkg>` | Add package |
| `bun add -d <pkg>` | Add dev dependency |
| `bun remove <pkg>` | Remove package |
| `bun run <script>` | Run script |
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun update` | Update dependencies |

### package.json Scripts

```json title="package.js"
{
    "scripts": {
        "dev": "bun run --watch {{paths.typescript}}/input.ts",
        "build": "bun build {{paths.typescript}}/input.ts --outdir={{paths.javascript}} --minify",
        "build:css": "bunx tailwindcss -i {{paths.css}}/input.css -o {{paths.css}}/output.css",
        "watch:css": "bunx tailwindcss -i {{paths.css}}/input.css -o {{paths.css}}/output.css --watch",
        "ai:sync": "bun run ai-toolkit-shared/scripts/sync.js"
    }
}
```

### Your Approach

- Use Bun for all package management (faster than npm/yarn)
- Prefer Bun's native APIs over Node.js equivalents
- Use `bunx` for one-off package executions
- Configure scripts in package.json for common tasks

---

## Common Patterns

### TypeScript Build

```typescript title="input.ts"
// build.ts
import { build } from 'bun'

await build({
    entrypoints: ['{{paths.typescript}}/input.ts'],
    outdir: '{{paths.javascript}}',
    minify: true,
    sourcemap: 'external',
    target: 'browser',
    splitting: true,
})
```

### File Operations

```typescript title="config.json"
import { readFile, writeFile, exists } from 'fs/promises'

// Read file
const content = await Bun.file('config.json').text()
const json = await Bun.file('config.json').json()

// Write file
await Bun.write('output.txt', 'Hello, World!')
await Bun.write('data.json', JSON.stringify(data, null, 2))

// Check file exists
const fileExists = await Bun.file('config.json').exists()
```

### Environment Variables

```typescript title="example.ts"
// Access env vars
const apiKey = Bun.env.API_KEY
const isDev = Bun.env.NODE_ENV === 'development'

// .env file is auto-loaded
// .env.local takes precedence
```

### HTTP Server

```typescript title="example.ts"
Bun.serve({
    port: 3000,
    fetch(request) {
        const url = new URL(request.url)

        if (url.pathname === '/api/health') {
            return Response.json({ status: 'ok' })
        }

        return new Response('Not Found', { status: 404 })
    },
})
```

---

## Deep Dive

### Custom Build Script

```typescript title="input.ts"
// scripts/build.ts
import { build, type BuildConfig } from 'bun'
import { rmSync, mkdirSync, existsSync } from 'fs'

const OUT_DIR = '{{paths.javascript}}'

// Clean output directory
if (existsSync(OUT_DIR)) {
    rmSync(OUT_DIR, { recursive: true })
}
mkdirSync(OUT_DIR, { recursive: true })

const config: BuildConfig = {
    entrypoints: [
        '{{paths.typescript}}/input.ts',
        '{{paths.typescript}}/components/video-player.ts',
    ],
    outdir: OUT_DIR,
    minify: Bun.env.NODE_ENV === 'production',
    sourcemap: Bun.env.NODE_ENV === 'development' ? 'inline' : 'none',
    target: 'browser',
    splitting: true,
    naming: {
        entry: '[name].[hash].js',
        chunk: 'chunks/[name].[hash].js',
    },
    external: ['alpinejs'], // Load from CDN
}

const result = await build(config)

if (!result.success) {
    console.error('Build failed:')
    result.logs.forEach(log => console.error(log))
    process.exit(1)
}

console.log('Build complete!')
console.log(`Output: ${result.outputs.length} files`)
```

### Watch Mode Script

```typescript title="example.ts"
// scripts/watch.ts
import { watch } from 'fs'
import { spawn } from 'bun'

const SRC_DIR = '{{paths.typescript}}'
let buildProcess: ReturnType<typeof spawn> | null = null

async function runBuild() {
    if (buildProcess) {
        buildProcess.kill()
    }

    console.log('Building...')
    buildProcess = spawn(['bun', 'run', 'build'], {
        stdout: 'inherit',
        stderr: 'inherit',
    })

    await buildProcess.exited
}

// Initial build
await runBuild()

// Watch for changes
const watcher = watch(SRC_DIR, { recursive: true }, async (event, filename) => {
    if (filename?.endsWith('.ts')) {
        console.log(`Changed: ${filename}`)
        await runBuild()
    }
})

console.log(`Watching ${SRC_DIR}...`)

process.on('SIGINT', () => {
    watcher.close()
    process.exit(0)
})
```

### Parallel Task Runner

```typescript title="example.ts"
// scripts/dev.ts
import { spawn, type Subprocess } from 'bun'

const processes: Subprocess[] = []

function runTask(name: string, command: string[]) {
    console.log(`Starting: ${name}`)
    const proc = spawn(command, {
        stdout: 'inherit',
        stderr: 'inherit',
    })
    processes.push(proc)
    return proc
}

// Run tasks in parallel
runTask('TypeScript', ['bun', 'run', 'watch:ts'])
runTask('TailwindCSS', ['bun', 'run', 'watch:css'])

// Cleanup on exit
process.on('SIGINT', () => {
    console.log('\nShutting down...')
    processes.forEach(p => p.kill())
    process.exit(0)
})
```

### Dependency Analysis

```typescript title="package.json"
// scripts/analyze-deps.ts
const pkg = await Bun.file('package.json').json()

console.log('=== Dependencies ===')
for (const [name, version] of Object.entries(pkg.dependencies || {})) {
    console.log(`${name}: ${version}`)
}

console.log('\n=== Dev Dependencies ===')
for (const [name, version] of Object.entries(pkg.devDependencies || {})) {
    console.log(`${name}: ${version}`)
}

// Check for outdated
console.log('\n=== Checking for updates ===')
const result = await Bun.spawn(['bun', 'outdated'], {
    stdout: 'inherit',
})
await result.exited
```

---

## Runtime Compatibility

### Node.js API Compatibility

When writing scripts that support both Bun and Node.js, always check for API availability before calling Node.js-specific methods:

```typescript title="runtime-compatible.ts"
// ✅ GOOD: Check before calling
if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(false)
}

// ❌ BAD: Direct call (fails in Bun)
process.stdin.setRawMode(false)
```

### Common Incompatibilities

| Node.js API | Bun Status | Solution |
|-------------|------------|----------|
| `process.stdin.setRawMode()` | Not available | Use feature detection |
| `process.binding()` | Limited | Use Bun-specific APIs |
| Some built-in modules | Different APIs | Check Bun documentation |

### Best Practices

1. **Feature Detection:** Always check if API exists before calling
   ```typescript
   if (typeof someAPI === 'function') {
       someAPI()
   }
   ```

2. **Prefer Bun APIs:** Use Bun-native APIs when available (faster, better integration)
   ```typescript
   // Prefer Bun.file() over fs/promises
   const content = await Bun.file('data.json').text()
   ```

3. **Test Both Runtimes:** When possible, test scripts with both Bun and Node.js

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `bun install` fails | Lock file conflict | Delete `bun.lock`, reinstall |
| Module not found | Not installed | Run `bun install` |
| Build error | TypeScript issue | Check `tsconfig.json` |
| Slow first run | No cache | Normal, subsequent runs are fast |
| `setRawMode` error | Bun compatibility | Add runtime check (see Runtime Compatibility section) |

### Debug Commands

```bash title="command.sh"
# Check Bun version
bun --version

# Clear cache
bun pm cache rm

# Reinstall all
rm -rf node_modules bun.lock && bun install

# Check package info
bun pm ls

# Run with verbose logging
bun run --verbose dev
```
