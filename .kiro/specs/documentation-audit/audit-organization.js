#!/usr/bin/env node

/**
 * Documentation Organization Audit Script
 * 
 * Audits documentation for:
 * - Comparison tables where multiple options exist
 * - Code block language specifiers
 * - Visual indicators in procedural sections
 * - Reference tables in guide documents
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Documentation files to audit
const DOCS_DIR = path.join(__dirname, '../../../docs');
const ROOT_DIR = path.join(__dirname, '../../..');

const findings = {
    comparisonTables: [],
    codeBlockFormatting: [],
    visualIndicators: [],
    referenceTables: []
};

/**
 * Read all documentation files
 */
function getDocFiles() {
    const files = [];
    const docFiles = fs.readdirSync(DOCS_DIR);
    
    for (const file of docFiles) {
        const filePath = path.join(DOCS_DIR, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile() && file.endsWith('.md')) {
            files.push({ path: filePath, name: file });
        }
    }
    
    // Also check root README and other root docs
    const rootDocs = ['README.md', 'AGENTS.md', 'CHANGELOG.md', 'CONTRIBUTING.md'];
    for (const file of rootDocs) {
        const filePath = path.join(ROOT_DIR, file);
        if (fs.existsSync(filePath)) {
            files.push({ path: filePath, name: file });
        }
    }
    
    return files;
}

/**
 * Check for comparison tables (8.1)
 */
function checkComparisonTables(content, filePath, fileName) {
    const lines = content.split('\n');
    let inSection = false;
    let sectionStart = 0;
    let sectionTitle = '';
    let optionCount = 0;
    let hasTable = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Detect sections with multiple options
        if (line.match(/^#{2,4}\s+/)) {
            // Check previous section
            if (inSection && optionCount > 2 && !hasTable) {
                findings.comparisonTables.push({
                    file: fileName,
                    line: sectionStart,
                    section: sectionTitle,
                    optionCount,
                    severity: 'medium',
                    message: `Section has ${optionCount} options but no comparison table`
                });
            }
            
            // Start new section
            inSection = true;
            sectionStart = i + 1;
            sectionTitle = line.replace(/^#{2,4}\s+/, '');
            optionCount = 0;
            hasTable = false;
        }
        
        // Count options (bullet points, numbered lists)
        if (line.match(/^[\s]*[-*]\s+\*\*/) || line.match(/^[\s]*\d+\.\s+\*\*/)) {
            optionCount++;
        }
        
        // Detect tables
        if (line.includes('|') && line.trim().startsWith('|')) {
            hasTable = true;
        }
        
        // Keywords suggesting multiple options
        if (line.match(/\b(options?|methods?|approaches?|ways?|modes?)\b/i)) {
            // Look ahead for list items
            let lookaheadOptions = 0;
            for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
                if (lines[j].match(/^[\s]*[-*]\s+/) || lines[j].match(/^[\s]*\d+\.\s+/)) {
                    lookaheadOptions++;
                }
            }
            if (lookaheadOptions > 2) {
                optionCount = Math.max(optionCount, lookaheadOptions);
            }
        }
    }
    
    // Check last section
    if (inSection && optionCount > 2 && !hasTable) {
        findings.comparisonTables.push({
            file: fileName,
            line: sectionStart,
            section: sectionTitle,
            optionCount,
            severity: 'medium',
            message: `Section has ${optionCount} options but no comparison table`
        });
    }
}

/**
 * Check code block formatting (8.2)
 */
function checkCodeBlockFormatting(content, filePath, fileName) {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockStart = 0;
    let hasLanguage = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.trim().startsWith('```')) {
            if (!inCodeBlock) {
                // Starting code block
                inCodeBlock = true;
                codeBlockStart = i + 1;
                
                // Check if language specifier exists
                const lang = line.trim().substring(3).trim();
                hasLanguage = lang.length > 0;
                
                if (!hasLanguage) {
                    findings.codeBlockFormatting.push({
                        file: fileName,
                        line: i + 1,
                        severity: 'low',
                        message: 'Code block missing language specifier',
                        context: line
                    });
                }
            } else {
                // Ending code block
                inCodeBlock = false;
            }
        }
    }
}

/**
 * Check visual indicators (8.3)
 */
function checkVisualIndicators(content, filePath, fileName) {
    const lines = content.split('\n');
    const visualIndicators = ['✅', '❌', '⚠️', '💡', '🚧', '📝', '⚡', '🔧'];
    
    let inProceduralSection = false;
    let proceduralStart = 0;
    let sectionTitle = '';
    let hasNumberedSteps = false;
    let hasVisualIndicators = false;
    let stepCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Detect section headers
        if (line.match(/^#{2,4}\s+/)) {
            // Check previous section
            if (inProceduralSection && hasNumberedSteps && stepCount >= 3 && !hasVisualIndicators) {
                findings.visualIndicators.push({
                    file: fileName,
                    line: proceduralStart,
                    section: sectionTitle,
                    stepCount,
                    severity: 'low',
                    message: `Procedural section with ${stepCount} steps lacks visual indicators`
                });
            }
            
            // Start new section
            inProceduralSection = false;
            proceduralStart = i + 1;
            sectionTitle = line.replace(/^#{2,4}\s+/, '');
            hasNumberedSteps = false;
            hasVisualIndicators = false;
            stepCount = 0;
        }
        
        // Detect numbered steps
        if (line.match(/^[\s]*\d+\.\s+/)) {
            inProceduralSection = true;
            hasNumberedSteps = true;
            stepCount++;
        }
        
        // Check for visual indicators
        for (const indicator of visualIndicators) {
            if (line.includes(indicator)) {
                hasVisualIndicators = true;
                break;
            }
        }
    }
    
    // Check last section
    if (inProceduralSection && hasNumberedSteps && stepCount >= 3 && !hasVisualIndicators) {
        findings.visualIndicators.push({
            file: fileName,
            line: proceduralStart,
            section: sectionTitle,
            stepCount,
            severity: 'low',
            message: `Procedural section with ${stepCount} steps lacks visual indicators`
        });
    }
}

/**
 * Check reference tables (8.4)
 */
function checkReferenceTables(content, filePath, fileName) {
    // Identify reference/guide documents
    const isReferenceDoc = fileName.match(/(REFERENCE|GUIDE|QUICK-REFERENCE)/i);
    
    if (!isReferenceDoc) {
        return;
    }
    
    const lines = content.split('\n');
    let hasTable = false;
    let tableCount = 0;
    
    for (const line of lines) {
        // Detect markdown tables
        if (line.includes('|') && line.trim().startsWith('|')) {
            if (!hasTable) {
                hasTable = true;
                tableCount++;
            }
        } else if (hasTable && !line.trim()) {
            hasTable = false;
        }
    }
    
    if (tableCount === 0) {
        findings.referenceTables.push({
            file: fileName,
            line: 1,
            severity: 'medium',
            message: 'Reference/guide document lacks summary tables'
        });
    }
}

/**
 * Generate findings report
 */
function generateReport() {
    let report = '# Documentation Organization Audit Findings\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;
    
    // Summary
    report += '## Summary\n\n';
    report += `- Comparison table issues: ${findings.comparisonTables.length}\n`;
    report += `- Code block formatting issues: ${findings.codeBlockFormatting.length}\n`;
    report += `- Visual indicator issues: ${findings.visualIndicators.length}\n`;
    report += `- Reference table issues: ${findings.referenceTables.length}\n`;
    report += `- **Total issues: ${findings.comparisonTables.length + findings.codeBlockFormatting.length + findings.visualIndicators.length + findings.referenceTables.length}**\n\n`;
    
    // Comparison Tables (8.1)
    report += '## 8.1 Comparison Tables\n\n';
    report += '**Requirement 9.2**: When documentation presents multiple options, comparison tables should be provided.\n\n';
    
    if (findings.comparisonTables.length === 0) {
        report += '✅ No issues found.\n\n';
    } else {
        report += `Found ${findings.comparisonTables.length} sections that could benefit from comparison tables:\n\n`;
        
        for (const finding of findings.comparisonTables) {
            report += `### ${finding.file} (Line ${finding.line})\n\n`;
            report += `- **Section**: ${finding.section}\n`;
            report += `- **Options**: ${finding.optionCount}\n`;
            report += `- **Issue**: ${finding.message}\n`;
            report += `- **Severity**: ${finding.severity}\n\n`;
        }
    }
    
    // Code Block Formatting (8.2)
    report += '## 8.2 Code Block Formatting\n\n';
    report += '**Requirement 10.3**: All code blocks must have language specifiers for syntax highlighting.\n\n';
    
    if (findings.codeBlockFormatting.length === 0) {
        report += '✅ No issues found.\n\n';
    } else {
        report += `Found ${findings.codeBlockFormatting.length} code blocks without language specifiers:\n\n`;
        
        // Group by file
        const byFile = {};
        for (const finding of findings.codeBlockFormatting) {
            if (!byFile[finding.file]) {
                byFile[finding.file] = [];
            }
            byFile[finding.file].push(finding);
        }
        
        for (const [file, fileFindings] of Object.entries(byFile)) {
            report += `### ${file}\n\n`;
            report += `Found ${fileFindings.length} code blocks without language specifiers:\n\n`;
            
            for (const finding of fileFindings) {
                report += `- Line ${finding.line}: \`${finding.context}\`\n`;
            }
            report += '\n';
        }
    }
    
    // Visual Indicators (8.3)
    report += '## 8.3 Visual Indicators\n\n';
    report += '**Requirement 10.4**: Procedural sections should use visual indicators (✅, ❌, ⚠️, 💡) to highlight important points.\n\n';
    
    if (findings.visualIndicators.length === 0) {
        report += '✅ No issues found.\n\n';
    } else {
        report += `Found ${findings.visualIndicators.length} procedural sections without visual indicators:\n\n`;
        
        for (const finding of findings.visualIndicators) {
            report += `### ${finding.file} (Line ${finding.line})\n\n`;
            report += `- **Section**: ${finding.section}\n`;
            report += `- **Steps**: ${finding.stepCount}\n`;
            report += `- **Issue**: ${finding.message}\n`;
            report += `- **Severity**: ${finding.severity}\n\n`;
        }
    }
    
    // Reference Tables (8.4)
    report += '## 8.4 Reference Tables\n\n';
    report += '**Requirement 10.5**: Reference and guide documents should include summary tables for quick lookup.\n\n';
    
    if (findings.referenceTables.length === 0) {
        report += '✅ No issues found.\n\n';
    } else {
        report += `Found ${findings.referenceTables.length} reference/guide documents without summary tables:\n\n`;
        
        for (const finding of findings.referenceTables) {
            report += `### ${finding.file}\n\n`;
            report += `- **Issue**: ${finding.message}\n`;
            report += `- **Severity**: ${finding.severity}\n\n`;
        }
    }
    
    return report;
}

/**
 * Main audit function
 */
function runAudit() {
    console.log('Starting documentation organization audit...\n');
    
    const docFiles = getDocFiles();
    console.log(`Found ${docFiles.length} documentation files to audit\n`);
    
    for (const { path: filePath, name: fileName } of docFiles) {
        console.log(`Auditing: ${fileName}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        checkComparisonTables(content, filePath, fileName);
        checkCodeBlockFormatting(content, filePath, fileName);
        checkVisualIndicators(content, filePath, fileName);
        checkReferenceTables(content, filePath, fileName);
    }
    
    console.log('\nGenerating report...\n');
    const report = generateReport();
    
    // Write report
    const reportPath = path.join(__dirname, 'findings-8-organization.md');
    fs.writeFileSync(reportPath, report);
    
    console.log(`Report written to: ${reportPath}`);
    console.log('\n=== Audit Summary ===');
    console.log(`Comparison table issues: ${findings.comparisonTables.length}`);
    console.log(`Code block formatting issues: ${findings.codeBlockFormatting.length}`);
    console.log(`Visual indicator issues: ${findings.visualIndicators.length}`);
    console.log(`Reference table issues: ${findings.referenceTables.length}`);
    console.log(`Total issues: ${findings.comparisonTables.length + findings.codeBlockFormatting.length + findings.visualIndicators.length + findings.referenceTables.length}`);
}

// Run the audit
runAudit();
