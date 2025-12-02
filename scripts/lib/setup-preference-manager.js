#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Setup Preference Manager
 *
 * Manages user's setup complexity preference (Easy/Medium/Comprehensive)
 * Stores preference in .toolkit-preference file
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

/**
 * Valid complexity levels
 */
export const COMPLEXITY_LEVELS = {
    EASY: 'easy',
    MEDIUM: 'medium',
    COMPREHENSIVE: 'comprehensive'
}

/**
 * Complexity level descriptions
 */
export const COMPLEXITY_DESCRIPTIONS = {
    [COMPLEXITY_LEVELS.EASY]: {
        name: 'Easy',
        time: '1 minute',
        questions: 2,
        description: 'Quick setup with recommended defaults',
        perfectFor: 'Getting started quickly'
    },
    [COMPLEXITY_LEVELS.MEDIUM]: {
        name: 'Medium',
        time: '3 minutes',
        questions: 5,
        description: 'Balanced setup with more choices',
        perfectFor: 'Most projects, want to choose frameworks'
    },
    [COMPLEXITY_LEVELS.COMPREHENSIVE]: {
        name: 'Comprehensive',
        time: '5 minutes',
        questions: 8,
        description: 'Full setup with all options',
        perfectFor: 'Complete control over frontend setup'
    }
}

/**
 * Get preference file path
 * @param {string} projectDir - Project root directory
 * @returns {string} Path to preference file
 */
function getPreferenceFilePath(projectDir) {
    return join(projectDir, '.toolkit-preference')
}

/**
 * Read stored preference
 * @param {string} projectDir - Project root directory
 * @returns {string|null} Stored complexity level or null if not set
 */
export function readPreference(projectDir) {
    const filePath = getPreferenceFilePath(projectDir)

    if (!existsSync(filePath)) {
        return null
    }

    try {
        const content = readFileSync(filePath, 'utf8').trim()
        const validLevels = Object.values(COMPLEXITY_LEVELS)

        if (validLevels.includes(content)) {
            return content
        }

        return null
    } catch (error) {
        return null
    }
}

/**
 * Write preference to file
 * @param {string} projectDir - Project root directory
 * @param {string} complexity - Complexity level (easy/medium/comprehensive)
 * @returns {void}
 */
export function writePreference(projectDir, complexity) {
    const validLevels = Object.values(COMPLEXITY_LEVELS)

    if (!validLevels.includes(complexity)) {
        throw new Error(`Invalid complexity level: ${complexity}. Must be one of: ${validLevels.join(', ')}`)
    }

    const filePath = getPreferenceFilePath(projectDir)
    writeFileSync(filePath, complexity, 'utf8')
}

/**
 * Validate complexity level
 * @param {string} complexity - Complexity level to validate
 * @returns {boolean} True if valid
 */
export function isValidComplexity(complexity) {
    return Object.values(COMPLEXITY_LEVELS).includes(complexity)
}

/**
 * Get complexity description
 * @param {string} complexity - Complexity level
 * @returns {Object|null} Description object or null if invalid
 */
export function getComplexityDescription(complexity) {
    if (!isValidComplexity(complexity)) {
        return null
    }

    return COMPLEXITY_DESCRIPTIONS[complexity]
}

/**
 * Clear stored preference
 * @param {string} projectDir - Project root directory
 * @returns {void}
 */
export function clearPreference(projectDir) {
    const filePath = getPreferenceFilePath(projectDir)

    if (existsSync(filePath)) {
        unlinkSync(filePath)
    }
}
