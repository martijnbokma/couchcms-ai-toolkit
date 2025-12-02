#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Frontend Selector
 *
 * Handles optional frontend framework selection (modular)
 * Separated from CouchCMS logic for clarity
 */

import { prompt, confirm } from './prompts.js'
import { getFrontendModules, getFrontendAgents, getRecommendedFrontend, getMatchingAgents } from './option-organizer.js'
import { printInfo, printSuccess } from './terminal.js'

/**
 * Select CSS framework
 * @param {string} complexity - Setup complexity (easy/medium/comprehensive)
 * @param {string} defaultChoice - Default CSS framework (for easy mode)
 * @returns {Promise<Array<string>>} Selected CSS modules
 */
export async function selectCSSFramework(complexity, defaultChoice = 'tailwindcss') {
    const frontendModules = getFrontendModules()
    const cssModules = frontendModules.css

    if (complexity === 'easy') {
        // Easy mode: Use recommended default
        printInfo(`Using recommended CSS framework: ${defaultChoice}`)
        return [defaultChoice]
    }

    console.log('\n🎨 Choose CSS framework:')
    cssModules.forEach((module, index) => {
        console.log(`  ${index + 1}. ${module.name} - ${module.description}`)
    })
    console.log(`  0. None - Skip CSS framework`)

    const answer = await prompt(`\nChoice [0-${cssModules.length}]`, complexity === 'medium' ? '1' : '0')

    if (answer === '0' || answer.toLowerCase() === 'none') {
        return []
    }

    const selectedIndex = parseInt(answer) - 1
    if (selectedIndex >= 0 && selectedIndex < cssModules.length) {
        const selected = cssModules[selectedIndex].name
        printSuccess(`Selected: ${selected}`)
        return [selected]
    }

    return []
}

/**
 * Select JS framework
 * @param {string} complexity - Setup complexity (easy/medium/comprehensive)
 * @param {string} defaultChoice - Default JS framework (for easy mode)
 * @returns {Promise<Array<string>>} Selected JS modules
 */
export async function selectJSFramework(complexity, defaultChoice = 'alpinejs') {
    const frontendModules = getFrontendModules()
    const jsModules = frontendModules.js

    if (complexity === 'easy') {
        // Easy mode: Use recommended default
        printInfo(`Using recommended JS framework: ${defaultChoice}`)
        return [defaultChoice]
    }

    console.log('\n⚡ Choose JS framework:')
    jsModules.forEach((module, index) => {
        console.log(`  ${index + 1}. ${module.name} - ${module.description}`)
    })
    console.log(`  0. None - Skip JS framework`)

    const answer = await prompt(`\nChoice [0-${jsModules.length}]`, complexity === 'medium' ? '1' : '0')

    if (answer === '0' || answer.toLowerCase() === 'none') {
        return []
    }

    const selectedIndex = parseInt(answer) - 1
    if (selectedIndex >= 0 && selectedIndex < jsModules.length) {
        const selected = jsModules[selectedIndex].name
        printSuccess(`Selected: ${selected}`)
        return [selected]
    }

    return []
}

/**
 * Select all frontend options (for comprehensive mode)
 * @returns {Promise<Object>} Object with selected modules and agents
 */
export async function selectAllFrontendOptions() {
    const frontendModules = getFrontendModules()
    const frontendAgents = getFrontendAgents()
    const selectedModules = []
    const selectedAgents = []

    // CSS frameworks
    console.log('\n🎨 Select CSS frameworks (comma-separated numbers, or "all"):')
    frontendModules.css.forEach((module, index) => {
        console.log(`  ${index + 1}. ${module.name} - ${module.description}`)
    })
    console.log(`  ${frontendModules.css.length + 1}. All CSS frameworks`)
    console.log(`  0. None`)

    const cssAnswer = await prompt(`\nChoice [0-${frontendModules.css.length + 1}, comma-separated, or "all"]`, '1')

    if (cssAnswer !== '0' && cssAnswer.toLowerCase() !== 'none') {
        if (cssAnswer.toLowerCase() === 'all' || cssAnswer === String(frontendModules.css.length + 1)) {
            selectedModules.push(...frontendModules.css.map(m => m.name))
        } else {
            const indices = cssAnswer.split(',').map(s => parseInt(s.trim()) - 1).filter(n => !isNaN(n) && n >= 0 && n < frontendModules.css.length)
            indices.forEach(i => selectedModules.push(frontendModules.css[i].name))
        }
    }

    // JS frameworks
    console.log('\n⚡ Select JS frameworks (comma-separated numbers, or "all"):')
    frontendModules.js.forEach((module, index) => {
        console.log(`  ${index + 1}. ${module.name} - ${module.description}`)
    })
    console.log(`  ${frontendModules.js.length + 1}. All JS frameworks`)
    console.log(`  0. None`)

    const jsAnswer = await prompt(`\nChoice [0-${frontendModules.js.length + 1}, comma-separated, or "all"]`, '1')

    if (jsAnswer !== '0' && jsAnswer.toLowerCase() !== 'none') {
        if (jsAnswer.toLowerCase() === 'all' || jsAnswer === String(frontendModules.js.length + 1)) {
            selectedModules.push(...frontendModules.js.map(m => m.name))
        } else {
            const indices = jsAnswer.split(',').map(s => parseInt(s.trim()) - 1).filter(n => !isNaN(n) && n >= 0 && n < frontendModules.js.length)
            indices.forEach(i => selectedModules.push(frontendModules.js[i].name))
        }
    }

    // Get matching agents
    selectedAgents.push(...getMatchingAgents(selectedModules))

    return {
        modules: selectedModules,
        agents: selectedAgents
    }
}

/**
 * Select frontend frameworks based on complexity
 * @param {string} complexity - Setup complexity (easy/medium/comprehensive)
 * @returns {Promise<Object>} Object with selected modules and agents
 */
export async function selectFrontendFrameworks(complexity) {
    if (complexity === 'easy') {
        // Easy: Use recommended defaults
        const recommended = getRecommendedFrontend()
        return {
            modules: recommended.modules,
            agents: recommended.agents
        }
    } else if (complexity === 'medium') {
        // Medium: Choose CSS and JS frameworks
        const cssModules = await selectCSSFramework(complexity)
        const jsModules = await selectJSFramework(complexity)
        const selectedModules = [...cssModules, ...jsModules]
        const selectedAgents = getMatchingAgents(selectedModules)

        return {
            modules: selectedModules,
            agents: selectedAgents
        }
    } else {
        // Comprehensive: All options
        return await selectAllFrontendOptions()
    }
}
