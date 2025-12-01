#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - One-Command Installer
 *
 * Installs toolkit as git submodule and runs setup
 *
 * Usage:
 *   curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/scripts/install.js -o install.js
 *   bun install.js
 *   rm install.js
 *
 * Or with curl (bash):
 *   curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh | bash
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import { print, printSuccess, printError, printWarning, printInfo, printProgress, colors } from './lib/index.js'

const REPO_URL = 'https://github.com/martijnbokma/couchcms-ai-toolkit.git'
const TOOLKIT_DIR = 'ai-toolkit-shared'

function exec(command, options = {}) {
    try {
        return execSync(command, {
            encoding: 'utf8',
            stdio: options.silent ? 'pipe' : 'inherit',
            ...options
        })
    } catch (error) {
        if (!options.ignoreError) {
            throw error
        }
        return null
    }
}

async function checkPrerequisites() {
    printProgress('\nChecking prerequisites...', 0)

    // Check git
    const hasGit = exec('git --version', { silent: true, ignoreError: true })
    if (!hasGit) {
        printError('Git is not installed', 2)
        printWarning('   Install from: https://git-scm.com/', 2)
        process.exit(1)
    }
    printSuccess('Git installed', 2)

    // Check bun or node
    const hasBun = exec('bun --version', { silent: true, ignoreError: true })
    const hasNode = exec('node --version', { silent: true, ignoreError: true })

    if (!hasBun && !hasNode) {
        printError('Neither Bun nor Node.js is installed', 2)
        printWarning('   Install Bun: curl -fsSL https://bun.sh/install | bash', 2)
        printWarning('   Or Node.js: https://nodejs.org/', 2)
        process.exit(1)
    }

    if (hasBun) {
        printSuccess('Bun installed', 2)
    } else {
        printSuccess('Node.js installed', 2)
    }

    // Check if in git repo
    const isGitRepo = exec('git rev-parse --git-dir', { silent: true, ignoreError: true })
    if (!isGitRepo) {
        printError('Not in a git repository', 2)
        printWarning('   Run: git init', 2)
        process.exit(1)
    }
    printSuccess('Git repository detected', 2)
}

async function installToolkit() {
    printProgress('\nInstalling CouchCMS AI Toolkit...', 0)

    // Check if already installed
    if (existsSync(TOOLKIT_DIR)) {
        printWarning(`${TOOLKIT_DIR} already exists`, 2)

        // Ask if should update
        process.stdout.write('   Update existing installation? [Y/n] ')

        const answer = await new Promise((resolve) => {
            process.stdin.once('data', (data) => {
                resolve(data.toString().trim().toLowerCase())
            })
        })

        if (answer === 'n' || answer === 'no') {
            printWarning('   Skipping installation', 2)
            return false
        }

        printProgress('   Updating toolkit...', 2)
        exec(`cd ${TOOLKIT_DIR} && git pull`, { cwd: process.cwd() })
        printSuccess('Toolkit updated', 2)
        return true
    }

    // Check if submodule exists but directory is missing
    try {
        const gitmodules = exec('git config --file .gitmodules --get submodule.ai-toolkit-shared.url', {
            silent: true,
            ignoreError: true
        })

        if (gitmodules) {
            printWarning('Submodule exists in .gitmodules but directory is missing', 2)
            printProgress('   Cleaning up old submodule configuration...', 2)
            exec(`git submodule deinit -f ${TOOLKIT_DIR}`, { ignoreError: true })
            exec(`git rm -f ${TOOLKIT_DIR}`, { ignoreError: true })
            exec(`rm -rf .git/modules/${TOOLKIT_DIR}`, { ignoreError: true })
            printSuccess('Cleaned up old submodule', 2)
        }
    } catch {}

    // Add as submodule
    printProgress(`   Adding submodule from ${REPO_URL}...`, 2)
    exec(`git submodule add ${REPO_URL} ${TOOLKIT_DIR}`)

    printSuccess('Toolkit installed', 2)
    return true
}

async function installDependencies() {
    printProgress('\nInstalling dependencies...', 0)

    const toolkitPath = join(process.cwd(), TOOLKIT_DIR)

    // Make scripts executable
    try {
        printProgress('   Making scripts executable...', 2)
        exec('chmod +x scripts/*.js', { cwd: toolkitPath, ignoreError: true })
    } catch {}

    // Check if bun is available
    const hasBun = exec('bun --version', { silent: true, ignoreError: true })

    if (hasBun) {
        printProgress('   Using Bun...', 2)
        exec('bun install', { cwd: toolkitPath })
    } else {
        printProgress('   Using npm...', 2)
        exec('npm install', { cwd: toolkitPath })
    }

    printSuccess('Dependencies installed', 2)
}



async function displaySuccess() {
    const hasBun = exec('bun --version', { silent: true, ignoreError: true })
    const runtime = hasBun ? 'bun' : 'npm'

    console.log('\n' + colors.green('='.repeat(60)))
    printSuccess('CouchCMS AI Toolkit installed successfully!', 0)
    console.log(colors.green('='.repeat(60)))

    printInfo('\nNext step - Run setup wizard:', 0)
    console.log(`\n    cd ${TOOLKIT_DIR} && ${runtime} run init\n`)

    printInfo('Useful commands (after setup):', 0)
    console.log(`   cd ${TOOLKIT_DIR} && ${runtime} run health     # Check installation`)
    console.log(`   cd ${TOOLKIT_DIR} && ${runtime} run sync       # Re-sync configs`)
    console.log(`   cd ${TOOLKIT_DIR} && ${runtime} run browse     # Browse modules`)

    printInfo('Documentation:', 0)
    console.log('   https://github.com/martijnbokma/couchcms-ai-toolkit#readme')

    printSuccess('\nHappy coding!\n', 0)
}

async function main() {
    print('\n' + '='.repeat(60), 'bright')
    print('🚀 CouchCMS AI Toolkit - One-Command Installer', 'bright')
    print('='.repeat(60) + '\n', 'bright')

    try {
        // Step 1: Check prerequisites
        await checkPrerequisites()

        // Step 2: Install toolkit
        await installToolkit()

        // Step 3: Install dependencies
        await installDependencies()

        // Step 4: Success message
        await displaySuccess()

    } catch (error) {
        printError('\nInstallation failed:', 0)
        console.log(`   ${error.message}`)
        printWarning('\nTry manual installation:', 0)
        console.log('   git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared')
        console.log('   cd ai-toolkit-shared && bun install && cd ..')
        console.log('   bun ai-toolkit-shared/scripts/init.js')
        process.exit(1)
    }
}

// Setup stdin for interactive prompts
process.stdin.setEncoding('utf8')
if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(false)
}

// Run installer
main()
