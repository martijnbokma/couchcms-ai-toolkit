#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Sync Script
 *
 * Generates editor configurations from standards.md, toolkit modules,
 * agents, and project-specific context.
 *
 * Features:
 * - Loads default configuration from defaults.yaml
 * - Merges project-specific overrides from standards.md
 * - Replaces {{paths.xxx}} variables in output
 * - Supports modules, agents, and project context
 *
 * Usage:
 *   bun ai-toolkit-shared/scripts/sync.js
 *   bun ~/couchcms-ai-toolkit/scripts/sync.js
 */

import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'
import Handlebars from 'handlebars'
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from 'fs'
import { join, dirname, resolve } from 'path'

import {
    ModuleCache,
    checkAndInstallDependencies,
    validateTemplate,
    replaceVariables,
    ensureDir,
    ToolkitError,
    ConfigError,
    handleError,
    resolvePath,
    getToolkitRootCached,
    deepMerge
} from './lib/index.js'
import { findProjectFile, resolveToolkitPath } from './utils/utils.js'

const TOOLKIT_ROOT = getToolkitRootCached()

// Global cache instance
const cache = new ModuleCache()

/**
 * Register Handlebars helpers
 */
Handlebars.registerHelper('join', function (array, separator) {
    if (!Array.isArray(array)) return ''
    return array.join(separator || ', ')
})

Handlebars.registerHelper('add', function (a, b) {
    return Number(a) + Number(b)
})

/**
 * Load defaults from toolkit defaults.yaml
 * @param {string} toolkitPath - Path to toolkit directory
 * @returns {object} - Default configuration object
 */
function loadDefaults(toolkitPath) {
    const defaultsPath = join(toolkitPath, 'defaults.yaml')

    if (!existsSync(defaultsPath)) {
        console.warn('⚠️  defaults.yaml not found, using built-in defaults')
        return {
            paths: {
                css: 'assets/css',
                typescript: 'assets/ts',
                javascript: 'assets/js',
                components: 'snippets/components',
                views: 'snippets/views',
                layouts: 'snippets/layouts',
                filters: 'snippets/filters',
                forms: 'snippets/forms',
                public: 'public',
            },
            standards: {
                indentation: 4,
                language: 'english',
                lineLength: 120,
            },
            naming: {
                php_variables: 'snake_case',
                ts_variables: 'camelCase',
                css_classes: 'kebab-case',
            },
        }
    }

    const content = readFileSync(defaultsPath, 'utf8')
    return parseYaml(content)
}

/**
 * Load a module from the toolkit (with caching)
 * @param {string} moduleName - Name of the module to load
 * @param {string} toolkitPath - Path to toolkit directory
 * @returns {object|null} - Module object with meta, content, and name, or null if not found
 */
function loadModule(moduleName, toolkitPath) {
    const cacheKey = `module:${moduleName}:${toolkitPath}`
    const cached = cache.get(cacheKey)
    if (cached) {
        return cached
    }

    const modulePath = join(toolkitPath, 'modules', `${moduleName}.md`)

    if (!existsSync(modulePath)) {
        console.warn(`⚠️  Module not found: ${moduleName}`)
        return null
    }

    const fileContent = readFileSync(modulePath, 'utf8')
    const { data: meta, content } = matter(fileContent)

    const module = { meta, content, name: moduleName }
    cache.set(cacheKey, module)
    return module
}

/**
 * Load an agent from the toolkit (with caching)
 * @param {string} agentName - Name of the agent to load
 * @param {string} toolkitPath - Path to toolkit directory
 * @returns {object|null} - Agent object with meta, content, and name, or null if not found
 */
function loadAgent(agentName, toolkitPath) {
    const cacheKey = `agent:${agentName}:${toolkitPath}`
    const cached = cache.get(cacheKey)
    if (cached) {
        return cached
    }

    // Agents are now in a flat structure under agents/
    const agentPath = join(toolkitPath, 'agents', `${agentName}.md`)

    if (existsSync(agentPath)) {
        const fileContent = readFileSync(agentPath, 'utf8')
        const { data: meta, content } = matter(fileContent)
        const agent = { meta, content, name: agentName }
        cache.set(cacheKey, agent)
        return agent
    }

    console.warn(`⚠️  Agent not found: ${agentName}`)
    return null
}

/**
 * Load project context from context directory
 * @param {string|null} contextPath - Path to context directory (relative or absolute)
 * @param {string} projectDir - Project root directory
 * @returns {object|null} - Context object with meta, content, and path, or null if not found
 */
function loadProjectContext(contextPath, projectDir) {
    if (!contextPath) {
        return null
    }

    // Resolve relative paths from project directory
    const fullPath = contextPath.startsWith('/') ? contextPath : resolve(projectDir, contextPath)

    if (!existsSync(fullPath)) {
        console.warn(`⚠️  Context directory not found: ${fullPath}`)
        return null
    }

    // Load context.md if it exists
    const contextFile = join(fullPath, 'context.md')
    if (existsSync(contextFile)) {
        const fileContent = readFileSync(contextFile, 'utf8')
        const { data: meta, content } = matter(fileContent)
        return { meta, content, path: fullPath }
    }

    // Otherwise, load all .md files in the directory
    const files = readdirSync(fullPath).filter(f => f.endsWith('.md'))
    let combinedContent = ''

    for (const file of files) {
        const filePath = join(fullPath, file)
        const fileContent = readFileSync(filePath, 'utf8')
        const { content } = matter(fileContent)
        combinedContent += `\n${content}\n`
    }

    return { meta: {}, content: combinedContent, path: fullPath }
}

/**
 * Check for module conflicts and missing dependencies
 * @param {Array<object>} modules - Array of loaded module objects
 * @returns {Array<string>} - Array of error messages (empty if no conflicts)
 */
function checkConflicts(modules) {
    const moduleNames = modules.map(m => m.name)
    const errors = []

    for (const mod of modules) {
        if (mod.meta.conflicts) {
            for (const conflict of mod.meta.conflicts) {
                if (moduleNames.includes(conflict)) {
                    errors.push(`❌ Conflict: ${mod.name} cannot be used with ${conflict}`)
                }
            }
        }

        if (mod.meta.requires) {
            for (const required of mod.meta.requires) {
                if (!moduleNames.includes(required)) {
                    errors.push(`❌ Missing dependency: ${mod.name} requires ${required}`)
                }
            }
        }
    }

    return errors
}

/**
 * Generate paths documentation section
 * @param {object} paths - Paths configuration object
 * @returns {string} - Markdown-formatted paths documentation
 */
function generatePathsSection(paths) {
    return `## Project Paths

These are the configured paths for this project:

| Type | Path |
|------|------|
| CSS | \`${paths.css}\` |
| TypeScript | \`${paths.typescript}\` |
| JavaScript | \`${paths.javascript}\` |
| Components | \`${paths.components}\` |
| Views | \`${paths.views}\` |
| Layouts | \`${paths.layouts}\` |
| Filters | \`${paths.filters}\` |
| Forms | \`${paths.forms}\` |
| Public | \`${paths.public}\` |

**Always use these paths when creating or referencing files.**
`
}

/**
 * Generate the combined configuration content
 * @param {object} config - Project configuration from standards.md
 * @param {object} mergedConfig - Merged configuration (defaults + project overrides)
 * @param {Array<object>} modules - Array of loaded module objects
 * @param {Array<object>} agents - Array of loaded agent objects
 * @param {object|null} projectContext - Project context object or null
 * @param {string} projectRules - Project-specific rules content
 * @returns {string} - Generated configuration content with variables replaced
 */
function generateContent(config, mergedConfig, modules, agents, projectContext, projectRules) {
    const timestamp = new Date().toISOString()
    const moduleNames = modules.map(m => m.name).join(', ')
    const agentNames = agents.map(a => a.name).join(', ')
    const { paths, standards } = mergedConfig

    // Support both old format (config.name) and new format (config.project.name)
    const projectName = config.project?.name || config.name || 'Unnamed Project'
    const projectDescription = config.project?.description || config.description || 'No description'
    const projectType = config.project?.type || config.type || 'CouchCMS Web Application'

    let content = `# AI Coding Standards
# Project: ${projectName}
# Generated: ${timestamp}
# Modules: ${moduleNames}
${agentNames ? `# Agents: ${agentNames}` : ''}

## Project Overview

- **Name**: ${projectName}
- **Description**: ${projectDescription}
- **Type**: ${projectType}

## Core Standards

- **Indentation**: ${standards.indentation} spaces
- **Language**: ${standards.language} only for all code and content
- **Line Length**: ${standards.lineLength} characters

${generatePathsSection(paths)}

---

`

    // Add each module's content
    for (const mod of modules) {
        content += `\n${mod.content}\n\n---\n`
    }

    // Add agents content
    if (agents.length > 0) {
        content += `\n# AI Agents\n\n`
        for (const agent of agents) {
            content += `\n${agent.content}\n\n---\n`
        }
    }

    // Add project context
    if (projectContext && projectContext.content.trim()) {
        content += `\n# Project Context\n\n${projectContext.content}\n\n---\n`
    }

    // Add project-specific rules from standards.md
    if (projectRules && projectRules.trim()) {
        content += `\n# Project-Specific Rules\n\n${projectRules}\n`
    }

    // Replace all {{variable}} placeholders
    content = replaceVariables(content, mergedConfig, '')

    return content
}

/**
 * Prepare template data for rendering
 * @param {object} config - Project configuration
 * @param {object} mergedConfig - Merged configuration
 * @param {Array<object>} modules - Array of loaded modules
 * @param {Array<object>} agents - Array of loaded agents
 * @param {object|null} projectContext - Project context or null
 * @param {string} toolkitPath - Toolkit path
 * @param {string} configFilePath - Path to configuration file (relative to project root)
 * @returns {object} - Template data object for Handlebars rendering
 */
function prepareTemplateData(config, mergedConfig, modules, agents, projectContext, toolkitPath, configFilePath) {
    const { paths, standards, naming } = mergedConfig

    // Extract languages and frameworks from modules
    const languages = []
    const frameworks = []
    const techHierarchy = []

    modules.forEach((mod, index) => {
        if (mod.meta?.category === 'language') {
            languages.push(mod.meta.name || mod.name)
        }
        if (mod.meta?.category === 'framework') {
            frameworks.push(mod.meta.name || mod.name)
        }
        techHierarchy.push({
            name: mod.meta?.name || mod.name,
            description: mod.meta?.description || 'No description',
            order: index + 1,
        })
    })

    // Check for CMS and frontend
    const hasCms = modules.some(m => m.name.includes('couchcms') || m.name.includes('cms'))
    const hasFrontend = modules.some(
        m =>
            m.name.includes('tailwind') ||
            m.name.includes('alpine') ||
            m.name.includes('react') ||
            m.name.includes('vue')
    )

    // Prepare modules data
    const modulesData = modules.map(mod => ({
        name: mod.meta?.name || mod.name,
        description: mod.meta?.description || 'No description',
        version: mod.meta?.version || '1.0',
        slug: mod.name,
    }))

    // Prepare roles data (if available in config)
    const roles = config.roles || []

    // Support both old format (config.name) and new format (config.project.name)
    const projectName = config.project?.name || config.name || 'Unnamed Project'
    const projectDescription = config.project?.description || config.description || 'No description'
    const projectType = config.project?.type || config.type || 'CouchCMS Web Application'

    // Check if framework is enabled
    const frameworkEnabled = config.framework !== undefined && config.framework !== false

    return {
        project: {
            name: projectName,
            type: projectType,
            description: projectDescription,
        },
        standards: {
            indentation: standards.indentation || 4,
            line_length: standards.lineLength || 120,
            language: standards.language || 'english',
            naming: naming || {},
        },
        paths: paths,
        languages: languages,
        frameworks: frameworks,
        tech_hierarchy: techHierarchy,
        modules: modulesData,
        agents: agents.map(a => ({
            name: a.meta?.name || a.name,
            description: a.meta?.description || 'No description',
            type: a.meta?.type || 'daily',
        })),
        roles: roles,
        has_cms: hasCms,
        has_frontend: hasFrontend,
        framework_enabled: frameworkEnabled,
        template_name: 'editor-config', // Default template name, can be overridden per template
        project_context: projectContext?.content || '',
        toolkit_path: toolkitPath,
        context_path: config.context || null,
        config_file_path: configFilePath || '.project/standards.md',
    }
}

/**
 * Generate editor configuration files from templates
 * @param {string} toolkitPath - Path to toolkit directory
 * @param {string} projectDir - Project root directory
 * @param {object} templateData - Template data for rendering
 * @param {object} config - Project configuration (for editor selection)
 * @returns {number} - Number of successfully generated config files
 */
function generateEditorConfigs(toolkitPath, projectDir, templateData, config) {
    const templatesDir = join(toolkitPath, 'templates', 'editors')

    if (!existsSync(templatesDir)) {
        return // No templates directory
    }

    // Mapping of editor IDs to template files and output files
    const editorMap = {
        cursor: { template: 'cursor.template.md', output: '.cursorrules', dir: projectDir },
        windsurf: { template: 'windsurf.template.md', output: '.windsurf/rules.md', dir: projectDir },
        zed: { template: 'zed.template.md', output: '.rules', dir: projectDir },
        copilot: { template: 'copilot.template.md', output: 'copilot-instructions.md', dir: join(projectDir, '.github') },
        claude: { template: 'claude.template.md', output: 'CLAUDE.md', dir: projectDir },
        codewhisperer: { template: 'codewhisperer.template.md', output: '.codewhisperer/settings.json', dir: projectDir },
        kiro: { template: 'kiro.template.md', output: '.kiro/rules.md', dir: projectDir },
        antigravity: { template: 'antigravity.template.md', output: '.antigravity/rules.md', dir: projectDir },
        jules: { template: 'jules.template.md', output: '.jules/rules.md', dir: projectDir },
        roocode: { template: 'roocode.template.md', output: '.roocode/rules.md', dir: projectDir },
        'vscode-ai': { template: 'vscode-ai.template.md', output: '.vscode/ai-toolkit.md', dir: projectDir },
        tabnine: { template: 'tabnine.template.md', output: '.tabnine/settings.json', dir: projectDir },
        agent: { template: 'agent.template.md', output: 'AGENT.md', dir: projectDir },
    }

    // Get selected editors from config (default to all if not specified)
    const editors = config.editors || {}
    const selectedEditors = Object.entries(editors)
        .filter(([_, enabled]) => enabled === true)
        .map(([editorId]) => editorId)

    // If no editors are selected, default to all (backward compatibility)
    const editorsToGenerate = selectedEditors.length > 0
        ? selectedEditors
        : Object.keys(editorMap)

    // Build templateMap from selected editors only
    const templateMap = {}
    editorsToGenerate.forEach(editorId => {
        const editorConfig = editorMap[editorId]
        if (editorConfig) {
            templateMap[editorConfig.template] = {
                output: editorConfig.output,
                dir: editorConfig.dir
            }
        }
    })

    const templateFiles = readdirSync(templatesDir).filter(f => f.endsWith('.template.md'))
    let generatedCount = 0

    for (const templateFile of templateFiles) {
        const mapping = templateMap[templateFile]
        if (!mapping) {
            continue // Skip unmapped templates
        }

        try {
            // Load template
            const templatePath = join(templatesDir, templateFile)

            // Check cache for compiled template
            let template = cache.getTemplate(templatePath)
            let templateContent = null

            if (!template) {
                templateContent = readFileSync(templatePath, 'utf8')

                // Validate template variables before rendering
                try {
                    validateTemplate(templateContent, templateData, templatePath)
                } catch (error) {
                    const templateError = new ToolkitError(`Template validation failed for ${templateFile}`, 'TEMPLATE_VALIDATION', error)
                    handleError(templateError, 'Template Validation')
                    throw templateError
                }

                // Compile and cache template
                template = Handlebars.compile(templateContent)
                cache.setTemplate(templatePath, template)
            }

            const rendered = template(templateData)

            // Build full output path
            const outputPath = join(mapping.dir, mapping.output)

            // Ensure output directory exists (handle subdirectories in output path)
            const outputDir = dirname(outputPath)
            ensureDir(outputDir)

            // Write output file
            writeFileSync(outputPath, rendered)
            generatedCount++

            console.log(`✅ Generated: ${mapping.output}`)
        } catch (error) {
            console.warn(`⚠️  Failed to generate from ${templateFile}: ${error.message}`)
        }
    }

    return generatedCount
}

/**
 * Load skill rules from a module
 * @param {string} moduleName - Name of the module
 * @param {string} toolkitPath - Path to toolkit directory
 * @returns {object|null} - Parsed skill rules JSON or null if not found
 */
function loadModuleSkillRules(moduleName, toolkitPath) {
    const skillRulesPath = join(toolkitPath, 'modules', `${moduleName}.skill-rules.json`)

    if (!existsSync(skillRulesPath)) {
        return null
    }

    try {
        const content = readFileSync(skillRulesPath, 'utf8')
        return JSON.parse(content)
    } catch (error) {
        console.warn(`⚠️  Failed to parse skill rules for ${moduleName}: ${error.message}`)
        return null
    }
}

/**
 * Generate Claude Code configuration (.claude/ directory)
 * @param {string} toolkitPath - Path to toolkit directory
 * @param {string} projectDir - Project root directory
 * @param {Array<string>} moduleNames - Array of module names
 * @param {object} mergedConfig - Merged configuration
 * @returns {number} - Number of skill rules loaded
 */
function generateClaudeCodeConfig(toolkitPath, projectDir, moduleNames, mergedConfig) {
    const claudeDir = join(projectDir, '.claude')
    const skillsDir = join(claudeDir, 'skills')
    const hooksDir = join(claudeDir, 'hooks')

    // Create directories
    if (!existsSync(claudeDir)) {
        mkdirSync(claudeDir, { recursive: true })
    }
    if (!existsSync(skillsDir)) {
        mkdirSync(skillsDir, { recursive: true })
    }
    if (!existsSync(hooksDir)) {
        mkdirSync(hooksDir, { recursive: true })
    }

    // Combine skill rules from all modules
    const combinedSkillRules = {}
    let loadedCount = 0

    for (const moduleName of moduleNames) {
        const skillRules = loadModuleSkillRules(moduleName, toolkitPath)
        if (skillRules) {
            Object.assign(combinedSkillRules, skillRules)
            loadedCount++
        }
    }

    // Write combined skill-rules.json
    if (Object.keys(combinedSkillRules).length > 0) {
        const skillRulesPath = join(skillsDir, 'skill-rules.json')
        writeFileSync(skillRulesPath, JSON.stringify(combinedSkillRules, null, 2))
        console.log(`✅ Generated: .claude/skills/skill-rules.json (${loadedCount} modules)`)
    }

    // Copy hooks from toolkit
    const toolkitHooksDir = join(toolkitPath, '.claude', 'hooks')
    if (existsSync(toolkitHooksDir)) {
        const hookFiles = readdirSync(toolkitHooksDir)
        let copiedHooks = 0

        for (const hookFile of hookFiles) {
            const sourcePath = join(toolkitHooksDir, hookFile)
            const targetPath = join(hooksDir, hookFile)

            try {
                copyFileSync(sourcePath, targetPath)
                copiedHooks++
            } catch (error) {
                console.warn(`⚠️  Failed to copy hook ${hookFile}: ${error.message}`)
            }
        }

        if (copiedHooks > 0) {
            console.log(`✅ Synced: ${copiedHooks} hooks to .claude/hooks/`)
        }
    }

    // Generate settings.json
    const settings = {
        $schema: 'https://claude.ai/schemas/claude-code-settings.json',
        version: '1.0.0',
        name: mergedConfig.name || 'CouchCMS Project',
        hooks: {
            UserPromptSubmit: [
                {
                    path: '.claude/hooks/skill-activation.js',
                    description: 'Auto-suggest relevant skills based on prompt',
                },
            ],
            PostToolUse: [
                {
                    matcher: 'Edit|Write|MultiEdit',
                    path: '.claude/hooks/post-edit-tracker.sh',
                    description: 'Track edited files for build checks',
                },
            ],
            Stop: [
                {
                    path: '.claude/hooks/preflight-check.sh',
                    description: 'Run CouchCMS-specific preflight checks',
                },
            ],
        },
        skills: {
            autoLoad: ['couchcms-core'],
            suggest: true,
            rulesPath: '.claude/skills/skill-rules.json',
        },
        devDocs: {
            enabled: true,
            directory: 'dev/active',
        },
        defaults: {
            mode: 'standard',
            autoApprove: false,
        },
    }

    const settingsPath = join(claudeDir, 'settings.json')
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
    console.log(`✅ Generated: .claude/settings.json`)

    return loadedCount
}

/**
 * Sync Cursor rules from toolkit to project
 * @param {string} toolkitPath - Path to toolkit directory
 * @param {string} projectDir - Project root directory
 * @param {object} mergedConfig - Merged configuration for variable replacement
 * @returns {void}
 */
function syncCursorRules(toolkitPath, projectDir, mergedConfig) {
    const rulesSource = join(toolkitPath, 'rules')
    const rulesTarget = join(projectDir, '.cursor', 'rules')

    // Always create .cursor/rules directory, even if no rules exist
    if (!existsSync(rulesTarget)) {
        mkdirSync(rulesTarget, { recursive: true })
    }

    if (!existsSync(rulesSource)) {
        console.log(`ℹ️  No rules directory in toolkit, .cursor/rules/ created (empty)`)
        return // No rules in toolkit
    }

    // Get all .mdc and .md files from toolkit rules
    const ruleFiles = readdirSync(rulesSource).filter(f => f.endsWith('.mdc') || f.endsWith('.md'))

    for (const ruleFile of ruleFiles) {
        // Skip README.md
        if (ruleFile === 'README.md') {
            continue
        }

        const sourcePath = join(rulesSource, ruleFile)
        const targetPath = join(rulesTarget, ruleFile)

        let content = readFileSync(sourcePath, 'utf8')

        // Replace {{paths.xxx}} variables
        content = replaceVariables(content, mergedConfig, '')

        writeFileSync(targetPath, content)
    }

    if (ruleFiles.length > 0) {
        const copiedCount = ruleFiles.filter(f => f !== 'README.md').length
        console.log(`✅ Synced: ${copiedCount} Cursor rules to .cursor/rules/`)
    }
}

/**
 * Load and parse project configuration
 * @returns {{config: object, projectRules: string, projectDir: string, toolkitPath: string}}
 * @throws {ConfigError} If configuration cannot be loaded
 */
function loadProjectConfiguration() {
    console.log('🔄 CouchCMS AI Toolkit - Sync\n')

    // Find standards.md configuration file
    const projectPath = findProjectFile()

    if (!projectPath) {
        const error = new ConfigError('No configuration file found in current directory or parent directories.')
        handleError(error, 'Configuration Discovery')
        console.log('\nCreate a standards.md file with:\n')
        console.log(`---
name: "my-project"
description: "Project description"
toolkit: "./ai-toolkit"
modules:
  - couchcms-core
  - tailwindcss
  - daisyui
  - alpinejs
agents:
  - couchcms-agent
context: ".project/ai"
paths:
  css: "src/css"        # Override default if needed
  typescript: "src/ts"  # Override default if needed
---

# Project-Specific Rules

Add your project-specific instructions here...
`)
        process.exit(1)
    }

    console.log(`📄 Found: ${projectPath}`)

    // Determine project root directory
    // If config is in .project/ or docs/, use parent directory as project root
    let projectDir = dirname(projectPath)
    const normalizedPath = projectPath.replace(/\\/g, '/')
    if (normalizedPath.includes('/.project/') || normalizedPath.includes('/docs/')) {
        projectDir = dirname(projectDir)
    }

    // Check if config file is inside toolkit directory itself
    // If toolkit structure detected (modules/, templates/, scripts/), use parent as project root
    const potentialToolkitDir = projectDir
    const hasToolkitStructure = existsSync(join(potentialToolkitDir, 'modules')) &&
                                 existsSync(join(potentialToolkitDir, 'templates')) &&
                                 existsSync(join(potentialToolkitDir, 'scripts'))

    if (hasToolkitStructure) {
        // Config is in toolkit directory, use parent as project root
        projectDir = dirname(potentialToolkitDir)
        console.log(`📦 Detected toolkit directory, using parent as project root`)
    }

    console.log(`📁 Project root: ${projectDir}`)

    // Parse standards.md configuration file
    let config, projectRules
    try {
        const projectContent = readFileSync(projectPath, 'utf8')
        const parsed = matter(projectContent)
        config = parsed.data
        projectRules = parsed.content
    } catch (error) {
        const configError = new ConfigError('Failed to parse configuration file', error)
        handleError(configError, 'Configuration Parsing')
        console.log('\nEnsure your configuration file has valid YAML frontmatter.\n')
        process.exit(1)
    }

    // Support both old format (config.name) and new format (config.project.name)
    const projectName = config.project?.name || config.name || 'Unnamed'
    console.log(`📦 Project: ${projectName}`)

    // Resolve toolkit path
    const toolkitPath = resolveToolkitPath(config.toolkit, projectDir, TOOLKIT_ROOT)

    // Verify toolkit path exists
    if (!existsSync(toolkitPath)) {
        const error = new ConfigError(`Toolkit path not found: ${toolkitPath}`)
        handleError(error, 'Toolkit Path Resolution')
        console.log("\nCheck the 'toolkit' path in your standards.md\n")
        process.exit(1)
    }

    console.log(`🛠️  Toolkit: ${toolkitPath}`)

    // Determine relative config file path (cross-platform)
    const relativeConfigPath = projectPath.startsWith(projectDir)
        ? projectPath.slice(projectDir.length + 1).replace(/\\/g, '/')
        : projectPath.replace(/\\/g, '/')

    return { config, projectRules, projectDir, toolkitPath, configFilePath: relativeConfigPath }
}

/**
 * Load toolkit resources (modules, agents, context)
 * @param {object} config - Project configuration
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @returns {{modules: Array, agents: Array, projectContext: object|null}}
 */
function loadToolkitResources(config, toolkitPath, projectDir) {
    // Load defaults and merge with project config
    const defaults = loadDefaults(toolkitPath)
    const mergedConfig = deepMerge(defaults, {
        paths: config.paths || {},
        standards: config.standards || config.overrides || {},
        naming: config.naming || {},
    })

    console.log(`📁 Paths: ${Object.keys(mergedConfig.paths).length} configured`)

    // Ensure couchcms-core is always included
    const moduleList = config.modules || ['couchcms-core']
    if (!moduleList.includes('couchcms-core')) {
        moduleList.unshift('couchcms-core')
    }

    console.log(`📚 Modules: ${moduleList.join(', ')}`)

    // Load modules
    const modules = moduleList.map(name => loadModule(name, toolkitPath)).filter(Boolean)

    // Load agents
    // Support both active_agents (new format) and agents (legacy format)
    // Also handle case where agents might be an object (editor-specific config)
    let agentList = []
    if (config.active_agents && Array.isArray(config.active_agents)) {
        agentList = config.active_agents
    } else if (config.agents) {
        if (Array.isArray(config.agents)) {
            agentList = config.agents
        } else if (typeof config.agents === 'object') {
            // If agents is an object (editor-specific), extract all unique agent names
            // This handles editor-specific agent configurations
            const agentSet = new Set()
            Object.values(config.agents).forEach(value => {
                if (Array.isArray(value)) {
                    value.forEach(agent => agentSet.add(agent))
                }
            })
            agentList = Array.from(agentSet)
        }
    }
    const agents = agentList.map(name => loadAgent(name, toolkitPath)).filter(Boolean)

    if (agents.length > 0) {
        console.log(`🤖 Agents: ${agents.map(a => a.name).join(', ')}`)
    }

    // Load project context
    const projectContext = loadProjectContext(config.context, projectDir)
    if (projectContext) {
        console.log(`📋 Context: ${projectContext.path}`)
    }

    // Check for conflicts
    const conflicts = checkConflicts(modules)
    if (conflicts.length > 0) {
        console.log('\n')
        conflicts.forEach(c => console.log(c))
        process.exit(1)
    }

    return { modules, agents, projectContext, mergedConfig }
}

/**
 * Generate all configuration files
 * @param {object} config - Project configuration
 * @param {object} mergedConfig - Merged configuration
 * @param {Array} modules - Loaded modules
 * @param {Array} agents - Loaded agents
 * @param {object|null} projectContext - Project context
 * @param {string} projectRules - Project-specific rules content
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @param {string} configFilePath - Relative path to configuration file
 */
function generateAllConfigurations(config, mergedConfig, modules, agents, projectContext, projectRules, toolkitPath, projectDir, configFilePath) {
    // Prepare template data
    const templateData = prepareTemplateData(config, mergedConfig, modules, agents, projectContext, toolkitPath, configFilePath)

    // Add project rules to template data
    if (projectRules && projectRules.trim()) {
        templateData.project_rules = projectRules
    }

    // Add module list for templates
    templateData.module_list = (config.modules || ['couchcms-core']).join(', ')

    // Add framework content if enabled
    if (templateData.framework_enabled && config.framework) {
        // Framework can be boolean true or an object with content
        if (typeof config.framework === 'object' && config.framework.content) {
            templateData.framework = config.framework.content
        } else {
            // Default framework content (can be loaded from a file if needed)
            templateData.framework = '# Framework\n\nFramework content goes here.'
        }
    } else {
        templateData.framework = ''
    }

    // Generate editor configurations from templates
    try {
        const generatedCount = generateEditorConfigs(toolkitPath, projectDir, templateData, config)
        if (generatedCount === 0) {
            console.warn('⚠️  No editor configs generated - templates may be missing or no editors selected')
        } else {
            const editors = config.editors || {}
            const selectedEditors = Object.entries(editors)
                .filter(([_, enabled]) => enabled === true)
                .map(([editorId]) => editorId)
            if (selectedEditors.length > 0) {
                console.log(`📝 Generated configs for: ${selectedEditors.join(', ')}`)
            }
        }
    } catch (error) {
        const templateError = new ToolkitError('Failed to generate editor configs', 'TEMPLATE_GENERATION', error)
        handleError(templateError, 'Editor Config Generation')
        console.log('\nCheck template files in toolkit.\n')
        process.exit(1)
    }

    // Sync Cursor rules
    try {
        syncCursorRules(toolkitPath, projectDir, mergedConfig)
    } catch (error) {
        console.warn(`⚠️  Failed to sync Cursor rules: ${error.message}`)
    }

    // Generate Claude Code configuration (always creates .claude directory)
    try {
        const moduleList = config.modules || ['couchcms-core']
        // Support both old format (config.name) and new format (config.project.name)
        const projectName = config.project?.name || config.name || 'Unnamed Project'
        const skillRulesCount = generateClaudeCodeConfig(toolkitPath, projectDir, moduleList, {
            ...mergedConfig,
            name: projectName,
        })
        console.log(`✅ Generated: .claude/ directory structure`)
        if (skillRulesCount > 0) {
            console.log(`🤖 Claude Code: ${skillRulesCount} skill-rules configured`)
        }
    } catch (error) {
        console.warn(`⚠️  Failed to generate Claude Code config: ${error.message}`)
    }
}

/**
 * Main sync function
 * Orchestrates the entire sync process: loading config, modules, agents,
 * generating editor configs, and syncing rules
 * @returns {Promise<void>}
 */
async function sync() {
    try {
        // Load project configuration
        const { config, projectRules, projectDir, toolkitPath, configFilePath } = loadProjectConfiguration()

        // Check and install dependencies if needed (non-blocking)
        if (typeof checkAndInstallDependencies === 'function') {
            try {
                await checkAndInstallDependencies(toolkitPath)
            } catch (error) {
                console.warn(`⚠️  Dependency check failed: ${error.message}`)
                console.warn('⚠️  Continuing with sync, but some features may not work correctly')
                console.warn('⚠️  Run "bun install" in the toolkit directory to fix this\n')
            }
        } else {
            console.warn('⚠️  Dependency checker not available, skipping dependency check\n')
        }

        // Load toolkit resources
        const { modules, agents, projectContext, mergedConfig } = loadToolkitResources(config, toolkitPath, projectDir)

        // Generate all configurations
        generateAllConfigurations(config, mergedConfig, modules, agents, projectContext, projectRules, toolkitPath, projectDir, configFilePath)

        console.log(`\n✨ Sync complete! ${modules.length} modules, ${agents.length} agents loaded.\n`)
    } catch (error) {
        handleError(error, 'Sync Process')
        console.log('Troubleshooting:')
        console.log('  1. Verify standards.md has valid YAML frontmatter')
        console.log('  2. Check toolkit path in standards.md')
        console.log('  3. Ensure all referenced modules exist')
        console.log("  4. Run 'bun run validate' for detailed diagnostics\n")
        process.exit(1)
    }
}
// Run
sync().catch(error => {
    handleError(error, 'Sync Script')
    process.exit(1)
})

