#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Validate Modules Script
 *
 * Validates all modules in the modules/ directory for consistency,
 * completeness, and quality.
 *
 * Usage:
 *   bun scripts/validate-modules.js
 *   bun scripts/validate-modules.js --fix
 *   bun scripts/validate-modules.js --strict
 */

import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TOOLKIT_ROOT = resolve(__dirname, '..')
const MODULES_DIR = join(TOOLKIT_ROOT, 'modules')

/**
 * Validation results
 */
const results = {
    passed: [],
    warnings: [],
    errors: [],
    stats: {
        total: 0,
        withSkillRules: 0,
        dependencies: 0,
        conflicts: 0,
    },
}

/**
 * Required frontmatter fields
 */
const REQUIRED_FIELDS = ['id', 'name', 'description', 'version']
const OPTIONAL_FIELDS = ['category', 'required', 'requires', 'conflicts']

/**
 * Validate module frontmatter
 */
function validateFrontmatter(moduleId, frontmatter, filePath) {
    const issues = []

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
        if (!frontmatter[field]) {
            issues.push({
                type: 'error',
                message: `Missing required field: '${field}'`,
            })
        }
    }

    // Validate id matches filename
    const filename = filePath.split('/').pop().replace('.md', '')
    if (frontmatter.id && frontmatter.id !== filename) {
        issues.push({
            type: 'error',
            message: `ID mismatch: frontmatter 'id' (${frontmatter.id}) doesn't match filename (${filename})`,
        })
    }

    // Validate id format (kebab-case)
    if (frontmatter.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.id)) {
        issues.push({
            type: 'warning',
            message: `ID should be kebab-case: '${frontmatter.id}'`,
        })
    }

    // Validate name format (Title Case)
    // Allow technical names like "Alpine.js", "daisyUI", etc.
    if (frontmatter.name) {
        const name = frontmatter.name
        // Allow technical names with dots, camelCase, etc.
        const isTechnicalName = /\.(js|ts|css|html|php|json)$/i.test(name) ||
                               /^[a-z]+[A-Z]/.test(name) || // camelCase like "daisyUI"
                               name.includes('.') // Contains dot like "Alpine.js"

        if (!isTechnicalName && !/^[A-Z][a-zA-Z0-9\s]+$/.test(name)) {
            issues.push({
                type: 'warning',
                message: `Name should be Title Case: '${name}'`,
            })
        }
    }

    // Validate description length
    if (frontmatter.description) {
        const len = frontmatter.description.length
        if (len < 20) {
            issues.push({
                type: 'warning',
                message: `Description too short (${len} chars, minimum 20)`,
            })
        } else if (len > 200) {
            issues.push({
                type: 'warning',
                message: `Description too long (${len} chars, maximum 200)`,
            })
        }
    }

    // Validate requires is array
    if (frontmatter.requires !== undefined && !Array.isArray(frontmatter.requires)) {
        issues.push({
            type: 'error',
            message: `'requires' must be an array, got: ${typeof frontmatter.requires}`,
        })
    }

    // Validate conflicts is array
    if (frontmatter.conflicts !== undefined && !Array.isArray(frontmatter.conflicts)) {
        issues.push({
            type: 'error',
            message: `'conflicts' must be an array, got: ${typeof frontmatter.conflicts}`,
        })
    }

    // Validate required is boolean
    if (frontmatter.required !== undefined && typeof frontmatter.required !== 'boolean') {
        issues.push({
            type: 'error',
            message: `'required' must be a boolean, got: ${typeof frontmatter.required}`,
        })
    }

    return issues
}

/**
 * Validate module dependencies
 */
function validateDependencies(moduleId, frontmatter, allModules) {
    const issues = []

    if (Array.isArray(frontmatter.requires)) {
        for (const dep of frontmatter.requires) {
            if (!allModules.includes(dep)) {
                issues.push({
                    type: 'error',
                    message: `Dependency '${dep}' not found in modules directory`,
                })
            }
            if (dep === moduleId) {
                issues.push({
                    type: 'error',
                    message: `Module cannot depend on itself`,
                })
            }
        }
    }

    if (Array.isArray(frontmatter.conflicts)) {
        for (const conflict of frontmatter.conflicts) {
            if (!allModules.includes(conflict) && conflict !== 'bootstrap') {
                // bootstrap is a valid conflict even if not a module
                issues.push({
                    type: 'warning',
                    message: `Conflict '${conflict}' not found in modules directory`,
                })
            }
        }
    }

    return issues
}

/**
 * Validate module content
 */
function validateContent(moduleId, content, filePath) {
    const issues = []

    // Check for empty lines after frontmatter
    const lines = content.split('\n')
    let frontmatterEnd = -1
    let inFrontmatter = false
    let frontmatterLineCount = 0

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
            if (!inFrontmatter) {
                inFrontmatter = true
            } else {
                frontmatterEnd = i
                break
            }
        }
        if (inFrontmatter) frontmatterLineCount++
    }

    if (frontmatterEnd >= 0) {
        // Check for multiple empty lines after frontmatter
        let emptyLines = 0
        for (let i = frontmatterEnd + 1; i < lines.length && i < frontmatterEnd + 5; i++) {
            if (lines[i].trim() === '') {
                emptyLines++
            } else {
                break
            }
        }
        if (emptyLines > 1) {
            issues.push({
                type: 'warning',
                message: `Multiple empty lines after frontmatter (${emptyLines} lines)`,
            })
        }
    }

    // Check main title format
    const titleMatch = content.match(/^#\s+(.+)$/m)
    if (titleMatch) {
        const title = titleMatch[1]
        // Title should be Title Case, not kebab-case
        // Check if title is exactly the moduleId (kebab-case) - that's wrong
        if (title === moduleId) {
            issues.push({
                type: 'warning',
                message: `Main title should be Title Case, not kebab-case: '# ${title}'`,
            })
        }
        // Check if title is kebab-case format (contains hyphens and lowercase)
        else if (/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(title) && title === title.toLowerCase()) {
            issues.push({
                type: 'warning',
                message: `Main title should be Title Case, not kebab-case: '# ${title}'`,
            })
        }
    } else {
        issues.push({
            type: 'warning',
            message: `Missing main title (H1)`,
        })
    }

    // Check for code blocks without titles
    const codeBlockRegex = /```(\w+)(?:\s+title="([^"]+)")?/g
    let match
    let codeBlocksWithoutTitles = 0
    while ((match = codeBlockRegex.exec(content)) !== null) {
        if (!match[2]) {
            codeBlocksWithoutTitles++
        }
    }
    if (codeBlocksWithoutTitles > 0) {
        issues.push({
            type: 'warning',
            message: `${codeBlocksWithoutTitles} code block(s) without title attribute`,
        })
    }

    // Check for critical rules section
    if (!content.includes('🚨') && !content.includes('CRITICAL')) {
        issues.push({
            type: 'info',
            message: `No critical rules section found (consider adding 🚨 CRITICAL rules)`,
        })
    }

    // Check for examples
    const hasCodeBlocks = /```/.test(content)
    if (!hasCodeBlocks) {
        issues.push({
            type: 'warning',
            message: `No code examples found`,
        })
    }

    return issues
}

/**
 * Validate skill rules file
 */
function validateSkillRules(moduleId) {
    const issues = []
    const skillRulesPath = join(MODULES_DIR, `${moduleId}.skill-rules.json`)

    if (!existsSync(skillRulesPath)) {
        // Skill rules are optional, so this is just info
        return issues
    }

    try {
        const content = readFileSync(skillRulesPath, 'utf-8')
        const data = JSON.parse(content)

        if (typeof data !== 'object' || Array.isArray(data)) {
            issues.push({
                type: 'error',
                message: `Invalid JSON structure: root must be an object`,
            })
            return issues
        }

        // Check for skill-name (first key in object)
        const skillName = Object.keys(data)[0]
        if (!skillName) {
            issues.push({
                type: 'error',
                message: `Missing skill-name object`,
            })
            return issues
        }

        const skill = data[skillName]

        if (!skill.description) {
            issues.push({
                type: 'error',
                message: `Missing 'description' field in skill rules`,
            })
        }

        // Skill rules can have either 'rules' array or 'preflightChecks' array
        // Both are valid structures
        if (Array.isArray(skill.rules)) {
            if (skill.rules.length === 0) {
                issues.push({
                    type: 'warning',
                    message: `Empty 'rules' array in skill rules`,
                })
            }
        } else if (Array.isArray(skill.preflightChecks)) {
            if (skill.preflightChecks.length === 0) {
                issues.push({
                    type: 'warning',
                    message: `Empty 'preflightChecks' array in skill rules`,
                })
            }
        } else {
            // Neither rules nor preflightChecks found - this is a warning, not error
            issues.push({
                type: 'warning',
                message: `No 'rules' or 'preflightChecks' array found in skill rules`,
            })
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            issues.push({
                type: 'error',
                message: `Invalid JSON: ${error.message}`,
            })
        } else {
            issues.push({
                type: 'error',
                message: `Error reading skill rules: ${error.message}`,
            })
        }
    }

    return issues
}

/**
 * Main validation function
 */
async function validateModules(options = {}) {
    const { fix = false, strict = false } = options

    console.log('📚 CouchCMS AI Toolkit - Module Validation\n')

    if (!existsSync(MODULES_DIR)) {
        console.error(`❌ Modules directory not found: ${MODULES_DIR}\n`)
        process.exit(1)
    }

    // Get all module files
    const files = readdirSync(MODULES_DIR)
        .filter((f) => f.endsWith('.md') && f !== 'README.md')
        .sort()

    results.stats.total = files.length

    const allModuleIds = []

    // Validate each module
    for (const file of files) {
        const filePath = join(MODULES_DIR, file)
        const content = readFileSync(filePath, 'utf-8')
        const { data: frontmatter, content: body } = matter(content)

        const moduleId = frontmatter.id || file.replace('.md', '')
        allModuleIds.push(moduleId)

        const moduleIssues = {
            id: moduleId,
            file,
            errors: [],
            warnings: [],
            info: [],
        }

        // Validate frontmatter
        const frontmatterIssues = validateFrontmatter(moduleId, frontmatter, filePath)
        for (const issue of frontmatterIssues) {
            moduleIssues[issue.type === 'error' ? 'errors' : 'warnings'].push(issue.message)
        }

        // Validate dependencies (second pass, after we have all module IDs)
        // This will be done after first pass

        // Validate content
        const contentIssues = validateContent(moduleId, body, filePath)
        for (const issue of contentIssues) {
            if (issue.type === 'error') {
                moduleIssues.errors.push(issue.message)
            } else if (issue.type === 'warning') {
                moduleIssues.warnings.push(issue.message)
            } else {
                moduleIssues.info.push(issue.message)
            }
        }

        // Validate skill rules
        const skillRulesIssues = validateSkillRules(moduleId)
        for (const issue of skillRulesIssues) {
            if (issue.type === 'error') {
                moduleIssues.errors.push(issue.message)
            } else if (issue.type === 'warning') {
                moduleIssues.warnings.push(issue.message)
            }
        }

        // Check if skill rules file exists
        const skillRulesPath = join(MODULES_DIR, `${moduleId}.skill-rules.json`)
        if (existsSync(skillRulesPath)) {
            results.stats.withSkillRules++
        }

        // Count dependencies
        if (Array.isArray(frontmatter.requires) && frontmatter.requires.length > 0) {
            results.stats.dependencies += frontmatter.requires.length
        }

        // Count conflicts
        if (Array.isArray(frontmatter.conflicts) && frontmatter.conflicts.length > 0) {
            results.stats.conflicts += frontmatter.conflicts.length
        }

        // Categorize results
        if (moduleIssues.errors.length === 0 && moduleIssues.warnings.length === 0) {
            results.passed.push(moduleId)
        } else {
            if (moduleIssues.errors.length > 0) {
                results.errors.push({
                    module: moduleId,
                    file,
                    issues: moduleIssues.errors,
                })
            }
            if (moduleIssues.warnings.length > 0 || moduleIssues.info.length > 0) {
                results.warnings.push({
                    module: moduleId,
                    file,
                    issues: [...moduleIssues.warnings, ...moduleIssues.info],
                })
            }
        }
    }

    // Second pass: validate dependencies (now we have all module IDs)
    for (const file of files) {
        const filePath = join(MODULES_DIR, file)
        const content = readFileSync(filePath, 'utf-8')
        const { data: frontmatter } = matter(content)
        const moduleId = frontmatter.id || file.replace('.md', '')

        const depIssues = validateDependencies(moduleId, frontmatter, allModuleIds)

        // Only process if there are dependency issues
        if (depIssues.length > 0) {
            // Find existing entry
            let entry = results.errors.find((e) => e.module === moduleId)
            if (!entry) {
                entry = results.warnings.find((e) => e.module === moduleId)
            }
            if (!entry) {
                entry = { module: moduleId, file, issues: [] }
                results.warnings.push(entry)
            }

            for (const issue of depIssues) {
                if (issue.type === 'error') {
                    entry.issues.push(issue.message)
                    // Move to errors if not already there
                    if (!results.errors.find((e) => e.module === moduleId)) {
                        results.errors.push(entry)
                        const warnIndex = results.warnings.findIndex((e) => e.module === moduleId)
                        if (warnIndex >= 0) {
                            results.warnings.splice(warnIndex, 1)
                        }
                    }
                } else {
                    entry.issues.push(issue.message)
                }
            }
        }
    }

    // Report results
    console.log('='.repeat(60))
    console.log(`\n✅ PASSED: ${results.passed.length} modules`)

    if (results.warnings.length > 0) {
        console.log(`\n⚠️  WARNINGS: ${results.warnings.length} modules`)
        for (const warning of results.warnings) {
            console.log(`\n   ${warning.module} (${warning.file}):`)
            for (const issue of warning.issues) {
                console.log(`      - ${issue}`)
            }
        }
    }

    if (results.errors.length > 0) {
        console.log(`\n❌ ERRORS: ${results.errors.length} modules`)
        for (const error of results.errors) {
            console.log(`\n   ${error.module} (${error.file}):`)
            for (const issue of error.issues) {
                console.log(`      - ${issue}`)
            }
        }
    }

    console.log('\n' + '='.repeat(60))
    console.log('\n📊 Module Statistics:')
    console.log(`   - Total modules: ${results.stats.total}`)
    console.log(`   - With skill rules: ${results.stats.withSkillRules}`)
    console.log(`   - Total dependencies: ${results.stats.dependencies}`)
    console.log(`   - Total conflicts: ${results.stats.conflicts}`)
    console.log()

    // Exit code
    if (results.errors.length > 0) {
        console.log('❌ Validation failed - Please fix errors above\n')
        process.exit(1)
    } else if (strict && results.warnings.length > 0) {
        console.log('⚠️  Validation failed (strict mode) - Please fix warnings above\n')
        process.exit(1)
    } else if (results.warnings.length > 0) {
        console.log('⚠️  Validation passed with warnings\n')
        process.exit(0)
    } else {
        console.log('✅ Validation passed - All checks OK!\n')
        process.exit(0)
    }
}

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
    fix: args.includes('--fix'),
    strict: args.includes('--strict'),
}

// Run validation
validateModules(options).catch((error) => {
    console.error('❌ Validation error:', error.message)
    if (process.env.DEBUG) {
        console.error(error.stack)
    }
    process.exit(1)
})
