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
    
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }

    const version = args.find(arg => !arg.startsWith('--')) || null;
    const skipChangelog = args.includes('--skip-changelog');
    const dryRun = args.includes('--dry-run');
    const auto = args.includes('--auto') || version === null;
    const bumpType = args.includes('--major') ? 'major' : 
                     args.includes('--minor') ? 'minor' : 
                     args.includes('--patch') ? 'patch' : null;

    return { version, skipChangelog, dryRun, auto, bumpType };
}

/**
 * Show help
 */
function showHelp() {
    console.log(`
🚀 Quick Release - Solo Developer Edition

Usage:
  bun scripts/quick-release.js [version] [options]

Arguments:
  version       Version number (e.g., 1.0.0, 2.1.3) - optional if using --auto

Options:
  --auto             Auto-detect version bump from commits (default if no version)
  --major            Force major version bump (X.0.0)
  --minor            Force minor version bump (0.X.0)
  --patch            Force patch version bump (0.0.X)
  --skip-changelog   Skip changelog update
  --dry-run          Show what would happen without doing it
  --help, -h         Show this help

Examples:
  # Auto-detect version from commits (recommended)
  bun scripts/quick-release.js --auto
  bun scripts/quick-release.js  # same as --auto

  # Specify version manually
  bun scripts/quick-release.js 2.1.0

  # Force specific bump type
  bun scripts/quick-release.js --major  # 2.0.0 → 3.0.0
  bun scripts/quick-release.js --minor  # 2.0.0 → 2.1.0
  bun scripts/quick-release.js --patch  # 2.0.0 → 2.0.1

  # Dry run
  bun scripts/quick-release.js --auto --dry-run

Auto-detection rules:
  - BREAKING CHANGE in commits → Major bump (X.0.0)
  - feat: commits → Minor bump (0.X.0)
  - fix: commits → Patch bump (0.0.X)
  - No significant changes → Patch bump (0.0.X)

What it does:
  1. ✅ Determines version (auto or manual)
  2. ✅ Updates package.json version
  3. ✅ Updates CHANGELOG.md (unless --skip-changelog)
  4. ✅ Commits changes
  5. ✅ Merges to master
  6. ✅ Creates and pushes tag
  7. ✅ Merges back to develop
  8. ✅ Pushes everything

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
 * Get current version from package.json
 */
function getCurrentVersion() {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    return packageJson.version;
}

/**
 * Parse version string to components
 */
function parseVersion(version) {
    const [major, minor, patch] = version.split('.').map(Number);
    return { major, minor, patch };
}

/**
 * Bump version based on type
 */
function bumpVersion(currentVersion, bumpType) {
    const { major, minor, patch } = parseVersion(currentVersion);
    
    switch (bumpType) {
        case 'major':
            return `${major + 1}.0.0`;
        case 'minor':
            return `${major}.${minor + 1}.0`;
        case 'patch':
            return `${major}.${minor}.${patch + 1}`;
        default:
            throw new Error(`Invalid bump type: ${bumpType}`);
    }
}

/**
 * Get commits since last tag
 */
async function getCommitsSinceLastTag() {
    try {
        // Get last tag
        const lastTagResult = await $`git describe --tags --abbrev=0`;
        const lastTag = lastTagResult.stdout.toString().trim();
        // Get commits since last tag
        const commitsResult = await $`git log ${lastTag}..HEAD --pretty=format:"%s"`;
        const commits = commitsResult.stdout.toString().trim();
        return commits.split('\n').filter(c => c);
    } catch {
        // No tags yet, get all commits
        const commitsResult = await $`git log --pretty=format:"%s"`;
        const commits = commitsResult.stdout.toString().trim();
        return commits.split('\n').filter(c => c);
    }
}

/**
 * Determine version bump type from commits
 */
function determineBumpType(commits) {
    let hasBreaking = false;
    let hasFeat = false;
    let hasFix = false;

    commits.forEach(commit => {
        const lower = commit.toLowerCase();
        
        // Check for breaking changes
        if (lower.includes('breaking change') || 
            lower.includes('breaking:') ||
            commit.includes('!:')) {
            hasBreaking = true;
        }
        
        // Check for features
        if (lower.startsWith('feat:') || lower.startsWith('feature:')) {
            hasFeat = true;
        }
        
        // Check for fixes
        if (lower.startsWith('fix:')) {
            hasFix = true;
        }
    });

    // Determine bump type based on conventional commits
    if (hasBreaking) {
        return 'major';
    } else if (hasFeat) {
        return 'minor';
    } else if (hasFix) {
        return 'patch';
    } else {
        // Default to patch for other changes
        return 'patch';
    }
}

/**
 * Auto-determine next version
 */
async function autoDetectVersion(forceBumpType = null) {
    const currentVersion = getCurrentVersion();
    const commits = await getCommitsSinceLastTag();
    
    if (commits.length === 0) {
        console.log('⚠️  No commits since last tag. Using patch bump.');
        return bumpVersion(currentVersion, 'patch');
    }

    const bumpType = forceBumpType || determineBumpType(commits);
    const newVersion = bumpVersion(currentVersion, bumpType);
    
    console.log(`📊 Version Analysis:`);
    console.log(`   Current: ${currentVersion}`);
    console.log(`   Commits: ${commits.length}`);
    console.log(`   Bump type: ${bumpType}`);
    console.log(`   New version: ${newVersion}\n`);
    
    return newVersion;
}

/**
 * Categorize commits by type
 */
function categorizeCommits(commits) {
    const categories = {
        added: [],
        changed: [],
        fixed: [],
        other: []
    };

    commits.forEach(commit => {
        const lower = commit.toLowerCase();
        if (lower.startsWith('feat:') || lower.startsWith('add:') || lower.includes('added')) {
            categories.added.push(commit.replace(/^(feat|add):\s*/i, ''));
        } else if (lower.startsWith('fix:') || lower.includes('fixed')) {
            categories.fixed.push(commit.replace(/^fix:\s*/i, ''));
        } else if (lower.startsWith('change:') || lower.startsWith('update:') || lower.includes('changed')) {
            categories.changed.push(commit.replace(/^(change|update):\s*/i, ''));
        } else if (!lower.startsWith('chore:') && !lower.startsWith('docs:')) {
            // Skip chore and docs commits
            categories.other.push(commit);
        }
    });

    return categories;
}

/**
 * Update CHANGELOG.md with auto-generated content
 */
async function updateChangelog(version) {
    const changelogPath = 'CHANGELOG.md';
    const today = new Date().toISOString().split('T')[0];
    
    let changelog = '';
    try {
        changelog = readFileSync(changelogPath, 'utf8');
    } catch {
        // Create new changelog if it doesn't exist
        changelog = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
    }

    // Get commits and categorize
    console.log('   📝 Analyzing commits...');
    const commits = await getCommitsSinceLastTag();
    const categories = categorizeCommits(commits);

    // Build changelog entry
    let newEntry = `## [${version}] - ${today}\n\n`;

    if (categories.added.length > 0) {
        newEntry += '### Added\n';
        categories.added.forEach(commit => {
            newEntry += `- ${commit}\n`;
        });
        newEntry += '\n';
    }

    if (categories.changed.length > 0) {
        newEntry += '### Changed\n';
        categories.changed.forEach(commit => {
            newEntry += `- ${commit}\n`;
        });
        newEntry += '\n';
    }

    if (categories.fixed.length > 0) {
        newEntry += '### Fixed\n';
        categories.fixed.forEach(commit => {
            newEntry += `- ${commit}\n`;
        });
        newEntry += '\n';
    }

    if (categories.other.length > 0) {
        newEntry += '### Other\n';
        categories.other.forEach(commit => {
            newEntry += `- ${commit}\n`;
        });
        newEntry += '\n';
    }

    // If no categorized commits, add a generic entry
    if (categories.added.length === 0 && categories.changed.length === 0 && 
        categories.fixed.length === 0 && categories.other.length === 0) {
        newEntry += '### Changed\n- Version bump and improvements\n\n';
    }

    // Add new version entry at the top (after header)
    const lines = changelog.split('\n');
    const headerEnd = lines.findIndex(line => line.startsWith('## '));
    const insertIndex = headerEnd === -1 ? 3 : headerEnd;

    lines.splice(insertIndex, 0, newEntry);
    writeFileSync(changelogPath, lines.join('\n'));
    
    console.log('   ✅ CHANGELOG.md auto-generated from commits');
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
        await $`git rev-parse --git-dir`;
    } catch {
        throw new Error('Not a git repository. Run this from the project root.');
    }

    // Check for uncommitted changes
    const statusResult = await $`git status --porcelain`;
    if (statusResult.stdout.toString().trim()) {
        console.log('⚠️  You have uncommitted changes:');
        console.log(statusResult.stdout.toString());
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
    await $`git add package.json CHANGELOG.md`;
    await $`git commit -m "chore: Release v${version}"`;
    console.log('   ✅ Changes committed\n');

    // Step 4: Merge to master
    console.log('🔀 Step 4: Merging to master...');
    const currentBranchResult = await $`git rev-parse --abbrev-ref HEAD`;
    const currentBranch = currentBranchResult.stdout.toString().trim();
    
    // Check if master or main exists
    let mainBranch = 'main';
    try {
        await $`git rev-parse --verify main`;
    } catch {
        try {
            await $`git rev-parse --verify master`;
            mainBranch = 'master';
        } catch {
            throw new Error('Neither main nor master branch exists');
        }
    }
    
    await $`git checkout ${mainBranch}`;
    await $`git merge ${currentBranch} --no-ff -m "Merge release v${version}"`;
    console.log(`   ✅ Merged to ${mainBranch}\n`);

    // Step 5: Create and push tag
    console.log('🏷️  Step 5: Creating tag...');
    const tagName = `v${version}`;
    
    // Check if tag already exists
    try {
        await $`git rev-parse ${tagName}`;
        console.log(`   ⚠️  Tag ${tagName} already exists, skipping creation\n`);
    } catch {
        // Tag doesn't exist, create it
        await $`git tag -a ${tagName} -m "Release v${version}"`;
        console.log(`   ✅ Tag ${tagName} created\n`);
    }

    // Step 6: Push master and tag
    console.log('📤 Step 6: Pushing to remote...');
    await $`git push origin ${mainBranch}`;
    
    // Check if tag exists on remote before pushing
    try {
        await $`git ls-remote --tags origin ${tagName}`;
        console.log(`   ⚠️  Tag ${tagName} already exists on remote, skipping push\n`);
    } catch {
        // Tag doesn't exist on remote, push it
        await $`git push origin ${tagName}`;
        console.log(`   ✅ Pushed tag ${tagName}\n`);
    }
    
    console.log(`   ✅ Pushed ${mainBranch}\n`);

    // Step 7: Merge back to develop
    console.log('🔀 Step 7: Merging back to develop...');
    try {
        await $`git checkout develop`;
    } catch (error) {
        throw new Error(`Failed to checkout develop branch: ${error.message}`);
    }
    
    // Check if develop is already up to date
    try {
        await $`git merge ${mainBranch} --no-ff -m "Merge release v${version} back to develop"`;
        console.log('   ✅ Merged back to develop\n');
    } catch (error) {
        // Check if it's a merge conflict
        const statusResult = await $`git status --porcelain`;
        const statusOutput = statusResult.stdout.toString();
        if (statusOutput.includes('UU') || statusOutput.includes('both modified')) {
            console.log('   ⚠️  Merge conflicts detected!\n');
            console.log('   Please resolve conflicts manually:');
            console.log('   1. Fix conflicts in the files listed above');
            console.log('   2. Run: git add .');
            console.log(`   3. Run: git commit -m "Merge release v${version} back to develop"`);
            console.log('   4. Run: git push origin develop\n');
            throw new Error('Merge conflicts detected. Please resolve manually.');
        } else if (error.message.includes('Already up to date') || error.stderr?.toString().includes('Already up to date')) {
            console.log('   ℹ️  Develop is already up to date with master\n');
        } else {
            throw error;
        }
    }
    
    try {
        await $`git push origin develop`;
        console.log('   ✅ Pushed develop to remote\n');
    } catch (error) {
        // If push fails, it might be because there's nothing to push
        if (error.message.includes('Everything up-to-date') || error.stderr?.toString().includes('Everything up-to-date')) {
            console.log('   ℹ️  Develop is already up to date on remote\n');
        } else {
            throw error;
        }
    }

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
        const { version, skipChangelog, dryRun, auto, bumpType } = parseArgs();
        
        // Determine version
        let finalVersion = version;
        if (auto || !version) {
            finalVersion = await autoDetectVersion(bumpType);
        }
        
        await quickRelease(finalVersion, { skipChangelog, dryRun });
        process.exit(0);
    } catch (error) {
        handleError(error, 'Quick release');
    }
}

// Run
main();
