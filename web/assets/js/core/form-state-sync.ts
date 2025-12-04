/**
 * Form State Synchronization - Improved Version
 * Handles bidirectional sync between forms and wizard state with proper cleanup
 *
 * @class FormStateSync
 */
(function() {
    'use strict'

    // Ensure dependencies are available
    if (!window.wizardStateManager) {
        console.error('[FormStateSync] WizardStateManager not available')
        return
    }

    const stateManager = window.wizardStateManager
    const DOMUtils = window.DOMUtils || {} as DOMUtils

    interface FormListeners {
        input: (e: Event) => void
        change: (e: Event) => void
        submit: (e: Event) => void
    }

    /**
     * Form State Sync Class - Improved Version
     */
    class FormStateSync {
        debounceTimers: Map<HTMLFormElement, ReturnType<typeof setTimeout>>
        listeners: Map<HTMLFormElement, FormListeners>
        htmxHandlers: Map<HTMLFormElement, (e: Event) => void>
        debounceDelay: number
        isRestoring: boolean

        constructor() {
            this.debounceTimers = new Map()
            this.listeners = new Map() // Track listeners per form for cleanup
            this.htmxHandlers = new Map() // Track HTMX handlers for cleanup
            this.debounceDelay = window.WIZARD_CONFIG?.DEBOUNCE_DELAY || 300
            this.isRestoring = false // Flag to prevent listeners from triggering during restore
        }

        /**
         * Collect form data and convert to state format
         * CRITICAL: Always merges with existing state to preserve selections from other steps
         * @param {HTMLFormElement} form - Form element
         * @returns {WizardState} Form data as state object (merged with existing state)
         */
        collectFormData(form: HTMLFormElement | null): Partial<WizardState> {
            if (!form || form.tagName !== 'FORM') {
                console.warn('[FormStateSync] Invalid form element')
                return {}
            }

            // CRITICAL: Start with existing state to preserve all previous selections
            // This ensures that selections from other steps are never lost
            const existingState = stateManager.load()
            const data: Partial<WizardState> = { ...existingState }

            // CRITICAL: Collect checkbox arrays directly from DOM, not FormData
            // FormData only includes checked checkboxes, but we need to know ALL checkbox states
            // to properly update arrays (including unchecked ones)
            const checkboxFields = ['css', 'js', 'agents', 'editors'] as const
            checkboxFields.forEach(key => {
                const checkboxes = form.querySelectorAll<HTMLInputElement>(`input[name="${key}"][type="checkbox"]`)
                if (checkboxes.length > 0) {
                    // Field exists in form - collect checked values from DOM
                    // CRITICAL: Always collect from DOM, even if empty (to preserve deselections)
                    const checkedValues: string[] = []
                    checkboxes.forEach(checkbox => {
                        if (checkbox.checked && checkbox.value && checkbox.value !== 'false' && checkbox.value !== '') {
                            checkedValues.push(checkbox.value)
                        }
                    })
                    // CRITICAL: Always set the array, even if empty, to preserve deselections
                    // Don't keep existing state if field exists in form - user's current selection is authoritative
                    data[key] = checkedValues
                    console.log(`[FormStateSync] Collected ${key} from DOM:`, checkedValues, `(total checkboxes: ${checkboxes.length})`)
                } else {
                    // CRITICAL: Field doesn't exist in form - explicitly preserve existing state
                    // This ensures selections from other steps are never lost during navigation
                    if (existingState[key] && Array.isArray(existingState[key]) && existingState[key].length > 0) {
                        console.log(`[FormStateSync] Preserving ${key} from existing state:`, existingState[key])
                        // State is already copied above, but log for debugging
                    }
                }
                // If field doesn't exist in form, keep existing state (preserve from other steps)
            })

            // Process other form fields from FormData
            const formData = new FormData(form)
            for (const [key, value] of formData.entries()) {
                // Skip checkbox fields - already handled above
                if (checkboxFields.includes(key as typeof checkboxFields[number])) {
                    continue
                }

                // Framework checkboxes (boolean)
                if (key.startsWith('framework_')) {
                    data[key as keyof WizardState] = (value === 'true' || value === true) as never
                }
                // Framework main checkbox
                else if (key === 'framework') {
                    data.framework = value === 'true' || value === true
                }
                // Setup type
                else if (key === 'setupType') {
                    data.setupType = (value || 'simple') as 'simple' | 'extended'
                }
                // Preset (radio button)
                else if (key === 'preset') {
                    data.preset = value || ''
                }
                // Context directory
                else if (key === 'contextDir') {
                    data.contextDir = value || '.project'
                }
                // Text fields - only update if field exists in form
                else {
                    const fieldExists = form.querySelector(`input[name="${key}"], textarea[name="${key}"]`) !== null
                    if (fieldExists) {
                        (data as Record<string, unknown>)[key] = value || ''
                    }
                    // If field doesn't exist, keep existing state
                }
            }

            // Remove duplicates from arrays
            checkboxFields.forEach(key => {
                const value = data[key]
                if (value && Array.isArray(value)) {
                    data[key] = [...new Set(value)] as string[]
                }
            })

            console.log('[FormStateSync] Collected form data (merged with existing state):', {
                css: data.css,
                js: data.js,
                agents: data.agents,
                editors: data.editors,
                projectName: data.projectName,
                preset: data.preset
            })

            return data
        }

        /**
         * Apply state to form elements
         * @param {HTMLFormElement} form - Form element
         * @param {Partial<WizardState>} state - State to apply
         */
        applyStateToForm(form: HTMLFormElement | null, state: Partial<WizardState>): void {
            if (!form || form.tagName !== 'FORM') {
                console.warn('[FormStateSync] Invalid form element')
                return
            }

            console.log('[FormStateSync] Applying state to form:', state)

            // Set restoring flag
            this.isRestoring = true

            // Apply text inputs and textareas
            Object.entries(state).forEach(([key, value]) => {
                if (['css', 'js', 'agents', 'editors'].includes(key)) {
                    // Checkboxes - check matching values
                    const checkboxes = form.querySelectorAll<HTMLInputElement>(`input[name="${key}"][type="checkbox"]`)
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = Array.isArray(value) && value.includes(checkbox.value)
                    })
                }
                else if (key === 'preset') {
                    // Radio button - check matching value
                    const radio = form.querySelector<HTMLInputElement>(`input[name="${key}"][type="radio"][value="${value}"]`)
                    if (radio) {
                        radio.checked = true
                    } else if (value === '') {
                        // Check "skip" option if value is empty
                        const skipRadio = form.querySelector<HTMLInputElement>(`input[name="${key}"][type="radio"][value=""]`)
                        if (skipRadio) skipRadio.checked = true
                    }
                }
                else if (key.startsWith('framework_')) {
                    // Framework option checkboxes
                    const checkbox = form.querySelector<HTMLInputElement>(`input[name="${key}"][type="checkbox"]`)
                    if (checkbox) {
                        checkbox.checked = value === true || value === 'true'
                    }
                }
                else if (key === 'framework') {
                    // Framework main checkbox
                    const checkbox = form.querySelector<HTMLInputElement>(`input[name="${key}"][type="checkbox"]`)
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
                    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`input[name="${key}"], textarea[name="${key}"]`)
                    if (input && input.type !== 'hidden') {
                        input.value = String(value || '')
                    }
                }
            })

            // CRITICAL: Clear flag after restore is complete
            // Use setTimeout to ensure all DOM updates are complete
            setTimeout(() => {
                this.isRestoring = false
            }, 100)

            console.log('[FormStateSync] State applied to form')
        }

        /**
         * Sync form to state (form → state)
         * @param {HTMLFormElement} form - Form element
         * @param {boolean} immediate - If true, sync immediately without setTimeout (for navigation)
         */
        syncFormToState(form: HTMLFormElement | null, immediate: boolean = false): void {
            if (!form) return

            const performSync = () => {
                // CRITICAL: Always start with existing state to preserve all selections
                const existingState = stateManager.load()
                const formData = this.collectFormData(form)

                // CRITICAL: Verify that checkbox arrays from other steps are preserved
                const checkboxFields = ['css', 'js', 'agents', 'editors'] as const
                checkboxFields.forEach(key => {
                    const checkboxes = form.querySelectorAll<HTMLInputElement>(`input[name="${key}"][type="checkbox"]`)
                    if (checkboxes.length === 0 && existingState[key] && Array.isArray(existingState[key])) {
                        // Field doesn't exist in current form - ensure it's preserved
                        if (!formData[key] || !Array.isArray(formData[key]) || formData[key].length === 0) {
                            formData[key] = [...existingState[key]] as string[]
                            console.log(`[FormStateSync] Preserved ${key} array from existing state:`, formData[key])
                        }
                    }
                })

                stateManager.update(formData)
                console.log('[FormStateSync] Synced form to state:', {
                    css: formData.css,
                    js: formData.js,
                    agents: formData.agents,
                    editors: formData.editors,
                    projectName: formData.projectName,
                    preset: formData.preset
                })
            }

            if (immediate) {
                // Immediate sync (for navigation) - ensures state is saved before navigation
                performSync()
            } else {
                // Use setTimeout to ensure DOM is updated (for event handlers)
                // This ensures checkbox.checked is updated in DOM before we read it
                setTimeout(() => {
                    performSync()
                }, 0)
            }
        }

        /**
         * Restore state to form (state → form)
         * CRITICAL: Only restores fields that exist on the current step
         * Does not wait for fields that don't exist - that's normal (different steps have different fields)
         * @param {HTMLFormElement} form - Form element
         */
        restoreStateToForm(form: HTMLFormElement | null): void {
            if (!form || form.tagName !== 'FORM') {
                console.warn('[FormStateSync] Invalid form element for restore')
                return
            }

            const state = stateManager.load()

            // Check which checkbox fields exist in the current form
            const checkboxFields = ['css', 'js', 'agents', 'editors']
            const fieldsOnThisStep = checkboxFields.filter(key => {
                const checkboxes = form.querySelectorAll(`input[name="${key}"][type="checkbox"]`)
                return checkboxes.length > 0
            })

            // Apply state to form - applyStateToForm already handles fields that don't exist gracefully
            this.applyStateToForm(form, state)

            console.log('[FormStateSync] Restored state to form', {
                fieldsOnThisStep: fieldsOnThisStep,
                stateFields: {
                    css: state.css,
                    js: state.js,
                    agents: state.agents,
                    editors: state.editors
                }
            })
        }

        /**
         * Setup form event listeners with cleanup tracking
         * @param {HTMLFormElement} form - Form element
         */
        setupFormListeners(form: HTMLFormElement | null): void {
            if (!form || form.tagName !== 'FORM') {
                console.warn('[FormStateSync] Invalid form element')
                return
            }

            // Cleanup existing listeners if any
            this.cleanupFormListeners(form)

            // Create handler functions
            const inputHandler = (e: Event) => {
                // CRITICAL: Don't trigger during programmatic restore
                if (this.isRestoring) {
                    return
                }

                const target = e.target as HTMLInputElement | HTMLTextAreaElement
                if (target.type === 'checkbox' || target.type === 'radio') {
                    // Immediate save for checkboxes/radios
                    // Use setTimeout to ensure checkbox state is updated in DOM
                    // CRITICAL: Small delay ensures DOM is updated before we read it
                    setTimeout(() => {
                        console.log('[FormStateSync] Checkbox/radio changed, syncing state. Checkbox:', target.name, target.value, 'checked:', target.checked)
                        this.syncFormToState(form)
                    }, 10) // Increased from 0 to 10ms for more reliable DOM updates
                } else {
                    // Debounced save for text inputs
                    this.debouncedSync(form)
                }
            }

            const changeHandler = (e: Event) => {
                // CRITICAL: Don't trigger during programmatic restore
                if (this.isRestoring) {
                    return
                }

                const target = e.target as HTMLInputElement | HTMLTextAreaElement
                if (target.type === 'checkbox' || target.type === 'radio') {
                    // Immediate save for checkboxes/radios
                    // Use setTimeout to ensure checkbox state is updated in DOM
                    // CRITICAL: Small delay ensures DOM is updated before we read it
                    setTimeout(() => {
                        console.log('[FormStateSync] Checkbox/radio changed (change event), syncing state. Checkbox:', target.name, target.value, 'checked:', target.checked)
                        this.syncFormToState(form)
                    }, 10) // Increased from 0 to 10ms for more reliable DOM updates
                }
            }

            const submitHandler = (e: Event) => {
                try {
                    // CRITICAL: Don't prevent default - let HTMX handle the submission
                    // We just save state before submission

                    // CRITICAL: Save state immediately before submit to ensure all selections are preserved
                    // Use immediate sync to avoid race conditions
                    const existingState = stateManager.load()
                    this.syncFormToState(form, true) // Immediate sync

                    // CRITICAL: Verify state was saved correctly
                    const savedState = stateManager.load()
                    const checkboxFields = ['css', 'js', 'agents', 'editors'] as const
                    checkboxFields.forEach(key => {
                        const checkboxes = form.querySelectorAll<HTMLInputElement>(`input[name="${key}"][type="checkbox"]`)
                        if (checkboxes.length === 0 && existingState[key] && Array.isArray(existingState[key]) && existingState[key].length > 0) {
                            // Field doesn't exist in current form but exists in state
                            if (!savedState[key] || !Array.isArray(savedState[key]) || savedState[key].length === 0) {
                                console.warn(`[FormStateSync] WARNING: ${key} array was lost during submit! Restoring.`)
                                stateManager.update({ [key]: existingState[key] })
                            }
                        }
                    })

                    // Update current step based on form action
                    // CRITICAL: Route mapping must be setup-type aware
                    if (window.wizardNavigation && window.wizardStateManager) {
                        const formAction = form.getAttribute('hx-post') || ''
                        const state = window.wizardStateManager.load()
                        const setupType = state.setupType || 'simple'

                        // Setup-type aware route mapping
                        let routeToStepMap: Record<string, number> = {}
                        if (setupType === 'simple') {
                            // Simple flow: Project(1) → Editors(2) → Review(3)
                            routeToStepMap = {
                                '/api/setup/step/project': 1,
                                '/api/setup/step/editors': 2,
                                '/api/setup/generate': 3
                            }
                        } else {
                            // Extended flow: Project(1) → Presets(2) → Frontend(3) → Agents(4) → Editors(5) → Advanced(6) → Review(7)
                            routeToStepMap = {
                                '/api/setup/step/project': 1,
                                '/api/setup/step/presets': 2,
                                '/api/setup/step/frontend': 3,
                                '/api/setup/step/agents': 4,
                                '/api/setup/step/editors': 5,
                                '/api/setup/step/advanced': 6,
                                '/api/setup/generate': 7
                            }
                        }

                        for (const [action, stepNum] of Object.entries(routeToStepMap)) {
                            if (formAction.includes(action)) {
                                // Update state with current step before navigation
                                window.wizardStateManager.update({ currentStep: stepNum })
                                console.log('[FormStateSync] Updated current step to', stepNum, 'before form submission (setupType:', setupType, 'action:', action, ')')
                                break
                            }
                        }
                    }
                } catch (error) {
                    // CRITICAL: Don't let errors block form submission
                    console.error('[FormStateSync] Error in submitHandler:', error)
                    // Continue with submission even if state update fails
                }
            }

            // Add listeners
            form.addEventListener('input', inputHandler, { capture: true })
            form.addEventListener('change', changeHandler, { capture: true })

            // CRITICAL: Use capture phase but don't prevent default
            // This allows us to save state before HTMX processes the submission
            form.addEventListener('submit', submitHandler, { capture: true, passive: true })

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
        cleanupFormListeners(form: HTMLFormElement | null): void {
            if (!form) return

            const handlers = this.listeners.get(form)
            if (handlers) {
                // Remove event listeners
                Object.entries(handlers).forEach(([event, handler]) => {
                    form.removeEventListener(event as keyof FormListeners, handler, { capture: true })
                })

                // Remove from map
                this.listeners.delete(form)

                // Clear debounce timer
                const timer = this.debounceTimers.get(form)
                if (timer) {
                    clearTimeout(timer)
                    this.debounceTimers.delete(form)
                }

                // Cleanup HTMX handlers
                if (this.htmxHandlers) {
                    const htmxHandler = this.htmxHandlers.get(form)
                    if (htmxHandler) {
                        document.body.removeEventListener('htmx:beforeRequest', htmxHandler)
                        this.htmxHandlers.delete(form)
                    }
                }

                console.log('[FormStateSync] Form listeners cleaned up')
            }
        }

        /**
         * Debounced sync
         * @param {HTMLFormElement} form - Form element
         * @private
         */
        debouncedSync(form: HTMLFormElement | null): void {
            if (!form) return

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
        cleanupAll(): void {
            this.listeners.forEach((handlers, form) => {
                this.cleanupFormListeners(form)
            })

            // Cleanup all HTMX handlers
            if (this.htmxHandlers) {
                this.htmxHandlers.forEach((handler) => {
                    document.body.removeEventListener('htmx:beforeRequest', handler)
                })
                this.htmxHandlers.clear()
            }
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

