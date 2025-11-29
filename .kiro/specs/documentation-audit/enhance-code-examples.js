#!/usr/bin/env bun

/**
 * Enhance Code Examples Script
 * 
 * This script enhances code examples in documentation by:
 * 1. Making examples complete and runnable
 * 2. Adding helpful comments to complex examples
 * 3. Ensuring all examples have proper context
 * 
 * Requirements: 3.2 - Complete, working examples that users can copy
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DOCS_DIR = 'docs';
const ROOT_FILES = ['README.md'];

// Track changes made
const changes = [];

/**
 * Enhanced code examples with better comments and completeness
 */
const codeExampleEnhancements = {
  'git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared': `# Add the CouchCMS AI Toolkit as a git submodule
# This creates a ai-toolkit-shared/ directory in your project
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared`,

  'cd ai-toolkit-shared && bun install && cd ..': `# Navigate to toolkit directory and install its dependencies
# This installs gray-matter, yaml, handlebars packages required by the toolkit
cd ai-toolkit-shared
bun install  # or: npm install if you prefer npm
cd ..`,

  'bun ai-toolkit-shared/scripts/create-standards.js': `# Run the simple setup wizard (recommended for beginners)
# This creates a standards.md file with your project configuration
bun ai-toolkit-shared/scripts/create-standards.js

# Alternative: Advanced setup wizard with more options
# bun ai-toolkit-shared/scripts/init.js`,

  'bun ai-toolkit-shared/scripts/init.js': `# Run the advanced setup wizard
# This provides full control over modules, agents, and configuration
bun ai-toolkit-shared/scripts/init.js

# The wizard will guide you through:
# - Project name and description
# - Module selection (CouchCMS features)
# - Agent selection (AI assistants)
# - Configuration file location`,

  'bun ai-toolkit-shared/scripts/sync.js': `# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/sync.js --watch`,

  'bun ai-toolkit-shared/scripts/validate.js': `# Validate your project configuration and check compliance
# This checks for errors in standards.md and missing files
bun ai-toolkit-shared/scripts/validate.js

# The validation will show:
# - Configuration file status
# - Module and agent validation
# - Compliance score (0-100%)
# - Specific issues and recommendations`,

  'curl -fsSL https://bun.sh/install | bash': `# Install Bun (recommended JavaScript runtime)
# This is faster than Node.js and works great with the toolkit
curl -fsSL https://bun.sh/install | bash

# After installation, restart your terminal or run:
# source ~/.bashrc  # or ~/.zshrc depending on your shell

# Verify installation:
# bun --version`,

  'curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh | bash': `# One-command installation (public repositories only)
# This automatically adds the submodule and installs dependencies
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh | bash

# What this script does:
# 1. Adds toolkit as git submodule
# 2. Installs toolkit dependencies (bun install)
# 3. Starts the setup wizard
# 4. Generates initial AI configurations

# Note: Only works for public repositories
# For private repos, use the manual 3-step installation`
};

/**
 * Enhance a code block by adding context and comments
 */
function enhanceCodeBlock(content, language, context = '') {
  // Skip if already enhanced (has detailed comments)
  if (content.includes('# This ') || content.includes('// This ')) {
    return content;
  }

  // Check for exact matches first
  for (const [original, enhanced] of Object.entries(codeExampleEnhancements)) {
    if (content.trim() === original.trim()) {
      changes.push(`Enhanced command: ${original.substring(0, 50)}...`);
      return enhanced;
    }
  }

  // Add context comments to common command patterns
  if (language === 'bash' || language === 'sh' || language === 'shell') {
    if (content.includes('bun ') && !content.includes('#')) {
      const lines = content.split('\n');
      const enhancedLines = lines.map(line => {
        if (line.trim().startsWith('bun ai-toolkit-shared/scripts/')) {
          const script = line.match(/scripts\/([^.]+)\.js/)?.[1];
          const comments = {
            'init': '# Interactive setup wizard',
            'sync': '# Generate AI configuration files',
            'validate': '# Check configuration validity',
            'health': '# Check toolkit status and updates',
            'create-standards': '# Simple setup wizard for beginners'
          };
          if (script && comments[script]) {
            return `${comments[script]}\n${line}`;
          }
        }
        return line;
      });
      
      if (enhancedLines.join('\n') !== content) {
        changes.push(`Added context comments to bash commands`);
        return enhancedLines.join('\n');
      }
    }
  }

  // Enhance YAML examples
  if (language === 'yaml' || language === 'yml') {
    if (content.includes('modules:') && !content.includes('#')) {
      const enhancedContent = content
        .replace(/^name: (.+)$/m, 'name: $1\ndescription: \'Brief description of your project\'')
        .replace(/^modules:$/m, '# Knowledge Modules - Choose based on your project needs\nmodules:')
        .replace(/^  - couchcms-core$/m, '  - couchcms-core      # Always required for CouchCMS projects')
        .replace(/^  - tailwindcss$/m, '  - tailwindcss        # TailwindCSS 4 patterns and utilities')
        .replace(/^  - alpinejs$/m, '  - alpinejs           # Alpine.js reactive components')
        .replace(/^agents:$/m, '# AI Agents - Specialized assistants for development tasks\nagents:')
        .replace(/^  - couchcms$/m, '  - couchcms           # Core CouchCMS development guidance');
      
      if (enhancedContent !== content) {
        changes.push(`Enhanced YAML configuration with comments`);
        return enhancedContent;
      }
    }
  }

  // Enhance directory structure examples
  if ((language === 'text' || language === '' || !language) && content.includes('your-project/')) {
    if (content.includes('ai-toolkit-shared/') && !content.includes('#')) {
      const enhancedContent = content
        .replace(/├── ai-toolkit-shared\/$/m, '├── ai-toolkit-shared/           # CouchCMS AI Toolkit (git submodule)')
        .replace(/├── \.cursorrules$/m, '├── .cursorrules                 # Cursor IDE configuration')
        .replace(/├── \.claude\/$/m, '├── .claude/                     # Claude Code configuration')
        .replace(/├── CLAUDE\.md$/m, '├── CLAUDE.md                    # Memory file (loaded at startup)')
        .replace(/└── AGENTS\.md$/m, '└── AGENTS.md                    # Agent documentation');
      
      if (enhancedContent !== content) {
        changes.push(`Enhanced directory structure with comments`);
        return enhancedContent;
      }
    }
  }

  return content;
}

/**
 * Process a markdown file and enhance code examples
 */
function processMarkdownFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const enhancedLines = [];
  
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeContent = [];
  let codeStartIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect code block start
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Starting a code block
        inCodeBlock = true;
        codeLanguage = line.substring(3).trim();
        codeContent = [];
        codeStartIndex = i;
        enhancedLines.push(line);
      } else {
        // Ending a code block
        inCodeBlock = false;
        
        // Enhance the code content
        const originalContent = codeContent.join('\n');
        const enhancedContent = enhanceCodeBlock(originalContent, codeLanguage);
        
        // Add enhanced content
        enhancedContent.split('\n').forEach(enhancedLine => {
          enhancedLines.push(enhancedLine);
        });
        
        // Add closing backticks
        enhancedLines.push(line);
        
        // Reset
        codeContent = [];
        codeLanguage = '';
        codeStartIndex = -1;
      }
    } else if (inCodeBlock) {
      // Collect code content
      codeContent.push(line);
    } else {
      // Regular line
      enhancedLines.push(line);
    }
  }

  const enhancedContent = enhancedLines.join('\n');
  
  // Only write if content changed
  if (enhancedContent !== content) {
    writeFileSync(filePath, enhancedContent);
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
        console.log(`  ✅ Enhanced code examples in ${file}`);
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
  console.log('🚀 CouchCMS AI Toolkit - Enhance Code Examples');
  console.log('');
  console.log('This script enhances code examples by:');
  console.log('- Making examples complete and runnable');
  console.log('- Adding helpful comments to complex examples');
  console.log('- Ensuring all examples have proper context');
  console.log('');

  const results = processAllFiles();
  
  console.log('');
  console.log('📊 Summary:');
  console.log(`  📄 Files processed: ${results.total}`);
  console.log(`  ✅ Files enhanced: ${results.changed}`);
  console.log(`  📝 Total enhancements: ${changes.length}`);
  
  if (changes.length > 0) {
    console.log('');
    console.log('🔧 Enhancements made:');
    changes.forEach(change => {
      console.log(`  • ${change}`);
    });
  }
  
  console.log('');
  console.log('✅ Code example enhancement complete!');
  
  if (results.changed > 0) {
    console.log('');
    console.log('💡 Next steps:');
    console.log('  1. Review the enhanced examples');
    console.log('  2. Test that examples work as expected');
    console.log('  3. Commit the improvements');
  }
}

// Run the script
main();