/**
 * Integration tests for configuration validation
 */

import { describe, test, expect } from 'bun:test'
import { join } from 'path'
import { validateConfiguration } from '../scripts/lib/config-validator.js'

const TOOLKIT_ROOT = join(import.meta.dir, '..')

describe('Configuration Validation Integration', () => {
    test('should validate toolkit self-configuration', () => {
        // Load the toolkit's own configuration
        const config = {
            project: {
                name: 'couchcms-ai-toolkit',
                type: 'CouchCMS AI Toolkit',
                description: 'Development and maintenance configuration',
            },
            toolkit: {
                path: '.',
            },
            modules: [
                'couchcms-core',
                'tailwindcss',
                'daisyui',
                'alpinejs',
                'databound-forms',
                'custom-routes',
                'folders',
                'archives',
                'relationships',
                'repeatable-regions',
                'search',
                'pagination',
                'comments',
                'users',
                'typescript',
            ],
            agents: [
                'couchcms',
                'databound-forms',
                'custom-routes',
                'alpinejs',
                'tailwindcss',
                'typescript',
                'views',
                'folders',
                'archives',
                'relationships',
                'repeatable-regions',
                'search',
                'pagination',
                'comments',
                'nested-pages',
                'photo-gallery',
                'rss-feeds',
                'on-page-editing',
                'users',
                'bun',
                'git',
                'mysql',
                'admin-panel-theming',
            ],
            editors: ['cursor', 'claude', 'windsurf', 'kiro', 'copilot'],
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        // Should be valid
        expect(result.isValid).toBe(true)
        expect(result.errors).toEqual([])

        // May have warnings about duplicate names or conflicting editors
        // but that's acceptable
    })

    test('should detect missing modules', () => {
        const config = {
            project: {
                name: 'test-project',
            },
            toolkit: {
                path: TOOLKIT_ROOT,
            },
            modules: ['non-existent-module'],
            editors: ['cursor'],
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        expect(result.isValid).toBe(false)
        expect(result.errors.some(e => e.includes('Module not found'))).toBe(true)
    })

    test('should detect missing agents', () => {
        const config = {
            project: {
                name: 'test-project',
            },
            toolkit: {
                path: TOOLKIT_ROOT,
            },
            modules: ['couchcms-core'],
            agents: ['non-existent-agent'],
            editors: ['cursor'],
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        expect(result.isValid).toBe(false)
        expect(result.errors.some(e => e.includes('Agent not found'))).toBe(true)
    })

    test('should validate Claude settings with proper permissions', () => {
        const config = {
            project: {
                name: 'test-project',
            },
            toolkit: {
                path: TOOLKIT_ROOT,
            },
            modules: ['couchcms-core'],
            editors: ['claude'],
            claude: {
                permissions: {
                    allow: [
                        'Read(~/.config/**)',
                        'Bash(npm run *)',
                        'Bash(bun run *)',
                    ],
                    deny: [
                        'Read(./.env)',
                        'Read(./.env.*)',
                        'Read(./secrets/**)',
                        'Bash(rm -rf *)',
                    ],
                },
                env: {
                    NODE_ENV: 'development',
                },
            },
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        expect(result.isValid).toBe(true)
        expect(result.errors).toEqual([])
    })

    test('should detect invalid Claude permission patterns', () => {
        const config = {
            project: {
                name: 'test-project',
            },
            toolkit: {
                path: TOOLKIT_ROOT,
            },
            modules: ['couchcms-core'],
            editors: ['claude'],
            claude: {
                permissions: {
                    allow: ['invalid-pattern', 'another-bad-pattern'],
                    deny: [],
                },
            },
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        expect(result.isValid).toBe(false)
        expect(result.errors.some(e => e.includes('Invalid permission pattern'))).toBe(true)
    })

    test('should warn about missing recommended deny rules', () => {
        const config = {
            project: {
                name: 'test-project',
            },
            toolkit: {
                path: TOOLKIT_ROOT,
            },
            modules: ['couchcms-core'],
            editors: ['claude'],
            claude: {
                permissions: {
                    allow: ['Read(~/.config/**)'],
                    deny: [], // Missing recommended deny rules
                },
            },
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        expect(result.isValid).toBe(true)
        expect(result.warnings.some(w => w.includes('Missing recommended deny rule'))).toBe(true)
    })

    test('should warn about sensitive environment variables', () => {
        const config = {
            project: {
                name: 'test-project',
            },
            toolkit: {
                path: TOOLKIT_ROOT,
            },
            modules: ['couchcms-core'],
            editors: ['claude'],
            claude: {
                permissions: {
                    allow: [],
                    deny: [],
                },
                env: {
                    API_KEY: 'secret-key',
                    DATABASE_PASSWORD: 'secret-password',
                },
            },
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        expect(result.isValid).toBe(true)
        expect(result.warnings.some(w => w.includes('may contain sensitive data'))).toBe(true)
    })

    test('should validate slash commands', () => {
        const config = {
            project: {
                name: 'test-project',
            },
            toolkit: {
                path: TOOLKIT_ROOT,
            },
            modules: ['couchcms-core'],
            editors: ['claude'],
            claude: {
                permissions: {
                    allow: [],
                    deny: [],
                },
                slashCommands: {
                    test: {
                        description: 'Run tests',
                        command: 'bun test',
                    },
                    sync: {
                        description: 'Sync configurations',
                        command: 'bun run sync',
                    },
                },
            },
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        expect(result.isValid).toBe(true)
        expect(result.errors).toEqual([])
    })

    test('should detect invalid slash commands', () => {
        const config = {
            project: {
                name: 'test-project',
            },
            toolkit: {
                path: TOOLKIT_ROOT,
            },
            modules: ['couchcms-core'],
            editors: ['claude'],
            claude: {
                permissions: {
                    allow: [],
                    deny: [],
                },
                slashCommands: {
                    test: {
                        description: 'Run tests',
                        // missing command field
                    },
                },
            },
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        expect(result.isValid).toBe(false)
        expect(result.errors.some(e => e.includes('missing command'))).toBe(true)
    })

    test('should warn about conflicting editors', () => {
        const config = {
            project: {
                name: 'test-project',
            },
            toolkit: {
                path: TOOLKIT_ROOT,
            },
            modules: ['couchcms-core'],
            editors: ['cursor', 'windsurf'], // Both use similar config structures
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        expect(result.isValid).toBe(true)
        expect(result.warnings.some(w => w.includes('conflicting configurations'))).toBe(true)
    })

    test('should validate all supported editors', () => {
        const config = {
            project: {
                name: 'test-project',
            },
            toolkit: {
                path: TOOLKIT_ROOT,
            },
            modules: ['couchcms-core'],
            editors: ['cursor', 'claude', 'windsurf', 'kiro', 'copilot'],
        }

        const result = validateConfiguration(config, TOOLKIT_ROOT, TOOLKIT_ROOT)

        expect(result.isValid).toBe(true)
    })
})
