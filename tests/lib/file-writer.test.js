#!/usr/bin/env bun
/**
 * Tests for file writer
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs'
import { join } from 'path'
import {
    writeConfigs,
    writeConfig,
    formatWriteStats
} from '../../scripts/lib/file-writer.js'

const TEST_DIR = join(process.cwd(), 'tests', 'tmp', 'file-writer')

describe('File Writer', () => {
    beforeEach(() => {
        // Clean up test directory
        if (existsSync(TEST_DIR)) {
            rmSync(TEST_DIR, { recursive: true, force: true })
        }
        mkdirSync(TEST_DIR, { recursive: true })
    })

    afterEach(() => {
        // Clean up test directory
        if (existsSync(TEST_DIR)) {
            rmSync(TEST_DIR, { recursive: true, force: true })
        }
    })

    describe('writeConfigs', () => {
        test('should write multiple config files', () => {
            const configs = new Map([
                ['.cursorrules', '# Cursor rules\nTest content'],
                ['.claude/settings.json', '{"test": true}'],
                ['.windsurf/rules.md', '# Windsurf rules']
            ])

            const stats = writeConfigs(configs, TEST_DIR)

            expect(stats.written).toBe(3)
            expect(stats.skipped).toBe(0)
            expect(stats.failed).toBe(0)
            expect(existsSync(join(TEST_DIR, '.cursorrules'))).toBe(true)
            expect(existsSync(join(TEST_DIR, '.claude/settings.json'))).toBe(true)
            expect(existsSync(join(TEST_DIR, '.windsurf/rules.md'))).toBe(true)
        })

        test('should skip unchanged files', () => {
            const configs = new Map([
                ['.cursorrules', 'Test content']
            ])

            // Write first time
            const stats1 = writeConfigs(configs, TEST_DIR)
            expect(stats1.written).toBe(1)
            expect(stats1.skipped).toBe(0)

            // Write again with same content
            const stats2 = writeConfigs(configs, TEST_DIR)
            expect(stats2.written).toBe(0)
            expect(stats2.skipped).toBe(1)
        })

        test('should write changed files', () => {
            const configs1 = new Map([
                ['.cursorrules', 'Old content']
            ])

            const configs2 = new Map([
                ['.cursorrules', 'New content']
            ])

            // Write first time
            writeConfigs(configs1, TEST_DIR)

            // Write again with different content
            const stats = writeConfigs(configs2, TEST_DIR)
            expect(stats.written).toBe(1)
            expect(stats.skipped).toBe(0)

            const content = readFileSync(join(TEST_DIR, '.cursorrules'), 'utf8')
            expect(content).toBe('New content')
        })

        test('should handle empty configs map', () => {
            const configs = new Map()
            const stats = writeConfigs(configs, TEST_DIR)

            expect(stats.written).toBe(0)
            expect(stats.skipped).toBe(0)
            expect(stats.failed).toBe(0)
        })

        test('should create nested directories', () => {
            const configs = new Map([
                ['nested/deep/config.txt', 'Nested content'],
                ['.claude/skills/skill.json', '{"skill": true}']
            ])

            const stats = writeConfigs(configs, TEST_DIR)

            expect(stats.written).toBe(2)
            expect(stats.failed).toBe(0)
            expect(existsSync(join(TEST_DIR, 'nested/deep/config.txt'))).toBe(true)
            expect(existsSync(join(TEST_DIR, '.claude/skills/skill.json'))).toBe(true)
        })
    })

    describe('writeConfig', () => {
        test('should write single config file', () => {
            const written = writeConfig('.cursorrules', 'Test content', TEST_DIR)

            expect(written).toBe(true)
            expect(existsSync(join(TEST_DIR, '.cursorrules'))).toBe(true)
        })

        test('should skip unchanged file', () => {
            // Write first time
            writeConfig('.cursorrules', 'Test content', TEST_DIR)

            // Write again with same content
            const written = writeConfig('.cursorrules', 'Test content', TEST_DIR)

            expect(written).toBe(false)
        })

        test('should write changed file', () => {
            // Write first time
            writeConfig('.cursorrules', 'Old content', TEST_DIR)

            // Write again with different content
            const written = writeConfig('.cursorrules', 'New content', TEST_DIR)

            expect(written).toBe(true)
            const content = readFileSync(join(TEST_DIR, '.cursorrules'), 'utf8')
            expect(content).toBe('New content')
        })
    })

    describe('formatWriteStats', () => {
        test('should format stats with all values', () => {
            const stats = { written: 3, skipped: 2, failed: 1 }
            const formatted = formatWriteStats(stats)

            expect(formatted).toBe('3 written, 2 skipped, 1 failed')
        })

        test('should format stats with only written', () => {
            const stats = { written: 5, skipped: 0, failed: 0 }
            const formatted = formatWriteStats(stats)

            expect(formatted).toBe('5 written')
        })

        test('should format stats with written and skipped', () => {
            const stats = { written: 2, skipped: 3, failed: 0 }
            const formatted = formatWriteStats(stats)

            expect(formatted).toBe('2 written, 3 skipped')
        })

        test('should handle zero values', () => {
            const stats = { written: 0, skipped: 0, failed: 0 }
            const formatted = formatWriteStats(stats)

            expect(formatted).toBe('')
        })
    })
})
