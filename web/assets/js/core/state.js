/**
 * Wizard State Management
 * Centralized state management using sessionStorage
 * Single source of truth for all wizard selections
 */
(function() {
    'use strict'

    // Ensure dependencies are available
    if (!window.WIZARD_CONFIG || !window.WIZARD_CONSTANTS || !window.DOMUtils) {
        console.error('[WizardState] Required dependencies not loaded. Load constants.js, dom.js, and htmx.js first.')
        return
    }

    const WIZARD_CONFIG = window.WIZARD_CONFIG
    const WIZARD_CONSTANTS = window.WIZARD_CONSTANTS
    const DOMUtils = window.DOMUtils

    const FIELD_NAMES = WIZARD_CONSTANTS.FIELD_NAMES
    const CHECKBOX_FIELDS = WIZARD_CONSTANTS.CHECKBOX_FIELDS
    const FRAMEWORK_OPTIONS = WIZARD_CONSTANTS.FRAMEWORK_OPTIONS

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
                if (normalizedState[FIELD_NAMES.PROJECT_NAME]) {
                    const normalized = DOMUtils.normalizeProjectValue(normalizedState[FIELD_NAMES.PROJECT_NAME])
                    normalized ? (normalizedState[FIELD_NAMES.PROJECT_NAME] = normalized) : delete normalizedState[FIELD_NAMES.PROJECT_NAME]
                }

                if (normalizedState[FIELD_NAMES.PROJECT_DESCRIPTION]) {
                    const normalized = DOMUtils.normalizeProjectValue(normalizedState[FIELD_NAMES.PROJECT_DESCRIPTION])
                    normalized ? (normalizedState[FIELD_NAMES.PROJECT_DESCRIPTION] = normalized) : delete normalizedState[FIELD_NAMES.PROJECT_DESCRIPTION]
                }

                // Remove duplicates from editors array
                if (normalizedState.editors && Array.isArray(normalizedState.editors)) {
                    normalizedState.editors = [...new Set(normalizedState.editors)]
                }

                // Remove duplicates from frontend arrays
                if (normalizedState.css && Array.isArray(normalizedState.css)) {
                    normalizedState.css = [...new Set(normalizedState.css)]
                }
                if (normalizedState.js && Array.isArray(normalizedState.js)) {
                    normalizedState.js = [...new Set(normalizedState.js)]
                }

                // Normalize preset field - ensure it's always a single string value
                // Handle arrays (take first value), comma-separated strings (take first part), or keep as is
                if (normalizedState[FIELD_NAMES.PRESET] !== undefined && normalizedState[FIELD_NAMES.PRESET] !== null) {
                    const presetValue = normalizedState[FIELD_NAMES.PRESET]
                    if (Array.isArray(presetValue)) {
                        // If array, take first non-empty value
                        const firstValue = presetValue.find(v => v && v !== '' && v !== 'undefined')
                        normalizedState[FIELD_NAMES.PRESET] = firstValue ? String(firstValue).trim() : ''
                    } else if (typeof presetValue === 'string') {
                        // If string contains commas, take first part
                        const trimmed = presetValue.trim()
                        if (trimmed.includes(',')) {
                            const firstPart = trimmed.split(',')[0].trim()
                            normalizedState[FIELD_NAMES.PRESET] = firstPart || ''
                        } else {
                            normalizedState[FIELD_NAMES.PRESET] = trimmed
                        }
                    } else {
                        // Convert to string or empty
                        normalizedState[FIELD_NAMES.PRESET] = presetValue ? String(presetValue).trim() : ''
                    }
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
            const visibleInput = DOMUtils.getVisibleInput(form, fieldName)
            const visibleValue = (visibleInput && visibleInput.value) ? visibleInput.value.trim() : null

            const placeholder = (visibleInput && visibleInput.placeholder) ? visibleInput.placeholder : null
            if (visibleValue && visibleValue !== defaultValue && visibleValue !== placeholder) {
                syncedState[fieldName] = visibleValue
                return
            }

            // Fallback to hidden fields
            const hiddenInputs = DOMUtils.getHiddenInputs(form, fieldName)
            const hiddenValue = hiddenInputs
                .map(input => input.value)
                .find(v => DOMUtils.isValidValue(v) && v !== defaultValue)

            if (hiddenValue) {
                syncedState[fieldName] = DOMUtils.normalizeProjectValue(hiddenValue)
            }
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
            const visibleValues = DOMUtils.getCheckboxValues(form, fieldName, true)
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
                    return
                }

                syncedState[fieldName] = newValues
                console.log(`[WizardState._syncCheckboxField] Synced ${fieldName} from visible checkboxes:`, syncedState[fieldName])
                return
            }

            // Fallback to hidden fields ONLY if they exist and have values
            const hiddenInputs = DOMUtils.getHiddenInputs(form, fieldName)
            const hiddenValues = hiddenInputs
                .map(input => input.value)
                .filter(v => DOMUtils.isValidValue(v))

            if (hiddenValues.length > 0) {
                const newValues = [...new Set(hiddenValues)]
                const currentSet = new Set(currentState)
                const newSet = new Set(newValues)

                // Check if we should update - only if new set is different and has more or different values
                const isSubsetOfNew = [...currentSet].every(v => newSet.has(v))
                const hasMoreInNew = newSet.size > currentSet.size
                const hasDifferentInNew = [...newSet].some(v => !currentSet.has(v)) && !isSubsetOfNew

                if (currentState.length > 0 && isSubsetOfNew && !hasMoreInNew && !hasDifferentInNew) {
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
                    // Step doesn't have this field - preserve existing state
                    if (syncedState[fieldName] && syncedState[fieldName].length > 0) {
                        console.log(`[WizardState._syncCheckboxField] Preserving existing ${fieldName} state (field not on this step):`, syncedState[fieldName])
                    }
                } else {
                    // Field exists on this step but no hidden fields and no visible values
                    // This means the field was cleared - but we should preserve state if it exists
                    if (currentState.length > 0) {
                        console.log(`[WizardState._syncCheckboxField] Preserving ${fieldName} state (no form values but state exists):`, currentState)
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
            const frameworkHidden = form.querySelector(`input[name="${FIELD_NAMES.FRAMEWORK}"][type="hidden"]`)
            if (!frameworkHidden || frameworkHidden.value !== 'true') {
                return
            }

            syncedState[FIELD_NAMES.FRAMEWORK] = 'true'
            FRAMEWORK_OPTIONS.forEach(option => {
                const input = form.querySelector(`input[name="framework_${option}"][type="hidden"]`)
                if (input && input.value === 'true') {
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
            const setupTypeInputs = DOMUtils.getHiddenInputs(form, FIELD_NAMES.SETUP_TYPE)
            if (setupTypeInputs.length > 0) {
                const setupTypeValue = setupTypeInputs
                    .map(input => input.value)
                    .find(v => DOMUtils.isValidValue(v))
                if (setupTypeValue) {
                    syncedState[FIELD_NAMES.SETUP_TYPE] = DOMUtils.normalizeProjectValue(setupTypeValue)
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
            if (contextDirInput && contextDirInput.value) {
                syncedState[FIELD_NAMES.CONTEXT_DIR] = contextDirInput.value
            }

            // Sync preset (check radio button first, then hidden field)
            // CRITICAL: Only take first value if multiple hidden fields exist to prevent duplication
            const presetRadio = form.querySelector(`input[name="${FIELD_NAMES.PRESET}"][type="radio"]:checked`)
            if (presetRadio?.value !== undefined) {
                const value = presetRadio.value.trim()
                syncedState[FIELD_NAMES.PRESET] = value || ''
            } else {
                // Get first hidden input only (in case there are multiple)
                const presetInputs = DOMUtils.getHiddenInputs(form, FIELD_NAMES.PRESET)
                const presetInput = presetInputs.length > 0 ? presetInputs[0] : null
                if (presetInput && presetInput.value !== undefined) {
                    let value = presetInput.value.trim()
                    // Handle comma-separated values - take first part only
                    if (value.includes(',')) {
                        value = value.split(',')[0].trim()
                    }
                    syncedState[FIELD_NAMES.PRESET] = value || ''
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
            const visibleInput = DOMUtils.getVisibleInput(form, fieldName)
            const visibleValue = (visibleInput && visibleInput.value) ? visibleInput.value.trim() : null

            if (visibleValue && visibleValue !== defaultValue) {
                const normalized = DOMUtils.normalizeProjectValue(visibleValue)
                if (normalized) {
                    formData[fieldName] = normalized
                    console.log(`[WizardState._collectProjectField] Set ${fieldName} from visible input:`, normalized)
                    return
                }
            }

            // Fallback to hidden fields
            if (!visibleInput || !visibleValue || visibleValue === defaultValue) {
                const hiddenInputs = DOMUtils.getHiddenInputs(form, fieldName)
                const hiddenValues = hiddenInputs
                    .map(input => input.value)
                    .filter(v => DOMUtils.isValidValue(v) && v !== defaultValue)

                if (hiddenValues.length > 0 && !formData[fieldName]) {
                    const normalized = DOMUtils.normalizeProjectValue(hiddenValues)
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
                const checkedValues = DOMUtils.getCheckboxValues(form, fieldName, true)
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
                const hiddenInputs = DOMUtils.getHiddenInputs(form, fieldName)
                const hiddenValues = hiddenInputs
                    .map(input => input.value)
                    .filter(v => DOMUtils.isValidValue(v))

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
                if (DOMUtils.isValidValue(value)) {
                    formData[fieldName] = value
                    console.log(`[WizardState._collectRadioField] Updated ${fieldName} from visible radio:`, value)
                    return
                }
            }

            // Fallback to hidden field - CRITICAL: Only take first value if multiple exist
            const hiddenInputs = DOMUtils.getHiddenInputs(form, fieldName)
            const hiddenInput = hiddenInputs.length > 0 ? hiddenInputs[0] : null
            if (hiddenInput && hiddenInput.value && DOMUtils.isValidValue(hiddenInput.value)) {
                let value = hiddenInput.value.trim()
                // Handle comma-separated values - take first part only (prevents duplication)
                if (value.includes(',')) {
                    value = value.split(',')[0].trim()
                }
                formData[fieldName] = value
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
                    formData[`framework_${option}`] = (checkbox && checkbox.checked) ? 'true' : undefined
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
            const setupTypeInput = DOMUtils.getVisibleInput(form, FIELD_NAMES.SETUP_TYPE)
            if (setupTypeInput && setupTypeInput.value) {
                formData[FIELD_NAMES.SETUP_TYPE] = setupTypeInput.value
            } else {
                const hiddenSetupType = form.querySelector(`input[name="${FIELD_NAMES.SETUP_TYPE}"][type="hidden"]`)
                if (hiddenSetupType && hiddenSetupType.value && !formData[FIELD_NAMES.SETUP_TYPE]) {
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
            const contextDirInput = DOMUtils.getVisibleInput(form, FIELD_NAMES.CONTEXT_DIR)
            if (contextDirInput && contextDirInput.value) {
                formData[FIELD_NAMES.CONTEXT_DIR] = contextDirInput.value
            } else {
                // Fallback to hidden field
                const hiddenContextDir = form.querySelector(`input[name="${FIELD_NAMES.CONTEXT_DIR}"][type="hidden"]`)
                if (hiddenContextDir && hiddenContextDir.value && !formData[FIELD_NAMES.CONTEXT_DIR]) {
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

            // Agent selections - remove duplicates before adding to URL params
            if (stateToUse.agents && Array.isArray(stateToUse.agents) && stateToUse.agents.length > 0) {
                const uniqueAgents = [...new Set(stateToUse.agents)]
                uniqueAgents.forEach(agent => params.append('agents', agent))
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

    // Export WizardState to window
    window.WizardState = WizardState
})();
