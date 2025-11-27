#!/usr/bin/env bun
/**
 * Hotfix Workflow - Hotfix Branch Operations
 *
 * Implements the hotfix branch workflow for Gitflow.
 */

import { ToolkitError } from '../utils/utils.js';
import {
    createBranch,
    pushBranch,
    createTag,
    pushTag,
    branchExists,
    listBranches,
    getLatestTag
} from './git-wrapper.js';
import {
    validateHotfixName,
    validateWorkflowState,
    validateBranchExists
} from './validation.js';

/**
 * Parse version and increment patch
 * @param {string} version - Current version (e.g., "v1.2.3")
 * @returns {string} - Next patch version (e.g., "v1.2.4")
 */
function incrementPatchVersion(version) {
    const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
    if (!match) {
        throw new Error(`Invalid version format: ${version}`);
    }
    
    const [, major, minor, patch] = match;
    const nextPatch = parseInt(patch) + 1;
    return `v${major}.${minor}.${nextPatch}`;
}

/**
 * Start a new hotfix branch
 * @param {string} name - Hotfix name (without 'hotfix/' prefix)
 * @param {Object} options - Options
 * @returns {Promise<Object>} - Result object
 */
export async function startHotfix(name, options = {}) {
    console.log(`🚨 Starting hotfix: ${name}\n`);

    // Validate hotfix name
    const nameValidation = validateHotfixName(name);
    if (!nameValidation.valid) {
        throw new ToolkitError(
            `Invalid hotfix name:\n${nameValidation.errors.map(e => `  - ${e}`).join('\n')}`,
            'INVALID_HOTFIX_NAME'
        );
    }

    // Show warnings
    if (nameValidation.warnings.length > 0) {
        console.log('⚠️  Warnings:');
        nameValidation.warnings.forEach(w => console.log(`  - ${w}`));
        console.log();
    }

    // Validate workflow state
    const stateValidation = await validateWorkflowState('hotfix-start');
    if (!stateValidation.valid) {
        throw new ToolkitError(
            `Cannot start hotfix:\n${stateValidation.errors.map(e => `  - ${e}`).join('\n')}`,
            'INVALID_WORKFLOW_STATE'
        );
    }

    const branchName = `hotfix/${name}`;

    // Check if branch already exists
    const existsValidation = await validateBranchExists(branchName, false);
    if (!existsValidation.valid) {
        throw new ToolkitError(
            `Hotfix branch '${branchName}' already exists`,
            'BRANCH_EXISTS'
        );
    }

    // Get latest tag for reference
    const latestTag = await getLatestTag();
    if (latestTag) {
        console.log(`📌 Current production version: ${latestTag}`);
        const nextVersion = incrementPatchVersion(latestTag);
        console.log(`📌 Next version will be: ${nextVersion}\n`);
    }

    // Create branch from main
    console.log('📝 Creating hotfix branch from main...');
    await createBranch(branchName, 'main');

    console.log(`✅ Hotfix branch '${branchName}' created successfully!\n`);
    console.log('⚡ URGENT - Next steps:');
    console.log('  1. Fix the critical bug');
    console.log('  2. Test thoroughly');
    console.log('  3. Commit the fix');
    console.log(`  4. When ready: bun scripts/git-flow.js hotfix finish ${name}\n`);
    console.log('💡 Remember: Hotfixes are for CRITICAL production bugs only!\n');

    return {
        success: true,
        branchName,
        message: `Hotfix '${name}' started successfully`
    };
}

/**
 * Finish a hotfix branch (create PRs and tag)
 * @param {string} name - Hotfix name
 * @param {Object} options - Options
 * @returns {Promise<Object>} - Result object
 */
export async function finishHotfix(name, options = {}) {
    console.log(`🏁 Finishing hotfix: ${name}\n`);

    const branchName = `hotfix/${name}`;

    // Check if branch exists
    const existsValidation = await validateBranchExists(branchName, true);
    if (!existsValidation.valid) {
        throw new ToolkitError(
            `Hotfix branch '${branchName}' does not exist`,
            'BRANCH_NOT_FOUND'
        );
    }

    // Check for uncommitted changes
    const stateValidation = await validateWorkflowState('hotfix-finish');
    if (!stateValidation.valid) {
        throw new ToolkitError(
            `Cannot finish hotfix:\n${stateValidation.errors.map(e => `  - ${e}`).join('\n')}`,
            'INVALID_WORKFLOW_STATE'
        );
    }

    // Get latest tag and calculate next version
    const latestTag = await getLatestTag();
    const nextVersion = latestTag ? incrementPatchVersion(latestTag) : 'v0.0.1';

    // Push branch to remote
    console.log('📤 Pushing hotfix branch to remote...');
    await pushBranch(branchName, 'origin', true);

    // Create tag
    console.log(`🏷️  Creating tag ${nextVersion}...`);
    await createTag(nextVersion, `Hotfix: ${name}`);
    await pushTag(nextVersion);

    console.log(`✅ Hotfix '${name}' prepared successfully!\n`);
    console.log('📋 Next steps:');
    console.log('  1. Create Pull Request to main:');
    console.log(`     - Base: main`);
    console.log(`     - Compare: ${branchName}`);
    console.log('  2. Create Pull Request to develop:');
    console.log(`     - Base: develop`);
    console.log(`     - Compare: ${branchName}`);
    console.log('  3. If release branch exists, also merge there');
    console.log('  4. After all PRs are merged:');
    console.log('     - Hotfix will be live');
    console.log('     - Branch will be deleted');
    console.log(`     - Version ${nextVersion} deployed!\n`);

    return {
        success: true,
        branchName,
        version: nextVersion,
        message: `Hotfix '${name}' ready for deployment`
    };
}

/**
 * List all hotfix branches
 * @returns {Promise<Array>} - Array of hotfix branches
 */
export async function listHotfixes() {
    console.log('🚨 Hotfix branches:\n');

    const branches = await listBranches('local');
    const hotfixes = branches.filter(b => b.startsWith('hotfix/'));

    if (hotfixes.length === 0) {
        console.log('  No active hotfix branches.\n');
        return [];
    }

    hotfixes.forEach(hotfix => {
        console.log(`  ${hotfix}`);
    });
    console.log();

    return hotfixes;
}
