/**
 * Test AGENTS.md Generation
 * 
 * Validates that the AGENTS.md template includes all required sections:
 * - List all configured agents with descriptions
 * - Include agent capabilities and usage examples
 * - Document available modules and their agents
 * - Add quick reference for agent-specific features
 * - Generate table of contents
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

describe('AGENTS.md Generation', () => {
    test('should include all required sections', () => {
        // Mock configuration
        const config = {
            project: {
                name: 'Test Project',
                type: 'CouchCMS Web Application',
                description: 'Test project for agents documentation'
            }
        }

        const mergedConfig = {
            standards: {
                indentation: 4,
                lineLength: 120,
                language: 'english'
            },
            naming: {},
            paths: {}
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
                    type: 'daily',
                    tags: ['couchcms', 'php', 'templates']
                },
                content: 'Agent content here'
            },
            {
                name: 'tailwindcss',
                meta: {
                    name: 'TailwindCSS Agent',
                    description: 'TailwindCSS styling and component assistance',
                    type: 'framework',
                    tags: ['css', 'styling', 'tailwind']
                },
                content: 'TailwindCSS agent content'
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
        const templatePath = join(process.cwd(), 'templates', 'editors', 'agents.template.md')
        const templateContent = readFileSync(templatePath, 'utf8')
        const template = Handlebars.compile(templateContent)
        const rendered = template(templateData)

        // Verify all required sections are present
        expect(rendered).toContain('# Available AI Agents - Test Project')
        expect(rendered).toContain('## Table of Contents')
        expect(rendered).toContain('## Quick Reference')
        expect(rendered).toContain('## Agent Details')
        expect(rendered).toContain('## How to Use Agents')
        expect(rendered).toContain('## Active Modules')
        expect(rendered).toContain('## Agent-Specific Features')

        // Verify table of contents includes agent links
        expect(rendered).toContain('- [@couchcms](#couchcms)')
        expect(rendered).toContain('- [@tailwindcss](#tailwindcss)')

        // Verify quick reference table
        expect(rendered).toContain('| Agent | Type | Description |')
        expect(rendered).toContain('| `@couchcms` | daily | Specialized CouchCMS development assistant |')
        expect(rendered).toContain('| `@tailwindcss` | framework | TailwindCSS styling and component assistance |')

        // Verify agent details sections
        expect(rendered).toContain('## @couchcms')
        expect(rendered).toContain('**Type**: daily')
        expect(rendered).toContain('**Description**: Specialized CouchCMS development assistant')
        expect(rendered).toContain('### Capabilities')
        expect(rendered).toContain('### Usage')
        expect(rendered).toContain('### Examples')
        expect(rendered).toContain('**Tags**: couchcms, php, templates')

        // Verify usage examples
        expect(rendered).toContain('`@couchcms help with implementation`')
        expect(rendered).toContain('`@couchcms review this code`')
        expect(rendered).toContain('`@couchcms explain best practices`')
        expect(rendered).toContain('`@couchcms suggest improvements for this component`')

        // Verify modules are listed
        expect(rendered).toContain('- **CouchCMS Core**: Core CouchCMS patterns and security standards')
        expect(rendered).toContain('- **TailwindCSS**: TailwindCSS 4 patterns and best practices')

        // Verify agent-specific features section
        expect(rendered).toContain('### Quick Tips')
        expect(rendered).toContain('**Context Matters**')
        expect(rendered).toContain('**Combine Agents**')
        expect(rendered).toContain('### Best Practices')
        expect(rendered).toContain('Start with the right agent')
    })

    test('should handle projects with no agents', () => {
        const config = {
            project: { name: 'No Agents Project', type: 'Web App', description: 'Test' }
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

        const templatePath = join(process.cwd(), 'templates', 'editors', 'agents.template.md')
        const templateContent = readFileSync(templatePath, 'utf8')
        const template = Handlebars.compile(templateContent)
        const rendered = template(templateData)

        // Should still have all sections but with empty agent lists
        expect(rendered).toContain('# Available AI Agents - No Agents Project')
        expect(rendered).toContain('## Quick Reference')
        expect(rendered).toContain('## Active Modules')
        expect(rendered).toContain('- **CouchCMS Core**: Core patterns')
    })

    test('should include agent capabilities section', () => {
        const config = {
            project: { name: 'Test', type: 'Web', description: 'Test' }
        }

        const mergedConfig = {
            standards: { indentation: 4 },
            naming: {},
            paths: {}
        }

        const agents = [
            {
                name: 'test-agent',
                meta: {
                    name: 'Test Agent',
                    description: 'Test agent description',
                    type: 'specialized'
                },
                content: 'Content'
            }
        ]

        const templateData = prepareTemplateData(config, mergedConfig, [], agents, null, null, '.', '.')

        const templatePath = join(process.cwd(), 'templates', 'editors', 'agents.template.md')
        const templateContent = readFileSync(templatePath, 'utf8')
        const template = Handlebars.compile(templateContent)
        const rendered = template(templateData)

        // Verify capabilities section is present
        expect(rendered).toContain('### Capabilities')
        expect(rendered).toContain('This agent provides specialized assistance for:')
        expect(rendered).toContain('- Implementation guidance and best practices')
        expect(rendered).toContain('- Code review and optimization suggestions')
        expect(rendered).toContain('- Troubleshooting and debugging support')
        expect(rendered).toContain('- Architecture and design recommendations')
    })

    test('should include how to use agents section', () => {
        const config = {
            project: { name: 'Test', type: 'Web', description: 'Test' }
        }

        const mergedConfig = {
            standards: { indentation: 4 },
            naming: {},
            paths: {}
        }

        const templateData = prepareTemplateData(config, mergedConfig, [], [], null, null, '.', '.')

        const templatePath = join(process.cwd(), 'templates', 'editors', 'agents.template.md')
        const templateContent = readFileSync(templatePath, 'utf8')
        const template = Handlebars.compile(templateContent)
        const rendered = template(templateData)

        // Verify usage instructions
        expect(rendered).toContain('## How to Use Agents')
        expect(rendered).toContain('### In Chat')
        expect(rendered).toContain('Simply mention the agent with `@` prefix')
        expect(rendered).toContain('@couchcms help me create a new template')
        expect(rendered).toContain('### Multiple Agents')
        expect(rendered).toContain('@couchcms @tailwindcss create a styled card component')
        expect(rendered).toContain('### Agent Types')
        expect(rendered).toContain('**daily**: General-purpose agents')
        expect(rendered).toContain('**specialized**: Domain-specific agents')
        expect(rendered).toContain('**framework**: Framework-specific agents')
    })
})
