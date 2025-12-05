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

    // Type declarations (matching globals.d.ts)
    // Using type aliases for better compatibility in IIFE scope
    type WizardState = {
        setupType: 'simple' | 'extended'
        projectName?: string
        projectDescription?: string
        preset?: string
        css?: string[]
        js?: string[]
        agents?: string[]
        editors?: string[]
        framework?: boolean | string
        framework_doctrine?: boolean | string
        framework_directives?: boolean | string
        framework_playbooks?: boolean | string
        framework_enhancements?: boolean | string
        contextDir?: string
        currentStep?: number
        completedSteps?: number[]
        lastUpdated?: number
        version?: string
    }

    type WizardStateLegacy = {
        STORAGE_KEY: string
        save(state: Partial<WizardState>): void
        load(): WizardState
        update(updates: Partial<WizardState>): WizardState
        clear(): void
        syncFromHiddenFields(): void
        collectFormData(): WizardState
        toURLParams(state?: Partial<WizardState>): URLSearchParams
    }

    // Ensure dependencies are available
    if (!window.WIZARD_CONFIG || !window.WIZARD_CONSTANTS) {
        console.error('[WizardStateManager] Required dependencies not loaded. Load constants.js first.')
        return
    }

    // ============================================================================
    // Constants
    // ============================================================================

    const WIZARD_CONFIG = window.WIZARD_CONFIG
    const STORAGE_KEY = WIZARD_CONFIG.STORAGE_KEY
    const STATE_VERSION = '2.0'
    const MAX_PROJECT_NAME_LENGTH = 100
    const MAX_PROJECT_DESCRIPTION_LENGTH = 500
    const MIN_STEP = 1
    const MAX_STEP = 10
    const DEFAULT_CONTEXT_DIR = '.project'
    const VALID_SETUP_TYPES = ['simple', 'extended'] as const
    const ARRAY_FIELDS = ['css', 'js', 'agents', 'editors', 'completedSteps'] as const
    const BOOLEAN_FIELDS = [
        'framework',
        'framework_doctrine',
        'framework_directives',
        'framework_playbooks',
        'framework_enhancements'
    ] as const
    const FRAMEWORK_OPTIONS = ['doctrine', 'directives', 'playbooks', 'enhancements'] as const

    type ArrayField = typeof ARRAY_FIELDS[number]
    type BooleanField = typeof BOOLEAN_FIELDS[number]
    type SetupType = typeof VALID_SETUP_TYPES[number]

    // ============================================================================
    // Error Classes
    // ============================================================================

    /**
     * Base error class for wizard state errors
     */
    class WizardStateError extends Error {
        readonly code: string
        readonly details: Record<string, unknown>

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

    /**
     * Error thrown when state structure is invalid
     */
    class InvalidStateError extends WizardStateError {
        constructor(details: Record<string, unknown>) {
            super('Invalid wizard state structure', 'INVALID_STATE', details)
            this.name = 'InvalidStateError'
        }
    }

    /**
     * Error thrown when storage operations fail
     */
    class StorageError extends WizardStateError {
        constructor(details: Record<string, unknown>) {
            super('Storage operation failed', 'STORAGE_ERROR', details)
            this.name = 'StorageError'
        }
    }

    // ============================================================================
    // Helper Functions
    // ============================================================================

    /**
     * Sanitize string input to prevent XSS
     */
    function sanitizeString(value: string | null | undefined, maxLength: number = Infinity): string {
        if (!value || typeof value !== 'string') {
            return ''
        }

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
     * Normalize array field value
     */
    function normalizeArray(value: unknown): string[] {
        if (!Array.isArray(value)) {
            return []
        }

        return [...new Set(
            value.filter(v => v !== null && v !== undefined && v !== '')
        )] as string[]
    }

    /**
     * Normalize boolean field value
     */
    function normalizeBoolean(value: unknown): boolean {
        return Boolean(value)
    }

    /**
     * Normalize number field value with constraints
     */
    function normalizeNumber(value: unknown, min: number, max: number, defaultValue: number): number {
        const num = typeof value === 'number' ? value : parseInt(String(value || defaultValue), 10)
        return Math.max(min, Math.min(max, num || defaultValue))
    }

    /**
     * Check if value is a valid setup type
     */
    function isValidSetupType(value: unknown): value is SetupType {
        return typeof value === 'string' && VALID_SETUP_TYPES.includes(value as SetupType)
    }

    /**
     * Create initial state object
     */
    function createInitialState(version: string): WizardState {
        return {
            setupType: (WIZARD_CONFIG.DEFAULT_SETUP_TYPE || 'simple') as SetupType,
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
            contextDir: DEFAULT_CONTEXT_DIR,
            currentStep: 1,
            completedSteps: [],
            lastUpdated: Date.now(),
            version
        }
    }

    // ============================================================================
    // Wizard State Manager Class
    // ============================================================================

    /**
     * Wizard State Manager Class - Improved Version
     */
    class WizardStateManager {
        private readonly storageKey: string
        private readonly stateVersion: string
        private readonly listeners: Set<(state: WizardState) => void>
        private readonly initialState: WizardState

        constructor() {
            this.storageKey = STORAGE_KEY
            this.stateVersion = STATE_VERSION
            this.listeners = new Set()
            this.initialState = createInitialState(this.stateVersion)
        }

        /**
         * Get initial state structure
         */
        getInitialState(): WizardState {
            return { ...this.initialState }
        }

        /**
         * Load state from sessionStorage with validation
         */
        load(): WizardState {
            try {
                const stored = sessionStorage.getItem(this.storageKey)
                if (!stored) {
                    console.log('[WizardStateManager] No stored state, returning initial state')
                    return this.getInitialState()
                }

                const state = JSON.parse(stored) as Partial<WizardState>
                console.log('[WizardStateManager] Loaded state:', state)

                // Validate state structure
                if (!this.validateState(state)) {
                    console.warn('[WizardStateManager] Invalid state structure, resetting')
                    return this.getInitialState()
                }

                // Migrate old state if needed
                if (state.version !== this.stateVersion) {
                    console.log('[WizardStateManager] Migrating state from version', state.version)
                    return this.migrateState(state)
                }

                return this.validateAndNormalize(state)
            } catch (error) {
                if (error instanceof InvalidStateError) {
                    console.error('[WizardStateManager] Invalid state:', error.details)
                    return this.getInitialState()
                }

                if (error instanceof SyntaxError) {
                    console.error('[WizardStateManager] JSON parse error:', error)
                    return this.getInitialState()
                }

                console.error('[WizardStateManager] Error loading state:', error)
                return this.getInitialState()
            }
        }

        /**
         * Save state to sessionStorage with validation
         */
        save(state: Partial<WizardState>): WizardState {
            try {
                const validated = this.validateAndNormalize(state)
                validated.lastUpdated = Date.now()
                validated.version = this.stateVersion

                try {
                    sessionStorage.setItem(this.storageKey, JSON.stringify(validated))
                    console.log('[WizardStateManager] Saved state:', validated)

                    // Notify listeners
                    this.notifyListeners(validated)

                    return validated
                } catch (storageError) {
                    throw new StorageError({ originalError: storageError })
                }
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
         */
        update(updates: Partial<WizardState>): WizardState {
            const current = this.load()
            const updated = { ...current, ...updates }
            return this.save(updated)
        }

        /**
         * Validate state structure
         */
        validateState(state: unknown): state is WizardState {
            if (!state || typeof state !== 'object') {
                return false
            }

            const s = state as Partial<WizardState>

            // Check required fields
            if (!('setupType' in s) || !('currentStep' in s)) {
                return false
            }

            // Validate setupType
            if (!isValidSetupType(s.setupType)) {
                return false
            }

            // Validate currentStep
            if (typeof s.currentStep !== 'number' || s.currentStep < MIN_STEP) {
                return false
            }

            return true
        }

        /**
         * Validate and normalize state values
         */
        validateAndNormalize(state: Partial<WizardState>): WizardState {
            const normalized: WizardState = { ...this.initialState, ...state }

            // Normalize arrays
            ARRAY_FIELDS.forEach(key => {
                const value = normalized[key]
                if (key === 'completedSteps') {
                    normalized.completedSteps = normalizeArray(value).map(v => Number(v)).filter(n => !isNaN(n))
                } else {
                    (normalized[key] as string[]) = normalizeArray(value)
                }
            })

            // Normalize and sanitize strings
            normalized.projectName = sanitizeString(normalized.projectName, MAX_PROJECT_NAME_LENGTH)
            normalized.projectDescription = sanitizeString(
                normalized.projectDescription,
                MAX_PROJECT_DESCRIPTION_LENGTH
            )
            normalized.preset = sanitizeString(normalized.preset)
            normalized.contextDir = sanitizeString(normalized.contextDir) || DEFAULT_CONTEXT_DIR

            // Normalize booleans
            BOOLEAN_FIELDS.forEach(key => {
                (normalized[key] as boolean) = normalizeBoolean(normalized[key])
            })

            // Normalize numbers
            normalized.currentStep = normalizeNumber(normalized.currentStep, MIN_STEP, MAX_STEP, 1)
            normalized.lastUpdated = normalized.lastUpdated || Date.now()

            // Ensure setupType is valid
            if (!isValidSetupType(normalized.setupType)) {
                normalized.setupType = this.initialState.setupType
            }

            return normalized
        }

        /**
         * Migrate state from old version
         */
        migrateState(oldState: Partial<WizardState>): WizardState {
            console.log('[WizardStateManager] Migrating state from version', oldState.version || '1.0')

            const migrated: WizardState = { ...this.initialState }

            // Map old fields to new structure
            if (oldState.setupType && isValidSetupType(oldState.setupType)) {
                migrated.setupType = oldState.setupType
            }

            if (oldState.projectName) {
                migrated.projectName = sanitizeString(oldState.projectName, MAX_PROJECT_NAME_LENGTH)
            }

            if (oldState.projectDescription) {
                migrated.projectDescription = sanitizeString(
                    oldState.projectDescription,
                    MAX_PROJECT_DESCRIPTION_LENGTH
                )
            }

            if (oldState.preset !== undefined) {
                migrated.preset = sanitizeString(oldState.preset)
            }

            // Migrate arrays
            const arrayFields: ArrayField[] = ['css', 'js', 'agents', 'editors']
            arrayFields.forEach(key => {
                const oldValue = oldState[key]
                if (oldValue && Array.isArray(oldValue)) {
                    (migrated[key] as string[]) = normalizeArray(oldValue)
                }
            })

            // Migrate framework options
            if (oldState.framework === 'true' || oldState.framework === true) {
                migrated.framework = true
            }

            FRAMEWORK_OPTIONS.forEach(option => {
                const key = `framework_${option}` as BooleanField
                const oldValue = oldState[key]
                if (oldValue === 'true' || oldValue === true) {
                    (migrated[key] as boolean) = true
                }
            })

            // Migrate context directory
            if (oldState.contextDir) {
                migrated.contextDir = sanitizeString(oldState.contextDir) || DEFAULT_CONTEXT_DIR
            }

            // Set current step from completed steps
            if (
                oldState.completedSteps &&
                Array.isArray(oldState.completedSteps) &&
                oldState.completedSteps.length > 0
            ) {
                migrated.completedSteps = oldState.completedSteps.filter(
                    (step): step is number => typeof step === 'number' && step >= MIN_STEP
                )
                if (migrated.completedSteps.length > 0) {
                    migrated.currentStep = Math.max(...migrated.completedSteps) + 1
                }
            }

            return this.save(migrated)
        }

        /**
         * Subscribe to state changes
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
         */
        private notifyListeners(state: WizardState): void {
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
                const initialState = this.getInitialState()
                this.notifyListeners(initialState)
                console.log('[WizardStateManager] State cleared')
            } catch (error) {
                console.error('[WizardStateManager] Error clearing state:', error)
                throw new StorageError({ originalError: error })
            }
        }

        /**
         * Export state as JSON
         */
        export(): string {
            return JSON.stringify(this.load(), null, 2)
        }

        /**
         * Import state from JSON
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

    // ============================================================================
    // Backward Compatibility
    // ============================================================================

    /**
     * Create legacy WizardState wrapper for backward compatibility
     */
    function createLegacyWrapper(manager: WizardStateManager): WizardStateLegacy {
        return {
            STORAGE_KEY: (manager as { storageKey: string }).storageKey,
            load: () => manager.load(),
            save: (state: Partial<WizardState>) => manager.save(state),
            update: (updates: Partial<WizardState>) => manager.update(updates),
            clear: () => manager.clear(),
            collectFormData: function() {
                console.warn(
                    '[WizardStateManager] collectFormData called but full WizardState not loaded. Using minimal implementation.'
                )
                return manager.load()
            },
            syncFromHiddenFields: function() {
                console.warn('[WizardStateManager] syncFromHiddenFields called but full WizardState not loaded.')
                // No-op for minimal implementation
            },
            toURLParams: function(state?: Partial<WizardState>) {
                console.warn(
                    '[WizardStateManager] toURLParams called but full WizardState not loaded. Using minimal implementation.'
                )
                const params = new URLSearchParams()
                const stateToUse = state || manager.load()
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
        }
    }

    // ============================================================================
    // Initialization
    // ============================================================================

    // Create singleton instance
    const wizardStateManager = new WizardStateManager()

    // Expose classes and instance to window with type assertions
    ;(window as unknown as {
        WizardStateManager: typeof WizardStateManager
        WizardStateError: typeof WizardStateError
        InvalidStateError: typeof InvalidStateError
        StorageError: typeof StorageError
        wizardStateManager: WizardStateManager
    }).WizardStateManager = WizardStateManager
    ;(window as unknown as {
        WizardStateError: typeof WizardStateError
    }).WizardStateError = WizardStateError
    ;(window as unknown as {
        InvalidStateError: typeof InvalidStateError
    }).InvalidStateError = InvalidStateError
    ;(window as unknown as {
        StorageError: typeof StorageError
    }).StorageError = StorageError
    // Assign with type assertion to match interface
    // Note: validate/notify in interface are aliases for validateState/notifyListeners
    window.wizardStateManager = wizardStateManager as unknown as typeof window.wizardStateManager

    // Backward compatibility: expose as WizardState for existing code
    // Only create minimal wrapper if full WizardState doesn't exist
    if (!window.WizardState || !(window.WizardState as { collectFormData?: () => WizardState }).collectFormData) {
        window.WizardState = createLegacyWrapper(wizardStateManager)
    }

    console.log('[WizardStateManager] Initialized')
})()
