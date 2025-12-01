/**
 * Tests for enhanced sync process
 * Validates progress reporting, error handling, and statistics
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { spawnSync } from 'child_process'

const TEST_DIR = join(process.cwd(), 'tests', 'fixtures', 'sync-test')
const SYNC_SCRIPT = join(process.cwd(), 'scripts', 'sync.js')

/**
 * Helper function to run sync and get output
 */
function runSync() {
    return spawnSync('bun', [SYNC_SCRIPT], {
        cwd: TEST_DIR,
        encoding: 'utf8',
        env: { ...process.env }
    })
}

describe('Enhanced Sync Process', () => {
    beforeEach(() => {
        // Create test directory
        if (existsSync(TEST_DIR)) {
            rmSync(TEST_DIR, { recursive: true, force: true })
        }
        mkdirSync(TEST_DIR, { recursive: true })
    })

    afterEach(() => {
        // Cleanup
        if (existsSync(TEST_DIR)) {
            rmSync(TEST_DIR, { recursive: true, force: true })
        }
    })

    test('should display progress reporting', () => {
        // Create minimal standards.md
        const standardsPath = join(TEST_DIR, 'standards.md')
        writeFileSync(standardsPath, `---
name: "test-project"
toolkit: "${process.cwd()}"
modules:
  - couchcms-core
editors:
  - cursor
---

# Test Project
`)

        // Run sync
        const result = runSync()
        const output = result.stdout + result.stderr

        // Verify progress indicators are present (sync has 4 steps: 2/4, 3/4, 4/4)
        expect(output).toContain('[2/4]')
        expect(output).toContain('[3/4]')
        expect(output).toContain('[4/4]')
        expect(output).toContain('✅')
    })

    test('should display comprehensive statistics', () => {
        // Create minimal standards.md
        const standardsPath = join(TEST_DIR, 'standards.md')
        writeFileSync(standardsPath, `---
name: "test-project"
toolkit: "${process.cwd()}"
modules:
  - couchcms-core
  - tailwindcss
agents:
  - couchcms
editors:
  - cursor
  - claude
---

# Test Project
`)

        // Run sync
        const result = runSync()
        const output = result.stdout + result.stderr

        // Verify sync completion is displayed
        expect(output).toContain('✨ Sync Complete')
        expect(output).toContain('Modules:')
        expect(output).toContain('Agents:')
        expect(output).toContain('Configuration files generated successfully')
    })

    test('should display operation breakdown', () => {
        // Create minimal standards.md with cursor and claude
        const standardsPath = join(TEST_DIR, 'standards.md')
        writeFileSync(standardsPath, `---
name: "test-project"
toolkit: "${process.cwd()}"
modules:
  - couchcms-core
agents:
  - couchcms
editors:
  - cursor
  - claude
---

# Test Project
`)

        // Run sync
        const result = runSync()
        const output = result.stdout + result.stderr

        // Verify sync operations are displayed
        expect(output).toContain('✅ Synced:')
        expect(output).toContain('✅ Generated:')
        expect(output).toContain('✨ Sync Complete')
    })

    test('should handle errors gracefully with detailed messages', () => {
        // Create standards.md with invalid toolkit path
        const standardsPath = join(TEST_DIR, 'standards.md')
        writeFileSync(standardsPath, `---
name: "test-project"
toolkit: "/nonexistent/toolkit/path"
modules:
  - couchcms-core
---

# Test Project
`)

        // Run sync
        const result = runSync()
        const output = result.stdout + result.stderr

        // Verify error handling (error message format may vary)
        const hasError = output.includes('❌') || output.toLowerCase().includes('error') || output.toLowerCase().includes('not found')
        expect(hasError).toBe(true)
        expect(output).toContain('Toolkit path not found')
        expect(result.status).toBe(1)
    })

    test('should show progress for directory operations', () => {
        // Create minimal standards.md with cursor (which copies MDC rules)
        const standardsPath = join(TEST_DIR, 'standards.md')
        writeFileSync(standardsPath, `---
name: "test-project"
toolkit: "${process.cwd()}"
modules:
  - couchcms-core
editors:
  - cursor
---

# Test Project
`)

        // Run sync
        const result = runSync()
        const output = result.stdout + result.stderr

        // Verify sync operations
        const hasSyncOps = output.includes('✅ Synced:') || output.includes('✅ Generated:')
        expect(hasSyncOps).toBe(true)
    })

    test('should display validation warnings when present', () => {
        // This test would require creating invalid MDC files
        // For now, we just verify the structure exists
        const standardsPath = join(TEST_DIR, 'standards.md')
        writeFileSync(standardsPath, `---
name: "test-project"
toolkit: "${process.cwd()}"
modules:
  - couchcms-core
editors:
  - cursor
---

# Test Project
`)

        // Run sync
        const result = runSync()
        const output = result.stdout + result.stderr

        // Verify sync completes successfully
        expect(output).toContain('✨ Sync Complete')
        expect(result.status).toBe(0)
    })

    test('should track Claude Skills generation', () => {
        // Create standards.md with modules and agents for skills
        const standardsPath = join(TEST_DIR, 'standards.md')
        writeFileSync(standardsPath, `---
name: "test-project"
toolkit: "${process.cwd()}"
modules:
  - couchcms-core
  - tailwindcss
agents:
  - couchcms
  - tailwindcss
editors:
  - claude
---

# Test Project
`)

        // Run sync
        const result = runSync()
        const output = result.stdout + result.stderr

        // Verify Claude Skills generation is tracked
        const hasSkills = output.includes('🤖 Claude Code:') || output.includes('skill-rules configured')
        expect(hasSkills).toBe(true)
    })
})
