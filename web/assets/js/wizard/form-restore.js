/**
 * Form restoration functions
 * Restore form field values from saved wizard state
 */
(function() {
    'use strict'

    // Ensure dependencies are available
    if (!window.WIZARD_CONFIG || !window.WIZARD_CONSTANTS || !window.WizardState || !window.DOMUtils) {
        console.error('[Form Restore] Required dependencies not loaded')
        return
    }

    const WIZARD_CONFIG = window.WIZARD_CONFIG
    const WIZARD_CONSTANTS = window.WIZARD_CONSTANTS
    const WizardState = window.WizardState
    const DOMUtils = window.DOMUtils

    const FIELD_NAMES = WIZARD_CONSTANTS.FIELD_NAMES
    const CHECKBOX_FIELDS = WIZARD_CONSTANTS.CHECKBOX_FIELDS
    const FRAMEWORK_OPTIONS = WIZARD_CONSTANTS.FRAMEWORK_OPTIONS

    /**
     * Restore project field value if safe to do so
     * @param {HTMLElement} input - Input element
     * @param {string} stateValue - Value from state
     * @param {string} defaultValue - Default value to check against
     */
    function restoreProjectField(input, stateValue, defaultValue) {
        if (!input || !stateValue) return

        const normalizedValue = DOMUtils.normalizeProjectValue(stateValue)
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
     * @returns {boolean} True if all checkboxes were restored successfully
     */
    function restoreCheckboxField(form, fieldName, stateValues) {
        if (!stateValues || !Array.isArray(stateValues) || stateValues.length === 0) {
            console.log(`[restoreCheckboxField] No values to restore for ${fieldName}`)
            return true // Nothing to restore, consider it successful
        }

        const uniqueValues = [...new Set(stateValues.filter(v => DOMUtils.isValidValue(v)))]
        console.log(`[restoreCheckboxField] Restoring ${fieldName} with values:`, uniqueValues)

        // Use explicit checkbox selector
        const allCheckboxes = Array.from(form.querySelectorAll(`input[name="${fieldName}"][type="checkbox"]`))
        const availableValues = allCheckboxes.map(cb => cb.value)

        // If no checkboxes found, check if this field exists on this step at all
        if (allCheckboxes.length === 0) {
            // Check if there are hidden fields for this checkbox field (means it's not on this step)
            const hasHiddenFields = form.querySelector(`input[name="${fieldName}"][type="hidden"]`)

            if (hasHiddenFields) {
                // Field exists as hidden field - this step doesn't have checkboxes for this field (normal)
                console.log(`[restoreCheckboxField] No checkboxes for ${fieldName} on this step (field exists as hidden, normal)`)
                return true // Consider it successful - field just doesn't exist on this step
            } else {
                // No checkboxes and no hidden fields - might not be in DOM yet or field doesn't exist
                // Only log at debug level, not as warning
                console.log(`[restoreCheckboxField] No checkboxes found for ${fieldName} (may not be on this step or DOM still loading)`)
                return false
            }
        }

        console.log(`[restoreCheckboxField] Available checkboxes for ${fieldName}:`, availableValues)

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
            if (typeof window.updateFrameworkVisibility === 'function') {
                window.updateFrameworkVisibility()
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
        const projectNameInput = DOMUtils.getVisibleInput(form, FIELD_NAMES.PROJECT_NAME)
        if (projectNameInput && state[FIELD_NAMES.PROJECT_NAME]) {
            restoreProjectField(projectNameInput, state[FIELD_NAMES.PROJECT_NAME], WIZARD_CONFIG.DEFAULT_PROJECT_NAME)
        }

        const projectDescriptionInput = DOMUtils.getVisibleInput(form, FIELD_NAMES.PROJECT_DESCRIPTION)
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
                if (fieldName === 'editors' || fieldName === 'agents') {
                    // Editors and agents need special handling for deduplication
                    if (state[fieldName] && Array.isArray(state[fieldName]) && state[fieldName].length > 0) {
                        const uniqueValues = [...new Set(state[fieldName].filter(v => DOMUtils.isValidValue(v)))]
                        console.log(`[restoreFormSelections] Restoring ${fieldName}:`, uniqueValues)
                        restoreCheckboxField(form, fieldName, uniqueValues)
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

    // Export restore functions
    window.restoreFormSelections = restoreFormSelections
    window.restoreProjectField = restoreProjectField
    window.restoreCheckboxField = restoreCheckboxField
    window.restoreRadioField = restoreRadioField
    window.restoreFrameworkOptions = restoreFrameworkOptions
})();
