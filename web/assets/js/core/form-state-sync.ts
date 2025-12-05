/**
 * Form State Synchronization
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

    // Constants
    const CHECKBOX_FIELDS = ['css', 'js', 'agents', 'editors'] as const
    const FRAMEWORK_OPTIONS = ['doctrine', 'directives', 'playbooks', 'enhancements'] as const
    const CHECKBOX_SYNC_DELAY = 10 // ms - delay to ensure DOM updates before reading
    const RESTORE_COMPLETE_DELAY = 100 // ms - delay before clearing restore flag
    const DEFAULT_CONTEXT_DIR = '.project'
    const DEFAULT_SETUP_TYPE: 'simple' | 'extended' = 'simple'

    type CheckboxField = typeof CHECKBOX_FIELDS[number]
    type FrameworkOption = typeof FRAMEWORK_OPTIONS[number]

    interface FormListeners {
        input: (e: Event) => void
        change: (e: Event) => void
        submit: (e: Event) => void
    }

    interface RouteToStepMap {
        [route: string]: number
    }

    /**
     * Get route to step mapping based on setup type
     * Uses step-config.ts when available, falls back to hardcoded maps
     */
    function getRouteToStepMap(setupType: 'simple' | 'extended'): RouteToStepMap {
        // Try to use step-config if available
        if (typeof window.getStepDefinitions === 'function') {
            const steps = (window.getStepDefinitions as (type: 'simple' | 'extended' | 'presets') => Array<{ num: number; route: string }>)(setupType)
            const map: RouteToStepMap = {}
            steps.forEach(step => {
                const route = `/api/setup/step/${step.route}`
                map[route] = step.num
            })
            // Add generate route
            const lastStep = steps[steps.length - 1]
            if (lastStep) {
                map['/api/setup/generate'] = lastStep.num
            }
            return map
        }

        // Fallback to hardcoded maps
        if (setupType === 'simple') {
            return {
                '/api/setup/step/project': 1,
                '/api/setup/step/editors': 2,
                '/api/setup/generate': 3
            }
        }

        return {
            '/api/setup/step/project': 1,
            '/api/setup/step/presets': 2,
            '/api/setup/step/frontend': 3,
            '/api/setup/step/agents': 4,
            '/api/setup/step/editors': 5,
            '/api/setup/step/advanced': 6,
            '/api/setup/generate': 7
        }
    }

    /**
     * Check if a checkbox value is valid
     */
    function isValidCheckboxValue(value: string | null | undefined): boolean {
        return Boolean(value && value !== 'false' && value !== '')
    }

    /**
     * Convert form value to boolean
     */
    function toBoolean(value: unknown): boolean {
        return value === 'true' || value === true
    }

    /**
     * Get checkbox values from form
     */
    function getCheckboxValues(
        form: HTMLFormElement,
        fieldName: CheckboxField
    ): string[] {
        const checkboxes = form.querySelectorAll<HTMLInputElement>(
            `input[name="${fieldName}"][type="checkbox"]`
        )
        const values: string[] = []

        checkboxes.forEach(checkbox => {
            if (checkbox.checked && isValidCheckboxValue(checkbox.value)) {
                values.push(checkbox.value)
            }
        })

        return values
    }

    /**
     * Check if field exists in form
     */
    function fieldExistsInForm(
        form: HTMLFormElement,
        fieldName: string
    ): boolean {
        return form.querySelector(
            `input[name="${fieldName}"], textarea[name="${fieldName}"]`
        ) !== null
    }

    /**
     * Form State Sync Class
     */
    class FormStateSync {
        private readonly debounceTimers: Map<HTMLFormElement, ReturnType<typeof setTimeout>>
        private readonly listeners: Map<HTMLFormElement, FormListeners>
        private readonly htmxHandlers: Map<HTMLFormElement, (e: Event) => void>
        private readonly debounceDelay: number
        private isRestoring: boolean

        constructor() {
            this.debounceTimers = new Map()
            this.listeners = new Map()
            this.htmxHandlers = new Map()
            this.debounceDelay = window.WIZARD_CONFIG?.DEBOUNCE_DELAY || 300
            this.isRestoring = false
        }

        /**
         * Collect form data and convert to state format
         * Always merges with existing state to preserve selections from other steps
         */
        collectFormData(form: HTMLFormElement | null): Partial<WizardState> {
            if (!this.isValidForm(form)) {
                return {}
            }

            const existingState = stateManager.load()
            const data: Partial<WizardState> = { ...existingState }

            // Collect checkbox arrays directly from DOM
            this.collectCheckboxFields(form, data, existingState)

            // Process other form fields from FormData
            this.collectFormDataFields(form, data)

            // Remove duplicates from arrays
            this.deduplicateArrays(data)

            return data
        }

        /**
         * Collect checkbox fields from form
         * CRITICAL: Preserves arrays from existing state when field doesn't exist in current form
         */
        private collectCheckboxFields(
            form: HTMLFormElement,
            data: Partial<WizardState>,
            existingState: WizardState
        ): void {
            CHECKBOX_FIELDS.forEach(key => {
                const checkboxes = form.querySelectorAll<HTMLInputElement>(
                    `input[name="${key}"][type="checkbox"]`
                )

                if (checkboxes.length > 0) {
                    // Field exists in form - collect checked values from DOM
                    const checkedValues = getCheckboxValues(form, key)
                    data[key] = checkedValues
                    console.log(`[FormStateSync] Collected ${key} from form:`, checkedValues)
                } else {
                    // Field doesn't exist in form - preserve from existing state
                    if (existingState[key] && Array.isArray(existingState[key]) && existingState[key].length > 0) {
                        data[key] = [...existingState[key]] as string[]
                        console.log(`[FormStateSync] Preserved ${key} from state:`, data[key])
                    } else {
                        // Ensure empty array if not set
                        data[key] = []
                    }
                }
            })
        }

        /**
         * Collect non-checkbox form fields
         */
        private collectFormDataFields(
            form: HTMLFormElement,
            data: Partial<WizardState>
        ): void {
            const formData = new FormData(form)

            for (const [key, value] of formData.entries()) {
                // Skip checkbox fields - already handled
                if (CHECKBOX_FIELDS.includes(key as CheckboxField)) {
                    continue
                }

                // Framework checkboxes (boolean)
                if (key.startsWith('framework_')) {
                    const frameworkKey = key as keyof WizardState
                    data[frameworkKey] = toBoolean(value) as never
                }
                // Framework main checkbox
                else if (key === 'framework') {
                    data.framework = toBoolean(value)
                }
                // Setup type
                else if (key === 'setupType') {
                    data.setupType = (value || DEFAULT_SETUP_TYPE) as 'simple' | 'extended'
                }
                // Preset (radio button)
                else if (key === 'preset') {
                    data.preset = String(value || '')
                }
                // Context directory
                else if (key === 'contextDir') {
                    data.contextDir = String(value || DEFAULT_CONTEXT_DIR)
                }
                // Text fields - only update if field exists in form
                else {
                    if (fieldExistsInForm(form, key)) {
                        (data as Record<string, unknown>)[key] = String(value || '')
                    }
                }
            }
        }

        /**
         * Remove duplicates from array fields
         */
        private deduplicateArrays(data: Partial<WizardState>): void {
            CHECKBOX_FIELDS.forEach(key => {
                const value = data[key]
                if (value && Array.isArray(value)) {
                    data[key] = [...new Set(value)] as string[]
                }
            })
        }

        /**
         * Apply state to form elements
         */
        applyStateToForm(form: HTMLFormElement | null, state: Partial<WizardState>): void {
            if (!this.isValidForm(form)) {
                return
            }

            this.isRestoring = true

            Object.entries(state).forEach(([key, value]) => {
                this.applyFieldToForm(form, key, value)
            })

            // Clear flag after restore is complete
            setTimeout(() => {
                this.isRestoring = false
            }, RESTORE_COMPLETE_DELAY)
        }

        /**
         * Apply a single field to form
         */
        private applyFieldToForm(
            form: HTMLFormElement,
            key: string,
            value: unknown
        ): void {
            if (CHECKBOX_FIELDS.includes(key as CheckboxField)) {
                this.applyCheckboxField(form, key as CheckboxField, value)
            } else if (key === 'preset') {
                this.applyRadioField(form, key, String(value || ''))
            } else if (key.startsWith('framework_')) {
                this.applyFrameworkOption(form, key, value)
            } else if (key === 'framework') {
                this.applyFrameworkMain(form, value)
            } else {
                this.applyTextField(form, key, value)
            }
        }

        /**
         * Apply checkbox field to form
         */
        private applyCheckboxField(
            form: HTMLFormElement,
            key: CheckboxField,
            value: unknown
        ): void {
            const checkboxes = form.querySelectorAll<HTMLInputElement>(
                `input[name="${key}"][type="checkbox"]`
            )
            const values = Array.isArray(value) ? value : []

            checkboxes.forEach(checkbox => {
                checkbox.checked = values.includes(checkbox.value)
            })
        }

        /**
         * Apply radio field to form
         */
        private applyRadioField(
            form: HTMLFormElement,
            key: string,
            value: string
        ): void {
            const radio = form.querySelector<HTMLInputElement>(
                `input[name="${key}"][type="radio"][value="${value}"]`
            )
            if (radio) {
                radio.checked = true
            } else if (value === '') {
                // Check "skip" option if value is empty
                const skipRadio = form.querySelector<HTMLInputElement>(
                    `input[name="${key}"][type="radio"][value=""]`
                )
                if (skipRadio) {
                    skipRadio.checked = true
                }
            }
        }

        /**
         * Apply framework option checkbox
         */
        private applyFrameworkOption(
            form: HTMLFormElement,
            key: string,
            value: unknown
        ): void {
            const checkbox = form.querySelector<HTMLInputElement>(
                `input[name="${key}"][type="checkbox"]`
            )
            if (checkbox) {
                checkbox.checked = toBoolean(value)
            }
        }

        /**
         * Apply framework main checkbox
         */
        private applyFrameworkMain(
            form: HTMLFormElement,
            value: unknown
        ): void {
            const checkbox = form.querySelector<HTMLInputElement>(
                'input[name="framework"][type="checkbox"]'
            )
            if (checkbox) {
                checkbox.checked = toBoolean(value)
                // Trigger visibility update if function exists
                if (checkbox.checked && typeof window.updateFrameworkVisibility === 'function') {
                    window.updateFrameworkVisibility()
                }
            }
        }

        /**
         * Apply text field to form
         */
        private applyTextField(
            form: HTMLFormElement,
            key: string,
            value: unknown
        ): void {
            const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
                `input[name="${key}"], textarea[name="${key}"]`
            )
            if (input && input.type !== 'hidden') {
                input.value = String(value || '')
            }
        }

        /**
         * Sync form to state (form → state)
         */
        syncFormToState(form: HTMLFormElement | null, immediate: boolean = false): void {
            if (!form) return

            const performSync = () => {
                const existingState = stateManager.load()
                const formData = this.collectFormData(form)

                // Verify that checkbox arrays from other steps are preserved
                this.preserveCheckboxArrays(form, formData, existingState)

                stateManager.update(formData)
            }

            if (immediate) {
                performSync()
            } else {
                // Use setTimeout to ensure DOM is updated
                setTimeout(performSync, 0)
            }
        }

        /**
         * Preserve checkbox arrays from other steps
         */
        private preserveCheckboxArrays(
            form: HTMLFormElement,
            formData: Partial<WizardState>,
            existingState: WizardState
        ): void {
            CHECKBOX_FIELDS.forEach(key => {
                const checkboxes = form.querySelectorAll<HTMLInputElement>(
                    `input[name="${key}"][type="checkbox"]`
                )

                if (
                    checkboxes.length === 0 &&
                    existingState[key] &&
                    Array.isArray(existingState[key]) &&
                    existingState[key].length > 0
                ) {
                    // Field doesn't exist in current form - ensure it's preserved
                    if (
                        !formData[key] ||
                        !Array.isArray(formData[key]) ||
                        formData[key].length === 0
                    ) {
                        formData[key] = [...existingState[key]] as string[]
                    }
                }
            })
        }

        /**
         * Restore state to form (state → form)
         */
        restoreStateToForm(form: HTMLFormElement | null): void {
            if (!this.isValidForm(form)) {
                return
            }

            const state = stateManager.load()
            this.applyStateToForm(form, state)
        }

        /**
         * Setup form event listeners with cleanup tracking
         */
        setupFormListeners(form: HTMLFormElement | null): void {
            if (!this.isValidForm(form)) {
                return
            }

            // Cleanup existing listeners if any
            this.cleanupFormListeners(form)

            const inputHandler = this.createInputHandler(form)
            const changeHandler = this.createChangeHandler(form)
            const submitHandler = this.createSubmitHandler(form)

            // Add listeners
            form.addEventListener('input', inputHandler, { capture: true })
            form.addEventListener('change', changeHandler, { capture: true })
            form.addEventListener('submit', submitHandler, { capture: true, passive: true })

            // Store handlers for cleanup
            this.listeners.set(form, {
                input: inputHandler,
                change: changeHandler,
                submit: submitHandler
            })
        }

        /**
         * Create input event handler
         */
        private createInputHandler(form: HTMLFormElement): (e: Event) => void {
            return (e: Event) => {
                if (this.isRestoring) return

                const target = e.target as HTMLInputElement | HTMLTextAreaElement
                if (target.type === 'checkbox' || target.type === 'radio') {
                    // Immediate save for checkboxes/radios
                    setTimeout(() => {
                        this.syncFormToState(form)
                    }, CHECKBOX_SYNC_DELAY)
                } else {
                    // Debounced save for text inputs
                    this.debouncedSync(form)
                }
            }
        }

        /**
         * Create change event handler
         */
        private createChangeHandler(form: HTMLFormElement): (e: Event) => void {
            return (e: Event) => {
                if (this.isRestoring) return

                const target = e.target as HTMLInputElement | HTMLTextAreaElement
                if (target.type === 'checkbox' || target.type === 'radio') {
                    setTimeout(() => {
                        this.syncFormToState(form)
                    }, CHECKBOX_SYNC_DELAY)
                }
            }
        }

        /**
         * Create submit event handler
         */
        private createSubmitHandler(form: HTMLFormElement): (e: Event) => void {
            return (e: Event) => {
                try {
                    // Save state immediately before submit
                    const existingState = stateManager.load()
                    this.syncFormToState(form, true)

                    // Verify state was saved correctly
                    this.verifyStatePreservation(form, existingState)

                    // Update current step based on form action
                    this.updateCurrentStep(form)
                } catch (error) {
                    // Don't let errors block form submission
                    console.error('[FormStateSync] Error in submitHandler:', error)
                }
            }
        }

        /**
         * Verify that state was preserved correctly
         */
        private verifyStatePreservation(
            form: HTMLFormElement,
            existingState: WizardState
        ): void {
            const savedState = stateManager.load()

            CHECKBOX_FIELDS.forEach(key => {
                const checkboxes = form.querySelectorAll<HTMLInputElement>(
                    `input[name="${key}"][type="checkbox"]`
                )

                if (
                    checkboxes.length === 0 &&
                    existingState[key] &&
                    Array.isArray(existingState[key]) &&
                    existingState[key].length > 0
                ) {
                    // Field doesn't exist in current form but exists in state
                    if (
                        !savedState[key] ||
                        !Array.isArray(savedState[key]) ||
                        savedState[key].length === 0
                    ) {
                        console.warn(
                            `[FormStateSync] ${key} array was lost during submit! Restoring.`
                        )
                        stateManager.update({ [key]: existingState[key] })
                    }
                }
            })
        }

        /**
         * Update current step based on form action
         */
        private updateCurrentStep(form: HTMLFormElement): void {
            if (!window.wizardNavigation || !window.wizardStateManager) {
                return
            }

            const formAction = form.getAttribute('hx-post') || ''
            const state = window.wizardStateManager.load()
            const setupType = state.setupType || DEFAULT_SETUP_TYPE
            const routeToStepMap = getRouteToStepMap(setupType)

            for (const [action, stepNum] of Object.entries(routeToStepMap)) {
                if (formAction.includes(action)) {
                    window.wizardStateManager.update({ currentStep: stepNum })
                    break
                }
            }
        }

        /**
         * Cleanup form event listeners
         */
        cleanupFormListeners(form: HTMLFormElement | null): void {
            if (!form) return

            const handlers = this.listeners.get(form)
            if (!handlers) return

            // Remove event listeners
            Object.entries(handlers).forEach(([event, handler]) => {
                form.removeEventListener(
                    event as keyof FormListeners,
                    handler,
                    { capture: true }
                )
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
            const htmxHandler = this.htmxHandlers.get(form)
            if (htmxHandler) {
                document.body.removeEventListener('htmx:beforeRequest', htmxHandler)
                this.htmxHandlers.delete(form)
            }
        }

        /**
         * Debounced sync
         */
        private debouncedSync(form: HTMLFormElement | null): void {
            if (!form) return

            const timer = this.debounceTimers.get(form)
            if (timer) {
                clearTimeout(timer)
            }

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
            this.htmxHandlers.forEach((handler) => {
                document.body.removeEventListener('htmx:beforeRequest', handler)
            })
            this.htmxHandlers.clear()
        }

        /**
         * Validate form element
         */
        private isValidForm(form: HTMLFormElement | null): form is HTMLFormElement {
            return Boolean(form && form.tagName === 'FORM')
        }
    }

    // Create singleton instance
    window.FormStateSync = FormStateSync
    window.formStateSync = new FormStateSync()

    // Backward compatibility: Export legacy function names
    window.restoreFormSelections = function() {
        const form = document.querySelector<HTMLFormElement>('form')
        if (form && window.formStateSync) {
            window.formStateSync.restoreStateToForm(form)
        }
    }

    window.syncAndRestoreState = async function() {
        const form = document.querySelector<HTMLFormElement>('form')
        if (form && window.formStateSync) {
            window.formStateSync.syncFormToState(form, true)
            window.formStateSync.restoreStateToForm(form)
        }
    }

    window.waitForCheckboxes = function(
        form: HTMLFormElement,
        fieldNames: string[],
        timeout: number = 5000
    ): Promise<{ found: boolean; availableFields: string[] }> {
        return new Promise((resolve) => {
            const startTime = Date.now()
            const checkInterval = 100

            const check = () => {
                const availableFields: string[] = []
                fieldNames.forEach(fieldName => {
                    const checkboxes = form.querySelectorAll(
                        `input[name="${fieldName}"][type="checkbox"]`
                    )
                    if (checkboxes.length > 0) {
                        availableFields.push(fieldName)
                    }
                })

                if (availableFields.length > 0) {
                    resolve({ found: true, availableFields })
                    return
                }

                const elapsed = Date.now() - startTime
                if (elapsed >= timeout) {
                    resolve({ found: false, availableFields: [] })
                    return
                }

                setTimeout(check, checkInterval)
            }

            check()
        })
    }

    // Additional backward compatibility helpers
    window.restoreProjectField = function(
        input: HTMLInputElement | null,
        stateValue: string | null,
        defaultValue: string
    ): void {
        if (!input || !stateValue) return
        const normalizedValue = (stateValue || '').trim()
        if (normalizedValue && normalizedValue !== defaultValue) {
            input.value = normalizedValue
        }
    }

    window.restoreCheckboxField = function(
        form: HTMLFormElement,
        fieldName: string,
        stateValues: string[]
    ): boolean {
        if (!stateValues || !Array.isArray(stateValues) || stateValues.length === 0) {
            return true
        }
        const checkboxes = form.querySelectorAll<HTMLInputElement>(
            `input[name="${fieldName}"][type="checkbox"]`
        )
        let restoredCount = 0
        stateValues.forEach(value => {
            const checkbox = Array.from(checkboxes).find(cb => cb.value === value)
            if (checkbox) {
                checkbox.checked = true
                restoredCount++
            }
        })
        return restoredCount === stateValues.length
    }

    window.restoreRadioField = function(
        form: HTMLFormElement,
        fieldName: string,
        stateValue: string
    ): void {
        if (stateValue === undefined && stateValue !== '') return
        const radio = form.querySelector<HTMLInputElement>(
            `input[name="${fieldName}"][type="radio"][value="${stateValue}"]`
        )
        if (radio) {
            radio.checked = true
        }
    }

    window.restoreFrameworkOptions = function(
        form: HTMLFormElement,
        state: Partial<WizardState>
    ): void {
        if (!toBoolean(state.framework)) return

        const frameworkCheckbox = form.querySelector<HTMLInputElement>(
            'input[name="framework"]:not([type="hidden"])'
        )
        if (frameworkCheckbox) {
            frameworkCheckbox.checked = true
            if (typeof window.updateFrameworkVisibility === 'function') {
                window.updateFrameworkVisibility()
            }
        }

        FRAMEWORK_OPTIONS.forEach(option => {
            const key = `framework_${option}` as keyof WizardState
            if (toBoolean(state[key])) {
                const checkbox = form.querySelector<HTMLInputElement>(
                    `input[name="framework_${option}"]:not([type="hidden"])`
                )
                if (checkbox) {
                    checkbox.checked = true
                }
            }
        })
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (window.formStateSync) {
            window.formStateSync.cleanupAll()
        }
    })
})()
