#!/usr/bin/env bun

/**
 * Improve Procedural Documentation Script
 * 
 * This script improves procedural documentation by:
 * 1. Converting prose to numbered lists where appropriate
 * 2. Using clear action verbs
 * 3. Making step-by-step processes more scannable
 * 
 * Requirements: 3.3 - Multi-step processes should use numbered lists with clear action verbs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DOCS_DIR = 'docs';
const ROOT_FILES = ['README.md'];

// Track changes made
const changes = [];

/**
 * Patterns to identify procedural content that should be converted to numbered lists
 */
const proceduralPatterns = [
  // Installation steps
  {
    pattern: /First,?\s+(.+?)\.\s+Then,?\s+(.+?)\.\s+Finally,?\s+(.+?)\./gi,
    replacement: (match, step1, step2, step3) => {
      return `1. ${capitalizeFirst(step1)}\n2. ${capitalizeFirst(step2)}\n3. ${capitalizeFirst(step3)}`;
    },
    description: 'Convert first/then/finally sequences to numbered lists'
  },
  
  // Next step patterns
  {
    pattern: /After (.+?),\s+(.+?)\.\s+Next,?\s+(.+?)\./gi,
    replacement: (match, step1, step2, step3) => {
      return `1. ${capitalizeFirst(step1)}\n2. ${capitalizeFirst(step2)}\n3. ${capitalizeFirst(step3)}`;
    },
    description: 'Convert after/next sequences to numbered lists'
  },
  
  // Step by step patterns
  {
    pattern: /To (.+?),\s+first\s+(.+?)\.\s+Then\s+(.+?)\./gi,
    replacement: (match, goal, step1, step2) => {
      return `To ${goal}:\n\n1. ${capitalizeFirst(step1)}\n2. ${capitalizeFirst(step2)}`;
    },
    description: 'Convert "to do X, first Y, then Z" to numbered lists'
  }
];

/**
 * Action verb improvements - replace weak verbs with strong action verbs
 */
const actionVerbImprovements = {
  // Weak -> Strong action verbs
  'you can': 'you should',
  'you might': 'you should',
  'you may': 'you can',
  'it is possible to': 'you can',
  'it is recommended to': 'you should',
  'you could': 'you can',
  'one can': 'you can',
  'one should': 'you should',
  
  // Make instructions more direct
  'you will need to': 'you need to',
  'you will want to': 'you should',
  'you are going to': 'you will',
  'you are able to': 'you can',
  
  // Improve clarity
  'make sure to': 'ensure you',
  'be sure to': 'ensure you',
  'don\'t forget to': 'remember to',
  'try to': '',  // Remove weak qualifier
  'attempt to': '',  // Remove weak qualifier
};

/**
 * Procedural section identifiers - sections that should use numbered lists
 */
const proceduralSectionHeaders = [
  'installation',
  'setup',
  'getting started',
  'quick start',
  'how to',
  'steps',
  'procedure',
  'process',
  'workflow',
  'tutorial',
  'guide'
];

/**
 * Capitalize first letter of a string
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if a section header indicates procedural content
 */
function isProceduralSection(header) {
  const headerLower = header.toLowerCase();
  return proceduralSectionHeaders.some(keyword => headerLower.includes(keyword));
}

/**
 * Improve action verbs in text
 */
function improveActionVerbs(text) {
  let improvedText = text;
  let verbChanges = 0;
  
  for (const [weak, strong] of Object.entries(actionVerbImprovements)) {
    const regex = new RegExp(`\\b${weak}\\b`, 'gi');
    if (regex.test(improvedText)) {
      improvedText = improvedText.replace(regex, strong);
      verbChanges++;
    }
  }
  
  if (verbChanges > 0) {
    changes.push(`Improved ${verbChanges} action verbs`);
  }
  
  return improvedText;
}

/**
 * Convert prose instructions to numbered lists
 */
function convertProseToLists(text) {
  let convertedText = text;
  
  for (const pattern of proceduralPatterns) {
    if (pattern.pattern.test(convertedText)) {
      convertedText = convertedText.replace(pattern.pattern, pattern.replacement);
      changes.push(pattern.description);
    }
  }
  
  return convertedText;
}

/**
 * Identify and improve procedural paragraphs
 */
function improveProceduralParagraphs(text, inProceduralSection = false) {
  const lines = text.split('\n');
  const improvedLines = [];
  let currentParagraph = [];
  let paragraphChanged = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // If we hit an empty line, process the current paragraph
    if (line.trim() === '') {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ');
        const improvedParagraph = processProceduralParagraph(paragraphText, inProceduralSection);
        
        if (improvedParagraph !== paragraphText) {
          improvedLines.push(improvedParagraph);
          paragraphChanged = true;
        } else {
          improvedLines.push(...currentParagraph);
        }
        
        currentParagraph = [];
      }
      improvedLines.push(line);
    } else {
      currentParagraph.push(line);
    }
  }
  
  // Process final paragraph if exists
  if (currentParagraph.length > 0) {
    const paragraphText = currentParagraph.join(' ');
    const improvedParagraph = processProceduralParagraph(paragraphText, inProceduralSection);
    
    if (improvedParagraph !== paragraphText) {
      improvedLines.push(improvedParagraph);
      paragraphChanged = true;
    } else {
      improvedLines.push(...currentParagraph);
    }
  }
  
  return improvedLines.join('\n');
}

/**
 * Process a single paragraph for procedural improvements
 */
function processProceduralParagraph(paragraph, inProceduralSection) {
  // Skip if already a list or code block
  if (paragraph.match(/^\s*[\d\-\*\+]/) || paragraph.includes('```')) {
    return paragraph;
  }
  
  // Look for step indicators in the paragraph
  const stepIndicators = [
    'first', 'second', 'third', 'then', 'next', 'after', 'finally', 'lastly'
  ];
  
  const hasStepIndicators = stepIndicators.some(indicator => 
    paragraph.toLowerCase().includes(indicator)
  );
  
  // If in procedural section and has step indicators, try to convert
  if ((inProceduralSection || hasStepIndicators) && paragraph.length > 100) {
    // Try to split on common step separators
    const stepSeparators = [
      /\.\s+Then\s+/gi,
      /\.\s+Next,?\s+/gi,
      /\.\s+After\s+that,?\s+/gi,
      /\.\s+Finally,?\s+/gi,
      /\.\s+Lastly,?\s+/gi
    ];
    
    for (const separator of stepSeparators) {
      if (separator.test(paragraph)) {
        const steps = paragraph.split(separator);
        if (steps.length >= 2) {
          const numberedSteps = steps.map((step, index) => {
            const cleanStep = step.trim().replace(/^(first,?\s+|second,?\s+|third,?\s+)/i, '');
            return `${index + 1}. ${capitalizeFirst(cleanStep)}`;
          }).join('\n');
          
          changes.push('Converted prose to numbered list');
          return numberedSteps;
        }
      }
    }
  }
  
  return paragraph;
}

/**
 * Process a markdown file and improve procedural documentation
 */
function processMarkdownFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const improvedLines = [];
  
  let currentSection = '';
  let inProceduralSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for section headers
    if (line.match(/^#+\s+/)) {
      currentSection = line.replace(/^#+\s+/, '').toLowerCase();
      inProceduralSection = isProceduralSection(currentSection);
    }
    
    improvedLines.push(line);
  }
  
  // Process the entire content for improvements
  let improvedContent = improvedLines.join('\n');
  
  // Apply procedural improvements
  improvedContent = convertProseToLists(improvedContent);
  improvedContent = improveActionVerbs(improvedContent);
  improvedContent = improveProceduralParagraphs(improvedContent, inProceduralSection);
  
  // Only write if content changed
  if (improvedContent !== content) {
    writeFileSync(filePath, improvedContent);
    return true;
  }
  
  return false;
}

/**
 * Process all documentation files
 */
function processAllFiles() {
  const filesToProcess = [];
  
  // Add root files
  ROOT_FILES.forEach(file => {
    try {
      if (statSync(file).isFile()) {
        filesToProcess.push(file);
      }
    } catch (e) {
      // File doesn't exist, skip
    }
  });
  
  // Add docs directory files
  try {
    if (statSync(DOCS_DIR).isDirectory()) {
      const docFiles = readdirSync(DOCS_DIR)
        .filter(file => file.endsWith('.md'))
        .map(file => join(DOCS_DIR, file));
      filesToProcess.push(...docFiles);
    }
  } catch (e) {
    // Docs directory doesn't exist, skip
  }

  console.log(`🔍 Processing ${filesToProcess.length} documentation files...`);
  
  let filesChanged = 0;
  
  filesToProcess.forEach(file => {
    console.log(`📝 Processing: ${file}`);
    try {
      if (processMarkdownFile(file)) {
        filesChanged++;
        console.log(`  ✅ Improved procedural documentation in ${file}`);
      } else {
        console.log(`  ⏭️  No changes needed in ${file}`);
      }
    } catch (error) {
      console.log(`  ❌ Error processing ${file}: ${error.message}`);
    }
  });

  return { total: filesToProcess.length, changed: filesChanged };
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 CouchCMS AI Toolkit - Improve Procedural Documentation');
  console.log('');
  console.log('This script improves procedural documentation by:');
  console.log('- Converting prose to numbered lists where appropriate');
  console.log('- Using clear action verbs');
  console.log('- Making step-by-step processes more scannable');
  console.log('');

  const results = processAllFiles();
  
  console.log('');
  console.log('📊 Summary:');
  console.log(`  📄 Files processed: ${results.total}`);
  console.log(`  ✅ Files improved: ${results.changed}`);
  console.log(`  📝 Total improvements: ${changes.length}`);
  
  if (changes.length > 0) {
    console.log('');
    console.log('🔧 Improvements made:');
    changes.forEach(change => {
      console.log(`  • ${change}`);
    });
  }
  
  console.log('');
  console.log('✅ Procedural documentation improvement complete!');
  
  if (results.changed > 0) {
    console.log('');
    console.log('💡 Next steps:');
    console.log('  1. Review the improved procedural sections');
    console.log('  2. Ensure numbered lists flow logically');
    console.log('  3. Commit the improvements');
  }
}

// Run the script
main();