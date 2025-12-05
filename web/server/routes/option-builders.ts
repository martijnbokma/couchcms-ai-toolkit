#!/usr/bin/env bun
/**
 * Option builder functions for creating UI option objects
 * Handles creation of frontend options, agent options, and editor groupings
 */

import { getAvailableEditors } from '../../../scripts/lib/prompts.js'
import { getMatchingAgents, getFrontendAgents, getDevToolAgents } from '../../../scripts/lib/option-organizer.js'
import type { FrontendOptions, AgentOptions, EditorGrouping } from '../types'

export const POPULAR_EDITOR_IDS = ['cursor', 'claude', 'copilot'] as const
export const DEFAULT_SELECTED_EDITOR = 'cursor'

export const FRONTEND_MODULES = {
    CSS: ['tailwindcss', 'daisyui'] as const,
    JS: ['alpinejs', 'typescript'] as const
} as const

/**
 * Create frontend options with selected state
 * @param selectedCss - Selected CSS framework IDs
 * @param selectedJs - Selected JS framework IDs
 * @returns Frontend options with selection state
 */
export function createFrontendOptions(selectedCss: string[] = [], selectedJs: string[] = []): FrontendOptions {
    return {
        css: [
            {
                id: FRONTEND_MODULES.CSS[0],
                name: 'TailwindCSS',
                description: 'Utility-first CSS framework',
                selected: selectedCss.includes(FRONTEND_MODULES.CSS[0])
            },
            {
                id: FRONTEND_MODULES.CSS[1],
                name: 'daisyUI',
                description: 'Component library for TailwindCSS',
                selected: selectedCss.includes(FRONTEND_MODULES.CSS[1])
            }
        ],
        js: [
            {
                id: FRONTEND_MODULES.JS[0],
                name: 'Alpine.js',
                description: 'Lightweight reactive JavaScript',
                selected: selectedJs.includes(FRONTEND_MODULES.JS[0])
            },
            {
                id: FRONTEND_MODULES.JS[1],
                name: 'TypeScript',
                description: 'Type-safe JavaScript',
                selected: selectedJs.includes(FRONTEND_MODULES.JS[1])
            }
        ]
    }
}

/**
 * Create agent options from selected agents
 * @param selectedAgents - Array of selected agent IDs
 * @param selectedFrontend - Array of selected frontend modules (for auto-selection)
 * @returns Agent options organized by category
 */
export function createAgentOptions(selectedAgents: string[] = [], selectedFrontend: string[] = []): AgentOptions {
    const frontendAgents = getFrontendAgents()
    const devToolAgents = getDevToolAgents()

    // Auto-select agents matching selected frontend modules
    const autoSelectedAgents = getMatchingAgents(selectedFrontend)
    const allSelected = [...new Set([...selectedAgents, ...autoSelectedAgents])]

    // Helper to format agent name
    function formatAgentName(name: string): string {
        return name
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return {
        frontend: frontendAgents.all.map(agent => ({
            id: agent.name,
            name: formatAgentName(agent.name),
            description: agent.description || getAgentDescription(agent.name),
            selected: allSelected.includes(agent.name)
        })),
        devTools: devToolAgents.map(agent => ({
            id: agent.name,
            name: formatAgentName(agent.name),
            description: agent.description || getAgentDescription(agent.name),
            selected: allSelected.includes(agent.name)
        }))
    }
}

/**
 * Get editors grouped by popularity
 * @param selectedEditors - Array of selected editor IDs
 * @returns Grouped editors with popular and other categories
 */
export function getEditorsGrouped(selectedEditors: string[] = []): EditorGrouping {
    const allEditors = getAvailableEditors()

    return {
        popular: allEditors
            .filter(e => POPULAR_EDITOR_IDS.includes(e.id as typeof POPULAR_EDITOR_IDS[number]))
            .map(e => ({ ...e, selected: selectedEditors.includes(e.id) })),
        other: allEditors
            .filter(e => !POPULAR_EDITOR_IDS.includes(e.id as typeof POPULAR_EDITOR_IDS[number]))
            .map(e => ({ ...e, selected: selectedEditors.includes(e.id) }))
    }
}

/**
 * Get module description
 * @param name - Module name
 * @returns Module description
 */
export function getModuleDescription(name: string): string {
    const descriptions: Record<string, string> = {
        [FRONTEND_MODULES.CSS[0]]: 'Utility-first CSS framework',
        [FRONTEND_MODULES.CSS[1]]: 'Component library for TailwindCSS',
        [FRONTEND_MODULES.JS[0]]: 'Lightweight reactive JavaScript',
        [FRONTEND_MODULES.JS[1]]: 'Type-safe JavaScript'
    }
    return descriptions[name] || 'CouchCMS module'
}

/**
 * Get agent description
 * @param name - Agent name
 * @returns Agent description
 */
export function getAgentDescription(name: string): string {
    return `AI agent for ${name}`
}

