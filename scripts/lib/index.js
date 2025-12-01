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

// Dependency checker
export {
    areDependenciesInstalled,
    ensureDependencies,
    checkAndInstallDependencies
} from './dependency-checker.js'

// Error solutions
export {
    ERROR_SOLUTIONS,
    getSolutionForError,
    formatSolution
} from './error-solutions.js'

// Toolkit detector
export {
    detectToolkitPath,
    detectToolkitPathAbsolute
} from './toolkit-detector.js'

// Onboarding
export {
    isFirstTimeUser,
    showWelcomeMessage,
    showConceptExplanation,
    showProgress,
    getConceptExplanation,
    showSummary,
    CONCEPT_EXPLANATIONS
} from './onboarding.js'

// YAML validator
export {
    YAMLSyntaxError,
    validateYAMLSyntax,
    validateYAMLFile,
    formatYAMLErrors
} from './yaml-validator.js'

// Fuzzy matcher
export {
    findBestMatches,
    getSuggestions,
    checkCommonTypo,
    validateName,
    formatNameError
} from './fuzzy-matcher.js'

// Template validator
export {
    extractTemplateVariables,
    validateTemplateVariables,
    formatTemplateErrors,
    validateTemplate
} from './template-validator.js'
<<<<<<< HEAD

// Path utilities
export {
    getToolkitRoot,
    getToolkitRootCached,
    getScriptsDir,
    getLibDir
} from './paths.js'

// Presets loader
export {
    loadPresets,
    getPreset,
    getPresetKeys,
    hasPreset
} from './presets-loader.js'

// Object utilities
export {
    deepMerge,
    deepClone,
    deepEqual
} from './object-utils.js'

// Terminal utilities
export {
    colors,
    terminal,
    print,
    printWithIcon,
    printSuccess,
    printError,
    printWarning,
    printInfo,
    printProgress,
    printConfigSummary,
    printBanner,
    printSection,
    printBox,
    printStep,
    printList,
    printSummary
} from './terminal.js'
=======
>>>>>>> 5881bba (updates 2025-12-01)
