#!/usr/bin/env node

/**
 * Add summary tables to reference documentation
 * Validates: Requirements 10.5
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '../../..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

// Reference/guide documents that should have summary tables
const referenceFiles = [
    path.join(DOCS_DIR, 'QUICK-REFERENCE.md'),
    path.join(DOCS_DIR, 'MODULES.md'),
    path.join(DOCS_DIR, 'AGENTS.md'),
    path.join(DOCS_DIR, 'COMMANDS.md'),
    path.join(DOCS_DIR, 'EDITOR-QUICK-REFERENCE.md'),
];

const findings = [];
let tablesAdded = 0;

/**
 * Check if file already has summary tables
 */
function hasSummaryTable(content) {
    // Look for table markers
    const hasTable = /\|.*\|.*\|/.test(content);
    const hasMultipleTables = (content.match(/\|.*\|.*\|/g) || []).length > 3;
    
    return hasTable && hasMultipleTables;
}

/**
 * Add summary tables to specific reference files
 */
function addSummaryTables(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(ROOT_DIR, filePath);
    let modified = false;
    
    // QUICK-REFERENCE.md - ensure it has command summary
    if (relativePath === 'docs/QUICK-REFERENCE.md') {
        if (!content.includes('| Command | Purpose |') && !content.includes('| Script | Description |')) {
            const summaryTable = `

## Quick Command Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| \`bun install\` | Install dependencies | After cloning repository |
| \`bun scripts/create-standards.js\` | Simple setup wizard | First-time setup (beginners) |
| \`bun scripts/init.js\` | Advanced setup wizard | Custom configuration needed |
| \`bun scripts/sync.js\` | Generate AI configs | After modifying standards.md |
| \`bun scripts/validate.js\` | Validate configuration | Check for errors |
| \`bun run update\` | Check for updates | Weekly maintenance |
| \`bun run update:apply\` | Apply updates automatically | When updates available |

`;
            
            // Insert after main heading
            const lines = content.split('\n');
            let insertIndex = -1;
            
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('# ') && i < 10) {
                    insertIndex = i + 1;
                    // Skip any existing content until first ## heading
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
                lines.splice(insertIndex, 0, summaryTable);
                fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
                modified = true;
                tablesAdded++;
                
                findings.push({
                    file: relativePath,
                    type: 'added-table',
                    section: 'Quick command reference'
                });
            }
        }
    }
    
    // MODULES.md - check for module summary table
    if (relativePath === 'docs/MODULES.md') {
        if (!hasSummaryTable(content)) {
            findings.push({
                file: relativePath,
                type: 'needs-review',
                reason: 'Should have comprehensive module summary table at the top'
            });
        }
    }
    
    // AGENTS.md - check for agent summary table
    if (relativePath === 'docs/AGENTS.md') {
        if (!hasSummaryTable(content)) {
            findings.push({
                file: relativePath,
                type: 'needs-review',
                reason: 'Should have comprehensive agent summary table at the top'
            });
        }
    }
    
    // COMMANDS.md - check for command summary
    if (relativePath === 'docs/COMMANDS.md') {
        if (!content.includes('| Command | Description |') && !content.includes('| Name | Purpose |')) {
            findings.push({
                file: relativePath,
                type: 'needs-review',
                reason: 'Should have command summary table'
            });
        }
    }
    
    // EDITOR-QUICK-REFERENCE.md - check for editor comparison
    if (relativePath === 'docs/EDITOR-QUICK-REFERENCE.md') {
        if (!content.includes('| Editor |')) {
            const summaryTable = `

## Editor Support Summary

| Editor | Config Files | Auto-sync | Manual Sync | Best For |
|--------|--------------|-----------|-------------|----------|
| **Cursor** | \`.cursorrules\`, \`.cursor/rules/\` | ✅ | ✅ | Full-featured AI coding |
| **Claude Code** | \`.claude/skills/\`, \`.claude/settings.json\` | ✅ | ✅ | Claude-specific features |
| **GitHub Copilot** | \`.github/copilot-instructions.md\` | ✅ | ✅ | GitHub integration |
| **Windsurf** | \`.windsurf/rules.md\` | ✅ | ✅ | Windsurf-specific features |
| **Kiro** | \`.kiro/steering/\` | ✅ | ✅ | Kiro-specific features |

`;
            
            // Insert after main heading
            const lines = content.split('\n');
            let insertIndex = -1;
            
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('# ') && i < 10) {
                    insertIndex = i + 1;
                    // Skip any existing content until first ## heading
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
                lines.splice(insertIndex, 0, summaryTable);
                fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
                modified = true;
                tablesAdded++;
                
                findings.push({
                    file: relativePath,
                    type: 'added-table',
                    section: 'Editor support summary'
                });
            }
        }
    }
    
    return modified;
}

// Process all files
console.log('🔍 Analyzing reference documents for summary tables...\n');

for (const file of referenceFiles) {
    if (fs.existsSync(file)) {
        const modified = addSummaryTables(file);
        if (modified) {
            console.log(`✅ Enhanced: ${path.relative(ROOT_DIR, file)}`);
        }
    }
}

// Generate report
console.log('\n📊 Summary:');
console.log(`   Summary tables added: ${tablesAdded}`);
console.log(`   Files checked: ${referenceFiles.filter(f => fs.existsSync(f)).length}`);
console.log(`   Files needing manual review: ${findings.filter(f => f.type === 'needs-review').length}`);

if (findings.length > 0) {
    console.log('\n📝 Findings:');
    findings.forEach(f => {
        if (f.type === 'added-table') {
            console.log(`   ✅ ${f.file} - Added: ${f.section}`);
        } else if (f.type === 'needs-review') {
            console.log(`   💡 ${f.file}`);
            console.log(`      ${f.reason}`);
        }
    });
}

// Save report
const report = {
    timestamp: new Date().toISOString(),
    tablesAdded,
    filesChecked: referenceFiles.filter(f => fs.existsSync(f)).length,
    findings
};

fs.writeFileSync(
    path.join(__dirname, 'summary-tables.json'),
    JSON.stringify(report, null, 2)
);

console.log('\n✅ Report saved to summary-tables.json');
console.log('\n💡 Note: Some reference documents may need manual table creation for comprehensive summaries.');
