#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Object Utilities
 *
 * Common object manipulation utilities
 */

/**
 * Deep merge two objects
 * Merges source into target, recursively handling nested objects
 * Arrays are replaced (not merged)
 * Null values in source override target (explicit null)
 * Undefined values in source are ignored (keep target value)
 *
 * @param {object} target - Target object to merge into
 * @param {object} source - Source object to merge from
 * @returns {object} - Merged object (new object, does not mutate target)
 */
export function deepMerge(target, source) {
    const result = { ...target }

    for (const key in source) {
        const sourceValue = source[key]
        const targetValue = target[key]

        // Skip undefined values (keep target value)
        if (sourceValue === undefined) {
            continue
        }

        // Handle null explicitly (null overrides target)
        if (sourceValue === null) {
            result[key] = null
            continue
        }

        // Recursively merge objects (but not arrays)
        if (
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue) &&
            typeof targetValue === 'object' &&
            !Array.isArray(targetValue) &&
            targetValue !== null
        ) {
            result[key] = deepMerge(targetValue, sourceValue)
        } else {
            // Replace value (including arrays)
            result[key] = sourceValue
        }
    }

    return result
}

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} - Deep cloned object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime())
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item))
    }

    const cloned = {}
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key])
        }
    }

    return cloned
}

/**
 * Check if two objects are deeply equal
 * @param {object} obj1 - First object
 * @param {object} obj2 - Second object
 * @returns {boolean} - True if objects are deeply equal
 */
export function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true
    }

    if (obj1 == null || obj2 == null) {
        return false
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false
    }

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) {
        return false
    }

    for (const key of keys1) {
        if (!keys2.includes(key)) {
            return false
        }

        if (!deepEqual(obj1[key], obj2[key])) {
            return false
        }
    }

    return true
}
