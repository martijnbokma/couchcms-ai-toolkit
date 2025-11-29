#!/usr/bin/env node

/**
 * Audit Troubleshooting Documentation
 * 
 * This script audits the TROUBLESHOOTING.md file to verify:
 * 1. Error messages match actual codebase errors
 * 2. Each troubleshooting section has command examples
 * 3. Comparison examples exist for common mistakes
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TOOLKIT_ROOT = join(__dirname, '..', '..', '..')

// Color output helpers
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
}

function print(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

// Read troubleshooting documentation
const TROUBLESHOOTING_PATH = join(TOOLKIT_ROOT, 'docs', 'TROUBLESHOOTING.md')
let troubleshootingContent = ''

try {
    troubleshootingContent = readFileSync(TROUBLESHOOTING_PATH, 'utf8')
} catch (error) {
    print(`❌ Could not read TROUBLESHOOTING.md: ${error.message}`, 'red')
    process.exit(1)
}

// Task 7.1: Verify error messages
function verifyErrorMessages() {
    print('\n=== Task 7.1: Verify Error Messages ===\n', 'cyan')
    
    const findings = []
    
    // Extract documented error messages from TROUBLESHOOTING.md
    const documentedErrors = [
        { doc: 'No configuration file found', pattern: 'No configuration file found' },
        { doc: 'Invalid YAML syntax', pattern: 'Invalid YAML' },
        { doc: "Module 'X' not found", pattern: 'Module.*not found' },
        { doc: "Agent 'X' not found", pattern: 'Agent.*not found' },
        { doc: 'Toolkit path not found', pattern: 'Toolkit path not found' },
        { doc: 'Generated files not found', pattern: 'Generated files not found' },
        { doc: 'npm ERR! code ENOENT', pattern: 'ENOENT' },
        { doc: "Cannot find module 'gray-matter'", pattern: 'Cannot find module' },
        { doc: 'No modules loaded', pattern: 'No modules loaded' },
        { doc: 'Sync completed with errors', pattern: 'Sync completed with errors' },
        { doc: 'Submodule is detached HEAD', pattern: 'detached HEAD' },
        { doc: 'Submodule has uncommitted changes', pattern: 'uncommitted changes' },
        { doc: 'Submodule update failed', pattern: 'Submodule update failed' },
        { doc: 'Context file not found', pattern: 'Context file not found' },
        { doc: 'Custom path not found', pattern: 'Custom path not found' },
    ]
    
    print('Checking documented error messages against codebase...\n', 'blue')
    
    for (const error of documentedErrors) {
        try {
            // Search for the error pattern in scripts
            const searchCmd = `grep -r "${error.pattern}" "${join(TOOLKIT_ROOT, 'scripts')}" --include="*.js" || true`
            const result = execSync(searchCmd, { encoding: 'utf8' })
            
            if (result.trim()) {
                findings.push({
                    severity: 'info',
                    message: `✅ Error message found in codebase: "${error.doc}"`,
                    matches: result.split('\n').filter(l => l.trim()).length
                })
            } else {
                findings.push({
                    severity: 'warning',
                    message: `⚠️  Error message not found in codebase: "${error.doc}"`,
                    recommendation: 'Verify if this error is still relevant or update the message'
                })
            }
        } catch (err) {
            findings.push({
                severity: 'error',
                message: `❌ Error searching for: "${error.doc}"`,
                details: err.message
            })
        }
    }
    
    // Check for error messages in code that aren't documented
    print('\nChecking for undocumented error messages in codebase...\n', 'blue')
    
    const codebaseErrors = []
    try {
        // Find all console.error and throw new Error statements
        const errorCmd = `grep -rh "console\\.error\\|throw new Error" "${join(TOOLKIT_ROOT, 'scripts')}" --include="*.js" | grep -o '"[^"]*"\\|'[^']*'' | head -20`
        const result = execSync(errorCmd, { encoding: 'utf8', shell: '/bin/bash' })
        
        const errorMessages = result.split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^['"]|['"]$/g, ''))
            .filter(msg => msg.length > 10) // Filter out short messages
        
        for (const msg of errorMessages) {
            if (!troubleshootingContent.includes(msg)) {
                codebaseErrors.push(msg)
            }
        }
        
        if (codebaseErrors.length > 0) {
            findings.push({
                severity: 'warning',
                message: `⚠️  Found ${codebaseErrors.length} error messages in code not documented in TROUBLESHOOTING.md`,
                examples: codebaseErrors.slice(0, 5),
                recommendation: 'Consider adding troubleshooting sections for these errors'
            })
        } else {
            findings.push({
                severity: 'info',
                message: '✅ All major error messages appear to be documented'
            })
        }
    } catch (err) {
        // Grep might fail if no matches, that's okay
    }
    
    return findings
}

// Task 7.2: Check solution completeness
function checkSolutionCompleteness() {
    print('\n=== Task 7.2: Check Solution Completeness ===\n', 'cyan')
    
    const findings = []
    
    // Extract all troubleshooting sections (marked with ###)
    const sectionRegex = /###\s+[❌⚠️🐌]\s+"([^"]+)"/g
    const sections = []
    let match
    
    while ((match = sectionRegex.exec(troubleshootingContent)) !== null) {
        sections.push({
            title: match[1],
            startIndex: match.index,
            fullMatch: match[0]
        })
    }
    
    print(`Found ${sections.length} troubleshooting sections\n`, 'blue')
    
    // For each section, check if it has code blocks with solutions
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const nextSection = sections[i + 1]
        
        // Extract content between this section and the next
        const sectionContent = nextSection 
            ? troubleshootingContent.substring(section.startIndex, nextSection.startIndex)
            : troubleshootingContent.substring(section.startIndex)
        
        // Check for code blocks
        const codeBlockRegex = /```[\s\S]*?```/g
        const codeBlocks = sectionContent.match(codeBlockRegex) || []
        
        // Check for command examples (lines starting with common commands)
        const hasCommands = /^\s*(bun|npm|git|cd|ls|cat|grep|mkdir|rm|touch)/m.test(sectionContent)
        
        if (codeBlocks.length === 0) {
            findings.push({
                severity: 'warning',
                message: `⚠️  Section "${section.title}" has no code blocks`,
                recommendation: 'Add code examples showing the solution'
            })
        } else if (!hasCommands) {
            findings.push({
                severity: 'info',
                message: `ℹ️  Section "${section.title}" has code blocks but no executable commands`,
                recommendation: 'Consider adding command examples if applicable'
            })
        } else {
            findings.push({
                severity: 'info',
                message: `✅ Section "${section.title}" has ${codeBlocks.length} code block(s) with commands`
            })
        }
    }
    
    return findings
}

// Task 7.3: Check for comparison examples
function checkComparisonExamples() {
    print('\n=== Task 7.3: Check for Comparison Examples ===\n', 'cyan')
    
    const findings = []
    
    // Look for "Wrong:" and "Right:" patterns
    const wrongPattern = /[✗❌]\s*(Wrong|Bad|Incorrect|Don't)/gi
    const rightPattern = /[✓✅]\s*(Right|Good|Correct|Do this)/gi
    
    const wrongMatches = troubleshootingContent.match(wrongPattern) || []
    const rightMatches = troubleshootingContent.match(rightPattern) || []
    
    print(`Found ${wrongMatches.length} "wrong" examples\n`, 'blue')
    print(`Found ${rightMatches.length} "right" examples\n`, 'blue')
    
    if (wrongMatches.length > 0 && rightMatches.length > 0) {
        findings.push({
            severity: 'info',
            message: `✅ Document contains ${wrongMatches.length} wrong examples and ${rightMatches.length} right examples`,
            details: 'Good use of comparison patterns'
        })
    } else if (wrongMatches.length === 0 && rightMatches.length === 0) {
        findings.push({
            severity: 'warning',
            message: '⚠️  No comparison examples found (✗ Wrong / ✓ Right patterns)',
            recommendation: 'Add comparison examples to show common mistakes vs correct approaches'
        })
    } else {
        findings.push({
            severity: 'info',
            message: `ℹ️  Found some comparison examples but could add more`,
            details: `${wrongMatches.length} wrong, ${rightMatches.length} right`
        })
    }
    
    // Check for "Common Mistake Patterns" section
    if (troubleshootingContent.includes('## Common Mistake Patterns')) {
        findings.push({
            severity: 'info',
            message: '✅ "Common Mistake Patterns" section exists'
        })
        
        // Check if it has examples
        const mistakeSectionMatch = troubleshootingContent.match(/## Common Mistake Patterns([\s\S]*?)(?=##|$)/)
        if (mistakeSectionMatch) {
            const mistakeSection = mistakeSectionMatch[1]
            const hasExamples = /```[\s\S]*?```/.test(mistakeSection)
            
            if (hasExamples) {
                findings.push({
                    severity: 'info',
                    message: '✅ Common Mistake Patterns section has code examples'
                })
            } else {
                findings.push({
                    severity: 'warning',
                    message: '⚠️  Common Mistake Patterns section lacks code examples',
                    recommendation: 'Add code examples showing wrong vs right approaches'
                })
            }
        }
    } else {
        findings.push({
            severity: 'info',
            message: 'ℹ️  No dedicated "Common Mistake Patterns" section',
            recommendation: 'Consider adding a section highlighting frequent mistakes'
        })
    }
    
    return findings
}

// Generate report
function generateReport(task71, task72, task73) {
    print('\n' + '='.repeat(80), 'cyan')
    print('TROUBLESHOOTING DOCUMENTATION AUDIT REPORT', 'cyan')
    print('='.repeat(80) + '\n', 'cyan')
    
    const allFindings = [...task71, ...task72, ...task73]
    
    const errors = allFindings.filter(f => f.severity === 'error')
    const warnings = allFindings.filter(f => f.severity === 'warning')
    const info = allFindings.filter(f => f.severity === 'info')
    
    print(`Total Findings: ${allFindings.length}`, 'blue')
    print(`  Errors: ${errors.length}`, 'red')
    print(`  Warnings: ${warnings.length}`, 'yellow')
    print(`  Info: ${info.length}`, 'green')
    print('')
    
    if (errors.length > 0) {
        print('ERRORS:', 'red')
        errors.forEach(f => {
            print(`  ${f.message}`, 'red')
            if (f.details) print(`    Details: ${f.details}`, 'yellow')
            if (f.recommendation) print(`    → ${f.recommendation}`, 'cyan')
        })
        print('')
    }
    
    if (warnings.length > 0) {
        print('WARNINGS:', 'yellow')
        warnings.forEach(f => {
            print(`  ${f.message}`, 'yellow')
            if (f.details) print(`    Details: ${f.details}`, 'blue')
            if (f.recommendation) print(`    → ${f.recommendation}`, 'cyan')
            if (f.examples) {
                print(`    Examples:`, 'blue')
                f.examples.forEach(ex => print(`      - ${ex}`, 'blue'))
            }
        })
        print('')
    }
    
    print('SUMMARY:', 'green')
    info.forEach(f => {
        print(`  ${f.message}`, 'green')
        if (f.details) print(`    ${f.details}`, 'blue')
    })
    
    print('\n' + '='.repeat(80) + '\n', 'cyan')
}

// Main execution
async function main() {
    print('\n🔍 Starting Troubleshooting Documentation Audit\n', 'cyan')
    print(`Auditing: ${TROUBLESHOOTING_PATH}\n`, 'blue')
    
    const task71Findings = verifyErrorMessages()
    const task72Findings = checkSolutionCompleteness()
    const task73Findings = checkComparisonExamples()
    
    generateReport(task71Findings, task72Findings, task73Findings)
    
    print('✅ Audit complete!\n', 'green')
}

main().catch(error => {
    print(`\n❌ Audit failed: ${error.message}`, 'red')
    console.error(error)
    process.exit(1)
})
