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
