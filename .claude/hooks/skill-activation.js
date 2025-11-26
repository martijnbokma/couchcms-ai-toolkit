#!/usr/bin/env node
/**
 * Skill Activation Hook for Claude Code
 *
 * This hook runs on UserPromptSubmit and analyzes the prompt
 * to suggest relevant skills based on keywords, intent patterns,
 * and recently edited files.
 *
 * Part of CouchCMS AI Toolkit
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Load skill rules from the combined skill-rules.json
 */
function loadSkillRules() {
  const possiblePaths = [
    path.join(process.cwd(), '.claude', 'skills', 'skill-rules.json'),
    path.join(__dirname, '..', 'skills', 'skill-rules.json'),
  ]

  for (const rulesPath of possiblePaths) {
    if (fs.existsSync(rulesPath)) {
      try {
        return JSON.parse(fs.readFileSync(rulesPath, 'utf8'))
      } catch (e) {
        console.error(`Failed to parse skill-rules.json: ${e.message}`)
        return {}
      }
    }
  }

  return {}
}

/**
 * Match a file path against a glob pattern
 */
function matchGlob(filePath, pattern) {
  const regexPattern = pattern
    .replace(/\*\*/g, '{{DOUBLE_STAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/{{DOUBLE_STAR}}/g, '.*')
    .replace(/\./g, '\\.')
    .replace(/\?/g, '.')

  try {
    return new RegExp(`^${regexPattern}$`).test(filePath)
  } catch (e) {
    return false
  }
}

/**
 * Analyze prompt and context to find matching skills
 */
function analyzePrompt(prompt, editedFiles = []) {
  const skillRules = loadSkillRules()
  const suggestions = []

  for (const [skillName, config] of Object.entries(skillRules)) {
    let score = 0
    const matches = []

    // Check keywords in prompt
    if (config.promptTriggers?.keywords) {
      for (const keyword of config.promptTriggers.keywords) {
        if (prompt.toLowerCase().includes(keyword.toLowerCase())) {
          score += 10
          matches.push(`keyword: ${keyword}`)
        }
      }
    }

    // Check intent patterns in prompt
    if (config.promptTriggers?.intentPatterns) {
      for (const pattern of config.promptTriggers.intentPatterns) {
        try {
          if (new RegExp(pattern, 'i').test(prompt)) {
            score += 20
            matches.push(`intent: ${pattern}`)
          }
        } catch (e) {
          // Invalid regex, skip
        }
      }
    }

    // Check edited files against path patterns
    if (editedFiles.length > 0 && config.fileTriggers?.pathPatterns) {
      for (const file of editedFiles) {
        for (const pattern of config.fileTriggers.pathPatterns) {
          if (matchGlob(file, pattern)) {
            score += 15
            matches.push(`file: ${file}`)
          }
        }
      }
    }

    // Boost score based on priority
    if (config.priority === 'high') {
      score *= 1.5
    } else if (config.priority === 'low') {
      score *= 0.7
    }

    if (score > 0) {
      suggestions.push({
        skill: skillName,
        score: Math.round(score),
        priority: config.priority || 'medium',
        description: config.description || '',
        type: config.type || 'general',
        matches: matches.slice(0, 3), // Top 3 matches
      })
    }
  }

  // Sort by score descending and return top 3
  return suggestions.sort((a, b) => b.score - a.score).slice(0, 3)
}

/**
 * Format suggestions for Claude Code injection
 */
function formatSuggestions(suggestions) {
  if (suggestions.length === 0) {
    return null
  }

  const lines = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🎯 SKILL ACTIVATION CHECK',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
  ]

  for (const s of suggestions) {
    const priorityIcon = s.priority === 'high' ? '🔴' : s.priority === 'medium' ? '🟡' : '🟢'
    lines.push(`${priorityIcon} Use **${s.skill}** skill`)
    if (s.description) {
      lines.push(`   ${s.description}`)
    }
  }

  lines.push('')
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  return lines.join('\n')
}

/**
 * Main hook handler
 * Called by Claude Code on UserPromptSubmit
 */
export const onUserPromptSubmit = (prompt, context = {}) => {
  const suggestions = analyzePrompt(prompt, context.recentlyEditedFiles || [])

  const formatted = formatSuggestions(suggestions)

  if (formatted) {
    return {
      inject: formatted,
    }
  }

  return null
}

// Allow standalone execution for testing
const isMainModule = process.argv[1] && process.argv[1].includes('skill-activation')

if (isMainModule && process.argv.length > 2) {
  const testPrompt = process.argv[2] || 'create a new template with cms:editable fields'
  const testFiles = process.argv.slice(3)

  console.log('Testing skill activation hook...')
  console.log(`Prompt: "${testPrompt}"`)
  console.log(`Files: ${testFiles.length > 0 ? testFiles.join(', ') : 'none'}`)
  console.log('')

  const result = onUserPromptSubmit(testPrompt, {
    recentlyEditedFiles: testFiles,
  })

  if (result?.inject) {
    console.log(result.inject)
  } else {
    console.log('No skills suggested for this prompt.')
  }
}

export default { onUserPromptSubmit }
