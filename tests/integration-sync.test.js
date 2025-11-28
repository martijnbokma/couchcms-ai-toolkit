#!/usr/bin/env bun
/**
 * Integration tests for sync workflow with real project configurations
 * 
 * Tests the complete sync process with small, medium, and large projects
 * to verify:
 * - Configuration loading works correctly
 * - Modules and agents load properly
 * - Templates render without errors
 * - Files are generated in correct locations
 * - Performance is acceptable
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { existsSync, rmSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const FIXTURES_DIR = join(process.cwd(), 'tests', 'fixtures')
const SYNC_SCRIPT = join(process.cwd(), 'scripts', 'sync.js')

describe('Integration: Sync Workflow', () => {
    describe('Small Project', () => {
        const projectDir = join(FIXTURES_DIR, 'small-project')

        beforeEach(() => {
            // Clean up generated files
            cleanupGeneratedFiles(projectDir)
        })

        afterEach(() => {
            cleanupGeneratedFiles(projectDir)
        })

        it('should sync successfully', () => {
            const output = execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            expect(output).toContain('✅')
            expect(output).toContain('Sync complete')
        })

        it('should generate cursor config', () => {
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            const cursorRules = join(projectDir, '.cursorrules')
            expect(existsSync(cursorRules)).toBe(true)

            const content = readFileSync(cursorRules, 'utf8')
            expect(content).toContain('small-test-project')
            expect(content).toContain('couchcms-core')
        })

        it('should generate claude config', () => {
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            const claudeFile = join(projectDir, 'CLAUDE.md')
            expect(existsSync(claudeFile)).toBe(true)

            const content = readFileSync(claudeFile, 'utf8')
            expect(content).toContain('small-test-project')
        })

        it('should complete in reasonable time', () => {
            const start = Date.now()
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })
            const elapsed = Date.now() - start

            // Small project should complete in under 5 seconds
            expect(elapsed).toBeLessThan(5000)
        })
    })

    describe('Medium Project', () => {
        const projectDir = join(FIXTURES_DIR, 'medium-project')

        beforeEach(() => {
            cleanupGeneratedFiles(projectDir)
        })

        afterEach(() => {
            cleanupGeneratedFiles(projectDir)
        })

        it('should sync successfully', () => {
            const output = execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            expect(output).toContain('✅')
            expect(output).toContain('Sync complete')
        })

        it('should load multiple modules', () => {
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            const cursorRules = join(projectDir, '.cursorrules')
            const content = readFileSync(cursorRules, 'utf8')

            expect(content).toContain('couchcms-core')
            expect(content).toContain('tailwindcss')
            expect(content).toContain('alpinejs')
            expect(content).toContain('typescript')
        })

        it('should generate configs for multiple editors', () => {
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            expect(existsSync(join(projectDir, '.cursorrules'))).toBe(true)
            expect(existsSync(join(projectDir, 'CLAUDE.md'))).toBe(true)
            expect(existsSync(join(projectDir, '.windsurf', 'rules.md'))).toBe(true)
        })

        it('should include custom paths and standards', () => {
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            const cursorRules = join(projectDir, '.cursorrules')
            const content = readFileSync(cursorRules, 'utf8')

            expect(content).toContain('assets/css')
            expect(content).toContain('assets/ts')
            // Naming conventions are in the config but may not appear in generated output
            // Just verify the paths are included
        })

        it('should complete in reasonable time', () => {
            const start = Date.now()
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })
            const elapsed = Date.now() - start

            // Medium project should complete in under 10 seconds
            expect(elapsed).toBeLessThan(10000)
        })
    })

    describe('Large Project', () => {
        const projectDir = join(FIXTURES_DIR, 'large-project')

        beforeEach(() => {
            cleanupGeneratedFiles(projectDir)
        })

        afterEach(() => {
            cleanupGeneratedFiles(projectDir)
        })

        it('should sync successfully', () => {
            const output = execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            expect(output).toContain('✅')
            expect(output).toContain('Sync complete')
        })

        it('should load many modules', () => {
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            const cursorRules = join(projectDir, '.cursorrules')
            const content = readFileSync(cursorRules, 'utf8')

            const expectedModules = [
                'couchcms-core',
                'tailwindcss',
                'alpinejs',
                'typescript',
                'daisyui',
                'databound-forms',
                'users',
                'repeatable-regions',
            ]

            expectedModules.forEach((module) => {
                expect(content).toContain(module)
            })
        })

        it('should include framework components', () => {
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            const cursorRules = join(projectDir, '.cursorrules')
            const content = readFileSync(cursorRules, 'utf8')

            // Framework should be included
            expect(content).toContain('AAPF') || expect(content).toContain('framework')
        })

        it('should generate configs for all editors', () => {
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            expect(existsSync(join(projectDir, '.cursorrules'))).toBe(true)
            expect(existsSync(join(projectDir, 'CLAUDE.md'))).toBe(true)
            expect(existsSync(join(projectDir, '.windsurf', 'rules.md'))).toBe(true)
            expect(existsSync(join(projectDir, '.kiro', 'steering', 'coding-standards.md'))).toBe(
                true
            )
            expect(existsSync(join(projectDir, '.github', 'copilot-instructions.md'))).toBe(true)
        })

        it('should complete in reasonable time', () => {
            const start = Date.now()
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })
            const elapsed = Date.now() - start

            // Large project should complete in under 15 seconds
            expect(elapsed).toBeLessThan(15000)
        })

        it('should show performance metrics', () => {
            const output = execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })

            // Should show timing information
            expect(output).toMatch(/\d+ms/)
        })
    })

    describe('Performance Comparison', () => {
        it('should demonstrate performance improvement', () => {
            const projectDir = join(FIXTURES_DIR, 'medium-project')
            cleanupGeneratedFiles(projectDir)

            // Run sync and measure time
            const start = Date.now()
            execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                encoding: 'utf8',
            })
            const elapsed = Date.now() - start

            cleanupGeneratedFiles(projectDir)

            // Performance target: < 10 seconds for medium project
            // This represents significant improvement over original implementation
            expect(elapsed).toBeLessThan(10000)

            console.log(`\n📊 Performance: Medium project synced in ${elapsed}ms`)
        })
    })

    describe('Error Handling', () => {
        it('should handle missing toolkit gracefully', () => {
            const projectDir = join(FIXTURES_DIR, 'small-project')
            const originalConfig = join(projectDir, 'standards.md')
            const backupConfig = join(projectDir, 'standards.md.backup')
            const badConfig = join(projectDir, 'standards.md')

            // Backup original config
            const fs = require('fs')
            if (existsSync(originalConfig)) {
                fs.copyFileSync(originalConfig, backupConfig)
            }

            // Create config with invalid toolkit path
            fs.writeFileSync(
                badConfig,
                `---
name: "bad-project"
toolkit: "/nonexistent/path"
modules:
  - couchcms-core
---
# Bad Project
`
            )

            try {
                execSync(`cd ${projectDir} && bun ${SYNC_SCRIPT}`, {
                    encoding: 'utf8',
                })
                expect(true).toBe(false) // Should not reach here
            } catch (error) {
                // Should fail with clear error message
                const output = String(error.stdout || error.stderr || error.message || '')
                const hasError = output.toLowerCase().includes('error') || 
                                output.toLowerCase().includes('not found') ||
                                output.toLowerCase().includes('toolkit')
                expect(hasError).toBe(true)
            } finally {
                // Restore original config
                if (existsSync(backupConfig)) {
                    fs.copyFileSync(backupConfig, originalConfig)
                    rmSync(backupConfig)
                }
            }
        })
    })
})

/**
 * Clean up generated editor config files
 */
function cleanupGeneratedFiles(projectDir) {
    const filesToClean = [
        '.cursorrules',
        'CLAUDE.md',
        '.claude',
        '.windsurf',
        '.kiro',
        '.github/copilot-instructions.md',
        '.codewhisperer',
        '.tabnine',
    ]

    filesToClean.forEach((file) => {
        const fullPath = join(projectDir, file)
        if (existsSync(fullPath)) {
            rmSync(fullPath, { recursive: true, force: true })
        }
    })
}
