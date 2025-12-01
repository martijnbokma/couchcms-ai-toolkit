#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Presets Loader
 *
 * Centralized preset loading and management
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import yaml from 'yaml'
import { getToolkitRootCached } from './paths.js'

/**
 * Load available presets from presets.yaml
 * @param {string} [toolkitPath] - Optional toolkit path (defaults to cached root)
 * @returns {Object} Presets configuration object
 */
export function loadPresets(toolkitPath = null) {
    const root = toolkitPath || getToolkitRootCached()
    const presetsPath = join(root, 'presets.yaml')

    if (!existsSync(presetsPath)) {
        return {}
    }

    try {
        const content = readFileSync(presetsPath, 'utf8')
        const data = yaml.parse(content)
        return data.presets || {}
    } catch (error) {
        console.warn(`⚠️  Failed to parse presets.yaml: ${error.message}`)
        return {}
    }
}

/**
 * Get a specific preset by key
 * @param {string} presetKey - Preset key (e.g., 'couchcms-complete')
 * @param {string} [toolkitPath] - Optional toolkit path
 * @returns {Object|null} Preset object or null if not found
 */
export function getPreset(presetKey, toolkitPath = null) {
    const presets = loadPresets(toolkitPath)
    return presets[presetKey] || null
}

/**
 * Get all preset keys
 * @param {string} [toolkitPath] - Optional toolkit path
 * @returns {Array<string>} Array of preset keys
 */
export function getPresetKeys(toolkitPath = null) {
    const presets = loadPresets(toolkitPath)
    return Object.keys(presets)
}

/**
 * Check if a preset exists
 * @param {string} presetKey - Preset key to check
 * @param {string} [toolkitPath] - Optional toolkit path
 * @returns {boolean} True if preset exists
 */
export function hasPreset(presetKey, toolkitPath = null) {
    const presets = loadPresets(toolkitPath)
    return presetKey in presets
}
