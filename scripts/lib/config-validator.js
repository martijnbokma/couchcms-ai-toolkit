#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Configuration Validator
 *
 * Enhanced validation for editor configurations including:
 * - Claude settings JSON structure
 * - Required permissions and environment variables
 * - Configuration conflicts
 * - Editor-specific validation
 */

import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { validateName, formatNameError, getSuggestions } from './fuzzy-matcher.js'

/**
 * Validate editor configurations
 *
 * @param {object} config - Configuration object
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @returns {object} - { errors: Array<string>, warnings: Array<string> }
 */
export function validateEditorConfigs(config, toolkitPath, projectDir) {
    const errors = []
    const warnings = []

    // Get list of editors to validate
    const editors = config.editors || ['cursor', 'claude', 'windsurf', 'kiro', 'copilot']

    // Validate each editor's configuration
    for (const editor of editors) {
        const editorValidation = validateEditor(editor, config, toolkitPath, projectDir)
        errors.push(...editorValidation.errors)
        warnings.push(...editorValidation.warnings)
    }

    // Check for configuration conflicts
    const conflicts = checkConfigurationConflicts(config, editors)
    warnings.push(...conflicts)

    return { errors, warnings }
}

/**
 * Validate a specific editor configuration
 *
 * @param {string} editor - Editor name
 * @param {object} config - Configuration object
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @returns {object} - { errors: Array<string>, warnings: Array<string> }
 */
function validateEditor(editor, config, toolkitPath, projectDir) {
    const errors = []
    const warnings = []

    switch (editor) {
        case 'cursor':
            return validateCursorConfig(config, toolkitPath, projectDir)
        case 'claude':
            return validateClaudeConfig(config, toolkitPath, projectDir)
        case 'windsurf':
            return validateWindsurfConfig(config, toolkitPath, projectDir)
        case 'kiro':
            return validateKiroConfig(config, toolkitPath, projectDir)
        case 'copilot':
            return validateCopilotConfig(config, toolkitPath, projectDir)
        default:
            warnings.push(`Unknown editor: ${editor}`)
            return { errors, warnings }
    }
}

/**
 * Validate Cursor configuration
 *
 * @param {object} config - Configuration object
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @returns {object} - { errors: Array<string>, warnings: Array<string> }
 */
function validateCursorConfig(config, toolkitPath, projectDir) {
    const errors = []
    const warnings = []

    // Check if cursor template exists
    const cursorTemplate = join(toolkitPath, 'templates', 'editors', 'cursor.template.md')
    if (!existsSync(cursorTemplate)) {
        errors.push('Cursor template not found: templates/editors/cursor.template.md')
    }

    // Check if MDC rules directory exists
    const mdcRulesDir = join(toolkitPath, 'rules')
    if (!existsSync(mdcRulesDir)) {
        warnings.push('MDC rules directory not found: rules/')
    }

    return { errors, warnings }
}

/**
 * Validate Claude Code configuration
 *
 * @param {object} config - Configuration object
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @returns {object} - { errors: Array<string>, warnings: Array<string> }
 */
function validateClaudeConfig(config, toolkitPath, projectDir) {
    const errors = []
    const warnings = []

    // Check if Claude templates exist
    const claudeMemoryTemplate = join(toolkitPath, 'templates', 'editors', 'claude-memory.template.md')
    if (!existsSync(claudeMemoryTemplate)) {
        errors.push('Claude memory template not found: templates/editors/claude-memory.template.md')
    }

    const claudeSettingsTemplate = join(toolkitPath, 'templates', 'editors', 'claude-settings.template.json')
    if (!existsSync(claudeSettingsTemplate)) {
        errors.push('Claude settings template not found: templates/editors/claude-settings.template.json')
    }

    const claudeSkillModuleTemplate = join(toolkitPath, 'templates', 'editors', 'claude-skill-module.template.md')
    if (!existsSync(claudeSkillModuleTemplate)) {
        warnings.push('Claude skill module template not found: templates/editors/claude-skill-module.template.md')
    }

    const claudeSkillAgentTemplate = join(toolkitPath, 'templates', 'editors', 'claude-skill-agent.template.md')
    if (!existsSync(claudeSkillAgentTemplate)) {
        warnings.push('Claude skill agent template not found: templates/editors/claude-skill-agent.template.md')
    }

    // Validate Claude-specific configuration
    if (config.claude) {
        const claudeValidation = validateClaudeSettings(config.claude)
        errors.push(...claudeValidation.errors)
        warnings.push(...claudeValidation.warnings)
    }

    return { errors, warnings }
}

/**
 * Validate Claude settings structure
 *
 * @param {object} claudeConfig - Claude-specific configuration
 * @returns {object} - { errors: Array<string>, warnings: Array<string> }
 */
function validateClaudeSettings(claudeConfig) {
    const errors = []
    const warnings = []

    // Validate permissions if specified
    if (claudeConfig.permissions) {
        if (!claudeConfig.permissions.allow || !Array.isArray(claudeConfig.permissions.allow)) {
            errors.push('claude.permissions.allow must be an array')
        }

        if (!claudeConfig.permissions.deny || !Array.isArray(claudeConfig.permissions.deny)) {
            errors.push('claude.permissions.deny must be an array')
        }

        // Validate permission patterns
        const validPatternRegex = /^(Read|Write|Bash)\(.+\)$/

        if (claudeConfig.permissions.allow) {
            for (const permission of claudeConfig.permissions.allow) {
                if (!validPatternRegex.test(permission)) {
                    errors.push(`Invalid permission pattern in allow: ${permission}`)
                }
            }
        }

        if (claudeConfig.permissions.deny) {
            for (const permission of claudeConfig.permissions.deny) {
                if (!validPatternRegex.test(permission)) {
                    errors.push(`Invalid permission pattern in deny: ${permission}`)
                }
            }
        }

        // Check for required deny rules (security best practices)
        const requiredDenyPatterns = [
            'Read(./.env)',
            'Read(./.env.*)',
            'Read(./secrets/**)',
        ]

        if (claudeConfig.permissions.deny) {
            for (const pattern of requiredDenyPatterns) {
                if (!claudeConfig.permissions.deny.includes(pattern)) {
                    warnings.push(`Missing recommended deny rule: ${pattern}`)
                }
            }
        }
    }

    // Validate environment variables if specified
    if (claudeConfig.env) {
        if (typeof claudeConfig.env !== 'object' || Array.isArray(claudeConfig.env)) {
            errors.push('claude.env must be an object')
        } else {
            // Check for sensitive environment variables
            const sensitiveVars = ['API_KEY', 'SECRET', 'PASSWORD', 'TOKEN']
            for (const key of Object.keys(claudeConfig.env)) {
                if (sensitiveVars.some(s => key.toUpperCase().includes(s))) {
                    warnings.push(`Environment variable "${key}" may contain sensitive data`)
                }
            }
        }
    }

    // Validate slash commands if specified
    if (claudeConfig.slashCommands) {
        if (typeof claudeConfig.slashCommands !== 'object' || Array.isArray(claudeConfig.slashCommands)) {
            errors.push('claude.slashCommands must be an object')
        } else {
            for (const [name, cmd] of Object.entries(claudeConfig.slashCommands)) {
                if (!cmd.description) {
                    errors.push(`Slash command "${name}" missing description`)
                }
                if (!cmd.command) {
                    errors.push(`Slash command "${name}" missing command`)
                }
            }
        }
    }

    return { errors, warnings }
}

/**
 * Validate Windsurf configuration
 *
 * @param {object} config - Configuration object
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @returns {object} - { errors: Array<string>, warnings: Array<string> }
 */
function validateWindsurfConfig(config, toolkitPath, projectDir) {
    const errors = []
    const warnings = []

    // Check if Windsurf template exists
    const windsurfTemplate = join(toolkitPath, 'templates', 'editors', 'windsurf.template.md')
    if (!existsSync(windsurfTemplate)) {
        errors.push('Windsurf template not found: templates/editors/windsurf.template.md')
    }

    return { errors, warnings }
}

/**
 * Validate Kiro configuration
 *
 * @param {object} config - Configuration object
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @returns {object} - { errors: Array<string>, warnings: Array<string> }
 */
function validateKiroConfig(config, toolkitPath, projectDir) {
    const errors = []
    const warnings = []

    // Check if Kiro template exists
    const kiroTemplate = join(toolkitPath, 'templates', 'editors', 'kiro.template.md')
    if (!existsSync(kiroTemplate)) {
        errors.push('Kiro template not found: templates/editors/kiro.template.md')
    }

    return { errors, warnings }
}

/**
 * Validate Copilot configuration
 *
 * @param {object} config - Configuration object
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @returns {object} - { errors: Array<string>, warnings: Array<string> }
 */
function validateCopilotConfig(config, toolkitPath, projectDir) {
    const errors = []
    const warnings = []

    // Check if Copilot template exists
    const copilotTemplate = join(toolkitPath, 'templates', 'editors', 'copilot.template.md')
    if (!existsSync(copilotTemplate)) {
        errors.push('Copilot template not found: templates/editors/copilot.template.md')
    }

    return { errors, warnings }
}

/**
 * Check for configuration conflicts
 *
 * @param {object} config - Configuration object
 * @param {Array<string>} editors - List of enabled editors
 * @returns {Array<string>} - Array of warning messages
 */
function checkConfigurationConflicts(config, editors) {
    const warnings = []

    // Check for conflicting editor configurations
    if (editors.includes('cursor') && editors.includes('windsurf')) {
        warnings.push('Both Cursor and Windsurf are enabled - they may have conflicting configurations')
    }

    // Check for module/agent conflicts
    if (config.modules && config.agents) {
        const moduleNames = Array.isArray(config.modules) ? config.modules : []
        const agentNames = Array.isArray(config.agents) ? config.agents : []

        // Check for duplicate names
        const duplicates = moduleNames.filter(m => agentNames.includes(m))
        if (duplicates.length > 0) {
            warnings.push(`Duplicate names in modules and agents: ${duplicates.join(', ')}`)
        }
    }

    // Check for framework conflicts
    if (config.framework) {
        if (typeof config.framework === 'object' && config.framework !== null) {
            const frameworkKeys = Object.keys(config.framework)
            const validKeys = ['doctrine', 'directives', 'playbooks', 'enhancements']
            const invalidKeys = frameworkKeys.filter(k => !validKeys.includes(k))

            if (invalidKeys.length > 0) {
                warnings.push(`Unknown framework keys: ${invalidKeys.join(', ')}`)
            }
        }
    }

    return warnings
}

/**
 * Get list of available modules
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {Array<string>} - Array of module names
 */
function getAvailableModules(toolkitPath) {
    const modulesDir = join(toolkitPath, 'modules')
    if (!existsSync(modulesDir)) {
        return []
    }

    return readdirSync(modulesDir)
        .filter(file => file.endsWith('.md') && !file.includes('skill-rules'))
        .map(file => file.replace('.md', ''))
}

/**
 * Get list of available agents
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {Array<string>} - Array of agent names
 */
function getAvailableAgents(toolkitPath) {
    const agentsDir = join(toolkitPath, 'agents')
    if (!existsSync(agentsDir)) {
        return []
    }

    return readdirSync(agentsDir)
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''))
}

/**
 * Validate module and agent existence with fuzzy matching
 *
 * @param {object} config - Configuration object
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {object} - { errors: Array<string>, warnings: Array<string> }
 */
export function validateModulesAndAgents(config, toolkitPath) {
    const errors = []
    const warnings = []

    // Get available modules and agents
    const availableModules = getAvailableModules(toolkitPath)
    const availableAgents = getAvailableAgents(toolkitPath)

    // Validate modules
    if (config.modules) {
        const moduleList = Array.isArray(config.modules) ? config.modules : [config.modules]

        for (const moduleName of moduleList) {
            const modulePath = join(toolkitPath, 'modules', `${moduleName}.md`)
            if (!existsSync(modulePath)) {
                // Use fuzzy matching to suggest corrections
                const validation = validateName(moduleName, availableModules)
                if (validation.suggestions.length > 0) {
                    errors.push(formatNameError(moduleName, 'Module', validation.suggestions))
                } else {
                    errors.push(`Module not found: ${moduleName} (expected at modules/${moduleName}.md)`)
                }
            } else {
                // Check for skill rules file
                const skillRulesPath = join(toolkitPath, 'modules', `${moduleName}.skill-rules.json`)
                if (!existsSync(skillRulesPath)) {
                    warnings.push(`Skill rules not found for module: ${moduleName} (optional)`)
                }
            }
        }
    }

    // Validate agents
    if (config.agents) {
        let agentList = []

        if (Array.isArray(config.agents)) {
            agentList = config.agents
        } else if (typeof config.agents === 'object') {
            // Editor-specific agents
            for (const editorAgents of Object.values(config.agents)) {
                if (Array.isArray(editorAgents)) {
                    agentList.push(...editorAgents)
                }
            }
        }

        for (const agentName of agentList) {
            const agentPath = join(toolkitPath, 'agents', `${agentName}.md`)
            if (!existsSync(agentPath)) {
                // Use fuzzy matching to suggest corrections
                const validation = validateName(agentName, availableAgents)
                if (validation.suggestions.length > 0) {
                    errors.push(formatNameError(agentName, 'Agent', validation.suggestions))
                } else {
                    errors.push(`Agent not found: ${agentName} (expected at agents/${agentName}.md)`)
                }
            }
        }
    }

    return { errors, warnings }
}

/**
 * Validate toolkit path
 *
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {object} - { errors: Array<string>, warnings: Array<string> }
 */
export function validateToolkitPath(toolkitPath) {
    const errors = []
    const warnings = []

    if (!existsSync(toolkitPath)) {
        errors.push(`Toolkit path does not exist: ${toolkitPath}`)
        return { errors, warnings }
    }

    // Check for required directories
    const requiredDirs = ['modules', 'agents', 'templates', 'scripts']
    for (const dir of requiredDirs) {
        const dirPath = join(toolkitPath, dir)
        if (!existsSync(dirPath)) {
            errors.push(`Required toolkit directory not found: ${dir}`)
        }
    }

    // Check for required files
    const requiredFiles = ['scripts/cli/sync.js', 'templates/editors']
    for (const file of requiredFiles) {
        const filePath = join(toolkitPath, file)
        if (!existsSync(filePath)) {
            errors.push(`Required toolkit file/directory not found: ${file}`)
        }
    }

    return { errors, warnings }
}

/**
 * Run comprehensive configuration validation
 *
 * @param {object} config - Configuration object
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @returns {object} - { errors: Array<string>, warnings: Array<string>, isValid: boolean }
 */
export function validateConfiguration(config, toolkitPath, projectDir) {
    const allErrors = []
    const allWarnings = []

    // Validate toolkit path
    const toolkitValidation = validateToolkitPath(toolkitPath)
    allErrors.push(...toolkitValidation.errors)
    allWarnings.push(...toolkitValidation.warnings)

    // If toolkit path is invalid, stop here
    if (toolkitValidation.errors.length > 0) {
        return {
            errors: allErrors,
            warnings: allWarnings,
            isValid: false,
        }
    }

    // Validate modules and agents
    const modulesValidation = validateModulesAndAgents(config, toolkitPath)
    allErrors.push(...modulesValidation.errors)
    allWarnings.push(...modulesValidation.warnings)

    // Validate editor configurations
    const editorValidation = validateEditorConfigs(config, toolkitPath, projectDir)
    allErrors.push(...editorValidation.errors)
    allWarnings.push(...editorValidation.warnings)

    return {
        errors: allErrors,
        warnings: allWarnings,
        isValid: allErrors.length === 0,
    }
}
