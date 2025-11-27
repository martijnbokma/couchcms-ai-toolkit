#!/usr/bin/env bun
/**
 * Feature Workflow - Feature Branch Operations
 *
 * Implements the feature branch workflow for Gitflow.
 */

import { ToolkitError } from '../utils.js';
import {
    createBranch,
    checkoutBranch,
    deleteBranch,
    deleteRemoteBranch,
    pushBranch,
    getCurrentBranch,
    branchExists,
    remoteBranchExists,
    listBranches,
    getBranchAge,
    getLastCommitDate
} from './git-wrapper.js';
import {
    validateFeatureName,
    validateWorkflowState,
    validateBranchExists,
    getBranchType,
    findStaleBranches
} from './validation.js';

/**
 * Start a new feature branch
 * @param {string} name - Feature name (without 'feature/' prefix)
 * @param {Object} options - Options
 * @returns {Promise<Object>} - Result object
 */
export async function startFeature(name, options = {}) {
    console.log(`🚀 Starting feature: ${name}\n`);

    // Validate feature name
    const nameValidation = validateFeatureName(name);
    if (!nameValidation.valid) {
        throw new ToolkitError(
            `Invalid feature name:\n${nameValidation.errors.map(e => `  - ${e}`).join('\n')}`,
            'INVALID_FEATURE_NAME'
        );
    }

    // Show warnings
    if (nameValidation.warnings.length > 0) {
        console.log('⚠️  Warnings:');
        nameValidation.warnings.forEach(w => console.log(`  - ${w}`));
        console.log();
    }

    // Validate workflow state
    const stateValidation = await validateWorkflowState('feature-start');
    if (!stateValidation.valid) {
        throw new ToolkitError(
            `Cannot start feature:\n${stateValidation.errors.map(e => `  - ${e}`).join('\n')}`,
            'INVALID_WORKFLOW_STATE'
        );
    }

    // Show state warnings
    if (stateValidation.warnings.length > 0) {
        console.log('⚠️  Warnings:');
        stateValidation.warnings.forEach(w => console.log(`  - ${w}`));
        console.log();
    }

    // Construct full branch name
    const branchName = `feature/${name}`;

    // Check if branch already exists
    const existsValidation = await validateBranchExists(branchName, false);
    if (!existsValidation.valid) {
        throw new ToolkitError(
            `Feature branch '${branchName}' already exists`,
            'BRANCH_EXISTS'
        );
    }

    // Create branch from develop
    console.log('📝 Creating feature branch from develop...');
    await createBranch(branchName, 'develop');

    console.log(`✅ Feature branch '${branchName}' created successfully!\n`);
    console.log('Next steps:');
    console.log('  1. Make your changes');
    console.log('  2. Commit regularly: git add . && git commit -m "message"');
    console.log(`  3. When done: bun scripts/git-flow.js feature finish ${name}\n`);

    return {
        success: true,
        branchName,
        message: `Feature '${name}' started successfully`
    };
}

/**
 * Finish a feature branch (create PR)
 * @param {string} name - Feature name (without 'feature/' prefix)
 * @param {Object} options - Options
 * @returns {Promise<Object>} - Result object
 */
export async function finishFeature(name, options = {}) {
    console.log(`🏁 Finishing feature: ${name}\n`);

    const branchName = `feature/${name}`;

    // Check if branch exists
    const existsValidation = await validateBranchExists(branchName, true);
    if (!existsValidation.valid) {
        throw new ToolkitError(
            `Feature branch '${branchName}' does not exist`,
            'BRANCH_NOT_FOUND'
        );
    }

    // Switch to feature branch if not already on it
    const currentBranch = await getCurrentBranch();
    if (currentBranch !== branchName) {
        console.log(`📝 Switching to ${branchName}...`);
        await checkoutBranch(branchName);
    }

    // Check for uncommitted changes
    const stateValidation = await validateWorkflowState('feature-finish');
    if (!stateValidation.valid) {
        throw new ToolkitError(
            `Cannot finish feature:\n${stateValidation.errors.map(e => `  - ${e}`).join('\n')}`,
            'INVALID_WORKFLOW_STATE'
        );
    }

    // Push branch to remote
    console.log('📤 Pushing branch to remote...');
    await pushBranch(branchName, 'origin', true);

    console.log(`✅ Feature branch '${branchName}' pushed successfully!\n`);
    console.log('📋 Next steps:');
    console.log('  1. A Pull Request should be created automatically');
    console.log('  2. If not, create one manually on GitHub:');
    console.log(`     - Base: develop`);
    console.log(`     - Compare: ${branchName}`);
    console.log('  3. Wait for code review and approval');
    console.log('  4. After merge, the branch will be deleted automatically\n');

    return {
        success: true,
        branchName,
        message: `Feature '${name}' ready for review`,
        prUrl: null // Will be set by GitHub integration
    };
}

/**
 * List all feature branches
 * @param {Object} options - Options
 * @returns {Promise<Array>} - Array of feature branch info
 */
export async function listFeatures(options = {}) {
    console.log('📋 Feature branches:\n');

    const branches = await listBranches('local');
    const features = [];

    for (const branch of branches) {
        if (getBranchType(branch) === 'feature') {
            const age = await getBranchAge(branch);
            const lastCommitDate = await getLastCommitDate(branch);
            const isStale = age > 30;

            features.push({
                name: branch,
                age,
                lastCommitDate,
                isStale
            });
        }
    }

    if (features.length === 0) {
        console.log('  No feature branches found.\n');
        return [];
    }

    // Sort by age (newest first)
    features.sort((a, b) => a.age - b.age);

    // Display features
    features.forEach(feature => {
        const staleIndicator = feature.isStale ? '⚠️  ' : '   ';
        const ageStr = feature.age === 0 ? 'today' : 
                       feature.age === 1 ? '1 day ago' : 
                       `${feature.age} days ago`;
        
        console.log(`${staleIndicator}${feature.name}`);
        console.log(`     Last commit: ${ageStr}`);
        console.log();
    });

    // Show stale warning
    const staleCount = features.filter(f => f.isStale).length;
    if (staleCount > 0) {
        console.log(`⚠️  ${staleCount} branch(es) are older than 30 days\n`);
    }

    return features;
}

/**
 * Delete a feature branch
 * @param {string} name - Feature name (without 'feature/' prefix)
 * @param {Object} options - Options
 * @returns {Promise<Object>} - Result object
 */
export async function deleteFeature(name, options = {}) {
    const branchName = `feature/${name}`;
    const force = options.force || false;

    console.log(`🗑️  Deleting feature: ${name}\n`);

    // Check if branch exists
    const existsValidation = await validateBranchExists(branchName, true);
    if (!existsValidation.valid) {
        throw new ToolkitError(
            `Feature branch '${branchName}' does not exist`,
            'BRANCH_NOT_FOUND'
        );
    }

    // Make sure we're not on the branch we're deleting
    const currentBranch = await getCurrentBranch();
    if (currentBranch === branchName) {
        console.log('📝 Switching to develop...');
        await checkoutBranch('develop');
    }

    // Delete local branch
    console.log('🗑️  Deleting local branch...');
    await deleteBranch(branchName, force);

    // Delete remote branch if it exists
    const remoteExists = await remoteBranchExists(branchName);
    if (remoteExists) {
        console.log('🗑️  Deleting remote branch...');
        try {
            await deleteRemoteBranch(branchName);
        } catch (error) {
            console.log(`⚠️  Could not delete remote branch: ${error.message}`);
        }
    }

    console.log(`✅ Feature branch '${branchName}' deleted successfully!\n`);

    return {
        success: true,
        branchName,
        message: `Feature '${name}' deleted`
    };
}

/**
 * Check for stale feature branches
 * @param {number} maxDays - Maximum age in days (default: 30)
 * @returns {Promise<Array>} - Array of stale feature branches
 */
export async function checkStaleFeatures(maxDays = 30) {
    console.log(`🔍 Checking for feature branches older than ${maxDays} days...\n`);

    const staleFeatures = await findStaleBranches(maxDays, 'feature');

    if (staleFeatures.length === 0) {
        console.log('✅ No stale feature branches found.\n');
        return [];
    }

    console.log(`⚠️  Found ${staleFeatures.length} stale feature branch(es):\n`);

    staleFeatures.forEach(feature => {
        const ageStr = `${feature.age} days ago`;
        console.log(`  ${feature.name}`);
        console.log(`    Last commit: ${ageStr}`);
        console.log(`    Consider: Finish, rebase, or delete this branch\n`);
    });

    console.log('💡 To delete a stale branch:');
    console.log('   bun scripts/git-flow.js feature delete <name>\n');

    return staleFeatures;
}

/**
 * Get feature branch status
 * @param {string} name - Feature name (without 'feature/' prefix)
 * @returns {Promise<Object>} - Status object
 */
export async function getFeatureStatus(name) {
    const branchName = `feature/${name}`;

    // Check if branch exists
    const exists = await branchExists(branchName);
    if (!exists) {
        throw new ToolkitError(
            `Feature branch '${branchName}' does not exist`,
            'BRANCH_NOT_FOUND'
        );
    }

    const age = await getBranchAge(branchName);
    const lastCommitDate = await getLastCommitDate(branchName);
    const isStale = age > 30;
    const remoteExists = await remoteBranchExists(branchName);

    return {
        name: branchName,
        exists,
        age,
        lastCommitDate,
        isStale,
        pushedToRemote: remoteExists
    };
}
