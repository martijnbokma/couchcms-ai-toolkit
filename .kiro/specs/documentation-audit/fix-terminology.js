#!/usr/bin/env bun

/**
 * Terminology Standardization Script
 * 
 * Systematically updates documentation to use consistent terminology
 * based on audit findings and requirements.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');

// Terminology replacements (context-aware)
const REPLACEMENTS = [
    // "ai agent" → "agent" (but not in formal names)
    {
        pattern: /\bai agents?\b/gi,
        replacement: (match) => match.toLowerCase().replace('ai ', ''),
        description: 'Remove "ai" prefix from agent references',
        contextCheck: (line) => !line.includes('AI Agent') && !line.includes('Autonomous Agent')
    },
    
    // "the ai toolkit" → "the toolkit"
    {
        pattern: /\bthe ai toolkit\b/gi,
        replacement: 'the toolkit',
        description: 'Simplify "the ai toolkit" to "the toolkit"'
    },
    
    // "couchcms ai toolkit" → "toolkit" (in casual references)
    {
        pattern: /\bcouchcms ai toolkit\b/gi,
        replacement: 'toolkit',
        description: 'Simplify "couchcms ai toolkit" to "toolkit"',
        contextCheck: (line) => !line.includes('#') && !line.includes('**') // Not in headings or bold
    },
    
    // "config file" → "configuration file" or "standards.md"
    {
        pattern: /\bconfig file\b/gi,
        replacement: 'configuration file',
        description: 'Use "configuration file" instead of "config file"'
    },
    
    // "initialization" → "setup" (except in technical contexts)
    {
        pattern: /\binitialization\b/gi,
        replacement: 'setup',
        description: 'Use "setup" instead of "initialization"',
        contextCheck: (line) => !line.includes('init.js') && !line.includes('initialize')
    },
    
    // "generation" → "sync" (when referring to file generation)
    {
        pattern: /\bgeneration\b/gi,
        replacement: 'sync',
        description: 'Use "sync" instead of "generation"',
        contextCheck: (line) => line.includes('file') || line.includes('config')
    },
    
    // "generate" → "sync" (when referring to config generation)
    {
        pattern: /\bgenerate configs?\b/gi,
        replacement: (match) => match.toLowerCase().includes('configs') ? 'sync configs' : 'sync config',
        description: 'Use "sync" instead of "generate" for configs'
    }
];

// Statistics
const stats = {
    filesProcessed: 0,
    filesModified: 0,
    totalReplacements: 0,
    replacementsByType: {}
};

/**
 * Process a single file
 */
function processFile(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let modified = false;
    let fileReplacements = 0;
    
    const newLines = lines.map((line, index) => {
        let newLine = line;
        
        for (const rule of REPLACEMENTS) {
            // Check context if needed
            if (rule.contextCheck && !rule.contextCheck(line)) {
                continue;
            }
            
            // Apply replacement
            const before = newLine;
            if (typeof rule.replacement === 'function') {
                newLine = newLine.replace(rule.pattern, rule.replacement);
            } else {
                newLine = newLine.replace(rule.pattern, rule.replacement);
            }
            
            // Track changes
            if (before !== newLine) {
                modified = true;
                fileReplacements++;
                stats.replacementsByType[rule.description] = (stats.replacementsByType[rule.description] || 0) + 1;
                
                if (DRY_RUN) {
                    console.log(`  Line ${index + 1}:`);
                    console.log(`    Before: ${before.trim()}`);
                    console.log(`    After:  ${newLine.trim()}`);
                }
            }
        }
        
        return newLine;
    });
    
    stats.filesProcessed++;
    
    if (modified) {
        stats.filesModified++;
        stats.totalReplacements += fileReplacements;
        
        if (!DRY_RUN) {
            writeFileSync(filePath, newLines.join('\n'), 'utf-8');
            console.log(`✓ Updated ${filePath} (${fileReplacements} changes)`);
        } else {
            console.log(`\n📝 Would update ${filePath} (${fileReplacements} changes)`);
        }
    }
}

/**
 * Process all markdown files in a directory
 */
function processDirectory(dirPath) {
    const entries = readdirSync(dirPath);
    
    for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Skip node_modules, .git, etc.
            if (!entry.startsWith('.') && entry !== 'node_modules') {
                processDirectory(fullPath);
            }
        } else if (entry.endsWith('.md')) {
            processFile(fullPath);
        }
    }
}

/**
 * Main execution
 */
function main() {
    console.log('🔍 Terminology Standardization Script\n');
    
    if (DRY_RUN) {
        console.log('🔬 DRY RUN MODE - No files will be modified\n');
    }
    
    // Process documentation
    const docsPath = join(process.cwd(), 'docs');
    const rootPath = process.cwd();
    
    console.log('Processing documentation files...\n');
    processDirectory(docsPath);
    
    // Process root markdown files
    console.log('\nProcessing root markdown files...\n');
    const rootFiles = ['README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'standards.md'];
    for (const file of rootFiles) {
        const filePath = join(rootPath, file);
        try {
            processFile(filePath);
        } catch (err) {
            // File might not exist, skip
        }
    }
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary');
    console.log('='.repeat(60));
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`Files modified: ${stats.filesModified}`);
    console.log(`Total replacements: ${stats.totalReplacements}`);
    console.log('\nReplacements by type:');
    for (const [type, count] of Object.entries(stats.replacementsByType)) {
        console.log(`  - ${type}: ${count}`);
    }
    
    if (DRY_RUN) {
        console.log('\n💡 Run without --dry-run to apply changes');
    } else {
        console.log('\n✅ All changes applied successfully!');
    }
}

main();
