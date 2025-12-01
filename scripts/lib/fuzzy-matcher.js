#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Fuzzy String Matcher
 *
 * Provides fuzzy matching for module/agent names with suggestions
 */

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Distance (lower is more similar)
 */
function levenshteinDistance(str1, str2) {
    const len1 = str1.length
    const len2 = str2.length
    const matrix = []

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i]
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1]
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,     // deletion
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j - 1] + 1  // substitution
                )
            }
        }
    }

    return matrix[len1][len2]
}

/**
 * Calculate similarity score between two strings (0-1, higher is more similar)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score (0-1)
 */
function similarity(str1, str2) {
    const maxLen = Math.max(str1.length, str2.length)
    if (maxLen === 0) return 1.0

    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase())
    return 1 - (distance / maxLen)
}

/**
 * Find best matches for a given string
 * @param {string} input - Input string to match
 * @param {Array<string>} candidates - Array of candidate strings
 * @param {number} [threshold=0.6] - Minimum similarity threshold
 * @param {number} [maxResults=5] - Maximum number of results
 * @returns {Array<{name: string, score: number}>} - Sorted array of matches
 */
export function findBestMatches(input, candidates, threshold = 0.6, maxResults = 5) {
    const matches = candidates.map(candidate => ({
        name: candidate,
        score: similarity(input, candidate)
    }))

    // Filter by threshold and sort by score
    return matches
        .filter(match => match.score >= threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
}

/**
 * Get suggestions for invalid module/agent name
 * @param {string} invalidName - Invalid name that was provided
 * @param {Array<string>} validNames - Array of valid names
 * @returns {Array<string>} - Array of suggested names
 */
export function getSuggestions(invalidName, validNames) {
    const matches = findBestMatches(invalidName, validNames, 0.5, 3)
    return matches.map(m => m.name)
}

/**
 * Common typo corrections
 */
const COMMON_TYPOS = {
    'tailwind': 'tailwindcss',
    'alpine': 'alpinejs',
    'couchcms-core': 'couchcms-core',
    'couchcms': 'couchcms',
    'daisy': 'daisyui',
    'typescript': 'typescript',
    'ts': 'typescript',
    'js': 'alpinejs',
    'css': 'tailwindcss'
}

/**
 * Check if input is a common typo and return correction
 * @param {string} input - Input name
 * @returns {string|null} - Corrected name or null
 */
export function checkCommonTypo(input) {
    const lower = input.toLowerCase()
    return COMMON_TYPOS[lower] || null
}

/**
 * Validate and suggest module/agent name
 * @param {string} name - Name to validate
 * @param {Array<string>} validNames - Array of valid names
 * @returns {object} - { isValid: boolean, suggestions: Array<string>, correction: string|null }
 */
export function validateName(name, validNames) {
    // Check exact match
    if (validNames.includes(name)) {
        return { isValid: true, suggestions: [], correction: null }
    }

    // Check common typo
    const typoCorrection = checkCommonTypo(name)
    if (typoCorrection && validNames.includes(typoCorrection)) {
        return {
            isValid: false,
            suggestions: [typoCorrection],
            correction: typoCorrection
        }
    }

    // Find fuzzy matches
    const suggestions = getSuggestions(name, validNames)

    return {
        isValid: false,
        suggestions,
        correction: suggestions.length > 0 ? suggestions[0] : null
    }
}

/**
 * Format validation error with suggestions
 * @param {string} name - Invalid name
 * @param {string} type - 'module' or 'agent'
 * @param {Array<string>} suggestions - Array of suggestions
 * @returns {string} - Formatted error message
 */
export function formatNameError(name, type, suggestions) {
    let message = `${type} "${name}" not found`

    if (suggestions.length > 0) {
        message += `\n\n💡 Did you mean:\n`
        suggestions.forEach((suggestion, index) => {
            message += `   ${index + 1}. ${suggestion}\n`
        })
        message += `\n   Update standards.md with the correct name.`
    } else {
        message += `\n\n💡 Run "bun ai-toolkit-shared/scripts/browse.js" to see all available ${type}s.`
    }

    return message
}

