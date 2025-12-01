#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Documentation Audit Script
 *
 * Validates documentation for accuracy, consistency, and completeness
 *
 * Usage:
 *   bun scripts/audit-docs.js
 *   bun scripts/audit-docs.js --report-only
 *   bun scripts/audit-docs.js --format=json
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs'
import { dirname, resolve, join, relative, extname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TOOLKIT_ROOT = resolve(__dirname, '..')

// Configuration
const DOCS_DIRS = ['docs', '.']
const MARKDOWN_EXTENSIONS = ['.md', '.markdown']
const DEPRECATED_FILES = [
    'CLAUDE.md', 'AGENT.md', 'config.yaml', 'defaults.yaml', 
    'smart-defaults.yaml', 'preflight-checks.yaml'
]

/**
 * Finding types and severity levels
 */
const FINDING_TYPES = {
    OUTDATED_REFERENCE: 'outdated-reference',
    BROKEN_LINK: 'broken-link',
    INCONSISTENT_TERMINOLOGY: 'inconsistent-terminology',
    MISSING_FILE: 'missing-file',
    INCORRECT_COMMAND: 'incorrect-command',
    VERSION_MISMATCH: 'version-mismatch',
    DEPRECATED_FILE_REFERENCE: 'deprecated-file-reference',
    MISSING_LANGUAGE_SPECIFIER: 'missing-language-specifier',
    INCONSISTENT_PATH_NOTATION: 'inconsistent-path-notation'
}

const SEVERITY_LEVELS = {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
}

/**
 * Main audit class
 */
class DocumentationAuditor {
    constructor() {
        this.findings = []
        this.packageJson = null
        this.documents = new Map()
        this.terminologyMap = new Map()
        this.pathNotationMap = new Map()
        
        this.loadPackageJson()
    }

    /**
     * Load package.json for validation
     */
    loadPackageJson() {
        const packagePath = join(TOOLKIT_ROOT, 'package.json')
        if (existsSync(packagePath)) {
            this.packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
        }
    }

    /**
     * Add a finding to the results
     */
    addFinding(type, severity, document, line, column, issue, current, expected, context = '') {
        this.findings.push({
            type,
            severity,
            document: relative(TOOLKIT_ROOT, document),
            line,
            column,
            issue,
            current,
            expected,
            context
        })
    }

    /**
     * Find all markdown files to audit
     */
    findMarkdownFiles() {
        const files = []
        
        for (const dir of DOCS_DIRS) {
            const fullDir = join(TOOLKIT_ROOT, dir)
            if (existsSync(fullDir)) {
                this.scanDirectory(fullDir, files)
            }
        }
        
        return files
    }

    /**
     * Recursively scan directory for markdown files
     */
    scanDirectory(dir, files) {
        const entries = readdirSync(dir, { withFileTypes: true })
        
        for (const entry of entries) {
            const fullPath = join(dir, entry.name)
            
            if (entry.isDirectory()) {
                // Skip hidden directories and node_modules
                if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
                    this.scanDirectory(fullPath, files)
                }
            } else if (entry.isFile()) {
                const ext = extname(entry.name).toLowerCase()
                if (MARKDOWN_EXTENSIONS.includes(ext)) {
                    files.push(fullPath)
                }
            }
        }
    }

    /**
     * Parse a markdown file and extract content
     */
    parseMarkdownFile(filePath) {
        try {
            const content = readFileSync(filePath, 'utf8')
            const parsed = matter(content)
            
            return {
                path: filePath,
                content,
                frontmatter: parsed.data,
                body: parsed.content,
                lines: content.split('\n')
            }
        } catch (error) {
            this.addFinding(
                FINDING_TYPES.MISSING_FILE,
                SEVERITY_LEVELS.CRITICAL,
                filePath,
                0,
                0,
                `Failed to parse markdown file: ${error.message}`,
                '',
                'Valid markdown file'
            )
            return null
        }
    }

    /**
     * Extract command references from text
     */
    extractCommands(text, filePath, lineOffset = 0) {
        const commands = []
        const lines = text.split('\n')
        
        // Pattern for code blocks with commands
        const codeBlockRegex = /```[\w]*\n([\s\S]*?)\n```/g
        const inlineCodeRegex = /`([^`]+)`/g
        
        let match
        
        // Extract from code blocks
        while ((match = codeBlockRegex.exec(text)) !== null) {
            const codeContent = match[1]
            const codeLines = codeContent.split('\n')
            
            codeLines.forEach((line, index) => {
                const trimmed = line.trim()
                if (this.isCommand(trimmed)) {
                    const lineNum = this.getLineNumber(text, match.index) + index + lineOffset
                    commands.push({
                        command: trimmed,
                        line: lineNum,
                        column: 0,
                        context: match[0]
                    })
                }
            })
        }
        
        // Extract from inline code
        while ((match = inlineCodeRegex.exec(text)) !== null) {
            const code = match[1].trim()
            if (this.isCommand(code)) {
                const lineNum = this.getLineNumber(text, match.index) + lineOffset
                commands.push({
                    command: code,
                    line: lineNum,
                    column: match.index,
                    context: match[0]
                })
            }
        }
        
        return commands
    }

    /**
     * Check if a string looks like a command
     */
    isCommand(text) {
        const commandPrefixes = ['bun ', 'npm ', 'git ', 'node ', 'yarn ']
        return commandPrefixes.some(prefix => text.startsWith(prefix))
    }

    /**
     * Get line number for a character index in text
     */
    getLineNumber(text, index) {
        return text.substring(0, index).split('\n').length
    }

    /**
     * Extract file path references from text
     */
    extractFilePaths(text, filePath, lineOffset = 0) {
        const paths = []
        const lines = text.split('\n')
        
        // Patterns for different types of file references
        const patterns = [
            /`([^`]*\.[a-zA-Z0-9]+)`/g,  // Inline code with file extensions
            /\[([^\]]*)\]\(([^)]+)\)/g,   // Markdown links
            /(?:^|\s)([./][^\s]+\.[a-zA-Z0-9]+)/g  // Relative paths
        ]
        
        lines.forEach((line, index) => {
            patterns.forEach(pattern => {
                let match
                while ((match = pattern.exec(line)) !== null) {
                    const path = match[1] || match[2] || match[0]
                    if (this.isFilePath(path)) {
                        paths.push({
                            path: path.trim(),
                            line: index + 1 + lineOffset,
                            column: match.index,
                            context: line
                        })
                    }
                }
            })
        })
        
        return paths
    }

    /**
     * Check if a string looks like a file path
     */
    isFilePath(text) {
        // Skip URLs and other non-file references
        if (text.startsWith('http') || text.startsWith('mailto:') || text.includes('://')) {
            return false
        }
        
        // Must have an extension or be a known directory
        return /\.[a-zA-Z0-9]+$/.test(text) || 
               text.endsWith('/') ||
               ['scripts', 'docs', 'modules', 'agents'].some(dir => text.includes(dir))
    }

    /**
     * Extract version references from text
     */
    extractVersions(text, filePath, lineOffset = 0) {
        const versions = []
        const lines = text.split('\n')
        
        const versionPatterns = [
            /v?(\d+\.\d+\.\d+)/g,
            /version\s+(\d+\.\d+\.\d+)/gi,
            /(\d+\.\d+)\+/g
        ]
        
        lines.forEach((line, index) => {
            versionPatterns.forEach(pattern => {
                let match
                while ((match = pattern.exec(line)) !== null) {
                    versions.push({
                        version: match[1] || match[0],
                        line: index + 1 + lineOffset,
                        column: match.index,
                        context: line
                    })
                }
            })
        })
        
        return versions
    }

    /**
     * Extract internal markdown links
     */
    extractInternalLinks(text, filePath, lineOffset = 0) {
        const links = []
        const lines = text.split('\n')
        
        const linkPattern = /\[([^\]]*)\]\(([^)]+)\)/g
        
        lines.forEach((line, index) => {
            let match
            while ((match = linkPattern.exec(line)) !== null) {
                const linkText = match[1]
                const linkUrl = match[2]
                
                // Only process internal links (not URLs)
                if (!linkUrl.startsWith('http') && !linkUrl.startsWith('mailto:')) {
                    links.push({
                        text: linkText,
                        url: linkUrl,
                        line: index + 1 + lineOffset,
                        column: match.index,
                        context: line
                    })
                }
            }
        })
        
        return links
    }

    /**
     * Validate command references against package.json
     */
    validateCommands(commands, filePath) {
        if (!this.packageJson) return
        
        commands.forEach(cmd => {
            const { command, line, column, context } = cmd
            
            // Check if it's a bun/npm script command
            if (command.startsWith('bun ') || command.startsWith('npm run ')) {
                const scriptName = command.replace(/^(bun |npm run )/, '')
                
                if (!this.packageJson.scripts || !this.packageJson.scripts[scriptName]) {
                    this.addFinding(
                        FINDING_TYPES.INCORRECT_COMMAND,
                        SEVERITY_LEVELS.HIGH,
                        filePath,
                        line,
                        column,
                        `Script '${scriptName}' not found in package.json`,
                        command,
                        `Available scripts: ${Object.keys(this.packageJson.scripts || {}).join(', ')}`,
                        context
                    )
                }
            }
        })
    }

    /**
     * Validate file path references
     */
    validateFilePaths(paths, filePath) {
        paths.forEach(pathRef => {
            const { path, line, column, context } = pathRef
            
            // Resolve relative to toolkit root
            let fullPath = path
            if (path.startsWith('./') || path.startsWith('../')) {
                fullPath = resolve(TOOLKIT_ROOT, path)
            } else if (!path.startsWith('/')) {
                fullPath = join(TOOLKIT_ROOT, path)
            }
            
            if (!existsSync(fullPath)) {
                this.addFinding(
                    FINDING_TYPES.MISSING_FILE,
                    SEVERITY_LEVELS.MEDIUM,
                    filePath,
                    line,
                    column,
                    `File or directory not found: ${path}`,
                    path,
                    'Existing file path',
                    context
                )
            }
        })
    }

    /**
     * Validate version references
     */
    validateVersions(versions, filePath) {
        if (!this.packageJson) return
        
        const currentVersion = this.packageJson.version
        
        versions.forEach(versionRef => {
            const { version, line, column, context } = versionRef
            
            // Check if version matches current package.json version
            if (version !== currentVersion && !context.includes('old') && !context.includes('previous')) {
                this.addFinding(
                    FINDING_TYPES.VERSION_MISMATCH,
                    SEVERITY_LEVELS.MEDIUM,
                    filePath,
                    line,
                    column,
                    `Version mismatch: found ${version}, current is ${currentVersion}`,
                    version,
                    currentVersion,
                    context
                )
            }
        })
    }

    /**
     * Validate internal links
     */
    validateInternalLinks(links, filePath) {
        links.forEach(link => {
            const { url, line, column, context } = link
            
            // Parse URL and anchor
            const [linkPath, anchor] = url.split('#')
            
            // Resolve relative to current file's directory
            let targetPath = linkPath
            if (linkPath) {
                if (linkPath.startsWith('./') || linkPath.startsWith('../')) {
                    targetPath = resolve(dirname(filePath), linkPath)
                } else {
                    targetPath = join(TOOLKIT_ROOT, linkPath)
                }
                
                if (!existsSync(targetPath)) {
                    this.addFinding(
                        FINDING_TYPES.BROKEN_LINK,
                        SEVERITY_LEVELS.HIGH,
                        filePath,
                        line,
                        column,
                        `Broken link: target file not found`,
                        url,
                        'Valid file path',
                        context
                    )
                }
            }
            
            // TODO: Validate anchors by parsing target file headers
        })
    }

    /**
     * Check for deprecated file references
     */
    checkDeprecatedReferences(content, filePath) {
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
            DEPRECATED_FILES.forEach(deprecatedFile => {
                if (line.includes(deprecatedFile)) {
                    this.addFinding(
                        FINDING_TYPES.DEPRECATED_FILE_REFERENCE,
                        SEVERITY_LEVELS.HIGH,
                        filePath,
                        index + 1,
                        line.indexOf(deprecatedFile),
                        `Reference to deprecated file: ${deprecatedFile}`,
                        deprecatedFile,
                        'Current equivalent file or remove reference',
                        line
                    )
                }
            })
        })
    }

    /**
     * Check for missing language specifiers in code blocks
     */
    checkCodeBlockLanguages(content, filePath) {
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
            if (line.trim() === '```') {
                this.addFinding(
                    FINDING_TYPES.MISSING_LANGUAGE_SPECIFIER,
                    SEVERITY_LEVELS.LOW,
                    filePath,
                    index + 1,
                    0,
                    'Code block missing language specifier',
                    '```',
                    '```javascript (or appropriate language)',
                    line
                )
            }
        })
    }

    /**
     * Collect terminology usage across documents
     */
    collectTerminology(content, filePath) {
        // Common technical terms that should be consistent
        const terms = [
            'toolkit', 'Toolkit', 'AI Toolkit',
            'standards.md', 'Standards.md', 'STANDARDS.md',
            'config.yaml', 'configuration file',
            'sync script', 'sync.js',
            'generated files', 'Generated Files',
            'CouchCMS', 'Couch CMS', 'couch cms',
            'setup wizard', 'Setup Wizard',
            'module', 'Module', 'knowledge module',
            'agent', 'Agent', 'AI agent'
        ]
        
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
            terms.forEach(term => {
                if (line.toLowerCase().includes(term.toLowerCase())) {
                    const key = term.toLowerCase().replace(/[^a-z0-9]/g, '')
                    if (!this.terminologyMap.has(key)) {
                        this.terminologyMap.set(key, new Map())
                    }
                    
                    const termMap = this.terminologyMap.get(key)
                    if (!termMap.has(term)) {
                        termMap.set(term, [])
                    }
                    
                    termMap.get(term).push({
                        file: filePath,
                        line: index + 1,
                        context: line.trim()
                    })
                }
            })
        })
    }

    /**
     * Collect path notation usage across documents
     */
    collectPathNotation(content, filePath) {
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
            // Look for path references
            const pathPatterns = [
                /`([^`]*(?:scripts|docs|modules|agents|\.)[^`]*)`/g,
                /(?:^|\s)([./][^\s]+)/g
            ]
            
            pathPatterns.forEach(pattern => {
                let match
                while ((match = pattern.exec(line)) !== null) {
                    const path = match[1]
                    if (this.isFilePath(path)) {
                        // Normalize path for comparison
                        const normalizedPath = path.replace(/^\.\//, '').replace(/\/$/, '')
                        
                        if (!this.pathNotationMap.has(normalizedPath)) {
                            this.pathNotationMap.set(normalizedPath, new Map())
                        }
                        
                        const notationMap = this.pathNotationMap.get(normalizedPath)
                        if (!notationMap.has(path)) {
                            notationMap.set(path, [])
                        }
                        
                        notationMap.get(path).push({
                            file: filePath,
                            line: index + 1,
                            context: line.trim()
                        })
                    }
                }
            })
        })
    }

    /**
     * Check terminology consistency across documents
     */
    checkTerminologyConsistency() {
        for (const [termKey, termMap] of this.terminologyMap) {
            const variations = Array.from(termMap.keys())
            
            if (variations.length > 1) {
                // Find the most common variation
                let mostCommon = variations[0]
                let maxCount = 0
                
                for (const variation of variations) {
                    const count = termMap.get(variation).length
                    if (count > maxCount) {
                        maxCount = count
                        mostCommon = variation
                    }
                }
                
                // Report inconsistencies
                for (const variation of variations) {
                    if (variation !== mostCommon) {
                        const occurrences = termMap.get(variation)
                        
                        occurrences.forEach(occurrence => {
                            this.addFinding(
                                FINDING_TYPES.INCONSISTENT_TERMINOLOGY,
                                SEVERITY_LEVELS.MEDIUM,
                                occurrence.file,
                                occurrence.line,
                                0,
                                `Inconsistent terminology: '${variation}' should be '${mostCommon}'`,
                                variation,
                                mostCommon,
                                occurrence.context
                            )
                        })
                    }
                }
            }
        }
    }

    /**
     * Check path notation consistency across documents
     */
    checkPathNotationConsistency() {
        for (const [normalizedPath, notationMap] of this.pathNotationMap) {
            const notations = Array.from(notationMap.keys())
            
            if (notations.length > 1) {
                // Prefer explicit relative paths (./path) over implicit ones
                let preferred = notations.find(n => n.startsWith('./')) || notations[0]
                
                // Report inconsistencies
                for (const notation of notations) {
                    if (notation !== preferred) {
                        const occurrences = notationMap.get(notation)
                        
                        occurrences.forEach(occurrence => {
                            this.addFinding(
                                FINDING_TYPES.INCONSISTENT_PATH_NOTATION,
                                SEVERITY_LEVELS.LOW,
                                occurrence.file,
                                occurrence.line,
                                0,
                                `Inconsistent path notation: '${notation}' should be '${preferred}'`,
                                notation,
                                preferred,
                                occurrence.context
                            )
                        })
                    }
                }
            }
        }
    }

    /**
     * Validate version references against package.json
     */
    validateVersionConsistency() {
        if (!this.packageJson) return
        
        const currentVersion = this.packageJson.version
        
        // Check for hardcoded version references that should be dynamic
        for (const [filePath, doc] of this.documents) {
            const lines = doc.content.split('\n')
            
            lines.forEach((line, index) => {
                // Look for version patterns in documentation
                const versionPatterns = [
                    new RegExp(`version\\s+${currentVersion.replace(/\./g, '\\.')}`, 'gi'),
                    new RegExp(`v${currentVersion.replace(/\./g, '\\.')}`, 'gi')
                ]
                
                versionPatterns.forEach(pattern => {
                    if (pattern.test(line) && !line.includes('package.json')) {
                        this.addFinding(
                            FINDING_TYPES.VERSION_MISMATCH,
                            SEVERITY_LEVELS.LOW,
                            filePath,
                            index + 1,
                            0,
                            'Hardcoded version reference should reference package.json',
                            line.trim(),
                            'Reference to package.json version or use dynamic version',
                            line
                        )
                    }
                })
            })
        }
    }

    /**
     * Run the complete audit
     */
    async audit() {
        console.log('🔍 CouchCMS AI Toolkit - Documentation Audit\n')
        
        const files = this.findMarkdownFiles()
        console.log(`📄 Found ${files.length} markdown files to audit\n`)
        
        // Parse all files
        for (const filePath of files) {
            const doc = this.parseMarkdownFile(filePath)
            if (doc) {
                this.documents.set(filePath, doc)
            }
        }
        
        // First pass: collect terminology and path notation data
        for (const [filePath, doc] of this.documents) {
            this.collectTerminology(doc.content, filePath)
            this.collectPathNotation(doc.content, filePath)
        }
        
        // Audit each document
        for (const [filePath, doc] of this.documents) {
            console.log(`🔍 Auditing: ${relative(TOOLKIT_ROOT, filePath)}`)
            
            // Extract and validate commands
            const commands = this.extractCommands(doc.content, filePath)
            this.validateCommands(commands, filePath)
            
            // Extract and validate file paths
            const paths = this.extractFilePaths(doc.content, filePath)
            this.validateFilePaths(paths, filePath)
            
            // Extract and validate versions
            const versions = this.extractVersions(doc.content, filePath)
            this.validateVersions(versions, filePath)
            
            // Extract and validate internal links
            const links = this.extractInternalLinks(doc.content, filePath)
            this.validateInternalLinks(links, filePath)
            
            // Check for deprecated references
            this.checkDeprecatedReferences(doc.content, filePath)
            
            // Check code block language specifiers
            this.checkCodeBlockLanguages(doc.content, filePath)
        }
        
        // Run consistency checks across all documents
        console.log('🔍 Checking consistency across documents...')
        this.checkTerminologyConsistency()
        this.checkPathNotationConsistency()
        this.validateVersionConsistency()
        
        console.log(`\n✅ Audit complete. Found ${this.findings.length} issues.\n`)
        
        return this.findings
    }
}

/**
 * Report generator class
 */
class ReportGenerator {
    constructor(findings) {
        this.findings = findings
    }

    /**
     * Generate executive summary
     */
    generateSummary() {
        const total = this.findings.length
        const bySeverity = this.findings.reduce((acc, finding) => {
            acc[finding.severity] = (acc[finding.severity] || 0) + 1
            return acc
        }, {})

        const byType = this.findings.reduce((acc, finding) => {
            acc[finding.type] = (acc[finding.type] || 0) + 1
            return acc
        }, {})

        return {
            total,
            bySeverity,
            byType,
            criticalCount: bySeverity.critical || 0,
            highCount: bySeverity.high || 0,
            mediumCount: bySeverity.medium || 0,
            lowCount: bySeverity.low || 0
        }
    }

    /**
     * Generate markdown report
     */
    generateMarkdownReport() {
        const summary = this.generateSummary()
        const timestamp = new Date().toISOString()

        let report = `# Documentation Audit Report

Generated: ${timestamp}

## Executive Summary

- **Total Issues Found**: ${summary.total}
- **Critical**: ${summary.criticalCount}
- **High Priority**: ${summary.highCount}
- **Medium Priority**: ${summary.mediumCount}
- **Low Priority**: ${summary.lowCount}

### Issues by Type

`

        Object.entries(summary.byType).forEach(([type, count]) => {
            const displayType = type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            report += `- **${displayType}**: ${count}\n`
        })

        // Add severity sections
        const severityOrder = ['critical', 'high', 'medium', 'low']
        const severityEmojis = {
            critical: '🚨',
            high: '⚠️',
            medium: '📝',
            low: '💡'
        }

        for (const severity of severityOrder) {
            const severityFindings = this.findings.filter(f => f.severity === severity)
            if (severityFindings.length === 0) continue

            const emoji = severityEmojis[severity]
            const title = severity.charAt(0).toUpperCase() + severity.slice(1)
            
            report += `\n## ${emoji} ${title} Issues (${severityFindings.length})\n\n`

            // Group by document
            const byDocument = severityFindings.reduce((acc, finding) => {
                if (!acc[finding.document]) {
                    acc[finding.document] = []
                }
                acc[finding.document].push(finding)
                return acc
            }, {})

            Object.entries(byDocument).forEach(([document, findings]) => {
                report += `### ${document}\n\n`
                
                findings.forEach((finding, index) => {
                    report += `**${index + 1}. ${finding.issue}**\n`
                    report += `- **Line**: ${finding.line}\n`
                    report += `- **Type**: ${finding.type.replace(/-/g, ' ')}\n`
                    report += `- **Current**: \`${finding.current}\`\n`
                    report += `- **Expected**: \`${finding.expected}\`\n`
                    
                    if (finding.context) {
                        report += `- **Context**: \`${finding.context}\`\n`
                    }
                    
                    report += '\n'
                })
            })
        }

        // Add detailed findings section
        report += `\n## Detailed Findings\n\n`
        
        const byDocument = this.findings.reduce((acc, finding) => {
            if (!acc[finding.document]) {
                acc[finding.document] = []
            }
            acc[finding.document].push(finding)
            return acc
        }, {})

        Object.entries(byDocument).forEach(([document, findings]) => {
            report += `### ${document} (${findings.length} issues)\n\n`
            
            findings.sort((a, b) => a.line - b.line).forEach((finding, index) => {
                const severityIcon = severityEmojis[finding.severity]
                report += `${index + 1}. ${severityIcon} **Line ${finding.line}**: ${finding.issue}\n`
                report += `   - **Severity**: ${finding.severity}\n`
                report += `   - **Type**: ${finding.type.replace(/-/g, ' ')}\n`
                report += `   - **Current**: \`${finding.current}\`\n`
                report += `   - **Suggested**: \`${finding.expected}\`\n`
                
                if (finding.context) {
                    report += `   - **Context**: \`${finding.context}\`\n`
                }
                
                report += '\n'
            })
        })

        // Add recommendations
        report += `\n## Recommendations\n\n`
        
        if (summary.criticalCount > 0) {
            report += `### 🚨 Critical Issues (${summary.criticalCount})\n`
            report += `These issues prevent users from using the toolkit and must be fixed immediately.\n\n`
        }
        
        if (summary.highCount > 0) {
            report += `### ⚠️ High Priority Issues (${summary.highCount})\n`
            report += `These issues cause confusion or incorrect behavior and should be fixed soon.\n\n`
        }
        
        if (summary.mediumCount > 0) {
            report += `### 📝 Medium Priority Issues (${summary.mediumCount})\n`
            report += `These are inconsistencies and minor inaccuracies that should be addressed.\n\n`
        }
        
        if (summary.lowCount > 0) {
            report += `### 💡 Low Priority Issues (${summary.lowCount})\n`
            report += `These are style and formatting improvements that can be addressed when convenient.\n\n`
        }

        report += `\n## Next Steps\n\n`
        report += `1. Address critical issues first\n`
        report += `2. Fix high priority issues\n`
        report += `3. Review and fix medium priority issues\n`
        report += `4. Consider low priority improvements\n`
        report += `5. Re-run audit to verify fixes\n\n`
        
        report += `---\n`
        report += `*Report generated by CouchCMS AI Toolkit Documentation Auditor*\n`

        return report
    }

    /**
     * Generate JSON report
     */
    generateJsonReport() {
        const summary = this.generateSummary()
        
        return {
            timestamp: new Date().toISOString(),
            summary,
            findings: this.findings
        }
    }

    /**
     * Save report to file
     */
    async saveReport(format = 'markdown', outputPath = null) {
        const { writeFileSync } = await import('fs')
        
        let content
        let defaultPath
        
        if (format === 'json') {
            content = JSON.stringify(this.generateJsonReport(), null, 2)
            defaultPath = join(TOOLKIT_ROOT, 'docs-audit-report.json')
        } else {
            content = this.generateMarkdownReport()
            defaultPath = join(TOOLKIT_ROOT, 'docs-audit-report.md')
        }
        
        const filePath = outputPath || defaultPath
        writeFileSync(filePath, content, 'utf8')
        
        return filePath
    }
}

/**
 * Show help information
 */
function showHelp() {
    console.log(`
CouchCMS AI Toolkit - Documentation Audit Script

USAGE:
  bun scripts/audit-docs.js [OPTIONS]
  bun run audit:docs [OPTIONS]

OPTIONS:
  --report-only     Show only summary statistics
  --save            Save report to file
  --format=FORMAT   Output format: markdown (default) or json
  --output=PATH     Custom output file path
  --help            Show this help message

EXAMPLES:
  bun run audit:docs                           # Run audit and show full report
  bun run audit:docs --report-only            # Show only summary
  bun run audit:docs --save                   # Save markdown report to file
  bun run audit:docs --format=json --save     # Save JSON report to file
  bun run audit:docs --output=my-report.md    # Save to custom file

REPORT FILES:
  Markdown: docs-audit-report.md
  JSON:     docs-audit-report.json
`)
}

/**
 * Main execution
 */
async function main() {
    const args = process.argv.slice(2)
    
    if (args.includes('--help') || args.includes('-h')) {
        showHelp()
        process.exit(0)
    }
    
    const reportOnly = args.includes('--report-only')
    const format = args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'markdown'
    const outputPath = args.find(arg => arg.startsWith('--output='))?.split('=')[1]
    const saveReport = args.includes('--save') || outputPath
    
    const auditor = new DocumentationAuditor()
    const findings = await auditor.audit()
    
    const reportGenerator = new ReportGenerator(findings)
    
    if (format === 'json') {
        const jsonReport = reportGenerator.generateJsonReport()
        console.log(JSON.stringify(jsonReport, null, 2))
    } else {
        if (reportOnly) {
            // Just show summary
            const summary = reportGenerator.generateSummary()
            console.log('📊 Documentation Audit Summary:')
            console.log(`   Total issues: ${summary.total}`)
            console.log(`   Critical: ${summary.criticalCount}`)
            console.log(`   High: ${summary.highCount}`)
            console.log(`   Medium: ${summary.mediumCount}`)
            console.log(`   Low: ${summary.lowCount}`)
        } else {
            // Show full report
            const markdownReport = reportGenerator.generateMarkdownReport()
            console.log(markdownReport)
        }
    }
    
    if (saveReport) {
        const savedPath = await reportGenerator.saveReport(format, outputPath)
        console.log(`\n📄 Report saved to: ${relative(TOOLKIT_ROOT, savedPath)}`)
    }
    
    process.exit(findings.length > 0 ? 1 : 0)
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('❌ Audit error:', error.message)
        process.exit(1)
    })
}

export { DocumentationAuditor, ReportGenerator, FINDING_TYPES, SEVERITY_LEVELS }