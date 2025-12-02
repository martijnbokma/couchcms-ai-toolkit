#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Error Solutions
 *
 * Maps common errors to actionable solutions
 */

/**
 * Error solution mapping
 * Structure: errorCode -> errorPattern -> solution
 */
export const ERROR_SOLUTIONS = {
    MODULE_NOT_FOUND: {
        'gray-matter': {
            message: 'Toolkit dependencies not installed',
            solution: 'cd ai-toolkit-shared && bun install && cd ..',
            solutionSteps: [
                'cd ai-toolkit-shared',
                'bun install',
                'cd ..'
            ],
            docs: 'docs/TROUBLESHOOTING.md#sync-issues',
            explanation: 'The toolkit requires npm packages (gray-matter, yaml, handlebars) to be installed before use.'
        },
        'yaml': {
            message: 'Toolkit dependencies not installed',
            solution: 'cd ai-toolkit-shared && bun install && cd ..',
            solutionSteps: [
                'cd ai-toolkit-shared',
                'bun install',
                'cd ..'
            ],
            docs: 'docs/TROUBLESHOOTING.md#sync-issues',
            explanation: 'The toolkit requires npm packages (gray-matter, yaml, handlebars) to be installed before use.'
        },
        'handlebars': {
            message: 'Toolkit dependencies not installed',
            solution: 'cd ai-toolkit-shared && bun install && cd ..',
            solutionSteps: [
                'cd ai-toolkit-shared',
                'bun install',
                'cd ..'
            ],
            docs: 'docs/TROUBLESHOOTING.md#sync-issues',
            explanation: 'The toolkit requires npm packages (gray-matter, yaml, handlebars) to be installed before use.'
        }
    },
    TOOLKIT_NOT_FOUND: {
        default: {
            message: 'Toolkit path incorrect',
            solution: 'Check toolkit path in standards.md',
            solutionSteps: [
                'Open .project/standards.md (or standards.md)',
                'Verify the toolkit path is correct',
                'Common paths: "./ai-toolkit-shared" or "~/couchcms-ai-toolkit"'
            ],
            docs: 'docs/TROUBLESHOOTING.md#toolkit-path-not-found',
            explanation: 'The toolkit path in your configuration file does not point to a valid toolkit directory.'
        }
    },
    YAML_SYNTAX_ERROR: {
        default: {
            message: 'YAML syntax error in configuration file',
            solution: 'Fix YAML syntax in standards.md',
            solutionSteps: [
                'Check indentation (use spaces, not tabs)',
                'Ensure colons after keys: name: "value"',
                'Quote strings with special characters',
                'Remove trailing commas in lists'
            ],
            docs: 'docs/TROUBLESHOOTING.md#invalid-yaml-syntax',
            explanation: 'YAML is sensitive to formatting. Common issues: wrong indentation, missing quotes, or trailing commas.'
        }
    },
    CONFIG_NOT_FOUND: {
        default: {
            message: 'Configuration file not found',
            solution: 'Create .project/standards.md file',
            solutionSteps: [
                'Run: bun run toolkit install',
                'Or run: bun run toolkit setup',
                'This will create the configuration file for you'
            ],
            quickFix: 'bun run toolkit install',
            docs: 'docs/START-HERE.md',
            explanation: 'The toolkit requires a .project/standards.md configuration file to work.'
        }
    },
    MODULE_INVALID: {
        default: {
            message: 'Invalid module name',
            solution: 'Check module name spelling',
            solutionSteps: [
                'Run: bun run toolkit browse --modules to see available modules',
                'Common mistakes: tailwind → tailwindcss, alpine → alpinejs',
                'Update .project/standards.md with correct module name'
            ],
            quickFix: 'bun run toolkit browse --modules',
            docs: 'docs/TROUBLESHOOTING.md#module-x-not-found',
            explanation: 'Module names must match exactly. Use the browse command to see all available modules.'
        }
    },
    AGENT_INVALID: {
        default: {
            message: 'Invalid agent name',
            solution: 'Check agent name spelling',
            solutionSteps: [
                'Run: bun run toolkit browse --agents to see available agents',
                'Common mistakes: couchcms-core → couchcms',
                'Update .project/standards.md with correct agent name'
            ],
            quickFix: 'bun run toolkit browse --agents',
            docs: 'docs/TROUBLESHOOTING.md#agent-x-not-found',
            explanation: 'Agent names must match exactly. Use the browse command to see all available agents.'
        }
    },
    GIT_SUBMODULE_NOT_INIT: {
        default: {
            message: 'Git submodule not initialized',
            solution: 'Initialize the git submodule',
            solutionSteps: [
                'Run: git submodule update --init --recursive',
                'Or: git submodule init && git submodule update'
            ],
            docs: 'docs/TROUBLESHOOTING.md#submodule-issues',
            explanation: 'The toolkit is added as a git submodule and must be initialized before use.'
        }
    }
}

/**
 * Get solution for an error
 * @param {Error} error - The error object
 * @param {string} [context] - Context where error occurred
 * @returns {object|null} - Solution object or null if no solution found
 */
export function getSolutionForError(error, context = '') {
    // Check error code first
    if (error.code) {
        const solutions = ERROR_SOLUTIONS[error.code]
        if (solutions) {
            // Check for specific pattern match
            const errorMessage = error.message || ''

            // Check MODULE_NOT_FOUND for specific packages
            if (error.code === 'MODULE_NOT_FOUND') {
                for (const [pattern, solution] of Object.entries(solutions)) {
                    if (errorMessage.includes(pattern)) {
                        return solution
                    }
                }
            }

            // Return default solution for this error code
            if (solutions.default) {
                return solutions.default
            }

            // Return first available solution
            const firstKey = Object.keys(solutions)[0]
            return solutions[firstKey]
        }
    }

    // Check error message for patterns
    const errorMessage = error.message || ''

    // MODULE_NOT_FOUND pattern
    if (errorMessage.includes("Cannot find module") || errorMessage.includes("Cannot resolve")) {
        if (errorMessage.includes('gray-matter') || errorMessage.includes('yaml') || errorMessage.includes('handlebars')) {
            return ERROR_SOLUTIONS.MODULE_NOT_FOUND['gray-matter']
        }
    }

    // TOOLKIT_NOT_FOUND pattern
    if (errorMessage.includes('Toolkit path not found') || errorMessage.includes('ENOENT')) {
        return ERROR_SOLUTIONS.TOOLKIT_NOT_FOUND.default
    }

    // YAML_SYNTAX_ERROR pattern
    if (errorMessage.includes('YAML') || errorMessage.includes('yaml') || errorMessage.includes('parse error')) {
        return ERROR_SOLUTIONS.YAML_SYNTAX_ERROR.default
    }

    // CONFIG_NOT_FOUND pattern
    if (errorMessage.includes('No configuration file') || errorMessage.includes('standards.md not found')) {
        return ERROR_SOLUTIONS.CONFIG_NOT_FOUND.default
    }

    // MODULE_INVALID pattern
    if (errorMessage.includes('Module') && (errorMessage.includes('not found') || errorMessage.includes('invalid'))) {
        return ERROR_SOLUTIONS.MODULE_INVALID.default
    }

    // AGENT_INVALID pattern
    if (errorMessage.includes('Agent') && (errorMessage.includes('not found') || errorMessage.includes('invalid'))) {
        return ERROR_SOLUTIONS.AGENT_INVALID.default
    }

    // GIT_SUBMODULE pattern
    if (errorMessage.includes('submodule') || errorMessage.includes('not a git repository')) {
        return ERROR_SOLUTIONS.GIT_SUBMODULE_NOT_INIT.default
    }

    return null
}

/**
 * Format solution for display
 * @param {object} solution - Solution object
 * @returns {string} - Formatted solution text
 */
export function formatSolution(solution) {
    if (!solution) {
        return ''
    }

    let output = `\n💡 Solution:\n`

    if (solution.explanation) {
        output += `\n   ${solution.explanation}\n`
    }

    // Show quick fix command if available
    if (solution.quickFix) {
        output += `\n   ⚡ Quick Fix:\n`
        output += `   ${solution.quickFix}\n`
    }

    if (solution.solutionSteps && solution.solutionSteps.length > 0) {
        output += `\n   Steps:\n`
        solution.solutionSteps.forEach((step, index) => {
            output += `   ${index + 1}. ${step}\n`
        })
    } else if (solution.solution) {
        output += `\n   ${solution.solution}\n`
    }

    if (solution.docs) {
        output += `\n📖 More help: ${solution.docs}\n`
    }

    return output
}

