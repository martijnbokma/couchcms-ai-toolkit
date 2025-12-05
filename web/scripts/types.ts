/**
 * Type definitions for build and development scripts
 */

/**
 * Bundle configuration for build script
 */
export interface BundleConfig {
    name: string
    entry: string[]
    output: string
    description: string
}

/**
 * Watch options for watch script
 */
export interface WatchOptions {
    watchServer?: boolean
}

/**
 * Change type for file watching and browser reload
 */
export type ChangeType = 'css' | 'js' | 'html' | 'full'

/**
 * Build result from Bun.build
 */
export interface BuildResult {
    success: boolean
    outputs: Array<{ text(): Promise<string> }>
    logs: Array<{ message: string; level: string }>
}
