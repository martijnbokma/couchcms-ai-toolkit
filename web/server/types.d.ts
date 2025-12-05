/**
 * Type definitions for server-side code
 */

import type { Context } from 'hono'

/**
 * Extended Hono context with template rendering
 */
export interface HonoContext extends Context {
    renderTemplate: (template: string, context?: Record<string, unknown>) => Promise<string>
}

/**
 * Hono app context with renderTemplate
 */
export type HonoAppContext = HonoContext

/**
 * Form data structure
 */
export interface FormData {
    projectName: string
    projectDescription: string
    setupType: 'simple' | 'extended' | 'presets'
    css: string[]
    js: string[]
    agents: string[]
    editors: string[]
    framework: FrameworkConfig | false
    preset: string
    contextDir: string
}

/**
 * Framework configuration
 */
export interface FrameworkConfig {
    enabled: boolean
    doctrine: boolean
    directives: boolean
    playbooks: boolean
    enhancements: boolean
}

/**
 * Hidden form field
 */
export interface HiddenField {
    name: string
    value: string
}

/**
 * Frontend options structure
 */
export interface FrontendOptions {
    css: FrontendOption[]
    js: FrontendOption[]
}

export interface FrontendOption {
    id: string
    name: string
    description: string
    selected: boolean
}

/**
 * Agent options structure
 */
export interface AgentOptions {
    frontend: AgentOption[]
    devTools: AgentOption[]
}

export interface AgentOption {
    id: string
    name: string
    description: string
    selected: boolean
}

/**
 * Editor grouping
 */
export interface EditorGrouping {
    popular: EditorOption[]
    other: EditorOption[]
}

export interface EditorOption {
    id: string
    name: string
    description?: string
    selected: boolean
}

/**
 * Module metadata
 */
export interface ModuleMetadata {
    id: string
    name: string
    category: string
    version: string
    description: string
    summary: string
    required: boolean
    requires: string[]
    conflicts: string[]
    content: string
    path: string | null
}

/**
 * Agent metadata
 */
export interface AgentMetadata {
    name: string
    type: string
    version: string
    description: string
    summary: string
    tags: string[]
    category: string
    content: string
    path: string | null
}

/**
 * CouchCMS items from toolkit
 */
export interface CouchCMSItems {
    couchcmsModules: string[]
    couchcmsAgents: string[]
}

/**
 * Enriched CouchCMS items
 */
export interface EnrichedCouchCMSItems {
    modules: Array<ModuleMetadata & { name: string }>
    agents: Array<AgentMetadata & { name: string }>
}

/**
 * Grouped items by category
 */
export interface GroupedItems {
    [category: string]: Array<ModuleMetadata | AgentMetadata>
}

/**
 * Review step data
 */
export interface ReviewStepData {
    setupType: string
    projectName: string
    projectDescription: string
    frontend: {
        css: string[]
        js: string[]
    }
    editors: string[]
    framework: FrameworkConfig | false
    contextDir: string
    preset: string
    presetData: PresetData | null
    couchcmsModules?: string[]
    couchcmsAgents?: string[]
}

/**
 * Preset data
 */
export interface PresetData {
    name: string
    description: string
    modules: string[]
    agents: string[]
    framework?: FrameworkConfig | false
}

/**
 * Configuration for project generation
 */
export interface ProjectConfig {
    projectName: string
    projectDescription: string
    setupType: 'simple' | 'extended' | 'presets'
    preset?: string
    cssFrameworks: string[]
    jsFrameworks: string[]
    couchcmsModules?: string[]
    couchcmsAgents?: string[]
    editors: string[]
    frameworkConfig: FrameworkConfig | false
    contextDir: string
}

/**
 * Parse form data options
 */
export interface ParseFormDataOptions {
    setupType?: 'simple' | 'extended' | 'presets'
}

/**
 * Create hidden fields options
 */
export interface CreateHiddenFieldsOptions {
    excludeProjectFields?: boolean
}

