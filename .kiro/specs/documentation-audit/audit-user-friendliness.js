#!/usr/bin/env node

/**
 * Documentation User-Friendliness Audit Script
 * 
 * This script audits documentation for:
 * - Code example validity and completeness
 * - Procedural documentation clarity
 * - Path notation consistency
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOCS_DIR = path.join(__dirname, '../../../docs');
const ROOT_DIR = path.join(__dirname, '../../..');
const OUTPUT_DIR = __dirname;

// Findings storage
const findings = {
    codeExamples: [],
    proceduralDocs: [],
    pathNotation: []
};

/**
 * Extract code blocks from markdown content
 */
function extractCodeBlocks(content, filePath) {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const blocks = [];
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
        const language = match[1] || 'none';
        const code = match[2];
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        blocks.push({
            language,
            code,
            lineNumber,
            filePath,
            hasLanguage: language !== 'none' && language !== ''
        });
    }
    
    return blocks;
}

/**
 * Validate shell commands in code blocks
 */
function validateShellCommands(codeBlock) {
    const issues = [];
    const lines = codeBlock.code.split('\n');
    
    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        
        // Skip comments and empty lines
        if (trimmed.startsWith('#') || trimmed === '') return;
        
        // Check for common shell command issues
        if (trimmed.includes('&&') && !trimmed.includes('\\')) {
            // Multi-command on one line without continuation
            if (trimmed.split('&&').length > 2) {
                issues.push({
                    line: idx + 1,
                    issue: 'Complex multi-command line',
                    suggestion: 'Break into separate commands for clarity'
                });
            }
        }
        
        // Check for incomplete commands
        if (trimmed.endsWith('\\') && idx === lines.length - 1) {
            issues.push({
                line: idx + 1,
                issue: 'Command ends with continuation character',
                suggestion: 'Complete the command or remove \\'
            });
        }
        
        // Check for missing error handling in critical commands
        if (trimmed.startsWith('rm -rf') || trimmed.startsWith('git push')) {
            const hasErrorCheck = lines.slice(idx + 1).some(l => 
                l.includes('||') || l.includes('if') || l.includes('&&')
            );
            if (!hasErrorCheck && idx < lines.length - 1) {
                issues.push({
                    line: idx + 1,
                    issue: 'Destructive command without error handling',
                    suggestion: 'Consider adding error handling or confirmation'
                });
            }
        }
    });
    
    return issues;
}

/**
 * Check if code examples are complete and runnable
 */
function checkCodeExampleCompleteness(codeBlock) {
    const issues = [];
    
    // Check for placeholder text
    const placeholders = [
        /\[your-.*?\]/gi,
        /\{your-.*?\}/gi,
        /<your-.*?>/gi,
        /YOUR_.*?/g,
        /\.\.\./g
    ];
    
    placeholders.forEach(pattern => {
        const matches = codeBlock.code.match(pattern);
        if (matches) {
            issues.push({
                issue: 'Contains placeholder text',
                examples: matches.slice(0, 3),
                suggestion: 'Provide concrete examples or clearly mark as placeholders'
            });
        }
    });
    
    // Check for incomplete examples (ends with ...)
    if (codeBlock.code.trim().endsWith('...')) {
        issues.push({
            issue: 'Example appears incomplete (ends with ...)',
            suggestion: 'Complete the example or add comment explaining truncation'
        });
    }
    
    // Check for missing context in shell commands
    if (codeBlock.language === 'bash' || codeBlock.language === 'sh') {
        const hasComment = codeBlock.code.includes('#');
        const lines = codeBlock.code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
        
        if (lines.length > 3 && !hasComment) {
            issues.push({
                issue: 'Complex shell example without explanatory comments',
                suggestion: 'Add comments to explain what each section does'
            });
        }
    }
    
    return issues;
}

/**
 * Extract and analyze procedural documentation
 */
function analyzeProcedures(content, filePath) {
    const procedures = [];
    const lines = content.split('\n');
    
    let inProcedure = false;
    let currentProcedure = null;
    
    lines.forEach((line, idx) => {
        // Detect start of procedure (heading followed by numbered list)
        if (line.match(/^#{2,4}\s+/)) {
            if (currentProcedure) {
                procedures.push(currentProcedure);
            }
            currentProcedure = {
                title: line.replace(/^#{2,4}\s+/, ''),
                lineNumber: idx + 1,
                steps: [],
                hasNumberedList: false,
                hasActionVerbs: true,
                filePath
            };
            inProcedure = true;
        }
        
        // Detect numbered list items
        if (inProcedure && line.match(/^\d+\.\s+/)) {
            currentProcedure.hasNumberedList = true;
            const step = line.replace(/^\d+\.\s+/, '');
            currentProcedure.steps.push({
                text: step,
                lineNumber: idx + 1
            });
            
            // Check for action verbs
            const actionVerbs = ['install', 'run', 'create', 'add', 'remove', 'update', 
                               'configure', 'set', 'open', 'close', 'start', 'stop',
                               'clone', 'commit', 'push', 'pull', 'checkout'];
            const hasActionVerb = actionVerbs.some(verb => 
                step.toLowerCase().startsWith(verb) || 
                step.toLowerCase().includes(` ${verb} `)
            );
            
            if (!hasActionVerb && step.length > 10) {
                currentProcedure.hasActionVerbs = false;
            }
        }
        
        // End procedure on next heading or significant gap
        if (inProcedure && (line.match(/^#{1,4}\s+/) || (line.trim() === '' && idx > 0))) {
            if (currentProcedure && currentProcedure.steps.length >= 2) {
                procedures.push(currentProcedure);
                currentProcedure = null;
                inProcedure = false;
            }
        }
    });
    
    // Add last procedure if exists
    if (currentProcedure && currentProcedure.steps.length >= 2) {
        procedures.push(currentProcedure);
    }
    
    return procedures;
}

/**
 * Extract and analyze path references
 */
function extractPathReferences(content, filePath) {
    const paths = [];
    const pathPatterns = [
        // Inline code paths
        /`([\.\/~]?[\w\-\/\.]+\.(md|js|json|yaml|sh|ts|php|html|css))`/g,
        // Directory paths
        /`([\.\/~]?[\w\-\/]+\/)`/g,
        // Paths in text
        /\b([\.\/~][\w\-\/\.]+)\b/g
    ];
    
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
        pathPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(line)) !== null) {
                const pathStr = match[1];
                
                // Skip URLs and email addresses
                if (pathStr.includes('://') || pathStr.includes('@')) continue;
                
                // Skip very short matches
                if (pathStr.length < 3) continue;
                
                paths.push({
                    path: pathStr,
                    lineNumber: idx + 1,
                    filePath,
                    notation: pathStr.startsWith('./') ? 'relative-explicit' :
                             pathStr.startsWith('/') ? 'absolute' :
                             pathStr.startsWith('~') ? 'home' :
                             'relative-implicit'
                });
            }
        });
    });
    
    return paths;
}

/**
 * Analyze path notation consistency
 */
function analyzePathConsistency(allPaths) {
    const notationCounts = {
        'relative-explicit': 0,
        'relative-implicit': 0,
        'absolute': 0,
        'home': 0
    };
    
    const pathsByNotation = {
        'relative-explicit': [],
        'relative-implicit': [],
        'absolute': [],
        'home': []
    };
    
    allPaths.forEach(pathRef => {
        notationCounts[pathRef.notation]++;
        pathsByNotation[pathRef.notation].push(pathRef);
    });
    
    // Determine predominant notation
    const predominant = Object.entries(notationCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
    
    // Find inconsistencies
    const inconsistencies = [];
    
    // Group paths by base path to find same location with different notation
    const pathGroups = {};
    allPaths.forEach(pathRef => {
        const normalized = pathRef.path
            .replace(/^\.\//, '')
            .replace(/^\//, '')
            .replace(/^~\//, '');
        
        if (!pathGroups[normalized]) {
            pathGroups[normalized] = [];
        }
        pathGroups[normalized].push(pathRef);
    });
    
    // Find paths referenced with multiple notations
    Object.entries(pathGroups).forEach(([normalized, refs]) => {
        const notations = new Set(refs.map(r => r.notation));
        if (notations.size > 1) {
            inconsistencies.push({
                path: normalized,
                notations: Array.from(notations),
                occurrences: refs
            });
        }
    });
    
    return {
        notationCounts,
        predominant,
        inconsistencies,
        pathsByNotation
    };
}

/**
 * Process a single documentation file
 */
function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(ROOT_DIR, filePath);
    
    console.log(`Processing: ${relativePath}`);
    
    // Task 4.1: Check code examples
    const codeBlocks = extractCodeBlocks(content, relativePath);
    codeBlocks.forEach(block => {
        // Check for language specifier
        if (!block.hasLanguage) {
            findings.codeExamples.push({
                file: relativePath,
                line: block.lineNumber,
                severity: 'low',
                issue: 'Code block missing language specifier',
                suggestion: 'Add language identifier (bash, javascript, yaml, etc.)'
            });
        }
        
        // Validate shell commands
        if (block.language === 'bash' || block.language === 'sh') {
            const shellIssues = validateShellCommands(block);
            shellIssues.forEach(issue => {
                findings.codeExamples.push({
                    file: relativePath,
                    line: block.lineNumber + issue.line,
                    severity: 'medium',
                    issue: issue.issue,
                    suggestion: issue.suggestion
                });
            });
        }
        
        // Check completeness
        const completenessIssues = checkCodeExampleCompleteness(block);
        completenessIssues.forEach(issue => {
            findings.codeExamples.push({
                file: relativePath,
                line: block.lineNumber,
                severity: 'medium',
                issue: issue.issue,
                examples: issue.examples,
                suggestion: issue.suggestion
            });
        });
    });
    
    // Task 4.2: Check procedural documentation
    const procedures = analyzeProcedures(content, relativePath);
    procedures.forEach(proc => {
        if (!proc.hasNumberedList && proc.steps.length >= 3) {
            findings.proceduralDocs.push({
                file: relativePath,
                line: proc.lineNumber,
                severity: 'medium',
                issue: `Multi-step procedure "${proc.title}" not using numbered list`,
                suggestion: 'Convert to numbered list for clarity',
                steps: proc.steps.length
            });
        }
        
        if (!proc.hasActionVerbs) {
            findings.proceduralDocs.push({
                file: relativePath,
                line: proc.lineNumber,
                severity: 'low',
                issue: `Procedure "${proc.title}" steps lack clear action verbs`,
                suggestion: 'Start steps with action verbs (Install, Run, Create, etc.)'
            });
        }
    });
    
    // Task 4.3: Extract path references
    const paths = extractPathReferences(content, relativePath);
    return paths;
}

/**
 * Main audit function
 */
function runAudit() {
    console.log('Starting user-friendliness audit...\n');
    
    // Get all markdown files
    const files = [];
    
    function scanDirectory(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        entries.forEach(entry => {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && !entry.name.startsWith('.')) {
                scanDirectory(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                files.push(fullPath);
            }
        });
    }
    
    // Scan docs directory
    scanDirectory(DOCS_DIR);
    
    // Add root README
    files.push(path.join(ROOT_DIR, 'README.md'));
    
    // Process all files
    const allPaths = [];
    files.forEach(file => {
        const paths = processFile(file);
        allPaths.push(...paths);
    });
    
    // Task 4.3: Analyze path consistency
    const pathAnalysis = analyzePathConsistency(allPaths);
    
    // Report path inconsistencies
    pathAnalysis.inconsistencies.forEach(inconsistency => {
        findings.pathNotation.push({
            severity: 'medium',
            issue: `Path "${inconsistency.path}" referenced with multiple notations`,
            notations: inconsistency.notations,
            occurrences: inconsistency.occurrences.map(o => ({
                file: o.filePath,
                line: o.lineNumber,
                notation: o.notation
            }))
        });
    });
    
    // Generate reports
    generateReports(pathAnalysis);
    
    console.log('\n✅ Audit complete!');
    console.log(`\nFindings written to:`);
    console.log(`  - findings-4.1-code-examples.md`);
    console.log(`  - findings-4.2-procedural-docs.md`);
    console.log(`  - findings-4.3-path-notation.md`);
}

/**
 * Generate markdown reports
 */
function generateReports(pathAnalysis) {
    // Report 4.1: Code Examples
    let report41 = `# Task 4.1: Code Examples Audit\n\n`;
    report41 += `**Date:** ${new Date().toISOString().split('T')[0]}\n\n`;
    report41 += `## Summary\n\n`;
    report41 += `- Total issues found: ${findings.codeExamples.length}\n`;
    report41 += `- Critical: ${findings.codeExamples.filter(f => f.severity === 'critical').length}\n`;
    report41 += `- High: ${findings.codeExamples.filter(f => f.severity === 'high').length}\n`;
    report41 += `- Medium: ${findings.codeExamples.filter(f => f.severity === 'medium').length}\n`;
    report41 += `- Low: ${findings.codeExamples.filter(f => f.severity === 'low').length}\n\n`;
    
    report41 += `## Findings\n\n`;
    
    const byFile = {};
    findings.codeExamples.forEach(finding => {
        if (!byFile[finding.file]) byFile[finding.file] = [];
        byFile[finding.file].push(finding);
    });
    
    Object.entries(byFile).forEach(([file, fileFindings]) => {
        report41 += `### ${file}\n\n`;
        fileFindings.forEach(finding => {
            report41 += `**Line ${finding.line}** - ${finding.severity.toUpperCase()}\n`;
            report41 += `- Issue: ${finding.issue}\n`;
            report41 += `- Suggestion: ${finding.suggestion}\n`;
            if (finding.examples) {
                report41 += `- Examples: ${finding.examples.join(', ')}\n`;
            }
            report41 += `\n`;
        });
    });
    
    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'findings-4.1-code-examples.md'),
        report41
    );
    
    // Report 4.2: Procedural Documentation
    let report42 = `# Task 4.2: Procedural Documentation Audit\n\n`;
    report42 += `**Date:** ${new Date().toISOString().split('T')[0]}\n\n`;
    report42 += `## Summary\n\n`;
    report42 += `- Total issues found: ${findings.proceduralDocs.length}\n`;
    report42 += `- Medium: ${findings.proceduralDocs.filter(f => f.severity === 'medium').length}\n`;
    report42 += `- Low: ${findings.proceduralDocs.filter(f => f.severity === 'low').length}\n\n`;
    
    report42 += `## Findings\n\n`;
    
    const byFile42 = {};
    findings.proceduralDocs.forEach(finding => {
        if (!byFile42[finding.file]) byFile42[finding.file] = [];
        byFile42[finding.file].push(finding);
    });
    
    Object.entries(byFile42).forEach(([file, fileFindings]) => {
        report42 += `### ${file}\n\n`;
        fileFindings.forEach(finding => {
            report42 += `**Line ${finding.line}** - ${finding.severity.toUpperCase()}\n`;
            report42 += `- Issue: ${finding.issue}\n`;
            report42 += `- Suggestion: ${finding.suggestion}\n`;
            if (finding.steps) {
                report42 += `- Steps count: ${finding.steps}\n`;
            }
            report42 += `\n`;
        });
    });
    
    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'findings-4.2-procedural-docs.md'),
        report42
    );
    
    // Report 4.3: Path Notation
    let report43 = `# Task 4.3: Path Notation Consistency Audit\n\n`;
    report43 += `**Date:** ${new Date().toISOString().split('T')[0]}\n\n`;
    report43 += `## Summary\n\n`;
    report43 += `- Total path references: ${Object.values(pathAnalysis.notationCounts).reduce((a, b) => a + b, 0)}\n`;
    report43 += `- Inconsistencies found: ${findings.pathNotation.length}\n\n`;
    
    report43 += `## Notation Distribution\n\n`;
    report43 += `| Notation | Count | Percentage |\n`;
    report43 += `|----------|-------|------------|\n`;
    const total = Object.values(pathAnalysis.notationCounts).reduce((a, b) => a + b, 0);
    Object.entries(pathAnalysis.notationCounts).forEach(([notation, count]) => {
        const pct = ((count / total) * 100).toFixed(1);
        report43 += `| ${notation} | ${count} | ${pct}% |\n`;
    });
    report43 += `\n`;
    
    report43 += `**Predominant notation:** ${pathAnalysis.predominant}\n\n`;
    report43 += `**Recommendation:** Standardize on \`${pathAnalysis.predominant}\` notation for consistency.\n\n`;
    
    report43 += `## Inconsistencies\n\n`;
    
    if (findings.pathNotation.length === 0) {
        report43 += `✅ No path notation inconsistencies found!\n\n`;
    } else {
        findings.pathNotation.forEach((finding, idx) => {
            report43 += `### ${idx + 1}. ${finding.issue}\n\n`;
            report43 += `**Notations used:** ${finding.notations.join(', ')}\n\n`;
            report43 += `**Occurrences:**\n\n`;
            finding.occurrences.forEach(occ => {
                report43 += `- ${occ.file}:${occ.line} (${occ.notation})\n`;
            });
            report43 += `\n`;
        });
    }
    
    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'findings-4.3-path-notation.md'),
        report43
    );
}

// Run the audit
runAudit();
