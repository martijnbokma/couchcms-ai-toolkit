#!/usr/bin/env node

/**
 * Documentation Audit - Version Accuracy
 * 
 * This script audits documentation for version accuracy by:
 * - Verifying feature documentation against codebase
 * - Checking configuration options against config-loader.js
 * - Verifying setup mode documentation against init.js
 * - Checking version number references against package.json
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TOOLKIT_ROOT = join(__dirname, '..', '..', '..');

// Documentation files to audit
const DOC_FILES = [
    'README.md',
    'CHANGELOG.md',
    'docs/NEW-FEATURES.md',
    'docs/GETTING-STARTED.md',
    'docs/QUICK-START.md',
    'docs/CONFIG-FILES.md',
    'docs/TROUBLESHOOTING.md',
    'docs/MIGRATION.md',
    'docs/INSTALLATION-METHODS.md',
    'docs/UPDATES.md',
    'docs/EDITOR-SUPPORT.md',
    'docs/SIMPLE-SETUP.md',
    'docs/SETUP-COMPARISON.md'
];

const findings = {
    features: [],
    configOptions: [],
    setupModes: [],
    versions: []
};

/**
 * Read file content safely
 */
function readFile(filePath) {
    try {
        return readFileSync(join(TOOLKIT_ROOT, filePath), 'utf-8');
    } catch (error) {
        return null;
    }
}

/**
 * Extract features mentioned in documentation
 */
function extractDocumentedFeatures(content) {
    const features = new Set();
    
    // Common feature patterns
    const patterns = [
        /(?:feature|command|script|tool):\s*`([^`]+)`/gi,
        /`bun (?:run )?([a-z-]+(?:\.js)?)`/gi,
        /`(?:scripts\/)?([a-z-]+\.js)`/gi,
        /\*\*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\*\*/g
    ];
    
    patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            features.add(match[1].toLowerCase().replace(/\.js$/, ''));
        }
    });
    
    return Array.from(features);
}

/**
 * Check if feature exists in codebase
 */
function featureExistsInCodebase(feature) {
    // Check scripts directory
    const scriptPath = join(TOOLKIT_ROOT, 'scripts', `${feature}.js`);
    if (existsSync(scriptPath)) {
        return { exists: true, location: `scripts/${feature}.js` };
    }
    
    // Check package.json scripts
    const packageJson = JSON.parse(readFile('package.json'));
    if (packageJson.scripts && packageJson.scripts[feature]) {
        return { exists: true, location: `package.json scripts.${feature}` };
    }
    
    // Check if it's a directory
    const dirPath = join(TOOLKIT_ROOT, feature);
    if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
        return { exists: true, location: feature };
    }
    
    return { exists: false, location: null };
}

/**
 * Extract configuration options from config-loader.js
 */
function extractSupportedConfigOptions() {
    const configLoaderPath = 'scripts/lib/config-loader.js';
    const content = readFile(configLoaderPath);
    
    if (!content) {
        return [];
    }
    
    const options = new Set();
    
    // Look for config field references
    const patterns = [
        /config\.([a-zA-Z_]+)/g,
        /['"]([a-zA-Z_]+)['"]\s*:/g,
        /validateConfig.*?{([^}]+)}/gs
    ];
    
    patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            if (match[1] && !match[1].startsWith('_')) {
                options.add(match[1]);
            }
        }
    });
    
    return Array.from(options);
}

/**
 * Extract configuration options mentioned in documentation
 */
function extractDocumentedConfigOptions(content) {
    const options = new Set();
    
    // Look for YAML-like config examples
    const yamlPattern = /^([a-z_]+):/gm;
    let match;
    while ((match = yamlPattern.exec(content)) !== null) {
        options.add(match[1]);
    }
    
    return Array.from(options);
}

/**
 * Extract setup modes from init.js
 */
function extractSupportedSetupModes() {
    const initPath = 'scripts/init.js';
    const content = readFile(initPath);
    
    if (!content) {
        return [];
    }
    
    const modes = [];
    
    // Look for mode definitions
    const modePattern = /['"]([A-Z][a-z]+)['"]\s*-\s*([^'"]+)/g;
    let match;
    while ((match = modePattern.exec(content)) !== null) {
        modes.push({
            name: match[1],
            description: match[2].trim()
        });
    }
    
    return modes;
}

/**
 * Extract setup modes mentioned in documentation
 */
function extractDocumentedSetupModes(content) {
    const modes = new Set();
    
    // Look for mode references
    const patterns = [
        /(?:mode|setup):\s*\*\*([A-Z][a-z]+)\*\*/gi,
        /\*\*([A-Z][a-z]+)\s+[Mm]ode\*\*/g,
        /Choose\s+['"]([A-Z][a-z]+)['"]/gi
    ];
    
    patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            modes.add(match[1]);
        }
    });
    
    return Array.from(modes);
}

/**
 * Extract version from package.json
 */
function getCurrentVersion() {
    const packageJson = JSON.parse(readFile('package.json'));
    return packageJson.version;
}

/**
 * Extract version references from documentation
 */
function extractVersionReferences(content) {
    const versions = [];
    
    // Look for version patterns
    const patterns = [
        /v?(\d+\.\d+\.\d+)/g,
        /version\s+(\d+\.\d+\.\d+)/gi,
        /\[(\d+\.\d+\.\d+)\]/g
    ];
    
    patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            versions.push(match[1]);
        }
    });
    
    return versions;
}

/**
 * Audit feature documentation
 */
function auditFeatureDocumentation() {
    console.log('\n📋 Auditing Feature Documentation...\n');
    
    DOC_FILES.forEach(docFile => {
        const content = readFile(docFile);
        if (!content) {
            findings.features.push({
                severity: 'medium',
                file: docFile,
                issue: 'File not found or unreadable'
            });
            return;
        }
        
        const features = extractDocumentedFeatures(content);
        
        features.forEach(feature => {
            const result = featureExistsInCodebase(feature);
            
            if (!result.exists) {
                findings.features.push({
                    severity: 'high',
                    file: docFile,
                    feature: feature,
                    issue: 'Feature documented but not found in codebase',
                    suggestion: `Verify if '${feature}' has been removed or renamed`
                });
            }
        });
    });
    
    console.log(`✓ Checked ${DOC_FILES.length} documentation files`);
    console.log(`✓ Found ${findings.features.length} potential issues`);
}

/**
 * Audit configuration options
 */
function auditConfigurationOptions() {
    console.log('\n⚙️  Auditing Configuration Options...\n');
    
    const supportedOptions = extractSupportedConfigOptions();
    console.log(`✓ Found ${supportedOptions.length} supported config options in config-loader.js`);
    
    DOC_FILES.forEach(docFile => {
        const content = readFile(docFile);
        if (!content) return;
        
        const documentedOptions = extractDocumentedConfigOptions(content);
        
        documentedOptions.forEach(option => {
            if (!supportedOptions.includes(option) && 
                !['name', 'toolkit', 'modules', 'agents', 'framework'].includes(option)) {
                findings.configOptions.push({
                    severity: 'high',
                    file: docFile,
                    option: option,
                    issue: 'Configuration option documented but not supported by config-loader.js',
                    suggestion: `Verify if '${option}' is still supported or has been renamed`
                });
            }
        });
    });
    
    console.log(`✓ Found ${findings.configOptions.length} potential issues`);
}

/**
 * Audit setup mode documentation
 */
function auditSetupModes() {
    console.log('\n🎯 Auditing Setup Mode Documentation...\n');
    
    const supportedModes = extractSupportedSetupModes();
    console.log(`✓ Found ${supportedModes.length} setup modes in init.js`);
    
    const expectedModes = ['Auto', 'Preset', 'Simple', 'Custom'];
    
    DOC_FILES.forEach(docFile => {
        const content = readFile(docFile);
        if (!content) return;
        
        const documentedModes = extractDocumentedSetupModes(content);
        
        // Check if all expected modes are documented
        expectedModes.forEach(mode => {
            if (!documentedModes.includes(mode) && content.includes('setup') && content.includes('mode')) {
                findings.setupModes.push({
                    severity: 'medium',
                    file: docFile,
                    mode: mode,
                    issue: `Setup mode '${mode}' not documented`,
                    suggestion: `Add documentation for '${mode}' mode`
                });
            }
        });
        
        // Check for modes that don't exist
        documentedModes.forEach(mode => {
            if (!expectedModes.includes(mode)) {
                findings.setupModes.push({
                    severity: 'high',
                    file: docFile,
                    mode: mode,
                    issue: `Setup mode '${mode}' documented but not found in init.js`,
                    suggestion: `Verify if '${mode}' mode has been removed or renamed`
                });
            }
        });
    });
    
    console.log(`✓ Found ${findings.setupModes.length} potential issues`);
}

/**
 * Audit version references
 */
function auditVersionReferences() {
    console.log('\n🔢 Auditing Version References...\n');
    
    const currentVersion = getCurrentVersion();
    console.log(`✓ Current version: ${currentVersion}`);
    
    DOC_FILES.forEach(docFile => {
        const content = readFile(docFile);
        if (!content) return;
        
        const versions = extractVersionReferences(content);
        const uniqueVersions = [...new Set(versions)];
        
        uniqueVersions.forEach(version => {
            // Skip if it's the current version or a historical version in CHANGELOG
            if (version === currentVersion || docFile === 'CHANGELOG.md') {
                return;
            }
            
            // Check if version is marked as historical
            const versionContext = content.substring(
                Math.max(0, content.indexOf(version) - 100),
                Math.min(content.length, content.indexOf(version) + 100)
            );
            
            if (!versionContext.match(/\b(old|previous|legacy|deprecated|v1\.|historical)\b/i)) {
                findings.versions.push({
                    severity: 'medium',
                    file: docFile,
                    version: version,
                    current: currentVersion,
                    issue: `Version reference '${version}' doesn't match current version '${currentVersion}'`,
                    suggestion: `Update to '${currentVersion}' or mark as historical reference`
                });
            }
        });
    });
    
    console.log(`✓ Found ${findings.versions.length} potential issues`);
}

/**
 * Generate findings report
 */
function generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 AUDIT REPORT - VERSION ACCURACY');
    console.log('='.repeat(80) + '\n');
    
    const totalIssues = findings.features.length + 
                       findings.configOptions.length + 
                       findings.setupModes.length + 
                       findings.versions.length;
    
    console.log(`Total Issues Found: ${totalIssues}\n`);
    
    // Feature Documentation Issues
    if (findings.features.length > 0) {
        console.log('🔍 FEATURE DOCUMENTATION ISSUES\n');
        findings.features.forEach((finding, index) => {
            console.log(`${index + 1}. [${finding.severity.toUpperCase()}] ${finding.file}`);
            console.log(`   Feature: ${finding.feature}`);
            console.log(`   Issue: ${finding.issue}`);
            console.log(`   Suggestion: ${finding.suggestion}\n`);
        });
    }
    
    // Configuration Options Issues
    if (findings.configOptions.length > 0) {
        console.log('⚙️  CONFIGURATION OPTIONS ISSUES\n');
        findings.configOptions.forEach((finding, index) => {
            console.log(`${index + 1}. [${finding.severity.toUpperCase()}] ${finding.file}`);
            console.log(`   Option: ${finding.option}`);
            console.log(`   Issue: ${finding.issue}`);
            console.log(`   Suggestion: ${finding.suggestion}\n`);
        });
    }
    
    // Setup Modes Issues
    if (findings.setupModes.length > 0) {
        console.log('🎯 SETUP MODES ISSUES\n');
        findings.setupModes.forEach((finding, index) => {
            console.log(`${index + 1}. [${finding.severity.toUpperCase()}] ${finding.file}`);
            console.log(`   Mode: ${finding.mode}`);
            console.log(`   Issue: ${finding.issue}`);
            console.log(`   Suggestion: ${finding.suggestion}\n`);
        });
    }
    
    // Version References Issues
    if (findings.versions.length > 0) {
        console.log('🔢 VERSION REFERENCES ISSUES\n');
        findings.versions.forEach((finding, index) => {
            console.log(`${index + 1}. [${finding.severity.toUpperCase()}] ${finding.file}`);
            console.log(`   Version: ${finding.version} (Current: ${finding.current})`);
            console.log(`   Issue: ${finding.issue}`);
            console.log(`   Suggestion: ${finding.suggestion}\n`);
        });
    }
    
    if (totalIssues === 0) {
        console.log('✅ No issues found! Documentation is accurate.\n');
    }
    
    console.log('='.repeat(80) + '\n');
}

/**
 * Save findings to markdown file
 */
function saveFindings() {
    const timestamp = new Date().toISOString();
    const currentVersion = getCurrentVersion();
    
    let markdown = `# Version Accuracy Audit Findings\n\n`;
    markdown += `**Generated:** ${timestamp}\n`;
    markdown += `**Current Version:** ${currentVersion}\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- Feature Documentation Issues: ${findings.features.length}\n`;
    markdown += `- Configuration Options Issues: ${findings.configOptions.length}\n`;
    markdown += `- Setup Modes Issues: ${findings.setupModes.length}\n`;
    markdown += `- Version References Issues: ${findings.versions.length}\n`;
    markdown += `- **Total Issues:** ${findings.features.length + findings.configOptions.length + findings.setupModes.length + findings.versions.length}\n\n`;
    
    // Feature Documentation
    if (findings.features.length > 0) {
        markdown += `## 🔍 Feature Documentation Issues\n\n`;
        findings.features.forEach((finding, index) => {
            markdown += `### ${index + 1}. ${finding.feature}\n\n`;
            markdown += `- **Severity:** ${finding.severity}\n`;
            markdown += `- **File:** \`${finding.file}\`\n`;
            markdown += `- **Issue:** ${finding.issue}\n`;
            markdown += `- **Suggestion:** ${finding.suggestion}\n\n`;
        });
    }
    
    // Configuration Options
    if (findings.configOptions.length > 0) {
        markdown += `## ⚙️ Configuration Options Issues\n\n`;
        findings.configOptions.forEach((finding, index) => {
            markdown += `### ${index + 1}. ${finding.option}\n\n`;
            markdown += `- **Severity:** ${finding.severity}\n`;
            markdown += `- **File:** \`${finding.file}\`\n`;
            markdown += `- **Issue:** ${finding.issue}\n`;
            markdown += `- **Suggestion:** ${finding.suggestion}\n\n`;
        });
    }
    
    // Setup Modes
    if (findings.setupModes.length > 0) {
        markdown += `## 🎯 Setup Modes Issues\n\n`;
        findings.setupModes.forEach((finding, index) => {
            markdown += `### ${index + 1}. ${finding.mode}\n\n`;
            markdown += `- **Severity:** ${finding.severity}\n`;
            markdown += `- **File:** \`${finding.file}\`\n`;
            markdown += `- **Issue:** ${finding.issue}\n`;
            markdown += `- **Suggestion:** ${finding.suggestion}\n\n`;
        });
    }
    
    // Version References
    if (findings.versions.length > 0) {
        markdown += `## 🔢 Version References Issues\n\n`;
        findings.versions.forEach((finding, index) => {
            markdown += `### ${index + 1}. Version ${finding.version}\n\n`;
            markdown += `- **Severity:** ${finding.severity}\n`;
            markdown += `- **File:** \`${finding.file}\`\n`;
            markdown += `- **Current Version:** ${finding.current}\n`;
            markdown += `- **Issue:** ${finding.issue}\n`;
            markdown += `- **Suggestion:** ${finding.suggestion}\n\n`;
        });
    }
    
    const outputPath = join(__dirname, 'findings-6-version-accuracy.md');
    require('fs').writeFileSync(outputPath, markdown);
    console.log(`📄 Findings saved to: ${outputPath}\n`);
}

/**
 * Main execution
 */
async function main() {
    console.log('🔍 CouchCMS AI Toolkit - Version Accuracy Audit\n');
    console.log('This audit checks:');
    console.log('  - Feature documentation vs codebase');
    console.log('  - Configuration options vs config-loader.js');
    console.log('  - Setup modes vs init.js');
    console.log('  - Version references vs package.json\n');
    
    auditFeatureDocumentation();
    auditConfigurationOptions();
    auditSetupModes();
    auditVersionReferences();
    
    generateReport();
    saveFindings();
}

main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
