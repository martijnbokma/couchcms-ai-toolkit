#!/usr/bin/env bun
/**
 * Tests for migration script
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const TEST_DIR = join(process.cwd(), 'tests', 'fixtures', 'migration-test')
const MIGRATE_SCRIPT = join(process.cwd(), 'scripts', 'migrate.js')

describe('Migration Script', () => {
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

    it('should detect old configuration files', () => {
        // Create old config files
        writeFileSync(
            join(TEST_DIR, 'defaults.yaml'),
            `
paths:
  css: "assets/css"
  typescript: "assets/ts"

standards:
  indentation: 4
  language: "english"
`
        )

        writeFileSync(
            join(TEST_DIR, 'smart-defaults.yaml'),
            `
file_contexts:
  "*.php":
    agents: [couchcms]
    modules: [couchcms-core]
`
        )

        writeFileSync(
            join(TEST_DIR, 'standards.md'),
            `---
name: "test-project"
description: "Test project"
modules:
  - couchcms-core
agents:
  - couchcms
---

# Test Project
`
        )

        // Run migration in dry-run mode
        const output = execSync(`cd ${TEST_DIR} && bun ${MIGRATE_SCRIPT} --dry-run --force`, {
            encoding: 'utf8',
        })

        expect(output).toContain('Found 3 old configuration file(s)')
        expect(output).toContain('defaults.yaml')
        expect(output).toContain('smart-defaults.yaml')
        expect(output).toContain('standards.md')
    })

    it('should merge configurations correctly', () => {
        // Create old config files
        writeFileSync(
            join(TEST_DIR, 'defaults.yaml'),
            `
paths:
  css: "assets/css"
  typescript: "assets/ts"

standards:
  indentation: 4
  language: "english"
  lineLength: 120

naming:
  php_variables: "snake_case"
  ts_variables: "camelCase"
`
        )

        writeFileSync(
            join(TEST_DIR, 'standards.md'),
            `---
name: "test-project"
description: "Test project"
modules:
  - couchcms-core
  - tailwindcss
agents:
  - couchcms
  - tailwindcss
framework: false
---

# Test Project
`
        )

        // Run migration
        execSync(`cd ${TEST_DIR} && bun ${MIGRATE_SCRIPT} --force`, {
            encoding: 'utf8',
        })

        // Verify config.yaml was created
        expect(existsSync(join(TEST_DIR, 'config.yaml'))).toBe(true)

        // Read and parse the generated config
        const configContent = readFileSync(join(TEST_DIR, 'config.yaml'), 'utf8')

        // Verify merged content (YAML format may have quoted keys)
        expect(configContent).toContain('test-project')
        expect(configContent).toContain('Test project')
        expect(configContent).toContain('couchcms-core')
        expect(configContent).toContain('tailwindcss')
        // YAML may output quoted keys: "css": "assets/css" or css: "assets/css"
        expect(configContent).toContain('assets/css')
        expect(configContent).toContain('indentation')
        expect(configContent).toContain('4')
        expect(configContent).toContain('snake_case')
    })

    it('should backup old files', () => {
        // Create old config files
        writeFileSync(join(TEST_DIR, 'defaults.yaml'), 'paths:\n  css: "assets/css"')
        writeFileSync(join(TEST_DIR, 'standards.md'), '---\nname: "test"\n---\n# Test')

        // Run migration
        execSync(`cd ${TEST_DIR} && bun ${MIGRATE_SCRIPT} --force`, {
            encoding: 'utf8',
        })

        // Verify backup directory was created
        const backupDir = join(TEST_DIR, '.config-backup')
        expect(existsSync(backupDir)).toBe(true)

        // Verify old files were moved to backup
        expect(existsSync(join(TEST_DIR, 'defaults.yaml'))).toBe(false)
        expect(existsSync(join(TEST_DIR, 'standards.md'))).toBe(false)

        // Verify backup files exist
        const backupFiles = execSync(`ls ${backupDir}`, { encoding: 'utf8' })
        expect(backupFiles).toContain('defaults.yaml')
        expect(backupFiles).toContain('standards.md')
    })

    it('should skip backup with --no-backup flag', () => {
        // Create old config files
        writeFileSync(join(TEST_DIR, 'defaults.yaml'), 'paths:\n  css: "assets/css"')

        // Run migration with --no-backup
        execSync(`cd ${TEST_DIR} && bun ${MIGRATE_SCRIPT} --force --no-backup`, {
            encoding: 'utf8',
        })

        // Verify backup directory was NOT created
        const backupDir = join(TEST_DIR, '.config-backup')
        expect(existsSync(backupDir)).toBe(false)

        // Verify config.yaml was created
        expect(existsSync(join(TEST_DIR, 'config.yaml'))).toBe(true)
    })

    it('should fail if config.yaml exists without --force', () => {
        // Create old config file and existing config.yaml
        writeFileSync(join(TEST_DIR, 'defaults.yaml'), 'paths:\n  css: "assets/css"')
        writeFileSync(join(TEST_DIR, 'config.yaml'), '# Existing config')

        // Run migration without --force (should fail)
        try {
            execSync(`cd ${TEST_DIR} && bun ${MIGRATE_SCRIPT}`, {
                encoding: 'utf8',
                stdio: 'pipe',
            })
            expect(true).toBe(false) // Should not reach here
        } catch (error) {
            // Capture error output from stderr, stdout, or message
            const errorOutput = String(
                error.stderr || error.stdout || error.message || error.toString() || ''
            )
            const lowerOutput = errorOutput.toLowerCase()
            expect(
                lowerOutput.includes('config.yaml') ||
                lowerOutput.includes('already exists') ||
                lowerOutput.includes('exists')
            ).toBe(true)
        }
    })

    it('should show help with --help flag', () => {
        const output = execSync(`bun ${MIGRATE_SCRIPT} --help`, {
            encoding: 'utf8',
        })

        expect(output).toContain('Configuration Migration Script')
        expect(output).toContain('--dry-run')
        expect(output).toContain('--no-backup')
        expect(output).toContain('--force')
    })
})
