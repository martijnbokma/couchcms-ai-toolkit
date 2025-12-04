/**
 * Sync script runner utilities
 */

import { existsSync } from 'fs'
import { join } from 'path'

/**
 * Run initial sync script
 * @param {string} projectDir - Project root directory
 * @param {string} toolkitRoot - Toolkit root directory
 * @returns {Promise<void>}
 */
export async function runInitialSync(projectDir, toolkitRoot) {
    console.log('\n🔄 Running initial sync...\n')

    try {
        const syncScript = join(toolkitRoot, 'scripts', 'cli', 'sync.js')

        if (existsSync(syncScript)) {
            // Execute sync script
            const { spawnSync } = await import('child_process')
            const result = spawnSync('bun', [syncScript], {
                cwd: projectDir,
                stdio: 'inherit',
            })

            if (result.status !== 0) {
                console.log('\n⚠️  Sync completed with warnings')
            }
        } else {
            console.log('⚠️  Sync script not found. Run manually with: bun run sync')
        }
    } catch (error) {
        console.log(`⚠️  Could not run sync automatically: ${error.message}`)
        console.log('Run manually with: bun run sync')
    }
}

/**
 * Display success message and next steps
 * @param {string} configPath - Path to config file
 * @param {string|null} contextPath - Context path or null
 * @returns {void}
 */
export function displaySuccessMessage(configPath, contextPath) {
    const configFileName = configPath.includes('.project/')
        ? '.project/standards.md'
        : configPath.includes('docs/')
          ? 'docs/standards.md'
          : 'standards.md'

    console.log('\n' + '='.repeat(60))
    console.log('\n✨ Setup complete!\n')
    console.log('Next steps:\n')

    console.log(`  1. Review and customize ${configFileName}`)

    if (contextPath) {
        console.log(`  2. Add project-specific details to ${contextPath}/context.md`)
    }

    console.log('  3. Run "bun run sync" to generate AI configurations')
    console.log('  4. Run "bun run validate" to check setup\n')

    console.log('💡 Tip: standards.md is your single source of truth for all AI agents!\n')

    console.log('Happy coding! 🎉\n')
}
