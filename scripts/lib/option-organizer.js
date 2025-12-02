#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Option Organizer
 *
 * Separates CouchCMS modules/agents (automatic) from Frontend options (optional)
 * Implements DRY principle: CouchCMS always included, frontend is user choice
 */

/**
 * All CouchCMS modules (always included automatically)
 * These are core CouchCMS features, not optional
 */
export const COUCHCMS_MODULES = [
    'couchcms-core',
    'databound-forms',
    'custom-routes',
    'folders',
    'archives',
    'relationships',
    'repeatable-regions',
    'search',
    'pagination',
    'comments',
    'users'
]

/**
 * All CouchCMS agents (always included automatically)
 * These match the CouchCMS modules
 */
export const COUCHCMS_AGENTS = [
    'couchcms',
    'databound-forms',
    'custom-routes',
    'views',
    'folders',
    'archives',
    'relationships',
    'repeatable-regions',
    'search',
    'pagination',
    'comments',
    'nested-pages',
    'photo-gallery',
    'rss-feeds',
    'on-page-editing',
    'users'
]

/**
 * Frontend modules (optional - user chooses)
 */
export const FRONTEND_MODULES = [
    { name: 'tailwindcss', description: 'TailwindCSS 4 patterns', category: 'css' },
    { name: 'daisyui', description: 'daisyUI 5 components', category: 'css' },
    { name: 'alpinejs', description: 'Alpine.js integration', category: 'js' },
    { name: 'typescript', description: 'TypeScript standards', category: 'js' }
]

/**
 * Frontend agents (optional - user chooses)
 */
export const FRONTEND_AGENTS = [
    { name: 'tailwindcss', description: 'TailwindCSS styling', category: 'css' },
    { name: 'alpinejs', description: 'Alpine.js development', category: 'js' },
    { name: 'typescript', description: 'TypeScript development', category: 'js' }
]

/**
 * Development tool agents (optional)
 */
export const DEV_TOOL_AGENTS = [
    { name: 'bun', description: 'Bun runtime and build tooling' },
    { name: 'git', description: 'Git version control' },
    { name: 'mysql', description: 'Database operations' },
    { name: 'admin-panel-theming', description: 'Admin panel customization' }
]

/**
 * Get all CouchCMS modules (always included)
 * @returns {Array<string>} Array of CouchCMS module names
 */
export function getCouchCMSModules() {
    return [...COUCHCMS_MODULES]
}

/**
 * Get all CouchCMS agents (always included)
 * @returns {Array<string>} Array of CouchCMS agent names
 */
export function getCouchCMSAgents() {
    return [...COUCHCMS_AGENTS]
}

/**
 * Get frontend modules organized by category
 * @returns {Object} Object with css and js arrays
 */
export function getFrontendModules() {
    return {
        css: FRONTEND_MODULES.filter(m => m.category === 'css'),
        js: FRONTEND_MODULES.filter(m => m.category === 'js'),
        all: [...FRONTEND_MODULES]
    }
}

/**
 * Get frontend agents organized by category
 * @returns {Object} Object with css and js arrays
 */
export function getFrontendAgents() {
    return {
        css: FRONTEND_AGENTS.filter(a => a.category === 'css'),
        js: FRONTEND_AGENTS.filter(a => a.category === 'js'),
        all: [...FRONTEND_AGENTS]
    }
}

/**
 * Get recommended frontend defaults (for Easy mode)
 * @returns {Object} Object with recommended modules and agents
 */
export function getRecommendedFrontend() {
    return {
        modules: ['tailwindcss', 'alpinejs'],
        agents: ['tailwindcss', 'alpinejs']
    }
}

/**
 * Organize all modules into CouchCMS (automatic) and Frontend (optional)
 * @returns {Object} Organized modules object
 */
export function organizeModules() {
    return {
        couchcms: {
            modules: getCouchCMSModules(),
            agents: getCouchCMSAgents(),
            automatic: true,
            description: 'All CouchCMS modules and agents (always included)'
        },
        frontend: {
            modules: getFrontendModules(),
            agents: getFrontendAgents(),
            automatic: false,
            description: 'Frontend frameworks (optional - user chooses)'
        },
        devTools: {
            agents: DEV_TOOL_AGENTS,
            automatic: false,
            description: 'Development tools (optional)'
        }
    }
}

/**
 * Get complete module list (CouchCMS + selected frontend)
 * @param {Array<string>} selectedFrontendModules - Selected frontend modules
 * @returns {Array<string>} Complete list of modules
 */
export function getCompleteModules(selectedFrontendModules = []) {
    return [
        ...getCouchCMSModules(),
        ...selectedFrontendModules
    ]
}

/**
 * Get complete agent list (CouchCMS + selected frontend + selected dev tools)
 * @param {Array<string>} selectedFrontendAgents - Selected frontend agents
 * @param {Array<string>} selectedDevToolAgents - Selected dev tool agents
 * @returns {Array<string>} Complete list of agents
 */
export function getCompleteAgents(selectedFrontendAgents = [], selectedDevToolAgents = []) {
    return [
        ...getCouchCMSAgents(),
        ...selectedFrontendAgents,
        ...selectedDevToolAgents
    ]
}

/**
 * Validate frontend module selection
 * @param {Array<string>} selectedModules - Selected module names
 * @returns {Object} Validation result with valid modules and errors
 */
export function validateFrontendModules(selectedModules) {
    const validModules = []
    const errors = []
    const availableNames = FRONTEND_MODULES.map(m => m.name)

    for (const moduleName of selectedModules) {
        if (availableNames.includes(moduleName)) {
            validModules.push(moduleName)
        } else {
            errors.push(`Unknown frontend module: ${moduleName}`)
        }
    }

    return { validModules, errors }
}

/**
 * Get matching agents for selected frontend modules
 * @param {Array<string>} selectedModules - Selected frontend module names
 * @returns {Array<string>} Matching agent names
 */
export function getMatchingAgents(selectedModules) {
    const matchingAgents = []

    for (const moduleName of selectedModules) {
        const matchingAgent = FRONTEND_AGENTS.find(a => a.name === moduleName)
        if (matchingAgent) {
            matchingAgents.push(matchingAgent.name)
        }
    }

    return matchingAgents
}
