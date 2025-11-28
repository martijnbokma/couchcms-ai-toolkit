#!/usr/bin/env bun
/**
 * Tests for Template Engine
 */

import { describe, test, expect } from 'bun:test'
import { 
    prepareTemplateData, 
    generateClaudeSkills,
    getSupportedEditors,
    isEditorSupported,
    getEditorConfig
} from '../../scripts/lib/template-engine.js'

describe('Template Engine', () => {
    describe('prepareTemplateData', () => {
        test('should include full module details', () => {
            const config = {
                project: { name: 'Test Project', type: 'Web App', description: 'Test' }
            }
            const mergedConfig = {
                paths: {},
                standards: { indentation: 4, lineLength: 120 },
                naming: {}
            }
            const modules = [{
                name: 'test-module',
                meta: {
                    name: 'Test Module',
                    description: 'A test module',
                    version: '1.0',
                    'allowed-tools': ['Read', 'Write']
                },
                content: '# Test Module Content'
            }]
            const agents = []
            
            const data = prepareTemplateData(
                config, 
                mergedConfig, 
                modules, 
                agents, 
                null, 
                null, 
                '/toolkit', 
                '/project'
            )
            
            expect(data.modules).toHaveLength(1)
            expect(data.modules[0].name).toBe('Test Module')
            expect(data.modules[0].slug).toBe('test-module')
            expect(data.modules[0].content).toBe('# Test Module Content')
            expect(data.modules[0].allowedTools).toEqual(['Read', 'Write'])
            expect(data.modules[0].category).toBe('module')
        })

        test('should include full agent details', () => {
            const config = {
                project: { name: 'Test Project', type: 'Web App', description: 'Test' }
            }
            const mergedConfig = {
                paths: {},
                standards: { indentation: 4, lineLength: 120 },
                naming: {}
            }
            const modules = []
            const agents = [{
                name: 'test-agent',
                meta: {
                    name: 'Test Agent',
                    description: 'A test agent',
                    type: 'daily',
                    allowedTools: ['Bash', 'Grep']
                },
                content: '# Test Agent Content'
            }]
            
            const data = prepareTemplateData(
                config, 
                mergedConfig, 
                modules, 
                agents, 
                null, 
                null, 
                '/toolkit', 
                '/project'
            )
            
            expect(data.agents).toHaveLength(1)
            expect(data.agents[0].name).toBe('Test Agent')
            expect(data.agents[0].slug).toBe('test-agent')
            expect(data.agents[0].content).toBe('# Test Agent Content')
            expect(data.agents[0].allowedTools).toEqual(['Bash', 'Grep'])
            expect(data.agents[0].category).toBe('agent')
        })
    })

    describe('generateClaudeSkills', () => {
        test('should generate skills for modules', () => {
            const templateData = {
                modules: [{
                    name: 'Test Module',
                    slug: 'test-module',
                    description: 'A test module',
                    allowedTools: ['Read', 'Write'],
                    content: '# Module Content'
                }],
                agents: []
            }
            
            const skills = generateClaudeSkills(templateData, '/toolkit')
            
            expect(skills.size).toBe(1)
            expect(skills.has('.claude/skills/test-module.md')).toBe(true)
            
            const skillContent = skills.get('.claude/skills/test-module.md')
            expect(skillContent).toContain('name: Test Module')
            expect(skillContent).toContain('description: A test module')
            expect(skillContent).toContain('allowed-tools: Read, Write')
            expect(skillContent).toContain('type: module')
            expect(skillContent).toContain('# Module Content')
        })

        test('should generate skills for agents', () => {
            const templateData = {
                modules: [],
                agents: [{
                    name: 'Test Agent',
                    slug: 'test-agent',
                    description: 'A test agent',
                    allowedTools: ['Bash', 'Grep'],
                    content: '# Agent Content'
                }]
            }
            
            const skills = generateClaudeSkills(templateData, '/toolkit')
            
            expect(skills.size).toBe(1)
            expect(skills.has('.claude/skills/test-agent.md')).toBe(true)
            
            const skillContent = skills.get('.claude/skills/test-agent.md')
            expect(skillContent).toContain('name: Test Agent')
            expect(skillContent).toContain('description: A test agent')
            expect(skillContent).toContain('allowed-tools: Bash, Grep')
            expect(skillContent).toContain('type: agent')
            expect(skillContent).toContain('# Agent Content')
        })

        test('should handle multiple modules and agents', () => {
            const templateData = {
                modules: [
                    { name: 'Module 1', slug: 'module-1', description: 'First', allowedTools: ['Read'], content: 'M1' },
                    { name: 'Module 2', slug: 'module-2', description: 'Second', allowedTools: ['Write'], content: 'M2' }
                ],
                agents: [
                    { name: 'Agent 1', slug: 'agent-1', description: 'First', allowedTools: ['Bash'], content: 'A1' }
                ]
            }
            
            const skills = generateClaudeSkills(templateData, '/toolkit')
            
            expect(skills.size).toBe(3)
            expect(skills.has('.claude/skills/module-1.md')).toBe(true)
            expect(skills.has('.claude/skills/module-2.md')).toBe(true)
            expect(skills.has('.claude/skills/agent-1.md')).toBe(true)
        })
    })

    describe('Editor Configuration', () => {
        test('should list supported editors', () => {
            const editors = getSupportedEditors()
            
            expect(editors).toContain('cursor')
            expect(editors).toContain('claude')
            expect(editors).toContain('claude-settings')
            expect(editors).toContain('claude-skills')
            expect(editors).toContain('cursor-rules')
            expect(editors).toContain('agents')
        })

        test('should check if editor is supported', () => {
            expect(isEditorSupported('cursor')).toBe(true)
            expect(isEditorSupported('claude-settings')).toBe(true)
            expect(isEditorSupported('nonexistent')).toBe(false)
        })

        test('should get editor configuration', () => {
            const cursorConfig = getEditorConfig('cursor')
            expect(cursorConfig).toBeDefined()
            expect(cursorConfig.template).toBe('cursor.template.md')
            expect(cursorConfig.output).toBe('.cursorrules')
            expect(cursorConfig.type).toBe('file')
            expect(cursorConfig.format).toBe('markdown')

            const claudeSettingsConfig = getEditorConfig('claude-settings')
            expect(claudeSettingsConfig).toBeDefined()
            expect(claudeSettingsConfig.template).toBe('claude-settings.template.json')
            expect(claudeSettingsConfig.output).toBe('.claude/settings.json')
            expect(claudeSettingsConfig.type).toBe('file')
            expect(claudeSettingsConfig.format).toBe('json')

            const claudeSkillsConfig = getEditorConfig('claude-skills')
            expect(claudeSkillsConfig).toBeDefined()
            expect(claudeSkillsConfig.type).toBe('directory')
            expect(claudeSkillsConfig.output).toBe('.claude/skills')
        })

        test('should return null for unknown editor', () => {
            expect(getEditorConfig('unknown')).toBeNull()
        })
    })
})
