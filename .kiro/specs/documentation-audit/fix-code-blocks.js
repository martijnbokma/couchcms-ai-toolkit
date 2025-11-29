#!/usr/bin/env node

/**
 * Fix missing code block language specifiers in documentation
 * Validates: Requirements 10.3
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
    path.join(ROOT_DIR, 'CHANGELOG.md'),
];

// Add all docs files
const docsFiles = fs.readdirSync(DOCS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(DOCS_DIR, f));

filesToCheck.push(...docsFiles);

const findings = [];
let fixedCount = 0;

/**
 * Detect language from code content
 */
function detectLanguage(code) {
    const trimmed = code.trim();
    
    // Shell commands
    if (/^(bun|npm|npx|git|cd|mkdir|cp|mv|rm|ls|cat|echo|export)\s/.test(trimmed)) {
        return 'bash';
    }
    
    // YAML frontmatter or config
    if (/^---\s*$/.test(trimmed) || /^[a-zA-Z_]+:\s*/.test(trimmed)) {
        return 'yaml';
    }
    
    // JSON
    if (/^\{[\s\S]*\}$/.test(trimmed) || /^\[[\s\S]*\]$/.test(trimmed)) {
        return 'json';
    }
    
    // JavaScript/TypeScript
    if (/^(import|export|const|let|var|function|class|interface|type)\s/.test(trimmed)) {
        return 'javascript';
    }
    
    // PHP
    if (/^<\?php/.test(trimmed) || /<cms:/.test(trimmed)) {
        return 'php';
    }
    
    // HTML
    if (/^<!DOCTYPE|^<html|^<div|^<section/.test(trimmed)) {
        return 'html';
    }
    
    // CSS
    if (/^[.#]?[a-zA-Z-]+\s*\{/.test(trimmed)) {
        return 'css';
    }
    
    // Markdown
    if (/^#\s+/.test(trimmed) || /^\*\*/.test(trimmed)) {
        return 'markdown';
    }
    
    // Default to text for short snippets or unclear content
    return 'text';
}

/**
 * Process a single file
 */
function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative(ROOT_DIR, filePath);
    
    let modified = false;
    let inCodeBlock = false;
    let codeBlockStart = -1;
    let codeBlockContent = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for code block start
        if (line.startsWith('```')) {
            if (!inCodeBlock) {
                // Starting a code block
                inCodeBlock = true;
                codeBlockStart = i;
                codeBlockContent = [];
                
                // Check if it has a language specifier
                const lang = line.substring(3).trim();
                if (!lang) {
                    // No language specifier - we'll need to detect it
                    findings.push({
                        file: relativePath,
                        line: i + 1,
                        type: 'missing-language',
                        current: line
                    });
                }
            } else {
                // Ending a code block
                if (codeBlockStart >= 0 && !lines[codeBlockStart].substring(3).trim()) {
                    // This block had no language specifier
                    const detectedLang = detectLanguage(codeBlockContent.join('\n'));
                    lines[codeBlockStart] = '```' + detectedLang;
                    modified = true;
                    fixedCount++;
                    
                    findings[findings.length - 1].fixed = true;
                    findings[findings.length - 1].detected = detectedLang;
                }
                
                inCodeBlock = false;
                codeBlockStart = -1;
                codeBlockContent = [];
            }
        } else if (inCodeBlock) {
            codeBlockContent.push(line);
        }
    }
    
    // Write back if modified
    if (modified) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
        console.log(`✅ Fixed: ${relativePath}`);
    }
}

// Process all files
console.log('🔍 Scanning for code blocks without language specifiers...\n');

for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
        processFile(file);
    }
}

// Generate report
console.log('\n📊 Summary:');
console.log(`   Total code blocks fixed: ${fixedCount}`);
console.log(`   Files checked: ${filesToCheck.filter(f => fs.existsSync(f)).length}`);

if (findings.length > 0) {
    console.log('\n📝 Detailed findings:');
    findings.forEach(f => {
        if (f.fixed) {
            console.log(`   ✅ ${f.file}:${f.line} - Added '${f.detected}' language specifier`);
        } else {
            console.log(`   ⚠️  ${f.file}:${f.line} - Could not auto-detect language`);
        }
    });
}

// Save report
const report = {
    timestamp: new Date().toISOString(),
    fixedCount,
    filesChecked: filesToCheck.filter(f => fs.existsSync(f)).length,
    findings
};

fs.writeFileSync(
    path.join(__dirname, 'code-block-fixes.json'),
    JSON.stringify(report, null, 2)
);

console.log('\n✅ Report saved to code-block-fixes.json');
