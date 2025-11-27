#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Library Index
 * 
 * Central export point for all library modules
 */

// Cache
export { ModuleCache } from './cache.js'

// Error handling
export {
    ToolkitError,
    ConfigError,
    ModuleError,
    TemplateError,
    FileSystemError,
    handleError,
    formatValidationErrors
} from './errors.js'

// File utilities
export {
    ensureDir,
    readFileSafe,
    writeFileSafe,
    hasChanged,
    findFileUp,
    resolvePath
} from './file-utils.js'

// String utilities
export {
    replaceVariables,
    toKebabCase,
    toCamelCase,
    toPascalCase,
    truncate,
    pluralize
} from './string-utils.js'

// Logger
export {
    LogLevel,
    setLogLevel,
    debug,
    info,
    success,
    warn,
    error,
    progress,
    section
} from './logger.js'

// File writer
export {
    writeConfigs,
    writeConfig,
    formatWriteStats
} from './file-writer.js'
