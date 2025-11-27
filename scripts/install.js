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

const REPO_URL = 'https://github.com/martijnbokma/couchcms-ai-toolkit.git'
const TOOLKIT_DIR = 'ai-toolkit-shared'

// Colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
}

function print(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

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
    print('\n🔍 Checking prerequisites...', 'blue')
    
    // Check git
    const hasGit = exec('git --version', { silent: true, ignoreError: true })
    if (!hasGit) {
        print('❌ Git is not installed', 'red')
        print('   Install from: https://git-scm.com/', 'yellow')
        process.exit(1)
    }
    print('  ✅ Git installed', 'green')
    
    // Check bun or node
    const hasBun = exec('bun --version', { silent: true, ignoreError: true })
    const hasNode = exec('node --version', { silent: true, ignoreError: true })
    
    if (!hasBun && !hasNode) {
        print('❌ Neither Bun nor Node.js is installed', 'red')
        print('   Install Bun: curl -fsSL https://bun.sh/install | bash', 'yellow')
        print('   Or Node.js: https://nodejs.org/', 'yellow')
        process.exit(1)
    }
    
    if (hasBun) {
        print('  ✅ Bun installed', 'green')
    } else {
        print('  ✅ Node.js installed', 'green')
    }
    
    // Check if in git repo
    const isGitRepo = exec('git rev-parse --git-dir', { silent: true, ignoreError: true })
    if (!isGitRepo) {
        print('❌ Not in a git repository', 'red')
        print('   Run: git init', 'yellow')
        process.exit(1)
    }
    print('  ✅ Git repository detected', 'green')
}

async function installToolkit() {
    print('\n📦 Installing CouchCMS AI Toolkit...', 'blue')
    
    // Check if already installed
    if (existsSync(TOOLKIT_DIR)) {
        print(`⚠️  ${TOOLKIT_DIR} already exists`, 'yellow')
        
        // Ask if should update
        process.stdout.write('   Update existing installation? [Y/n] ')
        
        const answer = await new Promise((resolve) => {
            process.stdin.once('data', (data) => {
                resolve(data.toString().trim().toLowerCase())
            })
        })
        
        if (answer === 'n' || answer === 'no') {
            print('   Skipping installation', 'yellow')
            return false
        }
        
        print('   Updating toolkit...', 'blue')
        exec(`cd ${TOOLKIT_DIR} && git pull`, { cwd: process.cwd() })
        print('  ✅ Toolkit updated', 'green')
        return true
    }
    
    // Check if submodule exists but directory is missing
    try {
        const gitmodules = exec('git config --file .gitmodules --get submodule.ai-toolkit-shared.url', { 
            silent: true, 
            ignoreError: true 
        })
        
        if (gitmodules) {
            print('⚠️  Submodule exists in .gitmodules but directory is missing', 'yellow')
            print('   Cleaning up old submodule configuration...', 'blue')
            exec(`git submodule deinit -f ${TOOLKIT_DIR}`, { ignoreError: true })
            exec(`git rm -f ${TOOLKIT_DIR}`, { ignoreError: true })
            exec(`rm -rf .git/modules/${TOOLKIT_DIR}`, { ignoreError: true })
            print('   Cleaned up old submodule', 'green')
        }
    } catch {}
    
    // Add as submodule
    print(`   Adding submodule from ${REPO_URL}...`, 'blue')
    exec(`git submodule add ${REPO_URL} ${TOOLKIT_DIR}`)
    
    print('  ✅ Toolkit installed', 'green')
    return true
}

async function installDependencies() {
    print('\n📚 Installing dependencies...', 'blue')
    
    const toolkitPath = join(process.cwd(), TOOLKIT_DIR)
    
    // Make scripts executable
    try {
        print('   Making scripts executable...', 'blue')
        exec('chmod +x scripts/*.js', { cwd: toolkitPath, ignoreError: true })
    } catch {}
    
    // Check if bun is available
    const hasBun = exec('bun --version', { silent: true, ignoreError: true })
    
    if (hasBun) {
        print('   Using Bun...', 'blue')
        exec('bun install', { cwd: toolkitPath })
    } else {
        print('   Using npm...', 'blue')
        exec('npm install', { cwd: toolkitPath })
    }
    
    print('  ✅ Dependencies installed', 'green')
}

async function runSetup() {
    print('\n🚀 Running setup wizard...', 'blue')
    print('   (You can run this again later with: bun ai-toolkit-shared/scripts/init.js)\n', 'yellow')
    
    const toolkitPath = join(process.cwd(), TOOLKIT_DIR)
    const hasBun = exec('bun --version', { silent: true, ignoreError: true })
    
    if (hasBun) {
        exec('bun scripts/init.js', { cwd: toolkitPath })
    } else {
        exec('node scripts/init.js', { cwd: toolkitPath })
    }
}

async function displaySuccess() {
    print('\n' + '='.repeat(60), 'green')
    print('🎉 CouchCMS AI Toolkit installed successfully!', 'green')
    print('='.repeat(60), 'green')
    
    print('\n📚 Next steps:', 'blue')
    print('   1. Your AI configs are ready in .cursorrules, .claude/, etc.')
    print('   2. Start coding - your AI assistant knows CouchCMS!')
    print('   3. Update config: edit .project/standards.md')
    print('   4. Re-sync: bun ai-toolkit-shared/scripts/sync.js')
    
    print('\n💡 Useful commands:', 'blue')
    print('   bun ai-toolkit-shared/scripts/health.js      # Check installation')
    print('   bun ai-toolkit-shared/scripts/sync.js --watch # Auto-sync on changes')
    print('   bun ai-toolkit-shared/scripts/browse.js      # Browse modules')
    
    print('\n📖 Documentation:', 'blue')
    print('   https://github.com/martijnbokma/couchcms-ai-toolkit#readme')
    
    print('\n✨ Happy coding!\n', 'green')
}

async function main() {
    print('\n' + '='.repeat(60), 'bright')
    print('🚀 CouchCMS AI Toolkit - One-Command Installer', 'bright')
    print('='.repeat(60) + '\n', 'bright')
    
    try {
        // Step 1: Check prerequisites
        await checkPrerequisites()
        
        // Step 2: Install toolkit
        const installed = await installToolkit()
        
        // Step 3: Install dependencies
        await installDependencies()
        
        // Step 4: Run setup (only if newly installed)
        if (installed) {
            await runSetup()
        }
        
        // Step 5: Success message
        await displaySuccess()
        
    } catch (error) {
        print('\n❌ Installation failed:', 'red')
        print(`   ${error.message}`, 'red')
        print('\n💡 Try manual installation:', 'yellow')
        print('   git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared')
        print('   cd ai-toolkit-shared && bun install && cd ..')
        print('   bun ai-toolkit-shared/scripts/init.js')
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
