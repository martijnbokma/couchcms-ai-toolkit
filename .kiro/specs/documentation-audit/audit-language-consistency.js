#!/usr/bin/env node

/**
 * Language Consistency Audit Script
 * 
 * Audits documentation for English language consistency:
 * - Prose text language (headings, paragraphs, descriptions)
 * - Code comment language
 * - Identifier language (variable/function names)
 * - Error message language
 * 
 * Requirements: 11.1, 11.2, 11.4, 11.5
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOCS_DIR = path.join(__dirname, '../../../docs');
const ROOT_DOCS = path.join(__dirname, '../../..');
const OUTPUT_FILE = path.join(__dirname, 'findings-8a-language-consistency.md');

// Non-English character patterns
const NON_ENGLISH_PATTERNS = {
  // Common non-English characters
  cyrillic: /[\u0400-\u04FF]/,
  arabic: /[\u0600-\u06FF]/,
  chinese: /[\u4E00-\u9FFF]/,
  japanese: /[\u3040-\u309F\u30A0-\u30FF]/,
  korean: /[\uAC00-\uD7AF]/,
  greek: /[\u0370-\u03FF]/,
  hebrew: /[\u0590-\u05FF]/,
  thai: /[\u0E00-\u0E7F]/,
  devanagari: /[\u0900-\u097F]/,
  // European accented characters (common in non-English text)
  accented: /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i,
};

// Results storage
const results = {
  proseIssues: [],
  commentIssues: [],
  identifierIssues: [],
  errorMessageIssues: [],
  summary: {
    totalFiles: 0,
    filesWithIssues: 0,
    totalIssues: 0,
  }
};

/**
 * Check if text contains non-English characters
 */
function containsNonEnglish(text) {
  for (const [type, pattern] of Object.entries(NON_ENGLISH_PATTERNS)) {
    if (pattern.test(text)) {
      return { hasNonEnglish: true, type, match: text.match(pattern)[0] };
    }
  }
  return { hasNonEnglish: false };
}

/**
 * Extract code blocks from markdown
 */
function extractCodeBlocks(content) {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'unknown',
      code: match[2],
      start: match.index,
      fullMatch: match[0]
    });
  }
  
  return blocks;
}

/**
 * Extract inline code from markdown
 */
function extractInlineCode(content) {
  const inlineCodeRegex = /`([^`]+)`/g;
  const codes = [];
  let match;
  
  while ((match = inlineCodeRegex.exec(content)) !== null) {
    codes.push({
      code: match[1],
      start: match.index
    });
  }
  
  return codes;
}

/**
 * Remove code blocks and inline code from content
 */
function removeCodeFromContent(content) {
  // Remove code blocks
  let cleaned = content.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  cleaned = cleaned.replace(/`[^`]+`/g, '');
  return cleaned;
}

/**
 * Extract comments from code
 */
function extractComments(code, language) {
  const comments = [];
  
  // Single-line comments (// or #)
  const singleLineRegex = /(?:\/\/|#)\s*(.+)$/gm;
  let match;
  
  while ((match = singleLineRegex.exec(code)) !== null) {
    comments.push({
      type: 'single-line',
      text: match[1].trim(),
      line: code.substring(0, match.index).split('\n').length
    });
  }
  
  // Multi-line comments (/* */ or <!-- -->)
  const multiLineRegex = /(?:\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)/g;
  
  while ((match = multiLineRegex.exec(code)) !== null) {
    const text = match[0]
      .replace(/^\/\*|\*\/$/g, '')
      .replace(/^<!--|-->$/g, '')
      .trim();
    comments.push({
      type: 'multi-line',
      text,
      line: code.substring(0, match.index).split('\n').length
    });
  }
  
  return comments;
}

/**
 * Extract identifiers from code
 */
function extractIdentifiers(code, language) {
  const identifiers = [];
  
  // Variable declarations
  const varPatterns = [
    /(?:const|let|var|function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g,
    /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
  ];
  
  for (const pattern of varPatterns) {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      const identifier = match[1];
      // Skip common English words and single letters
      if (identifier.length > 1 && !isCommonEnglishWord(identifier)) {
        identifiers.push({
          name: identifier,
          line: code.substring(0, match.index).split('\n').length
        });
      }
    }
  }
  
  return identifiers;
}

/**
 * Check if identifier uses English words
 */
function isCommonEnglishWord(word) {
  const commonWords = [
    'const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while',
    'return', 'import', 'export', 'from', 'default', 'async', 'await', 'try',
    'catch', 'throw', 'new', 'this', 'super', 'extends', 'implements'
  ];
  return commonWords.includes(word.toLowerCase());
}

/**
 * Extract quoted strings (potential error messages)
 */
function extractQuotedStrings(code) {
  const strings = [];
  const stringRegex = /(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g;
  let match;
  
  while ((match = stringRegex.exec(code)) !== null) {
    const text = match[2];
    // Only check strings that look like error messages or user-facing text
    if (text.length > 10 && (
      text.toLowerCase().includes('error') ||
      text.toLowerCase().includes('warning') ||
      text.toLowerCase().includes('failed') ||
      text.toLowerCase().includes('invalid') ||
      text.toLowerCase().includes('cannot') ||
      text.toLowerCase().includes('must')
    )) {
      strings.push({
        text,
        line: code.substring(0, match.index).split('\n').length
      });
    }
  }
  
  return strings;
}

/**
 * Get line number from position in content
 */
function getLineNumber(content, position) {
  return content.substring(0, position).split('\n').length;
}

/**
 * Audit a single file
 */
function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(ROOT_DOCS, filePath);
  const fileIssues = {
    prose: [],
    comments: [],
    identifiers: [],
    errorMessages: []
  };
  
  // 1. Check prose text (excluding code)
  const proseContent = removeCodeFromContent(content);
  const lines = proseContent.split('\n');
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    // Skip empty lines and lines that are just markdown syntax
    if (trimmed && trimmed.length > 3 && !/^[#\-*>|]+$/.test(trimmed)) {
      const check = containsNonEnglish(trimmed);
      if (check.hasNonEnglish) {
        fileIssues.prose.push({
          line: index + 1,
          text: trimmed.substring(0, 100),
          type: check.type,
          character: check.match
        });
      }
    }
  });
  
  // 2. Check code comments
  const codeBlocks = extractCodeBlocks(content);
  codeBlocks.forEach(block => {
    const comments = extractComments(block.code, block.language);
    comments.forEach(comment => {
      const check = containsNonEnglish(comment.text);
      if (check.hasNonEnglish) {
        fileIssues.comments.push({
          line: getLineNumber(content, block.start) + comment.line,
          text: comment.text.substring(0, 100),
          type: check.type,
          character: check.match,
          language: block.language
        });
      }
    });
  });
  
  // 3. Check identifiers
  codeBlocks.forEach(block => {
    const identifiers = extractIdentifiers(block.code, block.language);
    identifiers.forEach(identifier => {
      const check = containsNonEnglish(identifier.name);
      if (check.hasNonEnglish) {
        fileIssues.identifiers.push({
          line: getLineNumber(content, block.start) + identifier.line,
          name: identifier.name,
          type: check.type,
          character: check.match,
          language: block.language
        });
      }
    });
  });
  
  // 4. Check error messages
  codeBlocks.forEach(block => {
    const strings = extractQuotedStrings(block.code);
    strings.forEach(string => {
      const check = containsNonEnglish(string.text);
      if (check.hasNonEnglish) {
        fileIssues.errorMessages.push({
          line: getLineNumber(content, block.start) + string.line,
          text: string.text.substring(0, 100),
          type: check.type,
          character: check.match,
          language: block.language
        });
      }
    });
  });
  
  // Add to results if any issues found
  const totalFileIssues = 
    fileIssues.prose.length +
    fileIssues.comments.length +
    fileIssues.identifiers.length +
    fileIssues.errorMessages.length;
  
  if (totalFileIssues > 0) {
    results.summary.filesWithIssues++;
    results.summary.totalIssues += totalFileIssues;
    
    if (fileIssues.prose.length > 0) {
      results.proseIssues.push({ file: relativePath, issues: fileIssues.prose });
    }
    if (fileIssues.comments.length > 0) {
      results.commentIssues.push({ file: relativePath, issues: fileIssues.comments });
    }
    if (fileIssues.identifiers.length > 0) {
      results.identifierIssues.push({ file: relativePath, issues: fileIssues.identifiers });
    }
    if (fileIssues.errorMessages.length > 0) {
      results.errorMessageIssues.push({ file: relativePath, issues: fileIssues.errorMessages });
    }
  }
}

/**
 * Get all markdown files recursively
 */
function getMarkdownFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Generate report
 */
function generateReport() {
  let report = `# Language Consistency Audit Report

**Date:** ${new Date().toISOString().split('T')[0]}  
**Requirements:** 11.1, 11.2, 11.4, 11.5

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Files Audited** | ${results.summary.totalFiles} |
| **Files with Issues** | ${results.summary.filesWithIssues} |
| **Total Issues Found** | ${results.summary.totalIssues} |
| **Prose Issues** | ${results.proseIssues.reduce((sum, f) => sum + f.issues.length, 0)} |
| **Comment Issues** | ${results.commentIssues.reduce((sum, f) => sum + f.issues.length, 0)} |
| **Identifier Issues** | ${results.identifierIssues.reduce((sum, f) => sum + f.issues.length, 0)} |
| **Error Message Issues** | ${results.errorMessageIssues.reduce((sum, f) => sum + f.issues.length, 0)} |

`;

  if (results.summary.totalIssues === 0) {
    report += `\n✅ **All documentation is in English!** No language consistency issues found.\n\n`;
    report += `All prose text, code comments, identifiers, and error messages use English language.\n`;
    return report;
  }

  report += `\n---\n\n`;

  // Prose issues
  if (results.proseIssues.length > 0) {
    report += `## Prose Text Issues (Requirement 11.1)\n\n`;
    report += `**Total:** ${results.proseIssues.reduce((sum, f) => sum + f.issues.length, 0)} issues in ${results.proseIssues.length} files\n\n`;
    
    results.proseIssues.forEach(({ file, issues }) => {
      report += `### ${file}\n\n`;
      issues.forEach(issue => {
        report += `**Line ${issue.line}:** Non-English ${issue.type} character \`${issue.character}\` found\n`;
        report += `\`\`\`\n${issue.text}\n\`\`\`\n\n`;
      });
    });
  }

  // Comment issues
  if (results.commentIssues.length > 0) {
    report += `## Code Comment Issues (Requirement 11.2)\n\n`;
    report += `**Total:** ${results.commentIssues.reduce((sum, f) => sum + f.issues.length, 0)} issues in ${results.commentIssues.length} files\n\n`;
    
    results.commentIssues.forEach(({ file, issues }) => {
      report += `### ${file}\n\n`;
      issues.forEach(issue => {
        report += `**Line ${issue.line}** (${issue.language}): Non-English ${issue.type} character \`${issue.character}\` found\n`;
        report += `\`\`\`\n${issue.text}\n\`\`\`\n\n`;
      });
    });
  }

  // Identifier issues
  if (results.identifierIssues.length > 0) {
    report += `## Identifier Issues (Requirement 11.4)\n\n`;
    report += `**Total:** ${results.identifierIssues.reduce((sum, f) => sum + f.issues.length, 0)} issues in ${results.identifierIssues.length} files\n\n`;
    
    results.identifierIssues.forEach(({ file, issues }) => {
      report += `### ${file}\n\n`;
      issues.forEach(issue => {
        report += `**Line ${issue.line}** (${issue.language}): Non-English ${issue.type} character \`${issue.character}\` in identifier \`${issue.name}\`\n\n`;
      });
    });
  }

  // Error message issues
  if (results.errorMessageIssues.length > 0) {
    report += `## Error Message Issues (Requirement 11.5)\n\n`;
    report += `**Total:** ${results.errorMessageIssues.reduce((sum, f) => sum + f.issues.length, 0)} issues in ${results.errorMessageIssues.length} files\n\n`;
    
    results.errorMessageIssues.forEach(({ file, issues }) => {
      report += `### ${file}\n\n`;
      issues.forEach(issue => {
        report += `**Line ${issue.line}** (${issue.language}): Non-English ${issue.type} character \`${issue.character}\` found\n`;
        report += `\`\`\`\n${issue.text}\n\`\`\`\n\n`;
      });
    });
  }

  report += `---\n\n## Recommendations\n\n`;
  
  if (results.proseIssues.length > 0) {
    report += `1. **Translate prose text to English** - ${results.proseIssues.reduce((sum, f) => sum + f.issues.length, 0)} instances found\n`;
  }
  if (results.commentIssues.length > 0) {
    report += `2. **Translate code comments to English** - ${results.commentIssues.reduce((sum, f) => sum + f.issues.length, 0)} instances found\n`;
  }
  if (results.identifierIssues.length > 0) {
    report += `3. **Rename identifiers to use English words** - ${results.identifierIssues.reduce((sum, f) => sum + f.issues.length, 0)} instances found\n`;
  }
  if (results.errorMessageIssues.length > 0) {
    report += `4. **Translate error messages to English** - ${results.errorMessageIssues.reduce((sum, f) => sum + f.issues.length, 0)} instances found\n`;
  }

  return report;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Starting language consistency audit...\n');
  
  // Get all markdown files
  const docsFiles = getMarkdownFiles(DOCS_DIR);
  const rootFiles = [
    'README.md',
    'AGENTS.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'CLAUDE.md',
    'standards.md'
  ].map(f => path.join(ROOT_DOCS, f)).filter(f => fs.existsSync(f));
  
  const allFiles = [...docsFiles, ...rootFiles];
  results.summary.totalFiles = allFiles.length;
  
  console.log(`📄 Found ${allFiles.length} markdown files to audit\n`);
  
  // Audit each file
  allFiles.forEach((file, index) => {
    const relativePath = path.relative(ROOT_DOCS, file);
    process.stdout.write(`\r[${index + 1}/${allFiles.length}] Auditing: ${relativePath}${' '.repeat(50)}`);
    auditFile(file);
  });
  
  console.log('\n\n✅ Audit complete!\n');
  
  // Generate report
  const report = generateReport();
  fs.writeFileSync(OUTPUT_FILE, report);
  
  console.log(`📊 Report saved to: ${path.relative(ROOT_DOCS, OUTPUT_FILE)}\n`);
  console.log('Summary:');
  console.log(`  Total files: ${results.summary.totalFiles}`);
  console.log(`  Files with issues: ${results.summary.filesWithIssues}`);
  console.log(`  Total issues: ${results.summary.totalIssues}`);
  
  if (results.summary.totalIssues === 0) {
    console.log('\n✅ All documentation is in English!');
  } else {
    console.log(`\n⚠️  Found ${results.summary.totalIssues} language consistency issues`);
  }
}

main();
