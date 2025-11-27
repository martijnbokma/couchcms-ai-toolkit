#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Logger
 * 
 * Consistent logging utilities
 */

/**
 * Log levels
 */
export const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
}

/**
 * Current log level (can be set via LOG_LEVEL env var)
 */
let currentLogLevel = process.env.LOG_LEVEL 
    ? LogLevel[process.env.LOG_LEVEL.toUpperCase()] || LogLevel.INFO
    : LogLevel.INFO

/**
 * Set log level
 * @param {number} level - Log level
 */
export function setLogLevel(level) {
    currentLogLevel = level
}

/**
 * Debug log (only shown when DEBUG=true)
 * @param {...any} args - Arguments to log
 */
export function debug(...args) {
    if (currentLogLevel <= LogLevel.DEBUG) {
        console.log('🔍', ...args)
    }
}

/**
 * Info log
 * @param {...any} args - Arguments to log
 */
export function info(...args) {
    if (currentLogLevel <= LogLevel.INFO) {
        console.log('ℹ️ ', ...args)
    }
}

/**
 * Success log
 * @param {...any} args - Arguments to log
 */
export function success(...args) {
    if (currentLogLevel <= LogLevel.INFO) {
        console.log('✅', ...args)
    }
}

/**
 * Warning log
 * @param {...any} args - Arguments to log
 */
export function warn(...args) {
    if (currentLogLevel <= LogLevel.WARN) {
        console.warn('⚠️ ', ...args)
    }
}

/**
 * Error log
 * @param {...any} args - Arguments to log
 */
export function error(...args) {
    if (currentLogLevel <= LogLevel.ERROR) {
        console.error('❌', ...args)
    }
}

/**
 * Progress indicator
 * @param {string} message - Progress message
 */
export function progress(message) {
    if (currentLogLevel <= LogLevel.INFO) {
        console.log('🔄', message)
    }
}

/**
 * Section header
 * @param {string} title - Section title
 */
export function section(title) {
    if (currentLogLevel <= LogLevel.INFO) {
        console.log(`\n${'='.repeat(60)}`)
        console.log(title)
        console.log('='.repeat(60))
    }
}
