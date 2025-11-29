#!/usr/bin/env node

/**
 * Add visual indicators to procedural sections in documentation
 * Validates: Requirements 10.4
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '../../..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

// Files to check (docs + root level docs)
const filesToCheck = [
    path.join(ROOT_DIR, 'README.md'),
    path.join(ROOT_DIR, 'CONTRIBUTING.md'),
];

// Add all docs files
const docsFiles = fs.readdirSync(DOCS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(DOCS_DIR, f));

filesToCheck.push(...docsFiles);

const findings = [];
let addedCount = 0;

/**
 * Detect if a line is a procedural step (numbered list item)
 */
function isProceduralStep(line) {
    return /^\d+\.\s+/.test(line.trim());
}

/**
 * Check if line already has a visual indicator
 */
function hasVisualIndicator(line) {
    return /[✅❌⚠️💡🔍📝🚀⚙️]/.test(line);
}

/**
 * Determine appropriate indicator based on content
 */
function getIndicator(line) {
    const lower = line.toLowerCase();
    
    // Success/completion indicators
    if (/\b(success|complete|done|finish|verify|confirm)\b/.test(lower)) {
        return '✅';
    }
    
    // Warning indicators
    if (/\b(warning|caution|careful|important|note|attention)\b/.test(lower)) {
        return '⚠️';
    }
    
    // Error/failure indicators
    if (/\b(error|fail|wrong|incorrect|avoid|don't|never)\b/.test(lower)) {
        return '❌';
    }
    
    // Tip/info indicators
    if (/\b(tip|hint|suggestion|recommend|best practice|pro tip)\b/.test(lower)) {
        return '💡';
    }
    
    // Search/find indicators
    if (/\b(find|search|locate|look for|check)\b/.test(lower)) {
        return '🔍';
    }
    
    // Configuration/setup indicators
    if (/\b(configure|setup|install|initialize|create)\b/.test(lower)) {
        return '⚙️';
    }
    
    // Run/execute indicators
    if (/\b(run|execute|start|launch)\b/.test(lower)) {
        return '🚀';
    }
    
    // Default for procedural steps
    return '📝';
}

/**
 * Process a single file
 */
function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative(ROOT_DIR, filePath);
    
    let modified = false;
    let inProceduralSection = false;
    let consecutiveSteps = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (isProceduralStep(line)) {
            consecutiveSteps++;
            inProceduralSection = consecutiveSteps >= 2; // At least 2 consecutive steps
            
            // Add indicator if missing and we're in a procedural section
            if (inProceduralSection && !hasVisualIndicator(line)) {
                const indicator = getIndicator(line);
                const match = line.match(/^(\s*)(\d+\.\s+)(.*)/);
                if (match) {
                    const [, indent, number, rest] = match;
                    lines[i] = `${indent}${number}${indicator} ${rest}`;
                    modified = true;
                    addedCount++;
                    
                    findings.push({
                        file: relativePath,
                        line: i + 1,
                        indicator,
                        original: line.trim()
                    });
                }
            }
        } else if (line.trim() === '' || line.startsWith('#')) {
            // Reset on empty line or heading
            consecutiveSteps = 0;
            inProceduralSection = false;
        } else if (!line.startsWith(' ') && !line.startsWith('\t')) {
            // Reset on non-indented content
            consecutiveSteps = 0;
        }
    }
    
    // Write back if modified
    if (modified) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
        console.log(`✅ Enhanced: ${relativePath}`);
    }
}

// Process all files
console.log('🔍 Scanning for procedural sections without visual indicators...\n');

for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
        processFile(file);
    }
}

// Generate report
console.log('\n📊 Summary:');
console.log(`   Visual indicators added: ${addedCount}`);
console.log(`   Files checked: ${filesToCheck.filter(f => fs.existsSync(f)).length}`);

if (findings.length > 0) {
    console.log('\n📝 Sample additions (first 10):');
    findings.slice(0, 10).forEach(f => {
        console.log(`   ${f.indicator} ${f.file}:${f.line}`);
    });
    
    if (findings.length > 10) {
        console.log(`   ... and ${findings.length - 10} more`);
    }
}

// Save report
const report = {
    timestamp: new Date().toISOString(),
    addedCount,
    filesChecked: filesToCheck.filter(f => fs.existsSync(f)).length,
    findings
};

fs.writeFileSync(
    path.join(__dirname, 'visual-indicators.json'),
    JSON.stringify(report, null, 2)
);

console.log('\n✅ Report saved to visual-indicators.json');
