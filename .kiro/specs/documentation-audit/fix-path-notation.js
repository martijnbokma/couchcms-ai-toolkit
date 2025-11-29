#!/usr/bin/env bun

/**
 * Path Notation Standardization Script
 * 
 * Removes ./ prefix from relative paths in documentation
 * to standardize on relative-implicit notation.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');

// Paths to standardize (remove ./ prefix)
const PATH_PATTERNS = [
    // Common file paths (in code blocks and inline code)
    { pattern: /`\.\/standards\.md`/g, replacement: '`standards.md`' },
    { pattern: /`\.\/AGENTS\.md`/g, replacement: '`AGENTS.md`' },
    { pattern: /`\.\/CHANGELOG\.md`/g, replacement: '`CHANGELOG.md`' },
    { pattern: /`\.\/package\.json`/g, replacement: '`package.json`' },
    { pattern: /`\.\/README\.md`/g, replacement: '`README.md`' },
    
    // Script paths
    { pattern: /`\.\/scripts\/sync\.js`/g, replacement: '`scripts/sync.js`' },
    { pattern: /`\.\/scripts\/init\.js`/g, replacement: '`scripts/init.js`' },
    { pattern: /`\.\/scripts\/validate\.js`/g, replacement: '`scripts/validate.js`' },
    { pattern: /`\.\/scripts\/extend-modules\.js`/g, replacement: '`scripts/extend-modules.js`' },
    { pattern: /`\.\/scripts\/health\.js`/g, replacement: '`scripts/health.js`' },
    { pattern: /`\.\/scripts\/browse\.js`/g, replacement: '`scripts/browse.js`' },
    { pattern: /`\.\/scripts\/migrate\.js`/g, replacement: '`scripts/migrate.js`' },
    { pattern: /`\.\/scripts\/create-standards\.js`/g, replacement: '`scripts/create-standards.js`' },
    
    // Directory paths
    { pattern: /`\.\/docs\//g, replacement: '`docs/' },
    { pattern: /`\.\/modules\//g, replacement: '`modules/' },
    { pattern: /`\.\/agents\//g, replacement: '`agents/' },
    { pattern: /`\.\/templates\//g, replacement: '`templates/' },
    { pattern: /`\.\/rules\//g, replacement: '`rules/' },
    { pattern: /`\.\/framework\//g, replacement: '`framework/' },
    
    // Generated files (keep leading dot)
    { pattern: /`\.\/\.cursorrules`/g, replacement: '`.cursorrules`' },
    { pattern: /`\.\/\.claude\//g, replacement: '`.claude/' },
    { pattern: /`\.\/\.cursor\//g, replacement: '`.cursor/' },
    { pattern: /`\.\/\.github\//g, replacement: '`.github/' },
    { pattern: /`\.\/\.windsurf\//g, replacement: '`.windsurf/' },
    { pattern: /`\.\/\.kiro\//g, replacement: '`.kiro/' },
    { pattern: /`\.\/\.project\//g, replacement: '`.project/' },
    
    // Toolkit path
    { pattern: /`\.\/ai-toolkit-shared\//g, replacement: '`ai-toolkit-shared/' },
    { pattern: /`\.\/ai-toolkit-shared`/g, replacement: '`ai-toolkit-shared`' },
    
    // Markdown links
    { pattern: /\]\(\.\/([^)]+)\)/g, replacement: ']($1)' },
    
    // Prose references (without backticks) - be more careful
    { pattern: /\s\.\/standards\.md\s/g, replacement: ' standards.md ' },
    { pattern: /\s\.\/AGENTS\.md\s/g, replacement: ' AGENTS.md ' },
];

// Exceptions - contexts where ./ should be kept
const EXCEPTIONS = [
    /toolkit:\s*["']\.\//, // YAML config: toolkit: "./ai-toolkit-shared"
    /path:\s*["']\.\//, // Config paths
    /\$\{.*\.\//, // Variable interpolation
    /cd\s+\.\//, // cd commands
];

// Statistics
const stats = {
    filesProcessed: 0,
    filesModified: 0,
    totalReplacements: 0,
    replacementsByPattern: {}
};

/**
 * Check if line should be excluded from replacement
 */
function shouldExclude(line) {
    return EXCEPTIONS.some(pattern => pattern.test(line));
}

/**
 * Process a single file
 */
function processFile(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let modified = false;
    let fileReplacements = 0;
    
    const newLines = lines.map((line, index) => {
        // Skip lines that match exceptions
        if (shouldExclude(line)) {
            return line;
        }
        
        let newLine = line;
        
        for (const rule of PATH_PATTERNS) {
            const before = newLine;
            newLine = newLine.replace(rule.pattern, rule.replacement);
            
            if (before !== newLine) {
                modified = true;
                fileReplacements++;
                const patternKey = rule.pattern.toString();
                stats.replacementsByPattern[patternKey] = (stats.replacementsByPattern[patternKey] || 0) + 1;
                
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
    console.log('🔍 Path Notation Standardization Script\n');
    
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
    
    if (DRY_RUN) {
        console.log('\n💡 Run without --dry-run to apply changes');
    } else {
        console.log('\n✅ All changes applied successfully!');
    }
}

main();
