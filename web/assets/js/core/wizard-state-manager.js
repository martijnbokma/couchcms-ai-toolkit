/**
 * Wizard State Manager - Improved Version
 * Centralized state management with validation, error handling, and memory management
 * Single source of truth for all wizard selections
 *
 * @class WizardStateManager
 * @example
 * const manager = new WizardStateManager()
 * manager.update({ projectName: 'my-project' })
 * const state = manager.load()
 */
(function() {
    'use strict'

    // Ensure dependencies are available
    if (!window.WIZARD_CONFIG || !window.WIZARD_CONSTANTS) {
        console.error('[WizardStateManager] Required dependencies not loaded. Load constants.js first.')
        return
    }

    const WIZARD_CONFIG = window.WIZARD_CONFIG
    const WIZARD_CONSTANTS = window.WIZARD_CONSTANTS
    const STORAGE_KEY = WIZARD_CONFIG.STORAGE_KEY
    const STATE_VERSION = '2.0'
    const MAX_PROJECT_NAME_LENGTH = 100
    const MAX_PROJECT_DESCRIPTION_LENGTH = 500

    /**
     * Custom error classes for better error handling
     */
    class WizardStateError extends Error {
        constructor(message, code, details = {}) {
            super(message)
            this.name = 'WizardStateError'
            this.code = code
            this.details = details
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, this.constructor)
            }
        }
    }

    class InvalidStateError extends WizardStateError {
        constructor(details) {
            super('Invalid wizard state structure', 'INVALID_STATE', details)
            this.name = 'InvalidStateError'
        }
    }

    class StorageError extends WizardStateError {
        constructor(details) {
            super('Storage operation failed', 'STORAGE_ERROR', details)
            this.name = 'StorageError'
        }
    }

    /**
     * Wizard State Manager Class - Improved Version
     */
    class WizardStateManager {
        constructor() {
            this.storageKey = STORAGE_KEY
            this.stateVersion = STATE_VERSION
            this.listeners = new Set()
            this.initialState = this.getInitialState()
        }

        /**
         * Get initial state structure
         * @returns {Object} Initial state object
         */
        getInitialState() {
            return {
                setupType: WIZARD_CONFIG.DEFAULT_SETUP_TYPE || 'simple',
                projectName: WIZARD_CONFIG.DEFAULT_PROJECT_NAME || '',
                projectDescription: WIZARD_CONFIG.DEFAULT_PROJECT_DESCRIPTION || '',
                preset: '',
                css: [],
                js: [],
                agents: [],
                editors: [],
                framework: false,
                framework_doctrine: false,
                framework_directives: false,
                framework_playbooks: false,
                framework_enhancements: false,
                contextDir: '.project',
                currentStep: 1,
                completedSteps: [],
                lastUpdated: Date.now(),
                version: this.stateVersion
            }
        }

        /**
         * Sanitize string input
         * @param {string} value - Input value
         * @param {number} maxLength - Maximum length
         * @returns {string} Sanitized value
         */
        sanitizeString(value, maxLength = Infinity) {
            if (!value || typeof value !== 'string') return ''

            // Trim whitespace
            let sanitized = value.trim()

            // Remove potentially dangerous characters (basic XSS prevention)
            sanitized = sanitized.replace(/[<>\"']/g, '')

            // Limit length
            if (sanitized.length > maxLength) {
                sanitized = sanitized.substring(0, maxLength)
            }

            return sanitized
        }

        /**
         * Load state from sessionStorage with validation
         * @returns {Object} Complete wizard state
         * @throws {StorageError} If storage operation fails
         * @throws {InvalidStateError} If state structure is invalid
         */
        load() {
            try {
                const stored = sessionStorage.getItem(this.storageKey)
                if (!stored) {
                    console.log('[WizardStateManager] No stored state, returning initial state')
                    return { ...this.initialState }
                }

                const state = JSON.parse(stored)
                console.log('[WizardStateManager] Loaded state:', state)

                // Validate state structure
                if (!this.validateState(state)) {
                    console.warn('[WizardStateManager] Invalid state structure, resetting')
                    return { ...this.initialState }
                }

                // Migrate old state if needed
                if (state.version !== this.stateVersion) {
                    console.log('[WizardStateManager] Migrating state from version', state.version)
                    return this.migrateState(state)
                }

                return state
            } catch (error) {
                if (error instanceof InvalidStateError) {
                    console.error('[WizardStateManager] Invalid state:', error.details)
                    return { ...this.initialState }
                }

                if (error instanceof SyntaxError) {
                    console.error('[WizardStateManager] JSON parse error:', error)
                    return { ...this.initialState }
                }

                console.error('[WizardStateManager] Error loading state:', error)
                return { ...this.initialState }
            }
        }

        /**
         * Save state to sessionStorage with validation
         * @param {Object} state - State object to save
         * @returns {Object} Validated and normalized state
         * @throws {InvalidStateError} If state structure is invalid
         * @throws {StorageError} If storage operation fails
         */
        save(state) {
            try {
                const validated = this.validateAndNormalize(state)
                validated.lastUpdated = Date.now()
                validated.version = this.stateVersion

                sessionStorage.setItem(this.storageKey, JSON.stringify(validated))
                console.log('[WizardStateManager] Saved state:', validated)

                // Notify listeners
                this.notifyListeners(validated)

                return validated
            } catch (error) {
                if (error instanceof InvalidStateError || error instanceof StorageError) {
                    throw error
                }

                console.error('[WizardStateManager] Error saving state:', error)
                throw new StorageError({ originalError: error })
            }
        }

        /**
         * Update specific fields in state
         * @param {Object} updates - Fields to update
         * @returns {Object} Updated state
         */
        update(updates) {
            const current = this.load()
            const updated = { ...current, ...updates }
            return this.save(updated)
        }

        /**
         * Validate state structure
         * @param {Object} state - State to validate
         * @returns {boolean} True if valid
         */
        validateState(state) {
            if (!state || typeof state !== 'object') return false

            // Check required fields
            const required = ['setupType', 'currentStep']
            if (!required.every(key => key in state)) {
                return false
            }

            // Validate setupType
            if (!['simple', 'extended'].includes(state.setupType)) {
                return false
            }

            // Validate currentStep
            if (typeof state.currentStep !== 'number' || state.currentStep < 1) {
                return false
            }

            return true
        }

        /**
         * Validate and normalize state values
         * @param {Object} state - State to normalize
         * @returns {Object} Normalized state
         */
        validateAndNormalize(state) {
            const normalized = { ...this.initialState, ...state }

            // Normalize arrays - ensure they're arrays and remove duplicates
            const arrayFields = ['css', 'js', 'agents', 'editors', 'completedSteps']
            arrayFields.forEach(key => {
                if (normalized[key] && !Array.isArray(normalized[key])) {
                    normalized[key] = []
                } else if (normalized[key]) {
                    normalized[key] = [...new Set(
                        normalized[key].filter(v =>
                            v !== null && v !== undefined && v !== ''
                        )
                    )]
                }
            })

            // Normalize and sanitize strings
            normalized.projectName = this.sanitizeString(
                normalized.projectName,
                MAX_PROJECT_NAME_LENGTH
            )
            normalized.projectDescription = this.sanitizeString(
                normalized.projectDescription,
                MAX_PROJECT_DESCRIPTION_LENGTH
            )
            normalized.preset = this.sanitizeString(normalized.preset)
            normalized.contextDir = this.sanitizeString(normalized.contextDir) || '.project'

            // Normalize booleans
            const booleanFields = [
                'framework',
                'framework_doctrine',
                'framework_directives',
                'framework_playbooks',
                'framework_enhancements'
            ]
            booleanFields.forEach(key => {
                normalized[key] = Boolean(normalized[key])
            })

            // Normalize numbers
            normalized.currentStep = Math.max(1, Math.min(10, parseInt(normalized.currentStep) || 1))
            normalized.lastUpdated = normalized.lastUpdated || Date.now()

            return normalized
        }

        /**
         * Migrate state from old version
         * @param {Object} oldState - Old state to migrate
         * @returns {Object} Migrated state
         */
        migrateState(oldState) {
            console.log('[WizardStateManager] Migrating state from version', oldState.version || '1.0')

            const migrated = { ...this.initialState }

            // Map old fields to new structure
            if (oldState.setupType) migrated.setupType = oldState.setupType
            if (oldState.projectName) migrated.projectName = this.sanitizeString(oldState.projectName)
            if (oldState.projectDescription) migrated.projectDescription = this.sanitizeString(oldState.projectDescription)
            if (oldState.preset !== undefined) migrated.preset = this.sanitizeString(oldState.preset)

            // Migrate arrays
            const arrayFields = ['css', 'js', 'agents', 'editors']
            arrayFields.forEach(key => {
                if (oldState[key] && Array.isArray(oldState[key])) {
                    migrated[key] = [...new Set(oldState[key])]
                }
            })

            // Migrate framework options
            if (oldState.framework === 'true' || oldState.framework === true) {
                migrated.framework = true
            }
            const frameworkOptions = ['doctrine', 'directives', 'playbooks', 'enhancements']
            frameworkOptions.forEach(option => {
                const key = `framework_${option}`
                if (oldState[key] === 'true' || oldState[key] === true) {
                    migrated[key] = true
                }
            })

            // Migrate context directory
            if (oldState.contextDir) {
                migrated.contextDir = this.sanitizeString(oldState.contextDir) || '.project'
            }

            // Set current step
            if (oldState.completedSteps && Array.isArray(oldState.completedSteps) && oldState.completedSteps.length > 0) {
                migrated.completedSteps = [...oldState.completedSteps]
                migrated.currentStep = Math.max(...oldState.completedSteps) + 1
            }

            return this.save(migrated)
        }

        /**
         * Subscribe to state changes
         * @param {Function} callback - Callback function
         * @returns {Function} Unsubscribe function
         */
        subscribe(callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('Callback must be a function')
            }

            this.listeners.add(callback)

            // Return unsubscribe function
            return () => {
                this.listeners.delete(callback)
            }
        }

        /**
         * Notify listeners of state changes
         * @param {Object} state - State to notify
         * @private
         */
        notifyListeners(state) {
            this.listeners.forEach(callback => {
                try {
                    callback(state)
                } catch (error) {
                    console.error('[WizardStateManager] Error in state listener:', error)
                }
            })
        }

        /**
         * Clear state
         */
        clear() {
            try {
                sessionStorage.removeItem(this.storageKey)
                const initialState = { ...this.initialState }
                this.notifyListeners(initialState)
                console.log('[WizardStateManager] State cleared')
            } catch (error) {
                console.error('[WizardStateManager] Error clearing state:', error)
                throw new StorageError({ originalError: error })
            }
        }

        /**
         * Export state as JSON
         * @returns {string} JSON string
         */
        export() {
            return JSON.stringify(this.load(), null, 2)
        }

        /**
         * Import state from JSON
         * @param {string} jsonString - JSON string to import
         * @returns {Object} Imported state
         * @throws {InvalidStateError} If state is invalid
         */
        import(jsonString) {
            try {
                const state = JSON.parse(jsonString)
                if (this.validateState(state)) {
                    return this.save(state)
                } else {
                    throw new InvalidStateError({ state })
                }
            } catch (error) {
                if (error instanceof InvalidStateError) {
                    throw error
                }
                console.error('[WizardStateManager] Error importing state:', error)
                throw new InvalidStateError({ originalError: error })
            }
        }
    }

    // Create singleton instance
    window.WizardStateManager = WizardStateManager
    window.WizardStateError = WizardStateError
    window.InvalidStateError = InvalidStateError
    window.StorageError = StorageError
    window.wizardStateManager = new WizardStateManager()

    // Backward compatibility: expose as WizardState for existing code
    // This allows gradual migration
    // Only create minimal wrapper if full WizardState doesn't exist
    // Full implementation (from core/state.js) will replace this if loaded later
    if (!window.WizardState || !window.WizardState.collectFormData) {
        window.WizardState = {
            load: () => window.wizardStateManager.load(),
            save: (state) => window.wizardStateManager.save(state),
            update: (updates) => window.wizardStateManager.update(updates),
            clear: () => window.wizardStateManager.clear(),
            // Stub methods that will be replaced by full implementation
            // These prevent errors if called before full implementation loads
            collectFormData: function() {
                console.warn('[WizardStateManager] collectFormData called but full WizardState not loaded. Using minimal implementation.')
                return window.wizardStateManager.load()
            },
            syncFromHiddenFields: function() {
                console.warn('[WizardStateManager] syncFromHiddenFields called but full WizardState not loaded.')
                // No-op for minimal implementation
            },
            toURLParams: function(state) {
                console.warn('[WizardStateManager] toURLParams called but full WizardState not loaded. Using minimal implementation.')
                const params = new URLSearchParams()
                const stateToUse = state || window.wizardStateManager.load()
                Object.entries(stateToUse).forEach(([key, value]) => {
                    if (value !== null && value !== undefined && value !== '') {
                        if (Array.isArray(value)) {
                            value.forEach(v => params.append(key, v))
                        } else {
                            params.append(key, value)
                        }
                    }
                })
                return params
            }
        }
    }

    console.log('[WizardStateManager] Initialized')
})()
