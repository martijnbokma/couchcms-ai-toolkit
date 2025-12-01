/**
 * Template Engine Module
 *
 * Handles template data preparation and rendering for multiple editors.
 * Supports parallel template rendering for improved performance.
 */

import Handlebars from 'handlebars'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { validateTemplate } from './template-validator.js'

/**
 * Register Handlebars helpers
 */
function registerHandlebarsHelpers() {
    Handlebars.registerHelper('join', function (array, separator) {
        if (!Array.isArray(array)) return ''
        return array.join(separator || ', ')
    })

    Handlebars.registerHelper('add', function (a, b) {
        return Number(a) + Number(b)
    })
}

// Register helpers on module load
registerHandlebarsHelpers()

/**
 * Editor configuration schema
 * Supports both single files and directory structures
 *
 * Schema:
 * - template: string - Template file name
 * - output: string - Output file path
 * - type: 'file' | 'directory' - Output type (default: 'file')
 * - format: 'markdown' | 'json' - Output format (default: 'markdown')
 */
const EDITOR_CONFIGS = {
    cursor: {
        template: 'cursor.template.md',
        output: '.cursorrules',
        type: 'file',
        format: 'markdown'
    },
    'cursor-rules': {
        // MDC rules are copied from toolkit/rules/*.mdc to .cursor/rules/*.mdc
        type: 'directory',
        output: '.cursor/rules',
        source: 'rules',
        pattern: '*.mdc',
        copyMode: true
    },
    claude: {
        template: 'claude-memory.template.md',
        output: 'CLAUDE.md',
        type: 'file',
        format: 'markdown'
    },
    'claude-settings': {
        template: 'claude-settings.template.json',
        output: '.claude/settings.json',
        type: 'file',
        format: 'json'
    },
    'claude-skills': {
        // Skills are generated dynamically
        type: 'directory',
        output: '.claude/skills'
    },
    windsurf: {
        template: 'windsurf.template.md',
        output: '.windsurf/rules.md',
        type: 'file',
        format: 'markdown'
    },
    kiro: {
        template: 'kiro.template.md',
        output: '.kiro/steering/coding-standards.md',
        type: 'file',
        format: 'markdown'
    },
    copilot: {
        template: 'copilot.template.md',
        output: '.github/copilot-instructions.md',
        type: 'file',
        format: 'markdown'
    },
    // Additional templates
    agents: {
        template: 'agents.template.md',
        output: 'AGENTS.md',
        type: 'file',
        format: 'markdown'
    },
    'user-rules': {
        template: 'user-rules.template.md',
        output: 'USER-RULES.md',
        type: 'file',
        format: 'markdown'
    },
    'project-rules': {
        template: 'project-rules.template.md',
        output: 'PROJECT-RULES-TEMPLATE.md',
        type: 'file',
        format: 'markdown'
    }
}

// Keep backward compatibility
const EDITOR_TEMPLATES = EDITOR_CONFIGS

/**
 * Prepare template data from config and loaded modules
 *
 * @param {object} config - Configuration object
 * @param {object} mergedConfig - Merged default and project configuration
 * @param {Array<object>} modules - Loaded modules with {name, meta, content}
 * @param {Array<object>} agents - Loaded agents
 * @param {object|null} framework - Framework content or null
 * @param {object|null} projectContext - Project context or null
 * @param {string} toolkitPath - Path to toolkit root
 * @param {string} projectDir - Project root directory
 * @returns {object} - Template data for Handlebars
 */
export function prepareTemplateData(config, mergedConfig, modules, agents, framework, projectContext, toolkitPath, projectDir) {
    const { paths, standards, naming } = mergedConfig

    // Extract languages and frameworks from config or infer from modules
    let languages = config.languages || []
    let frameworks = config.frameworks || []
    const techHierarchy = []

    // Build tech hierarchy from modules
    modules.forEach((mod, index) => {
        const modName = mod.meta?.name || mod.name
        techHierarchy.push({
            name: modName,
            description: mod.meta?.description || 'No description',
            order: index + 1,
        })
    })

    // Infer languages from modules if not explicitly set
    if (languages.length === 0) {
        if (modules.some(m => m.name.includes('typescript'))) languages.push('TypeScript')
        if (modules.some(m => m.name.includes('javascript'))) languages.push('JavaScript')
        if (modules.some(m => m.name.includes('couchcms'))) languages.push('PHP')
        if (modules.some(m => m.name.includes('tailwind') || m.name.includes('css'))) languages.push('CSS')
        languages.push('HTML')
    }

    // Infer frameworks from modules if not explicitly set
    if (frameworks.length === 0) {
        modules.forEach(mod => {
            const modName = mod.name.toLowerCase()
            const displayName = mod.meta?.name || mod.name

            if (modName.includes('couchcms') && !frameworks.some(f => f.toLowerCase().includes('couchcms'))) {
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

    // Prepare modules data with full details
    const modulesData = modules.map(mod => ({
        name: mod.meta?.name || mod.name,
        description: mod.meta?.description || 'No description',
        version: mod.meta?.version || '1.0',
        slug: mod.name,
        content: mod.content,
        meta: mod.meta,
        // Additional fields for Claude Skills
        allowedTools: mod.meta?.allowedTools || mod.meta?.['allowed-tools'] || ['Read', 'Write', 'Bash', 'Grep'],
        tags: mod.meta?.tags || [],
        category: mod.meta?.category || 'module'
    }))

    // Prepare agents data with full details
    const agentsData = agents.map(a => ({
        name: a.meta?.name || a.name,
        description: a.meta?.description || 'No description',
        type: a.meta?.type || 'daily',
        slug: a.name,
        content: a.content,
        meta: a.meta,
        // Additional fields for Claude Skills
        allowedTools: a.meta?.allowedTools || a.meta?.['allowed-tools'] || ['Read', 'Write', 'Bash', 'Grep'],
        tags: a.meta?.tags || [],
        category: a.meta?.category || 'agent'
    }))

    // Prepare roles data (if available in config)
    const roles = config.roles || []

    // Get config file name
    const configFilePath = 'standards.md' // Default config file name

    // Add timestamp
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
            indentation: standards?.indentation || 4,
            line_length: standards?.lineLength || 120,
            language: standards?.language || 'english',
            naming: naming || {},
        },
        paths: paths || {},
        languages: languages,
        frameworks: frameworks,
        tech_hierarchy: techHierarchy,
        modules: modulesData,
        agents: agentsData,
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
 * Render a single template with data
 *
 * @param {string} templatePath - Path to template file
 * @param {object} templateData - Data to render template with
 * @param {string} outputFormat - Output format: 'markdown' or 'json' (default: 'markdown')
 * @returns {string} - Rendered template content
 * @throws {Error} If template cannot be loaded or rendered
 */
function renderTemplate(templatePath, templateData, outputFormat = 'markdown') {
    try {
        const templateContent = readFileSync(templatePath, 'utf8')

        // Validate template variables before rendering
        try {
            validateTemplate(templateContent, templateData, templatePath)
        } catch (error) {
            throw new Error(`Template validation failed: ${error.message}`)
        }

        const template = Handlebars.compile(templateContent)
        const rendered = template(templateData)

        // For JSON format, parse and re-stringify to ensure valid JSON
        if (outputFormat === 'json') {
            try {
                const parsed = JSON.parse(rendered)
                // Validate JSON structure for Claude settings
                if (templatePath.includes('claude-settings')) {
                    validateClaudeSettings(parsed)
                }
                return JSON.stringify(parsed, null, 2)
            } catch (jsonError) {
                throw new Error(`Template rendered invalid JSON: ${jsonError.message}`)
            }
        }

        return rendered
    } catch (error) {
        throw new Error(`Failed to render template ${templatePath}: ${error.message}`)
    }
}

/**
 * Validate Claude settings JSON structure
 *
 * @param {object} settings - Parsed Claude settings object
 * @throws {Error} If settings structure is invalid
 */
function validateClaudeSettings(settings) {
    // Check required top-level fields
    if (!settings.permissions) {
        throw new Error('Missing required field: permissions')
    }

    if (!settings.permissions.allow || !Array.isArray(settings.permissions.allow)) {
        throw new Error('permissions.allow must be an array')
    }

    if (!settings.permissions.deny || !Array.isArray(settings.permissions.deny)) {
        throw new Error('permissions.deny must be an array')
    }

    // Validate permission patterns
    const validPatternRegex = /^(Read|Write|Bash)\(.+\)$/

    for (const permission of settings.permissions.allow) {
        if (!validPatternRegex.test(permission)) {
            throw new Error(`Invalid permission pattern in allow: ${permission}`)
        }
    }

    for (const permission of settings.permissions.deny) {
        if (!validPatternRegex.test(permission)) {
            throw new Error(`Invalid permission pattern in deny: ${permission}`)
        }
    }

    // Validate env if present
    if (settings.env && typeof settings.env !== 'object') {
        throw new Error('env must be an object')
    }

    // Validate slashCommands if present
    if (settings.slashCommands) {
        if (typeof settings.slashCommands !== 'object') {
            throw new Error('slashCommands must be an object')
        }

        for (const [name, cmd] of Object.entries(settings.slashCommands)) {
            if (!cmd.description || !cmd.command) {
                throw new Error(`slashCommand "${name}" must have description and command`)
            }
        }
    }
}

/**
 * Render a single editor template
 *
 * @param {string} editor - Editor name
 * @param {object} templateData - Data for template rendering
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {object} - Object with { output, content, type, format } or null if template not found
 */
function renderEditorTemplate(editor, templateData, toolkitPath) {
    const editorConfig = EDITOR_CONFIGS[editor]

    if (!editorConfig) {
        console.warn(`⚠️  Unknown editor: ${editor}`)
        return null
    }

    // Skip directory-type configs (they're handled separately)
    if (editorConfig.type === 'directory') {
        return null
    }

    // Skip if no template is defined
    if (!editorConfig.template) {
        return null
    }

    const templatePath = join(toolkitPath, 'templates', 'editors', editorConfig.template)
    const outputFormat = editorConfig.format || 'markdown'

    try {
        const content = renderTemplate(templatePath, templateData, outputFormat)
        return {
            output: editorConfig.output,
            content: content,
            type: editorConfig.type || 'file',
            format: outputFormat
        }
    } catch (error) {
        console.warn(`⚠️  Failed to render ${editor} template: ${error.message}`)
        return null
    }
}

/**
 * Generate Claude Code Skills from modules and agents
 *
 * @param {object} templateData - Template data containing modules and agents
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {Map<string, string>} - Map of skill file path → skill content
 */
export function generateClaudeSkills(templateData, toolkitPath) {
    const skills = new Map()

    // Check if we have the skill templates
    const moduleSkillTemplatePath = join(toolkitPath, 'templates', 'editors', 'claude-skill-module.template.md')
    const agentSkillTemplatePath = join(toolkitPath, 'templates', 'editors', 'claude-skill-agent.template.md')

    // Generate skills for modules
    if (templateData.modules && Array.isArray(templateData.modules)) {
        for (const module of templateData.modules) {
            try {
                let skillContent

                // Try to use template if it exists, otherwise generate directly
                if (existsSync(moduleSkillTemplatePath)) {
                    skillContent = renderTemplate(moduleSkillTemplatePath, { module }, 'markdown')
                } else {
                    // Generate skill content directly
                    skillContent = generateSkillContent(module, 'module')
                }

                const skillPath = `.claude/skills/${module.slug}.md`
                skills.set(skillPath, skillContent)
            } catch (error) {
                console.warn(`⚠️  Failed to generate skill for module ${module.name}: ${error.message}`)
            }
        }
    }

    // Generate skills for agents
    if (templateData.agents && Array.isArray(templateData.agents)) {
        for (const agent of templateData.agents) {
            try {
                let skillContent

                // Try to use template if it exists, otherwise generate directly
                if (existsSync(agentSkillTemplatePath)) {
                    skillContent = renderTemplate(agentSkillTemplatePath, { agent }, 'markdown')
                } else {
                    // Generate skill content directly
                    skillContent = generateSkillContent(agent, 'agent')
                }

                const skillPath = `.claude/skills/${agent.slug}.md`
                skills.set(skillPath, skillContent)
            } catch (error) {
                console.warn(`⚠️  Failed to generate skill for agent ${agent.name}: ${error.message}`)
            }
        }
    }

    return skills
}

/**
 * Generate skill content for a module or agent
 *
 * @param {object} item - Module or agent object
 * @param {string} type - 'module' or 'agent'
 * @returns {string} - Skill file content with YAML frontmatter
 */
function generateSkillContent(item, type) {
    const allowedTools = Array.isArray(item.allowedTools)
        ? item.allowedTools.join(', ')
        : 'Read, Write, Bash, Grep'

    const frontmatter = `---
name: ${item.name}
description: ${item.description}
allowed-tools: ${allowedTools}
type: ${type}
---

`

    return frontmatter + (item.content || '')
}

/**
 * Render templates for specified editors (with parallel rendering support)
 *
 * @param {object} templateData - Data for template rendering
 * @param {Array<string>} editors - Editor names to generate for
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {Map<string, string>} - Map of output path → rendered content
 */
export async function renderTemplates(templateData, editors, toolkitPath) {
    // Render all templates in parallel
    const renderPromises = editors.map(editor =>
        Promise.resolve(renderEditorTemplate(editor, templateData, toolkitPath))
    )

    const results = await Promise.all(renderPromises)

    // Build map of output path → content
    const configMap = new Map()

    for (const result of results) {
        if (result) {
            configMap.set(result.output, result.content)
        }
    }

    return configMap
}

/**
 * Get list of supported editors
 *
 * @returns {Array<string>} - Array of supported editor names
 */
export function getSupportedEditors() {
    return Object.keys(EDITOR_CONFIGS)
}

/**
 * Check if an editor is supported
 *
 * @param {string} editor - Editor name to check
 * @returns {boolean} - True if editor is supported
 */
export function isEditorSupported(editor) {
    return editor in EDITOR_CONFIGS
}

/**
 * Get editor configuration
 *
 * @param {string} editor - Editor name
 * @returns {object|null} - Editor configuration or null if not found
 */
export function getEditorConfig(editor) {
    return EDITOR_CONFIGS[editor] || null
}
