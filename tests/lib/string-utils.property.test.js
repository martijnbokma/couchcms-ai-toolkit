#!/usr/bin/env bun
/**
 * Property-based tests for string utilities
 * 
 * These tests verify properties that should hold for all inputs
 */

import { describe, test } from 'bun:test'
import * as fc from 'fast-check'
import {
    toKebabCase,
    toCamelCase,
    toPascalCase,
    truncate
} from '../../scripts/lib/string-utils.js'

describe('String Utilities - Property Tests', () => {
    test('toKebabCase should always return lowercase', () => {
        fc.assert(
            fc.property(fc.string(), (str) => {
                const result = toKebabCase(str)
                return result === result.toLowerCase()
            }),
            { numRuns: 100 }
        )
    })

    test('toKebabCase should not contain spaces or underscores', () => {
        fc.assert(
            fc.property(fc.string(), (str) => {
                const result = toKebabCase(str)
                return !result.includes(' ') && !result.includes('_')
            }),
            { numRuns: 100 }
        )
    })

    test('toCamelCase should start with lowercase letter', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }).filter(s => /[a-zA-Z]/.test(s)),
                (str) => {
                    const result = toCamelCase(str)
                    if (result.length === 0) return true
                    const firstChar = result[0]
                    return firstChar === firstChar.toLowerCase() || !/[a-zA-Z]/.test(firstChar)
                }
            ),
            { numRuns: 100 }
        )
    })

    test('toPascalCase should start with uppercase letter', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }).filter(s => /[a-zA-Z]/.test(s)),
                (str) => {
                    const result = toPascalCase(str)
                    if (result.length === 0) return true
                    const firstChar = result[0]
                    return firstChar === firstChar.toUpperCase() || !/[a-zA-Z]/.test(firstChar)
                }
            ),
            { numRuns: 100 }
        )
    })

    test('truncate should never exceed max length', () => {
        fc.assert(
            fc.property(
                fc.string(),
                fc.integer({ min: 5, max: 100 }),
                (str, maxLength) => {
                    const result = truncate(str, maxLength)
                    return result.length <= maxLength
                }
            ),
            { numRuns: 100 }
        )
    })

    test('truncate should preserve short strings', () => {
        fc.assert(
            fc.property(
                fc.string({ maxLength: 10 }),
                fc.integer({ min: 20, max: 100 }),
                (str, maxLength) => {
                    const result = truncate(str, maxLength)
                    return result === str
                }
            ),
            { numRuns: 100 }
        )
    })
})
