#!/usr/bin/env bun
/**
 * API Routes - Setup wizard API endpoints
 */

import { Hono } from 'hono'
import { html } from 'hono/html'
import { getCouchCMSModules, getCouchCMSAgents, getCompleteModules, getCompleteAgents } from '../../lib/option-organizer.js'
import { selectFrontendFrameworks } from '../../lib/frontend-selector.js'
import { getProgressIndicator, renderBadge, wrapStepWithProgress } from './helpers.js'

/**
 * Create API routes
 * @param {string} projectDir - Project directory
 * @returns {Hono} API routes app
 */
export function apiRoutes(projectDir) {
    const app = new Hono()

    // Get available modules
    app.get('/setup/modules', (c) => {
        const couchcmsModules = getCouchCMSModules()
        const frontendModules = ['tailwindcss', 'daisyui', 'alpinejs', 'typescript']

        return c.json({
            couchcms: couchcmsModules.map(name => ({
                name,
                description: getModuleDescription(name),
                required: true
            })),
            frontend: frontendModules.map(name => ({
                name,
                description: getModuleDescription(name),
                required: false
            }))
        })
    })

    // Get available agents
    app.get('/setup/agents', (c) => {
        const couchcmsAgents = getCouchCMSAgents()

        return c.json({
            couchcms: couchcmsAgents.map(name => ({
                name,
                description: getAgentDescription(name),
                required: true
            }))
        })
    })

    // Get step content (project info)
    app.get('/setup/step/project', (c) => {
        const stepContent = html`
<div>
    <h2 class="text-2xl font-bold mb-4">Project Information</h2>
    <p class="mb-6 text-base-content/70">Let's start by gathering some basic information about your project.</p>

    <form hx-post="/api/setup/step/project" hx-target="#wizard-content" hx-swap="innerHTML">
        <div class="form-control mb-4">
            <label class="label">
                <span class="label-text">Project Name</span>
            </label>
            <input
                type="text"
                name="projectName"
                placeholder="my-project"
                class="input input-bordered w-full"
                required
                value="my-project"
            />
        </div>

        <div class="form-control mb-6">
            <label class="label">
                <span class="label-text">Project Description</span>
            </label>
            <textarea
                name="projectDescription"
                placeholder="A CouchCMS web application"
                class="textarea textarea-bordered w-full"
                required
            >A CouchCMS web application</textarea>
        </div>

        <div class="card-actions justify-end">
            <button type="submit" class="btn btn-primary">
                Next: Choose Complexity →
            </button>
        </div>
    </form>
</div>
        `

        return c.html(wrapStepWithProgress(1, stepContent))
    })

    // Handle project info submission
    app.post('/setup/step/project', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'

        const stepContent = html`
<div>
    <h2 class="text-2xl font-bold mb-4">Setup Complexity</h2>
    <p class="mb-6 text-base-content/70">Choose how much control you want over the configuration.</p>

    <form hx-post="/api/setup/step/complexity" hx-target="#wizard-content" hx-swap="innerHTML">
        <input type="hidden" name="projectName" value="${projectName}" />
        <input type="hidden" name="projectDescription" value="${projectDescription}" />

        <div class="grid gap-4 mb-6">
            <label class="card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors">
                <input type="radio" name="complexity" value="easy" class="radio radio-primary" checked />
                <div class="card-body">
                    <h3 class="card-title">Easy</h3>
                    <p class="text-sm">1 minute, 2 questions</p>
                    <p class="text-xs opacity-70">Quick setup with recommended defaults. All CouchCMS modules/agents + TailwindCSS + Alpine.js</p>
                </div>
            </label>

            <label class="card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors">
                <input type="radio" name="complexity" value="medium" class="radio radio-primary" />
                <div class="card-body">
                    <h3 class="card-title">Medium</h3>
                    <p class="text-sm">3 minutes, 5 questions</p>
                    <p class="text-xs opacity-70">Choose CSS and JS frameworks. All CouchCMS modules/agents included automatically.</p>
                </div>
            </label>

            <label class="card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors">
                <input type="radio" name="complexity" value="comprehensive" class="radio radio-primary" />
                <div class="card-body">
                    <h3 class="card-title">Comprehensive</h3>
                    <p class="text-sm">5 minutes, 8+ questions</p>
                    <p class="text-xs opacity-70">Full control over all frontend options and advanced configuration.</p>
                </div>
            </label>
        </div>

        <div class="card-actions justify-between">
            <button type="button" class="btn btn-outline" onclick="history.back()">
                ← Back
            </button>
            <button type="submit" class="btn btn-primary">
                Next: Frontend Frameworks →
            </button>
        </div>
    </form>
</div>
        `

        return c.html(wrapStepWithProgress(2, stepContent))
    })

    // Handle complexity selection
    app.post('/setup/step/complexity', async (c) => {
        const body = await c.req.parseBody()
        const complexity = body.complexity || 'easy'
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'

        // Show frontend selection based on complexity
        if (complexity === 'easy') {
            // Skip frontend selection, go to review
            return c.html(getReviewStep(projectName, projectDescription, complexity, {
                css: ['tailwindcss'],
                js: ['alpinejs']
            }))
        }

        const stepContent = html`
<div>
    <h2 class="text-2xl font-bold mb-4">Frontend Frameworks</h2>
    <p class="mb-6 text-base-content/70">Select the CSS and JavaScript frameworks you want to use.</p>

    <form hx-post="/api/setup/step/frontend" hx-target="#wizard-content" hx-swap="innerHTML">
        <input type="hidden" name="projectName" value="${projectName}" />
        <input type="hidden" name="projectDescription" value="${projectDescription}" />
        <input type="hidden" name="complexity" value="${complexity}" />

        <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">CSS Framework</h3>
            <div class="grid gap-3">
                <label class="card bg-base-200 cursor-pointer hover:bg-base-300 transition-all shadow-sm border-2 border-transparent hover:border-primary/20">
                    <div class="card-body">
                        <div class="flex items-start gap-4">
                            <input type="checkbox" name="css" value="tailwindcss" class="checkbox checkbox-primary mt-1" checked />
                            <div class="flex-1">
                                <h4 class="card-title text-base font-semibold mb-1">TailwindCSS</h4>
                                <p class="text-sm text-base-content/70">Utility-first CSS framework</p>
                            </div>
                        </div>
                    </div>
                </label>

                <label class="card bg-base-200 cursor-pointer hover:bg-base-300 transition-all shadow-sm border-2 border-transparent hover:border-primary/20">
                    <div class="card-body">
                        <div class="flex items-start gap-4">
                            <input type="checkbox" name="css" value="daisyui" class="checkbox checkbox-primary mt-1" />
                            <div class="flex-1">
                                <h4 class="card-title text-base font-semibold mb-1">daisyUI</h4>
                                <p class="text-sm text-base-content/70">Component library for TailwindCSS</p>
                            </div>
                        </div>
                    </div>
                </label>
            </div>
        </div>

        <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">JavaScript Framework</h3>
            <div class="grid gap-3">
                <label class="card bg-base-200 cursor-pointer hover:bg-base-300 transition-all shadow-sm border-2 border-transparent hover:border-primary/20">
                    <div class="card-body">
                        <div class="flex items-start gap-4">
                            <input type="checkbox" name="js" value="alpinejs" class="checkbox checkbox-primary mt-1" checked />
                            <div class="flex-1">
                                <h4 class="card-title text-base font-semibold mb-1">Alpine.js</h4>
                                <p class="text-sm text-base-content/70">Lightweight reactive JavaScript</p>
                            </div>
                        </div>
                    </div>
                </label>

                <label class="card bg-base-200 cursor-pointer hover:bg-base-300 transition-all shadow-sm border-2 border-transparent hover:border-primary/20">
                    <div class="card-body">
                        <div class="flex items-start gap-4">
                            <input type="checkbox" name="js" value="typescript" class="checkbox checkbox-primary mt-1" />
                            <div class="flex-1">
                                <h4 class="card-title text-base font-semibold mb-1">TypeScript</h4>
                                <p class="text-sm text-base-content/70">Type-safe JavaScript</p>
                            </div>
                        </div>
                    </div>
                </label>
            </div>
        </div>

        <div class="card-actions justify-between">
            <button type="button" class="btn btn-outline" onclick="history.back()">
                ← Back
            </button>
            <button type="submit" class="btn btn-primary">
                Next: Review →
            </button>
        </div>
    </form>
</div>
        `

        return c.html(wrapStepWithProgress(3, stepContent))
    })

    // Handle frontend selection
    app.post('/setup/step/frontend', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const complexity = body.complexity || 'easy'

        const cssFrameworks = Array.isArray(body.css) ? body.css : (body.css ? [body.css] : [])
        const jsFrameworks = Array.isArray(body.js) ? body.js : (body.js ? [body.js] : [])

        return c.html(getReviewStep(projectName, projectDescription, complexity, {
            css: cssFrameworks,
            js: jsFrameworks
        }))
    })

    // Generate configuration
    app.post('/setup/generate', async (c) => {
        const body = await c.req.parseBody()

        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const complexity = body.complexity || 'easy'

        // Parse CSS and JS arrays from form data
        let cssFrameworks = []
        let jsFrameworks = []

        if (body.css) {
            cssFrameworks = Array.isArray(body.css) ? body.css : [body.css]
        }
        if (body.js) {
            jsFrameworks = Array.isArray(body.js) ? body.js : [body.js]
        }

        try {
            // Import required modules
            const { checkAndInstallDependencies } = await import('../../lib/dependency-checker.js')
            const { getCouchCMSModules, getCouchCMSAgents, getCompleteModules, getCompleteAgents } = await import('../../lib/option-organizer.js')
            const { detectToolkitPath } = await import('../../lib/toolkit-detector.js')
            const { determineConfigPath, generateStandardsFile } = await import('../../lib/config-generator.js')
            const { runInitialSync } = await import('../../lib/sync-runner.js')
            const { getToolkitRootCached } = await import('../../lib/paths.js')

            const TOOLKIT_ROOT = getToolkitRootCached()

            // Step 1: Ensure dependencies
            await checkAndInstallDependencies(TOOLKIT_ROOT)

            // Step 2: Build module and agent lists
            const couchcmsModules = getCouchCMSModules()
            const couchcmsAgents = getCouchCMSAgents()
            const frontendModules = [...cssFrameworks, ...jsFrameworks]
            const allModules = getCompleteModules(frontendModules)
            const allAgents = getCompleteAgents([], [])

            // Step 3: Detect toolkit path
            const toolkitPath = detectToolkitPath(projectDir) || './ai-toolkit-shared'

            // Step 4: Determine config path
            const { configPath, configDir } = await determineConfigPath(projectDir, complexity === 'easy')

            // Step 5: Generate standards.md
            await generateStandardsFile({
                projectDir,
                configPath,
                configDir,
                projectName,
                projectDescription,
                toolkitPath,
                toolkitRoot: TOOLKIT_ROOT,
                selectedModules: allModules,
                selectedAgents: allAgents,
                selectedEditors: [],
                frameworkConfig: false
            })

            // Step 6: Run initial sync
            await runInitialSync(projectDir, TOOLKIT_ROOT)

            const successContent = html`
<div>
    <div class="alert alert-success mb-6 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-semibold">Configuration generated successfully!</span>
    </div>

    <h2 class="text-3xl font-bold mb-2">✅ Setup Complete!</h2>
    <p class="mb-8 text-base-content/70 text-lg">Your CouchCMS AI Toolkit is now configured and ready to use.</p>

    <div class="space-y-4 mb-8">
        <div class="card bg-base-200 shadow-sm">
            <div class="card-body">
                <h3 class="card-title text-lg font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Configuration File
                </h3>
                <p class="font-mono text-sm bg-base-300 px-3 py-2 rounded mt-2 inline-block">.project/standards.md</p>
            </div>
        </div>

        <div class="card bg-base-200 shadow-sm">
            <div class="card-body">
                <h3 class="card-title text-lg font-semibold mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Next Steps
                </h3>
                <ol class="list-decimal list-inside space-y-3 text-base-content/80">
                    <li>Review your configuration: <code class="bg-base-300 px-2 py-1 rounded text-sm font-mono">.project/standards.md</code></li>
                    <li>Run sync to generate configs: <code class="bg-base-300 px-2 py-1 rounded text-sm font-mono">bun run toolkit sync</code></li>
                    <li>Start developing with AI assistance!</li>
                </ol>
            </div>
        </div>
    </div>

    <div class="card-actions justify-end">
        <a href="/" class="btn btn-outline">← Back to Home</a>
        <button onclick="window.close()" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
        </button>
    </div>
</div>
            `

            // Update progress to show completion (all steps completed)
            const progressIndicator = getProgressIndicator(4)
            return c.html(progressIndicator + successContent)
        } catch (error) {
            return c.html(html`
<div>
    <div class="alert alert-error mb-6 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
            <h3 class="font-bold">Error</h3>
            <div class="text-sm">${error.message}</div>
        </div>
    </div>

    <div class="card-actions justify-end">
        <button onclick="history.back()" class="btn btn-outline">← Back</button>
    </div>
</div>
            `)
        }
    })

    return app
}

/**
 * Get review step HTML
 */
function getReviewStep(projectName, projectDescription, complexity, frontend) {
    const couchcmsModules = getCouchCMSModules()
    const couchcmsAgents = getCouchCMSAgents()

    // Render badges properly (not as raw HTML)
    const cssBadges = frontend.css.map(f => renderBadge(f, 'primary')).join('')
    const jsBadges = frontend.js.map(f => renderBadge(f, 'secondary')).join('')

    const stepContent = html`
<div>
    <h2 class="text-2xl font-bold mb-4">Review Configuration</h2>
    <p class="mb-6 text-base-content/70">Review your settings before generating the configuration.</p>

    <div class="space-y-4 mb-6">
        <div class="card bg-base-200 shadow-sm">
            <div class="card-body">
                <h3 class="card-title text-lg font-semibold">Project Information</h3>
                <div class="space-y-1 mt-2">
                    <p><span class="font-medium">Name:</span> <span class="text-base-content/80">${projectName}</span></p>
                    <p><span class="font-medium">Description:</span> <span class="text-base-content/80">${projectDescription}</span></p>
                </div>
            </div>
        </div>

        <div class="card bg-base-200 shadow-sm">
            <div class="card-body">
                <h3 class="card-title text-lg font-semibold">Setup Complexity</h3>
                <p class="capitalize text-base-content/80 mt-2">${complexity}</p>
            </div>
        </div>

        <div class="card bg-base-200 shadow-sm">
            <div class="card-body">
                <h3 class="card-title text-lg font-semibold">Frontend Frameworks</h3>
                <div class="flex flex-wrap gap-2 mt-2">
                    ${cssBadges}
                    ${jsBadges}
                </div>
            </div>
        </div>

        <div class="card bg-base-200 shadow-sm">
            <div class="card-body">
                <h3 class="card-title text-lg font-semibold">Included Components</h3>
                <div class="space-y-1 mt-2">
                    <p><span class="font-medium">CouchCMS Modules:</span> <span class="text-base-content/80">${couchcmsModules.length} (automatic)</span></p>
                    <p><span class="font-medium">CouchCMS Agents:</span> <span class="text-base-content/80">${couchcmsAgents.length} (automatic)</span></p>
                </div>
            </div>
        </div>
    </div>

    <form hx-post="/api/setup/generate" hx-target="#wizard-content" hx-swap="innerHTML">
        ${frontend.css.map(f => `<input type="hidden" name="css" value="${f}" />`).join('')}
        ${frontend.js.map(f => `<input type="hidden" name="js" value="${f}" />`).join('')}
        <input type="hidden" name="projectName" value="${projectName}" />
        <input type="hidden" name="projectDescription" value="${projectDescription}" />
        <input type="hidden" name="complexity" value="${complexity}" />

        <div class="card-actions justify-between mt-6">
            <button type="button" class="btn btn-outline" onclick="history.back()">
                ← Back
            </button>
            <button type="submit" class="btn btn-primary btn-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Generate Configuration
            </button>
        </div>
    </form>
</div>
    `

    return wrapStepWithProgress(4, stepContent)
}

/**
 * Get module description
 */
function getModuleDescription(name) {
    const descriptions = {
        'tailwindcss': 'Utility-first CSS framework',
        'daisyui': 'Component library for TailwindCSS',
        'alpinejs': 'Lightweight reactive JavaScript',
        'typescript': 'Type-safe JavaScript'
    }
    return descriptions[name] || 'CouchCMS module'
}

/**
 * Get agent description
 */
function getAgentDescription(name) {
    return `AI agent for ${name}`
}
