#!/usr/bin/env bun
/**
 * Tests for string utilities
 */

import { describe, test, expect } from 'bun:test'
import {
    replaceVariables,
    toKebabCase,
    toCamelCase,
    toPascalCase,
    truncate,
    pluralize
} from '../../scripts/lib/string-utils.js'

describe('String Utilities', () => {
    describe('replaceVariables', () => {
        test('should replace simple variables', () => {
            const content = 'Hello {{name}}!'
            const variables = { name: 'World' }
            expect(replaceVariables(content, variables)).toBe('Hello World!')
        })

        test('should replace nested variables', () => {
            const content = 'CSS: {{paths.css}}, JS: {{paths.js}}'
            const variables = {
                paths: {
                    css: 'assets/css',
                    js: 'assets/js'
                }
            }
            expect(replaceVariables(content, variables)).toBe('CSS: assets/css, JS: assets/js')
        })

        test('should handle multiple occurrences', () => {
            const content = '{{name}} says {{name}}'
            const variables = { name: 'Alice' }
            expect(replaceVariables(content, variables)).toBe('Alice says Alice')
        })

        test('should handle missing variables', () => {
            const content = 'Hello {{name}}!'
            const variables = {}
            expect(replaceVariables(content, variables)).toBe('Hello {{name}}!')
        })
    })

    describe('toKebabCase', () => {
        test('should convert camelCase to kebab-case', () => {
            expect(toKebabCase('camelCase')).toBe('camel-case')
        })

        test('should convert PascalCase to kebab-case', () => {
            expect(toKebabCase('PascalCase')).toBe('pascal-case')
        })

        test('should convert spaces to hyphens', () => {
            expect(toKebabCase('hello world')).toBe('hello-world')
        })

        test('should convert underscores to hyphens', () => {
            expect(toKebabCase('hello_world')).toBe('hello-world')
        })
    })

    describe('toCamelCase', () => {
        test('should convert kebab-case to camelCase', () => {
            expect(toCamelCase('kebab-case')).toBe('kebabCase')
        })

        test('should convert snake_case to camelCase', () => {
            expect(toCamelCase('snake_case')).toBe('snakeCase')
        })

        test('should convert spaces to camelCase', () => {
            expect(toCamelCase('hello world')).toBe('helloWorld')
        })
    })

    describe('toPascalCase', () => {
        test('should convert kebab-case to PascalCase', () => {
            expect(toPascalCase('kebab-case')).toBe('KebabCase')
        })

        test('should convert snake_case to PascalCase', () => {
            expect(toPascalCase('snake_case')).toBe('SnakeCase')
        })

        test('should convert camelCase to PascalCase', () => {
            expect(toPascalCase('camelCase')).toBe('CamelCase')
        })
    })

    describe('truncate', () => {
        test('should not truncate short strings', () => {
            expect(truncate('short', 10)).toBe('short')
        })

        test('should truncate long strings', () => {
            expect(truncate('this is a long string', 10)).toBe('this is...')
        })

        test('should handle exact length', () => {
            expect(truncate('exactly10!', 10)).toBe('exactly10!')
        })
    })

    describe('pluralize', () => {
        test('should return singular for count of 1', () => {
            expect(pluralize(1, 'item')).toBe('item')
        })

        test('should return plural for count > 1', () => {
            expect(pluralize(2, 'item')).toBe('items')
        })

        test('should use custom plural form', () => {
            expect(pluralize(2, 'child', 'children')).toBe('children')
        })

        test('should return plural for count of 0', () => {
            expect(pluralize(0, 'item')).toBe('items')
        })
    })
})
