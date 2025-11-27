#!/usr/bin/env bun
/**
 * Git Flow Initialization Script
 *
 * Sets up the Gitflow branch structure in the repository.
 * Creates develop branch and ensures main exists.
 */

import { $ } from 'bun';
import { handleError } from '../utils/utils.js';
import { getCurrentBranch, branchExists, remoteBranchExists } from './git-wrapper.js';

/**
 * Check if we're in a git repository
 */
async function isGitRepository() {
    try {
        await $`git rev-parse --git-dir`.quiet();
        return true;
    } catch {
        return false;
    }
}

/**
 * Initialize Gitflow structure
 */
async function initializeGitflow() {
    console.log('🌿 Initializing Gitflow structure...\n');

    // Check if we're in a git repository
    if (!await isGitRepository()) {
        console.error('❌ Error: Not a git repository');
        console.error('   Run this script from the root of your git repository\n');
        process.exit(1);
    }

    // Get current branch
    const currentBranch = await getCurrentBranch();
    console.log(`📍 Current branch: ${currentBranch}\n`);

    // Check if main branch exists
    const mainExists = await branchExists('main');
    const masterExists = await branchExists('master');
    
    let productionBranch = 'main';
    if (!mainExists && masterExists) {
        productionBranch = 'master';
        console.log('📌 Using "master" as production branch');
        console.log('💡 Consider renaming to "main": git branch -m master main\n');
    } else if (!mainExists && !masterExists) {
        console.log('⚠️  No main or master branch found');
        console.log('   Creating main branch...\n');
        await $`git checkout -b main`.quiet();
        productionBranch = 'main';
    } else {
        console.log(`✅ Production branch "${productionBranch}" exists\n`);
    }

    // Check if develop branch exists
    const developExists = await branchExists('develop');
    
    if (developExists) {
        console.log('✅ Develop branch already exists\n');
    } else {
        console.log('📝 Creating develop branch from ' + productionBranch + '...');
        
        // Make sure we're on the production branch
        if (currentBranch !== productionBranch) {
            await $`git checkout ${productionBranch}`.quiet();
        }
        
        // Create develop branch
        await $`git checkout -b develop`.quiet();
        console.log('✅ Develop branch created\n');
        
        // Push to remote if remote exists
        try {
            await $`git remote get-url origin`.quiet();
            console.log('📤 Pushing develop to remote...');
            await $`git push -u origin develop`.quiet();
            console.log('✅ Develop branch pushed to remote\n');
        } catch {
            console.log('💡 No remote configured yet. Push manually when ready:\n');
            console.log('   git push -u origin develop\n');
        }
    }

    // Summary
    console.log('🎉 Gitflow structure initialized!\n');
    console.log('Branch structure:');
    console.log(`  ${productionBranch} → Production (stable, deployed code)`);
    console.log('  develop → Integration (features merge here)\n');
    
    console.log('Next steps:');
    console.log('  1. Set up branch protection (see docs/git-workflow/branch-protection-setup.md)');
    console.log('  2. Start your first feature:');
    console.log('     bun scripts/git-flow.js feature start my-first-feature\n');
    
    console.log('📖 Full documentation: docs/GIT-WORKFLOW.md\n');
}

/**
 * Main function
 */
async function main() {
    try {
        await initializeGitflow();
        process.exit(0);
    } catch (error) {
        handleError(error, 'Gitflow initialization');
    }
}

// Run main function
main();
