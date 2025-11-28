#!/usr/bin/env bun
/**
 * Integration test for Claude Settings Generation
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { prepareTemplateData, renderTemplates } from '../scripts/lib/template-engine.js'

describe('Claude Settings Generation', () => {
    const testDir = join(process.cwd(), 'tests', 'fixtures', 'claude-settings-test')
    const toolkitPath = process.cwd()

    beforeAll(() => {
        // Create test directory
        if (existsSync(testDir)) {
            rmSync(testDir, { recursive: true, force: true })
        }
        mkdirSync(testDir, { recursive: true })
    })

    afterAll(() => {
        // Cleanup
        if (existsSync(testDir)) {
            rmSync(testDir, { recursive: true, force: true })
        }
    })

    test('should generate valid Claude settings JSON', async () => {
        const config = {
            project: {
                name: 'Test Project',
                type: 'CouchCMS Web Application',
                description: 'Test project for Claude settings'
            },
            paths: {
                src: 'src',
                tests: 'tests',
                docs: 'docs'
            }
        }

        const mergedConfig = {
            paths: config.paths,
            standards: { indentation: 4, lineLength: 120 },
            naming: {}
        }

        const modules = [{
            name: 'couchcms-core',
            meta: {
                name: 'CouchCMS Core',
                description: 'Core CouchCMS functionality',
                version: '1.0'
            },
            content: '# CouchCMS Core'
        }]

        const agents = []

        const templateData = prepareTemplateData(
            config,
            mergedConfig,
            modules,
            agents,
            null,
            null,
            toolkitPath,
            testDir
        )

        // Render Claude settings template
        const configs = await renderTemplates(templateData, ['claude-settings'], toolkitPath)

        expect(configs.size).toBe(1)
        expect(configs.has('.claude/settings.json')).toBe(true)

        const settingsContent = configs.get('.claude/settings.json')
        expect(settingsContent).toBeDefined()

        // Parse JSON to verify it's valid
        const settings = JSON.parse(settingsContent)

        // Verify structure
        expect(settings.permissions).toBeDefined()
        expect(settings.permissions.allow).toBeArray()
        expect(settings.permissions.deny).toBeArray()
        expect(settings.env).toBeDefined()
        expect(settings.env.PROJECT_NAME).toBe('Test Project')
        expect(settings.env.PROJECT_TYPE).toBe('CouchCMS Web Application')

        // Verify permissions include project paths
        const allowPermissions = settings.permissions.allow.join(' ')
        expect(allowPermissions).toContain('Read(src/**)')
        expect(allowPermissions).toContain('Write(src/**)')
        expect(allowPermissions).toContain('Read(tests/**)')
        expect(allowPermissions).toContain('Write(tests/**)')
        expect(allowPermissions).toContain('Read(docs/**)')
        expect(allowPermissions).toContain('Write(docs/**)')

        // Verify deny permissions include sensitive files
        const denyPermissions = settings.permissions.deny.join(' ')
        expect(denyPermissions).toContain('Read(./.env)')
        expect(denyPermissions).toContain('Read(./.env.*)')
        expect(denyPermissions).toContain('Read(./secrets/**)')
        expect(denyPermissions).toContain('Bash(rm -rf *)')
        expect(denyPermissions).toContain('Bash(sudo *)')

        // Verify slash commands
        expect(settings.slashCommands).toBeDefined()
        expect(settings.slashCommands.sync).toBeDefined()
        expect(settings.slashCommands.sync.command).toBe('bun run sync')
        expect(settings.slashCommands.validate).toBeDefined()
        expect(settings.slashCommands.test).toBeDefined()
    })

    test('should handle missing paths gracefully', async () => {
        const config = {
            project: {
                name: 'Minimal Project',
                type: 'Web App',
                description: 'Minimal test'
            }
            // No paths defined
        }

        const mergedConfig = {
            paths: {},
            standards: { indentation: 4, lineLength: 120 },
            naming: {}
        }

        const templateData = prepareTemplateData(
            config,
            mergedConfig,
            [],
            [],
            null,
            null,
            toolkitPath,
            testDir
        )

        const configs = await renderTemplates(templateData, ['claude-settings'], toolkitPath)
        const settingsContent = configs.get('.claude/settings.json')
        const settings = JSON.parse(settingsContent)

        // Should still have basic permissions
        expect(settings.permissions.allow).toBeArray()
        expect(settings.permissions.deny).toBeArray()
        expect(settings.permissions.allow.length).toBeGreaterThan(0)
        expect(settings.permissions.deny.length).toBeGreaterThan(0)
    })

    test('should validate permission patterns', async () => {
        const config = {
            project: {
                name: 'Test Project',
                type: 'Web App',
                description: 'Test'
            }
        }

        const mergedConfig = {
            paths: {},
            standards: { indentation: 4, lineLength: 120 },
            naming: {}
        }

        const templateData = prepareTemplateData(
            config,
            mergedConfig,
            [],
            [],
            null,
            null,
            toolkitPath,
            testDir
        )

        const configs = await renderTemplates(templateData, ['claude-settings'], toolkitPath)
        const settingsContent = configs.get('.claude/settings.json')
        const settings = JSON.parse(settingsContent)

        // Verify all permissions follow the pattern: Action(pattern)
        const validPatternRegex = /^(Read|Write|Bash)\(.+\)$/

        for (const permission of settings.permissions.allow) {
            expect(validPatternRegex.test(permission)).toBe(true)
        }

        for (const permission of settings.permissions.deny) {
            expect(validPatternRegex.test(permission)).toBe(true)
        }
    })
})
