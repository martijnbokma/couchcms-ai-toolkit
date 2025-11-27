/**
 * Configuration file generation utilities
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { ToolkitError } from './errors.js'
import { prompt, confirm } from './prompts.js'

/**
 * Determine config file path based on mode and user choice
 * @param {string} projectDir - Project root directory
 * @param {boolean} simpleMode - Whether in simple mode
 * @returns {Promise<{configPath: string, configDir: string}>} - Config path and directory
 */
export async function determineConfigPath(projectDir, simpleMode) {
    if (simpleMode) {
        // Simple mode: use recommended defaults
        return {
            configPath: join(projectDir, '.project', 'standards.md'),
            configDir: join(projectDir, '.project'),
        }
    }

    // Custom mode: ask for configuration file location
    console.log('\n📁 Where should standards.md be created?')
    console.log('  1. .project/standards.md (recommended - project config directory)')
    console.log('  2. docs/standards.md (documentation location)')
    console.log('  3. standards.md (root directory)')
    const locationChoice = await prompt('Choice [1-3]', '1')

    if (locationChoice === '1') {
        return {
            configPath: join(projectDir, '.project', 'standards.md'),
            configDir: join(projectDir, '.project'),
        }
    } else if (locationChoice === '2') {
        return {
            configPath: join(projectDir, 'docs', 'standards.md'),
            configDir: join(projectDir, 'docs'),
        }
    }

    return {
        configPath: join(projectDir, 'standards.md'),
        configDir: projectDir,
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
        frameworkConfig
    } = options

    // Create config directory if needed
    if (configDir !== projectDir && !existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true })
        console.log(`✅ Created: ${configDir}/`)
    }

    const configFileName = configPath.includes('.project/')
        ? '.project/standards.md'
        : configPath.includes('docs/')
          ? 'docs/standards.md'
          : 'standards.md'

    console.log(`\n📝 Generating ${configFileName}...`)

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
        frameworkConfig,
    })

    // Ensure the directory exists before writing the file
    if (configDir !== projectDir) {
        if (!existsSync(configDir)) {
            mkdirSync(configDir, { recursive: true })
            console.log(`📁 Created directory: ${configDir.replace(projectDir + '/', '')}/`)
        }
    }

    writeFileSync(configPath, standardsMd)
    console.log(`✅ Created: ${configFileName}`)

    return configPath
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

        // Create context.md template
        const contextMd = `---
name: ${projectName} Context
---

# ${projectName} - Project Context

## Content Types

Describe your project's content types here:

- **Type 1**: Description
- **Type 2**: Description

## Architecture

Describe your project's architecture:

- Frontend: Technologies used
- Backend: Technologies used
- Integrations: External services

## Common Patterns

Document common patterns used in this project:

### Pattern 1

\`\`\`php
// Example code
\`\`\`

### Pattern 2

\`\`\`javascript
// Example code
\`\`\`

## Workflows

Document common development workflows:

1. **Adding a new content type**
   - Steps...

2. **Deploying changes**
   - Steps...
`

        writeFileSync(join(fullContextPath, 'context.md'), contextMd)
        console.log(`✅ Created: ${contextPath}/context.md`)
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
    console.log('   .project/ai/context.md is ONLY for extensive project documentation (>1000 lines)')
    console.log('   For most projects, add all rules directly to standards.md body')
    console.log('   Use context.md only if:')
    console.log('     - You have >1000 lines of documentation')
    console.log('     - You want to separate config from extensive docs')
    console.log('     - You\'re working in a team with extensive shared context')
    const useContext = await confirm('   Create project context directory? (Usually not needed)', false)
    return useContext ? '.project/ai' : null
}

/**
 * Clean generated files and directories
 * @param {string} projectDir - Project root directory
 * @param {boolean} confirmed - Whether user confirmed the cleanup
 */
export function cleanGeneratedFiles(projectDir, confirmed = false) {
    if (!confirmed) {
        console.log('⚠️  Cleanup skipped (not confirmed)')
        return
    }

    console.log('\n🧹 Cleaning generated files...\n')

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
