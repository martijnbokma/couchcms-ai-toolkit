# Wizard Improved Components - Best Practices Compliant

## Overzicht

Dit document bevat verbeterde versies van de wizard componenten die voldoen aan alle best practices.

---

## 1. Improved WizardStateManager (met Error Handling & Memory Management)

```javascript
/**
 * Wizard State Manager - Improved Version
 * Centralized state management with validation, error handling, and memory management
 *
 * @class WizardStateManager
 * @example
 * const manager = new WizardStateManager()
 * manager.update({ projectName: 'my-project' })
 * const state = manager.load()
 */
(function() {
    'use strict'

    const STORAGE_KEY = 'couchcms-wizard-state'
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
                setupType: 'simple',
                projectName: '',
                projectDescription: '',
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
                    throw new InvalidStateError({ state })
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
                    throw new StorageError({ originalError: error })
                }

                console.error('[WizardStateManager] Error loading state:', error)
                throw new StorageError({ originalError: error })
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
            const required = ['setupType', 'currentStep', 'version']
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
            console.log('[WizardStateManager] Migrating state from version', oldState.version)

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

    console.log('[WizardStateManager] Initialized')
})()
```

---

## 2. Improved FormStateSync (met Memory Management)

```javascript
/**
 * Form State Synchronization - Improved Version
 * Handles bidirectional sync between forms and wizard state with proper cleanup
 *
 * @class FormStateSync
 */
(function() {
    'use strict'

    if (!window.wizardStateManager) {
        console.error('[FormStateSync] WizardStateManager not available')
        return
    }

    const stateManager = window.wizardStateManager

    /**
     * Form State Sync Class - Improved Version
     */
    class FormStateSync {
        constructor() {
            this.debounceTimers = new Map()
            this.listeners = new Map() // Track listeners per form for cleanup
            this.debounceDelay = 300
        }

        /**
         * Collect form data and convert to state format
         * @param {HTMLFormElement} form - Form element
         * @returns {Object} Form data as state object
         */
        collectFormData(form) {
            if (!form || form.tagName !== 'FORM') {
                console.warn('[FormStateSync] Invalid form element')
                return {}
            }

            const formData = new FormData(form)
            const data = {}

            // Process all form fields
            for (const [key, value] of formData.entries()) {
                // Framework checkboxes (boolean)
                if (key.startsWith('framework_')) {
                    data[key] = value === 'true' || value === true
                }
                // Framework main checkbox
                else if (key === 'framework') {
                    data[key] = value === 'true' || value === true
                }
                // Array fields (checkboxes)
                else if (['css', 'js', 'agents', 'editors'].includes(key)) {
                    if (!data[key]) data[key] = []
                    if (value && value !== 'false' && value !== '') {
                        data[key].push(value)
                    }
                }
                // Setup type
                else if (key === 'setupType') {
                    data[key] = value || 'simple'
                }
                // Preset (radio button)
                else if (key === 'preset') {
                    data[key] = value || ''
                }
                // Context directory
                else if (key === 'contextDir') {
                    data[key] = value || '.project'
                }
                // Text fields
                else {
                    data[key] = value || ''
                }
            }

            // Remove duplicates from arrays
            ['css', 'js', 'agents', 'editors'].forEach(key => {
                if (data[key] && Array.isArray(data[key])) {
                    data[key] = [...new Set(data[key])]
                }
            })

            return data
        }

        /**
         * Apply state to form elements
         * @param {HTMLFormElement} form - Form element
         * @param {Object} state - State to apply
         */
        applyStateToForm(form, state) {
            if (!form || form.tagName !== 'FORM') {
                console.warn('[FormStateSync] Invalid form element')
                return
            }

            console.log('[FormStateSync] Applying state to form:', state)

            // Apply text inputs and textareas
            Object.entries(state).forEach(([key, value]) => {
                if (['css', 'js', 'agents', 'editors'].includes(key)) {
                    // Checkboxes - check matching values
                    const checkboxes = form.querySelectorAll(`input[name="${key}"][type="checkbox"]`)
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = Array.isArray(value) && value.includes(checkbox.value)
                    })
                }
                else if (key === 'preset') {
                    // Radio button - check matching value
                    const radio = form.querySelector(`input[name="${key}"][type="radio"][value="${value}"]`)
                    if (radio) {
                        radio.checked = true
                    } else if (value === '') {
                        // Check "skip" option if value is empty
                        const skipRadio = form.querySelector(`input[name="${key}"][type="radio"][value=""]`)
                        if (skipRadio) skipRadio.checked = true
                    }
                }
                else if (key.startsWith('framework_')) {
                    // Framework option checkboxes
                    const checkbox = form.querySelector(`input[name="${key}"][type="checkbox"]`)
                    if (checkbox) {
                        checkbox.checked = value === true || value === 'true'
                    }
                }
                else if (key === 'framework') {
                    // Framework main checkbox
                    const checkbox = form.querySelector(`input[name="${key}"][type="checkbox"]`)
                    if (checkbox) {
                        checkbox.checked = value === true || value === 'true'
                        // Trigger visibility update if function exists
                        if (checkbox.checked && typeof window.updateFrameworkVisibility === 'function') {
                            window.updateFrameworkVisibility()
                        }
                    }
                }
                else {
                    // Text inputs and textareas
                    const input = form.querySelector(`input[name="${key}"], textarea[name="${key}"]`)
                    if (input && input.type !== 'hidden') {
                        input.value = value || ''
                    }
                }
            })

            console.log('[FormStateSync] State applied to form')
        }

        /**
         * Sync form to state (form → state)
         * @param {HTMLFormElement} form - Form element
         */
        syncFormToState(form) {
            const formData = this.collectFormData(form)
            stateManager.update(formData)
            console.log('[FormStateSync] Synced form to state:', formData)
        }

        /**
         * Restore state to form (state → form)
         * @param {HTMLFormElement} form - Form element
         */
        restoreStateToForm(form) {
            const state = stateManager.load()
            this.applyStateToForm(form, state)
            console.log('[FormStateSync] Restored state to form')
        }

        /**
         * Setup form event listeners with cleanup tracking
         * @param {HTMLFormElement} form - Form element
         */
        setupFormListeners(form) {
            if (!form || form.tagName !== 'FORM') {
                console.warn('[FormStateSync] Invalid form element')
                return
            }

            // Cleanup existing listeners if any
            this.cleanupFormListeners(form)

            // Create handler functions
            const inputHandler = (e) => {
                if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                    // Immediate save for checkboxes/radios
                    this.syncFormToState(form)
                } else {
                    // Debounced save for text inputs
                    this.debouncedSync(form)
                }
            }

            const changeHandler = (e) => {
                if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                    this.syncFormToState(form)
                }
            }

            const submitHandler = (e) => {
                // Ensure state is saved before submit
                this.syncFormToState(form)
            }

            // Add listeners
            form.addEventListener('input', inputHandler, { capture: true })
            form.addEventListener('change', changeHandler, { capture: true })
            form.addEventListener('submit', submitHandler, { capture: true })

            // Store handlers for cleanup
            this.listeners.set(form, {
                input: inputHandler,
                change: changeHandler,
                submit: submitHandler
            })

            console.log('[FormStateSync] Form listeners setup complete')
        }

        /**
         * Cleanup form event listeners
         * @param {HTMLFormElement} form - Form element
         */
        cleanupFormListeners(form) {
            const handlers = this.listeners.get(form)
            if (handlers) {
                // Remove event listeners
                Object.entries(handlers).forEach(([event, handler]) => {
                    form.removeEventListener(event, handler, { capture: true })
                })

                // Remove from map
                this.listeners.delete(form)

                // Clear debounce timer
                const timer = this.debounceTimers.get(form)
                if (timer) {
                    clearTimeout(timer)
                    this.debounceTimers.delete(form)
                }

                console.log('[FormStateSync] Form listeners cleaned up')
            }
        }

        /**
         * Debounced sync
         * @param {HTMLFormElement} form - Form element
         * @private
         */
        debouncedSync(form) {
            const timer = this.debounceTimers.get(form)
            if (timer) clearTimeout(timer)

            const newTimer = setTimeout(() => {
                this.syncFormToState(form)
                this.debounceTimers.delete(form)
            }, this.debounceDelay)

            this.debounceTimers.set(form, newTimer)
        }

        /**
         * Cleanup all listeners (for page unload)
         */
        cleanupAll() {
            this.listeners.forEach((handlers, form) => {
                this.cleanupFormListeners(form)
            })
        }
    }

    // Create singleton instance
    window.FormStateSync = FormStateSync
    window.formStateSync = new FormStateSync()

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        window.formStateSync.cleanupAll()
    })

    console.log('[FormStateSync] Initialized')
})()
```

---

## 3. Improved HTMX Integration (met Cleanup)

```javascript
/**
 * Wizard Initialization - Improved Version
 * Sets up HTMX event listeners and form synchronization with proper cleanup
 */
(function() {
    'use strict'

    if (!window.wizardStateManager || !window.formStateSync) {
        console.error('[WizardInit] Required dependencies not available')
        return
    }

    const stateManager = window.wizardStateManager
    const formSync = window.formStateSync

    // Track HTMX listeners for cleanup
    const htmxListeners = []

    /**
     * Initialize wizard on page load
     */
    function initializeWizard() {
        console.log('[WizardInit] Initializing wizard')

        // Get setup type from URL
        const urlParams = new URLSearchParams(window.location.search)
        const setupType = urlParams.get('type') || urlParams.get('setupType') || 'simple'

        // Initialize state with setup type
        stateManager.update({ setupType })

        // Setup form listeners for initial form
        const form = document.querySelector('form')
        if (form) {
            formSync.setupFormListeners(form)
            // Restore state to form
            setTimeout(() => {
                formSync.restoreStateToForm(form)
            }, 100)
        }

        // Setup HTMX event listeners
        setupHtmxListeners()

        console.log('[WizardInit] Wizard initialized')
    }

    /**
     * Setup HTMX event listeners with cleanup tracking
     */
    function setupHtmxListeners() {
        // After HTMX swaps content, restore form state
        const afterSettleHandler = function(event) {
            if (event.detail && event.detail.target && event.detail.target.id === 'wizard-content') {
                console.log('[WizardInit] HTMX content swapped, restoring form state')

                // Cleanup old form listeners
                const oldForm = document.querySelector('form')
                if (oldForm) {
                    formSync.cleanupFormListeners(oldForm)
                }

                // Wait for DOM to be ready
                requestAnimationFrame(() => {
                    const form = document.querySelector('form')
                    if (form) {
                        // Setup listeners for new form
                        formSync.setupFormListeners(form)
                        // Restore state to form
                        formSync.restoreStateToForm(form)
                    }
                })
            }
        }

        // Before HTMX requests, save current form state
        const beforeRequestHandler = function(event) {
            const form = event.detail.elt
            if (form && form.tagName === 'FORM') {
                console.log('[WizardInit] HTMX request starting, saving form state')
                formSync.syncFormToState(form)
            }
        }

        // Add listeners
        document.body.addEventListener('htmx:afterSettle', afterSettleHandler)
        document.body.addEventListener('htmx:beforeRequest', beforeRequestHandler)

        // Track for cleanup
        htmxListeners.push(
            { event: 'htmx:afterSettle', handler: afterSettleHandler },
            { event: 'htmx:beforeRequest', handler: beforeRequestHandler }
        )
    }

    /**
     * Cleanup HTMX listeners
     */
    function cleanupHtmxListeners() {
        htmxListeners.forEach(({ event, handler }) => {
            document.body.removeEventListener(event, handler)
        })
        htmxListeners.length = 0
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWizard)
    } else {
        initializeWizard()
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cleanupHtmxListeners()
        formSync.cleanupAll()
    })

    console.log('[WizardInit] Script loaded')
})()
```

---

## Samenvatting Verbeteringen

### ✅ Toegevoegd

1. **Custom Error Classes**
   - `WizardStateError` base class
   - `InvalidStateError` voor invalid state
   - `StorageError` voor storage failures

2. **Input Sanitization**
   - `sanitizeString()` method
   - XSS prevention
   - Length limiting

3. **Memory Management**
   - Listener tracking per form
   - Cleanup functies
   - Cleanup op page unload

4. **Betere Error Handling**
   - Try-catch met specifieke errors
   - Error recovery
   - Betere logging

5. **Type Checking**
   - Input validation
   - Function parameter checks
   - Return type documentation

---

*Improved Components Version: 1.0*
*Last Updated: 2025-12-01*
