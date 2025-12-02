#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Module Loader
 *
 * Loads modules, agents, and framework components from toolkit
 * with caching for improved performance.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { ModuleCache } from './cache.js'

// Global cache instance for module loading
const moduleCache = new ModuleCache()

/**
 * Load modules from toolkit
 *
 * @param {Array<string>} moduleNames - Module names to load
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {Array<object>} - Array of loaded modules with {name, meta, content}
 */
export function loadModules(moduleNames, toolkitPath) {
    if (!Array.isArray(moduleNames)) {
        throw new Error('moduleNames must be an array')
    }

    const modules = []

    for (const moduleName of moduleNames) {
        const module = loadModule(moduleName, toolkitPath)
        if (module) {
            modules.push(module)
        }
    }

    return modules
}

/**
 * Load a single module from the toolkit
 *
 * @param {string} moduleName - Name of module to load
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {object|null} - Module object with { meta, content, name } or null if not found
 */
function loadModule(moduleName, toolkitPath) {
    const cacheKey = `module:${toolkitPath}:${moduleName}`

    // Check cache first
    if (moduleCache.has(cacheKey)) {
        return moduleCache.get(cacheKey)
    }

    // Search in subdirectories: core/ and frontend/
    const possiblePaths = [
        join(toolkitPath, 'modules', `${moduleName}.md`), // Legacy flat structure
        join(toolkitPath, 'modules', 'core', `${moduleName}.md`), // CouchCMS modules
        join(toolkitPath, 'modules', 'frontend', `${moduleName}.md`), // Frontend modules
    ]

    let modulePath = null
    for (const path of possiblePaths) {
        if (existsSync(path)) {
            modulePath = path
            break
        }
    }

    if (!modulePath) {
        console.warn(`⚠️  Module not found: ${moduleName}`)
        return null
    }

    try {
        const fileContent = readFileSync(modulePath, 'utf8')
        const { data: meta, content } = matter(fileContent)

        const module = { meta, content, name: moduleName }

        // Cache the parsed module
        moduleCache.set(cacheKey, module)

        return module
    } catch (error) {
        console.warn(`⚠️  Failed to load module ${moduleName}: ${error.message}`)
        return null
    }
}

/**
 * Load agents from toolkit
 *
 * @param {Array<string>} agentNames - Agent names to load
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {Array<object>} - Array of loaded agents with {name, meta, content}
 */
export function loadAgents(agentNames, toolkitPath) {
    if (!Array.isArray(agentNames)) {
        throw new Error('agentNames must be an array')
    }

    const agents = []

    for (const agentName of agentNames) {
        const agent = loadAgent(agentName, toolkitPath)
        if (agent) {
            agents.push(agent)
        }
    }

    return agents
}

/**
 * Load a single agent from the toolkit
 *
 * @param {string} agentName - Name of agent to load
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {object|null} - Agent object with { meta, content, name } or null if not found
 */
function loadAgent(agentName, toolkitPath) {
    const cacheKey = `agent:${toolkitPath}:${agentName}`

    // Check cache first
    if (moduleCache.has(cacheKey)) {
        return moduleCache.get(cacheKey)
    }

    // Agents are in a flat structure under agents/
    const agentPath = join(toolkitPath, 'agents', `${agentName}.md`)

    if (!existsSync(agentPath)) {
        console.warn(`⚠️  Agent not found: ${agentName}`)
        return null
    }

    try {
        const fileContent = readFileSync(agentPath, 'utf8')
        const { data: meta, content } = matter(fileContent)

        const agent = { meta, content, name: agentName }

        // Cache the parsed agent
        moduleCache.set(cacheKey, agent)

        return agent
    } catch (error) {
        console.warn(`⚠️  Failed to load agent ${agentName}: ${error.message}`)
        return null
    }
}

/**
 * Load framework from toolkit based on configuration
 *
 * @param {object|boolean} frameworkConfig - Framework configuration
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {object|null} - Framework object with { name, content, meta } or null if disabled
 */
export function loadFramework(frameworkConfig, toolkitPath) {
    // Check if framework is disabled
    if (!frameworkConfig) {
        return null
    }

    const cacheKey = `framework:${toolkitPath}:${JSON.stringify(frameworkConfig)}`

    // Check cache first
    if (moduleCache.has(cacheKey)) {
        return moduleCache.get(cacheKey)
    }

    const frameworkDir = join(toolkitPath, 'framework')

    if (!existsSync(frameworkDir)) {
        console.warn(`⚠️  Framework directory not found: ${frameworkDir}`)
        return null
    }

    let frameworkContent = '# AAPF Framework\n\n'

    // Determine what to load based on config
    const config =
        frameworkConfig === true
            ? { doctrine: true, directives: true, playbooks: true, enhancements: true }
            : typeof frameworkConfig === 'object'
              ? frameworkConfig
              : { doctrine: true, directives: true }

    // Always load doctrine (core principles)
    if (config.doctrine !== false) {
        const doctrine = loadFrameworkCategory(frameworkDir, 'doctrine')
        if (doctrine) {
            frameworkContent += `## Operational Doctrine\n\n${doctrine}\n`
        }
    }

    // Always load directives (communication guidelines)
    if (config.directives !== false) {
        const directives = loadFrameworkCategory(frameworkDir, 'directives')
        if (directives) {
            frameworkContent += `## Directives\n\n${directives}\n`
        }
    }

    // Optionally load playbooks (workflow templates)
    if (config.playbooks === true) {
        const playbooks = loadFrameworkCategory(frameworkDir, 'playbooks')
        if (playbooks) {
            frameworkContent += `## Playbooks\n\n${playbooks}\n`
        }
    }

    // Optionally load enhancements (advanced features)
    if (config.enhancements === true) {
        const enhancements = loadFrameworkCategory(frameworkDir, 'enhancements')
        if (enhancements) {
            frameworkContent += `## Enhancements\n\n${enhancements}\n`
        }
    }

    const framework = {
        name: 'framework',
        content: frameworkContent,
        meta: {
            enabled: true,
            categories: Object.keys(config).filter((k) => config[k] === true),
        },
    }

    // Cache the framework
    moduleCache.set(cacheKey, framework)

    return framework
}

/**
 * Load framework category files
 *
 * @param {string} frameworkDir - Path to framework directory
 * @param {string} category - Category name (doctrine, directives, etc.)
 * @returns {string} - Combined content from all files in category
 */
function loadFrameworkCategory(frameworkDir, category) {
    const categoryDir = join(frameworkDir, category)

    if (!existsSync(categoryDir)) {
        return ''
    }

    try {
        const files = readdirSync(categoryDir)
            .filter((f) => f.endsWith('.md'))
            .sort() // Ensure consistent ordering

        let content = ''

        for (const file of files) {
            const filePath = join(categoryDir, file)
            const fileContent = readFileSync(filePath, 'utf8')
            const { content: fileContentBody } = matter(fileContent)
            content += `\n${fileContentBody}\n\n---\n`
        }

        return content
    } catch (error) {
        console.warn(`⚠️  Failed to load framework category ${category}: ${error.message}`)
        return ''
    }
}

/**
 * Check for module conflicts and missing dependencies
 *
 * @param {Array<object>} modules - Array of loaded modules
 * @returns {Array<string>} - Array of error messages (empty if no conflicts)
 */
export function checkConflicts(modules) {
    const moduleNames = modules.map((m) => m.name)
    const errors = []

    for (const mod of modules) {
        // Check for conflicts
        if (mod.meta.conflicts) {
            for (const conflict of mod.meta.conflicts) {
                if (moduleNames.includes(conflict)) {
                    errors.push(`❌ Conflict: ${mod.name} cannot be used with ${conflict}`)
                }
            }
        }

        // Check for missing dependencies
        if (mod.meta.requires) {
            for (const required of mod.meta.requires) {
                if (!moduleNames.includes(required)) {
                    errors.push(`❌ Missing dependency: ${mod.name} requires ${required}`)
                }
            }
        }
    }

    return errors
}

/**
 * Get cache statistics
 *
 * @returns {object} - Cache statistics
 */
export function getCacheStats() {
    return moduleCache.getStats()
}

/**
 * Clear module cache
 */
export function clearCache() {
    moduleCache.clear()
}

/**
 * List available modules in toolkit (searches subdirectories)
 *
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {Array<string>} - Array of available module names
 */
export function listAvailableModules(toolkitPath) {
    const modulesDir = join(toolkitPath, 'modules')

    if (!existsSync(modulesDir)) {
        return []
    }

    try {
        const moduleNames = new Set()

        // Helper function to recursively find .md files
        function scanDirectory(dir) {
            if (!existsSync(dir)) {
                return
            }

            const entries = readdirSync(dir)

            for (const entry of entries) {
                const fullPath = join(dir, entry)
                const stat = statSync(fullPath)

                if (stat.isDirectory()) {
                    // Recursively scan subdirectories (core/, frontend/, etc.)
                    scanDirectory(fullPath)
                } else if (entry.endsWith('.md')) {
                    // Extract module name from filename
                    const moduleName = entry.replace('.md', '')
                    moduleNames.add(moduleName)
                }
            }
        }

        // Scan modules directory (includes subdirectories)
        scanDirectory(modulesDir)

        return Array.from(moduleNames).sort()
    } catch (error) {
        console.warn(`⚠️  Failed to list modules: ${error.message}`)
        return []
    }
}

/**
 * List available agents in toolkit
 *
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {Array<string>} - Array of available agent names
 */
export function listAvailableAgents(toolkitPath) {
    const agentsDir = join(toolkitPath, 'agents')

    if (!existsSync(agentsDir)) {
        return []
    }

    try {
        return readdirSync(agentsDir)
            .filter((f) => f.endsWith('.md'))
            .map((f) => f.replace('.md', ''))
            .sort()
    } catch (error) {
        console.warn(`⚠️  Failed to list agents: ${error.message}`)
        return []
    }
}

/**
 * Auto-include all CouchCMS modules and agents (DRY principle)
 * This function ensures all CouchCMS components are always included
 *
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {Promise<Object>} Object with couchcmsModules and couchcmsAgents arrays
 */
export async function getAutoIncludedCouchCMS(toolkitPath) {
    // Import from option-organizer to get the lists
    const { getCouchCMSModules, getCouchCMSAgents } = await import('./option-organizer.js')

    // Verify modules and agents exist in toolkit
    const availableModules = listAvailableModules(toolkitPath)
    const availableAgents = listAvailableAgents(toolkitPath)

    const couchcmsModules = getCouchCMSModules().filter(m => availableModules.includes(m))
    const couchcmsAgents = getCouchCMSAgents().filter(a => availableAgents.includes(a))

    return {
        modules: couchcmsModules,
        agents: couchcmsAgents
    }
}
