/**
 * Test Claude Memory File Generation
 * 
 * Validates that the Claude memory template includes all required sections:
 * - Project overview and context
 * - Architectural decisions and guidelines
 * - Available modules and agents
 * - Development workflow information
 */

import { describe, test, expect } from 'bun:test'
import { prepareTemplateData } from '../scripts/lib/template-engine.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import Handlebars from 'handlebars'

// Register Handlebars helpers
Handlebars.registerHelper('join', function (array, separator) {
    if (!Array.isArray(array)) return ''
    return array.join(separator || ', ')
})

Handlebars.registerHelper('add', function (a, b) {
    return Number(a) + Number(b)
})

describe('Claude Memory File Generation', () => {
    test('should include all required sections', () => {
        // Mock configuration
        const config = {
            project: {
                name: 'Test Project',
                type: 'CouchCMS Web Application',
                description: 'Test project for Claude memory generation'
            },
            languages: ['PHP', 'JavaScript', 'TypeScript'],
            frameworks: ['CouchCMS', 'TailwindCSS', 'Alpine.js']
        }

        const mergedConfig = {
            standards: {
                indentation: 4,
                lineLength: 120,
                language: 'english'
            },
            naming: {
                classes: 'PascalCase',
                php_files: 'kebab-case.php'
            },
            paths: {
                templates: 'couch/snippets',
                assets: 'assets',
                snippets: 'couch/snippets'
            }
        }

        const modules = [
            {
                name: 'couchcms-core',
                meta: {
                    name: 'CouchCMS Core',
                    description: 'Core CouchCMS patterns and security standards',
                    version: '1.0'
                },
                content: 'Module content here'
            },
            {
                name: 'tailwindcss',
                meta: {
                    name: 'TailwindCSS',
                    description: 'TailwindCSS 4 patterns and best practices',
                    version: '1.0'
                },
                content: 'TailwindCSS module content'
            }
        ]

        const agents = [
            {
                name: 'couchcms',
                meta: {
                    name: 'CouchCMS Agent',
                    description: 'Specialized CouchCMS development assistant',
                    type: 'daily'
                },
                content: 'Agent content here'
            }
        ]

        // Prepare template data
        const templateData = prepareTemplateData(
            config,
            mergedConfig,
            modules,
            agents,
            null,
            null,
            '.',
            '.'
        )

        // Load and render template
        const templatePath = join(process.cwd(), 'templates', 'editors', 'claude-memory.template.md')
        const templateContent = readFileSync(templatePath, 'utf8')
        const template = Handlebars.compile(templateContent)
        const rendered = template(templateData)

        // Verify all required sections are present
        expect(rendered).toContain('# Claude Memory - Test Project')
        expect(rendered).toContain('## Project Overview')
        expect(rendered).toContain('## Architectural Decisions and Guidelines')
        expect(rendered).toContain('## Technology Stack')
        expect(rendered).toContain('## Active Modules')
        expect(rendered).toContain('## Available Agents')
        expect(rendered).toContain('## Operational Workflow')

        // Verify project overview content
        expect(rendered).toContain('Test Project')
        expect(rendered).toContain('CouchCMS Web Application')
        expect(rendered).toContain('PHP, JavaScript, TypeScript')
        expect(rendered).toContain('CouchCMS, TailwindCSS, Alpine.js')

        // Verify architectural decisions content
        expect(rendered).toContain('Project Architecture')
        expect(rendered).toContain('Development Guidelines')
        expect(rendered).toContain('Code Organization')
        expect(rendered).toContain('standards.md')

        // Verify modules are listed
        expect(rendered).toContain('CouchCMS Core')
        expect(rendered).toContain('Core CouchCMS patterns and security standards')
        expect(rendered).toContain('TailwindCSS')

        // Verify agents are listed
        expect(rendered).toContain('@couchcms')
        expect(rendered).toContain('Specialized CouchCMS development assistant')

        // Verify workflow information
        expect(rendered).toContain('Reconnaissance → Plan → Execute → Verify → Report')
        expect(rendered).toContain('Read Before Write')
        expect(rendered).toContain('Reread After Write')
    })

    test('should include CouchCMS rules when CMS modules are present', () => {
        const config = {
            project: { name: 'CMS Project', type: 'CouchCMS', description: 'Test' }
        }

        const mergedConfig = {
            standards: { indentation: 4, lineLength: 120 },
            naming: {},
            paths: {}
        }

        const modules = [
            {
                name: 'couchcms-core',
                meta: { name: 'CouchCMS Core', description: 'Core patterns' },
                content: 'Content'
            }
        ]

        const templateData = prepareTemplateData(config, mergedConfig, modules, [], null, null, '.', '.')

        const templatePath = join(process.cwd(), 'templates', 'editors', 'claude-memory.template.md')
        const templateContent = readFileSync(templatePath, 'utf8')
        const template = Handlebars.compile(templateContent)
        const rendered = template(templateData)

        // Should include CouchCMS-specific rules
        expect(rendered).toContain('## CouchCMS Critical Rules')
        expect(rendered).toContain('**NEVER** use `<cms:` in HTML comments')
        expect(rendered).toContain('<cms:else />')
    })

    test('should include frontend rules when frontend modules are present', () => {
        const config = {
            project: { name: 'Frontend Project', type: 'Web App', description: 'Test' }
        }

        const mergedConfig = {
            standards: { indentation: 4, lineLength: 120 },
            naming: {},
            paths: {}
        }

        const modules = [
            {
                name: 'tailwindcss',
                meta: { name: 'TailwindCSS', description: 'Styling' },
                content: 'Content'
            },
            {
                name: 'alpinejs',
                meta: { name: 'Alpine.js', description: 'Interactivity' },
                content: 'Content'
            }
        ]

        const templateData = prepareTemplateData(config, mergedConfig, modules, [], null, null, '.', '.')

        const templatePath = join(process.cwd(), 'templates', 'editors', 'claude-memory.template.md')
        const templateContent = readFileSync(templatePath, 'utf8')
        const template = Handlebars.compile(templateContent)
        const rendered = template(templateData)

        // Should include frontend-specific rules
        expect(rendered).toContain('## Frontend Standards')
        expect(rendered).toContain('daisyUI semantic colors')
        expect(rendered).toContain('x-on:click')
        expect(rendered).toContain('x-bind:class')
    })
})
