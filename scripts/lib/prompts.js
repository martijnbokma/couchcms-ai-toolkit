/**
 * User input and prompting utilities for interactive CLI
 */

/**
 * Read input from stdin
 * @param {string} question - Question to ask user
 * @param {string} [defaultValue=''] - Default value if user enters nothing
 * @returns {Promise<string>} - User input or default value
 */
export async function prompt(question, defaultValue = '') {
    process.stdout.write(`${question}${defaultValue ? ` [${defaultValue}]` : ''}: `)

    return new Promise(resolve => {
        process.stdin.once('data', data => {
            const input = data.toString().trim()
            resolve(input || defaultValue)
        })
    })
}

/**
 * Confirm yes/no question
 * @param {string} question - Question to ask user
 * @param {boolean} [defaultYes=true] - Default to yes if user enters nothing
 * @returns {Promise<boolean>} - True if yes, false if no
 */
export async function confirm(question, defaultYes = true) {
    const suffix = defaultYes ? ' [Y/n]' : ' [y/N]'
    const answer = await prompt(question + suffix)

    if (!answer) {
        return defaultYes
    }

    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes'
}

/**
 * Get available modules list
 * @returns {Array<{name: string, description: string, required?: boolean}>} - Available modules
 */
export function getAvailableModules() {
    return [
        { name: 'couchcms-core', description: 'Core CouchCMS patterns (always included)', required: true },
        { name: 'tailwindcss', description: 'TailwindCSS 4 patterns' },
        { name: 'daisyui', description: 'daisyUI 5 components' },
        { name: 'alpinejs', description: 'Alpine.js integration' },
        { name: 'typescript', description: 'TypeScript standards' },
        { name: 'databound-forms', description: 'DataBound Forms' },
        { name: 'folders', description: 'Virtual folders and nested pages' },
        { name: 'archives', description: 'Archive views by time periods' },
        { name: 'relationships', description: 'Page relationships and related content' },
        { name: 'repeatable-regions', description: 'Dynamic repeatable content blocks' },
        { name: 'search', description: 'Fulltext search with MySQL' },
        { name: 'pagination', description: 'Pagination for pages and results' },
        { name: 'custom-routes', description: 'Custom URL routing' },
        { name: 'users', description: 'User management and access control' },
        { name: 'comments', description: 'Comment system with moderation' },
    ]
}

/**
 * Get available agents list
 * @returns {Array<{name: string, description: string}>} - Available agents
 */
export function getAvailableAgents() {
    return [
        { name: 'couchcms', description: 'Core CouchCMS development' },
        { name: 'databound-forms', description: 'Forms and CRUD operations' },
        { name: 'alpinejs', description: 'Alpine.js development' },
        { name: 'tailwindcss', description: 'TailwindCSS styling' },
        { name: 'typescript', description: 'TypeScript development' },
        { name: 'search', description: 'Fulltext search implementation' },
        { name: 'pagination', description: 'Pagination controls' },
        { name: 'relationships', description: 'Page relationships' },
        { name: 'views', description: 'Template views (List, Page, Folder, Archive)' },
        { name: 'comments', description: 'Comment system with moderation' },
        { name: 'users', description: 'User management and access control' },
        { name: 'folders', description: 'Virtual folders for content organization' },
        { name: 'repeatable-regions', description: 'Dynamic repeatable content blocks' },
        { name: 'photo-gallery', description: 'Photo gallery with batch upload' },
        { name: 'rss-feeds', description: 'RSS feed generation' },
        { name: 'archives', description: 'Archive views by time periods' },
        { name: 'nested-pages', description: 'Hierarchical page structures' },
        { name: 'on-page-editing', description: 'Frontend inline editing' },
        { name: 'admin-panel-theming', description: 'Admin panel customization' },
        { name: 'custom-routes', description: 'Clean URLs and routing' },
        { name: 'mysql', description: 'Database operations' },
        { name: 'bun', description: 'Bun runtime and build tooling' },
        { name: 'git', description: 'Version control workflows' },
    ]
}

/**
 * Select modules based on preset or individual choice
 * @param {boolean} simpleMode - Whether in simple mode
 * @returns {Promise<Array<string>>} - Selected module names
 */
export async function selectModules(simpleMode) {
    if (simpleMode) {
        // Simple mode: ALL CouchCMS modules + TailwindCSS + Alpine.js
        console.log('\n📚 Using CouchCMS Complete module preset:')
        console.log('   ✓ All CouchCMS modules (core, databound-forms, custom-routes, folders, archives,')
        console.log('     relationships, repeatable-regions, search, pagination, comments, users)')
        console.log('   ✓ tailwindcss - TailwindCSS 4 patterns')
        console.log('   ✓ alpinejs - Alpine.js integration')
        return [
            'couchcms-core',
            'databound-forms',
            'custom-routes',
            'folders',
            'archives',
            'relationships',
            'repeatable-regions',
            'search',
            'pagination',
            'comments',
            'users',
            'tailwindcss',
            'alpinejs'
        ]
    }

    // Custom mode: ask for preset or individual selection
    console.log('\n📚 Module selection:')
    console.log('  1. Minimal (only couchcms-core)')
    console.log('  2. CouchCMS Complete (all CouchCMS + tailwindcss + alpinejs) - RECOMMENDED')
    console.log('  3. Full (everything including TypeScript, daisyUI)')
    console.log('  4. Custom (choose individually)')
    const modulePreset = await prompt('Choice [1-4]', '2')

    const availableModules = getAvailableModules()
    let selectedModules = ['couchcms-core']

    if (modulePreset === '1') {
        // Minimal - already set
    } else if (modulePreset === '2') {
        // CouchCMS Complete: All CouchCMS modules + TailwindCSS + Alpine.js
        selectedModules.push(
            'databound-forms',
            'custom-routes',
            'folders',
            'archives',
            'relationships',
            'repeatable-regions',
            'search',
            'pagination',
            'comments',
            'users',
            'tailwindcss',
            'alpinejs'
        )
    } else if (modulePreset === '3') {
        // Full: all modules
        selectedModules.push(
            'tailwindcss',
            'daisyui',
            'alpinejs',
            'typescript',
            'databound-forms',
            'folders',
            'archives',
            'relationships',
            'repeatable-regions',
            'search',
            'pagination',
            'custom-routes',
            'users',
            'comments'
        )
    } else {
        // Custom: ask individually
        for (const mod of availableModules) {
            if (mod.required) {
                console.log(`   ✓ ${mod.name} - ${mod.description}`)
                continue
            }
            const include = await confirm(`   Include ${mod.name}? (${mod.description})`, true)
            if (include) {
                selectedModules.push(mod.name)
            }
        }
    }

    return selectedModules
}

/**
 * Select agents based on preset or individual choice
 * @param {boolean} simpleMode - Whether in simple mode
 * @returns {Promise<Array<string>>} - Selected agent names
 */
export async function selectAgents(simpleMode) {
    if (simpleMode) {
        // Simple mode: ALL CouchCMS agents + TailwindCSS + Alpine.js
        console.log('\n🤖 Using CouchCMS Complete agent preset:')
        console.log('   ✓ All CouchCMS agents (couchcms, databound-forms, custom-routes, folders,')
        console.log('     archives, relationships, repeatable-regions, search, pagination, comments,')
        console.log('     users, views, nested-pages, photo-gallery, rss-feeds, on-page-editing,')
        console.log('     admin-panel-theming)')
        console.log('   ✓ tailwindcss - TailwindCSS styling')
        console.log('   ✓ alpinejs - Alpine.js development')
        return [
            'couchcms',
            'databound-forms',
            'custom-routes',
            'folders',
            'archives',
            'relationships',
            'repeatable-regions',
            'search',
            'pagination',
            'comments',
            'users',
            'views',
            'nested-pages',
            'photo-gallery',
            'rss-feeds',
            'on-page-editing',
            'admin-panel-theming',
            'tailwindcss',
            'alpinejs'
        ]
    }

    // Custom mode: ask for preset or individual selection
    console.log('\n🤖 Agent selection:')
    console.log('  1. Minimal (only couchcms)')
    console.log('  2. CouchCMS Complete (all CouchCMS + tailwindcss + alpinejs) - RECOMMENDED')
    console.log('  3. Full (all agents including utility agents)')
    console.log('  4. Custom (choose individually)')
    const agentPreset = await prompt('Choice [1-4]', '2')

    const availableAgents = getAvailableAgents()
    let selectedAgents = []

    if (agentPreset === '1') {
        selectedAgents = ['couchcms']
    } else if (agentPreset === '2') {
        // CouchCMS Complete: All CouchCMS agents + TailwindCSS + Alpine.js
        selectedAgents = [
            'couchcms',
            'databound-forms',
            'custom-routes',
            'folders',
            'archives',
            'relationships',
            'repeatable-regions',
            'search',
            'pagination',
            'comments',
            'users',
            'views',
            'nested-pages',
            'photo-gallery',
            'rss-feeds',
            'on-page-editing',
            'admin-panel-theming',
            'tailwindcss',
            'alpinejs'
        ]
    } else if (agentPreset === '3') {
        // Full: all agents including utility agents
        selectedAgents = [
            'couchcms',
            'databound-forms',
            'custom-routes',
            'folders',
            'archives',
            'relationships',
            'repeatable-regions',
            'search',
            'pagination',
            'comments',
            'users',
            'views',
            'nested-pages',
            'photo-gallery',
            'rss-feeds',
            'on-page-editing',
            'admin-panel-theming',
            'alpinejs',
            'tailwindcss',
            'typescript',
            'mysql',
            'bun',
            'git',
        ]
    } else {
        // Custom: ask individually
        for (const agent of availableAgents) {
            const include = await confirm(`   Include ${agent.name}? (${agent.description})`, true)
            if (include) {
                selectedAgents.push(agent.name)
            }
        }
    }

    return selectedAgents
}

/**
 * Select framework configuration
 * @param {boolean} simpleMode - Whether in simple mode
 * @returns {Promise<object|boolean|null>} - Framework configuration
 */
export async function selectFramework(simpleMode) {
    if (simpleMode) {
        // Simple mode: framework disabled
        return false
    }

    // Framework selection (only in custom mode)
    console.log('\n📐 AAPF Framework (optional):')
    console.log('   The Autonomous Agent Prompting Framework provides disciplined,')
    console.log('   evidence-first operational principles for AI agents.')
    console.log('   Options:')
    console.log('     1. Full (doctrine + directives + playbooks + enhancements)')
    console.log('     2. Standard (doctrine + directives + playbooks)')
    console.log('     3. Minimal (doctrine + directives only)')
    console.log('     4. Disabled')
    const frameworkChoice = await prompt('   Choice [1-4]', '2')

    if (frameworkChoice === '1') {
        return true // Full
    } else if (frameworkChoice === '2') {
        return { doctrine: true, directives: true, playbooks: true }
    } else if (frameworkChoice === '3') {
        return { doctrine: true, directives: true }
    }

    return false // Disabled
}
