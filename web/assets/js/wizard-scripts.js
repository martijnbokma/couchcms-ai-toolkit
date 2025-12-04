/**
 * Shared wizard navigation functions
 * Used across all wizard steps for consistent behavior
 *
 * CRITICAL: This system ensures ALL selections are preserved throughout the entire wizard,
 * even when navigating multiple steps forward or backward.
 *
 * IMPORTANT: Prevent multiple executions when HTMX swaps content
 */
(function() {
    // Prevent multiple executions - check if already initialized
    if (window.__WIZARD_SCRIPTS_INITIALIZED__) {
        console.log('[Wizard Scripts] Already initialized, skipping re-execution')
        return
    }
    window.__WIZARD_SCRIPTS_INITIALIZED__ = true

    // ============================================================================
    // Constants
    // ============================================================================

    const WIZARD_CONFIG = {
        STORAGE_KEY: 'couchcms-wizard-state',
        DEFAULT_PROJECT_NAME: 'my-project',
        DEFAULT_PROJECT_DESCRIPTION: 'A CouchCMS web application',
        DEFAULT_SETUP_TYPE: 'simple',
        DEBOUNCE_DELAY: 300,
        SYNC_DELAY: 10,
        INITIAL_RESTORE_DELAY: 100
    }

    const INVALID_VALUES = ['', 'undefined', 'null']
    const FRAMEWORK_OPTIONS = ['doctrine', 'directives', 'playbooks', 'enhancements']
    const WIZARD_CONTENT_ID = 'wizard-content'
    const CHECKBOX_FIELDS = ['css', 'js', 'editors']
    const CHECKBOX_CHECK_INTERVAL_MS = 50
    const SYNC_DELAY_MS = 50
    const WAIT_FOR_CHECKBOXES_TIMEOUT_MS = 3000
    const RADIO_SAVE_DELAY_MS = 10
    const GENERATE_FORM_ID = 'generate-form'
    const WIZARD_STATE_INPUT_ID = 'wizard-state-input'
    const SETUP_TYPES = {
        SIMPLE: 'simple',
        EXTENDED: 'extended'
    }
    const FIELD_NAMES = {
        PROJECT_NAME: 'projectName',
        PROJECT_DESCRIPTION: 'projectDescription',
        SETUP_TYPE: 'setupType',
        PRESET: 'preset',
        FRAMEWORK: 'framework',
        CONTEXT_DIR: 'contextDir'
    }

    // ============================================================================
    // Utility Functions
    // ============================================================================

    /**
     * Normalize project value to single string (no duplicates)
     * Handles arrays, comma-separated strings, and ensures single value
     * @param {string|string[]} value - Value to normalize
     * @returns {string|null} Normalized single value or null
     */
    function normalizeProjectValue(value) {
        if (!value) return null

        // Handle arrays - take LAST value (most recent/user input)
        if (Array.isArray(value)) {
            const validValues = value.filter(v => v && !INVALID_VALUES.includes(String(v)))
            if (validValues.length === 0) return null
            return validValues[validValues.length - 1]
        }

        // Handle strings - split on comma and take LAST part
        if (typeof value === 'string') {
            const trimmed = value.trim()
            if (!trimmed) return null

            // If contains commas, split and take LAST part (user's actual input)
            if (trimmed.includes(',')) {
                const parts = trimmed.split(',').map(p => p.trim()).filter(p => p)
                if (parts.length > 0) {
                    return parts[parts.length - 1]
                }
                return null
            }

            return trimmed
        }

        return String(value)
    }

    /**
     * Check if a value is invalid or empty
     * @param {string} value - Value to check
     * @returns {boolean} True if invalid
     */
    function isValidValue(value) {
        return value && !INVALID_VALUES.includes(String(value))
    }

    /**
     * Get visible input element from form
     * @param {HTMLFormElement} form - Form element
     * @param {string} name - Field name
     * @param {string} type - Input type (optional)
     * @returns {HTMLElement|null} Visible input element
     */
    function getVisibleInput(form, name, type = null) {
        if (!form) return null
        const selector = type
            ? `input[name="${name}"][type="${type}"]:not([type="hidden"])`
            : `input[name="${name}"]:not([type="hidden"]), textarea[name="${name}"]`
        return form.querySelector(selector)
    }

    /**
     * Get all hidden input elements from form
     * @param {HTMLFormElement} form - Form element
     * @param {string} name - Field name
     * @returns {HTMLElement[]} Array of hidden input elements
     */
    function getHiddenInputs(form, name) {
        if (!form) return []
        return Array.from(form.querySelectorAll(`input[name="${name}"][type="hidden"]`))
    }

    /**
     * Get checkbox values from form
     * @param {HTMLFormElement} form - Form element
     * @param {string} name - Field name
     * @param {boolean} checkedOnly - Only return checked checkboxes
     * @returns {string[]} Array of checkbox values
     */
    function getCheckboxValues(form, name, checkedOnly = true) {
        if (!form) return []
        const selector = checkedOnly
            ? `input[name="${name}"][type="checkbox"]:checked`
            : `input[name="${name}"][type="checkbox"]`
        return Array.from(form.querySelectorAll(selector))
            .map(input => input.value)
            .filter(v => isValidValue(v))
    }

    // ============================================================================
    // Wizard State Management
    // ============================================================================

    /**
     * Wizard State Management using sessionStorage
     * Single source of truth for all wizard selections
     */
    const WizardState = {
        STORAGE_KEY: WIZARD_CONFIG.STORAGE_KEY,

        /**
         * Save complete wizard state to sessionStorage
         * CRITICAL: Normalize project fields before saving to prevent duplication
         * @param {Object} state - Complete wizard state object
         */
        save(state) {
            try {
                const normalizedState = { ...state }

                // Normalize project fields
                if (normalizedState.projectName) {
                    const normalized = normalizeProjectValue(normalizedState.projectName)
                    normalized ? (normalizedState.projectName = normalized) : delete normalizedState.projectName
                }

                if (normalizedState.projectDescription) {
                    const normalized = normalizeProjectValue(normalizedState.projectDescription)
                    normalized ? (normalizedState.projectDescription = normalized) : delete normalizedState.projectDescription
                }

                // Remove duplicates from editors array
                if (normalizedState.editors && Array.isArray(normalizedState.editors)) {
                    normalizedState.editors = [...new Set(normalizedState.editors)]
                }

                sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(normalizedState))
                console.log('[WizardState.save] Saved normalized state:', normalizedState)
            } catch (error) {
                console.error('[WizardState.save] Error saving state:', error)
            }
        },

        /**
         * Load complete wizard state from sessionStorage
         * @returns {Object} Complete wizard state or empty object
         */
        load() {
            try {
                const stored = sessionStorage.getItem(this.STORAGE_KEY)
                if (stored) {
                    const state = JSON.parse(stored)
                    console.log('[WizardState.load] Loaded state:', state)
                    return state
                }
            } catch (error) {
                console.error('[WizardState.load] Error loading state:', error)
            }
            return {}
        },

        /**
         * Update specific fields in wizard state
         * Merges updates with existing state
         * @param {Object} updates - Fields to update
         */
        update(updates) {
            const current = this.load()
            const updated = { ...current, ...updates }
            this.save(updated)
            return updated
        },

        /**
         * Clear wizard state
         */
        clear() {
            try {
                sessionStorage.removeItem(this.STORAGE_KEY)
                console.log('[WizardState.clear] Cleared state')
            } catch (error) {
                console.error('[WizardState.clear] Error clearing state:', error)
            }
        },

        /**
         * Sync project field from form (visible input takes precedence over hidden fields)
         * @param {HTMLFormElement} form - Form element
         * @param {string} fieldName - Field name
         * @param {string} defaultValue - Default value to ignore
         * @param {Object} syncedState - State object to update
         */
        _syncProjectField(form, fieldName, defaultValue, syncedState) {
            const visibleInput = getVisibleInput(form, fieldName)
            const visibleValue = visibleInput?.value?.trim()

            if (visibleValue && visibleValue !== defaultValue && visibleValue !== visibleInput?.placeholder) {
                syncedState[fieldName] = visibleValue
                return
            }

            // Fallback to hidden fields
            const hiddenInputs = getHiddenInputs(form, fieldName)
            const hiddenValue = hiddenInputs
                .map(input => input.value)
                .find(v => isValidValue(v) && v !== defaultValue)

            if (hiddenValue) {
                syncedState[fieldName] = normalizeProjectValue(hiddenValue)
            }
        },

        /**
         * Determine if checkbox state should be updated
         * Returns true if newSet has more or different values than currentSet
         * Returns false if newSet is a subset of currentSet (preserve state)
         * @param {Set} currentSet - Current state values
         * @param {Set} newSet - New values from form
         * @returns {boolean} True if should update, false if should preserve
         * @private
         */
        _shouldUpdateCheckboxState(currentSet, newSet) {
            // Check if newSet is a subset of currentSet (restore in progress)
            const isSubset = [...newSet].every(v => currentSet.has(v))
            const hasMoreValues = newSet.size > currentSet.size
            const hasDifferentValues = [...newSet].some(v => !currentSet.has(v)) && !isSubset

            // Update if newSet has more values or different values
            // Preserve if newSet is a subset (restore in progress)
            return hasMoreValues || hasDifferentValues
        },

        /**
         * Sync checkbox selections from form
         * CRITICAL: Only update state if we have visible checkboxes OR if hidden fields contain values
         * Do NOT overwrite existing state with fewer values when navigating back
         * @param {HTMLFormElement} form - Form element
         * @param {string} fieldName - Field name
         * @param {Object} syncedState - State object to update
         */
        _syncCheckboxField(form, fieldName, syncedState) {
            const visibleValues = getCheckboxValues(form, fieldName, true)
            const currentState = syncedState[fieldName] || []

            if (visibleValues.length > 0) {
                // Always use visible checkboxes if available (most accurate)
                const newValues = [...new Set(visibleValues)]

                // CRITICAL: If current state has more values than visible checkboxes,
                // it means restore hasn't completed yet OR user had more selections - preserve current state
                // Only update if newValues has MORE or DIFFERENT values than currentState
                const currentSet = new Set(currentState)
                const newSet = new Set(newValues)

                // Check if newValues is a subset of currentState (restore in progress)
                const isSubset = [...newSet].every(v => currentSet.has(v))
                const hasMoreValues = newSet.size > currentSet.size
                const hasDifferentValues = [...newSet].some(v => !currentSet.has(v)) && !isSubset

                if (currentState.length > 0 && isSubset && !hasMoreValues && !hasDifferentValues) {
                    console.log(`[WizardState._syncCheckboxField] Preserving ${fieldName} state (restore in progress or more selections):`, currentState)
                    // Keep current state - restore will update it later OR user had more selections
                    return
                }

                syncedState[fieldName] = newValues
                console.log(`[WizardState._syncCheckboxField] Synced ${fieldName} from visible checkboxes:`, syncedState[fieldName])
                return
            }

            // Fallback to hidden fields ONLY if they exist and have values
            const hiddenInputs = getHiddenInputs(form, fieldName)
            const hiddenValues = hiddenInputs
                .map(input => input.value)
                .filter(v => isValidValue(v))

            if (hiddenValues.length > 0) {
                const newValues = [...new Set(hiddenValues)]
                const currentSet = new Set(currentState)
                const newSet = new Set(newValues)

                // Preserve state if restore in progress or user had more selections
                if (currentState.length > 0 && !this._shouldUpdateCheckboxState(currentSet, newSet)) {
                    console.log(`[WizardState._syncCheckboxField] Preserving ${fieldName} state (has more values):`, currentState)
                    return
                }

                // Only update if values changed
                const valuesChanged = JSON.stringify(newValues.sort()) !== JSON.stringify(currentState.sort())
                if (valuesChanged) {
                    syncedState[fieldName] = newValues
                    console.log(`[WizardState._syncCheckboxField] Synced ${fieldName} from hidden fields:`, syncedState[fieldName])
                } else {
                    console.log(`[WizardState._syncCheckboxField] Skipped sync for ${fieldName} (no change)`)
                }
            } else {
                // No hidden fields found - preserve existing state if it exists
                const hasVisibleCheckboxes = form.querySelectorAll(`input[name="${fieldName}"]:not([type="hidden"])`).length > 0
                if (!hasVisibleCheckboxes) {
                    // Step doesn't have this field (e.g., editors on frontend step, css/js on presets step)
                    // CRITICAL: Always preserve existing state for fields that don't exist on this step
                    if (syncedState[fieldName] && syncedState[fieldName].length > 0) {
                        console.log(`[WizardState._syncCheckboxField] Preserving existing ${fieldName} state (field not on this step):`, syncedState[fieldName])
                        // State is already preserved in syncedState, no need to update
                    }
                } else {
                    // Field exists on this step but no hidden fields and no visible values
                    // This means the field was cleared - but we should preserve state if it exists
                    if (currentState.length > 0) {
                        console.log(`[WizardState._syncCheckboxField] Preserving ${fieldName} state (no form values but state exists):`, currentState)
                        // Keep current state - don't clear it
                    }
                }
            }
        },

        /**
         * Sync advanced framework options
         * @param {HTMLFormElement} form - Form element
         * @param {Object} syncedState - State object to update
         */
        _syncFrameworkOptions(form, syncedState) {
            const frameworkHidden = form.querySelector('input[name="framework"][type="hidden"]')
            if (frameworkHidden?.value !== 'true') {
                return
            }

            syncedState.framework = 'true'
            FRAMEWORK_OPTIONS.forEach(option => {
                const input = form.querySelector(`input[name="framework_${option}"][type="hidden"]`)
                if (input?.value === 'true') {
                    syncedState[`framework_${option}`] = 'true'
                }
            })
        },

        /**
         * Sync state from hidden fields in current form
         * CRITICAL: This ensures state is always in sync with what the server rendered
         * This is called after HTMX swaps content to sync state from server-rendered hidden fields
         */
        syncFromHiddenFields() {
            const form = document.querySelector('form')
            if (!form) {
                console.log('[WizardState.syncFromHiddenFields] No form found')
                return
            }

            const existingState = this.load()
            const syncedState = { ...existingState }

            // Sync project fields
            this._syncProjectField(form, FIELD_NAMES.PROJECT_NAME, WIZARD_CONFIG.DEFAULT_PROJECT_NAME, syncedState)
            this._syncProjectField(form, FIELD_NAMES.PROJECT_DESCRIPTION, WIZARD_CONFIG.DEFAULT_PROJECT_DESCRIPTION, syncedState)

            // Sync setup type
            const setupTypeInputs = getHiddenInputs(form, FIELD_NAMES.SETUP_TYPE)
            if (setupTypeInputs.length > 0) {
                const setupTypeValue = setupTypeInputs
                    .map(input => input.value)
                    .find(v => isValidValue(v))
                if (setupTypeValue) {
                    syncedState.setupType = normalizeProjectValue(setupTypeValue)
                }
            }

            // Sync checkbox fields
            CHECKBOX_FIELDS.forEach(fieldName => {
                this._syncCheckboxField(form, fieldName, syncedState)
            })

            // Sync advanced options
            this._syncFrameworkOptions(form, syncedState)

            // Sync context directory
            const contextDirInput = form.querySelector(`input[name="${FIELD_NAMES.CONTEXT_DIR}"][type="hidden"]`)
            if (contextDirInput?.value) {
                syncedState[FIELD_NAMES.CONTEXT_DIR] = contextDirInput.value
            }

            // Sync preset (check radio button first, then hidden field)
            const presetRadio = form.querySelector(`input[name="${FIELD_NAMES.PRESET}"][type="radio"]:checked`)
            if (presetRadio?.value !== undefined) {
                syncedState[FIELD_NAMES.PRESET] = presetRadio.value.trim() || ''
            } else {
                const presetInput = form.querySelector(`input[name="${FIELD_NAMES.PRESET}"][type="hidden"]`)
                if (presetInput?.value !== undefined) {
                    syncedState[FIELD_NAMES.PRESET] = presetInput.value.trim() || ''
                }
            }

            // Only update if we found new data
            if (JSON.stringify(syncedState) !== JSON.stringify(existingState)) {
                this.save(syncedState)
                console.log('[WizardState.syncFromHiddenFields] State synced and saved:', syncedState)
            } else {
                console.log('[WizardState.syncFromHiddenFields] No changes detected, state preserved')
            }
        },

        /**
         * Collect project field from form (visible input preferred, fallback to hidden)
         * @param {HTMLFormElement} form - Form element
         * @param {string} fieldName - Field name
         * @param {string} defaultValue - Default value to ignore
         * @param {Object} formData - Form data object to update
         */
        _collectProjectField(form, fieldName, defaultValue, formData) {
            const visibleInput = getVisibleInput(form, fieldName)
            const visibleValue = visibleInput?.value?.trim()

            if (visibleValue && visibleValue !== defaultValue) {
                const normalized = normalizeProjectValue(visibleValue)
                if (normalized) {
                    formData[fieldName] = normalized
                    console.log(`[WizardState._collectProjectField] Set ${fieldName} from visible input:`, normalized)
                    return
                }
            }

            // Fallback to hidden fields
            if (!visibleInput || !visibleValue || visibleValue === defaultValue) {
                const hiddenInputs = getHiddenInputs(form, fieldName)
                const hiddenValues = hiddenInputs
                    .map(input => input.value)
                    .filter(v => isValidValue(v) && v !== defaultValue)

                if (hiddenValues.length > 0 && !formData[fieldName]) {
                    const normalized = normalizeProjectValue(hiddenValues)
                    if (normalized) {
                        formData[fieldName] = normalized
                        console.log(`[WizardState._collectProjectField] Set ${fieldName} from hidden fields:`, normalized)
                    }
                }
            }
        },

        /**
         * Collect checkbox field from form (visible checkboxes preferred, fallback to hidden)
         * CRITICAL: Only update state if we have checked values - never overwrite with empty array
         * @param {HTMLFormElement} form - Form element
         * @param {string} fieldName - Field name
         * @param {Object} formData - Form data object to update
         */
        _collectCheckboxField(form, fieldName, formData) {
            const visibleFields = form.querySelectorAll(`input[name="${fieldName}"]:not([type="hidden"])`)
            if (visibleFields.length > 0) {
                // We have visible checkboxes - collect their checked state
                const checkedValues = getCheckboxValues(form, fieldName, true)
                if (checkedValues.length > 0) {
                    // Only update if we have checked values
                    formData[fieldName] = [...new Set(checkedValues)]
                    console.log(`[WizardState._collectCheckboxField] Updated ${fieldName} from visible checkboxes:`, formData[fieldName])
                } else {
                    // No checkboxes checked - only update if current state is empty or doesn't exist
                    // This prevents overwriting existing state when navigating back before restore completes
                    if (!formData[fieldName] || formData[fieldName].length === 0) {
                        formData[fieldName] = []
                        console.log(`[WizardState._collectCheckboxField] Cleared ${fieldName} (no checkboxes checked)`)
                    } else {
                        console.log(`[WizardState._collectCheckboxField] Preserved existing ${fieldName} state:`, formData[fieldName])
                    }
                }
            } else {
                // No visible fields - preserve from hidden fields or existing state
                const hiddenInputs = getHiddenInputs(form, fieldName)
                const hiddenValues = hiddenInputs
                    .map(input => input.value)
                    .filter(v => isValidValue(v))

                if (hiddenValues.length > 0) {
                    // Update with hidden values if they exist
                    formData[fieldName] = [...new Set(hiddenValues)]
                    console.log(`[WizardState._collectCheckboxField] Preserved ${fieldName} from hidden fields:`, formData[fieldName])
                } else if (!formData[fieldName]) {
                    // Only set empty array if state doesn't exist
                    formData[fieldName] = []
                    console.log(`[WizardState._collectCheckboxField] Initialized ${fieldName} as empty array`)
                } else {
                    // Preserve existing state
                    console.log(`[WizardState._collectCheckboxField] Preserved existing ${fieldName} state:`, formData[fieldName])
                }
            }
        },

        /**
         * Collect radio button field from form (visible radio preferred, fallback to hidden)
         * @param {HTMLFormElement} form - Form element
         * @param {string} fieldName - Field name
         * @param {Object} formData - Form data object to update
         */
        _collectRadioField(form, fieldName, formData) {
            // Check for visible radio buttons first
            const visibleRadio = form.querySelector(`input[name="${fieldName}"][type="radio"]:checked`)
            if (visibleRadio && visibleRadio.value) {
                const value = visibleRadio.value.trim()
                if (isValidValue(value)) {
                    formData[fieldName] = value
                    console.log(`[WizardState._collectRadioField] Updated ${fieldName} from visible radio:`, value)
                    return
                }
            }

            // Fallback to hidden field
            const hiddenInput = form.querySelector(`input[name="${fieldName}"][type="hidden"]`)
            if (hiddenInput?.value && isValidValue(hiddenInput.value)) {
                formData[fieldName] = hiddenInput.value.trim()
                console.log(`[WizardState._collectRadioField] Preserved ${fieldName} from hidden field:`, formData[fieldName])
            } else if (!formData[fieldName]) {
                // If no value found and state doesn't exist, set empty string (for presets, empty means "skip")
                formData[fieldName] = ''
                console.log(`[WizardState._collectRadioField] Initialized ${fieldName} as empty string`)
            } else {
                // Preserve existing state
                console.log(`[WizardState._collectRadioField] Preserved existing ${fieldName} state:`, formData[fieldName])
            }
        },

        /**
         * Collect advanced framework options
         * @param {HTMLFormElement} form - Form element
         * @param {Object} formData - Form data object to update
         */
        _collectFrameworkOptions(form, formData) {
            const frameworkCheckbox = form.querySelector(`input[name="${FIELD_NAMES.FRAMEWORK}"]:not([type="hidden"])`)
            if (!frameworkCheckbox) {
                return
            }

            if (frameworkCheckbox.checked) {
                formData[FIELD_NAMES.FRAMEWORK] = 'true'
                FRAMEWORK_OPTIONS.forEach(option => {
                    const checkbox = form.querySelector(`input[name="framework_${option}"]:not([type="hidden"])`)
                    formData[`framework_${option}`] = checkbox?.checked ? 'true' : undefined
                })
            } else {
                // Clear framework options if unchecked
                delete formData[FIELD_NAMES.FRAMEWORK]
                FRAMEWORK_OPTIONS.forEach(option => {
                    delete formData[`framework_${option}`]
                })
            }
        },

        /**
         * Collect all form data from current form
         * CRITICAL: Always preserves existing state - only updates fields that exist in current form
         * This ensures selections are never lost when navigating multiple steps
         * @returns {Object} Complete form data object with all previous selections preserved
         */
        collectFormData() {
            // Always start with existing state to preserve all previous selections
            const existingState = this.load()
            const formData = { ...existingState }

            const form = document.querySelector('form')
            if (!form) {
                return formData
            }

            // Collect project fields
            this._collectProjectField(form, FIELD_NAMES.PROJECT_NAME, WIZARD_CONFIG.DEFAULT_PROJECT_NAME, formData)
            this._collectProjectField(form, FIELD_NAMES.PROJECT_DESCRIPTION, WIZARD_CONFIG.DEFAULT_PROJECT_DESCRIPTION, formData)

            // Collect setup type
            const setupTypeInput = getVisibleInput(form, FIELD_NAMES.SETUP_TYPE)
            if (setupTypeInput?.value) {
                formData[FIELD_NAMES.SETUP_TYPE] = setupTypeInput.value
            } else {
                const hiddenSetupType = form.querySelector(`input[name="${FIELD_NAMES.SETUP_TYPE}"][type="hidden"]`)
                if (hiddenSetupType?.value && !formData[FIELD_NAMES.SETUP_TYPE]) {
                    formData[FIELD_NAMES.SETUP_TYPE] = hiddenSetupType.value
                }
            }

            // Collect checkbox fields
            CHECKBOX_FIELDS.forEach(fieldName => {
                this._collectCheckboxField(form, fieldName, formData)
            })

            // Collect advanced options
            this._collectFrameworkOptions(form, formData)

            // Collect preset (radio button)
            this._collectRadioField(form, FIELD_NAMES.PRESET, formData)

            // Collect context directory
            const contextDirInput = getVisibleInput(form, FIELD_NAMES.CONTEXT_DIR)
            if (contextDirInput?.value) {
                formData[FIELD_NAMES.CONTEXT_DIR] = contextDirInput.value
            } else {
                // Fallback to hidden field
                const hiddenContextDir = form.querySelector(`input[name="${FIELD_NAMES.CONTEXT_DIR}"][type="hidden"]`)
                if (hiddenContextDir?.value && !formData[FIELD_NAMES.CONTEXT_DIR]) {
                    formData[FIELD_NAMES.CONTEXT_DIR] = hiddenContextDir.value
                }
            }

            // Ensure setupType is always set
            if (!formData[FIELD_NAMES.SETUP_TYPE]) {
                formData[FIELD_NAMES.SETUP_TYPE] = WIZARD_CONFIG.DEFAULT_SETUP_TYPE
            }

            console.log('[WizardState.collectFormData] Collected form data (preserving existing state):', formData)
            return formData
        },

        /**
         * Convert state object to URLSearchParams
         * CRITICAL: Always merges with existing state to ensure nothing is lost
         * @param {Object} state - State object (optional, will load from storage if not provided)
         * @returns {URLSearchParams} URL parameters with all selections
         */
        toURLParams(state) {
            const params = new URLSearchParams()

            // Always merge with existing state to ensure nothing is lost
            const existingState = this.load()
            const stateToUse = { ...existingState, ...(state || {}) }

            console.log('[WizardState.toURLParams] Merged state:', stateToUse)

            // Always include setup type
            params.append(FIELD_NAMES.SETUP_TYPE, stateToUse[FIELD_NAMES.SETUP_TYPE] || WIZARD_CONFIG.DEFAULT_SETUP_TYPE)

            // Project info
            if (stateToUse[FIELD_NAMES.PROJECT_NAME]) {
                params.append(FIELD_NAMES.PROJECT_NAME, stateToUse[FIELD_NAMES.PROJECT_NAME])
            }
            if (stateToUse[FIELD_NAMES.PROJECT_DESCRIPTION]) {
                params.append(FIELD_NAMES.PROJECT_DESCRIPTION, stateToUse[FIELD_NAMES.PROJECT_DESCRIPTION])
            }

            // Frontend selections - always include if they exist in state
            if (stateToUse.css && Array.isArray(stateToUse.css) && stateToUse.css.length > 0) {
                stateToUse.css.forEach(c => params.append('css', c))
            }
            if (stateToUse.js && Array.isArray(stateToUse.js) && stateToUse.js.length > 0) {
                stateToUse.js.forEach(j => params.append('js', j))
            }

            // Editor selections - remove duplicates before adding to URL params
            if (stateToUse.editors && Array.isArray(stateToUse.editors) && stateToUse.editors.length > 0) {
                const uniqueEditors = [...new Set(stateToUse.editors)]
                uniqueEditors.forEach(ed => params.append('editors', ed))
            }

            // Advanced options
            if (stateToUse[FIELD_NAMES.FRAMEWORK] === 'true') {
                params.append(FIELD_NAMES.FRAMEWORK, 'true')
                FRAMEWORK_OPTIONS.forEach(option => {
                    if (stateToUse[`framework_${option}`] === 'true') {
                        params.append(`framework_${option}`, 'true')
                    }
                })
            }
            if (stateToUse[FIELD_NAMES.CONTEXT_DIR]) {
                params.append(FIELD_NAMES.CONTEXT_DIR, stateToUse[FIELD_NAMES.CONTEXT_DIR])
            }

            // Preset selection
            if (stateToUse[FIELD_NAMES.PRESET] && stateToUse[FIELD_NAMES.PRESET] !== '') {
                params.append(FIELD_NAMES.PRESET, stateToUse[FIELD_NAMES.PRESET])
            }

            console.log('[WizardState.toURLParams] Final URL params:', params.toString())
            return params
        }
    }

    // ============================================================================
    // Navigation Functions
    // ============================================================================

    /**
     * Navigate to a specific step in the wizard
     * Collects current form data to preserve state and saves to sessionStorage
     * CRITICAL: Always preserves existing state, even when navigating from steps without forms
     */
    function navigateToStep(stepNum, route, setupType) {
        console.log('[navigateToStep] Navigating to step', stepNum, 'route:', route, 'setupType:', setupType)

        // Prevent Simple setup from accessing presets step
        const effectiveSetupType = setupType || WizardState.load()[FIELD_NAMES.SETUP_TYPE] || WIZARD_CONFIG.DEFAULT_SETUP_TYPE
        if (effectiveSetupType === SETUP_TYPES.SIMPLE && route === 'presets') {
            console.warn('[navigateToStep] Simple setup cannot access presets, redirecting to editors')
            route = 'editors'
            stepNum = 2
        }

        // Save current form state before navigating
        const currentFormData = WizardState.collectFormData()
        WizardState.update(currentFormData)

        // Load updated state and override setupType if provided
        const stateToSend = WizardState.load()
        if (setupType) {
            stateToSend[FIELD_NAMES.SETUP_TYPE] = setupType
            WizardState.save(stateToSend)
        }

        // Navigate with state as URL parameters
        const params = WizardState.toURLParams(stateToSend)
        const url = `/api/setup/step/${route}?${params.toString()}`
        console.log('[navigateToStep] HTMX request URL:', url)
        console.log('[navigateToStep] State being sent:', stateToSend)

        htmx.ajax('GET', url, {
            target: `#${WIZARD_CONTENT_ID}`,
            swap: 'innerHTML',
            headers: { 'HX-Request': 'true' }
        }).catch(error => {
            console.error('[navigateToStep] HTMX navigation error:', error)
            alert(`Error navigating to step ${stepNum}. Please try again.`)
        })
    }

    /**
     * Determine back route based on current step and setup type
     * @param {string} setupType - Setup type ('simple' or 'extended')
     * @returns {string} Back route URL
     */
    function determineBackRoute(setupType) {
        const form = document.querySelector('form')
        const formAction = form?.getAttribute('hx-post') || ''
        const currentUrl = window.location.pathname + window.location.search
        const isReviewStep = formAction.includes('/setup/generate') ||
            currentUrl.includes('/step/review') ||
            document.querySelector('form[hx-post*="/setup/generate"]')

        const routeMap = {
            review: setupType === SETUP_TYPES.SIMPLE ? '/api/setup/step/editors' : '/api/setup/step/advanced',
            advanced: setupType === SETUP_TYPES.SIMPLE ? '/api/setup/step/project' : '/api/setup/step/editors',
            editors: setupType === SETUP_TYPES.SIMPLE ? '/api/setup/step/project' : '/api/setup/step/frontend',
            frontend: '/api/setup/step/presets',
            complexity: '/api/setup/step/project',
            default: '/api/setup/step/project'
        }

        if (isReviewStep) return routeMap.review
        if (formAction.includes('/step/advanced')) return routeMap.advanced
        if (formAction.includes('/step/editors')) return routeMap.editors
        if (formAction.includes('/step/frontend')) return routeMap.frontend
        if (formAction.includes('/step/complexity')) return routeMap.complexity
        return routeMap.default
    }

    /**
     * Universal back button handler
     * Uses HTMX to navigate back with form data preservation
     * This is the centralized implementation - step-specific goBack() functions should call this
     */
    function goBack(backRoute = null) {
        // Save current form state before navigating back
        const currentFormData = WizardState.collectFormData()
        WizardState.update(currentFormData)

        // Determine route if not provided
        if (!backRoute) {
            const setupType = currentFormData.setupType || WIZARD_CONFIG.DEFAULT_SETUP_TYPE
            backRoute = determineBackRoute(setupType)
        }

        // Navigate back with state
        const params = WizardState.toURLParams(currentFormData)
        htmx.ajax('GET', `${backRoute}?${params.toString()}`, {
            target: '#wizard-content',
            swap: 'innerHTML'
        })
    }

    /**
     * Restore project field value if safe to do so
     * @param {HTMLElement} input - Input element
     * @param {string} stateValue - Value from state
     * @param {string} defaultValue - Default value to check against
     */
    function restoreProjectField(input, stateValue, defaultValue) {
        if (!input || !stateValue) return

        const normalizedValue = normalizeProjectValue(stateValue)
        if (!normalizedValue) return

        const currentValue = input.value.trim()
        const placeholder = input.placeholder || defaultValue
        const isEmpty = currentValue === ''
        const isDefault = currentValue === defaultValue || currentValue === placeholder
        const hasFocus = document.activeElement === input

        // Only restore if safe (empty, default, or different value without focus)
        if (isEmpty || (isDefault && !hasFocus) || (currentValue !== normalizedValue && !hasFocus)) {
            input.value = normalizedValue
        }
    }

    /**
     * Restore checkbox selections
     * @param {HTMLFormElement} form - Form element
     * @param {string} fieldName - Field name
     * @param {string[]} stateValues - Values from state
     */
    function restoreCheckboxField(form, fieldName, stateValues) {
        if (!stateValues || !Array.isArray(stateValues) || stateValues.length === 0) {
            console.log(`[restoreCheckboxField] No values to restore for ${fieldName}`)
            return true // Nothing to restore, consider it successful
        }

        const uniqueValues = [...new Set(stateValues.filter(v => isValidValue(v)))]
        console.log(`[restoreCheckboxField] Restoring ${fieldName} with values:`, uniqueValues)

        // Use explicit checkbox selector
        const allCheckboxes = Array.from(form.querySelectorAll(`input[name="${fieldName}"][type="checkbox"]`))
        const availableValues = allCheckboxes.map(cb => cb.value)
        console.log(`[restoreCheckboxField] Available checkboxes for ${fieldName}:`, availableValues)

        // If no checkboxes found, they might not be in DOM yet
        if (allCheckboxes.length === 0) {
            console.warn(`[restoreCheckboxField] No checkboxes found for ${fieldName}, they may not be in DOM yet`)
            return false
        }

        let restoredCount = 0
        uniqueValues.forEach(value => {
            // Try multiple selectors to find the checkbox
            const selectors = [
                `input[name="${fieldName}"][value="${value}"]:not([type="hidden"])`,
                `input[name="${fieldName}"][value="${value.toLowerCase()}"]:not([type="hidden"])`,
                `input[name="${fieldName}"][value="${value.toUpperCase()}"]:not([type="hidden"])`
            ]

            let checkbox = null
            for (const selector of selectors) {
                checkbox = form.querySelector(selector)
                if (checkbox) {
                    console.log(`[restoreCheckboxField] Found checkbox using selector: ${selector}`)
                    break
                }
            }

            // Fallback: Try to find by iterating through all checkboxes
            if (!checkbox) {
                console.log(`[restoreCheckboxField] Selector failed, trying fallback for ${fieldName}="${value}"`)
                allCheckboxes.forEach(cb => {
                    if (cb.value === value || cb.value.toLowerCase() === value.toLowerCase()) {
                        checkbox = cb
                        console.log(`[restoreCheckboxField] Found checkbox via fallback: ${fieldName}="${value}"`)
                    }
                })
            }

            if (checkbox) {
                checkbox.checked = true
                restoredCount++
                console.log(`[restoreCheckboxField] ✓ Restored ${fieldName}="${value}"`)
            } else {
                console.warn(`[restoreCheckboxField] ✗ Checkbox not found for ${fieldName}="${value}" (available: ${availableValues.join(', ')})`)
            }
        })

        console.log(`[restoreCheckboxField] Restored ${restoredCount}/${uniqueValues.length} checkboxes for ${fieldName}`)
        return restoredCount === uniqueValues.length
    }

    /**
     * Restore radio button selection
     * @param {HTMLFormElement} form - Form element
     * @param {string} fieldName - Field name
     * @param {string} stateValue - Value from state
     */
    function restoreRadioField(form, fieldName, stateValue) {
        if (!stateValue && stateValue !== '') {
            console.log(`[restoreRadioField] No value to restore for ${fieldName}`)
            return
        }

        const normalizedValue = String(stateValue).trim()
        console.log(`[restoreRadioField] Restoring ${fieldName} with value:`, normalizedValue)

        // Find the radio button with matching value
        const radioButtons = Array.from(form.querySelectorAll(`input[name="${fieldName}"][type="radio"]`))
        if (radioButtons.length === 0) {
            console.log(`[restoreRadioField] No radio buttons found for ${fieldName}`)
            return
        }

        // Find matching radio button (exact match or empty string for "skip")
        const matchingRadio = radioButtons.find(radio => {
            const radioValue = radio.value.trim()
            return radioValue === normalizedValue || (normalizedValue === '' && radioValue === '')
        })

        if (matchingRadio) {
            matchingRadio.checked = true
            console.log(`[restoreRadioField] ✓ Restored ${fieldName}="${normalizedValue}"`)
        } else {
            console.warn(`[restoreRadioField] ✗ Radio button not found for ${fieldName}="${normalizedValue}" (available: ${radioButtons.map(r => r.value).join(', ')})`)
        }
    }

    /**
     * Restore advanced framework options
     * @param {HTMLFormElement} form - Form element
     * @param {Object} state - State object
     */
    function restoreFrameworkOptions(form, state) {
        if (state.framework !== 'true') return

        const frameworkCheckbox = form.querySelector(`input[name="${FIELD_NAMES.FRAMEWORK}"]:not([type="hidden"])`)
        if (frameworkCheckbox) {
            frameworkCheckbox.checked = true
            if (typeof updateFrameworkVisibility === 'function') {
                updateFrameworkVisibility()
            }
        }

        FRAMEWORK_OPTIONS.forEach(option => {
            if (state[`framework_${option}`] === 'true') {
                const checkbox = form.querySelector(`input[name="framework_${option}"]:not([type="hidden"])`)
                if (checkbox) checkbox.checked = true
            }
        })
    }

    /**
     * Restore form selections from saved state
     * Called after HTMX swaps content to restore checkbox states
     */
    function restoreFormSelections() {
        const state = WizardState.load()
        if (!state || Object.keys(state).length === 0) {
            console.log('[restoreFormSelections] No state to restore')
            return
        }

        const form = document.querySelector('form')
        if (!form) {
            console.log('[restoreFormSelections] No form found')
            return
        }

        console.log('[restoreFormSelections] Restoring state:', state)

        // Restore project fields
        const projectNameInput = getVisibleInput(form, FIELD_NAMES.PROJECT_NAME)
        if (projectNameInput && state[FIELD_NAMES.PROJECT_NAME]) {
            restoreProjectField(projectNameInput, state[FIELD_NAMES.PROJECT_NAME], WIZARD_CONFIG.DEFAULT_PROJECT_NAME)
        }

        const projectDescriptionInput = getVisibleInput(form, FIELD_NAMES.PROJECT_DESCRIPTION)
        if (projectDescriptionInput && state[FIELD_NAMES.PROJECT_DESCRIPTION]) {
            restoreProjectField(projectDescriptionInput, state[FIELD_NAMES.PROJECT_DESCRIPTION], WIZARD_CONFIG.DEFAULT_PROJECT_DESCRIPTION)
        }

        // Restore checkbox fields - only restore fields that exist on this step
        const checkboxFieldsOnStep = CHECKBOX_FIELDS.filter(fieldName => {
            const checkboxes = form.querySelectorAll(`input[name="${fieldName}"][type="checkbox"]`)
            return checkboxes.length > 0
        })

        if (checkboxFieldsOnStep.length > 0) {
            checkboxFieldsOnStep.forEach(fieldName => {
                if (fieldName === 'editors') {
                    // Editors need special handling for deduplication
                    if (state.editors && Array.isArray(state.editors) && state.editors.length > 0) {
                        const uniqueEditors = [...new Set(state.editors.filter(e => isValidValue(e)))]
                        console.log('[restoreFormSelections] Restoring editors:', uniqueEditors)
                        restoreCheckboxField(form, fieldName, uniqueEditors)
                    }
                } else {
                    if (state[fieldName] && Array.isArray(state[fieldName]) && state[fieldName].length > 0) {
                        restoreCheckboxField(form, fieldName, state[fieldName])
                    }
                }
            })
        } else {
            // No checkbox fields on this step - that's normal (e.g., project step)
            console.log('[restoreFormSelections] No checkbox fields on this step (normal)')
        }

        // Restore preset (radio button)
        if (state[FIELD_NAMES.PRESET] !== undefined) {
            restoreRadioField(form, FIELD_NAMES.PRESET, state[FIELD_NAMES.PRESET])
        }

        // Restore advanced options
        restoreFrameworkOptions(form, state)

        console.log('[restoreFormSelections] Form selections restored')
    }

    // ============================================================================
    // Event Handlers
    // ============================================================================

    /**
     * HTMX error handling
     */
    document.body.addEventListener('htmx:responseError', function(event) {
        console.error('HTMX Error:', event.detail)
        alert('An error occurred while submitting the form. Please try again.')
    })

    document.body.addEventListener('htmx:sendError', function(event) {
        console.error('HTMX Send Error:', event.detail)
        alert('An error occurred while submitting the form. Please check your internet connection.')
    })

    /**
     * Save form state before form submissions (both native and HTMX)
     * CRITICAL: This ensures state is always saved before any form submission
     */
    function saveFormStateBeforeSubmit(form) {
        if (!form || form.tagName !== 'FORM') return

        // Always collect and save current form state
        const formData = WizardState.collectFormData()
        WizardState.update(formData)
        console.log('[saveFormStateBeforeSubmit] Saved state before form submission:', formData)

        // If this is the generate form, ensure wizard state is included
        if (form.id === 'generate-form') {
            const stateInput = document.getElementById('wizard-state-input')
            if (stateInput) {
                try {
                    const completeState = WizardState.load()
                    stateInput.value = JSON.stringify(completeState)
                    console.log('[saveFormStateBeforeSubmit] Wizard state included in generate form:', completeState)
                } catch (error) {
                    console.error('[saveFormStateBeforeSubmit] Error serializing wizard state:', error)
                }
            }
        }
    }

    // Listen for native form submit events (before HTMX intercepts)
    document.body.addEventListener('submit', function(event) {
        const form = event.target
        if (form?.tagName === 'FORM') {
            saveFormStateBeforeSubmit(form)
        }
    }, true) // Use capture phase to catch before HTMX

    // Listen for HTMX beforeRequest events
    document.body.addEventListener('htmx:beforeRequest', function(event) {
        console.log('[htmx:beforeRequest] Event triggered')
        const form = event.detail.elt
        saveFormStateBeforeSubmit(form)
    })

    /**
     * Wait for checkboxes to appear in DOM using polling
     * CRITICAL: Only waits for checkboxes that exist on the current step
     * If a field doesn't have checkboxes on this step, it's skipped
     * @param {HTMLFormElement} form - Form element
     * @param {string[]} fieldNames - Array of field names to wait for
     * @param {number} timeout - Maximum time to wait in ms
     * @returns {Promise<{found: boolean, availableFields: string[]}>} Result with found status and available fields
     */
    function waitForCheckboxes(form, fieldNames, timeout = WAIT_FOR_CHECKBOXES_TIMEOUT_MS) {
        return new Promise((resolve) => {
            const startTime = Date.now()
            const checkInterval = CHECKBOX_CHECK_INTERVAL_MS

            const check = () => {
                const foundCounts = {}
                const availableFields = []
                let allFound = true

                fieldNames.forEach(fieldName => {
                    const checkboxes = form.querySelectorAll(`input[name="${fieldName}"][type="checkbox"]`)
                    foundCounts[fieldName] = checkboxes.length

                    // If checkboxes exist, this field is available on this step
                    if (checkboxes.length > 0) {
                        availableFields.push(fieldName)
                    }
                    // If no checkboxes found, check if field exists on this step at all
                    else {
                        // Look for any input with this name (including hidden or other types)
                        const anyInput = form.querySelector(`input[name="${fieldName}"]`)
                        if (anyInput && anyInput.type !== 'checkbox') {
                            // Field exists but is not a checkbox (e.g., hidden field) - skip waiting
                            // This field doesn't need checkboxes on this step
                        }
                        // If no input found at all, field doesn't exist on this step - skip it
                        // This is fine, we'll only restore fields that exist
                    }
                })

                // Success if we found checkboxes for fields that need restoring
                // Don't require ALL fields to have checkboxes (some fields are step-specific)
                // If we found at least one field with checkboxes, we're ready
                if (availableFields.length > 0) {
                    allFound = true
                }

                // Success if all fields that exist on this step have checkboxes
                if (allFound && availableFields.length > 0) {
                    console.log(`[waitForCheckboxes] All checkboxes found for available fields:`, foundCounts)
                    resolve({ found: true, availableFields })
                    return
                }

                const elapsed = Date.now() - startTime
                if (elapsed >= timeout) {
                    console.log(`[waitForCheckboxes] Timeout after ${timeout}ms. Found:`, foundCounts, `Available fields:`, availableFields)
                    resolve({ found: availableFields.length > 0, availableFields })
                    return
                }

                setTimeout(check, checkInterval)
            }

            check()
        })
    }

    /**
     * Sync state and restore selections after HTMX content swap
     * Uses MutationObserver and Promise-based waiting for better reliability
     */
    let syncInProgress = false

    async function syncAndRestoreState() {
        if (syncInProgress) {
            console.log('[syncAndRestoreState] Already in progress, skipping')
            return
        }
        syncInProgress = true

        try {
            const form = document.querySelector('form')
            if (!form) {
                console.log('[syncAndRestoreState] No form found')
                syncInProgress = false
                return
            }

            // CRITICAL: Load state BEFORE syncing to preserve existing selections
            const state = WizardState.load()

            // CRITICAL: Determine which checkbox fields we have state for
            // These are the fields we might need to restore
            const checkboxFieldsWithState = CHECKBOX_FIELDS.filter(fieldName => {
                return state[fieldName] && Array.isArray(state[fieldName]) && state[fieldName].length > 0
            })

            // If no state to restore, just sync from hidden fields and we're done
            if (checkboxFieldsWithState.length === 0) {
                const hasHiddenFields = CHECKBOX_FIELDS.some(fieldName => {
                    return form.querySelector(`input[name="${fieldName}"][type="hidden"]`)
                })

                if (hasHiddenFields) {
                    WizardState.syncFromHiddenFields()
                    console.log('[syncAndRestoreState] No state to restore, synced from hidden fields')
                } else {
                    console.log('[syncAndRestoreState] No state to restore, preserving existing state')
                }
                syncInProgress = false
                return
            }

            // We have state to restore - check which fields exist on this step
            // Wait a bit for checkboxes to appear in DOM if needed
            let checkboxFieldsOnStep = []
            let retries = 10 // More retries for slower DOM updates
            let foundAnyCheckboxes = false

            while (retries > 0) {
                checkboxFieldsOnStep = CHECKBOX_FIELDS.filter(fieldName => {
                    const checkboxes = form.querySelectorAll(`input[name="${fieldName}"][type="checkbox"]`)
                    return checkboxes.length > 0
                })

                foundAnyCheckboxes = checkboxFieldsOnStep.length > 0

                // If we found checkboxes for fields we have state for, we're good
                const foundFields = checkboxFieldsOnStep.filter(field => checkboxFieldsWithState.includes(field))
                if (foundFields.length > 0) {
                    // Found checkboxes we need to restore - proceed
                    break
                }

                // If we found any checkboxes but not the ones we need, that's OK - proceed anyway
                if (foundAnyCheckboxes) {
                    break
                }

                // Wait a bit and retry if no checkboxes found yet
                await new Promise(resolve => setTimeout(resolve, 50))
                retries--
            }

            if (!foundAnyCheckboxes && retries === 0) {
                // No checkboxes found after waiting - this step probably doesn't have checkboxes
                console.log('[syncAndRestoreState] No checkboxes found on this step after waiting (this is normal for some steps)')
            }

            // Determine which fields we can restore (exist on step AND have state)
            const checkboxFieldsToRestore = checkboxFieldsOnStep.filter(fieldName => {
                return checkboxFieldsWithState.includes(fieldName)
            })

            // If no checkboxes exist on this step, that's normal (e.g., project step)
            // Just sync from hidden fields if they exist, then we're done
            if (checkboxFieldsOnStep.length === 0) {
                const hasHiddenFields = CHECKBOX_FIELDS.some(fieldName => {
                    return form.querySelector(`input[name="${fieldName}"][type="hidden"]`)
                })

                if (hasHiddenFields) {
                    WizardState.syncFromHiddenFields()
                    console.log('[syncAndRestoreState] No checkboxes on this step (normal - e.g., project step), synced from hidden fields')
                } else {
                    // This is normal - not every step has checkboxes
                    // Don't log as error/warning, just preserve state silently
                    console.log('[syncAndRestoreState] No checkboxes on this step (normal), preserving existing state')
                }
                syncInProgress = false
                return
            }

            // We have checkboxes on this step - restore them
            if (checkboxFieldsToRestore.length === 0) {
                // Checkboxes exist but no matching state to restore - that's OK
                console.log('[syncAndRestoreState] Checkboxes exist on step but no matching state to restore')
                syncInProgress = false
                return
            }

            console.log(`[syncAndRestoreState] Restoring checkboxes on this step: ${checkboxFieldsToRestore.join(', ')}`)
            console.log(`[syncAndRestoreState] Expected state:`, {
                css: state.css,
                js: state.js,
                editors: state.editors,
                agents: state.agents
            })

            // Fields to restore
            const availableFields = checkboxFieldsToRestore

            // Restore form selections - only restore fields that exist on this step
            const fieldsToRestore = availableFields

            // Restore all form fields (including text inputs)
            restoreFormSelections()

            // Verify restoration for checkbox fields that exist on this step
            let restoredCount = 0
            let expectedCount = 0
            fieldsToRestore.forEach(fieldName => {
                if (state[fieldName] && Array.isArray(state[fieldName]) && state[fieldName].length > 0) {
                    expectedCount += state[fieldName].length
                    const restored = restoreCheckboxField(form, fieldName, state[fieldName])
                    if (restored) {
                        restoredCount += state[fieldName].length
                    }
                }
            })

            console.log(`[syncAndRestoreState] Restoring fields: ${fieldsToRestore.join(', ')}`)

            // CRITICAL: Sync state from hidden fields AFTER restore is complete
            // This ensures we don't overwrite restored selections with defaults
            WizardState.syncFromHiddenFields()

            syncInProgress = false
            console.log(`[syncAndRestoreState] State sync and restore completed (restored ${restoredCount}/${expectedCount} checkboxes)`)
        } catch (error) {
            console.error('[syncAndRestoreState] Error:', error)
            syncInProgress = false
        }
    }

    /**
     * HTMX sync handler - syncs state after content swap
     * CRITICAL: Wait for DOM to be fully ready before restoring
     * Uses htmx:afterSettle which fires after all swaps are complete
     */
    /**
     * Check if event target is wizard content
     * @param {Event} event - HTMX event
     * @returns {boolean} True if target is wizard content
     */
    function isWizardContentTarget(event) {
        return event.detail?.target?.id === WIZARD_CONTENT_ID || event.target?.id === WIZARD_CONTENT_ID
    }

    function htmxSyncHandler(event) {
        if (isWizardContentTarget(event)) {
            // afterSettle ensures DOM is ready, but we still wait a bit for browser rendering
            // Use longer delay to ensure checkboxes are in DOM
            setTimeout(() => {
                syncAndRestoreState().then(() => {
                    // CRITICAL: If we're on the review step, ensure state is saved before form submission
                    const form = document.getElementById(GENERATE_FORM_ID)
                    if (form) {
                        // Double-check that state is saved
                        const currentFormData = WizardState.collectFormData()
                        WizardState.update(currentFormData)
                        console.log('[htmxSyncHandler] State saved for review step:', currentFormData)
                    }
                }).catch(error => {
                    console.error('[htmxSyncHandler] Error in syncAndRestoreState:', error)
                })
            }, SYNC_DELAY_MS * 2) // Longer delay to ensure DOM is ready
        }
    }

    // CRITICAL: Use afterSettle for DOM readiness (fires after all swaps are complete)
    // This is the recommended HTMX event for DOM manipulation after content swaps
    document.body.addEventListener('htmx:afterSettle', function(event) {
        if (isWizardContentTarget(event)) {
            // afterSettle fires after all swaps are complete, so DOM should be ready
            // Use longer delay to ensure browser has finished rendering and checkboxes are in DOM
            setTimeout(() => htmxSyncHandler(event), SYNC_DELAY_MS * 4) // 200ms delay
        }
    })

    // Fallback: Use afterSwap if afterSettle doesn't fire (shouldn't happen, but safety net)
    document.body.addEventListener('htmx:afterSwap', function(event) {
        if (isWizardContentTarget(event)) {
            // Longer delay for fallback since afterSwap fires earlier
            setTimeout(() => htmxSyncHandler(event), SYNC_DELAY_MS * 10) // 500ms delay
        }
    })

    // ============================================================================
    // Helper Functions
    // ============================================================================

    /**
     * Bind step button click handlers
     * @param {HTMLElement} button - Button element
     */
    function bindStepButton(button) {
        const stepNum = parseInt(button.getAttribute('data-step'))
        const route = button.getAttribute('data-route')
        const setupType = button.closest('[data-setup-type]')?.getAttribute('data-setup-type') ||
                         document.querySelector('[data-setup-type]')?.getAttribute('data-setup-type') ||
                         'extended'

        button.addEventListener('click', function(e) {
            e.preventDefault()
            e.stopPropagation()
            navigateToStep(stepNum, route, setupType)
        })
    }

    /**
     * Initialize step button handlers
     */
    function initializeStepButtons() {
        const stepButtons = document.querySelectorAll('[data-step][data-route]')
        stepButtons.forEach(bindStepButton)
    }

    /**
     * Save user input to state as they type (debounced)
     * Prevents losing input when HTMX swaps occur
     * CRITICAL: Also saves checkbox changes immediately to ensure selections are preserved
     */
    function setupInputSaving() {
        let saveTimeout = null
        const saveUserInput = () => {
            clearTimeout(saveTimeout)
            saveTimeout = setTimeout(() => {
                const formData = WizardState.collectFormData()
                WizardState.update(formData)
                console.log('[setupInputSaving] State saved:', formData)
            }, WIZARD_CONFIG.DEBOUNCE_DELAY)
        }

        // Save immediately for checkboxes (no debounce needed)
        const saveCheckboxState = () => {
            const formData = WizardState.collectFormData()
            WizardState.update(formData)
            console.log('[setupInputSaving] Checkbox state saved immediately:', formData)
        }

        /**
         * Check if target is a project field input
         * @param {HTMLElement} target - Event target
         * @returns {boolean} True if project field
         */
        const isProjectField = (target) => {
            return target && (target.name === FIELD_NAMES.PROJECT_NAME || target.name === FIELD_NAMES.PROJECT_DESCRIPTION)
        }

        /**
         * Check if target is a checkbox that should trigger save
         * @param {HTMLElement} target - Event target
         * @returns {boolean} True if checkbox field
         */
        const isCheckboxField = (target) => {
            return target && target.type === 'checkbox' &&
                (CHECKBOX_FIELDS.includes(target.name) ||
                 target.name === FIELD_NAMES.FRAMEWORK ||
                 target.name.startsWith('framework_'))
        }

        /**
         * Check if target is a preset radio button
         * @param {HTMLElement} target - Event target
         * @returns {boolean} True if preset radio
         */
        const isPresetRadio = (target) => {
            return target && target.type === 'radio' && target.name === FIELD_NAMES.PRESET
        }

        // Use event delegation for better performance
        // Listen for text input changes (debounced)
        document.body.addEventListener('input', function(event) {
            if (isProjectField(event.target)) {
                saveUserInput()
            }
        }, true) // Use capture phase to catch events early

        // CRITICAL: Listen for checkbox changes and save immediately
        // This ensures selections are preserved when navigating between steps
        document.body.addEventListener('change', function(event) {
            if (isCheckboxField(event.target) || isPresetRadio(event.target)) {
                saveCheckboxState()
            }
        }, true) // Use capture phase to catch events early

        // Also listen for click events on checkboxes and radio buttons (for better compatibility)
        document.body.addEventListener('click', function(event) {
            if (isCheckboxField(event.target) || isPresetRadio(event.target)) {
                // Small delay to ensure state is updated
                setTimeout(saveCheckboxState, RADIO_SAVE_DELAY_MS)
            }
        }, true) // Use capture phase to catch events early
    }

    // ============================================================================
    // Global Exports
    // ============================================================================

    window.navigateToStep = navigateToStep
    window.goBack = goBack
    window.WizardState = WizardState
    window.restoreFormSelections = restoreFormSelections

    // Editor selection helpers
    window.selectAllEditors = function() {
        document.querySelectorAll('input[name="editors"]').forEach(cb => cb.checked = true)
    }
    window.deselectAllEditors = function() {
        document.querySelectorAll('input[name="editors"]').forEach(cb => cb.checked = false)
    }

    // Advanced step helpers
    window.toggleInfo = function(infoId) {
        const infoBox = document.getElementById(infoId)
        if (infoBox) infoBox.classList.toggle('hidden')
    }
    window.updateFrameworkVisibility = function() {
        const checkbox = document.querySelector(`input[name="${FIELD_NAMES.FRAMEWORK}"]`)
        const options = document.getElementById('framework-options')
        if (checkbox && options) {
            options.classList.toggle('hidden', !checkbox.checked)
        }
    }
    window.handleAdvancedSubmit = function() {
        return true
    }

    // ============================================================================
    // Initialization
    // ============================================================================

    /**
     * Initialize wizard scripts on DOM ready
     */
    function initializeWizardScripts() {
        // Re-bind step buttons after HTMX swaps
        document.body.addEventListener('htmx:afterSwap', initializeStepButtons)

        // Initial bind
        initializeStepButtons()

        // Initial restore on page load
        setTimeout(() => {
            WizardState.syncFromHiddenFields()
            restoreFormSelections()
        }, WIZARD_CONFIG.INITIAL_RESTORE_DELAY)

        // Setup input saving
        setupInputSaving()

        // Setup HTMX listeners
        setupHtmxListeners()
    }

    document.addEventListener('DOMContentLoaded', initializeWizardScripts)
})() // End IIFE - prevent multiple executions
