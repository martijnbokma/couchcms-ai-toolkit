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

// Check if we're in a git repository
const gitPath = join(process.cwd(), ".git");
const isGitRepo = existsSync(gitPath);
const isSubmodule = isGitRepo && !statSync(gitPath).isDirectory();

if (!isGitRepo) {
    console.error("❌ Error: Not a git repository");
    console.error("   This script must be run from within the toolkit directory.");
    process.exit(1);
}

console.log("🔄 Updating couchcms-ai-toolkit submodule...\n");

if (isSubmodule) {
    console.log("📦 Detected: Running as git submodule\n");
}

try {

    // Fetch latest changes
    console.log("📥 Fetching latest changes...");
    await $`git fetch origin`.quiet();

    // Get current branch
    const currentBranch = await $`git rev-parse --abbrev-ref HEAD`.quiet();
    const branch = currentBranch.stdout.toString().trim();

    console.log(`🌿 Current branch: ${branch}`);

    // Pull latest changes
    console.log(`⬇️  Pulling latest changes from origin/${branch}...`);
    const pullResult = await $`git pull origin ${branch}`.quiet();

    if (pullResult.exitCode === 0) {
        const output = pullResult.stdout.toString().trim();

        if (output.includes("Already up to date")) {
            console.log("✅ Submodule is already up to date!");
        } else {
            console.log("✅ Submodule updated successfully!");
            console.log("\n📝 Changes pulled:");
            console.log(output);
        }

        // Show latest commit
        const latestCommit = await $`git log -1 --oneline`.quiet();
        console.log(`\n📌 Latest commit: ${latestCommit.stdout.toString().trim()}`);

        console.log("\n💡 Tip: If you're using this as a submodule, you may need to:");
        console.log("   1. Commit the submodule update in your parent repository:");
        console.log("      git add <submodule-path>");
        console.log("      git commit -m 'Update couchcms-ai-toolkit submodule'");
        console.log("\n   2. Or run from parent repo: git submodule update --remote <submodule-path>");
    } else {
        console.error("❌ Error: Failed to pull changes");
        console.error(pullResult.stderr.toString());
        process.exit(1);
    }
} catch (error) {
    console.error("❌ Error updating submodule:", error.message);
    process.exit(1);
}
