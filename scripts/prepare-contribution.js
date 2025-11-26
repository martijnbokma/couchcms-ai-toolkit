#!/usr/bin/env bun

/**
 * Prepare Contribution Script
 *
 * This script helps prepare your submodule for contributing.
 * It checks your git state, switches to master, and helps you create a feature branch.
 *
 * Usage:
 *   cd ai-toolkit-shared
 *   bun scripts/prepare-contribution.js
 *   bun scripts/prepare-contribution.js --branch feature/my-feature
 */

import { $ } from "bun";
import { existsSync, statSync } from "fs";
import { join } from "path";

// Check if we're in a git repository
const gitPath = join(process.cwd(), ".git");
const isGitRepo = existsSync(gitPath);

if (!isGitRepo) {
    console.error("❌ Error: Not a git repository");
    console.error("   This script must be run from within the toolkit directory.");
    process.exit(1);
}

console.log("🔧 Preparing contribution environment...\n");

// Parse command line arguments
const args = process.argv.slice(2);

try {
    // Check current branch
    const currentBranchResult = await $`git rev-parse --abbrev-ref HEAD`.quiet();
    const currentBranch = currentBranchResult.stdout.toString().trim();

    console.log(`📍 Current branch: ${currentBranch}`);

    // Check for uncommitted changes
    const statusResult = await $`git status --porcelain`.quiet();
    const hasChanges = statusResult.stdout.toString().trim().length > 0;

    if (hasChanges) {
        console.log("\n⚠️  Warning: You have uncommitted changes!");
        console.log("   Please commit or stash them before continuing.\n");
        console.log("   To stash: git stash");
        console.log("   To commit: git add . && git commit -m 'your message'\n");
        console.log("   Continuing will switch branches with uncommitted changes.");
        console.log("   If you want to proceed anyway, run with --force flag.\n");

        if (!args.includes("--force") && !args.includes("-f")) {
            console.log("❌ Aborted. Please handle your changes first or use --force flag.");
            process.exit(1);
        }
    }

    // Check if in detached HEAD
    if (currentBranch === "HEAD") {
        console.log("\n⚠️  Detected: You're in detached HEAD state");
        console.log("   Switching to master branch...\n");
    }

    // Fetch latest changes
    console.log("📥 Fetching latest changes from origin...");
    await $`git fetch origin`.quiet();

    // Switch to master
    if (currentBranch !== "master") {
        console.log("🌿 Switching to master branch...");
        await $`git checkout master`.quiet();
    }

    // Pull latest updates
    console.log("⬇️  Pulling latest updates...");
    const pullResult = await $`git pull origin master`.quiet();

    if (pullResult.exitCode === 0) {
        const output = pullResult.stdout.toString().trim();
        if (!output.includes("Already up to date")) {
            console.log("✅ Updated master branch");
        } else {
            console.log("✅ Already up to date");
        }
    }

    // Check remote configuration
    const remoteResult = await $`git remote -v`.quiet();
    const remotes = remoteResult.stdout.toString().trim();
    console.log("\n📡 Remote configuration:");
    console.log(remotes);

    // Get branch name from args
    let branchName = null;

    if (args.includes("--branch") || args.includes("-b")) {
        const index = args.includes("--branch") ? args.indexOf("--branch") : args.indexOf("-b");
        branchName = args[index + 1];
    }

    if (!branchName) {
        console.log("\n💡 Next steps:");
        console.log("   1. Create a feature branch:");
        console.log("      git checkout -b feature/your-feature-name");
        console.log("\n   2. Make your changes");
        console.log("\n   3. Test your changes:");
        console.log("      cd ..  # Back to project root");
        console.log("      bun ai-toolkit-shared/scripts/sync.js");
        console.log("      bun ai-toolkit-shared/scripts/validate.js");
        console.log("\n   4. Commit and push:");
        console.log("      cd ai-toolkit-shared");
        console.log("      git add .");
        console.log("      git commit -m 'feat: your feature'");
        console.log("      git push origin feature/your-feature-name");
        console.log("\n   5. Create Pull Request on GitHub");
        console.log("\n📖 Full guide: See CONTRIBUTING.md");
    } else {
        // Create the branch
        console.log(`\n🌿 Creating branch: ${branchName}...`);
        await $`git checkout -b ${branchName}`.quiet();
        console.log(`✅ Created and switched to: ${branchName}`);
        console.log("\n💡 You're ready to make your changes!");
        console.log("   When done, test with: bun ai-toolkit-shared/scripts/sync.js");
    }

} catch (error) {
    console.error("❌ Error preparing contribution:", error.message);
    process.exit(1);
}
