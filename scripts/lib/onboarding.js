#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Onboarding Utilities
 *
 * Helper functions for first-time user onboarding
 */

import { existsSync } from 'fs'
import { join } from 'path'
import { success, info, section } from './logger.js'

/**
 * Check if this is a first-time user
 * @param {string} projectDir - Project root directory
 * @returns {boolean} - True if first-time user (no .project/standards.md exists)
 */
export function isFirstTimeUser(projectDir) {
    const configPath = join(projectDir, '.project', 'standards.md')
    return !existsSync(configPath)
}

/**
 * Show welcome message for first-time users
 */
export function showWelcomeMessage() {
    section('Welcome to CouchCMS AI Toolkit!')

    console.log(`
This wizard will help you set up AI assistance for your CouchCMS project.

What this does:
  • Creates a configuration file (.project/standards.md)
  • Sets up AI agents for CouchCMS development
  • Configures your editor (Cursor, Claude, etc.) with project knowledge

You'll be asked a few simple questions about your project.
Don't worry - you can change everything later!

Let's get started...\n`)
}

/**
 * Show explanation for a concept
 * @param {string} concept - Concept name
 * @param {string} explanation - Explanation text
 */
export function showConceptExplanation(concept, explanation) {
    console.log(`\n💡 What is ${concept}?`)
    console.log(`\n   ${explanation}\n`)
}

/**
 * Show progress indicator
 * @param {number} current - Current step number
 * @param {number} total - Total steps
 * @param {string} stepName - Name of current step
 */
export function showProgress(current, total, stepName) {
    const percentage = Math.round((current / total) * 100)
    const barLength = 30
    const filled = Math.round((current / total) * barLength)
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled)

    console.log(`\n[${bar}] ${percentage}% - Step ${current}/${total}: ${stepName}\n`)
}

/**
 * Concept explanations for common questions
 */
export const CONCEPT_EXPLANATIONS = {
    'project type': `Project type helps us recommend the right modules and agents for your project.
For example, a blog needs comment and search modules, while an e-commerce site needs forms and user management.`,

    'styling framework': `A styling framework helps you design your website quickly.
  • TailwindCSS: Utility-first CSS framework (recommended)
  • daisyUI: Component library built on TailwindCSS (adds pre-built components)
  • Custom CSS: Write your own styles from scratch`,

    'interactivity': `Interactivity adds dynamic behavior to your website.
  • Alpine.js: Lightweight JavaScript framework (recommended for most projects)
  • TypeScript: Adds type safety to JavaScript (for complex applications)
  • HTMX: Server-side interactions without complex JavaScript
  • None: Static website with no JavaScript`,

    'modules': `Modules are knowledge packages that teach AI assistants about specific technologies.
For example, the "tailwindcss" module teaches AI about TailwindCSS patterns and best practices.
You can add or remove modules later in .project/standards.md`,

    'agents': `Agents are specialized AI assistants for different tasks.
For example, the "couchcms" agent helps with CouchCMS templates, while "tailwindcss" helps with styling.
Agents are automatically selected based on your chosen modules.`,

    'framework (AAPF)': `The AAPF (Autonomous Agent Prompting Framework) provides structured workflows for AI agents.
It's optional and mainly useful for complex projects with multiple developers.
For most projects, you can leave this disabled.`,

    'standards.md': `standards.md is your project's configuration file.
It contains:
  • Which modules and agents to use
  • Project-specific coding rules
  • Custom instructions for AI assistants

This file is the "single source of truth" - all AI configurations are generated from it.`
}

/**
 * Get explanation for a concept
 * @param {string} conceptKey - Key in CONCEPT_EXPLANATIONS
 * @returns {string|null} - Explanation or null if not found
 */
export function getConceptExplanation(conceptKey) {
    return CONCEPT_EXPLANATIONS[conceptKey.toLowerCase()] || null
}

/**
 * Show summary before final confirmation
 * @param {object} summary - Summary object with project info
 */
export function showSummary(summary) {
    section('Configuration Summary')

    console.log(`\nProject Information:`)
    console.log(`  Name: ${summary.projectName}`)
    console.log(`  Description: ${summary.projectDescription}`)
    console.log(`  Type: ${summary.projectType}`)

    console.log(`\nConfiguration:`)
    console.log(`  Location: ${summary.configPath}`)
    console.log(`  Modules: ${summary.modules.length} selected`)
    console.log(`  Agents: ${summary.agents.length} selected`)
    console.log(`  Framework: ${summary.framework ? 'Enabled' : 'Disabled'}`)

    console.log(`\nWhat will be created:`)
    console.log(`  • ${summary.configPath} - Your project configuration`)
    console.log(`  • .cursorrules - Cursor IDE configuration`)
    console.log(`  • CLAUDE.md - Claude Code memory file`)
    console.log(`  • AGENTS.md - Agent documentation`)
    console.log(`  • Other editor configurations`)

    console.log(`\n💡 Tip: You can modify .project/standards.md anytime to change settings.\n`)
}
