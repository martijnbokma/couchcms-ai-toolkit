/**
 * Form sync and state restoration
 * Syncs state from hidden fields and restores form selections after HTMX swaps
 */
(function() {
    'use strict'

    // Ensure dependencies are available
    if (!window.WIZARD_CONFIG || !window.WIZARD_CONSTANTS || !window.WizardState || !window.HTMXUtils) {
        console.error('[Form Sync] Required dependencies not loaded')
        return
    }

    const WIZARD_CONFIG = window.WIZARD_CONFIG
    const WIZARD_CONSTANTS = window.WIZARD_CONSTANTS
    const WizardState = window.WizardState
    const HTMXUtils = window.HTMXUtils

    const CHECKBOX_FIELDS = WIZARD_CONSTANTS.CHECKBOX_FIELDS
    const CHECKBOX_CHECK_INTERVAL_MS = WIZARD_CONSTANTS.CHECKBOX_CHECK_INTERVAL_MS
    const WAIT_FOR_CHECKBOXES_TIMEOUT_MS = WIZARD_CONSTANTS.WAIT_FOR_CHECKBOXES_TIMEOUT_MS
    const SYNC_DELAY_MS = WIZARD_CONSTANTS.SYNC_DELAY_MS
    const GENERATE_FORM_ID = WIZARD_CONSTANTS.GENERATE_FORM_ID

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
     * Uses Promise-based waiting for better reliability
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

            // Determine which checkbox fields we need to restore
            const checkboxFields = CHECKBOX_FIELDS.filter(fieldName => {
                return state[fieldName] && Array.isArray(state[fieldName]) && state[fieldName].length > 0
            })

            if (checkboxFields.length === 0) {
                // No checkboxes to restore on this step (e.g., project step)
                // CRITICAL: Only sync from hidden fields if they exist
                // Don't overwrite state if there are no hidden fields (preserves existing state)
                const hasHiddenFields = form && CHECKBOX_FIELDS.some(fieldName => {
                    return form.querySelector(`input[name="${fieldName}"][type="hidden"]`)
                })

                if (hasHiddenFields) {
                    WizardState.syncFromHiddenFields()
                    console.log('[syncAndRestoreState] No checkboxes to restore, synced from hidden fields')
                } else {
                    console.log('[syncAndRestoreState] No checkboxes to restore and no hidden fields, preserving existing state')
                }
                syncInProgress = false
                return
            }

            // Wait for checkboxes to appear in DOM
            console.log(`[syncAndRestoreState] Waiting for checkboxes: ${checkboxFields.join(', ')}`)
            console.log(`[syncAndRestoreState] Expected state:`, {
                css: state.css,
                js: state.js,
                editors: state.editors
            })

            const { found: checkboxesReady, availableFields } = await waitForCheckboxes(form, checkboxFields, WAIT_FOR_CHECKBOXES_TIMEOUT_MS)

            if (!checkboxesReady && availableFields.length === 0) {
                // No checkboxes on this step - this is normal for some steps (e.g., project step)
                // Just sync from hidden fields if they exist
                const hasHiddenFields = CHECKBOX_FIELDS.some(fieldName => {
                    return form.querySelector(`input[name="${fieldName}"][type="hidden"]`)
                })

                if (hasHiddenFields) {
                    WizardState.syncFromHiddenFields()
                    console.log('[syncAndRestoreState] No checkboxes on this step (normal), synced from hidden fields')
                } else {
                    console.log('[syncAndRestoreState] No checkboxes on this step (normal - e.g., project step), preserving existing state')
                }
                syncInProgress = false
                return
            }

            if (!checkboxesReady) {
                console.log(`[syncAndRestoreState] Some checkboxes found for fields: ${availableFields.join(', ')}, proceeding with restore`)
            } else {
                console.log(`[syncAndRestoreState] All checkboxes found for fields: ${availableFields.join(', ')}, proceeding with restore`)
            }

            // Restore form selections - only restore fields that exist on this step
            const fieldsToRestore = availableFields.length > 0 ? availableFields : checkboxFields.filter(fieldName => {
                const checkboxes = form.querySelectorAll(`input[name="${fieldName}"][type="checkbox"]`)
                return checkboxes.length > 0
            })

            // Restore all form fields (including text inputs)
            if (typeof window.restoreFormSelections === 'function') {
                window.restoreFormSelections()
            }

            // Verify restoration for checkbox fields that exist on this step
            let restoredCount = 0
            let expectedCount = 0
            fieldsToRestore.forEach(fieldName => {
                if (state[fieldName] && Array.isArray(state[fieldName]) && state[fieldName].length > 0) {
                    expectedCount += state[fieldName].length
                    if (typeof window.restoreCheckboxField === 'function') {
                        const restored = window.restoreCheckboxField(form, fieldName, state[fieldName])
                        if (restored) {
                            restoredCount += state[fieldName].length
                        }
                    }
                }
            })

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
     */
    function htmxSyncHandler(event) {
        if (HTMXUtils.isWizardContentTarget(event)) {
            // afterSettle ensures DOM is ready, but we still wait a bit for browser rendering
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
                })
            }, SYNC_DELAY_MS)
        }
    }

    /**
     * Setup HTMX event listeners for sync and restore
     */
    function setupHtmxSyncListeners() {
        // CRITICAL: Use afterSettle for DOM readiness (fires after all swaps are complete)
        // This is the recommended HTMX event for DOM manipulation after content swaps
        document.body.addEventListener('htmx:afterSettle', function(event) {
            if (HTMXUtils.isWizardContentTarget(event)) {
                // afterSettle fires after all swaps are complete, so DOM should be ready
                // But we still use a small delay to ensure browser has finished rendering
                setTimeout(() => htmxSyncHandler(event), SYNC_DELAY_MS)
            }
        })

        // Fallback: Use afterSwap if afterSettle doesn't fire (shouldn't happen, but safety net)
        document.body.addEventListener('htmx:afterSwap', function(event) {
            if (HTMXUtils.isWizardContentTarget(event)) {
                // Longer delay for fallback since afterSwap fires earlier
                setTimeout(() => htmxSyncHandler(event), SYNC_DELAY_MS * 6)
            }
        })
    }

    // Setup listeners when DOM is ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupHtmxSyncListeners)
        } else {
            setupHtmxSyncListeners()
        }
    }

    // Export functions
    window.waitForCheckboxes = waitForCheckboxes
    window.syncAndRestoreState = syncAndRestoreState
})();
