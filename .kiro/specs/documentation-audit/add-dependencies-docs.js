#!/usr/bin/env bun

/**
 * Add Missing Dependencies Documentation Script
 * 
 * This script adds missing dependencies documentation by:
 * 1. Ensuring all package.json dependencies are mentioned
 * 2. Explaining why each dependency is needed
 * 3. Adding dependency information to installation sections
 * 
 * Requirements: 1.3 - Installation steps should list all required dependencies
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DOCS_DIR = 'docs';
const ROOT_FILES = ['README.md'];
const PACKAGE_JSON_PATH = 'package.json';

// Track changes made
const changes = [];

// Read package.json to get dependencies
let packageJson;
try {
  packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
} catch (error) {
  console.error('Error reading package.json:', error.message);
  process.exit(1);
}

/**
 * Dependencies information with explanations
 */
const dependencyInfo = {
  'gray-matter': {
    purpose: 'YAML frontmatter parsing',
    description: 'Parses YAML frontmatter from standards.md configuration files',
    usage: 'Used by sync.js and validate.js to read project configuration'
  },
  'yaml': {
    purpose: 'YAML processing',
    description: 'Handles YAML serialization and deserialization',
    usage: 'Used for processing configuration data and module metadata'
  },
  'handlebars': {
    purpose: 'Template generation',
    description: 'Template engine for generating AI configuration files',
    usage: 'Used by sync.js to generate .cursorrules, CLAUDE.md, and other config files'
  },
  'fast-check': {
    purpose: 'Property-based testing',
    description: 'Testing framework for generating random test cases',
    usage: 'Development dependency for testing toolkit functionality',
    isDev: true
  }
};

/**
 * Installation sections that should mention dependencies
 */
const installationSections = [
  'prerequisites',
  'installation',
  'setup',
  'getting started',
  'dependencies',
  'requirements'
];

/**
 * Check if a section header indicates installation content
 */
function isInstallationSection(header) {
  const headerLower = header.toLowerCase();
  return installationSections.some(keyword => headerLower.includes(keyword));
}

/**
 * Generate dependencies documentation text
 */
function generateDependenciesText(includeDevDeps = false) {
  const deps = packageJson.dependencies || {};
  const devDeps = includeDevDeps ? (packageJson.devDependencies || {}) : {};
  const allDeps = { ...deps, ...devDeps };
  
  if (Object.keys(allDeps).length === 0) {
    return '';
  }
  
  let text = '\n### Dependencies\n\n';
  text += 'The toolkit requires the following Node.js packages:\n\n';
  
  Object.keys(allDeps).forEach(depName => {
    const info = dependencyInfo[depName];
    if (info) {
      const version = allDeps[depName];
      const type = info.isDev ? ' (development)' : '';
      text += `- **${depName}** (${version})${type} - ${info.description}\n`;
    } else {
      const version = allDeps[depName];
      text += `- **${depName}** (${version}) - Required dependency\n`;
    }
  });
  
  text += '\nThese are automatically installed when you run `bun install` in the toolkit directory.\n';
  
  return text;
}

/**
 * Generate installation note about dependencies
 */
function generateInstallationNote() {
  const deps = Object.keys(packageJson.dependencies || {});
  if (deps.length === 0) return '';
  
  return `
:::warning[Critical Step]
You **must** install the toolkit's dependencies before running any scripts. The toolkit requires several npm packages (${deps.join(', ')}) that need to be installed first.
:::

\`\`\`bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
\`\`\`

This installs the required packages:
${deps.map(dep => {
  const info = dependencyInfo[dep];
  return `- \`${dep}\` - ${info ? info.purpose : 'Required dependency'}`;
}).join('\n')}
`;
}

/**
 * Check if dependencies are already documented in a section
 */
function hasDependenciesDocumented(content) {
  const deps = Object.keys(packageJson.dependencies || {});
  return deps.some(dep => content.includes(dep));
}

/**
 * Add dependencies documentation to installation sections
 */
function addDependenciesToInstallation(content) {
  const lines = content.split('\n');
  const improvedLines = [];
  let inInstallationSection = false;
  let currentSection = '';
  let addedDependencies = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for section headers
    if (line.match(/^#+\s+/)) {
      currentSection = line.replace(/^#+\s+/, '').toLowerCase();
      inInstallationSection = isInstallationSection(currentSection);
    }
    
    improvedLines.push(line);
    
    // Add dependencies documentation after installation headers
    if (inInstallationSection && line.match(/^#+\s+/) && !addedDependencies) {
      // Check if dependencies are already documented in this section
      const sectionEnd = findSectionEnd(lines, i + 1);
      const sectionContent = lines.slice(i + 1, sectionEnd).join('\n');
      
      if (!hasDependenciesDocumented(sectionContent)) {
        // Add installation note if this is a setup/installation section
        if (currentSection.includes('install') || currentSection.includes('setup') || currentSection.includes('getting started')) {
          improvedLines.push('');
          improvedLines.push(generateInstallationNote());
          changes.push(`Added dependency installation note to ${currentSection} section`);
          addedDependencies = true;
        }
      }
    }
  }
  
  return improvedLines.join('\n');
}

/**
 * Find the end of a section (next header or end of file)
 */
function findSectionEnd(lines, startIndex) {
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].match(/^#+\s+/)) {
      return i;
    }
  }
  return lines.length;
}

/**
 * Add a dedicated dependencies section if missing
 */
function addDependenciesSection(content) {
  // Check if there's already a dependencies section
  if (content.toLowerCase().includes('## dependencies') || 
      content.toLowerCase().includes('### dependencies')) {
    return content;
  }
  
  // Find a good place to add dependencies section
  const lines = content.split('\n');
  let insertIndex = -1;
  
  // Look for installation, setup, or prerequisites sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^#+\s+(installation|setup|prerequisites|getting started)/i)) {
      // Find the end of this section
      insertIndex = findSectionEnd(lines, i + 1);
      break;
    }
  }
  
  // If no good place found, add at the end
  if (insertIndex === -1) {
    insertIndex = lines.length;
  }
  
  // Insert dependencies section
  const dependenciesText = generateDependenciesText(true);
  if (dependenciesText) {
    lines.splice(insertIndex, 0, '', dependenciesText);
    changes.push('Added dedicated dependencies section');
    return lines.join('\n');
  }
  
  return content;
}

/**
 * Process a markdown file and add missing dependencies documentation
 */
function processMarkdownFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  let improvedContent = content;
  
  // Add dependencies to installation sections
  improvedContent = addDependenciesToInstallation(improvedContent);
  
  // Add dedicated dependencies section if this is a main documentation file
  if (filePath.includes('README.md') || 
      filePath.includes('GETTING-STARTED.md') || 
      filePath.includes('INSTALLATION')) {
    improvedContent = addDependenciesSection(improvedContent);
  }
  
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
  
  // Add docs directory files - focus on installation-related files
  try {
    if (statSync(DOCS_DIR).isDirectory()) {
      const docFiles = readdirSync(DOCS_DIR)
        .filter(file => file.endsWith('.md'))
        .filter(file => {
          const fileName = file.toLowerCase();
          return fileName.includes('install') || 
                 fileName.includes('getting-started') || 
                 fileName.includes('setup') || 
                 fileName.includes('quick-start') ||
                 fileName.includes('troubleshoot');
        })
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
        console.log(`  ✅ Added dependencies documentation to ${file}`);
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
  console.log('🚀 CouchCMS AI Toolkit - Add Missing Dependencies Documentation');
  console.log('');
  console.log('This script adds missing dependencies documentation by:');
  console.log('- Ensuring all package.json dependencies are mentioned');
  console.log('- Explaining why each dependency is needed');
  console.log('- Adding dependency information to installation sections');
  console.log('');
  
  // Show current dependencies
  const deps = packageJson.dependencies || {};
  const devDeps = packageJson.devDependencies || {};
  
  console.log('📦 Current dependencies:');
  Object.keys(deps).forEach(dep => {
    const info = dependencyInfo[dep];
    console.log(`  • ${dep} - ${info ? info.purpose : 'Required dependency'}`);
  });
  
  if (Object.keys(devDeps).length > 0) {
    console.log('🔧 Development dependencies:');
    Object.keys(devDeps).forEach(dep => {
      const info = dependencyInfo[dep];
      console.log(`  • ${dep} - ${info ? info.purpose : 'Development dependency'}`);
    });
  }
  
  console.log('');

  const results = processAllFiles();
  
  console.log('');
  console.log('📊 Summary:');
  console.log(`  📄 Files processed: ${results.total}`);
  console.log(`  ✅ Files updated: ${results.changed}`);
  console.log(`  📝 Total changes: ${changes.length}`);
  
  if (changes.length > 0) {
    console.log('');
    console.log('🔧 Changes made:');
    changes.forEach(change => {
      console.log(`  • ${change}`);
    });
  }
  
  console.log('');
  console.log('✅ Dependencies documentation update complete!');
  
  if (results.changed > 0) {
    console.log('');
    console.log('💡 Next steps:');
    console.log('  1. Review the added dependency documentation');
    console.log('  2. Ensure all dependencies are accurately described');
    console.log('  3. Commit the improvements');
  }
}

// Run the script
main();