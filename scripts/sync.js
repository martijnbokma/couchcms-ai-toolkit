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
 *   bun ai-toolkit/scripts/sync.js
 *   bun ~/couchcms-ai-toolkit/scripts/sync.js
 */

import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'
import Handlebars from 'handlebars'
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { getConfigFileName, findConfigFile, loadConfig } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TOOLKIT_ROOT = resolve(__dirname, '..')

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
 * Deep merge two objects
 */
function deepMerge(target, source) {
    const result = { ...target }

    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key])
        } else if (source[key] !== undefined) {
            result[key] = source[key]
        }
    }

    return result
}

/**
 * Replace {{variable}} placeholders in content
 */
function replaceVariables(content, variables, prefix = '') {
    let result = content

    for (const [key, value] of Object.entries(variables)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
            result = replaceVariables(result, value, prefix ? `${prefix}.${key}` : key)
        } else {
            const pattern = new RegExp(`\\{\\{${prefix ? `${prefix}.` : ''}${key}\\}\\}`, 'g')
            result = result.replace(pattern, String(value))
        }
    }

    return result
}

/**
 * Find configuration file (standards.md) in current directory or parent directories
 */
function findProjectFile(startDir = process.cwd()) {
    let currentDir = startDir

    while (currentDir !== '/') {
        const configPath = findConfigFile(currentDir)
        if (configPath) {
            return configPath
        }
        currentDir = dirname(currentDir)
    }

    return null
}

/**
 * Resolve toolkit path from project config
 */
function resolveToolkitPath(configPath, projectDir) {
    if (!configPath) {
        return TOOLKIT_ROOT
    }

    // Expand ~ to home directory
    if (configPath.startsWith('~')) {
        configPath = configPath.replace('~', process.env.HOME)
    }

    // Resolve relative paths from project directory (not current working directory)
    if (!configPath.startsWith('/')) {
        configPath = resolve(projectDir, configPath)
    }

    return configPath
}

/**
 * Load a module from the toolkit
 */
function loadModule(moduleName, toolkitPath) {
    const modulePath = join(toolkitPath, 'modules', `${moduleName}.md`)

    if (!existsSync(modulePath)) {
        console.warn(`⚠️  Module not found: ${moduleName}`)
        return null
    }

    const fileContent = readFileSync(modulePath, 'utf8')
    const { data: meta, content } = matter(fileContent)

    return { meta, content, name: moduleName }
}

/**
 * Load an agent from the toolkit
 */
function loadAgent(agentName, toolkitPath) {
    // Agents are now in a flat structure under agents/
    const agentPath = join(toolkitPath, 'agents', `${agentName}.md`)

    if (existsSync(agentPath)) {
        const fileContent = readFileSync(agentPath, 'utf8')
        const { data: meta, content } = matter(fileContent)
        return { meta, content, name: agentName }
    }

    console.warn(`⚠️  Agent not found: ${agentName}`)
    return null
}

/**
 * Load framework category files
 */
function loadFrameworkCategory(frameworkDir, category) {
    const categoryDir = join(frameworkDir, category)

    if (!existsSync(categoryDir)) {
        return ''
    }

    const files = readdirSync(categoryDir)
        .filter(f => f.endsWith('.md'))
        .sort() // Ensure consistent ordering

    let content = ''

    for (const file of files) {
        const filePath = join(categoryDir, file)
        const fileContent = readFileSync(filePath, 'utf8')
        const { content: fileContentBody } = matter(fileContent)
        content += `\n${fileContentBody}\n\n---\n`
    }

    return content
}

/**
 * Load framework from toolkit based on configuration
 */
function loadFramework(config, toolkitPath) {
    // Check if framework is enabled
    if (!config.framework) {
        return null
    }

    const frameworkDir = join(toolkitPath, 'framework')

    if (!existsSync(frameworkDir)) {
        console.warn(`⚠️  Framework directory not found: ${frameworkDir}`)
        return null
    }

    let frameworkContent = '# AAPF Framework\n\n'

    // Determine what to load based on config
    const frameworkConfig = config.framework === true
        ? { doctrine: true, directives: true, playbooks: true, enhancements: true }
        : typeof config.framework === 'object'
            ? config.framework
            : { doctrine: true, directives: true }

    // Always load doctrine (core principles)
    if (frameworkConfig.doctrine !== false) {
        const doctrine = loadFrameworkCategory(frameworkDir, 'doctrine')
        if (doctrine) {
            frameworkContent += `## Operational Doctrine\n\n${doctrine}\n`
        }
    }

    // Always load directives (communication guidelines)
    if (frameworkConfig.directives !== false) {
        const directives = loadFrameworkCategory(frameworkDir, 'directives')
        if (directives) {
            frameworkContent += `## Directives\n\n${directives}\n`
        }
    }

    // Optionally load playbooks (workflow templates)
    if (frameworkConfig.playbooks === true) {
        const playbooks = loadFrameworkCategory(frameworkDir, 'playbooks')
        if (playbooks) {
            frameworkContent += `## Playbooks\n\n${playbooks}\n`
        }
    }

    // Optionally load enhancements (advanced features)
    if (frameworkConfig.enhancements === true) {
        const enhancements = loadFrameworkCategory(frameworkDir, 'enhancements')
        if (enhancements) {
            frameworkContent += `## Enhancements\n\n${enhancements}\n`
        }
    }

    return {
        name: 'framework',
        content: frameworkContent,
        meta: {
            enabled: true,
            categories: Object.keys(frameworkConfig).filter(k => frameworkConfig[k] === true)
        }
    }
}

/**
 * Load project context from context directory
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
 * Check for module conflicts
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
 */
function generateContent(config, mergedConfig, modules, agents, projectContext, projectRules) {
    const timestamp = new Date().toISOString()
    const moduleNames = modules.map(m => m.name).join(', ')
    const agentNames = agents.map(a => a.name).join(', ')
    const { paths, standards } = mergedConfig

    let content = `# AI Coding Standards
# Project: ${config.name || 'Unnamed Project'}
# Generated: ${timestamp}
# Modules: ${moduleNames}
${agentNames ? `# Agents: ${agentNames}` : ''}

## Project Overview

- **Name**: ${config.name || 'Unnamed'}
- **Description**: ${config.description || 'No description'}
- **Type**: CouchCMS Web Application

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
    content = replaceVariables(content, mergedConfig)

    return content
}

/**
 * Prepare template data for rendering
 */
function prepareTemplateData(config, mergedConfig, modules, agents, projectContext, toolkitPath, projectDir, framework) {
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

    // Get config file path (standards.md)
    const configFilePath = getConfigFileName(projectDir) || 'standards.md'

    // Add timestamp for templates
    const timestamp = new Date().toISOString()

    return {
        project: {
            name: config.name || 'Unnamed Project',
            type: config.type || 'CouchCMS Web Application',
            description: config.description || 'No description',
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
        project_context: projectContext?.content || '',
        toolkit_path: toolkitPath,
        context_path: config.context || null,
        config_file_path: configFilePath,
        framework: framework ? framework.content : '',
        framework_enabled: framework !== null,
        timestamp: timestamp,
    }
}

/**
 * Generate editor configuration files from templates
 */
function generateEditorConfigs(toolkitPath, projectDir, templateData) {
    const templatesDir = join(toolkitPath, 'templates', 'editors')

    if (!existsSync(templatesDir)) {
        return // No templates directory
    }

    // Mapping of template files to output files
    const templateMap = {
        'cursor.template.md': { output: '.cursorrules', dir: projectDir, type: 'markdown' },
        'claude.template.md': { output: 'CLAUDE.md', dir: projectDir, type: 'markdown' },
        'copilot.template.md': { output: 'copilot-instructions.md', dir: join(projectDir, '.github'), type: 'markdown' },
        'codewhisperer.template.md': { output: '.codewhisperer/rules.md', dir: projectDir, type: 'markdown' },
        'tabnine.template.md': { output: '.tabnine/guidelines/couchcms-standards.md', dir: projectDir, type: 'markdown' },
        'kiro.template.md': { output: '.kiro/steering/coding-standards.md', dir: projectDir, type: 'markdown' },
        'windsurf.template.md': { output: '.windsurf/rules.md', dir: projectDir, type: 'markdown' },
        'agent.template.md': { output: 'AGENT.md', dir: projectDir, type: 'markdown' },
        'user-rules.template.md': { output: 'USER-RULES.md', dir: projectDir, type: 'markdown' },
        'project-rules.template.md': { output: 'PROJECT-RULES-TEMPLATE.md', dir: projectDir, type: 'markdown' },
    }

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
            const templateContent = readFileSync(templatePath, 'utf8')

            // Compile and render template
            const template = Handlebars.compile(templateContent)
            const rendered = template(templateData)

            // Build full output path
            const outputPath = join(mapping.dir, mapping.output)

            // Ensure output directory exists (handle subdirectories in output path)
            const outputDir = dirname(outputPath)
            if (!existsSync(outputDir)) {
                mkdirSync(outputDir, { recursive: true })
            }

            // Write output file
            writeFileSync(outputPath, rendered)
            generatedCount++

            console.log(`✅ Generated: ${mapping.output}`)
        } catch (error) {
            console.warn(`⚠️  Failed to generate from ${templateFile}: ${error.message}`)
        }
    }

    // Generate Tabnine JSON settings.json (separate from Markdown template)
    try {
        const tabnineDir = join(projectDir, '.tabnine')
        const tabnineSettingsPath = join(tabnineDir, 'settings.json')

        if (!existsSync(tabnineDir)) {
            mkdirSync(tabnineDir, { recursive: true })
        }

        const tabnineSettings = {
            toolPermissions: {
                readProjectFiles: 'askFirst',
                createProjectFiles: 'askFirst',
                applyCode: 'askFirst',
                readTerminal: 'disable',
                runCommand: 'askFirst',
                listDirectory: 'autoApprove',
                getDiagnostics: 'autoApprove',
                workspaceSearch: 'askFirst',
            },
            inlineSuggest: {
                enabled: true,
            },
            disableFileRegex: [],
        }

        writeFileSync(tabnineSettingsPath, JSON.stringify(tabnineSettings, null, 2))
        console.log(`✅ Generated: .tabnine/settings.json`)
        generatedCount++
    } catch (error) {
        console.warn(`⚠️  Failed to generate Tabnine settings.json: ${error.message}`)
    }

    // Generate CodeWhisperer README (CodeWhisperer doesn't use .codewhisperer folder)
    try {
        const codewhispererDir = join(projectDir, '.codewhisperer')
        const codewhispererReadmePath = join(codewhispererDir, 'README.md')

        if (!existsSync(codewhispererDir)) {
            mkdirSync(codewhispererDir, { recursive: true })
        }

        const codewhispererReadme = `# CodeWhisperer Configuration

## Important Note

**Amazon CodeWhisperer does NOT use a \`.codewhisperer\` folder for project configuration.**

CodeWhisperer integrates directly into supported IDEs (VS Code, JetBrains) and uses:
- IDE settings (via \`settings.json\` in VS Code workspace settings)
- AWS Management Console for user management and permissions

## This Folder

The \`rules.md\` file in this folder is **for reference only** and contains project-specific coding standards. It is **not automatically used** by CodeWhisperer.

## How to Use CodeWhisperer with This Project

1. **Install CodeWhisperer extension** in your IDE
2. **Configure via IDE settings** - CodeWhisperer settings are managed in your IDE's settings panel
3. **Reference \`rules.md\`** - Use the guidelines in \`rules.md\` as a manual reference for project standards

## VS Code Configuration

If using VS Code, you can add CodeWhisperer-specific settings to your workspace \`settings.json\`:

\`\`\`json
{
  "aws.codeWhisperer.enableCodeSuggestions": true,
  "aws.codeWhisperer.enableSecurityScans": true
}
\`\`\`

## More Information

- [AWS CodeWhisperer User Guide](https://docs.aws.amazon.com/codewhisperer/latest/userguide/)
- [CodeWhisperer IDE Integration](https://docs.aws.amazon.com/codewhisperer/latest/userguide/setup.html)
`

        writeFileSync(codewhispererReadmePath, codewhispererReadme)
        console.log(`✅ Generated: .codewhisperer/README.md`)
        generatedCount++
    } catch (error) {
        console.warn(`⚠️  Failed to generate CodeWhisperer README: ${error.message}`)
    }

    // Kiro steering document is generated from template above
    // Frontmatter with inclusion: always is already in the template

    return generatedCount
}

/**
 * Load skill rules from a module
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
 */
function syncCursorRules(toolkitPath, projectDir, mergedConfig) {
    const rulesSource = join(toolkitPath, 'rules')
    const rulesTarget = join(projectDir, '.cursor', 'rules')

    if (!existsSync(rulesSource)) {
        return // No rules in toolkit
    }

    // Create target directory if needed
    if (!existsSync(rulesTarget)) {
        mkdirSync(rulesTarget, { recursive: true })
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
        content = replaceVariables(content, mergedConfig)

        writeFileSync(targetPath, content)
    }

    if (ruleFiles.length > 0) {
        const copiedCount = ruleFiles.filter(f => f !== 'README.md').length
        console.log(`✅ Synced: ${copiedCount} Cursor rules to .cursor/rules/`)
    }
}

/**
 * Sync Cursor commands from toolkit to project
 */
function syncCursorCommands(toolkitPath, projectDir, mergedConfig) {
    const commandsSource = join(toolkitPath, 'commands')
    const commandsTarget = join(projectDir, '.cursor', 'commands')

    if (!existsSync(commandsSource)) {
        return // No commands in toolkit
    }

    // Create target directory if needed
    if (!existsSync(commandsTarget)) {
        mkdirSync(commandsTarget, { recursive: true })
    }

    // Get all .md files from toolkit commands (skip README.md)
    const commandFiles = readdirSync(commandsSource).filter(f => f.endsWith('.md') && f !== 'README.md')

    for (const commandFile of commandFiles) {
        const sourcePath = join(commandsSource, commandFile)
        const targetPath = join(commandsTarget, commandFile)

        let content = readFileSync(sourcePath, 'utf8')

        // Replace {{paths.xxx}} variables
        content = replaceVariables(content, mergedConfig)

        writeFileSync(targetPath, content)
    }

    if (commandFiles.length > 0) {
        console.log(`✅ Synced: ${commandFiles.length} Cursor commands to .cursor/commands/`)
    }
}

/**
 * Main sync function
 */
async function sync() {
    try {
        console.log('🔄 CouchCMS AI Toolkit - Sync\n')

        // Find configuration file (standards.md)
        const configPath = findProjectFile()

        if (!configPath) {
            const configFileName = getConfigFileName(process.cwd()) || 'standards.md'
            console.error(`❌ No configuration file found in current directory or parent directories.`)
            console.log(`\nCreate a ${configFileName} file with:\n`)
            console.log(`---
name: "my-project"
description: "Project description"
toolkit: "./ai-toolkit-shared"
modules:
  - couchcms-core
  - tailwindcss
  - alpinejs
agents:
  - couchcms
  - tailwindcss
  - alpinejs
---

# Project-Specific Rules

Add your project-specific instructions here...
`)
            console.log('\n💡 Tip: Use .project/standards.md for the recommended location.')
            process.exit(1)
        }

        console.log(`📄 Found: ${configPath}`)
        // If config is in .project/, use parent directory as project root
        // Otherwise, use the directory containing the config file
        let projectDir = dirname(configPath)
        if (configPath.includes('/.project/') || configPath.endsWith('.project/standards.md')) {
            projectDir = dirname(projectDir) // Go up one level to project root
        }

        // Parse configuration file
        // Use the configPath we already found, don't search again
        let config, projectRules
        try {
            const content = readFileSync(configPath, 'utf8')
            const { data: frontmatter, content: body } = matter(content)
            config = frontmatter
            projectRules = body
        } catch (error) {
            // Use relative path for better error message
            const relativePath = configPath.replace(projectDir + '/', '')
            console.error(`❌ Failed to parse ${relativePath}: ${error.message}`)
            console.log(`\nEnsure ${relativePath} has valid YAML frontmatter.\n`)
            process.exit(1)
        }

        console.log(`📦 Project: ${config.name || 'Unnamed'}`)

        // Resolve toolkit path
        const toolkitPath = resolveToolkitPath(config.toolkit, projectDir)

        // Verify toolkit path exists
        if (!existsSync(toolkitPath)) {
            console.error(`❌ Toolkit path not found: ${toolkitPath}`)
            console.log(`\nCheck the 'toolkit' path in your ${getConfigFileName(projectDir) || 'standards.md'}\n`)
            process.exit(1)
        }

        console.log(`🛠️  Toolkit: ${toolkitPath}`)

        // Load defaults and merge with project config
        const defaults = loadDefaults(toolkitPath)
        const mergedConfig = deepMerge(defaults, {
            paths: config.paths || {},
            standards: config.standards || config.overrides || {},
            naming: config.naming || {},
        })

        console.log(`📁 Paths: ${Object.keys(mergedConfig.paths).length} configured`)

        // Ensure couchcms-core is always included - ensure it's always an array
        let moduleList = config.modules || ['couchcms-core']
        if (!Array.isArray(moduleList)) {
            // If it's a string, convert to array; otherwise default to ['couchcms-core']
            moduleList = typeof moduleList === 'string' ? [moduleList] : ['couchcms-core']
        }
        if (!moduleList.includes('couchcms-core')) {
            moduleList.unshift('couchcms-core')
        }

        console.log(`📚 Modules: ${moduleList.join(', ')}`)

        // Load modules
        const modules = moduleList.map(name => loadModule(name, toolkitPath)).filter(Boolean)

        // Load agents - check for active_agents first, then agents
        // active_agents is the list of agent modules to load
        // agents (if it's an object) is the AI tool configuration (cursor, copilot, etc.)
        let agentList = config.active_agents || config.agents || []

        // If agents is an object (AI tool config), it's not the agent list
        if (agentList && typeof agentList === 'object' && !Array.isArray(agentList)) {
            // Check if it has AI tool keys (cursor, copilot, etc.)
            if ('cursor' in agentList || 'copilot' in agentList || 'claude' in agentList) {
                agentList = [] // This is AI tool config, not agent modules
            }
        }

        if (!Array.isArray(agentList)) {
            // If it's a string, convert to array; otherwise default to empty array
            agentList = typeof agentList === 'string' ? [agentList] : []
        }
        const agents = agentList.map(name => loadAgent(name, toolkitPath)).filter(Boolean)

        if (agents.length > 0) {
            console.log(`🤖 Agents: ${agents.map(a => a.name).join(', ')}`)
        }

        // Load framework (if enabled)
        const framework = loadFramework(config, toolkitPath)
        if (framework) {
            const categories = framework.meta.categories || []
            console.log(`📐 Framework: ${categories.length > 0 ? categories.join(', ') : 'enabled'}`)
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

        // Prepare template data
        const templateData = prepareTemplateData(config, mergedConfig, modules, agents, projectContext, toolkitPath, projectDir, framework)

        // Add project rules to template data
        if (projectRules && projectRules.trim()) {
            templateData.project_rules = projectRules
        }

        // Add module list for templates - ensure it's always an array
        let moduleListForTemplate = config.modules || ['couchcms-core']
        if (!Array.isArray(moduleListForTemplate)) {
            moduleListForTemplate = typeof moduleListForTemplate === 'string' ? [moduleListForTemplate] : ['couchcms-core']
        }
        templateData.module_list = moduleListForTemplate.join(', ')

        // Generate editor configurations from templates
        try {
            const generatedCount = generateEditorConfigs(toolkitPath, projectDir, templateData)
            if (generatedCount === 0) {
                console.warn('⚠️  No editor configs generated - templates may be missing')
            }
        } catch (error) {
            console.error(`❌ Failed to generate editor configs: ${error.message}`)
            console.log('\nCheck template files in toolkit.\n')
            process.exit(1)
        }

        // Sync Cursor rules
        try {
            syncCursorRules(toolkitPath, projectDir, mergedConfig)
        } catch (error) {
            console.warn(`⚠️  Failed to sync Cursor rules: ${error.message}`)
        }

        // Sync Cursor commands
        try {
            syncCursorCommands(toolkitPath, projectDir, mergedConfig)
        } catch (error) {
            console.warn(`⚠️  Failed to sync Cursor commands: ${error.message}`)
        }

        // Generate Claude Code configuration
        try {
            const skillRulesCount = generateClaudeCodeConfig(toolkitPath, projectDir, moduleList, {
                ...mergedConfig,
                name: config.name,
            })
            if (skillRulesCount > 0) {
                console.log(`🤖 Claude Code: ${skillRulesCount} skill-rules configured`)
            }
        } catch (error) {
            console.warn(`⚠️  Failed to generate Claude Code config: ${error.message}`)
        }

        console.log(`\n✨ Sync complete! ${modules.length} modules, ${agents.length} agents loaded.\n`)
    } catch (error) {
        console.error(`\n❌ Sync failed: ${error.message}\n`)
        console.log('Troubleshooting:')
            const configFileName = getConfigFileName(process.cwd()) || 'standards.md'
            console.log(`  1. Verify ${configFileName} has valid YAML frontmatter`)
            console.log(`  2. Check toolkit path in ${configFileName}`)
        console.log('  3. Ensure all referenced modules exist')
        console.log("  4. Run 'bun run validate' for detailed diagnostics\n")
        process.exit(1)
    }
}

// Run
sync().catch(error => {
    console.error(`\n❌ Unexpected error: ${error.message}\n`)
    process.exit(1)
})
