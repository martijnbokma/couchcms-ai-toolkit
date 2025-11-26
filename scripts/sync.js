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
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync, rmSync, statSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { getConfigFileName, findConfigFile, loadConfig, findProjectFile, resolveToolkitPath, replaceVariables, ToolkitError, handleError } from './utils.js'

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
 * @param {string} toolkitPath - Path to toolkit root directory
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
 * Deep merge two objects
 * @param {object} target - Target object to merge into
 * @param {object} source - Source object to merge from
 * @returns {object} - Merged object
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
 * Load a module from the toolkit
 * @param {string} moduleName - Name of module to load
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {object|null} - Module object with { meta, content, name } or null if not found
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
 * @param {string} agentName - Name of agent to load
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {object|null} - Agent object with { meta, content, name } or null if not found
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
 * @param {string} frameworkDir - Path to framework directory
 * @param {string} category - Category name (doctrine, directives, etc.)
 * @returns {string} - Combined content from all files in category
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
 * @param {object} config - Project configuration
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {object|null} - Framework object with { name, content, meta } or null if disabled
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
 * @param {string} contextPath - Path to context directory (relative or absolute)
 * @param {string} projectDir - Project root directory
 * @returns {object|null} - Context object with { meta, content, path } or null if not found
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
 * @param {Array<object>} modules - Array of loaded modules
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
 * @returns {string} - Markdown formatted paths documentation
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
 * @param {object} config - Project configuration
 * @param {object} mergedConfig - Merged default and project configuration
 * @param {Array<object>} modules - Array of loaded modules
 * @param {Array<object>} agents - Array of loaded agents
 * @param {object|null} projectContext - Project context object or null
 * @param {string} projectRules - Project-specific rules content
 * @returns {string} - Combined configuration content with variables replaced
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
 * @param {object} config - Project configuration
 * @param {object} mergedConfig - Merged default and project configuration
 * @param {Array<object>} modules - Array of loaded modules
 * @param {Array<object>} agents - Array of loaded agents
 * @param {object|null} projectContext - Project context object or null
 * @param {string} toolkitPath - Path to toolkit root
 * @param {string} projectDir - Project root directory
 * @param {object|null} framework - Framework object or null
 * @returns {object} - Template data object for Handlebars rendering
 */
function prepareTemplateData(config, mergedConfig, modules, agents, projectContext, toolkitPath, projectDir, framework) {
    const { paths, standards, naming } = mergedConfig

    // Extract languages and frameworks from config or infer from modules
    // First try from config (explicit), then infer from modules
    let languages = config.languages || []
    let frameworks = config.frameworks || []
    const techHierarchy = []

    // Build tech hierarchy and infer languages/frameworks from modules if not in config
    modules.forEach((mod, index) => {
        const modName = mod.meta?.name || mod.name
        const modCategory = mod.meta?.category || ''

        techHierarchy.push({
            name: modName,
            description: mod.meta?.description || 'No description',
            order: index + 1,
        })
    })

    // Infer languages and frameworks from modules if not explicitly set in config
    if (languages.length === 0) {
        // Check for TypeScript/JavaScript
        if (modules.some(m => m.name.includes('typescript'))) languages.push('TypeScript')
        if (modules.some(m => m.name.includes('javascript'))) languages.push('JavaScript')
        // CouchCMS implies PHP
        if (modules.some(m => m.name.includes('couchcms'))) languages.push('PHP')
        // CSS/HTML are always present in web projects
        if (modules.some(m => m.name.includes('tailwind') || m.name.includes('css'))) languages.push('CSS')
        languages.push('HTML') // Always present in web projects
    }

    if (frameworks.length === 0) {
        // Infer frameworks from module names - use display names from meta if available
        modules.forEach(mod => {
            const modName = mod.name.toLowerCase()
            const displayName = mod.meta?.name || mod.name

            if (modName.includes('couchcms') && !frameworks.some(f => f.toLowerCase().includes('couchcms'))) {
                // Use "CouchCMS" instead of "CouchCMS Core" for cleaner display
                frameworks.push('CouchCMS')
            }
            if (modName.includes('tailwind') && !frameworks.some(f => f.toLowerCase().includes('tailwind'))) {
                frameworks.push(displayName.includes('Tailwind') ? displayName : 'TailwindCSS')
            }
            if (modName.includes('daisyui') && !frameworks.some(f => f.toLowerCase().includes('daisyui'))) {
                frameworks.push(displayName.includes('daisyUI') ? displayName : 'daisyUI')
            }
            if (modName.includes('alpine') && !frameworks.some(f => f.toLowerCase().includes('alpine'))) {
                frameworks.push(displayName.includes('Alpine') ? displayName : 'Alpine.js')
            }
        })
    }

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

    // Support both old format (config.name) and new format (config.project.name)
    const projectName = config.project?.name || config.name || 'Unnamed Project'
    const projectType = config.project?.type || config.type || 'CouchCMS Web Application'
    const projectDescription = config.project?.description || config.description || 'No description'

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
 * Get template mapping configuration
 * @param {string} projectDir - Project root directory
 * @returns {object} - Template file to output mapping
 */
function getTemplateMap(projectDir) {
    return {
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
}

/**
 * Render a Handlebars template with data
 * @param {string} templatePath - Path to template file
 * @param {object} templateData - Data to render template with
 * @returns {string} - Rendered template content
 * @throws {Error} If template cannot be loaded or rendered
 */
function renderTemplate(templatePath, templateData) {
    const templateContent = readFileSync(templatePath, 'utf8')
    const template = Handlebars.compile(templateContent)
    return template(templateData)
}

/**
 * Write rendered content to a file, creating directories as needed
 * @param {string} outputPath - Full path to output file
 * @param {string} content - Content to write
 * @returns {boolean} - True if successful, false otherwise
 */
function writeConfigFile(outputPath, content) {
    try {
        // Ensure output directory exists
        const outputDir = dirname(outputPath)
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true })
        }

        writeFileSync(outputPath, content)
        return true
    } catch (error) {
        console.warn(`⚠️  Failed to write ${outputPath}: ${error.message}`)
        return false
    }
}

/**
 * Generate Tabnine settings.json file
 * @param {string} projectDir - Project root directory
 * @returns {boolean} - True if successful, false otherwise
 */
function generateTabnineSettings(projectDir) {
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
        return true
    } catch (error) {
        console.warn(`⚠️  Failed to generate Tabnine settings.json: ${error.message}`)
        return false
    }
}

/**
 * Generate CodeWhisperer README file
 * @param {string} projectDir - Project root directory
 * @returns {boolean} - True if successful, false otherwise
 */
function generateCodeWhispererReadme(projectDir) {
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
        return true
    } catch (error) {
        console.warn(`⚠️  Failed to generate CodeWhisperer README: ${error.message}`)
        return false
    }
}

/**
 * Generate editor configuration files from templates
 * @param {string} toolkitPath - Path to toolkit root
 * @param {string} projectDir - Project root directory
 * @param {object} templateData - Template data for rendering
 * @returns {number} - Number of files generated
 */
function generateEditorConfigs(toolkitPath, projectDir, templateData) {
    const templatesDir = join(toolkitPath, 'templates', 'editors')

    if (!existsSync(templatesDir)) {
        return 0 // No templates directory
    }

    const templateMap = getTemplateMap(projectDir)
    const templateFiles = readdirSync(templatesDir).filter(f => f.endsWith('.template.md'))
    let generatedCount = 0

    // Generate files from templates
    for (const templateFile of templateFiles) {
        const mapping = templateMap[templateFile]
        if (!mapping) {
            continue // Skip unmapped templates
        }

        try {
            // Load and render template
            const templatePath = join(templatesDir, templateFile)
            const rendered = renderTemplate(templatePath, templateData)

            // Write output file
            const outputPath = join(mapping.dir, mapping.output)
            if (writeConfigFile(outputPath, rendered)) {
                generatedCount++
                console.log(`✅ Generated: ${mapping.output}`)
            }
        } catch (error) {
            console.warn(`⚠️  Failed to generate from ${templateFile}: ${error.message}`)
        }
    }

    // Generate Tabnine settings.json
    if (generateTabnineSettings(projectDir)) {
        generatedCount++
    }

    // Generate CodeWhisperer README
    if (generateCodeWhispererReadme(projectDir)) {
        generatedCount++
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
 * @param {string} toolkitPath - Path to toolkit root
 * @param {string} projectDir - Project root directory
 * @param {Array<string>} moduleNames - List of module names
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
 * @param {string} toolkitPath - Path to toolkit root
 * @param {string} projectDir - Project root directory
 * @param {object} mergedConfig - Merged configuration for variable replacement
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
 * @param {string} toolkitPath - Path to toolkit root
 * @param {string} projectDir - Project root directory
 * @param {object} mergedConfig - Merged configuration for variable replacement
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
 * Clean generated files and directories
 * @param {string} projectDir - Project root directory
 */
function cleanGeneratedFiles(projectDir) {
    console.log('🧹 Cleaning generated files...\n')

    const filesToRemove = [
        // Root files
        '.cursorrules',
        'CLAUDE.md',
        'AGENT.md',
        'USER-RULES.md',
        'PROJECT-RULES-TEMPLATE.md',

        // .github
        '.github/copilot-instructions.md',

        // .codewhisperer
        '.codewhisperer/rules.md',
        '.codewhisperer/README.md',

        // .tabnine
        '.tabnine/guidelines/couchcms-standards.md',
        '.tabnine/settings.json',

        // .kiro
        '.kiro/steering/coding-standards.md',

        // .windsurf
        '.windsurf/rules.md',

        // .claude
        '.claude/skills/skill-rules.json',
        '.claude/settings.json',
    ]

    const dirsToClean = [
        '.cursor/rules',
        '.cursor/commands',
        '.claude/hooks',
    ]

    let removedCount = 0

    // Remove individual files
    for (const file of filesToRemove) {
        const filePath = join(projectDir, file)
        if (existsSync(filePath)) {
            try {
                rmSync(filePath, { force: true })
                removedCount++
                console.log(`  🗑️  Removed: ${file}`)
            } catch (error) {
                console.warn(`  ⚠️  Failed to remove ${file}: ${error.message}`)
            }
        }
    }

    // Clean directories (remove all files, but keep directory structure)
    for (const dir of dirsToClean) {
        const dirPath = join(projectDir, dir)
        if (existsSync(dirPath)) {
            try {
                const files = readdirSync(dirPath)
                for (const file of files) {
                    const filePath = join(dirPath, file)
                    const stat = statSync(filePath)
                    if (stat.isFile()) {
                        rmSync(filePath, { force: true })
                        removedCount++
                        console.log(`  🗑️  Removed: ${dir}/${file}`)
                    }
                }

                // Remove directory if empty
                try {
                    const remainingFiles = readdirSync(dirPath)
                    if (remainingFiles.length === 0) {
                        rmSync(dirPath, { recursive: true, force: true })
                        console.log(`  🗑️  Removed empty directory: ${dir}`)
                    }
                } catch (error) {
                    // Directory might have been removed already or has subdirectories
                }
            } catch (error) {
                console.warn(`  ⚠️  Failed to clean ${dir}: ${error.message}`)
            }
        }
    }

    // Clean .claude/rules if it exists (only generated files)
    const claudeRulesPath = join(projectDir, '.claude', 'rules')
    if (existsSync(claudeRulesPath)) {
        try {
            const files = readdirSync(claudeRulesPath)
            for (const file of files) {
                // Only remove .mdc files (generated rules)
                if (file.endsWith('.mdc')) {
                    const filePath = join(claudeRulesPath, file)
                    rmSync(filePath, { force: true })
                    removedCount++
                    console.log(`  🗑️  Removed: .claude/rules/${file}`)
                }
            }
        } catch (error) {
            console.warn(`  ⚠️  Failed to clean .claude/rules: ${error.message}`)
        }
    }

    // Remove empty directories
    const dirsToCheck = [
        '.tabnine/guidelines',
        '.tabnine',
        '.codewhisperer',
        '.kiro/steering',
        '.kiro',
        '.windsurf',
        '.claude/skills',
        '.claude/hooks',
        '.claude/rules',
        '.claude',
        '.cursor/rules',
        '.cursor/commands',
        '.cursor',
        '.github',
    ]

    // Remove empty directories (in reverse order to handle nested dirs)
    for (const dir of dirsToCheck.reverse()) {
        const dirPath = join(projectDir, dir)
        if (existsSync(dirPath)) {
            try {
                const files = readdirSync(dirPath)
                if (files.length === 0) {
                    rmSync(dirPath, { recursive: true, force: true })
                    console.log(`  🗑️  Removed empty directory: ${dir}`)
                }
            } catch (error) {
                // Directory might have been removed already
            }
        }
    }

    if (removedCount > 0) {
        console.log(`\n✅ Cleaned ${removedCount} file(s)\n`)
    } else {
        console.log(`\n✅ No generated files to clean\n`)
    }
}

/**
 * Display configuration file creation help
 * @param {string} configFileName - Name of config file to create
 */
function displayConfigHelp(configFileName) {
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
}

/**
 * Resolve project root directory from config path
 * Handles special cases for .project/ and ai-toolkit-shared/ directories
 * @param {string} configPath - Path to configuration file
 * @returns {{projectDir: string, needsParentDir: boolean, reason: string}} - Project directory info
 */
function resolveProjectDir(configPath) {
    let projectDir = dirname(configPath)
    const normalizedPath = configPath.replace(/\\/g, '/')
    const pathParts = normalizedPath.split('/')
    const projectIndex = pathParts.indexOf('.project')
    const toolkitIndex = pathParts.indexOf('ai-toolkit-shared')

    let needsParentDir = false
    let reason = ''

    if (projectIndex !== -1 && pathParts[projectIndex + 1] === 'standards.md') {
        needsParentDir = true
        reason = '.project/'
    } else if (toolkitIndex !== -1 && pathParts[toolkitIndex + 1] === 'standards.md') {
        needsParentDir = true
        reason = 'ai-toolkit-shared/'
    }

    if (needsParentDir) {
        const originalProjectDir = projectDir
        projectDir = dirname(projectDir)
        console.log(`📁 Config in ${reason}, using parent as project root`)
        console.log(`   Before: ${originalProjectDir}`)
        console.log(`   After:  ${projectDir}`)
    } else {
        console.log(`📁 Project root: ${projectDir}`)
    }

    return { projectDir, needsParentDir, reason }
}

/**
 * Parse configuration file and extract frontmatter and content
 * @param {string} configPath - Path to configuration file
 * @param {string} projectDir - Project root directory
 * @returns {{config: object, projectRules: string}} - Parsed configuration
 * @throws {ToolkitError} If parsing fails
 */
function parseConfigFile(configPath, projectDir) {
    try {
        const content = readFileSync(configPath, 'utf8')
        const { data: frontmatter, content: body } = matter(content)
        return { config: frontmatter, projectRules: body }
    } catch (error) {
        const relativePath = configPath.replace(projectDir + '/', '')
        throw new ToolkitError(
            `Failed to parse ${relativePath}`,
            'CONFIG_PARSE_ERROR',
            error
        )
    }
}

/**
 * Resolve toolkit path with special handling for ai-toolkit-shared directory
 * @param {object} config - Project configuration
 * @param {string} projectDir - Project root directory
 * @param {boolean} needsParentDir - Whether config is in special directory
 * @param {string} reason - Reason for parent directory ('.project/' or 'ai-toolkit-shared/')
 * @param {string} configPath - Path to configuration file
 * @returns {string} - Resolved toolkit path
 */
function resolveToolkitPathWithContext(config, projectDir, needsParentDir, reason, configPath) {
    let toolkitBaseDir = projectDir

    if (needsParentDir && reason === 'ai-toolkit-shared/') {
        toolkitBaseDir = dirname(configPath)
        if (!config.toolkit || config.toolkit === '.' || config.toolkit === './') {
            return toolkitBaseDir
        }
        return resolveToolkitPath(config.toolkit, toolkitBaseDir, TOOLKIT_ROOT)
    }

    const defaultToolkitPath = './ai-toolkit-shared'
    return resolveToolkitPath(config.toolkit || defaultToolkitPath, toolkitBaseDir, TOOLKIT_ROOT)
}

/**
 * Normalize and validate module list
 * Ensures couchcms-core is always included
 * @param {string[]|string|undefined} moduleList - Module list from config
 * @returns {string[]} - Normalized module array
 */
function normalizeModuleList(moduleList) {
    let normalized = moduleList || ['couchcms-core']

    if (!Array.isArray(normalized)) {
        normalized = typeof normalized === 'string' ? [normalized] : ['couchcms-core']
    }

    if (!normalized.includes('couchcms-core')) {
        normalized.unshift('couchcms-core')
    }

    return normalized
}

/**
 * Normalize and validate agent list
 * Handles both active_agents and agents config keys
 * @param {object} config - Project configuration
 * @returns {string[]} - Normalized agent array
 */
function normalizeAgentList(config) {
    let agentList = config.active_agents || config.agents || []

    // If agents is an object (AI tool config), it's not the agent list
    if (agentList && typeof agentList === 'object' && !Array.isArray(agentList)) {
        if ('cursor' in agentList || 'copilot' in agentList || 'claude' in agentList) {
            agentList = []
        }
    }

    if (!Array.isArray(agentList)) {
        agentList = typeof agentList === 'string' ? [agentList] : []
    }

    return agentList
}

/**
 * Load all modules from toolkit
 * @param {string[]} moduleList - List of module names
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {object[]} - Array of loaded modules
 */
function loadAllModules(moduleList, toolkitPath) {
    return moduleList.map(name => loadModule(name, toolkitPath)).filter(Boolean)
}

/**
 * Load all agents from toolkit
 * @param {string[]} agentList - List of agent names
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {object[]} - Array of loaded agents
 */
function loadAllAgents(agentList, toolkitPath) {
    return agentList.map(name => loadAgent(name, toolkitPath)).filter(Boolean)
}

/**
 * Load and validate project configuration
 * @returns {object} - Configuration object with { config, projectDir, toolkitPath, mergedConfig, projectRules }
 * @throws {ToolkitError} If configuration is invalid or missing
 */
function loadProjectConfiguration() {
    // Find configuration file (standards.md)
    const configPath = findProjectFile()

    if (!configPath) {
        const configFileName = getConfigFileName(process.cwd()) || 'standards.md'
        displayConfigHelp(configFileName)
        process.exit(1)
    }

    console.log(`📄 Found: ${configPath}`)

    // Resolve project directory
    const { projectDir, needsParentDir, reason } = resolveProjectDir(configPath)

    // Parse configuration file
    const { config, projectRules } = parseConfigFile(configPath, projectDir)

    // Support both old format (config.name) and new format (config.project.name)
    const projectName = config.project?.name || config.name || 'Unnamed'
    console.log(`📦 Project: ${projectName}`)

    // Clean generated files before syncing
    cleanGeneratedFiles(projectDir)

    // Resolve toolkit path
    const toolkitPath = resolveToolkitPathWithContext(
        config,
        projectDir,
        needsParentDir,
        reason,
        configPath
    )

    // Verify toolkit path exists
    if (!existsSync(toolkitPath)) {
        throw new ToolkitError(
            `Toolkit path not found: ${toolkitPath}`,
            'TOOLKIT_NOT_FOUND'
        )
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

    return {
        config,
        projectDir,
        toolkitPath,
        mergedConfig,
        projectRules,
    }
}

/**
 * Load all toolkit resources (modules, agents, framework, context)
 * @param {object} config - Project configuration
 * @param {string} toolkitPath - Path to toolkit root
 * @param {string} projectDir - Project root directory
 * @returns {object} - Resources object with { modules, agents, framework, projectContext, moduleList }
 * @throws {ToolkitError} If module conflicts are detected
 */
function loadToolkitResources(config, toolkitPath, projectDir) {
    // Normalize and load modules
    const moduleList = normalizeModuleList(config.modules)
    console.log(`📚 Modules: ${moduleList.join(', ')}`)
    const modules = loadAllModules(moduleList, toolkitPath)

    // Normalize and load agents
    const agentList = normalizeAgentList(config)
    const agents = loadAllAgents(agentList, toolkitPath)

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
        throw new ToolkitError('Module conflicts detected', 'MODULE_CONFLICT')
    }

    return {
        modules,
        agents,
        framework,
        projectContext,
        moduleList,
    }
}

/**
 * Generate all configuration files
 * @param {object} config - Project configuration
 * @param {object} mergedConfig - Merged configuration
 * @param {object} resources - Toolkit resources
 * @param {string} toolkitPath - Path to toolkit root
 * @param {string} projectDir - Project root directory
 * @param {string} projectRules - Project-specific rules content
 */
function generateAllConfigurations(config, mergedConfig, resources, toolkitPath, projectDir, projectRules) {
    const { modules, agents, framework, projectContext, moduleList } = resources

    // Prepare template data
    const templateData = prepareTemplateData(
        config,
        mergedConfig,
        modules,
        agents,
        projectContext,
        toolkitPath,
        projectDir,
        framework
    )

    // Add project rules to template data
    if (projectRules && projectRules.trim()) {
        templateData.project_rules = projectRules
    }

    // Add module list for templates
    templateData.module_list = moduleList.join(', ')

    // Generate editor configurations from templates
    try {
        const generatedCount = generateEditorConfigs(toolkitPath, projectDir, templateData)
        if (generatedCount === 0) {
            console.warn('⚠️  No editor configs generated - templates may be missing')
        }
    } catch (error) {
        throw new ToolkitError(
            `Failed to generate editor configs: ${error.message}`,
            'GENERATION_ERROR',
            error
        )
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

    return { modules, agents }
}

/**
 * Main sync function
 */
async function sync() {
    try {
        console.log('🔄 CouchCMS AI Toolkit - Sync\n')

        // Load project configuration
        const { config, projectDir, toolkitPath, mergedConfig, projectRules } = loadProjectConfiguration()

        // Load toolkit resources
        const resources = loadToolkitResources(config, toolkitPath, projectDir)

        // Generate all configurations
        const { modules, agents } = generateAllConfigurations(
            config,
            mergedConfig,
            resources,
            toolkitPath,
            projectDir,
            projectRules
        )

        console.log(`\n✨ Sync complete! ${modules.length} modules, ${agents.length} agents loaded.\n`)
    } catch (error) {
        if (error instanceof ToolkitError) {
            handleError(error, 'Sync')
        } else {
            handleError(error, 'Sync')
            const configFileName = getConfigFileName(process.cwd()) || 'standards.md'
            console.log('\nTroubleshooting:')
            console.log(`  1. Verify ${configFileName} has valid YAML frontmatter`)
            console.log(`  2. Check toolkit path in ${configFileName}`)
            console.log('  3. Ensure all referenced modules exist')
            console.log("  4. Run 'bun run validate' for detailed diagnostics\n")
        }
    }
}

// Run
sync().catch(error => {
    handleError(error, 'Unexpected error')
})
