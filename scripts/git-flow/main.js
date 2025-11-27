#!/usr/bin/env bun
/**
 * Git Flow CLI - Main Entry Point
 *
 * Command-line interface for Gitflow workflow operations.
 *
 * Usage:
 *   bun scripts/git-flow.js <type> <action> [name] [options]
 *
 * Examples:
 *   bun scripts/git-flow.js feature start my-feature
 *   bun scripts/git-flow.js feature finish my-feature
 *   bun scripts/git-flow.js feature list
 *   bun scripts/git-flow.js release start 1.2.0
 *   bun scripts/git-flow.js hotfix start fix-critical-bug
 */

import { handleError } from '../utils/utils.js';
import {
    startFeature,
    finishFeature,
    listFeatures,
    deleteFeature,
    checkStaleFeatures
} from './git-flow/feature.js';
import {
    startRelease,
    finishRelease,
    listReleases
} from './git-flow/release.js';
import {
    startHotfix,
    finishHotfix,
    listHotfixes
} from './git-flow/hotfix.js';

/**
 * Display help information
 */
function showHelp() {
    console.log(`
🌿 Git Flow - Gitflow Workflow Automation

Usage:
  bun scripts/git-flow.js <type> <action> [name] [options]

Types:
  feature    Work on new features
  release    Prepare new releases
  hotfix     Fix critical production bugs

Actions:
  start      Start a new branch
  finish     Finish and create PR
  list       List all branches of type
  delete     Delete a branch (feature only)

Examples:
  # Feature workflow
  bun scripts/git-flow.js feature start add-search
  bun scripts/git-flow.js feature finish add-search
  bun scripts/git-flow.js feature list
  bun scripts/git-flow.js feature delete old-feature

  # Release workflow
  bun scripts/git-flow.js release start 1.2.0
  bun scripts/git-flow.js release finish 1.2.0
  bun scripts/git-flow.js release list

  # Hotfix workflow
  bun scripts/git-flow.js hotfix start fix-critical-bug
  bun scripts/git-flow.js hotfix finish fix-critical-bug
  bun scripts/git-flow.js hotfix list

  # Utilities
  bun scripts/git-flow.js check-stale
  bun scripts/git-flow.js help

Documentation:
  📖 Full guide: docs/GIT-WORKFLOW.md
  🎓 Feature workflow: docs/git-workflow/feature-workflow.md
  📦 Release workflow: docs/git-workflow/release-workflow.md
  🚨 Hotfix workflow: docs/git-workflow/hotfix-workflow.md
  ❓ Troubleshooting: docs/git-workflow/troubleshooting.md
`);
}

/**
 * Parse command-line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
        return { command: 'help' };
    }

    const [type, action, name, ...rest] = args;

    // Handle special commands
    if (type === 'check-stale') {
        return { command: 'check-stale' };
    }

    // Validate type
    const validTypes = ['feature', 'release', 'hotfix'];
    if (!validTypes.includes(type)) {
        throw new Error(`Invalid type: ${type}. Must be one of: ${validTypes.join(', ')}`);
    }

    // Validate action
    const validActions = ['start', 'finish', 'list', 'delete'];
    if (!validActions.includes(action)) {
        throw new Error(`Invalid action: ${action}. Must be one of: ${validActions.join(', ')}`);
    }

    // Validate name for start/finish/delete
    if (['start', 'finish', 'delete'].includes(action) && !name) {
        throw new Error(`Name is required for '${action}' action`);
    }

    // Parse options
    const options = {};
    for (let i = 0; i < rest.length; i += 2) {
        const key = rest[i].replace(/^--/, '');
        const value = rest[i + 1] || true;
        options[key] = value;
    }

    return {
        command: 'workflow',
        type,
        action,
        name,
        options
    };
}

/**
 * Execute workflow command
 */
async function executeWorkflow(type, action, name, options) {
    try {
        let result;

        // Feature commands
        if (type === 'feature') {
            if (action === 'start') {
                result = await startFeature(name, options);
            } else if (action === 'finish') {
                result = await finishFeature(name, options);
            } else if (action === 'list') {
                result = await listFeatures(options);
            } else if (action === 'delete') {
                result = await deleteFeature(name, options);
            }
        }

        // Release commands
        else if (type === 'release') {
            if (action === 'start') {
                result = await startRelease(name, options);
            } else if (action === 'finish') {
                result = await finishRelease(name, options);
            } else if (action === 'list') {
                result = await listReleases(options);
            } else if (action === 'delete') {
                console.log('❌ Delete is not supported for release branches');
                console.log('   Release branches are automatically deleted after merge\n');
                process.exit(1);
            }
        }

        // Hotfix commands
        else if (type === 'hotfix') {
            if (action === 'start') {
                result = await startHotfix(name, options);
            } else if (action === 'finish') {
                result = await finishHotfix(name, options);
            } else if (action === 'list') {
                result = await listHotfixes(options);
            } else if (action === 'delete') {
                console.log('❌ Delete is not supported for hotfix branches');
                console.log('   Hotfix branches are automatically deleted after merge\n');
                process.exit(1);
            }
        }

        return result;
    } catch (error) {
        handleError(error, `${type} ${action}`);
    }
}

/**
 * Main function
 */
async function main() {
    try {
        const parsed = parseArgs();

        // Handle help command
        if (parsed.command === 'help') {
            showHelp();
            process.exit(0);
        }

        // Handle check-stale command
        if (parsed.command === 'check-stale') {
            await checkStaleFeatures(30);
            process.exit(0);
        }

        // Execute workflow command
        if (parsed.command === 'workflow') {
            await executeWorkflow(
                parsed.type,
                parsed.action,
                parsed.name,
                parsed.options
            );
            process.exit(0);
        }

    } catch (error) {
        if (error.message) {
            console.error(`\n❌ Error: ${error.message}\n`);
        } else {
            console.error(`\n❌ An unexpected error occurred\n`);
        }
        console.log('💡 Run with --help for usage information\n');
        process.exit(1);
    }
}

// Run main function
main();
