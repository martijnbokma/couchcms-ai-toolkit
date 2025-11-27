#!/usr/bin/env bun
/**
 * Quick Release Script - Solo Developer Edition
 *
 * One command to release a new version without PRs.
 * Perfect for solo developers or small teams.
 *
 * Usage:
 *   bun scripts/quick-release.js 1.0.0
 *   bun scripts/quick-release.js 1.0.0 --skip-changelog
 */

import { $ } from 'bun';
import { readFileSync, writeFileSync } from 'fs';
import { handleError } from './utils.js';

/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        showHelp();
        process.exit(0);
    }

    const version = args[0];
    const skipChangelog = args.includes('--skip-changelog');
    const dryRun = args.includes('--dry-run');

    return { version, skipChangelog, dryRun };
}

/**
 * Show help
 */
function showHelp() {
    console.log(`
🚀 Quick Release - Solo Developer Edition

Usage:
  bun scripts/quick-release.js <version> [options]

Arguments:
  version       Version number (e.g., 1.0.0, 2.1.3)

Options:
  --skip-changelog    Skip changelog update
  --dry-run          Show what would happen without doing it
  --help, -h         Show this help

Examples:
  bun scripts/quick-release.js 1.0.0
  bun scripts/quick-release.js 1.2.0 --skip-changelog
  bun scripts/quick-release.js 2.0.0 --dry-run

What it does:
  1. ✅ Updates package.json version
  2. ✅ Updates CHANGELOG.md (unless --skip-changelog)
  3. ✅ Commits changes
  4. ✅ Merges to master
  5. ✅ Creates and pushes tag
  6. ✅ Merges back to develop
  7. ✅ Pushes everything

All in one command! 🎉
`);
}

/**
 * Validate version format
 */
function validateVersion(version) {
    const versionPattern = /^\d+\.\d+\.\d+$/;
    if (!versionPattern.test(version)) {
        throw new Error(`Invalid version format: ${version}. Use format: MAJOR.MINOR.PATCH (e.g., 1.0.0)`);
    }
}

/**
 * Update package.json version
 */
function updatePackageVersion(version) {
    const packagePath = 'package.json';
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    const oldVersion = packageJson.version;
    
    packageJson.version = version;
    writeFileSync(packagePath, JSON.stringify(packageJson, null, 4) + '\n');
    
    return oldVersion;
}

/**
 * Update CHANGELOG.md
 */
function updateChangelog(version) {
    const changelogPath = 'CHANGELOG.md';
    const today = new Date().toISOString().split('T')[0];
    
    let changelog = '';
    try {
        changelog = readFileSync(changelogPath, 'utf8');
    } catch {
        // Create new changelog if it doesn't exist
        changelog = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
    }

    // Add new version entry at the top (after header)
    const lines = changelog.split('\n');
    const headerEnd = lines.findIndex(line => line.startsWith('## '));
    const insertIndex = headerEnd === -1 ? 3 : headerEnd;

    const newEntry = `## [${version}] - ${today}

### Added
- 

### Changed
- 

### Fixed
- 

`;

    lines.splice(insertIndex, 0, newEntry);
    writeFileSync(changelogPath, lines.join('\n'));
    
    console.log('\n📝 CHANGELOG.md updated with template.');
    console.log('   Please edit CHANGELOG.md to add release notes, then press Enter to continue...');
    
    // Wait for user to edit
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        readline.question('', () => {
            readline.close();
            resolve();
        });
    });
}

/**
 * Main release function
 */
async function quickRelease(version, options) {
    console.log(`🚀 Quick Release v${version}\n`);

    // Validate version
    validateVersion(version);

    // Check if we're in a git repository
    try {
        await $`git rev-parse --git-dir`.quiet();
    } catch {
        throw new Error('Not a git repository. Run this from the project root.');
    }

    // Check for uncommitted changes
    const status = await $`git status --porcelain`.quiet();
    if (status.stdout.toString().trim()) {
        console.log('⚠️  You have uncommitted changes:');
        console.log(status.stdout.toString());
        console.log('\nPlease commit or stash them first.\n');
        process.exit(1);
    }

    if (options.dryRun) {
        console.log('🔍 DRY RUN - No changes will be made\n');
    }

    // Step 1: Update package.json
    console.log('📦 Step 1: Updating package.json...');
    const oldVersion = updatePackageVersion(version);
    console.log(`   ${oldVersion} → ${version}\n`);

    // Step 2: Update CHANGELOG.md
    if (!options.skipChangelog) {
        console.log('📝 Step 2: Updating CHANGELOG.md...');
        await updateChangelog(version);
        console.log('   ✅ CHANGELOG.md updated\n');
    } else {
        console.log('⏭️  Step 2: Skipping CHANGELOG.md\n');
    }

    if (options.dryRun) {
        console.log('✅ Dry run complete. No changes were made.\n');
        // Restore package.json
        const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
        packageJson.version = oldVersion;
        writeFileSync('package.json', JSON.stringify(packageJson, null, 4) + '\n');
        return;
    }

    // Step 3: Commit changes
    console.log('💾 Step 3: Committing changes...');
    await $`git add package.json CHANGELOG.md`.quiet();
    await $`git commit -m "chore: Release v${version}"`.quiet();
    console.log('   ✅ Changes committed\n');

    // Step 4: Merge to master
    console.log('🔀 Step 4: Merging to master...');
    const currentBranch = (await $`git rev-parse --abbrev-ref HEAD`.quiet()).stdout.toString().trim();
    
    // Check if master or main exists
    let mainBranch = 'main';
    try {
        await $`git rev-parse --verify main`.quiet();
    } catch {
        try {
            await $`git rev-parse --verify master`.quiet();
            mainBranch = 'master';
        } catch {
            throw new Error('Neither main nor master branch exists');
        }
    }
    
    await $`git checkout ${mainBranch}`.quiet();
    await $`git merge ${currentBranch} --no-ff -m "Merge release v${version}"`.quiet();
    console.log(`   ✅ Merged to ${mainBranch}\n`);

    // Step 5: Create and push tag
    console.log('🏷️  Step 5: Creating tag...');
    await $`git tag -a v${version} -m "Release v${version}"`.quiet();
    console.log(`   ✅ Tag v${version} created\n`);

    // Step 6: Push master and tag
    console.log('📤 Step 6: Pushing to remote...');
    await $`git push origin ${mainBranch}`.quiet();
    await $`git push origin v${version}`.quiet();
    console.log(`   ✅ Pushed ${mainBranch} and tag\n`);

    // Step 7: Merge back to develop
    console.log('🔀 Step 7: Merging back to develop...');
    await $`git checkout develop`.quiet();
    await $`git merge ${mainBranch} --no-ff -m "Merge release v${version} back to develop"`.quiet();
    await $`git push origin develop`.quiet();
    console.log('   ✅ Merged back to develop\n');

    // Done!
    console.log('🎉 Release v' + version + ' complete!\n');
    console.log('Summary:');
    console.log(`  ✅ Version bumped: ${oldVersion} → ${version}`);
    console.log(`  ✅ Tag created: v${version}`);
    console.log(`  ✅ Pushed to ${mainBranch}`);
    console.log('  ✅ Merged back to develop\n');
    
    console.log('Next steps:');
    console.log('  1. Check GitHub releases: https://github.com/martijnbokma/couchcms-ai-toolkit/releases');
    console.log('  2. Verify the tag: git tag -l');
    console.log(`  3. View on GitHub: https://github.com/martijnbokma/couchcms-ai-toolkit/releases/tag/v${version}\n`);
}

/**
 * Main function
 */
async function main() {
    try {
        const { version, skipChangelog, dryRun } = parseArgs();
        await quickRelease(version, { skipChangelog, dryRun });
        process.exit(0);
    } catch (error) {
        handleError(error, 'Quick release');
    }
}

// Run
main();
