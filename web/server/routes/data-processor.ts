#!/usr/bin/env bun
/**
 * Data processing functions for form data and state management
 * Handles parsing, normalization, and transformation of form data
 */

import { normalizeStringValue, normalizeEditorsArray, parseArrayValue } from './utils'
import { SETUP_TYPES } from './helpers'
import type { FormData, FrameworkConfig, HiddenField, ParseFormDataOptions, CreateHiddenFieldsOptions } from '../types'

export const DEFAULT_PROJECT_NAME = 'my-project'
export const DEFAULT_PROJECT_DESCRIPTION = 'A CouchCMS web application'
export const DEFAULT_SETUP_TYPE = SETUP_TYPES.SIMPLE
export const DEFAULT_CONTEXT_DIR = 'config/context'

/**
 * Parse framework configuration from request data
 * @param data - Query parameters or form body
 * @returns Framework config object or false if disabled
 */
export function parseFrameworkConfig(data: Record<string, unknown>): FrameworkConfig | false {
    const framework = data.framework === 'true'
    if (!framework) {
        return false
    }

    return {
        enabled: true,
        doctrine: data.framework_doctrine === 'true',
        directives: data.framework_directives === 'true',
        playbooks: data.framework_playbooks === 'true',
        enhancements: data.framework_enhancements === 'true'
    }
}

/**
 * Get default project values from query or body
 * @param queryOrBody - Query parameters or form body
 * @returns Default project values
 */
function getProjectDefaults(queryOrBody: Record<string, unknown>): {
    projectName: string
    projectDescription: string
    setupType: string
} {
    return {
        // CRITICAL: preferLast=true for projectName/projectDescription because visible inputs come AFTER hidden fields
        // This ensures we get the value from the visible input, not from hidden fields
        projectName: normalizeStringValue(
            queryOrBody.projectName as string | string[] | undefined,
            DEFAULT_PROJECT_NAME,
            true
        ),
        projectDescription: normalizeStringValue(
            queryOrBody.projectDescription as string | string[] | undefined,
            DEFAULT_PROJECT_DESCRIPTION,
            true
        ),
        setupType: normalizeStringValue(
            queryOrBody.setupType as string | string[] | undefined,
            DEFAULT_SETUP_TYPE,
            false
        )
    }
}

/**
 * Parse form data from query or body
 * @param data - Query parameters or form body
 * @param options - Options
 * @returns Parsed form data
 */
export function parseFormData(
    data: Record<string, unknown>,
    options: ParseFormDataOptions = {}
): FormData {
    const defaults = getProjectDefaults(data)
    if (options.setupType) {
        defaults.setupType = options.setupType
    }

    return {
        ...defaults,
        css: parseArrayValue(data, 'css'),
        js: parseArrayValue(data, 'js'),
        agents: parseArrayValue(data, 'agents'),
        editors: normalizeEditorsArray(parseArrayValue(data, 'editors') as string | string[] | undefined),
        framework: parseFrameworkConfig(data),
        // CRITICAL: Normalize preset to handle arrays and comma-separated values
        // Take first value if array, handle comma-separated strings, default to empty string
        preset: normalizeStringValue(data.preset as string | string[] | undefined, '', false),
        contextDir: (data.contextDir as string) || DEFAULT_CONTEXT_DIR
    }
}

/**
 * Create hidden form fields for state persistence
 * @param data - Data to create hidden fields from
 * @param options - Options
 * @returns Array of hidden field objects
 */
export function createHiddenFields(
    data: Partial<FormData>,
    options: CreateHiddenFieldsOptions = {}
): HiddenField[] {
    const fields: HiddenField[] = []
    const { excludeProjectFields = false } = options

    // Project info - EXCLUDE on project step (they have visible inputs)
    if (!excludeProjectFields) {
        if (data.projectName) {
            fields.push({ name: 'projectName', value: data.projectName })
        }
        if (data.projectDescription) {
            fields.push({ name: 'projectDescription', value: data.projectDescription })
        }
    }
    // setupType is always included (it's always a hidden field)
    if (data.setupType) {
        fields.push({ name: 'setupType', value: data.setupType })
    }

    // Frontend selections
    if (data.css && Array.isArray(data.css)) {
        data.css.forEach(c => fields.push({ name: 'css', value: c }))
    }
    if (data.js && Array.isArray(data.js)) {
        data.js.forEach(j => fields.push({ name: 'js', value: j }))
    }

    // Agents
    if (data.agents && Array.isArray(data.agents)) {
        data.agents.forEach(a => {
            if (a != null && a !== '' && a !== 'undefined') {
                fields.push({ name: 'agents', value: a })
            }
        })
    }

    // Editors
    if (data.editors && data.editors.length > 0) {
        data.editors.forEach(e => {
            if (e != null && e !== '' && e !== 'undefined') {
                fields.push({ name: 'editors', value: e })
            }
        })
    }

    // Framework options
    if (data.framework && data.framework !== false) {
        fields.push({ name: 'framework', value: 'true' })
        if (data.framework.doctrine) {
            fields.push({ name: 'framework_doctrine', value: 'true' })
        }
        if (data.framework.directives) {
            fields.push({ name: 'framework_directives', value: 'true' })
        }
        if (data.framework.playbooks) {
            fields.push({ name: 'framework_playbooks', value: 'true' })
        }
        if (data.framework.enhancements) {
            fields.push({ name: 'framework_enhancements', value: 'true' })
        }
    }

    // Preset
    if (data.preset) {
        fields.push({ name: 'preset', value: data.preset })
    }

    // Context directory
    if (data.contextDir) {
        fields.push({ name: 'contextDir', value: data.contextDir })
    }

    return fields
}

/**
 * Normalize project name and description to prevent duplication
 * @param formData - Form data object
 * @returns Normalized form data
 */
export function normalizeProjectFields<T extends { projectName?: string; projectDescription?: string }>(
    formData: T
): T {
    const normalized = { ...formData }

    // CRITICAL: Ensure projectName and projectDescription are always single values (no comma-separated duplicates)
    // This prevents displaying "my-project,my-project,my-projecttest" in the input field
    if (normalized.projectName && typeof normalized.projectName === 'string' && normalized.projectName.includes(',')) {
        const parts = normalized.projectName.split(',').map(p => p.trim()).filter(p => p)
        normalized.projectName = parts.length > 0 ? parts[parts.length - 1] : DEFAULT_PROJECT_NAME
    }
    if (normalized.projectDescription && typeof normalized.projectDescription === 'string' && normalized.projectDescription.includes(',')) {
        const parts = normalized.projectDescription.split(',').map(p => p.trim()).filter(p => p)
        normalized.projectDescription = parts.length > 0 ? parts[parts.length - 1] : DEFAULT_PROJECT_DESCRIPTION
    }

    return normalized
}

/**
 * Normalize body data to handle array values from form submissions
 * @param body - Request body
 * @returns Normalized body
 */
export function normalizeBodyData(body: Record<string, unknown>): Record<string, unknown> {
    const normalized = { ...body }

    // CRITICAL: Normalize projectName and projectDescription to prevent duplication
    // When both visible input and hidden fields exist, parseBody creates arrays
    if (Array.isArray(normalized.projectName)) {
        // Take the first non-empty value (visible input takes precedence)
        const values = normalized.projectName as unknown[]
        normalized.projectName = values.find(v => v && v !== '' && v !== 'undefined') || values[0]
    }
    if (Array.isArray(normalized.projectDescription)) {
        const values = normalized.projectDescription as unknown[]
        normalized.projectDescription = values.find(v => v && v !== '' && v !== 'undefined') || values[0]
    }

    return normalized
}

