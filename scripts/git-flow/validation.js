#!/usr/bin/env bun
/**
 * Branch Validation - Validation Logic for Gitflow
 *
 * Provides validation functions for branch names, states, and workflow rules.
 */

import { ToolkitError } from '../utils/utils.js';
import {
    getCurrentBranch,
    getBranchAge,
    getLastCommitDate,
    isWorkingDirectoryClean,
    getUncommittedChanges,
    branchExists,
    listBranches
} from './git-wrapper.js';

/**
 * Branch naming patterns
 */
const BRANCH_PATTERNS = {
    feature: /^feature\/[a-z0-9-]+$/,
    release: /^release\/v?\d+\.\d+\.\d+$/,
    hotfix: /^hotfix\/[a-z0-9-]+$/,
    main: /^(main|master)$/,
    develop: /^develop$/
};

/**
 * Validate branch name against pattern
 * @param {string} branchName - Branch name to validate
 * @param {string} type - Branch type (feature, release, hotfix)
 * @returns {boolean} - True if valid
 */
export function validateBranchName(branchName, type) {
    const pattern = BRANCH_PATTERNS[type];
    if (!pattern) {
        throw new ToolkitError(
            `Unknown branch type: ${type}`,
            'INVALID_BRANCH_TYPE'
        );
    }
    return pattern.test(branchName);
}

/**
 * Get branch type from name
 * @param {string} branchName - Branch name
 * @returns {string|null} - Branch type or null if unknown
 */
export function getBranchType(branchName) {
    for (const [type, pattern] of Object.entries(BRANCH_PATTERNS)) {
        if (pattern.test(branchName)) {
            return type;
        }
    }
    return null;
}

/**
 * Validate feature branch name
 * @param {string} name - Feature name (without prefix)
 * @returns {Object} - Validation result
 */
export function validateFeatureName(name) {
    const errors = [];
    const warnings = [];

    // Check length
    if (name.length < 3) {
        errors.push('Feature name must be at least 3 characters');
    }
    if (name.length > 50) {
        errors.push('Feature name must be less than 50 characters');
    }

    // Check characters
    if (!/^[a-z0-9-]+$/.test(name)) {
        errors.push('Feature name can only contain lowercase letters, numbers, and hyphens');
    }

    // Check for consecutive hyphens
    if (/--/.test(name)) {
        warnings.push('Avoid consecutive hyphens in feature name');
    }

    // Check for leading/trailing hyphens
    if (/^-|-$/.test(name)) {
        errors.push('Feature name cannot start or end with a hyphen');
    }

    // Check for common mistakes
    if (name === 'feature' || name === 'test' || name === 'temp') {
        warnings.push(`'${name}' is too generic, use a more descriptive name`);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validate release version number
 * @param {string} version - Version number (e.g., "1.2.3" or "v1.2.3")
 * @returns {Object} - Validation result
 */
export function validateReleaseVersion(version) {
    const errors = [];
    const warnings = [];

    // Remove 'v' prefix if present
    const cleanVersion = version.replace(/^v/, '');

    // Check format
    const versionPattern = /^\d+\.\d+\.\d+$/;
    if (!versionPattern.test(cleanVersion)) {
        errors.push('Version must be in format: MAJOR.MINOR.PATCH (e.g., 1.2.3)');
        return { valid: false, errors, warnings };
    }

    // Parse version parts
    const [major, minor, patch] = cleanVersion.split('.').map(Number);

    // Check for valid numbers
    if (major < 0 || minor < 0 || patch < 0) {
        errors.push('Version numbers cannot be negative');
    }

    // Warnings for unusual versions
    if (major === 0 && minor === 0 && patch === 0) {
        warnings.push('Version 0.0.0 is unusual, consider starting at 0.1.0 or 1.0.0');
    }

    if (major > 100) {
        warnings.push('Major version > 100 is unusual');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        version: {
            major,
            minor,
            patch,
            string: cleanVersion,
            withPrefix: `v${cleanVersion}`
        }
    };
}

/**
 * Validate hotfix name
 * @param {string} name - Hotfix name (without prefix)
 * @returns {Object} - Validation result
 */
export function validateHotfixName(name) {
    const errors = [];
    const warnings = [];

    // Check length
    if (name.length < 3) {
        errors.push('Hotfix name must be at least 3 characters');
    }
    if (name.length > 50) {
        errors.push('Hotfix name must be less than 50 characters');
    }

    // Check characters
    if (!/^[a-z0-9-]+$/.test(name)) {
        errors.push('Hotfix name can only contain lowercase letters, numbers, and hyphens');
    }

    // Check for leading/trailing hyphens
    if (/^-|-$/.test(name)) {
        errors.push('Hotfix name cannot start or end with a hyphen');
    }

    // Encourage descriptive names
    if (name === 'hotfix' || name === 'fix' || name === 'urgent') {
        warnings.push(`'${name}' is too generic, describe what is being fixed`);
    }

    // Encourage 'fix-' prefix
    if (!name.startsWith('fix-')) {
        warnings.push("Consider starting hotfix name with 'fix-' (e.g., 'fix-login-crash')");
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Calculate branch age in days
 * @param {string} branchName - Branch name
 * @returns {Promise<number>} - Age in days
 */
export async function calculateBranchAge(branchName) {
    return await getBranchAge(branchName);
}

/**
 * Check if branch is stale
 * @param {string} branchName - Branch name
 * @param {number} maxDays - Maximum age in days (default: 30)
 * @returns {Promise<boolean>} - True if stale
 */
export async function isBranchStale(branchName, maxDays = 30) {
    const age = await getBranchAge(branchName);
    return age > maxDays;
}

/**
 * Find all stale branches
 * @param {number} maxDays - Maximum age in days (default: 30)
 * @param {string} type - Branch type filter (optional)
 * @returns {Promise<Array>} - Array of stale branch info
 */
export async function findStaleBranches(maxDays = 30, type = null) {
    const branches = await listBranches('local');
    const staleBranches = [];

    for (const branch of branches) {
        // Skip main and develop
        if (branch === 'main' || branch === 'master' || branch === 'develop') {
            continue;
        }

        // Filter by type if specified
        if (type) {
            const branchType = getBranchType(branch);
            if (branchType !== type) {
                continue;
            }
        }

        const age = await getBranchAge(branch);
        if (age > maxDays) {
            const lastCommitDate = await getLastCommitDate(branch);
            staleBranches.push({
                name: branch,
                type: getBranchType(branch),
                age,
                lastCommitDate
            });
        }
    }

    return staleBranches;
}

/**
 * Check for uncommitted changes
 * @returns {Promise<Object>} - Status object
 */
export async function checkUncommittedChanges() {
    const isClean = await isWorkingDirectoryClean();
    const changes = isClean ? [] : await getUncommittedChanges();

    return {
        isClean,
        hasChanges: !isClean,
        changes,
        count: changes.length
    };
}

/**
 * Validate workflow state before operation
 * @param {string} operation - Operation being performed
 * @returns {Promise<Object>} - Validation result
 */
export async function validateWorkflowState(operation) {
    const errors = [];
    const warnings = [];

    // Check for uncommitted changes
    const changeStatus = await checkUncommittedChanges();
    if (changeStatus.hasChanges) {
        errors.push(
            `You have ${changeStatus.count} uncommitted change(s). ` +
            'Please commit or stash them before continuing.'
        );
    }

    // Check current branch
    const currentBranch = await getCurrentBranch();
    
    // Specific validations based on operation
    if (operation === 'feature-start') {
        if (currentBranch !== 'develop') {
            warnings.push(
                `You're on '${currentBranch}' instead of 'develop'. ` +
                'Feature branches should be created from develop.'
            );
        }
    }

    if (operation === 'release-start') {
        if (currentBranch !== 'develop') {
            errors.push(
                `You must be on 'develop' to start a release. ` +
                `Currently on '${currentBranch}'.`
            );
        }
    }

    if (operation === 'hotfix-start') {
        if (currentBranch !== 'main' && currentBranch !== 'master') {
            errors.push(
                `You must be on 'main' to start a hotfix. ` +
                `Currently on '${currentBranch}'.`
            );
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        currentBranch,
        changeStatus
    };
}

/**
 * Validate branch exists
 * @param {string} branchName - Branch name
 * @param {boolean} shouldExist - Whether branch should exist (default: true)
 * @returns {Promise<Object>} - Validation result
 */
export async function validateBranchExists(branchName, shouldExist = true) {
    const exists = await branchExists(branchName);
    const errors = [];

    if (shouldExist && !exists) {
        errors.push(`Branch '${branchName}' does not exist`);
    }

    if (!shouldExist && exists) {
        errors.push(`Branch '${branchName}' already exists`);
    }

    return {
        valid: errors.length === 0,
        errors,
        exists
    };
}

/**
 * Get validation suggestions for branch name
 * @param {string} name - Invalid branch name
 * @param {string} type - Branch type
 * @returns {string[]} - Array of suggestions
 */
export function getSuggestions(name, type) {
    const suggestions = [];

    // Convert to lowercase
    if (name !== name.toLowerCase()) {
        suggestions.push(`Use lowercase: ${name.toLowerCase()}`);
    }

    // Replace spaces with hyphens
    if (name.includes(' ')) {
        suggestions.push(`Replace spaces with hyphens: ${name.replace(/\s+/g, '-')}`);
    }

    // Remove special characters
    if (/[^a-z0-9-]/.test(name)) {
        const cleaned = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-');
        suggestions.push(`Remove special characters: ${cleaned}`);
    }

    // Add prefix if missing
    if (type === 'feature' && !name.startsWith('feature/')) {
        suggestions.push(`Add prefix: feature/${name}`);
    }
    if (type === 'release' && !name.startsWith('release/')) {
        suggestions.push(`Add prefix: release/${name}`);
    }
    if (type === 'hotfix' && !name.startsWith('hotfix/')) {
        suggestions.push(`Add prefix: hotfix/${name}`);
    }

    return suggestions;
}

/**
 * Validate complete branch name (with prefix)
 * @param {string} branchName - Full branch name
 * @returns {Object} - Validation result
 */
export function validateCompleteBranchName(branchName) {
    const type = getBranchType(branchName);
    const errors = [];
    const warnings = [];

    if (!type) {
        errors.push(
            `Invalid branch name format: '${branchName}'. ` +
            'Must match: feature/name, release/version, or hotfix/name'
        );
        return {
            valid: false,
            errors,
            warnings,
            type: null
        };
    }

    // Extract name part
    const namePart = branchName.split('/')[1];

    // Type-specific validation
    let typeValidation;
    if (type === 'feature') {
        typeValidation = validateFeatureName(namePart);
    } else if (type === 'release') {
        typeValidation = validateReleaseVersion(namePart);
    } else if (type === 'hotfix') {
        typeValidation = validateHotfixName(namePart);
    } else {
        // main/develop are always valid
        return {
            valid: true,
            errors: [],
            warnings: [],
            type
        };
    }

    return {
        valid: typeValidation.valid,
        errors: [...errors, ...typeValidation.errors],
        warnings: [...warnings, ...typeValidation.warnings],
        type
    };
}
