#!/usr/bin/env node

/**
 * Audit script for documentation consistency
 * Checks terminology, internal links, and duplicate processes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Key concepts to track
const KEY_CONCEPTS = [
    'toolkit',
    'module',
    'agent',
    'sync',
    'standards.md',
    'configuration',
    'setup',
    'wizard',
    'generated files',
    'frontmatter',
    'preset',
    'framework',
    'AAPF',
    'skill rules',
    'auto-loading',
    'submodule',
    'project root',
    'workspace',
];

// Variations to look for
const TERMINOLOGY_PATTERNS = {
    toolkit: [
        /\btoolkit\b/gi,
        /\bai toolkit\b/gi,
        /\bcouchcms ai toolkit\b/gi,
        /\bthe toolkit\b/gi,
    ],
    module: [
        /\bmodule\b/gi,
        /\bknowledge module\b/gi,
        /\bskill module\b/gi,
        /\bmodules\b/gi,
    ],
    agent: [
        /\bagent\b/gi,
        /\bai agent\b/gi,
        /\bspecialized agent\b/gi,
        /\bagents\b/gi,
    ],
    sync: [
        /\bsync\b/gi,
        /\bsynchronize\b/gi,
        /\bsynchronization\b/gi,
        /\bgenerate\b/gi,
        /\bgeneration\b/gi,
    ],
    'standards.md': [
        /standards\.md/gi,
        /\bstandards file\b/gi,
        /\bconfiguration file\b/gi,
        /\bconfig file\b/gi,
    ],
    setup: [
        /\bsetup\b/gi,
        /\binitialization\b/gi,
        /\binit\b/gi,
        /\bconfiguration\b/gi,
    ],
    wizard: [
        /\bwizard\b/gi,
        /\bsetup wizard\b/gi,
        /\binteractive setup\b/gi,
        /\binteractive wizard\b/gi,
    ],
    'generated files': [
        /\bgenerated files\b/gi,
        /\bgenerated configs\b/gi,
        /\bgenerated configuration\b/gi,
        /\bauto-generated\b/gi,
    ],
};

// Path notation patterns
const PATH_PATTERNS = {
    withDotSlash: /\.\/[a-zA-Z0-9_\-\/\.]+/g,
    withoutDotSlash: /(?<![\.\/])[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-\/\.]+/g,
    absolute: /\/[a-zA-Z0-9_\-\/\.]+/g,
};

// Link pattern
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

// Process description patterns (numbered lists)
const PROCESS_PATTERN = /^(\d+\.|[-*])\s+(.+)$/gm;

class ConsistencyAuditor {
    constructor(docsDir) {
        this.docsDir = docsDir;
        this.findings = {
            terminology: {},
            links: [],
            paths: {},
            processes: {},
        };
    }

    async audit() {
        const files = this.getDocFiles(this.docsDir);
        
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            const relativePath = path.relative(this.docsDir, file);
            
            this.auditTerminology(content, relativePath);
            this.auditLinks(content, relativePath, file);
            this.auditPaths(content, relativePath);
            this.auditProcesses(content, relativePath);
        }
        
        return this.findings;
    }

    getDocFiles(dir) {
        const files = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...this.getDocFiles(fullPath));
            } else if (entry.name.endsWith('.md')) {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    auditTerminology(content, file) {
        for (const [concept, patterns] of Object.entries(TERMINOLOGY_PATTERNS)) {
            if (!this.findings.terminology[concept]) {
                this.findings.terminology[concept] = {};
            }
            
            for (const pattern of patterns) {
                const matches = content.match(pattern);
                if (matches) {
                    for (const match of matches) {
                        const normalized = match.toLowerCase().trim();
                        if (!this.findings.terminology[concept][normalized]) {
                            this.findings.terminology[concept][normalized] = [];
                        }
                        this.findings.terminology[concept][normalized].push(file);
                    }
                }
            }
        }
    }

    auditLinks(content, file, fullPath) {
        const matches = [...content.matchAll(LINK_PATTERN)];
        
        for (const match of matches) {
            const [fullMatch, text, link] = match;
            
            // Skip external links
            if (link.startsWith('http://') || link.startsWith('https://')) {
                continue;
            }
            
            // Parse link and anchor
            const [linkPath, anchor] = link.split('#');
            
            if (linkPath) {
                // Resolve relative path
                const dir = path.dirname(fullPath);
                const targetPath = path.resolve(dir, linkPath);
                const exists = fs.existsSync(targetPath);
                
                if (!exists) {
                    this.findings.links.push({
                        file,
                        link,
                        text,
                        issue: 'File does not exist',
                        targetPath,
                    });
                } else if (anchor) {
                    // Check if anchor exists in target file
                    const targetContent = fs.readFileSync(targetPath, 'utf-8');
                    const anchorExists = this.checkAnchor(targetContent, anchor);
                    
                    if (!anchorExists) {
                        this.findings.links.push({
                            file,
                            link,
                            text,
                            issue: 'Anchor does not exist',
                            anchor,
                        });
                    }
                }
            } else if (anchor) {
                // Same-file anchor
                const anchorExists = this.checkAnchor(content, anchor);
                if (!anchorExists) {
                    this.findings.links.push({
                        file,
                        link,
                        text,
                        issue: 'Anchor does not exist in same file',
                        anchor,
                    });
                }
            }
        }
    }

    checkAnchor(content, anchor) {
        // Convert anchor to heading format
        const headingPattern = new RegExp(`^#+\\s+.*${anchor.replace(/-/g, '[ -]')}`, 'im');
        return headingPattern.test(content);
    }

    auditPaths(content, file) {
        const withDot = content.match(PATH_PATTERNS.withDotSlash) || [];
        const withoutDot = content.match(PATH_PATTERNS.withoutDotSlash) || [];
        
        if (withDot.length > 0 || withoutDot.length > 0) {
            this.findings.paths[file] = {
                withDotSlash: withDot,
                withoutDotSlash: withoutDot,
                mixed: withDot.length > 0 && withoutDot.length > 0,
            };
        }
    }

    auditProcesses(content, file) {
        const lines = content.split('\n');
        const processes = [];
        let currentProcess = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const match = line.match(/^(\d+\.)\s+(.+)$/);
            
            if (match) {
                if (currentProcess) {
                    processes.push(currentProcess);
                }
                currentProcess = {
                    startLine: i + 1,
                    steps: [match[2].trim()],
                };
            } else if (currentProcess && line.match(/^(\d+\.)/)) {
                currentProcess.steps.push(line.trim());
            } else if (currentProcess && line.trim() === '') {
                processes.push(currentProcess);
                currentProcess = null;
            }
        }
        
        if (currentProcess) {
            processes.push(currentProcess);
        }
        
        if (processes.length > 0) {
            this.findings.processes[file] = processes;
        }
    }

    generateReport() {
        let report = '# Consistency Audit Report\n\n';
        report += `Generated: ${new Date().toISOString()}\n\n`;
        
        // Terminology findings
        report += '## Terminology Consistency\n\n';
        for (const [concept, variations] of Object.entries(this.findings.terminology)) {
            const variationCount = Object.keys(variations).length;
            if (variationCount > 1) {
                report += `### ${concept}\n\n`;
                report += `**Issue**: ${variationCount} different variations found\n\n`;
                
                for (const [variation, files] of Object.entries(variations)) {
                    report += `- \`${variation}\` (${files.length} occurrences in ${new Set(files).size} files)\n`;
                }
                report += '\n';
            }
        }
        
        // Link findings
        report += '## Internal Links\n\n';
        if (this.findings.links.length === 0) {
            report += '✅ All internal links are valid\n\n';
        } else {
            report += `**Issue**: ${this.findings.links.length} broken links found\n\n`;
            for (const link of this.findings.links) {
                report += `### ${link.file}\n\n`;
                report += `- Link: \`${link.link}\`\n`;
                report += `- Text: "${link.text}"\n`;
                report += `- Issue: ${link.issue}\n`;
                if (link.targetPath) {
                    report += `- Target: ${link.targetPath}\n`;
                }
                if (link.anchor) {
                    report += `- Anchor: #${link.anchor}\n`;
                }
                report += '\n';
            }
        }
        
        // Path notation findings
        report += '## Path Notation Consistency\n\n';
        const mixedFiles = Object.entries(this.findings.paths)
            .filter(([_, data]) => data.mixed);
        
        if (mixedFiles.length === 0) {
            report += '✅ Path notation is consistent within each file\n\n';
        } else {
            report += `**Issue**: ${mixedFiles.length} files use mixed path notation\n\n`;
            for (const [file, data] of mixedFiles) {
                report += `### ${file}\n\n`;
                report += `- With \`./\`: ${data.withDotSlash.length} occurrences\n`;
                report += `- Without \`./\`: ${data.withoutDotSlash.length} occurrences\n`;
                report += '\n';
            }
        }
        
        // Process findings
        report += '## Process Descriptions\n\n';
        const processFiles = Object.keys(this.findings.processes);
        report += `Found ${processFiles.length} files with numbered process descriptions\n\n`;
        
        // Look for duplicate processes
        const processSignatures = {};
        for (const [file, processes] of Object.entries(this.findings.processes)) {
            for (const process of processes) {
                const signature = process.steps.join('|').toLowerCase();
                if (!processSignatures[signature]) {
                    processSignatures[signature] = [];
                }
                processSignatures[signature].push({ file, process });
            }
        }
        
        const duplicates = Object.entries(processSignatures)
            .filter(([_, instances]) => instances.length > 1);
        
        if (duplicates.length === 0) {
            report += '✅ No duplicate process descriptions found\n\n';
        } else {
            report += `**Issue**: ${duplicates.length} potentially duplicate processes found\n\n`;
            for (const [signature, instances] of duplicates) {
                report += `### Process appears in ${instances.length} files:\n\n`;
                for (const { file, process } of instances) {
                    report += `- ${file} (line ${process.startLine})\n`;
                }
                report += '\nSteps:\n';
                for (let i = 0; i < instances[0].process.steps.length; i++) {
                    report += `${i + 1}. ${instances[0].process.steps[i]}\n`;
                }
                report += '\n';
            }
        }
        
        return report;
    }
}

// Main execution
const docsDir = path.join(__dirname, '../../../docs');
const auditor = new ConsistencyAuditor(docsDir);

console.log('Starting consistency audit...\n');

auditor.audit().then(() => {
    const report = auditor.generateReport();
    const outputPath = path.join(__dirname, 'findings-5-consistency.md');
    fs.writeFileSync(outputPath, report);
    console.log(`✅ Audit complete! Report saved to: ${outputPath}\n`);
    
    // Print summary
    const brokenLinks = auditor.findings.links.length;
    const mixedPaths = Object.values(auditor.findings.paths).filter(d => d.mixed).length;
    const terminologyIssues = Object.values(auditor.findings.terminology)
        .filter(v => Object.keys(v).length > 1).length;
    
    console.log('Summary:');
    console.log(`- Terminology inconsistencies: ${terminologyIssues}`);
    console.log(`- Broken links: ${brokenLinks}`);
    console.log(`- Files with mixed path notation: ${mixedPaths}`);
}).catch(err => {
    console.error('Error during audit:', err);
    process.exit(1);
});
