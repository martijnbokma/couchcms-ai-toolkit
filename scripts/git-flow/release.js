#!/usr/bin/env bun
/**
 * Release Workflow - Release Branch Operations
 *
 * Implements the release branch workflow for Gitflow.
 */

import { ToolkitError } from '../utils/utils.js';
import {
    createBranch,
    pushBranch,
    createTag,
    pushTag,
    getCurrentBranch,
    branchExists,
    getLatestTag,
    listBranches
} from './git-wrapper.js';
import {
    validateReleaseVersion,
    validateWorkflowState,
    validateBranchExists
} from './validation.js';

/**
 * Start a new release branch
 * @param {string} version - Version number (e.g., "1.2.0" or "v1.2.0")
 * @param {Object} options - Options
 * @returns {Promise<Object>} - Result object
 */
export async function startRelease(version, options = {}) {
    console.log(`📦 Starting release: ${version}\n`);

    // Validate version
    const versionValidation = validateReleaseVersion(version);
    if (!versionValidation.valid) {
        throw new ToolkitError(
            `Invalid version:\n${versionValidation.errors.map(e => `  - ${e}`).join('\n')}`,
            'INVALID_VERSION'
        );
    }

    // Show warnings
    if (versionValidation.warnings.length > 0) {
        console.log('⚠️  Warnings:');
        versionValidation.warnings.forEach(w => console.log(`  - ${w}`));
        console.log();
    }

    // Validate workflow state
    const stateValidation = await validateWorkflowState('release-start');
    if (!stateValidation.valid) {
        throw new ToolkitError(
            `Cannot start release:\n${stateValidation.errors.map(e => `  - ${e}`).join('\n')}`,
            'INVALID_WORKFLOW_STATE'
        );
    }

    const cleanVersion = versionValidation.version.string;
    const branchName = `release/${cleanVersion}`;

    // Check if branch already exists
    const existsValidation = await validateBranchExists(branchName, false);
    if (!existsValidation.valid) {
        throw new ToolkitError(
            `Release branch '${branchName}' already exists`,
            'BRANCH_EXISTS'
        );
    }

    // Get latest tag for reference
    const latestTag = await getLatestTag();
    if (latestTag) {
        console.log(`📌 Latest release: ${latestTag}\n`);
    }

    // Create branch from develop
    console.log('📝 Creating release branch from develop...');
    await createBranch(branchName, 'develop');

    console.log(`✅ Release branch '${branchName}' created successfully!\n`);
    console.log('Next steps:');
    console.log('  1. Update version in package.json');
    console.log('  2. Update CHANGELOG.md');
    console.log('  3. Make any final bug fixes');
    console.log('  4. Test thoroughly');
    console.log(`  5. When ready: bun scripts/git-flow.js release finish ${cleanVersion}\n`);

    return {
        success: true,
        branchName,
        version: cleanVersion,
        message: `Release ${cleanVersion} started successfully`
    };
}

/**
 * Finish a release branch (create PRs and tag)
 * @param {string} version - Version number
 * @param {Object} options - Options
 * @returns {Promise<Object>} - Result object
 */
export async function finishRelease(version, options = {}) {
    console.log(`🏁 Finishing release: ${version}\n`);

    const versionValidation = validateReleaseVersion(version);
    if (!versionValidation.valid) {
        throw new ToolkitError(
            `Invalid version: ${version}`,
            'INVALID_VERSION'
        );
    }

    const cleanVersion = versionValidation.version.string;
    const branchName = `release/${cleanVersion}`;
    const tagName = `v${cleanVersion}`;

    // Check if branch exists
    const existsValidation = await validateBranchExists(branchName, true);
    if (!existsValidation.valid) {
        throw new ToolkitError(
            `Release branch '${branchName}' does not exist`,
            'BRANCH_NOT_FOUND'
        );
    }

    // Check for uncommitted changes
    const stateValidation = await validateWorkflowState('release-finish');
    if (!stateValidation.valid) {
        throw new ToolkitError(
            `Cannot finish release:\n${stateValidation.errors.map(e => `  - ${e}`).join('\n')}`,
            'INVALID_WORKFLOW_STATE'
        );
    }

    // Push branch to remote
    console.log('📤 Pushing release branch to remote...');
    await pushBranch(branchName, 'origin', true);

    // Create tag
    console.log(`🏷️  Creating tag ${tagName}...`);
    await createTag(tagName, `Release ${cleanVersion}`);
    await pushTag(tagName);

    console.log(`✅ Release ${cleanVersion} prepared successfully!\n`);
    console.log('📋 Next steps:');
    console.log('  1. Create Pull Request to main:');
    console.log(`     - Base: main`);
    console.log(`     - Compare: ${branchName}`);
    console.log('  2. Create Pull Request to develop:');
    console.log(`     - Base: develop`);
    console.log(`     - Compare: ${branchName}`);
    console.log('  3. After both PRs are merged:');
    console.log('     - Tag will be pushed automatically');
    console.log('     - Release branch will be deleted');
    console.log(`     - Version ${cleanVersion} will be live!\n`);

    return {
        success: true,
        branchName,
        version: cleanVersion,
        tagName,
        message: `Release ${cleanVersion} ready for deployment`
    };
}

/**
 * List all release branches
 * @returns {Promise<Array>} - Array of release branches
 */
export async function listReleases() {
    console.log('📦 Release branches:\n');

    const branches = await listBranches('local');
    const releases = branches.filter(b => b.startsWith('release/'));

    if (releases.length === 0) {
        console.log('  No active release branches.\n');
        return [];
    }

    releases.forEach(release => {
        console.log(`  ${release}`);
    });
    console.log();

    return releases;
}
