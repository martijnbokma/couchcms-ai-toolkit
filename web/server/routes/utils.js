#!/usr/bin/env bun
/**
 * Utility functions for route handlers
 * Shared normalization and data processing utilities
 */

/**
 * Parse query parameters from Hono request, handling multiple values with same name
 * Hono's c.req.query() may not handle multiple values correctly, so we parse the URL directly
 * @param {string} url - Request URL (can be absolute or relative)
 * @returns {Object} Parsed query parameters with arrays for multiple values
 */
export function parseQueryParams(url) {
    let urlObj
    try {
        // Try to parse as absolute URL first
        urlObj = new URL(url)
    } catch (e) {
        // If that fails, try as relative URL with a base
        try {
            urlObj = new URL(url, 'http://localhost')
        } catch (e2) {
            // If both fail, return empty object
            console.warn('[parseQueryParams] Failed to parse URL:', url)
            return {}
        }
    }

    const queryParams = {}

    // Parse all query parameters, handling multiple values with same name
    urlObj.searchParams.forEach((value, key) => {
        if (queryParams[key]) {
            // If key already exists, convert to array
            if (Array.isArray(queryParams[key])) {
                queryParams[key].push(value)
            } else {
                queryParams[key] = [queryParams[key], value]
            }
        } else {
            queryParams[key] = value
        }
    })

    return queryParams
}

/**
 * Normalize a value to a string, handling arrays and comma-separated values
 * @param {string|string[]|undefined} value - Value to normalize
 * @param {string} defaultValue - Default value if value is empty
 * @param {boolean} preferLast - If true, take last value from array (for visible inputs), else take first
 * @returns {string} Normalized string value
 */
export function normalizeStringValue(value, defaultValue, preferLast = false) {
    if (!value) {
        return defaultValue
    }

    // Handle arrays (from multiple form fields with same name)
    if (Array.isArray(value)) {
        const validValues = value.filter(v => v && v !== '' && v !== 'undefined' && v !== 'null')
        if (validValues.length === 0) {
            return defaultValue
        }
        return preferLast ? validValues[validValues.length - 1] : validValues[0]
    }

    // Handle strings - split on comma if needed
    if (typeof value === 'string') {
        const trimmed = value.trim()
        if (!trimmed) {
            return defaultValue
        }

        // If value contains commas, split and take appropriate part
        if (trimmed.includes(',')) {
            const parts = trimmed.split(',').map(p => p.trim()).filter(p => p)
            if (parts.length > 0) {
                return preferLast ? parts[parts.length - 1] : parts[0]
            }
            return defaultValue
        }

        return trimmed
    }

    return String(value)
}

/**
 * Normalize editors array to always be an array with UNIQUE values
 * @param {string|string[]|undefined} editors - Editors value
 * @returns {string[]} Array of unique editor IDs
 */
export function normalizeEditorsArray(editors) {
    let result = []

    if (Array.isArray(editors)) {
        result = editors.filter(e => e != null && e !== '' && e !== 'undefined')
    } else if (editors != null && editors !== '' && editors !== 'undefined') {
        result = [editors]
    }

    // Remove duplicates using Set
    return [...new Set(result)]
}

/**
 * Parse array values from query parameters or form body
 * Handles both array format and multiple inputs with same name
 * @param {Object} data - Query parameters or form body
 * @param {string} key - Key to extract array values for
 * @returns {string[]} Array of unique values
 */
export function parseArrayValue(data, key) {
    const values = []

    // When parseBody({ all: true }) is used, fields with multiple values are already arrays
    if (Array.isArray(data[key])) {
        const filtered = data[key].filter(v => v != null && v !== '' && v !== 'undefined')
        if (filtered.length > 0) {
            return filtered
        }
    }

    // Check if it's a single value
    if (data[key] != null && data[key] !== '' && data[key] !== 'undefined') {
        return [data[key]]
    }

    // Fallback: Collect all values with this key (handles edge cases)
    // This handles URL query params like ?css=tailwindcss&css=daisyui
    for (const [k, v] of Object.entries(data)) {
        if (k === key || k.startsWith(`${key}[`) || k.startsWith(`${key}.`)) {
            if (v != null && v !== '' && v !== 'undefined') {
                if (Array.isArray(v)) {
                    v.forEach(item => {
                        if (item != null && item !== '' && item !== 'undefined' && !values.includes(item)) {
                            values.push(item)
                        }
                    })
                } else if (!values.includes(v)) {
                    values.push(v)
                }
            }
        }
    }

    return values
}
