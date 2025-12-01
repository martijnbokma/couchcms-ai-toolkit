#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Sync Script
 *
 * Generates editor configurations from project.md, toolkit modules,
 * agents, and project-specific context.
 *
 * Features:
 * - Loads default configuration from defaults.yaml
 * - Merges project-specific overrides from project.md
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
 * Find project.md in current directory or parent directories
 */
function findProjectFile(startDir = process.cwd()) {
    let currentDir = startDir
    const possibleNames = ['project.md', 'PROJECT.md']

    while (currentDir !== '/') {
        for (const name of possibleNames) {
            const projectPath = join(currentDir, name)
            if (existsSync(projectPath)) {
                return projectPath
            }
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
 * Load a module from the toolkit (with caching)
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

    // Add project-specific rules from project.md
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
function prepareTemplateData(config, mergedConfig, modules, agents, projectContext, toolkitPath) {
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
        'cursor.template.md': { output: '.cursorrules', dir: projectDir },
        'claude.template.md': { output: 'CLAUDE.md', dir: projectDir },
        'copilot.template.md': { output: 'copilot-instructions.md', dir: join(projectDir, '.github') },
        'codewhisperer.template.md': { output: '.codewhisperer/settings.json', dir: projectDir },
        'tabnine.template.md': { output: '.tabnine/settings.json', dir: projectDir },
        'windsurf.template.md': { output: '.windsurf/rules.md', dir: projectDir },
        'agent.template.md': { output: 'AGENT.md', dir: projectDir },
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

            // Check cache for compiled template
            let template = cache.getTemplate(templatePath)
            let templateContent = null

            if (!template) {
                templateContent = readFileSync(templatePath, 'utf8')

                // Validate template variables before rendering
                try {
                    validateTemplate(templateContent, templateData, templatePath)
                } catch (error) {
                    console.error(`❌ Template validation failed for ${templateFile}:`)
                    console.error(error.message)
                    throw error
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
 * Main sync function
 */
async function sync() {
    try {
        console.log('🔄 CouchCMS AI Toolkit - Sync\n')

        // Find project.md
        const projectPath = findProjectFile()

        if (!projectPath) {
            console.error('❌ No project.md found in current directory or parent directories.')
            console.log('\nCreate a project.md file with:\n')
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
        const projectDir = dirname(projectPath)

        // Parse project.md
        let config, projectRules
        try {
            const projectContent = readFileSync(projectPath, 'utf8')
            const parsed = matter(projectContent)
            config = parsed.data
            projectRules = parsed.content
        } catch (error) {
            console.error(`❌ Failed to parse project.md: ${error.message}`)
            console.log('\nEnsure project.md has valid YAML frontmatter.\n')
            process.exit(1)
        }

        console.log(`📦 Project: ${config.name || 'Unnamed'}`)

        // Resolve toolkit path
        const toolkitPath = resolveToolkitPath(config.toolkit, projectDir)

        // Verify toolkit path exists
        if (!existsSync(toolkitPath)) {
            console.error(`❌ Toolkit path not found: ${toolkitPath}`)
            console.log("\nCheck the 'toolkit' path in your project.md\n")
            process.exit(1)
        }

        console.log(`🛠️  Toolkit: ${toolkitPath}`)

        // Check and install dependencies if needed
        try {
            await checkAndInstallDependencies(toolkitPath)
        } catch (error) {
            console.error(`❌ ${error.message}`)
            process.exit(1)
        }

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
        const agentList = config.agents || []
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

        // Prepare template data
        const templateData = prepareTemplateData(config, mergedConfig, modules, agents, projectContext, toolkitPath)

        // Add project rules to template data
        if (projectRules && projectRules.trim()) {
            templateData.project_rules = projectRules
        }

        // Add module list for templates
        templateData.module_list = (config.modules || ['couchcms-core']).join(', ')

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
        console.log('  1. Verify project.md has valid YAML frontmatter')
        console.log('  2. Check toolkit path in project.md')
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

