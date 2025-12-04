#!/usr/bin/env bun
/**
 * Clean script for removing all generated build files
 * Removes the entire public/dist directory to ensure a clean build state
 */

import { existsSync, rmSync } from 'fs'
import { join } from 'path'

const WEB_DIR = import.meta.dir
const PUBLIC_DIR = join(WEB_DIR, '..', 'public')
const DIST_DIR = join(PUBLIC_DIR, 'dist')

console.log('🧹 Cleaning build artifacts...\n')

if (!existsSync(DIST_DIR)) {
    console.log('✅ No build artifacts found. Already clean!')
    process.exit(0)
}

try {
    // Remove the entire dist directory recursively
    rmSync(DIST_DIR, { recursive: true, force: true })
    console.log(`✅ Removed build directory: ${DIST_DIR}`)
    console.log('\n✨ Clean complete!')
    console.log('📝 Run `bun run build:web` to rebuild.')
} catch (error) {
    console.error(`❌ Error cleaning build artifacts:`, error)
    process.exit(1)
}
