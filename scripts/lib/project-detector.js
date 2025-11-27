/**
 * Project Detection Utilities
 * 
 * Auto-detect project type, frameworks, and configuration
 */

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

/**
 * Detect project information from various sources
 * @param {string} projectDir - Project root directory
 * @returns {Object} Detected project information
 */
export function detectProject(projectDir) {
    return {
        name: detectProjectName(projectDir),
        description: detectProjectDescription(projectDir),
        type: detectProjectType(projectDir),
        frameworks: detectFrameworks(projectDir),
        languages: detectLanguages(projectDir),
        hasGit: existsSync(join(projectDir, '.git')),
    }
}

/**
 * Detect project name from git or directory
 * @param {string} projectDir - Project root directory
 * @returns {string} Project name
 */
export function detectProjectName(projectDir) {
    // Try git remote
    try {
        const remote = execSync('git config --get remote.origin.url', { 
            cwd: projectDir,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore']
        }).trim()
        
        // Extract repo name from URL
        const match = remote.match(/\/([^\/]+?)(\.git)?$/)
        if (match) return match[1]
    } catch {}

    // Try package.json
    const packagePath = join(projectDir, 'package.json')
    if (existsSync(packagePath)) {
        try {
            const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
            if (pkg.name) return pkg.name
        } catch {}
    }

    // Try composer.json
    const composerPath = join(projectDir, 'composer.json')
    if (existsSync(composerPath)) {
        try {
            const composer = JSON.parse(readFileSync(composerPath, 'utf8'))
            if (composer.name) {
                // Extract project name from vendor/project format
                const parts = composer.name.split('/')
                return parts[parts.length - 1]
            }
        } catch {}
    }

    // Fallback to directory name
    return projectDir.split('/').pop() || 'my-project'
}

/**
 * Detect project description from git or package files
 * @param {string} projectDir - Project root directory
 * @returns {string} Project description
 */
export function detectProjectDescription(projectDir) {
    // Try package.json
    const packagePath = join(projectDir, 'package.json')
    if (existsSync(packagePath)) {
        try {
            const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
            if (pkg.description) return pkg.description
        } catch {}
    }

    // Try composer.json
    const composerPath = join(projectDir, 'composer.json')
    if (existsSync(composerPath)) {
        try {
            const composer = JSON.parse(readFileSync(composerPath, 'utf8'))
            if (composer.description) return composer.description
        } catch {}
    }

    // Try README.md first line
    const readmePath = join(projectDir, 'README.md')
    if (existsSync(readmePath)) {
        try {
            const readme = readFileSync(readmePath, 'utf8')
            const firstLine = readme.split('\n').find(line => line.trim() && !line.startsWith('#'))
            if (firstLine) return firstLine.trim()
        } catch {}
    }

    return 'My CouchCMS project'
}

/**
 * Detect project type based on files and structure
 * @param {string} projectDir - Project root directory
 * @returns {string} Project type (landing-page, blog, ecommerce, webapp, custom)
 */
export function detectProjectType(projectDir) {
    const indicators = {
        'landing-page': [
            'index.php',
            '!couch/snippets/blog',
            '!couch/snippets/shop'
        ],
        'blog': [
            'couch/snippets/blog',
            'blog.php',
            'post.php'
        ],
        'ecommerce': [
            'couch/snippets/shop',
            'products.php',
            'cart.php',
            'checkout.php'
        ],
        'webapp': [
            'src/',
            'package.json',
            'webpack.config.js|vite.config.js|rollup.config.js'
        ]
    }

    for (const [type, patterns] of Object.entries(indicators)) {
        let matches = 0
        let required = 0

        for (const pattern of patterns) {
            const isNegative = pattern.startsWith('!')
            const cleanPattern = isNegative ? pattern.slice(1) : pattern
            const hasWildcard = cleanPattern.includes('|')

            if (hasWildcard) {
                const options = cleanPattern.split('|')
                const found = options.some(opt => existsSync(join(projectDir, opt)))
                if (found) matches++
            } else {
                const exists = existsSync(join(projectDir, cleanPattern))
                if (isNegative) {
                    if (!exists) matches++
                } else {
                    required++
                    if (exists) matches++
                }
            }
        }

        // Type matches if at least 60% of indicators are present
        if (required > 0 && matches / required >= 0.6) {
            return type
        }
    }

    return 'custom'
}

/**
 * Detect frameworks used in project
 * @param {string} projectDir - Project root directory
 * @returns {string[]} Array of detected frameworks
 */
export function detectFrameworks(projectDir) {
    const frameworks = []

    // Check package.json dependencies
    const packagePath = join(projectDir, 'package.json')
    if (existsSync(packagePath)) {
        try {
            const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
            const deps = { ...pkg.dependencies, ...pkg.devDependencies }

            if (deps.tailwindcss) frameworks.push('tailwindcss')
            if (deps.alpinejs || deps['@alpinejs/core']) frameworks.push('alpinejs')
            if (deps.typescript) frameworks.push('typescript')
            if (deps.daisyui) frameworks.push('daisyui')
            if (deps.htmx || deps['htmx.org']) frameworks.push('htmx')
        } catch {}
    }

    // Check for config files
    if (existsSync(join(projectDir, 'tailwind.config.js')) || 
        existsSync(join(projectDir, 'tailwind.config.ts'))) {
        if (!frameworks.includes('tailwindcss')) frameworks.push('tailwindcss')
    }

    if (existsSync(join(projectDir, 'tsconfig.json'))) {
        if (!frameworks.includes('typescript')) frameworks.push('typescript')
    }

    // Check HTML files for CDN includes
    const indexPath = join(projectDir, 'index.php')
    if (existsSync(indexPath)) {
        try {
            const content = readFileSync(indexPath, 'utf8')
            
            if (content.includes('alpinejs') && !frameworks.includes('alpinejs')) {
                frameworks.push('alpinejs')
            }
            if (content.includes('tailwindcss') && !frameworks.includes('tailwindcss')) {
                frameworks.push('tailwindcss')
            }
            if (content.includes('htmx') && !frameworks.includes('htmx')) {
                frameworks.push('htmx')
            }
        } catch {}
    }

    return frameworks
}

/**
 * Detect languages used in project
 * @param {string} projectDir - Project root directory
 * @returns {string[]} Array of detected languages
 */
export function detectLanguages(projectDir) {
    const languages = []

    // PHP is always included for CouchCMS
    languages.push('php')

    // Check for TypeScript
    if (existsSync(join(projectDir, 'tsconfig.json'))) {
        languages.push('typescript')
    }

    // Check for JavaScript
    if (existsSync(join(projectDir, 'package.json'))) {
        languages.push('javascript')
    }

    // Check for CSS/SCSS
    const hasStyles = ['styles', 'css', 'scss', 'assets'].some(dir => 
        existsSync(join(projectDir, dir))
    )
    if (hasStyles) {
        languages.push('css')
    }

    return languages
}

/**
 * Get recommended modules based on detected project
 * @param {Object} projectInfo - Detected project information
 * @returns {string[]} Recommended module names
 */
export function getRecommendedModules(projectInfo) {
    const modules = ['couchcms-core'] // Always include core

    // Add framework modules
    if (projectInfo.frameworks.includes('tailwindcss')) {
        modules.push('tailwindcss')
    }
    if (projectInfo.frameworks.includes('alpinejs')) {
        modules.push('alpinejs')
    }
    if (projectInfo.frameworks.includes('typescript')) {
        modules.push('typescript')
    }
    if (projectInfo.frameworks.includes('daisyui')) {
        modules.push('daisyui')
    }
    if (projectInfo.frameworks.includes('htmx')) {
        modules.push('htmx')
    }

    // Add type-specific modules
    switch (projectInfo.type) {
        case 'blog':
            modules.push('comments', 'search', 'pagination')
            break
        case 'ecommerce':
            modules.push('databound-forms', 'users', 'search')
            break
        case 'webapp':
            modules.push('databound-forms', 'users')
            break
    }

    return [...new Set(modules)] // Remove duplicates
}

/**
 * Get recommended agents based on detected project
 * @param {Object} projectInfo - Detected project information
 * @returns {string[]} Recommended agent names
 */
export function getRecommendedAgents(projectInfo) {
    const agents = ['couchcms'] // Always include main agent

    // Add framework agents
    if (projectInfo.frameworks.includes('tailwindcss')) {
        agents.push('tailwindcss')
    }
    if (projectInfo.frameworks.includes('alpinejs')) {
        agents.push('alpinejs')
    }

    // Add type-specific agents
    switch (projectInfo.type) {
        case 'blog':
            agents.push('comments', 'search')
            break
        case 'ecommerce':
            agents.push('databound-forms', 'users')
            break
        case 'webapp':
            agents.push('databound-forms', 'users')
            break
    }

    return [...new Set(agents)] // Remove duplicates
}
