#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Validate Script
 *
 * Validates project configuration and compliance
 *
 * Usage:
 *   bun ai-toolkit/scripts/validate.js
 */

import matter from 'gray-matter'
import { readFileSync, existsSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TOOLKIT_ROOT = resolve(__dirname, '..')

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
function resolveToolkitPath(configPath) {
    if (!configPath) {
        return TOOLKIT_ROOT
    }

    if (configPath.startsWith('~')) {
        configPath = configPath.replace('~', process.env.HOME)
    }

    if (!configPath.startsWith('/')) {
        configPath = resolve(process.cwd(), configPath)
    }

    return configPath
}

/**
 * Main validation function
 */
async function validate() {
    console.log('🔍 CouchCMS AI Toolkit - Validation\n')

    const errors = []
    const warnings = []
    let score = 100

    // Find project.md
    const projectPath = findProjectFile()

    if (!projectPath) {
        console.error('❌ No project.md found')
        console.log('\nCreate a project.md file to use the toolkit.\n')
        process.exit(1)
    }

    console.log(`📄 Found: ${projectPath}`)
    const projectDir = dirname(projectPath)

    // Parse project.md
    let config
    try {
        const projectContent = readFileSync(projectPath, 'utf8')
        const parsed = matter(projectContent)
        config = parsed.data
    } catch (error) {
        errors.push(`Failed to parse project.md: ${error.message}`)
        score -= 50
    }

    if (!config) {
        console.error('❌ Invalid project.md format\n')
        process.exit(1)
    }

    // Validate required fields
    if (!config.name) {
        warnings.push('Missing field: name')
        score -= 5
    }

    if (!config.description) {
        warnings.push('Missing field: description')
        score -= 5
    }

    // Validate toolkit path
    const toolkitPath = resolveToolkitPath(config.toolkit)

    if (!existsSync(toolkitPath)) {
        errors.push(`Toolkit path not found: ${toolkitPath}`)
        score -= 20
    } else {
        console.log(`🛠️  Toolkit: ${toolkitPath}`)

        // Check for required files
        const requiredFiles = ['modules', 'agents', 'scripts/sync.js']
        for (const file of requiredFiles) {
            if (!existsSync(join(toolkitPath, file))) {
                errors.push(`Missing toolkit file: ${file}`)
                score -= 10
            }
        }
    }

    // Validate modules
    const moduleList = config.modules || ['couchcms-core']
    console.log(`📚 Modules: ${moduleList.join(', ')}`)

    for (const moduleName of moduleList) {
        const modulePath = join(toolkitPath, 'modules', `${moduleName}.md`)
        if (!existsSync(modulePath)) {
            errors.push(`Module not found: ${moduleName}`)
            score -= 10
        }
    }

    // Validate agents
    if (config.agents && config.agents.length > 0) {
        console.log(`🤖 Agents: ${config.agents.join(', ')}`)

        for (const agentName of config.agents) {
            const agentPath = join(toolkitPath, 'agents', `${agentName}.md`)
            if (!existsSync(agentPath)) {
                warnings.push(`Agent not found: ${agentName}`)
                score -= 5
            }
        }
    }

    // Check for generated files
    const generatedFiles = ['.cursorrules', 'CLAUDE.md', 'AGENT.md']
    let hasGenerated = false

    for (const file of generatedFiles) {
        if (existsSync(join(projectDir, file))) {
            hasGenerated = true
        } else {
            warnings.push(`Generated file missing: ${file} (run 'bun run sync')`)
        }
    }

    if (!hasGenerated) {
        warnings.push("No generated files found. Run 'bun run sync' first.")
        score -= 10
    }

    // Validate paths if specified
    if (config.paths) {
        console.log(`📁 Custom paths: ${Object.keys(config.paths).length} configured`)

        for (const [key, value] of Object.entries(config.paths)) {
            const fullPath = join(projectDir, value)
            if (!existsSync(fullPath)) {
                warnings.push(`Path not found: ${key} → ${value}`)
                score -= 3
            }
        }
    }

    // Report results
    console.log('\n' + '='.repeat(60))

    if (errors.length > 0) {
        console.log('\n❌ ERRORS:\n')
        errors.forEach(err => console.log(`   ${err}`))
    }

    if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:\n')
        warnings.forEach(warn => console.log(`   ${warn}`))
    }

    const maxScore = 100
    const finalScore = Math.max(0, score)
    const percentage = Math.round((finalScore / maxScore) * 100)

    console.log('\n' + '='.repeat(60))
    console.log(`\n📊 Compliance Score: ${finalScore}/${maxScore} (${percentage}%)\n`)

    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅ Validation passed - All checks OK!\n')
        process.exit(0)
    } else if (errors.length === 0) {
        console.log('⚠️  Validation passed with warnings\n')
        process.exit(0)
    } else {
        console.log('❌ Validation failed - Please fix errors above\n')
        process.exit(1)
    }
}

// Run
validate().catch(error => {
    console.error('❌ Validation error:', error.message)
    process.exit(1)
})
