#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Validate Script
 *
 * Validates project configuration and compliance
 *
 * Usage:
 *   bun ai-toolkit/scripts/validate.js
 */

import { readFileSync, existsSync } from 'fs'
import { dirname, resolve, join } from 'path'
import { findConfigFile, loadConfig, getConfigFileName, findProjectFile, resolveToolkitPath } from './utils/utils.js'
import { validateConfiguration } from './lib/config-validator.js'
import { checkAndInstallDependencies } from './lib/dependency-checker.js'
<<<<<<< HEAD
import { getToolkitRootCached } from './lib/index.js'
=======
>>>>>>> eb63280 (updates 2025-12-01)

const TOOLKIT_ROOT = getToolkitRootCached()


/**
 * Main validation function
 */
async function validate() {
    console.log('🔍 CouchCMS AI Toolkit - Validation\n')

    const errors = []
    const warnings = []
    let score = 100

    // Find configuration file
    const configPath = findProjectFile()

    if (!configPath) {
        const configFileName = getConfigFileName(process.cwd()) || 'standards.md'
        console.error(`❌ No configuration file found`)
        console.log(`\nCreate a ${configFileName} file to use the toolkit.`)
        console.log('💡 Tip: Use .project/standards.md for the recommended location.\n')
        process.exit(1)
    }

    console.log(`📄 Found: ${configPath}`)
    const projectDir = dirname(configPath)

    // Parse configuration file
    let config
    try {
        const configData = loadConfig(projectDir)
        if (!configData) {
            throw new Error('Failed to load configuration')
        }
        config = configData.frontmatter
    } catch (error) {
        const configFileName = getConfigFileName(projectDir) || 'standards.md'
        errors.push(`Failed to parse ${configFileName}: ${error.message}`)
        score -= 50
    }

    if (!config) {
        const configFileName = getConfigFileName(projectDir) || 'standards.md'
        console.error(`❌ Invalid ${configFileName} format\n`)
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
    const toolkitPath = resolveToolkitPath(config.toolkit, projectDir, TOOLKIT_ROOT)

    if (!existsSync(toolkitPath)) {
        errors.push(`Toolkit path not found: ${toolkitPath}`)
        score -= 20
    } else {
        console.log(`🛠️  Toolkit: ${toolkitPath}`)

        // Check and install dependencies if needed
        try {
            await checkAndInstallDependencies(toolkitPath)
        } catch (error) {
            warnings.push(`Dependency check failed: ${error.message}`)
            score -= 5
        }

        // Check for required files
        const requiredFiles = ['modules', 'agents', 'scripts/sync.js']
        for (const file of requiredFiles) {
            if (!existsSync(join(toolkitPath, file))) {
                errors.push(`Missing toolkit file: ${file}`)
                score -= 10
            }
        }

        // Run enhanced configuration validation
        console.log('🔍 Running enhanced validation...')
        const validation = validateConfiguration(config, toolkitPath, projectDir)

        if (validation.errors.length > 0) {
            console.log('\n❌ Editor Configuration Errors:\n')
            validation.errors.forEach(err => {
                console.log(`   ${err}`)
                errors.push(err)
                score -= 10
            })
        }

        if (validation.warnings.length > 0) {
            console.log('\n⚠️  Editor Configuration Warnings:\n')
            validation.warnings.forEach(warn => {
                console.log(`   ${warn}`)
                warnings.push(warn)
                score -= 3
            })
        }
    }

    // Validate modules
    // Ensure modules is always an array
    let moduleList = config.modules || ['couchcms-core']
    if (!Array.isArray(moduleList)) {
        // If it's a string, convert to array; otherwise default to ['couchcms-core']
        moduleList = typeof moduleList === 'string' ? [moduleList] : ['couchcms-core']
    }
    console.log(`📚 Modules: ${moduleList.join(', ')}`)

    for (const moduleName of moduleList) {
        const modulePath = join(toolkitPath, 'modules', `${moduleName}.md`)
        if (!existsSync(modulePath)) {
            errors.push(`Module not found: ${moduleName}`)
            score -= 10
        }
    }

    // Validate agents - ensure it's always an array
    let agentList = config.agents || []
    if (!Array.isArray(agentList)) {
        // If it's a string, convert to array; otherwise default to empty array
        agentList = typeof agentList === 'string' ? [agentList] : []
    }

    if (agentList.length > 0) {
        console.log(`🤖 Agents: ${agentList.join(', ')}`)

        for (const agentName of agentList) {
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
