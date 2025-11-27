/**
 * Template Engine Module
 * 
 * Handles template data preparation and rendering for multiple editors.
 * Supports parallel template rendering for improved performance.
 */

import Handlebars from 'handlebars'
import { readFileSync } from 'fs'
import { join } from 'path'

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
 * Editor template mapping configuration
 * Maps editor names to their template files and output paths
 */
const EDITOR_TEMPLATES = {
    cursor: {
        template: 'cursor.template.md',
        output: '.cursorrules'
    },
    claude: {
        template: 'claude.template.md',
        output: 'CLAUDE.md'
    },
    windsurf: {
        template: 'windsurf.template.md',
        output: '.windsurf/rules.md'
    },
    kiro: {
        template: 'kiro.template.md',
        output: '.kiro/steering/coding-standards.md'
    },
    copilot: {
        template: 'copilot.template.md',
        output: '.github/copilot-instructions.md'
    },
    // Additional templates
    agent: {
        template: 'agent.template.md',
        output: 'AGENT.md'
    },
    'user-rules': {
        template: 'user-rules.template.md',
        output: 'USER-RULES.md'
    },
    'project-rules': {
        template: 'project-rules.template.md',
        output: 'PROJECT-RULES-TEMPLATE.md'
    }
}

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

    // Prepare modules data
    const modulesData = modules.map(mod => ({
        name: mod.meta?.name || mod.name,
        description: mod.meta?.description || 'No description',
        version: mod.meta?.version || '1.0',
        slug: mod.name,
    }))

    // Prepare agents data
    const agentsData = agents.map(a => ({
        name: a.meta?.name || a.name,
        description: a.meta?.description || 'No description',
        type: a.meta?.type || 'daily',
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
 * @returns {string} - Rendered template content
 * @throws {Error} If template cannot be loaded or rendered
 */
function renderTemplate(templatePath, templateData) {
    try {
        const templateContent = readFileSync(templatePath, 'utf8')
        const template = Handlebars.compile(templateContent)
        return template(templateData)
    } catch (error) {
        throw new Error(`Failed to render template ${templatePath}: ${error.message}`)
    }
}

/**
 * Render a single editor template
 * 
 * @param {string} editor - Editor name
 * @param {object} templateData - Data for template rendering
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {object} - Object with { output, content } or null if template not found
 */
function renderEditorTemplate(editor, templateData, toolkitPath) {
    const editorConfig = EDITOR_TEMPLATES[editor]
    
    if (!editorConfig) {
        console.warn(`⚠️  Unknown editor: ${editor}`)
        return null
    }

    const templatePath = join(toolkitPath, 'templates', 'editors', editorConfig.template)
    
    try {
        const content = renderTemplate(templatePath, templateData)
        return {
            output: editorConfig.output,
            content: content
        }
    } catch (error) {
        console.warn(`⚠️  Failed to render ${editor} template: ${error.message}`)
        return null
    }
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
    return Object.keys(EDITOR_TEMPLATES)
}

/**
 * Check if an editor is supported
 * 
 * @param {string} editor - Editor name to check
 * @returns {boolean} - True if editor is supported
 */
export function isEditorSupported(editor) {
    return editor in EDITOR_TEMPLATES
}
