/**
 * Configuration file generation utilities
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { ToolkitError } from './errors.js'
import { prompt, confirm } from './prompts.js'
import { editorsArrayToYaml, validateEditorConfig, getSelectedEditorIds } from './editor-utils.js'

/**
 * Determine config file path
 * Always uses .project/standards.md (standardized location)
 * @param {string} projectDir - Project root directory
 * @param {boolean} simpleMode - Whether in simple mode (unused, kept for compatibility)
 * @returns {Promise<{configPath: string, configDir: string}>} - Config path and directory
 */
export async function determineConfigPath(projectDir, simpleMode) {
    // Always use .project/standards.md as the standard location
    return {
        configPath: join(projectDir, '.project', 'standards.md'),
        configDir: join(projectDir, '.project'),
    }
}

/**
 * Replace template variables in standards.md content
 * @param {string} template - Template content
 * @param {object} variables - Variables to replace
 * @returns {string} - Template with variables replaced
 */
function replaceTemplateVariables(template, variables) {
    let result = template
        .replace(/"my-project"/g, `"${variables.projectName}"`)
        .replace(/Brief description of your project/g, variables.projectDescription)
        .replace(/toolkit: '\.\/ai-toolkit-shared'/g, `toolkit: '${variables.toolkitPath}'`)
        .replace(/toolkit: "\.\/ai-toolkit-shared"/g, `toolkit: "${variables.toolkitPath}"`)

    // Replace modules list - match any modules list in the template
    if (variables.selectedModules && variables.selectedModules.length > 0) {
        result = result.replace(
            /modules:\n(?:    - [^\n]+\n?)+/g,
            `modules:\n${variables.selectedModules.map(m => `    - ${m}`).join('\n')}`
        )
    }

    // Replace editors list - set selected editors to true, others to false
    if (variables.selectedEditors && Array.isArray(variables.selectedEditors)) {
        // Validate editor configuration
        const validation = validateEditorConfig(variables.selectedEditors)
        if (!validation.valid) {
            console.warn(`⚠️  Editor configuration validation warnings:`)
            validation.errors.forEach(error => console.warn(`   - ${error}`))
        }

        // Convert to YAML format using utility function
        const editorsYaml = editorsArrayToYaml(variables.selectedEditors)

        result = result.replace(
            /editors:\n(?:    [^\n]+\n?)+/g,
            `editors:\n${editorsYaml}`
        )
    }

    // Add agents to YAML if selected
    if (variables.selectedAgents && variables.selectedAgents.length > 0) {
        const agentsYaml = variables.selectedAgents.map(a => `    - ${a}`).join('\n')
        result = result.replace(
            /agents:\n    cursor: true\n    copilot: true\n    claude: true\n    vscode: true\n    windsurf: true\n    tabnine: true\n    amazon_codewhisperer: true/g,
            `agents:\n    cursor: true\n    copilot: true\n    claude: true\n    vscode: true\n    windsurf: true\n    tabnine: true\n    amazon_codewhisperer: true\n\n# === ACTIVE AGENTS ===\nactive_agents:\n${agentsYaml}`
        )
    }

    // Add framework configuration if enabled
    if (variables.frameworkConfig && variables.frameworkConfig !== false) {
        let frameworkYaml = ''
        if (variables.frameworkConfig === true) {
            frameworkYaml = 'framework: true'
        } else {
            const parts = []
            if (variables.frameworkConfig.doctrine) parts.push('    doctrine: true')
            if (variables.frameworkConfig.directives) parts.push('    directives: true')
            if (variables.frameworkConfig.playbooks) parts.push('    playbooks: true')
            if (variables.frameworkConfig.enhancements) parts.push('    enhancements: true')
            frameworkYaml = `framework:\n${parts.join('\n')}`
        }

        // Replace framework comment line with actual config
        result = result.replace(/# framework: true/g, frameworkYaml)
    } else {
        // Remove framework line if disabled
        result = result.replace(/# framework: true\n/g, '')
    }

    return result
}

/**
 * Generate standards.md file from template
 * @param {object} options - Generation options
 * @param {string} options.projectDir - Project root directory
 * @param {string} options.configPath - Path to config file
 * @param {string} options.configDir - Config directory
 * @param {string} options.projectName - Project name
 * @param {string} options.projectDescription - Project description
 * @param {string} options.toolkitPath - Toolkit path
 * @param {string} options.toolkitRoot - Toolkit root directory
 * @param {Array<string>} options.selectedModules - Selected modules
 * @param {Array<string>} options.selectedAgents - Selected agents
 * @param {Array<string>} options.selectedEditors - Selected editors/tools
 * @param {object|boolean|null} options.frameworkConfig - Framework configuration
 * @returns {Promise<string>} - Path to created config file
 */
export async function generateStandardsFile(options) {
    const {
        projectDir,
        configPath,
        configDir,
        projectName,
        projectDescription,
        toolkitPath,
        toolkitRoot,
        selectedModules,
        selectedAgents,
        selectedEditors,
        frameworkConfig
    } = options

    // Use config/standards.md as the recommended location (visible in Finder)
    // Override configPath if it's not in the correct location
    const finalConfigPath = join(projectDir, 'config', 'standards.md')
    const finalConfigDir = join(projectDir, 'config')

    // Create config directory if needed
    if (!existsSync(finalConfigDir)) {
        mkdirSync(finalConfigDir, { recursive: true })
        console.log(`✅ Created: config/`)
    }

    console.log(`\n📝 Generating config/standards.md...`)

    // Load standards.md template
    const templatePath = join(toolkitRoot, 'templates', 'standards.md')

    if (!existsSync(templatePath)) {
        throw new ToolkitError(
            `Template file not found: ${templatePath}`,
            'TEMPLATE_NOT_FOUND'
        )
    }

    let standardsMd = readFileSync(templatePath, 'utf8')

    // Replace template variables
    standardsMd = replaceTemplateVariables(standardsMd, {
        projectName,
        projectDescription,
        toolkitPath,
        selectedModules,
        selectedAgents,
        selectedEditors,
        frameworkConfig,
    })

    // Write to the recommended location (config/standards.md)
    writeFileSync(finalConfigPath, standardsMd)
    console.log(`✅ Created: config/standards.md`)

    return finalConfigPath
}

/**
 * Setup context directory if requested
 * @param {string} projectDir - Project root directory
 * @param {string} projectName - Project name
 * @param {string|null} contextPath - Context path or null
 * @returns {Promise<void>}
 */
export async function setupContextDirectory(projectDir, projectName, contextPath) {
    if (!contextPath) {
        return
    }

    const fullContextPath = join(projectDir, contextPath)

    if (!existsSync(fullContextPath)) {
        mkdirSync(fullContextPath, { recursive: true })
        console.log(`✅ Created: ${contextPath}/`)

        // Create README.md in context directory explaining the structure
        const contextReadme = `# Project Context

This directory contains additional project context files that help AI agents understand your project better.

## What is this?

The context directory allows you to organize extensive project documentation into separate files by topic. AI agents automatically read these files to understand your project's architecture, patterns, workflows, and domain knowledge.

## Why use it?

**Most projects don't need this directory.** Keep everything in \`config/standards.md\` for simplicity.

Use \`config/context/\` when:

1. **Large projects** - Your \`config/standards.md\` exceeds 1000 lines and becomes hard to navigate
2. **Team collaboration** - Multiple team members need to maintain different aspects of documentation
3. **Complex projects** - You have extensive architecture, domain knowledge, or integration documentation
4. **Better organization** - You want to separate configuration (\`standards.md\`) from detailed documentation

## Best Practices

### ✅ DO:

- **Start simple** - Begin with everything in \`config/standards.md\`
- **Organize by topic** - Create separate files for different concerns (architecture, patterns, workflows)
- **Keep it focused** - Each file should cover one main topic
- **Use clear names** - Name files descriptively (\`architecture.md\`, \`api-patterns.md\`)
- **Keep standards.md lean** - Move detailed documentation to context files, keep configuration in \`standards.md\`

### ❌ DON'T:

- **Don't create prematurely** - Only create context files when \`standards.md\` becomes unwieldy
- **Don't duplicate** - Don't repeat information between \`standards.md\` and context files
- **Don't over-organize** - Too many small files are harder to navigate than one larger file
- **Don't mix concerns** - Keep configuration separate from documentation

## Structure

Organize context files by topic:

- \`architecture.md\` - System architecture, design decisions, technology choices
- \`patterns.md\` - Common coding patterns, conventions, and reusable solutions
- \`workflows.md\` - Development workflows, deployment processes, team processes
- \`domain.md\` - Domain-specific knowledge, business rules, terminology
- \`integrations.md\` - External integrations, APIs, third-party services
- \`testing.md\` - Testing strategies, test patterns, quality assurance

## How it works

1. AI agents automatically read all files in this directory
2. Files are included in generated editor configurations (CLAUDE.md, .cursorrules, etc.)
3. You can reference specific context files in prompts: "See config/context/architecture.md"
4. Changes are picked up automatically when you run \`sync\`

## Example Structure

\`\`\`
config/
├── standards.md          # Configuration and core rules (keep this lean)
└── context/              # Detailed documentation (only if needed)
    ├── architecture.md   # System architecture
    ├── patterns.md      # Coding patterns
    └── workflows.md     # Development workflows
\`\`\`

## When to migrate

Consider creating context files when:

- \`config/standards.md\` exceeds 1000 lines
- You find yourself scrolling a lot to find specific information
- Team members ask "where is X documented?"
- You want to separate "what to do" (standards.md) from "how it works" (context/)

Remember: **Start with \`standards.md\` only. Add context files only when needed.**
`

        // Create example architecture.md file
        const architectureMd = `# ${projectName} - Architecture

## Overview

Describe your project's architecture here.

## Frontend

- Technologies used
- Key components
- Styling approach

## Backend

- Technologies used
- Key services
- Data flow

## Integrations

- External services
- APIs
- Third-party tools
`

        // Create example patterns.md
        const patternsMd = `# ${projectName} - Common Patterns

## Coding Patterns

Document common coding patterns used in this project:

### Pattern 1

\`\`\`php
// Example code
\`\`\`

### Pattern 2

\`\`\`javascript
// Example code
\`\`\`
`

        // Create example workflows.md
        const workflowsMd = `# ${projectName} - Development Workflows

## Common Workflows

Document common development workflows:

1. **Adding a new content type**
   - Steps...

2. **Deploying changes**
   - Steps...
`

        // Write all files
        writeFileSync(join(fullContextPath, 'README.md'), contextReadme)
        console.log(`✅ Created: ${contextPath}/README.md`)

        writeFileSync(join(fullContextPath, 'architecture.md'), architectureMd)
        console.log(`✅ Created: ${contextPath}/architecture.md`)

        writeFileSync(join(fullContextPath, 'patterns.md'), patternsMd)
        console.log(`✅ Created: ${contextPath}/patterns.md`)

        writeFileSync(join(fullContextPath, 'workflows.md'), workflowsMd)
        console.log(`✅ Created: ${contextPath}/workflows.md`)
    }
}

/**
 * Ask if context directory should be created
 * @param {boolean} simpleMode - Whether in simple mode
 * @returns {Promise<string|null>} - Context path or null
 */
export async function selectContextDirectory(simpleMode) {
    if (simpleMode) {
        // Don't create context directory in simple mode
        return null
    }

    // Context directory (only in custom mode, and only for extensive documentation)
    console.log('\n📋 Context directory (optional):')
    console.log('   Most projects don\'t need this - keep everything in config/standards.md')
    console.log('')
    console.log('   Use config/context/ when:')
    console.log('     ✓ Your standards.md exceeds 1000 lines')
    console.log('     ✓ You have extensive architecture/domain documentation')
    console.log('     ✓ Multiple team members maintain different documentation')
    console.log('     ✓ You want to separate configuration from detailed docs')
    console.log('')
    console.log('   Best practice: Start simple, add context files only when needed')
    const useContext = await confirm('   Create project context directory? (Usually not needed)', false)
    return useContext ? 'config/context' : null
}

/**
 * Clean generated files and directories
 * @param {string} projectDir - Project root directory
 * @param {boolean} confirmed - Whether user confirmed the cleanup
 * @param {object|null} editorsConfig - Editors configuration object (optional)
 */
export function cleanGeneratedFiles(projectDir, confirmed = false, editorsConfig = null) {
    if (!confirmed) {
        console.log('⚠️  Cleanup skipped (not confirmed)')
        return
    }

    console.log('\n🧹 Cleaning generated files...\n')

    const filesToRemove = [
        // Root files
        '.cursorrules',
        'USER-RULES.md',
        'PROJECT-RULES-TEMPLATE.md',

        // Legacy files (no longer generated)
        'CLAUDE.md',
        'AGENT.md',

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

    // Use utility function to get selected editors consistently
    const selectedEditors = getSelectedEditorIds(editorsConfig)

    // Map editors to their directories
    const editorDirs = {
        cursor: ['.cursor/rules', '.cursor/commands', '.cursor'],
        claude: ['.claude/skills', '.claude/hooks', '.claude/rules', '.claude'],
        windsurf: ['.windsurf'],
        kiro: ['.kiro/steering', '.kiro'],
        copilot: ['.github'],
        tabnine: ['.tabnine/guidelines', '.tabnine'],
        codewhisperer: ['.codewhisperer'],
    }

    // Remove directories for unselected editors
    for (const [editorId, dirs] of Object.entries(editorDirs)) {
        if (!selectedEditors.includes(editorId)) {
            // Remove directories for this editor (in reverse order to handle nested dirs)
            for (const dir of dirs.reverse()) {
                const dirPath = join(projectDir, dir)
                if (existsSync(dirPath)) {
                    try {
                        rmSync(dirPath, { recursive: true, force: true })
                        removedCount++
                        console.log(`  🗑️  Removed directory: ${dir} (editor '${editorId}' not selected)`)
                    } catch (error) {
                        console.warn(`  ⚠️  Failed to remove ${dir}: ${error.message}`)
                    }
                }
            }
        }
    }

    // Remove empty directories (for selected editors, clean up empty subdirs)
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
    // Only remove if the editor is not selected (already handled above) or if it's empty
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
