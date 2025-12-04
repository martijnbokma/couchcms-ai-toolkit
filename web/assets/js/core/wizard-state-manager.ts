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
        code: string
        details: Record<string, unknown>

        constructor(message: string, code: string, details: Record<string, unknown> = {}) {
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
        constructor(details: Record<string, unknown>) {
            super('Invalid wizard state structure', 'INVALID_STATE', details)
            this.name = 'InvalidStateError'
        }
    }

    class StorageError extends WizardStateError {
        constructor(details: Record<string, unknown>) {
            super('Storage operation failed', 'STORAGE_ERROR', details)
            this.name = 'StorageError'
        }
    }

    /**
     * Wizard State Manager Class - Improved Version
     */
    class WizardStateManager {
        storageKey: string
        stateVersion: string
        listeners: Set<(state: WizardState) => void>
        initialState: WizardState

        constructor() {
            this.storageKey = STORAGE_KEY
            this.stateVersion = STATE_VERSION
            this.listeners = new Set()
            this.initialState = this.getInitialState()
        }

        /**
         * Get initial state structure
         * @returns {WizardState} Initial state object
         */
        getInitialState(): WizardState {
            return {
                setupType: (WIZARD_CONFIG.DEFAULT_SETUP_TYPE || 'simple') as 'simple' | 'extended',
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
        sanitizeString(value: string | null | undefined, maxLength: number = Infinity): string {
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
         * @returns {WizardState} Complete wizard state
         */
        load(): WizardState {
            try {
                const stored = sessionStorage.getItem(this.storageKey)
                if (!stored) {
                    console.log('[WizardStateManager] No stored state, returning initial state')
                    return { ...this.initialState }
                }

                const state = JSON.parse(stored) as Partial<WizardState>
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

                return state as WizardState
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
         * @param {WizardState} state - State object to save
         * @returns {WizardState} Validated and normalized state
         */
        save(state: Partial<WizardState>): WizardState {
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
         * @param {Partial<WizardState>} updates - Fields to update
         * @returns {WizardState} Updated state
         */
        update(updates: Partial<WizardState>): WizardState {
            const current = this.load()
            const updated = { ...current, ...updates }
            return this.save(updated)
        }

        /**
         * Validate state structure
         * @param {unknown} state - State to validate
         * @returns {boolean} True if valid
         */
        validateState(state: unknown): state is WizardState {
            if (!state || typeof state !== 'object') return false

            const s = state as Partial<WizardState>

            // Check required fields
            const required = ['setupType', 'currentStep']
            if (!required.every(key => key in s)) {
                return false
            }

            // Validate setupType
            if (!['simple', 'extended'].includes(s.setupType || '')) {
                return false
            }

            // Validate currentStep
            if (typeof s.currentStep !== 'number' || (s.currentStep || 0) < 1) {
                return false
            }

            return true
        }

        /**
         * Validate and normalize state values
         * @param {Partial<WizardState>} state - State to normalize
         * @returns {WizardState} Normalized state
         */
        validateAndNormalize(state: Partial<WizardState>): WizardState {
            const normalized: WizardState = { ...this.initialState, ...state } as WizardState

            // Normalize arrays - ensure they're arrays and remove duplicates
            const arrayFields: (keyof WizardState)[] = ['css', 'js', 'agents', 'editors', 'completedSteps']
            arrayFields.forEach(key => {
                const value = normalized[key]
                if (value && !Array.isArray(value)) {
                    (normalized[key] as string[]) = []
                } else if (Array.isArray(value)) {
                    (normalized[key] as string[]) = [...new Set(
                        value.filter(v =>
                            v !== null && v !== undefined && v !== ''
                        )
                    )] as string[]
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
            const booleanFields: (keyof WizardState)[] = [
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
            normalized.currentStep = Math.max(1, Math.min(10, parseInt(String(normalized.currentStep)) || 1))
            normalized.lastUpdated = normalized.lastUpdated || Date.now()

            return normalized
        }

        /**
         * Migrate state from old version
         * @param {Partial<WizardState>} oldState - Old state to migrate
         * @returns {WizardState} Migrated state
         */
        migrateState(oldState: Partial<WizardState>): WizardState {
            console.log('[WizardStateManager] Migrating state from version', oldState.version || '1.0')

            const migrated: WizardState = { ...this.initialState }

            // Map old fields to new structure
            if (oldState.setupType) migrated.setupType = oldState.setupType as 'simple' | 'extended'
            if (oldState.projectName) migrated.projectName = this.sanitizeString(oldState.projectName)
            if (oldState.projectDescription) migrated.projectDescription = this.sanitizeString(oldState.projectDescription)
            if (oldState.preset !== undefined) migrated.preset = this.sanitizeString(oldState.preset)

            // Migrate arrays
            const arrayFields: (keyof WizardState)[] = ['css', 'js', 'agents', 'editors']
            arrayFields.forEach(key => {
                const oldValue = oldState[key]
                if (oldValue && Array.isArray(oldValue)) {
                    (migrated[key] as string[]) = [...new Set(oldValue)] as string[]
                }
            })

            // Migrate framework options
            if (oldState.framework === 'true' || oldState.framework === true) {
                migrated.framework = true
            }
            const frameworkOptions = ['doctrine', 'directives', 'playbooks', 'enhancements']
            frameworkOptions.forEach(option => {
                const key = `framework_${option}` as keyof WizardState
                const oldValue = oldState[key]
                if (oldValue === 'true' || oldValue === true) {
                    (migrated[key] as boolean) = true
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
         * @param {(state: WizardState) => void} callback - Callback function
         * @returns {() => void} Unsubscribe function
         */
        subscribe(callback: (state: WizardState) => void): () => void {
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
         * @param {WizardState} state - State to notify
         * @private
         */
        notifyListeners(state: WizardState): void {
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
        clear(): void {
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
        export(): string {
            return JSON.stringify(this.load(), null, 2)
        }

        /**
         * Import state from JSON
         * @param {string} jsonString - JSON string to import
         * @returns {WizardState} Imported state
         */
        import(jsonString: string): WizardState {
            try {
                const state = JSON.parse(jsonString) as Partial<WizardState>
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
    if (!window.WizardState || !(window.WizardState as { collectFormData?: () => WizardState }).collectFormData) {
        window.WizardState = {
            load: () => window.wizardStateManager.load(),
            save: (state: Partial<WizardState>) => window.wizardStateManager.save(state),
            update: (updates: Partial<WizardState>) => window.wizardStateManager.update(updates),
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
            toURLParams: function(state?: Partial<WizardState>) {
                console.warn('[WizardStateManager] toURLParams called but full WizardState not loaded. Using minimal implementation.')
                const params = new URLSearchParams()
                const stateToUse = state || window.wizardStateManager.load()
                Object.entries(stateToUse).forEach(([key, value]) => {
                    if (value !== null && value !== undefined && value !== '') {
                        if (Array.isArray(value)) {
                            value.forEach(v => params.append(key, String(v)))
                        } else {
                            params.append(key, String(value))
                        }
                    }
                })
                return params
            }
        } as WizardStateLegacy
    }

    console.log('[WizardStateManager] Initialized')
})()
