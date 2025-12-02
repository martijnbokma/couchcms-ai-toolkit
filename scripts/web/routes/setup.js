#!/usr/bin/env bun
/**
 * Setup Routes - Browser-based setup wizard
 */

import { Hono } from 'hono'
import { html } from 'hono/html'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getToolkitRootCached } from '../../lib/paths.js'

const TOOLKIT_ROOT = getToolkitRootCached()

/**
 * Create setup routes
 * @param {string} projectDir - Project directory
 * @returns {Hono} Setup routes app
 */
export function setupRoutes(projectDir) {
    const app = new Hono()

    // Base layout template
    const layout = (title, content) => html`
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - CouchCMS AI Toolkit Setup</title>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script src="https://unpkg.com/htmx.org@2.0.0"></script>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
        }
    </style>
</head>
<body class="bg-base-100 min-h-screen">
    ${content}
</body>
</html>
    `

    // Welcome page - choose between terminal and browser setup
    app.get('/', (c) => {
        return c.html(layout('Welcome', html`
<div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">CouchCMS AI Toolkit</h1>
            <p class="py-6 text-lg">Choose your setup method</p>
            <div class="flex flex-col gap-4">
                <a href="/setup/wizard" class="btn btn-primary btn-lg">
                    🌐 Guided Browser Setup
                    <span class="badge badge-sm">Recommended</span>
                </a>
                <a href="/setup/terminal" class="btn btn-outline btn-lg">
                    💻 Terminal Setup
                    <span class="text-xs opacity-70">Quick install</span>
                </a>
            </div>
            <div class="mt-8 text-sm opacity-70">
                <p>Browser setup provides a visual, step-by-step guide</p>
                <p>Terminal setup is faster for experienced users</p>
            </div>
        </div>
    </div>
</div>
        `))
    })

    // Terminal setup info page
    app.get('/setup/terminal', (c) => {
        return c.html(layout('Terminal Setup', html`
<div class="container mx-auto px-4 py-16">
    <div class="max-w-2xl mx-auto">
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title text-2xl mb-4">Terminal Setup</h2>
                <p class="mb-6">For quick installation, use the terminal command:</p>
                <div class="mockup-code bg-base-300 mb-6">
                    <pre data-prefix="$"><code>bun ai-toolkit-shared/scripts/toolkit.js install</code></pre>
                </div>
                <div class="card-actions justify-end">
                    <a href="/" class="btn btn-outline">← Back</a>
                    <a href="/setup/wizard" class="btn btn-primary">Use Browser Setup Instead</a>
                </div>
            </div>
        </div>
    </div>
</div>
        `))
    })

    // Main wizard interface
    app.get('/setup/wizard', (c) => {
        return c.html(layout('Setup Wizard', html`
<div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
        <!-- Progress indicator -->
        <div class="steps steps-horizontal w-full mb-8">
            <div class="step step-primary" id="step-1">Project Info</div>
            <div class="step" id="step-2">Complexity</div>
            <div class="step" id="step-3">Frontend</div>
            <div class="step" id="step-4">Modules</div>
            <div class="step" id="step-5">Review</div>
        </div>

        <!-- Wizard content -->
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body" id="wizard-content">
                <div hx-get="/api/setup/step/project" hx-trigger="load" hx-swap="innerHTML">
                    <span class="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        </div>
    </div>
</div>
        `))
    })

    return app
}
