/**
 * Tests for config-validator module
 */

import { describe, test, expect, beforeAll } from 'bun:test'
import { join } from 'path'
import { existsSync } from 'fs'
import {
    validateEditorConfigs,
    validateModulesAndAgents,
    validateToolkitPath,
    validateConfiguration,
} from '../../scripts/lib/config-validator.js'

const TOOLKIT_ROOT = join(import.meta.dir, '..', '..')
const TEST_PROJECT_DIR = join(import.meta.dir, '..', 'fixtures', 'basic-project')

describe('config-validator', () => {
    describe('validateToolkitPath', () => {
        test('should validate existing toolkit path', () => {
            const result = validateToolkitPath(TOOLKIT_ROOT)
            expect(result.errors).toEqual([])
        })

        test('should error on non-existent toolkit path', () => {
            const result = validateToolkitPath('/non/existent/path')
            expect(result.errors.length).toBeGreaterThan(0)
            expect(result.errors[0]).toContain('does not exist')
        })

        test('should error on missing required directories', () => {
            const result = validateToolkitPath(import.meta.dir)
            expect(result.errors.length).toBeGreaterThan(0)
        })
    })

    describe('validateModulesAndAgents', () => {
        test('should validate existing modules', () => {
            const config = {
                modules: ['couchcms-core', 'tailwindcss', 'alpinejs'],
            }
            const result = validateModulesAndAgents(config, TOOLKIT_ROOT)
            expect(result.errors).toEqual([])
        })

        test('should error on non-existent modules', () => {
            const config = {
                modules: ['non-existent-module'],
            }
            const result = validateModulesAndAgents(config, TOOLKIT_ROOT)
            expect(result.errors.length).toBeGreaterThan(0)
            expect(result.errors[0]).toContain('Module not found')
        })

        test('should validate existing agents', () => {
            const config = {
                agents: ['couchcms', 'tailwindcss'],
            }
            const result = validateModulesAndAgents(config, TOOLKIT_ROOT)
            expect(result.errors).toEqual([])
        })

        test('should error on non-existent agents', () => {
            const config = {
                agents: ['non-existent-agent'],
            }
            const result = validateModulesAndAgents(config, TOOLKIT_ROOT)
            expect(result.errors.length).toBeGreaterThan(0)
            expect(result.errors[0]).toContain('Agent not found')
        })

        test('should handle editor-specific agents', () => {
            const config = {
                agents: {
                    cursor: ['couchcms'],
                    claude: ['tailwindcss'],
                },
            }
            const result = validateModulesAndAgents(config, TOOLKIT_ROOT)
            expect(result.errors).toEqual([])
        })
    })

    describe('validateEditorConfigs', () => {
        test('should validate cursor configuration', () => {
            const config = {
                editors: ['cursor'],
            }
            const result = validateEditorConfigs(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.errors).toEqual([])
        })

        test('should validate claude configuration', () => {
            const config = {
                editors: ['claude'],
            }
            const result = validateEditorConfigs(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.errors).toEqual([])
        })

        test('should validate all supported editors', () => {
            const config = {
                editors: ['cursor', 'claude', 'windsurf', 'kiro', 'copilot'],
            }
            const result = validateEditorConfigs(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.errors).toEqual([])
        })

        test('should warn on unknown editors', () => {
            const config = {
                editors: ['unknown-editor'],
            }
            const result = validateEditorConfigs(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.warnings.length).toBeGreaterThan(0)
        })
    })

    describe('validateConfiguration', () => {
        test('should validate complete valid configuration', () => {
            const config = {
                project: {
                    name: 'test-project',
                },
                toolkit: {
                    path: TOOLKIT_ROOT,
                },
                modules: ['couchcms-core'],
                agents: ['couchcms'],
                editors: ['cursor', 'claude'],
            }
            const result = validateConfiguration(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.isValid).toBe(true)
            expect(result.errors).toEqual([])
        })

        test('should error on invalid toolkit path', () => {
            const config = {
                project: {
                    name: 'test-project',
                },
                toolkit: {
                    path: '/non/existent/path',
                },
            }
            const result = validateConfiguration(config, '/non/existent/path', TEST_PROJECT_DIR)
            expect(result.isValid).toBe(false)
            expect(result.errors.length).toBeGreaterThan(0)
        })

        test('should error on non-existent modules', () => {
            const config = {
                project: {
                    name: 'test-project',
                },
                toolkit: {
                    path: TOOLKIT_ROOT,
                },
                modules: ['non-existent-module'],
            }
            const result = validateConfiguration(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.isValid).toBe(false)
            expect(result.errors.length).toBeGreaterThan(0)
        })

        test('should collect warnings without failing validation', () => {
            const config = {
                project: {
                    name: 'test-project',
                },
                toolkit: {
                    path: TOOLKIT_ROOT,
                },
                modules: ['couchcms-core'],
                editors: ['cursor', 'claude', 'windsurf'],
            }
            const result = validateConfiguration(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.isValid).toBe(true)
            // May have warnings about conflicting editors
        })
    })

    describe('Claude settings validation', () => {
        test('should validate Claude permissions structure', () => {
            const config = {
                project: {
                    name: 'test-project',
                },
                toolkit: {
                    path: TOOLKIT_ROOT,
                },
                editors: ['claude'],
                claude: {
                    permissions: {
                        allow: ['Read(~/.config/**)', 'Bash(npm run *)'],
                        deny: ['Read(./.env)', 'Read(./.env.*)', 'Read(./secrets/**)'],
                    },
                },
            }
            const result = validateConfiguration(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.isValid).toBe(true)
        })

        test('should error on invalid permission patterns', () => {
            const config = {
                project: {
                    name: 'test-project',
                },
                toolkit: {
                    path: TOOLKIT_ROOT,
                },
                editors: ['claude'],
                claude: {
                    permissions: {
                        allow: ['invalid-pattern'],
                        deny: [],
                    },
                },
            }
            const result = validateConfiguration(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.isValid).toBe(false)
            expect(result.errors.some(e => e.includes('Invalid permission pattern'))).toBe(true)
        })

        test('should warn on missing recommended deny rules', () => {
            const config = {
                project: {
                    name: 'test-project',
                },
                toolkit: {
                    path: TOOLKIT_ROOT,
                },
                editors: ['claude'],
                claude: {
                    permissions: {
                        allow: ['Read(~/.config/**)'],
                        deny: [],
                    },
                },
            }
            const result = validateConfiguration(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.warnings.some(w => w.includes('Missing recommended deny rule'))).toBe(true)
        })

        test('should validate environment variables', () => {
            const config = {
                project: {
                    name: 'test-project',
                },
                toolkit: {
                    path: TOOLKIT_ROOT,
                },
                editors: ['claude'],
                claude: {
                    permissions: {
                        allow: [],
                        deny: [],
                    },
                    env: {
                        NODE_ENV: 'development',
                        DEBUG: 'true',
                    },
                },
            }
            const result = validateConfiguration(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.isValid).toBe(true)
        })

        test('should warn on sensitive environment variables', () => {
            const config = {
                project: {
                    name: 'test-project',
                },
                toolkit: {
                    path: TOOLKIT_ROOT,
                },
                editors: ['claude'],
                claude: {
                    permissions: {
                        allow: [],
                        deny: [],
                    },
                    env: {
                        API_KEY: 'secret-key',
                        PASSWORD: 'secret-password',
                    },
                },
            }
            const result = validateConfiguration(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
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
                    },
                },
            }
            const result = validateConfiguration(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.isValid).toBe(true)
        })

        test('should error on invalid slash commands', () => {
            const config = {
                project: {
                    name: 'test-project',
                },
                toolkit: {
                    path: TOOLKIT_ROOT,
                },
                editors: ['claude'],
                claude: {
                    permissions: {
                        allow: [],
                        deny: [],
                    },
                    slashCommands: {
                        test: {
                            description: 'Run tests',
                            // missing command
                        },
                    },
                },
            }
            const result = validateConfiguration(config, TOOLKIT_ROOT, TEST_PROJECT_DIR)
            expect(result.isValid).toBe(false)
            expect(result.errors.some(e => e.includes('missing command'))).toBe(true)
        })
    })
})
