/**
 * DOM utility functions
 * Shared DOM helpers for form queries and element selection
 */
(function() {
    'use strict'

    const INVALID_VALUES = (window.WIZARD_CONSTANTS && window.WIZARD_CONSTANTS.INVALID_VALUES) || ['', 'undefined', 'null']
    const CHECKBOX_FIELDS = (window.WIZARD_CONSTANTS && window.WIZARD_CONSTANTS.CHECKBOX_FIELDS) || ['css', 'js', 'editors']

    /**
     * Check if a value is invalid or empty
     * @param {string} value - Value to check
     * @returns {boolean} True if invalid
     */
    function isValidValue(value: string | null | undefined): boolean {
        return Boolean(value && !INVALID_VALUES.includes(String(value)))
    }

    /**
     * Get visible input element from form
     * @param {HTMLFormElement | null} form - Form element
     * @param {string} name - Field name
     * @param {string | null} type - Input type (optional)
     * @returns {HTMLElement | null} Visible input element
     */
    function getVisibleInput(form: HTMLFormElement | null, name: string, type: string | null = null): HTMLElement | null {
        if (!form) return null
        const selector = type
            ? `input[name="${name}"][type="${type}"]:not([type="hidden"])`
            : `input[name="${name}"]:not([type="hidden"]), textarea[name="${name}"]`
        return form.querySelector(selector)
    }

    /**
     * Get all hidden input elements from form
     * @param {HTMLFormElement | null} form - Form element
     * @param {string} name - Field name
     * @returns {HTMLInputElement[]} Array of hidden input elements
     */
    function getHiddenInputs(form: HTMLFormElement | null, name: string): HTMLInputElement[] {
        if (!form) return []
        return Array.from(form.querySelectorAll<HTMLInputElement>(`input[name="${name}"][type="hidden"]`))
    }

    /**
     * Get checkbox values from form
     * @param {HTMLFormElement | null} form - Form element
     * @param {string} name - Field name
     * @param {boolean} checkedOnly - Only return checked checkboxes
     * @returns {string[]} Array of checkbox values
     */
    function getCheckboxValues(form: HTMLFormElement | null, name: string, checkedOnly: boolean = true): string[] {
        if (!form) return []
        const selector = checkedOnly
            ? `input[name="${name}"][type="checkbox"]:checked`
            : `input[name="${name}"][type="checkbox"]`
        return Array.from(form.querySelectorAll<HTMLInputElement>(selector))
            .map(input => input.value)
            .filter(v => isValidValue(v))
    }

    /**
     * Normalize project value to single string (no duplicates)
     * Handles arrays, comma-separated strings, and ensures single value
     * @param {string | string[] | null | undefined} value - Value to normalize
     * @returns {string | null} Normalized single value or null
     */
    function normalizeProjectValue(value: string | string[] | null | undefined): string | null {
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

    // Export DOM utilities
    window.DOMUtils = {
        isValidValue,
        getVisibleInput,
        getHiddenInputs,
        getCheckboxValues,
        normalizeProjectValue
    }
})()

