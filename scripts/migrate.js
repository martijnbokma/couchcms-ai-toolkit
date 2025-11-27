#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Configuration Migration Script
 *
 * Migrates from old configuration format to new consolidated config.yaml:
 * - Detects old configuration files (defaults.yaml, smart-defaults.yaml, preflight-checks.yaml, standards.md)
 * - Parses and merges old configs
 * - Generates new config.yaml
 * - Backs up old configuration files
 * - Validates new configuration
 *
 * Usage:
 *   bun scripts/migrate.js [options]
 *
 * Options:
 *   --dry-run    Show what would be migrated without making changes
 *   --no-backup  Skip backup of old files (not recommended)
 *   --force      Overwrite existing config.yaml without prompting
 */

import { existsSync, readFileSync, writeFileSync, renameSync, mkdirSync, rmSync, readdirSync } from 'fs'
import { join } from 'path'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import matter from 'gray-matter'
import { validateConfig } from './lib/config-loader.js'

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const noBackup = args.includes('--no-backup')
const force = args.includes('--force')
const showHelp = args.includes('--help') || args.includes('-h')

// Show help if requested
if (showHelp) {
    console.log(`
CouchCMS AI Toolkit - Configuration Migration Script

Migrates from old configuration format to new consolidated config.yaml

Usage:
  bun scripts/migrate.js [options]

Options:
  --dry-run    Show what would be migrated without making changes
  --no-backup  Skip backup of old files (not recommended)
  --force      Overwrite existing config.yaml without prompting
  --help, -h   Show this help message

Examples:
  bun scripts/migrate.js --dry-run    # Preview migration
  bun scripts/migrate.js              # Perform migration
  bun scripts/migrate.js --force      # Overwrite existing config.yaml
`)
    process.exit(0)
}

// Project directory (current working directory)
const projectDir = process.cwd()

/**
 * Main migration function
 */
async function migrate() {
    console.log('🔄 CouchCMS AI Toolkit - Configuration Migration\n')

    if (isDryRun) {
        console.log('🔍 DRY RUN MODE - No files will be modified\n')
    }

    try {
        // 1. Detect old configuration files
        console.log('📋 Step 1: Detecting old configuration files...')
        const oldFiles = detectOldConfigFiles()

        if (oldFiles.length === 0) {
            console.log('✅ No old configuration files found. Nothing to migrate.')
            return
        }

        console.log(`   Found ${oldFiles.length} old configuration file(s):`)
        oldFiles.forEach((file) => console.log(`   - ${file.name} (${file.path})`))
        console.log()

        // 2. Check if config.yaml already exists
        const configYamlPath = join(projectDir, 'config.yaml')
        if (existsSync(configYamlPath) && !force) {
            console.error('❌ config.yaml already exists!')
            console.error('   Use --force to overwrite, or manually remove config.yaml first.')
            process.exit(1)
        }

        // 3. Parse and merge old configs
        console.log('📖 Step 2: Parsing and merging old configurations...')
        const mergedConfig = parseAndMergeOldConfigs(oldFiles)
        console.log('   ✓ Configurations merged successfully')
        console.log()

        // 4. Validate new configuration
        console.log('✅ Step 3: Validating new configuration...')
        const errors = validateConfig(mergedConfig)

        if (errors.length > 0) {
            console.error('❌ Validation errors found:')
            errors.forEach((error) => console.error(`   - ${error}`))
            console.error('\n   Migration cannot proceed with invalid configuration.')
            console.error('   Please fix these errors in the old configuration files and try again.')
            process.exit(1)
        }

        console.log('   ✓ Configuration is valid')
        console.log()

        // 5. Generate new config.yaml
        console.log('📝 Step 4: Generating new config.yaml...')

        if (!isDryRun) {
            const yamlContent = generateConfigYaml(mergedConfig)
            writeFileSync(configYamlPath, yamlContent, 'utf8')
            console.log(`   ✓ Created: ${configYamlPath}`)
        } else {
            console.log(`   [DRY RUN] Would create: ${configYamlPath}`)
        }
        console.log()

        // 6. Backup old configuration files
        if (!noBackup) {
            console.log('💾 Step 5: Backing up old configuration files...')
            const backupDir = join(projectDir, '.config-backup')

            if (!isDryRun) {
                if (!existsSync(backupDir)) {
                    mkdirSync(backupDir, { recursive: true })
                }

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]

                for (const file of oldFiles) {
                    const backupPath = join(backupDir, `${file.name}.${timestamp}.backup`)
                    renameSync(file.path, backupPath)
                    console.log(`   ✓ Backed up: ${file.name} → ${backupPath}`)
                }
            } else {
                console.log(`   [DRY RUN] Would backup ${oldFiles.length} file(s) to .config-backup/`)
            }
            console.log()
        } else {
            console.log('⚠️  Step 5: Skipping backup (--no-backup flag used)')
            console.log()
        }

        // 7. Success message
        console.log('✨ Migration complete!\n')

        if (!isDryRun) {
            console.log('Next steps:')
            console.log('  1. Review the new config.yaml file')
            console.log('  2. Run: bun scripts/sync.js')
            console.log('  3. Verify generated editor configs')
            console.log()
            console.log('If you encounter issues:')
            console.log('  - Old files are backed up in .config-backup/')
            console.log('  - You can restore them and try again')
            console.log()
        } else {
            console.log('This was a dry run. To perform the actual migration:')
            console.log('  bun scripts/migrate.js')
            console.log()
        }
    } catch (error) {
        console.error(`\n❌ Migration failed: ${error.message}`)
        console.error('\nStack trace:')
        console.error(error.stack)

        // Attempt rollback if files were backed up
        const backupDir = join(projectDir, '.config-backup')
        if (!isDryRun && existsSync(backupDir)) {
            console.error('\n🔄 Attempting to restore backup files...')

            try {
                // Remove failed config.yaml if it exists
                const configYamlPath = join(projectDir, 'config.yaml')
                if (existsSync(configYamlPath)) {
                    rmSync(configYamlPath)
                    console.error('   ✓ Removed failed config.yaml')
                }

                // Restore backup files
                const backupFiles = readdirSync(backupDir)
                for (const backupFile of backupFiles) {
                    const backupPath = join(backupDir, backupFile)
                    const originalName = backupFile.replace(/\.\d{4}-\d{2}-\d{2}\.backup$/, '')
                    const originalPath = join(projectDir, originalName)

                    renameSync(backupPath, originalPath)
                    console.error(`   ✓ Restored: ${originalName}`)
                }

                // Remove backup directory
                rmSync(backupDir, { recursive: true })
                console.error('   ✓ Backup restored successfully')
                console.error('\n   Your old configuration files have been restored.')
            } catch (rollbackError) {
                console.error(`\n⚠️  Rollback failed: ${rollbackError.message}`)
                console.error('   Please manually restore files from .config-backup/')
            }
        }

        process.exit(1)
    }
}

/**
 * Detect old configuration files in project directory
 *
 * @returns {Array<{name: string, path: string, type: string}>} - Array of old config files
 */
function detectOldConfigFiles() {
    const oldFiles = []

    // Check for defaults.yaml
    const defaultsPath = join(projectDir, 'defaults.yaml')
    if (existsSync(defaultsPath)) {
        oldFiles.push({
            name: 'defaults.yaml',
            path: defaultsPath,
            type: 'defaults',
        })
    }

    // Check for smart-defaults.yaml
    const smartDefaultsPath = join(projectDir, 'smart-defaults.yaml')
    if (existsSync(smartDefaultsPath)) {
        oldFiles.push({
            name: 'smart-defaults.yaml',
            path: smartDefaultsPath,
            type: 'smart-defaults',
        })
    }

    // Check for preflight-checks.yaml
    const preflightPath = join(projectDir, 'preflight-checks.yaml')
    if (existsSync(preflightPath)) {
        oldFiles.push({
            name: 'preflight-checks.yaml',
            path: preflightPath,
            type: 'preflight-checks',
        })
    }

    // Check for standards.md (in various locations)
    const standardsPaths = [
        { path: join(projectDir, 'standards.md'), name: 'standards.md' },
        { path: join(projectDir, '.project', 'standards.md'), name: '.project/standards.md' },
        { path: join(projectDir, 'docs', 'standards.md'), name: 'docs/standards.md' },
    ]

    for (const { path, name } of standardsPaths) {
        if (existsSync(path)) {
            oldFiles.push({
                name,
                path,
                type: 'standards',
            })
            break // Only include first found standards.md
        }
    }

    return oldFiles
}

/**
 * Parse and merge old configuration files
 *
 * @param {Array<{name: string, path: string, type: string}>} oldFiles - Old config files
 * @returns {object} - Merged configuration object
 */
function parseAndMergeOldConfigs(oldFiles) {
    const config = {
        project: {
            name: 'my-project',
            description: 'My CouchCMS project',
            type: 'CouchCMS Web Application',
        },
        toolkit: {
            path: './ai-toolkit-shared',
        },
        editors: ['cursor', 'windsurf', 'kiro', 'copilot'],
        modules: [],
        agents: [],
        framework: false,
        paths: {},
        standards: {
            indentation: 4,
            language: 'english',
            lineLength: 120,
        },
        naming: {},
        gitflow: {},
        file_contexts: {},
        template_aliases: {},
        validation: {
            required_modules: ['couchcms-core'],
            max_line_length: 200,
            enforce_english: true,
            checks: {},
            execution: {
                block_on: ['CRITICAL', 'ERROR'],
                warn_on: ['WARNING'],
                inform_on: ['INFO'],
                global_ignore: ['node_modules/**', 'vendor/**', 'dist/**', '.git/**', '*.min.js', '*.min.css'],
            },
        },
    }

    for (const file of oldFiles) {
        try {
            const content = readFileSync(file.path, 'utf8')

            switch (file.type) {
                case 'defaults':
                    mergeDefaults(config, content)
                    break
                case 'smart-defaults':
                    mergeSmartDefaults(config, content)
                    break
                case 'preflight-checks':
                    mergePreflightChecks(config, content)
                    break
                case 'standards':
                    mergeStandards(config, content)
                    break
            }
        } catch (error) {
            console.warn(`⚠️  Warning: Failed to parse ${file.name}: ${error.message}`)
        }
    }

    return config
}

/**
 * Merge defaults.yaml into config
 *
 * @param {object} config - Target config object
 * @param {string} content - YAML content
 */
function mergeDefaults(config, content) {
    const defaults = parseYaml(content)

    if (defaults.paths) {
        config.paths = { ...config.paths, ...defaults.paths }
    }

    if (defaults.standards) {
        config.standards = { ...config.standards, ...defaults.standards }
    }

    if (defaults.naming) {
        config.naming = { ...config.naming, ...defaults.naming }
    }

    if (defaults.gitflow) {
        config.gitflow = { ...config.gitflow, ...defaults.gitflow }
    }
}

/**
 * Merge smart-defaults.yaml into config
 *
 * @param {object} config - Target config object
 * @param {string} content - YAML content
 */
function mergeSmartDefaults(config, content) {
    const smartDefaults = parseYaml(content)

    if (smartDefaults.file_contexts) {
        // Only keep essential fields (agents, modules)
        for (const [pattern, context] of Object.entries(smartDefaults.file_contexts)) {
            config.file_contexts[pattern] = {
                agents: context.agents || [],
                modules: context.modules || [],
            }
        }
    }

    if (smartDefaults.template_aliases) {
        config.template_aliases = { ...config.template_aliases, ...smartDefaults.template_aliases }
    }
}

/**
 * Merge preflight-checks.yaml into config
 *
 * @param {object} config - Target config object
 * @param {string} content - YAML content
 */
function mergePreflightChecks(config, content) {
    const preflightChecks = parseYaml(content)

    // Merge check categories
    const categories = ['couchcms', 'typescript', 'security', 'css', 'alpinejs', 'general', 'runtime_compatibility']

    for (const category of categories) {
        if (preflightChecks[category]) {
            config.validation.checks[category] = {}

            for (const [checkName, checkConfig] of Object.entries(preflightChecks[category])) {
                // Only keep essential fields
                config.validation.checks[category][checkName] = {
                    pattern: checkConfig.pattern,
                    severity: checkConfig.severity,
                    message: checkConfig.message,
                    fix: checkConfig.fix,
                }
            }
        }
    }

    // Merge execution config
    if (preflightChecks.execution) {
        config.validation.execution = {
            ...config.validation.execution,
            ...preflightChecks.execution,
        }
    }
}

/**
 * Merge standards.md into config
 *
 * @param {object} config - Target config object
 * @param {string} content - Markdown content with YAML frontmatter
 */
function mergeStandards(config, content) {
    const { data: frontmatter } = matter(content)

    // Project settings
    if (frontmatter.name) {
        config.project.name = frontmatter.name
    }
    if (frontmatter.description) {
        config.project.description = frontmatter.description
    }
    if (frontmatter.type) {
        config.project.type = frontmatter.type
    }

    // Toolkit path
    if (frontmatter.toolkit) {
        config.toolkit.path = frontmatter.toolkit
    }

    // Modules and agents
    if (frontmatter.modules && Array.isArray(frontmatter.modules)) {
        config.modules = frontmatter.modules
    }
    if (frontmatter.agents && Array.isArray(frontmatter.agents)) {
        config.agents = frontmatter.agents
    }

    // Framework
    if (frontmatter.framework !== undefined) {
        config.framework = frontmatter.framework
    }

    // Paths (if defined in frontmatter)
    if (frontmatter.paths) {
        config.paths = { ...config.paths, ...frontmatter.paths }
    }

    // Standards (if defined in frontmatter)
    if (frontmatter.standards) {
        config.standards = { ...config.standards, ...frontmatter.standards }
    }

    // Naming conventions (if defined in frontmatter)
    if (frontmatter.naming) {
        config.naming = { ...config.naming, ...frontmatter.naming }
    }

    // Gitflow (if defined in frontmatter)
    if (frontmatter.gitflow) {
        config.gitflow = { ...config.gitflow, ...frontmatter.gitflow }
    }

    // Editors (if defined in frontmatter)
    if (frontmatter.editors && Array.isArray(frontmatter.editors)) {
        config.editors = frontmatter.editors
    }
}

/**
 * Generate config.yaml content with comments and formatting
 *
 * @param {object} config - Configuration object
 * @returns {string} - Formatted YAML content
 */
function generateConfigYaml(config) {
    // Generate YAML with proper formatting
    const yaml = stringifyYaml(config, {
        indent: 2,
        lineWidth: 120,
        defaultStringType: 'QUOTE_DOUBLE',
    })

    // Add header comment
    const header = `# CouchCMS AI Toolkit - Consolidated Configuration
# This file was auto-generated by the migration script
# Migrated on: ${new Date().toISOString()}
#
# This configuration consolidates settings from:
# - defaults.yaml
# - smart-defaults.yaml
# - preflight-checks.yaml
# - standards.md
#
# For documentation, see: docs/CONFIG-SCHEMA.md

`

    return header + yaml
}

// Run migration
migrate()
