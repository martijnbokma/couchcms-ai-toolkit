#!/usr/bin/env node

/**
 * Add comparison tables to multi-option sections in documentation
 * Validates: Requirements 9.2
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '../../..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

// Files to check
const filesToCheck = [
    path.join(ROOT_DIR, 'README.md'),
    path.join(DOCS_DIR, 'SETUP-COMPARISON.md'),
    path.join(DOCS_DIR, 'INSTALLATION-METHODS.md'),
    path.join(DOCS_DIR, 'EDITOR-SUPPORT.md'),
    path.join(DOCS_DIR, 'GETTING-STARTED.md'),
    path.join(DOCS_DIR, 'MIGRATION.md'),
];

const findings = [];
let tablesAdded = 0;

/**
 * Analyze content for sections that need comparison tables
 */
function analyzeForComparisonTables(content, filePath) {
    const lines = content.split('\n');
    const relativePath = path.relative(ROOT_DIR, filePath);
    const suggestions = [];
    
    // Look for sections with multiple options/methods/approaches
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for headings that suggest comparisons
        if (line.startsWith('##') || line.startsWith('###')) {
            const heading = line.toLowerCase();
            
            // Keywords that suggest comparison sections
            if (/\b(methods?|options?|approaches?|ways?|modes?|types?|vs|versus|comparison|choose|choosing)\b/.test(heading)) {
                // Look ahead to see if there's already a table
                let hasTable = false;
                let optionCount = 0;
                
                for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
                    if (lines[j].includes('|')) {
                        hasTable = true;
                        break;
                    }
                    if (lines[j].startsWith('##')) break; // Next section
                    
                    // Count bullet points or numbered items as options
                    if (/^[-*]\s+\*\*/.test(lines[j].trim()) || /^\d+\.\s+\*\*/.test(lines[j].trim())) {
                        optionCount++;
                    }
                }
                
                if (!hasTable && optionCount >= 2) {
                    suggestions.push({
                        file: relativePath,
                        line: i + 1,
                        heading: line.trim(),
                        optionCount,
                        reason: 'Multiple options without comparison table'
                    });
                }
            }
        }
    }
    
    return suggestions;
}

/**
 * Add specific comparison tables based on known sections
 */
function addComparisonTables(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(ROOT_DIR, filePath);
    let modified = false;
    
    // SETUP-COMPARISON.md - ensure it has proper comparison tables
    if (relativePath === 'docs/SETUP-COMPARISON.md') {
        // This file should already have comparison tables, just verify
        if (!content.includes('| Feature |') && !content.includes('| Method |')) {
            findings.push({
                file: relativePath,
                type: 'needs-table',
                section: 'Setup methods comparison'
            });
        }
    }
    
    // INSTALLATION-METHODS.md - add comparison if missing
    if (relativePath === 'docs/INSTALLATION-METHODS.md') {
        if (!content.includes('| Method |') && !content.includes('| Installation Type |')) {
            const tableSection = `

## Installation Methods Comparison

| Method | Best For | Complexity | Update Process |
|--------|----------|------------|----------------|
| **Git Submodule** | Production projects, version control | Medium | \`git submodule update\` |
| **Direct Clone** | Quick testing, development | Low | Manual \`git pull\` |
| **Private Repository** | Private/commercial projects | Medium | Same as submodule |
| **Manual Download** | No git access | Low | Manual re-download |

`;
            
            // Find a good place to insert (after introduction, before first method)
            const lines = content.split('\n');
            let insertIndex = -1;
            
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('## Method 1:') || lines[i].startsWith('## 1.')) {
                    insertIndex = i;
                    break;
                }
            }
            
            if (insertIndex > 0) {
                lines.splice(insertIndex, 0, tableSection);
                fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
                modified = true;
                tablesAdded++;
                
                findings.push({
                    file: relativePath,
                    type: 'added-table',
                    section: 'Installation methods comparison'
                });
            }
        }
    }
    
    // EDITOR-SUPPORT.md - add editor comparison if missing
    if (relativePath === 'docs/EDITOR-SUPPORT.md') {
        if (!content.includes('| Editor |') && !content.includes('| IDE |')) {
            const tableSection = `

## Editor Support Comparison

| Editor | Auto-sync | Manual Sync | Config Location | Best For |
|--------|-----------|-------------|-----------------|----------|
| **Cursor** | ✅ Yes | ✅ Yes | \`.cursorrules\`, \`.cursor/\` | Full-featured AI coding |
| **Claude Code** | ✅ Yes | ✅ Yes | \`.claude/\` | Claude-specific features |
| **GitHub Copilot** | ✅ Yes | ✅ Yes | \`.github/copilot-instructions.md\` | GitHub integration |
| **Windsurf** | ✅ Yes | ✅ Yes | \`.windsurf/\` | Windsurf-specific features |
| **Kiro** | ✅ Yes | ✅ Yes | \`.kiro/steering/\` | Kiro-specific features |

`;
            
            // Insert after the main heading
            const lines = content.split('\n');
            let insertIndex = -1;
            
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('# ') && i < 10) {
                    // Find next section
                    for (let j = i + 1; j < lines.length; j++) {
                        if (lines[j].startsWith('## ')) {
                            insertIndex = j;
                            break;
                        }
                    }
                    break;
                }
            }
            
            if (insertIndex > 0) {
                lines.splice(insertIndex, 0, tableSection);
                fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
                modified = true;
                tablesAdded++;
                
                findings.push({
                    file: relativePath,
                    type: 'added-table',
                    section: 'Editor support comparison'
                });
            }
        }
    }
    
    return modified;
}

// Process all files
console.log('🔍 Analyzing documentation for comparison table opportunities...\n');

for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
        // First analyze for suggestions
        const content = fs.readFileSync(file, 'utf-8');
        const suggestions = analyzeForComparisonTables(content, file);
        findings.push(...suggestions);
        
        // Then add tables where appropriate
        const modified = addComparisonTables(file);
        if (modified) {
            console.log(`✅ Enhanced: ${path.relative(ROOT_DIR, file)}`);
        }
    }
}

// Generate report
console.log('\n📊 Summary:');
console.log(`   Comparison tables added: ${tablesAdded}`);
console.log(`   Files checked: ${filesToCheck.filter(f => fs.existsSync(f)).length}`);
console.log(`   Suggestions for manual review: ${findings.filter(f => f.type !== 'added-table').length}`);

if (findings.length > 0) {
    console.log('\n📝 Findings:');
    findings.forEach(f => {
        if (f.type === 'added-table') {
            console.log(`   ✅ ${f.file} - Added: ${f.section}`);
        } else if (f.reason) {
            console.log(`   💡 ${f.file}:${f.line} - ${f.heading}`);
            console.log(`      Reason: ${f.reason} (${f.optionCount} options found)`);
        }
    });
}

// Save report
const report = {
    timestamp: new Date().toISOString(),
    tablesAdded,
    filesChecked: filesToCheck.filter(f => fs.existsSync(f)).length,
    findings
};

fs.writeFileSync(
    path.join(__dirname, 'comparison-tables.json'),
    JSON.stringify(report, null, 2)
);

console.log('\n✅ Report saved to comparison-tables.json');
console.log('\n💡 Note: Some sections may benefit from manual table creation based on suggestions above.');
