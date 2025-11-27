#!/usr/bin/env bun

/**
 * Update script for git submodule
 *
 * This script helps keep the toolkit up-to-date when used as a git submodule.
 * It pulls the latest changes from the remote repository.
 *
 * Usage:
 *   From within the submodule: bun scripts/update-submodule.js
 *   Or via npm: npm run update-submodule
 */

import { $ } from "bun";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { ToolkitError, handleError } from "./utils.js";

/**
 * Detect if we're in a git repository and if it's a submodule
 * @returns {{isGitRepo: boolean, isSubmodule: boolean}} - Git repository detection results
 */
function detectGitRepo() {
    const gitPath = join(process.cwd(), ".git");
    const isGitRepo = existsSync(gitPath);
    const isSubmodule = isGitRepo && !statSync(gitPath).isDirectory();
    return { isGitRepo, isSubmodule };
}

/**
 * Validate that we're in a git repository
 * @throws {ToolkitError} - If not in a git repository
 */
function validateGitRepo() {
    const { isGitRepo } = detectGitRepo();
    if (!isGitRepo) {
        throw new ToolkitError(
            "Not a git repository. This script must be run from within the toolkit directory.",
            "NOT_GIT_REPO"
        );
    }
}

/**
 * Get the current git branch name
 * @returns {Promise<string>} - Current branch name
 * @throws {ToolkitError} - If branch detection fails
 */
async function getCurrentBranch() {
    try {
        const result = await $`git rev-parse --abbrev-ref HEAD`.quiet();
        if (result.exitCode !== 0) {
            throw new ToolkitError(
                "Failed to get current branch name",
                "GET_BRANCH_FAILED",
                new Error(result.stderr.toString())
            );
        }
        return result.stdout.toString().trim();
    } catch (error) {
        if (error instanceof ToolkitError) throw error;
        throw new ToolkitError(
            "Failed to get current branch name",
            "GET_BRANCH_FAILED",
            error
        );
    }
}

/**
 * Fetch latest changes from origin
 * @throws {ToolkitError} - If fetch fails
 */
async function fetchLatestChanges() {
    try {
        console.log("📥 Fetching latest changes...");
        const result = await $`git fetch origin`.quiet();
        if (result.exitCode !== 0) {
            throw new ToolkitError(
                "Failed to fetch latest changes",
                "FETCH_FAILED",
                new Error(result.stderr.toString())
            );
        }
    } catch (error) {
        if (error instanceof ToolkitError) throw error;
        throw new ToolkitError(
            "Failed to fetch latest changes",
            "FETCH_FAILED",
            error
        );
    }
}

/**
 * Pull latest changes from remote branch
 * @param {string} branch - Branch name to pull from
 * @returns {Promise<{success: boolean, output: string, alreadyUpToDate: boolean}>} - Pull result
 * @throws {ToolkitError} - If pull fails
 */
async function pullLatestChanges(branch) {
    try {
        console.log(`⬇️  Pulling latest changes from origin/${branch}...`);
        const result = await $`git pull origin ${branch}`.quiet();

        if (result.exitCode !== 0) {
            throw new ToolkitError(
                "Failed to pull changes",
                "PULL_FAILED",
                new Error(result.stderr.toString())
            );
        }

        const output = result.stdout.toString().trim();
        const alreadyUpToDate = output.includes("Already up to date");

        return {
            success: true,
            output,
            alreadyUpToDate,
        };
    } catch (error) {
        if (error instanceof ToolkitError) throw error;
        throw new ToolkitError(
            "Failed to pull changes",
            "PULL_FAILED",
            error
        );
    }
}

/**
 * Get latest commit information
 * @returns {Promise<string>} - Latest commit oneline string
 * @throws {ToolkitError} - If getting commit info fails
 */
async function getLatestCommit() {
    try {
        const result = await $`git log -1 --oneline`.quiet();
        if (result.exitCode !== 0) {
            throw new ToolkitError(
                "Failed to get latest commit",
                "GET_COMMIT_FAILED",
                new Error(result.stderr.toString())
            );
        }
        return result.stdout.toString().trim();
    } catch (error) {
        if (error instanceof ToolkitError) throw error;
        throw new ToolkitError(
            "Failed to get latest commit",
            "GET_COMMIT_FAILED",
            error
        );
    }
}

/**
 * Display update summary and tips
 * @param {boolean} alreadyUpToDate - Whether submodule was already up to date
 * @param {string} output - Pull output message
 * @param {string} latestCommit - Latest commit information
 */
function showUpdateSummary(alreadyUpToDate, output, latestCommit) {
    if (alreadyUpToDate) {
        console.log("✅ Submodule is already up to date!");
    } else {
        console.log("✅ Submodule updated successfully!");
        console.log("\n📝 Changes pulled:");
        console.log(output);
    }

    console.log(`\n📌 Latest commit: ${latestCommit}`);

    console.log("\n💡 Tip: If you're using this as a submodule, you may need to:");
    console.log("   1. Commit the submodule update in your parent repository:");
    console.log("      git add <submodule-path>");
    console.log("      git commit -m 'Update couchcms-ai-toolkit submodule'");
    console.log("\n   2. Or run from parent repo: git submodule update --remote <submodule-path>");
}

/**
 * Main update function
 */
async function updateSubmodule() {
    // Validate git repository
    validateGitRepo();

    const { isSubmodule } = detectGitRepo();

    console.log("🔄 Updating couchcms-ai-toolkit submodule...\n");

    if (isSubmodule) {
        console.log("📦 Detected: Running as git submodule\n");
    }

    try {
        // Fetch latest changes
        await fetchLatestChanges();

        // Get current branch
        const branch = await getCurrentBranch();
        console.log(`🌿 Current branch: ${branch}`);

        // Pull latest changes
        const pullResult = await pullLatestChanges(branch);

        // Get latest commit info
        const latestCommit = await getLatestCommit();

        // Show summary
        showUpdateSummary(pullResult.alreadyUpToDate, pullResult.output, latestCommit);
    } catch (error) {
        handleError(error, "Updating submodule");
    }
}

// Run the update
updateSubmodule();
