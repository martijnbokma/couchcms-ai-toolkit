#!/usr/bin/env bun
/**
 * Git Wrapper - Git Command Utilities
 *
 * Provides wrapper functions for Git operations used in the Gitflow workflow.
 * Uses Bun's shell for executing Git commands with proper error handling.
 */

import { $ } from 'bun';
import { ToolkitError } from '../utils.js';

/**
 * Execute a Git command with error handling
 * @param {string} command - Full git command (e.g., "git rev-parse HEAD")
 * @param {string} errorContext - Context for error messages
 * @returns {Promise<string>} - Command output
 */
async function execGit(command, errorContext) {
    try {
        // Use shell execution for the full command
        const proc = Bun.spawn(command.split(' '), {
            stdout: 'pipe',
            stderr: 'pipe',
        });
        
        const output = await new Response(proc.stdout).text();
        const error = await new Response(proc.stderr).text();
        const exitCode = await proc.exited;
        
        if (exitCode !== 0) {
            throw new Error(error || 'Command failed');
        }
        return output.trim();
    } catch (error) {
        throw new ToolkitError(
            `${errorContext}: ${error.message}`,
            'GIT_COMMAND_FAILED',
            error
        );
    }
}

/**
 * Get current branch name
 * @returns {Promise<string>} - Current branch name
 */
export async function getCurrentBranch() {
    return await execGit(
        'git rev-parse --abbrev-ref HEAD',
        'Failed to get current branch'
    );
}

/**
 * Check if branch exists locally
 * @param {string} branchName - Branch name to check
 * @returns {Promise<boolean>} - True if branch exists
 */
export async function branchExists(branchName) {
    try {
        await execGit(
            `git rev-parse --verify ${branchName}`,
            'Branch check failed'
        );
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if branch exists on remote
 * @param {string} branchName - Branch name to check
 * @param {string} remote - Remote name (default: origin)
 * @returns {Promise<boolean>} - True if branch exists on remote
 */
export async function remoteBranchExists(branchName, remote = 'origin') {
    try {
        await execGit(
            `git ls-remote --heads ${remote} ${branchName}`,
            'Remote branch check failed'
        );
        return true;
    } catch {
        return false;
    }
}

/**
 * Create a new branch from a base branch
 * @param {string} branchName - New branch name
 * @param {string} baseBranch - Base branch to create from
 * @returns {Promise<void>}
 */
export async function createBranch(branchName, baseBranch) {
    // Ensure we're on the base branch
    const currentBranch = await getCurrentBranch();
    if (currentBranch !== baseBranch) {
        await execGit(
            `git checkout ${baseBranch}`,
            `Failed to checkout base branch '${baseBranch}'`
        );
    }

    // Pull latest changes
    await execGit(
        `git pull origin ${baseBranch}`,
        `Failed to pull latest changes from '${baseBranch}'`
    );

    // Create and checkout new branch
    await execGit(
        `git checkout -b ${branchName}`,
        `Failed to create branch '${branchName}'`
    );
}

/**
 * Checkout a branch
 * @param {string} branchName - Branch to checkout
 * @returns {Promise<void>}
 */
export async function checkoutBranch(branchName) {
    await execGit(
        `git checkout ${branchName}`,
        `Failed to checkout branch '${branchName}'`
    );
}

/**
 * Delete a local branch
 * @param {string} branchName - Branch to delete
 * @param {boolean} force - Force delete (default: false)
 * @returns {Promise<void>}
 */
export async function deleteBranch(branchName, force = false) {
    const flag = force ? '-D' : '-d';
    await execGit(
        `git branch ${flag} ${branchName}`,
        `Failed to delete branch '${branchName}'`
    );
}

/**
 * Delete a remote branch
 * @param {string} branchName - Branch to delete
 * @param {string} remote - Remote name (default: origin)
 * @returns {Promise<void>}
 */
export async function deleteRemoteBranch(branchName, remote = 'origin') {
    await execGit(
        `git push ${remote} --delete ${branchName}`,
        `Failed to delete remote branch '${branchName}'`
    );
}

/**
 * Push branch to remote
 * @param {string} branchName - Branch to push
 * @param {string} remote - Remote name (default: origin)
 * @param {boolean} setUpstream - Set upstream tracking (default: true)
 * @returns {Promise<void>}
 */
export async function pushBranch(branchName, remote = 'origin', setUpstream = true) {
    const upstreamFlag = setUpstream ? '-u' : '';
    await execGit(
        `git push ${upstreamFlag} ${remote} ${branchName}`,
        `Failed to push branch '${branchName}'`
    );
}

/**
 * Merge a branch into current branch
 * @param {string} branchName - Branch to merge
 * @param {boolean} noFf - No fast-forward (default: true)
 * @returns {Promise<void>}
 */
export async function mergeBranch(branchName, noFf = true) {
    const noFfFlag = noFf ? '--no-ff' : '';
    await execGit(
        `git merge ${noFfFlag} ${branchName}`,
        `Failed to merge branch '${branchName}'`
    );
}

/**
 * Get parent branch of a branch
 * @param {string} branchName - Branch to check
 * @returns {Promise<string>} - Parent branch name
 */
export async function getBranchParent(branchName) {
    try {
        // Get the commit where the branch was created
        const result = await execGit(
            `git show-branch -a | grep '\\*' | grep -v "$(git rev-parse --abbrev-ref HEAD)" | head -n1 | sed 's/.*\\[\\(.*\\)\\].*/\\1/' | sed 's/[\\^~].*//'`,
            'Failed to get branch parent'
        );
        return result || 'develop'; // Default to develop if can't determine
    } catch {
        return 'develop'; // Default fallback
    }
}

/**
 * Get branch creation date
 * @param {string} branchName - Branch to check
 * @returns {Promise<Date>} - Branch creation date
 */
export async function getBranchCreationDate(branchName) {
    const timestamp = await execGit(
        `git log --reverse --format=%ct ${branchName} | head -1`,
        `Failed to get creation date for branch '${branchName}'`
    );
    return new Date(parseInt(timestamp) * 1000);
}

/**
 * Get last commit date for a branch
 * @param {string} branchName - Branch to check
 * @returns {Promise<Date>} - Last commit date
 */
export async function getLastCommitDate(branchName) {
    const timestamp = await execGit(
        `git log -1 --format=%ct ${branchName}`,
        `Failed to get last commit date for branch '${branchName}'`
    );
    return new Date(parseInt(timestamp) * 1000);
}

/**
 * Get branch age in days
 * @param {string} branchName - Branch to check
 * @returns {Promise<number>} - Age in days
 */
export async function getBranchAge(branchName) {
    const lastCommitDate = await getLastCommitDate(branchName);
    const now = new Date();
    const diffMs = now - lastCommitDate;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get list of all branches
 * @param {string} type - Branch type filter ('local', 'remote', 'all')
 * @returns {Promise<string[]>} - Array of branch names
 */
export async function listBranches(type = 'local') {
    let flag = '';
    if (type === 'remote') flag = '-r';
    if (type === 'all') flag = '-a';

    const output = await execGit(
        `git branch ${flag}`,
        'Failed to list branches'
    );

    return output
        .split('\n')
        .map(line => line.trim().replace(/^\* /, '').replace(/^remotes\/origin\//, ''))
        .filter(line => line && !line.includes('HEAD ->'));
}

/**
 * Get commits between two branches/tags
 * @param {string} base - Base branch/tag
 * @param {string} head - Head branch/tag
 * @returns {Promise<Array>} - Array of commit objects
 */
export async function getCommitsBetween(base, head) {
    const output = await execGit(
        `git log ${base}..${head} --format=%H|%an|%ae|%at|%s`,
        `Failed to get commits between '${base}' and '${head}'`
    );

    if (!output) return [];

    return output.split('\n').map(line => {
        const [hash, author, email, timestamp, subject] = line.split('|');
        return {
            hash,
            author,
            email,
            date: new Date(parseInt(timestamp) * 1000),
            subject
        };
    });
}

/**
 * Create a Git tag
 * @param {string} tagName - Tag name
 * @param {string} message - Tag message
 * @returns {Promise<void>}
 */
export async function createTag(tagName, message) {
    await execGit(
        `git tag -a ${tagName} -m "${message}"`,
        `Failed to create tag '${tagName}'`
    );
}

/**
 * Push tag to remote
 * @param {string} tagName - Tag to push
 * @param {string} remote - Remote name (default: origin)
 * @returns {Promise<void>}
 */
export async function pushTag(tagName, remote = 'origin') {
    await execGit(
        `git push ${remote} ${tagName}`,
        `Failed to push tag '${tagName}'`
    );
}

/**
 * Get latest tag
 * @returns {Promise<string|null>} - Latest tag name or null
 */
export async function getLatestTag() {
    try {
        return await execGit(
            'git describe --tags --abbrev=0',
            'Failed to get latest tag'
        );
    } catch {
        return null;
    }
}

/**
 * List all tags
 * @returns {Promise<string[]>} - Array of tag names
 */
export async function listTags() {
    const output = await execGit(
        'git tag -l',
        'Failed to list tags'
    );
    return output ? output.split('\n').filter(tag => tag) : [];
}

/**
 * Check if working directory is clean
 * @returns {Promise<boolean>} - True if clean
 */
export async function isWorkingDirectoryClean() {
    const output = await execGit(
        'git status --porcelain',
        'Failed to check working directory status'
    );
    return output.length === 0;
}

/**
 * Get uncommitted changes
 * @returns {Promise<string[]>} - Array of changed files
 */
export async function getUncommittedChanges() {
    const output = await execGit(
        'git status --porcelain',
        'Failed to get uncommitted changes'
    );
    return output ? output.split('\n').filter(line => line) : [];
}

/**
 * Check if branch has merge conflicts with another branch
 * @param {string} sourceBranch - Source branch
 * @param {string} targetBranch - Target branch
 * @returns {Promise<boolean>} - True if conflicts exist
 */
export async function hasConflicts(sourceBranch, targetBranch) {
    try {
        // Try a test merge without committing
        await execGit(
            `git merge-tree $(git merge-base ${sourceBranch} ${targetBranch}) ${sourceBranch} ${targetBranch}`,
            'Failed to check for conflicts'
        );
        return false;
    } catch {
        return true;
    }
}

/**
 * Fetch from remote
 * @param {string} remote - Remote name (default: origin)
 * @returns {Promise<void>}
 */
export async function fetch(remote = 'origin') {
    await execGit(
        `git fetch ${remote}`,
        `Failed to fetch from '${remote}'`
    );
}

/**
 * Pull from remote
 * @param {string} remote - Remote name (default: origin)
 * @param {string} branch - Branch name
 * @returns {Promise<void>}
 */
export async function pull(remote = 'origin', branch = null) {
    const branchArg = branch ? branch : '';
    await execGit(
        `git pull ${remote} ${branchArg}`,
        `Failed to pull from '${remote}'`
    );
}
