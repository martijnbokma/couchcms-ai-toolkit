#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Option Organizer
 *
 * Separates CouchCMS modules/agents (automatic) from Frontend options (optional)
 * Implements DRY principle: CouchCMS always included, frontend is user choice
 *
 * Now reads categorization from .project/standards.md to match the new organization
 */

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { getToolkitRootCached } from './paths.js'

/**
 * Parse modules/agents from standards.md with category detection
 * Categories are detected from YAML comments like "# Core", "# Frontend", etc.
 *
 * @param {string} standardsPath - Path to standards.md file
 * @returns {Object} Object with categorized modules and agents
 */
function parseCategorizedFromStandards(standardsPath) {
    if (!existsSync(standardsPath)) {
        // Fallback to hardcoded values if standards.md not found
        return null
    }

    try {
        const content = readFileSync(standardsPath, 'utf8')
        const lines = content.split('\n')

        const result = {
            modules: {
                core: [],
                frontend: [],
                backend: [],
                content: [],
                userFeatures: [],
                development: []
            },
            agents: {
                core: [],
                frontend: [],
                contentManagement: [],
                userFeatures: [],
                developmentTools: []
            }
        }

        let currentSection = null
        let currentCategory = null

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()

            // Detect section start
            if (line.startsWith('# === MODULES ===')) {
                currentSection = 'modules'
                continue
            }
            if (line.startsWith('# === AGENTS ===')) {
                currentSection = 'agents'
                continue
            }
            if (line.startsWith('# ===')) {
                currentSection = null
                continue
            }

            // Detect category comments
            if (line.startsWith('#') && currentSection) {
                const categoryMatch = line.match(/#\s*(Core|Frontend|Backend|Content|User Features|Development|Content Management|Development Tools)/i)
                if (categoryMatch) {
                    const categoryName = categoryMatch[1].toLowerCase()
                    // Map to our category keys
                    if (currentSection === 'modules') {
                        if (categoryName === 'core') currentCategory = 'core'
                        else if (categoryName === 'frontend') currentCategory = 'frontend'
                        else if (categoryName === 'backend') currentCategory = 'backend'
                        else if (categoryName === 'content') currentCategory = 'content'
                        else if (categoryName.includes('user')) currentCategory = 'userFeatures'
                        else if (categoryName === 'development') currentCategory = 'development'
                    } else if (currentSection === 'agents') {
                        if (categoryName === 'core') currentCategory = 'core'
                        else if (categoryName === 'frontend') currentCategory = 'frontend'
                        else if (categoryName.includes('content')) currentCategory = 'contentManagement'
                        else if (categoryName.includes('user')) currentCategory = 'userFeatures'
                        else if (categoryName.includes('development')) currentCategory = 'developmentTools'
                    }
                    continue
                }
            }

            // Parse module/agent entries
            if (currentSection && currentCategory && line.startsWith('-')) {
                const match = line.match(/^\s*-\s*(.+)$/)
                if (match) {
                    const name = match[1].trim()
                    if (currentSection === 'modules' && result.modules[currentCategory]) {
                        result.modules[currentCategory].push(name)
                    } else if (currentSection === 'agents' && result.agents[currentCategory]) {
                        result.agents[currentCategory].push(name)
                    }
                }
            }
        }

        return result
    } catch (error) {
        console.warn(`⚠️  Failed to parse standards.md: ${error.message}`)
        return null
    }
}

/**
 * Get categorized modules and agents from standards.md
 * Falls back to hardcoded values if standards.md not found or parsing fails
 */
function getCategorizedFromStandards() {
    const toolkitRoot = getToolkitRootCached()
    const standardsPath = join(toolkitRoot, '.project', 'standards.md')

    const parsed = parseCategorizedFromStandards(standardsPath)
    if (parsed) {
        return parsed
    }

    // Fallback to hardcoded values (backward compatibility)
    return {
        modules: {
            core: ['couchcms-core'],
            frontend: ['tailwindcss', 'daisyui', 'alpinejs'],
            backend: ['databound-forms', 'custom-routes'],
            content: ['folders', 'archives', 'relationships', 'repeatable-regions', 'search', 'pagination', 'comments'],
            userFeatures: ['users'],
            development: ['typescript']
        },
        agents: {
            core: ['couchcms', 'databound-forms', 'custom-routes'],
            frontend: ['alpinejs', 'tailwindcss', 'typescript'],
            contentManagement: ['views', 'folders', 'archives', 'relationships', 'repeatable-regions', 'search', 'pagination', 'comments', 'nested-pages', 'photo-gallery', 'rss-feeds', 'on-page-editing'],
            userFeatures: ['users'],
            developmentTools: ['bun', 'git', 'mysql', 'admin-panel-theming']
        }
    }
}

/**
 * All CouchCMS modules (always included automatically)
 * These are core CouchCMS features, not optional
 * Now dynamically loaded from standards.md categorization
 */
export function getCouchCMSModules() {
    const categorized = getCategorizedFromStandards()
    return [
        ...categorized.modules.core,
        ...categorized.modules.backend,
        ...categorized.modules.content,
        ...categorized.modules.userFeatures
    ]
}

/**
 * All CouchCMS agents (always included automatically)
 * These match the CouchCMS modules
 * Now dynamically loaded from standards.md categorization
 */
export function getCouchCMSAgents() {
    const categorized = getCategorizedFromStandards()
    return [
        ...categorized.agents.core,
        ...categorized.agents.contentManagement,
        ...categorized.agents.userFeatures
    ]
}

/**
 * Development tool agents (optional)
 * Now dynamically loaded from standards.md categorization
 */
export function getDevToolAgents() {
    const categorized = getCategorizedFromStandards()
    return categorized.agents.developmentTools.map(name => ({
        name,
        description: getDevToolDescription(name)
    }))
}

// Export DEV_TOOL_AGENTS for backward compatibility
// Note: This is a getter function call, so it will be evaluated at module load time
// For dynamic updates, use getDevToolAgents() function instead
let _DEV_TOOL_AGENTS_CACHE = null
export function getDEV_TOOL_AGENTS() {
    if (!_DEV_TOOL_AGENTS_CACHE) {
        _DEV_TOOL_AGENTS_CACHE = getDevToolAgents()
    }
    return _DEV_TOOL_AGENTS_CACHE
}

/**
 * Get frontend modules organized by category
 * Includes modules from "Frontend" category and "Development" category (like typescript)
 * @returns {Object} Object with css and js arrays
 */
export function getFrontendModules() {
    const categorized = getCategorizedFromStandards()
    // Combine frontend modules with development modules that are frontend-related (like typescript)
    const frontendModuleNames = [
        ...categorized.modules.frontend,
        ...categorized.modules.development.filter(m => m === 'typescript') // typescript is frontend-related
    ]

    const frontendModules = frontendModuleNames.map(name => {
        const cssModules = ['tailwindcss', 'daisyui']
        const jsModules = ['alpinejs', 'typescript']

        let category = 'css'
        if (jsModules.includes(name)) {
            category = 'js'
        }

        return {
            name,
            description: getModuleDescription(name),
            category
        }
    })

    return {
        css: frontendModules.filter(m => m.category === 'css'),
        js: frontendModules.filter(m => m.category === 'js'),
        all: frontendModules
    }
}

/**
 * Get frontend agents organized by category
 * @returns {Object} Object with css and js arrays
 */
export function getFrontendAgents() {
    const categorized = getCategorizedFromStandards()
    const frontendAgents = categorized.agents.frontend.map(name => {
        const cssAgents = ['tailwindcss']
        const jsAgents = ['alpinejs', 'typescript']

        let category = 'css'
        if (jsAgents.includes(name)) {
            category = 'js'
        } else if (!cssAgents.includes(name)) {
            category = 'js'
        }

        return {
            name,
            description: getAgentDescription(name),
            category
        }
    })

    return {
        css: frontendAgents.filter(a => a.category === 'css'),
        js: frontendAgents.filter(a => a.category === 'js'),
        all: frontendAgents
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
            agents: getDevToolAgents(),
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
    const frontendModules = getFrontendModules()
    const availableNames = frontendModules.all.map(m => m.name)

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
    const frontendAgents = getFrontendAgents()

    for (const moduleName of selectedModules) {
        const matchingAgent = frontendAgents.all.find(a => a.name === moduleName)
        if (matchingAgent) {
            matchingAgents.push(matchingAgent.name)
        }
    }

    return matchingAgents
}

/**
 * Get module description
 */
function getModuleDescription(name) {
    const descriptions = {
        'tailwindcss': 'TailwindCSS 4 patterns',
        'daisyui': 'daisyUI 5 components',
        'alpinejs': 'Alpine.js integration',
        'typescript': 'TypeScript standards'
    }
    return descriptions[name] || 'CouchCMS module'
}

/**
 * Get agent description
 */
function getAgentDescription(name) {
    const descriptions = {
        'tailwindcss': 'TailwindCSS styling',
        'alpinejs': 'Alpine.js development',
        'typescript': 'TypeScript development'
    }
    return descriptions[name] || `AI agent for ${name}`
}

/**
 * Get dev tool description
 */
function getDevToolDescription(name) {
    const descriptions = {
        'bun': 'Bun runtime and build tooling',
        'git': 'Git version control',
        'mysql': 'Database operations',
        'admin-panel-theming': 'Admin panel customization'
    }
    return descriptions[name] || `Development tool: ${name}`
}
