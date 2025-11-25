---
name: Bun Agent
version: "1.0"
description: JavaScript runtime and package management helper
type: daily
---

# Bun Agent

**Quick Daily Tool**: JavaScript Runtime & Package Management
**Use For**: Fast package installation, script execution, build optimization
**Time**: 1-3 minutes

## What is Bun?

Bun is an all-in-one toolkit for JavaScript and TypeScript apps. It ships as a single executable called `bun`. At its core is the **Bun runtime**, a fast JavaScript runtime designed as **a drop-in replacement for Node.js**. It's written in Zig and powered by JavaScriptCore under the hood, dramatically reducing startup times and memory usage.

```bash
$ bun run index.tsx # TS and JSX supported out of the box
```

The `bun` command-line tool also implements a test runner, script runner, and Node.js-compatible package manager, all significantly faster than existing tools and usable in existing Node.js projects with little to no changes necessary.

## Quick Bun Commands

```bash
# Install dependencies
bun install

# Run scripts
bun run dev
bun run build
bun run test

# Add packages
bun add package-name
bun add -d package-name  # dev dependency

# Execute packages directly
bunx cowsay 'Hello, world!'

# Check Bun version
bun --version
```

## Common Bun Tasks

### 1. Package Management

**Problem**: Install and manage dependencies
**Solution**:

```bash
# Install all dependencies
bun install

# Add new packages
bun add tailwindcss @tailwindcss/vite daisyui
bun add -d typescript @types/node

# Update packages
bun update

# Remove packages
bun remove package-name
```

### 2. Script Execution

**Problem**: Run development and build scripts
**Solution**:

```bash
# Development server
bun run dev

# Production build
bun run build

# Individual builds
bun run build:css
bun run build:js

# Run tests
bun run test
```

### 3. Performance Optimization

**Problem**: Optimize Bun performance
**Solution**:

```bash
# Clear cache if needed
bun pm cache rm

# Install with production flag
bun install --production

# Use frozen lockfile for CI
bun install --frozen-lockfile
```

### 4. TypeScript Integration

**Problem**: Work with TypeScript files
**Solution**:

```bash
# Run TypeScript files directly
bun run src/index.ts

# Type check
bun run tsc --noEmit

# Build TypeScript
bun build src/index.ts --outdir ./dist
```

### 5. Process Management

**Problem**: Spawn child processes and handle communication
**Solution**:

```typescript
// Spawn child processes
const proc = Bun.spawn(["echo", "hello"]);

// Read stdout
const output = await proc.stdout.text();

// Handle IPC communication
const child = Bun.spawn(["bun", "child.ts"], {
  ipc(message) {
    console.log("Received:", message);
  },
});
```

### 6. Command Line Arguments

**Problem**: Parse command-line arguments
**Solution**:

```typescript
// Access argv
console.log(Bun.argv);

// Parse with util.parseArgs
import { parseArgs } from "util";
const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    flag1: { type: "boolean" },
    flag2: { type: "string" },
  },
});
```

### 7. File Operations

**Problem**: Fast file I/O operations
**Solution**:

```typescript
// Read files
const file = Bun.file("./package.json");
const json = await file.json();

// Write files
await Bun.write("./output.txt", "Hello World");

// Check file existence
const exists = await Bun.file("./file.txt").exists();
```

## Daily Bun Checklist

### Morning Setup (30 seconds)

- [ ] `bun install` (install dependencies)
- [ ] `bun run dev` (start development server)
- [ ] Verify live reload is working
- [ ] Check for any build errors

### Development Tasks (1-2 minutes)

- [ ] Add new packages as needed
- [ ] Run tests: `bun run test`
- [ ] Build project: `bun run build`

### Performance Check (1 minute)

- [ ] Monitor installation speed
- [ ] Check script execution time
- [ ] Verify build output
- [ ] Clear cache if needed

## Quick Fixes for Common Issues

### "Package installation failed"

```bash
# Clear cache and retry
bun pm cache rm
bun install

# Check network connection
ping registry.npmjs.org

# Use different registry if needed
bun install --registry https://registry.npmjs.org/
```

### "Script not found"

```bash
# Check package.json scripts
cat package.json | grep scripts

# Run script directly
bun run script-name

# Check if script exists
bun run --help
```

### "Build errors"

```bash
# Check TypeScript errors
bun run tsc --noEmit

# Check for missing dependencies
bun install

# Clear build cache
rm -rf dist/
bun run build
```

### "Performance issues"

```bash
# Check Bun version
bun --version

# Update Bun if needed
curl -fsSL https://bun.sh/install | bash

# Clear cache
bun pm cache rm

# Check system resources
top
```

## Package.json Configuration

### Scripts

```json
{
  "scripts": {
    "dev": "bun run scripts/dev.ts",
    "dev:hot": "bun --hot run scripts/dev.ts",
    "dev:watch": "bun --watch run scripts/dev.ts",

    "build": "bun run build:prod",
    "build:prod": "bun run build:css && bun run build:js",
    "build:css": "tailwindcss -i ./src/css/main.css -o ./public/css/main.css --minify",
    "build:js": "bun build src/js/main.ts --outfile=./public/js/main.js --minify",

    "test": "bun test"
  }
}
```

### Dependencies Management

```json
{
  "dependencies": {
    "alpinejs": "^3.13.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "trustedDependencies": ["sharp", "@swc/core"]
}
```

## Bun Configuration

### bunfig.toml

```toml
[install]
cache = true
exact = false
production = false
optional = true

[install.lockfile]
save = true
print = "yarn"

[test]
coverage = true
timeout = 30000
```

## Performance Tips

### Installation Speed

```bash
# Use production flag for faster installs
bun install --production

# Use frozen lockfile for consistent installs
bun install --frozen-lockfile

# Clear cache if corrupted
bun pm cache rm
```

### Runtime Performance

```typescript
// Use Bun's optimized APIs
const file = Bun.file("./package.json");
const json = await file.json();

// Fast file operations
const content = await Bun.file("./src/index.ts").text();

// HTTP Server
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Hello Bun!");
  },
});

// WebSocket Server
const ws = Bun.serve({
  websocket: {
    message(ws, message) {
      ws.send(message);
    },
  },
});
```

### Build Optimization

```bash
# Optimize build output
bun build src/index.ts --outdir ./dist --minify

# Use external dependencies
bun build src/index.ts --external react --external react-dom

# Advanced build options
bun build src/index.ts --outdir ./dist --minify --splitting --sourcemap external
```

### Web APIs

```typescript
// Fetch API (native)
const response = await fetch("https://api.example.com/data");
const data = await response.json();

// WebSocket (native)
const ws = new WebSocket("wss://echo.websocket.org");
ws.onopen = () => ws.send("Hello");
ws.onmessage = (event) => console.log(event.data);
```

## Success Indicators

### Healthy Bun Setup

- ✅ Fast package installation
- ✅ Quick script execution
- ✅ Successful builds
- ✅ Clean dependency tree
- ✅ Optimized performance

### Warning Signs

- ⚠️ Slow package installation
- ⚠️ Script execution errors
- ⚠️ Build failures
- ⚠️ Dependency conflicts
- ⚠️ Performance degradation

## Emergency Procedures

### Bun Not Working

```bash
# Check Bun installation
bun --version

# Reinstall Bun if needed
curl -fsSL https://bun.sh/install | bash

# Check PATH
echo $PATH
```

### Package Conflicts

```bash
# Clear everything and reinstall
rm -rf node_modules bun.lock
bun install

# Check for conflicting packages
bun list
```

### Build Failures

```bash
# Check for TypeScript errors
bun run tsc --noEmit

# Check for missing dependencies
bun install

# Clear build cache
rm -rf dist/
bun run build
```

---

**This agent helps you leverage Bun's speed and efficiency for your JavaScript/TypeScript projects.**
