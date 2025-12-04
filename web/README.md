# Browser Setup Interface

Browser-based setup wizard for the CouchCMS AI Toolkit.

## Overview

This web interface provides a visual, step-by-step setup wizard for users who prefer a graphical interface over the terminal. It uses:

- **Hono** - Lightweight web framework
- **HTMX** - Progressive enhancement (no heavy JS frameworks)
- **daisyUI** - Component library for TailwindCSS
- **Bun** - Runtime (already used by the toolkit)

## Usage

Start the web server:

```bash
bun toolkit serve
```

Or specify a port:

```bash
bun toolkit serve --port 3000
```

Then open your browser to `http://localhost:3000`

## Development

### Live Reload Development Server

For the best development experience, use the dev script that combines watch mode, server, and automatic browser refresh:

```bash
# Start development server with live reload
bun run dev:web

# Or specify a custom port
PORT=3001 bun run dev:web
```

This will:
- ✅ Watch for file changes and automatically rebuild assets
- ✅ Start the web server
- ✅ **Automatically refresh your browser** when files change
- ✅ Use smart reloading (CSS-only changes don't require full page reload)

### Watch Mode (Standalone)

For development, use the watch script to automatically rebuild assets when files change:

```bash
# Watch JavaScript and CSS files (auto-rebuilds on changes)
bun run watch:web

# Also watch server files and templates
bun run watch:web:server
```

The watch script monitors:
- **JavaScript files** (`web/assets/js/`) - Automatically rebuilds bundles and triggers browser reload
- **CSS files** (`web/assets/css/`) - Automatically rebuilds Tailwind CSS and reloads stylesheets
- **Templates** (`web/templates/`) - Triggers browser reload (Nunjucks auto-reloads templates)
- **Server files** (`web/server/`) - Shows notifications (manual restart required)

### How Live Reload Works

1. **WebSocket Connection**: The browser connects to `/_live-reload` endpoint
2. **File Watching**: Watch script monitors source files
3. **Build & Notify**: When files change, assets are rebuilt and the server broadcasts a reload signal
4. **Smart Reloading**:
   - CSS changes → Reload stylesheets without page refresh
   - JS/HTML changes → Full page reload

### Building Assets

Build assets manually:

```bash
# Build assets
bun run build:web

# Clean and rebuild
bun run build:web:fresh

# Clean build artifacts
bun run clean:web
```

## Architecture

```
scripts/web/
  server.js          # Main server setup
  routes/
    setup.js        # Setup wizard routes
    api.js          # API endpoints
  static/           # Static assets (if needed)
```

## Features

- **Step-by-step wizard** - Guided setup process
- **Visual configuration** - See all options clearly
- **Progress indicator** - Know where you are in the process
- **Validation** - Real-time validation of inputs
- **Review step** - Confirm before generating

## Routes

- `/` - Welcome page (choose terminal or browser)
- `/setup/wizard` - Main wizard interface
- `/api/setup/step/*` - Wizard step endpoints
- `/api/setup/generate` - Generate configuration
- `/health` - Health check endpoint

## Integration

The web interface reuses the same setup logic as the terminal version:
- `setup-flow.js` - Setup flow logic
- `config-generator.js` - Configuration generation
- `option-organizer.js` - Module/agent organization

This ensures consistency between terminal and browser interfaces.
