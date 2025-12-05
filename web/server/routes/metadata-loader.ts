#!/usr/bin/env bun
/**
 * Metadata loading functions for modules and agents
 * Handles loading and parsing markdown files with frontmatter
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { getToolkitRootCached } from '../../../scripts/lib/paths.js'
import { getCouchCMSModules, getCouchCMSAgents } from '../../../scripts/lib/option-organizer.js'
import type { ModuleMetadata, AgentMetadata, CouchCMSItems, GroupedItems } from '../types'

/**
 * Frontend modules configuration
 */
interface FrontendModulesConfig {
    CSS: readonly string[]
    JS: readonly string[]
}

/**
 * Determine category for agent based on name and tags
 * @param agentName - Agent name
 * @param tags - Agent tags
 * @returns Category
 */
export function determineAgentCategory(agentName: string, tags: string[] = []): string {
    if (tags.includes('couchcms') || agentName.includes('couchcms')) {
        return 'core'
    }
    if (tags.some(tag => ['tailwindcss', 'daisyui', 'alpinejs', 'typescript', 'javascript'].includes(tag))) {
        return 'frontend'
    }
    if (tags.some(tag => ['bun', 'git', 'mysql'].includes(tag))) {
        return 'dev-tools'
    }
    return 'core'
}

/**
 * Extract summary from content if description is missing
 * @param content - Markdown content
 * @returns Extracted summary
 */
function extractSummaryFromContent(content: string): string {
    if (!content) {
        return ''
    }

    const firstParagraph = content
        .split('\n\n')
        .find(p => p.trim() && !p.trim().startsWith('#'))

    if (!firstParagraph) {
        return ''
    }

    return firstParagraph
        .replace(/^#+\s*/, '')
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .trim()
        .substring(0, 200)
}

/**
 * Load module metadata from markdown file
 * @param moduleName - Name of module
 * @param toolkitPath - Path to toolkit root
 * @returns Module metadata with fallback values
 */
export function loadModuleMetadata(moduleName: string, toolkitPath: string): ModuleMetadata {
    const possiblePaths = [
        join(toolkitPath, 'modules', 'core', `${moduleName}.md`),
        join(toolkitPath, 'modules', 'frontend', `${moduleName}.md`),
        join(toolkitPath, 'modules', `${moduleName}.md`), // Legacy
    ]

    for (const path of possiblePaths) {
        if (existsSync(path)) {
            try {
                const fileContent = readFileSync(path, 'utf8')
                const { data: meta, content } = matter(fileContent)

                // Extract first paragraph as summary if no description
                let summary = (meta.description as string) || ''
                if (!summary && content) {
                    summary = extractSummaryFromContent(content)
                }

                return {
                    id: (meta.id as string) || moduleName,
                    name: (meta.name as string) || moduleName,
                    category: (meta.category as string) || 'other',
                    version: (meta.version as string) || '1.0',
                    description: (meta.description as string) || summary || `Module: ${moduleName}`,
                    summary: summary || (meta.description as string) || `Module: ${moduleName}`,
                    required: (meta.required as boolean) || false,
                    requires: Array.isArray(meta.requires) ? (meta.requires as string[]) : [],
                    conflicts: Array.isArray(meta.conflicts) ? (meta.conflicts as string[]) : [],
                    content: content ? content.substring(0, 500) : '',
                    path: path
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                console.warn(`⚠️  Failed to load module ${moduleName}:`, errorMessage)
            }
        }
    }

    // Fallback: return basic metadata
    return {
        id: moduleName,
        name: moduleName,
        category: 'other',
        version: '1.0',
        description: `Module: ${moduleName}`,
        summary: `Module: ${moduleName}`,
        required: false,
        requires: [],
        conflicts: [],
        content: '',
        path: null
    }
}

/**
 * Load agent metadata from markdown file
 * @param agentName - Name of agent
 * @param toolkitPath - Path to toolkit root
 * @returns Agent metadata with fallback values
 */
export function loadAgentMetadata(agentName: string, toolkitPath: string): AgentMetadata {
    const possiblePaths = [
        join(toolkitPath, 'agents', 'core', `${agentName}.md`),
        join(toolkitPath, 'agents', 'frontend', `${agentName}.md`),
        join(toolkitPath, 'agents', 'dev-tools', `${agentName}.md`),
        join(toolkitPath, 'agents', `${agentName}.md`), // Legacy
    ]

    for (const path of possiblePaths) {
        if (existsSync(path)) {
            try {
                const fileContent = readFileSync(path, 'utf8')
                const { data: meta, content } = matter(fileContent)

                let summary = (meta.description as string) || ''
                if (!summary && content) {
                    summary = extractSummaryFromContent(content)
                }

                const tags = Array.isArray(meta.tags)
                    ? (meta.tags as string[])
                    : (meta.tags ? [meta.tags as string] : [])

                return {
                    name: (meta.name as string) || agentName,
                    type: (meta.type as string) || 'combined',
                    version: (meta.version as string) || '1.0',
                    description: (meta.description as string) || summary || `Agent: ${agentName}`,
                    summary: summary || (meta.description as string) || `Agent: ${agentName}`,
                    tags: tags,
                    category: determineAgentCategory(agentName, tags),
                    content: content ? content.substring(0, 500) : '',
                    path: path
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                console.warn(`⚠️  Failed to load agent ${agentName}:`, errorMessage)
            }
        }
    }

    // Fallback: return basic metadata
    return {
        name: agentName,
        type: 'combined',
        version: '1.0',
        description: `Agent: ${agentName}`,
        summary: `Agent: ${agentName}`,
        tags: [],
        category: 'core',
        content: '',
        path: null
    }
}

/**
 * Group items by category
 * @param items - Array of items with category property
 * @returns Object with category keys and item arrays, or null if no items
 */
export function groupByCategory(items: Array<ModuleMetadata | AgentMetadata>): GroupedItems | null {
    if (!items || items.length === 0) {
        return null
    }
    const grouped: GroupedItems = {}
    items.forEach(item => {
        const category = item.category || 'other'
        if (!grouped[category]) {
            grouped[category] = []
        }
        grouped[category].push(item)
    })
    // Return null if no categories were created (shouldn't happen, but safety check)
    if (Object.keys(grouped).length === 0) {
        return null
    }
    return grouped
}

/**
 * Scan directory for markdown files (excluding README)
 * @param dirPath - Directory path to scan
 * @param excludeNames - Names to exclude from results
 * @returns Array of file names (without .md extension)
 */
export function scanMarkdownFiles(dirPath: string, excludeNames: string[] = []): string[] {
    const files: string[] = []
    if (!existsSync(dirPath)) {
        return files
    }

    try {
        const entries = readdirSync(dirPath)
        for (const entry of entries) {
            const fullPath = join(dirPath, entry)
            try {
                const stat = statSync(fullPath)
                if (stat.isFile() && entry.endsWith('.md') && !entry.includes('README')) {
                    const name = entry.replace('.md', '')
                    if (!excludeNames.includes(name)) {
                        files.push(name)
                    }
                }
            } catch (e) {
                // Skip if we can't stat the file
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.warn(`⚠️  Failed to scan directory ${dirPath}:`, errorMessage)
    }

    return files
}

/**
 * Get CouchCMS modules and agents from toolkit directory
 * @param allCore - If true, return ALL core modules/agents, not just auto-included ones
 * @param frontendModules - Frontend module configuration
 * @returns Object with couchcmsModules and couchcmsAgents arrays
 */
export function getCouchCMSItemsFromToolkit(
    allCore = false,
    frontendModules: FrontendModulesConfig = { CSS: [], JS: [] }
): CouchCMSItems {
    const toolkitPath = getToolkitRootCached()
    const frontendModuleNames = [...frontendModules.CSS, ...frontendModules.JS]
    const frontendAgentNames = [
        frontendModules.CSS[0],
        frontendModules.JS[0],
        frontendModules.JS[1]
    ].filter((name): name is string => Boolean(name))

    let couchcmsModules: string[] = []
    let couchcmsAgents: string[] = []

    // Try core directory first
    const coreModulesDir = join(toolkitPath, 'modules', 'core')
    const coreAgentsDir = join(toolkitPath, 'agents', 'core')

    if (allCore) {
        // Scan ALL core modules and agents (no exclusions)
        couchcmsModules = scanMarkdownFiles(coreModulesDir, [])
        couchcmsAgents = scanMarkdownFiles(coreAgentsDir, [])
    } else {
        // Original behavior: exclude frontend modules/agents
        couchcmsModules = scanMarkdownFiles(coreModulesDir, frontendModuleNames)
        couchcmsAgents = scanMarkdownFiles(coreAgentsDir, frontendAgentNames)
    }

    // Fallback to legacy flat structure if core/ is empty
    if (couchcmsModules.length === 0) {
        const legacyModulesDir = join(toolkitPath, 'modules')
        couchcmsModules = scanMarkdownFiles(legacyModulesDir, frontendModuleNames)
    }

    if (couchcmsAgents.length === 0) {
        const legacyAgentsDir = join(toolkitPath, 'agents')
        if (allCore) {
            couchcmsAgents = scanMarkdownFiles(legacyAgentsDir, [])
        } else {
            couchcmsAgents = scanMarkdownFiles(legacyAgentsDir, frontendAgentNames)
        }
    }

    // Sort and remove duplicates
    couchcmsModules = [...new Set(couchcmsModules)].sort()
    couchcmsAgents = [...new Set(couchcmsAgents)].sort()

    // Fallback to hardcoded values if scanning found nothing
    if (couchcmsModules.length === 0) {
        const fallback = getCouchCMSModules()
        if (fallback.length > 0) {
            couchcmsModules = fallback
        }
    }
    if (couchcmsAgents.length === 0) {
        const fallback = getCouchCMSAgents()
        if (fallback.length > 0) {
            couchcmsAgents = fallback
        }
    }

    return { couchcmsModules, couchcmsAgents }
}

